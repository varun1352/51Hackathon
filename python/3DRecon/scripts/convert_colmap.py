#!/usr/bin/env python3
"""
Script to convert COLMAP output to the format required by 3D Gaussian Splatting.
"""

import os
import sys
import yaml
import argparse
import numpy as np
import json
from pathlib import Path
import struct
import collections
import shutil

CameraModel = collections.namedtuple(
    "CameraModel", ["model_id", "model_name", "num_params"]
)

# From COLMAP: src/base/camera_models.h
CAMERA_MODELS = {
    "SIMPLE_PINHOLE": CameraModel(0, "SIMPLE_PINHOLE", 3),
    "PINHOLE": CameraModel(1, "PINHOLE", 4),
    "SIMPLE_RADIAL": CameraModel(2, "SIMPLE_RADIAL", 4),
    "RADIAL": CameraModel(3, "RADIAL", 5),
    "OPENCV": CameraModel(4, "OPENCV", 8),
    "OPENCV_FISHEYE": CameraModel(5, "OPENCV_FISHEYE", 8),
    "FULL_OPENCV": CameraModel(6, "FULL_OPENCV", 12),
    "FOV": CameraModel(7, "FOV", 5),
    "SIMPLE_RADIAL_FISHEYE": CameraModel(8, "SIMPLE_RADIAL_FISHEYE", 4),
    "RADIAL_FISHEYE": CameraModel(9, "RADIAL_FISHEYE", 5),
    "THIN_PRISM_FISHEYE": CameraModel(10, "THIN_PRISM_FISHEYE", 12),
}

CAMERA_MODEL_IDS = {v.model_id: v for v in CAMERA_MODELS.values()}

def read_cameras_binary(path_to_model_file):
    """
    Read camera parameters from colmap binary file.
    """
    cameras = {}
    with open(path_to_model_file, "rb") as fid:
        num_cameras = struct.unpack("<Q", fid.read(8))[0]
        for _ in range(num_cameras):
            camera_id = struct.unpack("<i", fid.read(4))[0]
            model_id = struct.unpack("<i", fid.read(4))[0]
            width = struct.unpack("<Q", fid.read(8))[0]
            height = struct.unpack("<Q", fid.read(8))[0]
            
            num_params = CAMERA_MODEL_IDS[model_id].num_params
            params = struct.unpack(f"<{num_params}d", fid.read(8 * num_params))
            
            cameras[camera_id] = {
                "id": camera_id,
                "model": CAMERA_MODEL_IDS[model_id].model_name,
                "width": width,
                "height": height,
                "params": list(params),
            }
    return cameras

def read_images_binary(path_to_model_file):
    """
    Read image parameters from colmap binary file.
    """
    images = {}
    with open(path_to_model_file, "rb") as fid:
        num_images = struct.unpack("<Q", fid.read(8))[0]
        for _ in range(num_images):
            image_id = struct.unpack("<i", fid.read(4))[0]
            qvec = struct.unpack("<4d", fid.read(32))
            tvec = struct.unpack("<3d", fid.read(24))
            camera_id = struct.unpack("<i", fid.read(4))[0]
            
            image_name = ""
            char = struct.unpack("<c", fid.read(1))[0]
            while char != b"\x00":
                image_name += char.decode("utf-8")
                char = struct.unpack("<c", fid.read(1))[0]
            
            num_points2D = struct.unpack("<Q", fid.read(8))[0]
            
            points2D = []
            for __ in range(num_points2D):
                x, y, point3D_id = struct.unpack("<ddi", fid.read(20))
                points2D.append((x, y, point3D_id))
                
            images[image_id] = {
                "id": image_id,
                "qvec": qvec,
                "tvec": tvec,
                "camera_id": camera_id,
                "name": image_name,
                "points2D": points2D,
            }
    return images

def read_points3D_binary(path_to_model_file):
    """
    Read 3D points from colmap binary file.
    """
    points3D = {}
    with open(path_to_model_file, "rb") as fid:
        num_points = struct.unpack("<Q", fid.read(8))[0]
        for _ in range(num_points):
            point_id = struct.unpack("<Q", fid.read(8))[0]
            xyz = struct.unpack("<3d", fid.read(24))
            rgb = struct.unpack("<3B", fid.read(3))
            error = struct.unpack("<d", fid.read(8))[0]
            
            track_length = struct.unpack("<Q", fid.read(8))[0]
            track = []
            for __ in range(track_length):
                image_id, point2D_idx = struct.unpack("<ii", fid.read(8))
                track.append((image_id, point2D_idx))
                
            points3D[point_id] = {
                "id": point_id,
                "xyz": xyz,
                "rgb": rgb,
                "error": error,
                "track": track,
            }
    return points3D

def qvec_to_rotmat(qvec):
    """Convert quaternion to rotation matrix."""
    w, x, y, z = qvec
    R = np.array([
        [1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w],
        [2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w],
        [2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y]
    ])
    return R

