#!/usr/bin/env python3
"""
Extract a "concave boundary" around a 3D scene by:
  1. (Optional) Slicing at a wall height
  2. Projecting to a 2D grid
  3. Filling / morphological operations
  4. Extracting the largest contour
  5. Simplifying and snapping the contour to yield straight (axis-aligned) segments
  6. Exporting a DXF with dimension annotations

Handles very large point clouds by optional downsampling.

Usage:
  python extract_concave_boundary.py input.ply output_dir
    [--use-wall-slice] [--wall-height WALL_H] [--slice-thickness THICK]
    [--grid-size GRID] [--voxel-size VOX] [--no-simplify]
"""

import os
import sys
import argparse
import numpy as np
import open3d as o3d
import matplotlib.pyplot as plt
from pathlib import Path

from scipy.ndimage import (
    binary_dilation,
    binary_erosion,
    binary_closing,
    gaussian_filter
)

try:
    import ezdxf
except ImportError:
    ezdxf = None
    print("Warning: ezdxf not installed. DXF output will be skipped.")

try:
    from skimage import measure
except ImportError:
    measure = None
    print("Warning: scikit-image not installed. Contour extraction will be skipped.")

try:
    from shapely.geometry import Polygon
except ImportError:
    Polygon = None
    print("Warning: shapely not installed. Contour simplification will be skipped.")

def snap_to_axis(coords, angle_threshold_deg=10):
    """
    Snap nearly horizontal or vertical segments to be exactly axis-aligned.
    
    Args:
        coords (np.array): Nx2 array of (x,y) coordinates.
        angle_threshold_deg (float): Angle threshold (in degrees) for snapping.
    Returns:
        np.array: The snapped coordinate array.
    """
    snapped = [coords[0]]
    for pt in coords[1:]:
        prev = snapped[-1]
        dx = pt[0] - prev[0]
        dy = pt[1] - prev[1]
        if dx == 0 and dy == 0:
            snapped.append(pt)
            continue
        angle = np.degrees(np.arctan2(dy, dx))
        # Near horizontal: angle near 0 or 180 degrees
        if abs(angle) < angle_threshold_deg or abs(angle) > (180 - angle_threshold_deg):
            # Snap to horizontal: set y equal to previous
            pt = (pt[0], prev[1])
        # Near vertical: angle near 90 or -90 degrees
        elif abs(abs(angle) - 90) < angle_threshold_deg:
            # Snap to vertical: set x equal to previous
            pt = (prev[0], pt[1])
        snapped.append(pt)
    return np.array(snapped)

