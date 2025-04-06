#!/usr/bin/env python3
"""
Extract a wall-based floorplan (without simplification) from a 3D point cloud PLY file,
vectorize it into polylines, and output a DXF with annotated wall lengths.
Focus on tuning parameters to get a good intermediate grid image.
"""

import os
import sys
import numpy as np
import open3d as o3d
import matplotlib.pyplot as plt
from pathlib import Path
import argparse
from scipy.ndimage import binary_dilation, binary_erosion, binary_closing, gaussian_filter

# Attempt to import optional dependencies
try:
    from skimage import measure
    skimage_available = True
except ImportError:
    skimage_available = False
    print("Warning: scikit-image not found. Contour extraction will be skipped.")

try:
    import ezdxf
    ezdxf_available = True
except ImportError:
    ezdxf_available = False
    print("Warning: ezdxf not found. DXF output will be skipped.")


def extract_wall_floorplan_basic(input_file, output_dir, wall_height=None, slice_thickness=0.1,
                                 grid_size=0.05, auto_height_offset=1.2,
                                 min_contour_length=10, dim_min_length=0.5):
    """
    Extracts, processes, vectorizes (no simplify), and exports a floorplan.
    Focus on tuning slice height and internal image processing parameters.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"Loading point cloud from {input_file}...")
    try:
        pcd = o3d.io.read_point_cloud(input_file)
        if not pcd.has_points():
            print("Error: Point cloud is empty.")
            return False
        points = np.asarray(pcd.points)
    except Exception as e:
        print(f"Error loading point cloud: {e}")
        return False
    print(f"Loaded {len(points)} points.")

    floor_height = None
    if wall_height is None:
        print("Auto-detecting floor height...")
        heights = points[:, 2]
        if len(heights) == 0:
             print("Error: No points found to determine height.")
             return False
        try:
            floor_height = np.percentile(heights, 5) # Robust floor estimate
            wall_height = floor_height + auto_height_offset
            print(f"Detected floor near {floor_height:.3f}m")
            print(f"Taking wall slice at {wall_height:.3f}m (floor + {auto_height_offset}m)")
        except IndexError:
             print("Error: Could not calculate floor height.")
             return False
    else:
        print(f"Using specified wall height: {wall_height:.3f}m")

    slice_min_z = wall_height - slice_thickness / 2
    slice_max_z = wall_height + slice_thickness / 2
    mask = (points[:, 2] >= slice_min_z) & (points[:, 2] < slice_max_z)
    wall_points = points[mask]

    if len(wall_points) == 0:
        print(f"Error: No points found in slice {slice_min_z:.3f}m - {slice_max_z:.3f}m.")
        # Suggest alternative heights based on point density peaks
        try:
            hist, edges = np.histogram(points[:, 2], bins=100) # More bins might help
            centers = (edges[:-1] + edges[1:]) / 2
            peak_indices = np.argsort(hist)[-10:]
            print("\nPotential heights with more points (bin centers):")
            for i in reversed(peak_indices):
                 if hist[i] > 50: # Suggest bins with at least 50 points
                      print(f"  --height {centers[i]:.3f}  ({hist[i]} points in bin)")
        except Exception as e:
            print(f"Could not analyze height distribution: {e}")
        return False
    print(f"Found {len(wall_points)} points in wall slice.")

    wall_pcd = o3d.geometry.PointCloud()
    wall_pcd.points = o3d.utility.Vector3dVector(wall_points)
    wall_ply_path = output_path / "wall_points.ply"
    o3d.io.write_point_cloud(str(wall_ply_path), wall_pcd)
    print(f"Saved wall points to {wall_ply_path}")

    if len(wall_points) < 2:
         print("Error: Not enough points in slice for bounds calculation.")
         return False
    min_x, max_x = np.min(wall_points[:, 0]), np.max(wall_points[:, 0])
    min_y, max_y = np.min(wall_points[:, 1]), np.max(wall_points[:, 1])
    x_range = max_x - min_x
    y_range = max_y - min_y
    padding = 0.1 * max(x_range, y_range, 1.0)
    min_x -= padding
    max_x += padding
    min_y -= padding
    max_y += padding

    grid_width = int((max_x - min_x) // grid_size) + 1
    grid_height = int((max_y - min_y) // grid_size) + 1
    if grid_width <= 0 or grid_height <= 0:
         print(f"Error: Invalid grid dimensions calculated ({grid_height}x{grid_width}).")
         return False
    print(f"Creating grid ({grid_height} x {grid_width}) with cell size {grid_size}m")
    grid = np.zeros((grid_height, grid_width), dtype=np.uint8)
    xs = ((wall_points[:, 0] - min_x) / grid_size).astype(int)
    ys = ((wall_points[:, 1] - min_y) / grid_size).astype(int)
    valid_idx = (xs >= 0) & (xs < grid_width) & (ys >= 0) & (ys < grid_height)
    grid[ys[valid_idx], xs[valid_idx]] = 1

    # --- !!! EDIT THESE PARAMETERS FOR TUNING !!! ---
    print("Processing grid image...")
    dilate_iterations = 3  # Try increasing (e.g., 3, 4) if walls are broken
    erode_iterations = 1   # Try decreasing (e.g., 1, 0) if walls vanish
    close_iterations = 3   # Try increasing (e.g., 3, 4, 5) to fill gaps
    gaussian_sigma = 1.5   # Try increasing (e.g., 1.5, 2.0) to connect nearby blobs
    threshold = 0.4        # Try decreasing (e.g., 0.4, 0.3) if walls are faint after smoothing
    # --- End of parameters to edit ---

    grid_processed = grid.copy()
    if dilate_iterations > 0:
        grid_processed = binary_dilation(grid_processed, iterations=dilate_iterations)
    if erode_iterations > 0:
        grid_processed = binary_erosion(grid_processed, iterations=erode_iterations)
    if close_iterations > 0:
        grid_processed = binary_closing(grid_processed, iterations=close_iterations)
    if gaussian_sigma > 0:
        grid_smoothed = gaussian_filter(grid_processed.astype(float), sigma=gaussian_sigma)
        grid_binary = (grid_smoothed > threshold).astype(np.uint8)
        print(f"Applied Gaussian smooth (sigma={gaussian_sigma}) and threshold ({threshold})")
    else:
        grid_binary = grid_processed
        print("Skipped Gaussian smoothing.")
    # --- End Image Processing ---

    plt.figure(figsize=(10, 10 * grid_height/grid_width if grid_width > 0 else 10))
    plt.imshow(grid_binary, cmap='binary', origin='lower', extent=[min_x, max_x, min_y, max_y])
    plt.title(f'Processed Wall Grid (Slice at {wall_height:.2f}m) - CHECK THIS IMAGE!')
    plt.xlabel('X (meters)')
    plt.ylabel('Y (meters)')
    bar_length = 1.0
    bar_x_start = min_x + padding * 0.5
    bar_y_start = min_y + padding * 0.5
    plt.plot([bar_x_start, bar_x_start + bar_length], [bar_y_start, bar_y_start], 'r-', linewidth=3)
    plt.text(bar_x_start + bar_length / 2, bar_y_start + grid_size * 5, f"{bar_length}m", color='red', ha='center', va='bottom')
    grid_img_path = output_path / "wall_floorplan_processed_check.png"
    plt.savefig(grid_img_path, bbox_inches='tight', dpi=150)
    plt.close()
    print(f"Saved processed grid map image (CHECK THIS FILE!) to {grid_img_path}")

    if not skimage_available:
        print("Skipping contour extraction and DXF output (scikit-image not available).")
        return True

    print("Extracting contours from processed grid...")
    padded_grid = np.pad(grid_binary, pad_width=1, mode='constant', constant_values=0)
    raw_contours_grid = measure.find_contours(padded_grid, 0.5) # Threshold fixed at 0.5 for find_contours

    contours_world = []
    for contour_grid in raw_contours_grid:
        if len(contour_grid) < min_contour_length:
            continue
        contour_world = np.empty_like(contour_grid)
        contour_world[:, 0] = (contour_grid[:, 1] - 1) * grid_size + min_x
        contour_world[:, 1] = (contour_grid[:, 0] - 1) * grid_size + min_y
        contours_world.append(contour_world)
    print(f"Found {len(contours_world)} contours.")

    # Visualize contours
    plt.figure(figsize=(12, 12 * grid_height/grid_width if grid_width > 0 else 12))
    plt.imshow(grid_binary, cmap='binary', origin='lower', extent=[min_x, max_x, min_y, max_y], alpha=0.3)
    for i, contour in enumerate(contours_world):
        plt.plot(contour[:, 0], contour[:, 1], 'b-', linewidth=1.5)
    plt.title('Extracted Wall Contours (No Simplification)')
    plt.xlabel('X (meters)')
    plt.ylabel('Y (meters)')
    contour_img_path = output_path / "wall_contours_raw.png"
    plt.savefig(contour_img_path, bbox_inches='tight', dpi=150)
    plt.close()
    print(f"Saved raw contour visualization to {contour_img_path}")


    if not ezdxf_available:
        print("Skipping DXF creation (ezdxf not available).")
        return True

    print("Creating DXF file...")
    try:
        doc = ezdxf.new('R2010')
        msp = doc.modelspace()
        doc.layers.add(name='WALLS', color=ezdxf.colors.WHITE)
        doc.layers.add(name='DIMENSIONS', color=ezdxf.colors.RED)
        # Setup dimension style (same as before)
        dim_style_name = 'ARCH_METRIC'
        if dim_style_name not in doc.dimstyles:
             doc.dimstyles.new(dim_style_name, dxfattribs={'dimtxt': 0.1, 'dimasz': 0.05, 'dimblk': 'ARCHTICK', 'dimclrd': ezdxf.colors.RED, 'dimclrt': ezdxf.colors.RED, 'dimdec': 2, 'dimpost': ' m', 'dimtad': 1})

        added_dims = 0
        for idx, poly_points in enumerate(contours_world): # Use raw contours
            if len(poly_points) < 2: continue
            is_closed = np.allclose(poly_points[0], poly_points[-1], atol=grid_size/2)
            msp.add_lwpolyline(poly_points, close=is_closed, dxfattribs={'layer': 'WALLS'})

            num_segments = len(poly_points) - 1 if not is_closed else len(poly_points)
            for i in range(num_segments):
                p1 = tuple(poly_points[i]) # Ensure tuples for ezdxf
                p2 = tuple(poly_points[(i + 1) % len(poly_points)])
                segment_length = np.linalg.norm(np.array(p2) - np.array(p1))
                if segment_length > dim_min_length:
                    try:
                        dim = msp.add_aligned_dim(p1=p1, p2=p2, distance=0.2, style=dim_style_name, dxfattribs={'layer': 'DIMENSIONS'})
                        dim.render()
                        added_dims += 1
                    except Exception as e:
                        print(f"Warning: Error adding dimension for segment {i} in contour {idx}: {e}")

        dxf_path = output_path / "floorplan_raw_contours_with_dims.dxf"
        doc.saveas(str(dxf_path))
        print(f"Saved DXF floorplan with {added_dims} dimensions to {dxf_path}")

    except Exception as e:
        print(f"Error during DXF creation: {e}")
        import traceback
        traceback.print_exc()

    print(f"Basic floorplan extraction completed. Results saved to {output_path}")
    return True

def main():
    parser = argparse.ArgumentParser(description="Extract a basic floorplan (no simplification) from a PLY file. Focus on parameter tuning.")
    parser.add_argument("input", help="Input PLY file")
    parser.add_argument("output", help="Output directory")
    parser.add_argument("--height", type=float, default=None, help="Height (Z) for wall slice (meters).")
    parser.add_argument("--offset", type=float, default=1.2, help="Height above floor if auto-detecting (meters).")
    parser.add_argument("--thickness", type=float, default=0.1, help="Slice thickness (meters).")
    parser.add_argument("--grid-size", type=float, default=0., help="Grid resolution (meters/cell).")
    parser.add_argument("--min-contour-pts", type=int, default=100, help="Min points per contour.")
    parser.add_argument("--min-dim-len", type=float, default=0.5, help="Min length for dimensioning (meters).")
    args = parser.parse_args()

    # Basic dependency check
    if not skimage_available:
         print("Error: scikit-image is required. Install: pip install scikit-image")
         sys.exit(1)
    # ezdxf check is done before DXF creation

    extract_wall_floorplan_basic(
        input_file=args.input,
        output_dir=args.output,
        wall_height=args.height,
        slice_thickness=args.thickness,
        grid_size=args.grid_size,
        auto_height_offset=args.offset,
        min_contour_length=args.min_contour_pts,
        dim_min_length=args.min_dim_len
    )

if __name__ == "__main__":
    main()