def create_3dgs_transforms_json(colmap_path, output_path, images_dir):
    """
    Generate a transforms.json file from COLMAP outputs compatible with 3DGS training.
    """
    cameras = read_cameras_binary(os.path.join(colmap_path, "cameras.bin"))
    images = read_images_binary(os.path.join(colmap_path, "images.bin"))
    
    frames = []
    for img_id, img in images.items():
        # Get camera info
        camera = cameras[img['camera_id']]
        
        # Extract intrinsics based on camera model
        if camera['model'] == 'PINHOLE':
            fx, fy, cx, cy = camera['params']
            fl_x = fx
            fl_y = fy
        elif camera['model'] == 'SIMPLE_PINHOLE':
            f, cx, cy = camera['params']
            fl_x = f
            fl_y = f
        else:
            print(f"Warning: Camera model {camera['model']} not fully supported. Using approximation.")
            # For other models, just use the first parameter as focal length
            fl_x = camera['params'][0]
            fl_y = camera['params'][0]
            cx = camera['width'] / 2
            cy = camera['height'] / 2
        
        # Convert quaternion to rotation matrix
        R = qvec_to_rotmat(img['qvec'])
        t = np.array(img['tvec'])
        
        # Convert COLMAP's camera coordinate system to 3DGS's expected format
        # COLMAP: +z forward, +y down, +x right
        # 3DGS: -z forward, +y up, +x right
        # This requires rotation around x-axis by 180 degrees
        R_adjust = np.array([
            [1, 0, 0],
            [0, -1, 0],
            [0, 0, -1]
        ])
        R = R @ R_adjust
        
        # Get image path
        img_name = img['name']
        img_path = os.path.join(images_dir, img_name)
        
        # Create frame entry
        frame = {
            "file_path": img_path,
            "transform_matrix": np.eye(4).tolist(),  # Will be filled below
            "colmap_im_id": img_id,
        }
        
        # Convert to 4x4 transform matrix
        transform = np.eye(4)
        transform[:3, :3] = R
        transform[:3, 3] = t
        frame["transform_matrix"] = transform.tolist()
        
        # Add camera intrinsics
        frame["fl_x"] = fl_x
        frame["fl_y"] = fl_y
        frame["cx"] = cx
        frame["cy"] = cy
        frame["w"] = camera['width']
        frame["h"] = camera['height']
        
        frames.append(frame)
    
    # Create transforms.json structure
    transforms = {
        "frames": frames,
        "camera_model": "PINHOLE",
    }
    
    # Write transforms.json
    with open(output_path, 'w') as f:
        json.dump(transforms, f, indent=2)
    
    return True

def convert_colmap_to_3dgs(config):
    """Convert COLMAP output to 3DGS format."""
    # Extract configuration
    paths = config['paths']
    
    # Create output directory
    os.makedirs(paths['gaussian_dir'], exist_ok=True)
    
    # Define paths
    colmap_model_path = os.path.join(paths['colmap_dir'], 'dense', '0')
    transforms_json_path = os.path.join(paths['gaussian_dir'], 'transforms.json')
    
    # Create transforms.json for 3DGS
    success = create_3dgs_transforms_json(
        colmap_model_path, 
        transforms_json_path,
        paths['input_images_dir']
    )
    
    if not success:
        print("Failed to convert COLMAP output to 3DGS format.")
        return False
    
    # Copy point cloud for visualization (optional)
    try:
        points3D = read_points3D_binary(os.path.join(colmap_model_path, "points3D.bin"))
        
        # Create a simple PLY file with points for visualization
        with open(os.path.join(paths['gaussian_dir'], 'colmap_points.ply'), 'w') as f:
            # Write PLY header
            f.write("ply\n")
            f.write("format ascii 1.0\n")
            f.write(f"element vertex {len(points3D)}\n")
            f.write("property float x\n")
            f.write("property float y\n")
            f.write("property float z\n")
            f.write("property uchar red\n")
            f.write("property uchar green\n")
            f.write("property uchar blue\n")
            f.write("end_header\n")
            
            # Write vertices
            for point_id, point in points3D.items():
                x, y, z = point['xyz']
                r, g, b = point['rgb']
                f.write(f"{x} {y} {z} {r} {g} {b}\n")
    except Exception as e:
        print(f"Warning: Failed to create visualization point cloud: {e}")
    
    print("COLMAP to 3DGS conversion completed successfully.")
    return True

def main():
    parser = argparse.ArgumentParser(description='Convert COLMAP output to 3DGS format')
    parser.add_argument('-c', '--config', type=str, default='config/pipeline_config.yaml',
                        help='Path to configuration YAML file')
    args = parser.parse_args()
    
    # Load configuration
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)
    
    # Run conversion
    success = convert_colmap_to_3dgs(config)
    
    if success:
        print("Conversion completed successfully")
        return 0
    else:
        print("Conversion failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())