def extract_concave_boundary(input_file,
                             output_dir,
                             use_wall_slice=False,
                             wall_height=None,
                             wall_offset=1.2,
                             slice_thickness=0.1,
                             grid_size=0.05,
                             voxel_size=0.02,
                             no_simplify=False):
    """
    Args:
        input_file (str): Path to input PLY file.
        output_dir (str): Directory to save results.
        use_wall_slice (bool): Whether to slice at a certain wall height.
        wall_height (float): If provided, use this exact height for the slice.
                             If None and use_wall_slice=True, auto-detect floor and set height = floor + wall_offset.
        wall_offset (float): The offset above the floor if auto-detecting wall height.
        slice_thickness (float): Thickness of the wall slice in meters.
        grid_size (float): 2D grid resolution (meters).
        voxel_size (float): Downsampling voxel size (meters). If 0 or None, skip downsampling.
        no_simplify (bool): If True, skip shapely simplification of the contour.
    """
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    print(f"Loading point cloud from: {input_file}")
    pcd = o3d.io.read_point_cloud(input_file)
    if not pcd or not pcd.has_points():
        print("Error: Point cloud is empty or invalid.")
        return False

    # Optional: Downsample if voxel_size > 0
    n_pts_before = len(pcd.points)
    if voxel_size and voxel_size > 0:
        print(f"Downsampling from {n_pts_before} points using voxel size = {voxel_size}...")
        pcd = pcd.voxel_down_sample(voxel_size=voxel_size)
        n_pts_after = len(pcd.points)
        print(f"Downsampled to {n_pts_after} points.")
    else:
        print("Skipping downsampling...")

    points = np.asarray(pcd.points)
    if len(points) < 3:
        print("Not enough points to form a boundary.")
        return False

    # If slicing at wall height
    if use_wall_slice:
        print("Using wall slice approach.")
        if wall_height is None:
            z_vals = points[:, 2]
            sorted_z = np.sort(z_vals)
            floor_approx = np.mean(sorted_z[: int(len(sorted_z)*0.1)])
            wall_height = floor_approx + wall_offset
            print(f"Detected floor ~ {floor_approx:.3f}m; using wall_height = {wall_height:.3f}m")
        else:
            print(f"Using specified wall_height = {wall_height:.3f}m")
        half_thick = slice_thickness / 2.0
        mask = (points[:, 2] >= (wall_height - half_thick)) & \
               (points[:, 2] <= (wall_height + half_thick))
        slice_points = points[mask]
        if len(slice_points) < 3:
            print("Warning: Not enough points in the wall slice. No boundary created.")
            return False
        points_2d = slice_points[:, :2]
        print(f"Wall slice: {len(slice_points)} points selected.")
    else:
        print("Using all points projected to XY.")
        points_2d = points[:, :2]

    # Create a 2D occupancy grid
    min_x, max_x = np.min(points_2d[:,0]), np.max(points_2d[:,0])
    min_y, max_y = np.min(points_2d[:,1]), np.max(points_2d[:,1])
    padding = 0.05 * max(max_x - min_x, max_y - min_y)
    min_x -= padding
    max_x += padding
    min_y -= padding
    max_y += padding

    width = int((max_x - min_x) / grid_size) + 1
    height = int((max_y - min_y) / grid_size) + 1
    print(f"Creating grid of size {width} x {height} at {grid_size} m resolution.")

    grid = np.zeros((height, width), dtype=np.uint8)
    for pt in points_2d:
        gx = int((pt[0] - min_x) / grid_size)
        gy = int((pt[1] - min_y) / grid_size)
        if 0 <= gx < width and 0 <= gy < height:
            grid[gy, gx] = 1

    # Save raw grid image
    plt.figure(figsize=(10,10))
    plt.imshow(grid, origin='lower', extent=[min_x, max_x, min_y, max_y], cmap='gray')
    plt.title("Raw Occupancy Grid")
    plt.xlabel("X (m)")
    plt.ylabel("Y (m)")
    plt.axis('equal')
    raw_grid_path = out_path / "raw_grid.png"
    plt.savefig(raw_grid_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"Saved raw grid image to {raw_grid_path}")

    # Morphological cleanup
    grid_dil = binary_dilation(grid, iterations=2)
    grid_ero = binary_erosion(grid_dil, iterations=1)
    grid_close = binary_closing(grid_ero, iterations=2)
    grid_blur = gaussian_filter(grid_close.astype(float), sigma=1)
    grid_binary = (grid_blur > 0.5).astype(np.uint8)

    plt.figure(figsize=(10,10))
    plt.imshow(grid_binary, origin='lower', extent=[min_x, max_x, min_y, max_y], cmap='gray')
    plt.title("Cleaned Occupancy Grid")
    plt.xlabel("X (m)")
    plt.ylabel("Y (m)")
    plt.axis('equal')
    clean_grid_path = out_path / "clean_grid.png"
    plt.savefig(clean_grid_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"Saved cleaned grid image to {clean_grid_path}")

    # Extract contours using scikit-image
    if measure is None:
        print("scikit-image not installed, skipping contour extraction.")
        return True

    contours = measure.find_contours(grid_binary, 0.5)
    if not contours:
        print("No contours found. Exiting.")
        return True

    # Convert contours from grid to world coordinates
    polygons = []
    for c in contours:
        # c: (row, col) => (y, x)
        c_x = c[:, 1] * grid_size + min_x
        c_y = c[:, 0] * grid_size + min_y
        poly_pts = np.column_stack((c_x, c_y))
        polygons.append(poly_pts)

    # Select the largest contour by area (using shapely if available)
    largest_area = -1
    largest_poly = None
    for poly_pts in polygons:
        if len(poly_pts) < 3:
            continue
        if Polygon is not None:
            shapely_poly = Polygon(poly_pts)
            area = shapely_poly.area
        else:
            min_px, max_px = np.min(poly_pts[:,0]), np.max(poly_pts[:,0])
            min_py, max_py = np.min(poly_pts[:,1]), np.max(poly_pts[:,1])
            area = (max_px - min_px) * (max_py - min_py)
        if area > largest_area:
            largest_area = area
            largest_poly = poly_pts

    if largest_poly is None or len(largest_poly) < 3:
        print("No valid large contour found. Exiting.")
        return True

    # Simplify the largest contour to remove noise and straighten edges
    if (Polygon is not None) and (not no_simplify):
        shapely_contour = Polygon(largest_poly)
        tolerance = 0.1  # Increased tolerance for stronger simplification (adjust as needed)
        shapely_simpl = shapely_contour.simplify(tolerance, preserve_topology=True)
        final_coords = np.array(shapely_simpl.exterior.coords)
        print(f"Simplified contour from {len(largest_poly)} to {len(final_coords)} points.")
    else:
        final_coords = largest_poly
        if not np.allclose(final_coords[0], final_coords[-1]):
            final_coords = np.vstack([final_coords, final_coords[0]])
        print(f"Using largest contour with {len(final_coords)} points.")

    # Snap nearly horizontal/vertical segments to be exactly aligned
    final_coords = snap_to_axis(final_coords, angle_threshold_deg=10)
    if not np.allclose(final_coords[0], final_coords[-1]):
        final_coords = np.vstack([final_coords, final_coords[0]])

    # Plot the final boundary
    plt.figure(figsize=(10,10))
    plt.imshow(grid_binary, origin='lower', extent=[min_x, max_x, min_y, max_y],
               cmap='gray', alpha=0.5)
    plt.plot(final_coords[:, 0], final_coords[:, 1], 'r-', lw=2)
    plt.scatter(final_coords[:, 0], final_coords[:, 1], c='r', s=10)
    plt.title("Final Outer Boundary")
    plt.xlabel("X (m)")
    plt.ylabel("Y (m)")
    plt.axis('equal')
    boundary_path = out_path / "final_boundary.png"
    plt.savefig(boundary_path, dpi=150, bbox_inches='tight')
    plt.close()
    print(f"Saved final boundary to {boundary_path}")

    # Export DXF if ezdxf is available
    if ezdxf is None:
        print("ezdxf not installed. Skipping DXF export.")
        return True

    try:
        doc = ezdxf.new('R2010')
        msp = doc.modelspace()
        boundary_list = final_coords.tolist()
        if not np.allclose(boundary_list[0], boundary_list[-1]):
            boundary_list.append(boundary_list[0])
        msp.add_lwpolyline(boundary_list, close=True, dxfattribs={'layer': 'BOUNDARY'})

        doc.layers.add(name='DIMENSIONS', color=ezdxf.colors.CYAN)
        dim_offset = 0.3
        for i in range(len(boundary_list) - 1):
            p1 = boundary_list[i]
            p2 = boundary_list[i+1]
            seg_len = np.linalg.norm(np.array(p2) - np.array(p1))
            if seg_len < 0.2:
                continue
            try:
                dim = msp.add_aligned_dim(p1=p1, p2=p2, distance=dim_offset,
                                          dxfattribs={'layer': 'DIMENSIONS'})
                dim.render()
            except Exception as e:
                print(f"Could not add dimension for segment {i}: {e}")
        dxf_out = out_path / "outer_boundary.dxf"
        doc.saveas(dxf_out)
        print(f"DXF saved to {dxf_out}")
    except Exception as e:
        print(f"Error creating DXF: {e}")

    print("Done.")
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Extract a concave-like boundary from a large point cloud and generate a clean, straightened floorplan boundary."
    )
    parser.add_argument("input", help="Path to input PLY file.")
    parser.add_argument("output", help="Output directory.")
    parser.add_argument("--use-wall-slice", action="store_true",
                        help="If set, slice the point cloud at a wall height rather than using all points.")
    parser.add_argument("--wall-height", type=float, default=None,
                        help="Exact wall height to slice. If not set, auto-detect floor + wall_offset.")
    parser.add_argument("--wall-offset", type=float, default=1.2,
                        help="Meters above floor for auto-detected wall slice.")
    parser.add_argument("--slice-thickness", type=float, default=4,
                        help="Thickness of the wall slice in meters.")
    parser.add_argument("--grid-size", type=float, default=0.2,
                        help="Resolution of the 2D grid (m).")
    parser.add_argument("--voxel-size", type=float, default=0.01,
                        help="Voxel downsample size (m). Set 0 to disable.")
    parser.add_argument("--no-simplify", action="store_true",
                        help="If set, do not simplify the extracted boundary with Shapely.")
    args = parser.parse_args()

    extract_concave_boundary(
        input_file=args.input,
        output_dir=args.output,
        use_wall_slice=args.use_wall_slice,
        wall_height=args.wall_height,
        wall_offset=args.wall_offset,
        slice_thickness=args.slice_thickness,
        grid_size=args.grid_size,
        voxel_size=args.voxel_size,
        no_simplify=args.no_simplify
    )

if __name__ == "__main__":
    main()
