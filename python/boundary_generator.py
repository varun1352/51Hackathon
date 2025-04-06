#!/usr/bin/env python3
"""
Calculates the 2D Convex Hull boundary of a point cloud projected onto the XY plane.
"""
import numpy as np
import open3d as o3d
import matplotlib.pyplot as plt
from scipy.spatial import ConvexHull
from pathlib import Path
import argparse
import ezdxf

def get_outer_boundary(input_file, output_dir, use_floor_points=False, floor_offset=0.1):
    """
    Generates the 2D convex hull boundary from a PLY file.

    Args:
        input_file (str): Path to input PLY file.
        output_dir (str): Directory to save output files.
        use_floor_points (bool): If True, only use points near the detected floor.
                                 If False, use all points projected to 2D.
        floor_offset (float): If use_floor_points is True, defines the thickness
                              above the detected floor to consider (meters).
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

    points_2d = None
    if use_floor_points:
        print("Using points near floor...")
        heights = points[:, 2]
        if len(heights) == 0:
            print("Error: No points to determine floor height.")
            return False
        floor_height = np.percentile(heights, 5)
        print(f"Detected floor near {floor_height:.3f}m")
        floor_mask = (heights >= floor_height - floor_offset/2) & (heights <= floor_height + floor_offset/2)
        if np.sum(floor_mask) < 3:
             print(f"Error: Less than 3 points found near floor height {floor_height:.3f}m +/- {floor_offset/2:.3f}m. Cannot compute hull.")
             print("Try increasing floor_offset or setting use_floor_points=False.")
             return False
        points_2d = points[floor_mask, :2] # Use only X, Y coordinates of floor points
        print(f"Using {len(points_2d)} points near floor for boundary calculation.")
    else:
        print("Using all points projected to XY plane...")
        points_2d = points[:, :2] # Use only X, Y coordinates
        if len(points_2d) < 3:
             print("Error: Less than 3 points in the point cloud. Cannot compute hull.")
             return False

    print("Calculating 2D Convex Hull...")
    try:
        hull = ConvexHull(points_2d)
        hull_points = points_2d[hull.vertices]
        # Close the loop
        hull_points_closed = np.vstack((hull_points, hull_points[0]))
    except Exception as e:
        print(f"Error calculating Convex Hull: {e}")
        # This can happen if points are collinear, etc.
        return False

    print(f"Convex Hull found with {len(hull_points)} vertices.")

    # --- Visualization ---
    plt.figure(figsize=(10, 10))
    plt.plot(points_2d[:, 0], points_2d[:, 1], '.', markersize=1, color='gray', alpha=0.5, label='Projected Points')
    plt.plot(hull_points_closed[:, 0], hull_points_closed[:, 1], 'r-', linewidth=2, label='Convex Hull Boundary')
    plt.scatter(hull_points[:, 0], hull_points[:, 1], c='red', s=20, zorder=5) # Mark vertices
    plt.title('2D Convex Hull Boundary')
    plt.xlabel('X (meters)')
    plt.ylabel('Y (meters)')
    plt.gca().set_aspect('equal', adjustable='box')
    plt.legend()
    plt.grid(True)
    vis_path = output_path / "outer_boundary_convex_hull.png"
    plt.savefig(vis_path, bbox_inches='tight', dpi=150)
    plt.close()
    print(f"Saved boundary visualization to {vis_path}")

    # --- DXF Output ---
    try:
        import ezdxf
        doc = ezdxf.new('R2010')
        msp = doc.modelspace()
        msp.add_lwpolyline(hull_points_closed, dxfattribs={'layer': 'BOUNDARY'})

        # Add dimensions (optional, less common for simple hull)
        doc.layers.add(name='DIMENSIONS', color=ezdxf.colors.CYAN)
        for i in range(len(hull_points)):
            p1 = hull_points[i]
            p2 = hull_points[(i + 1) % len(hull_points)] # Next point, wrap around
            segment_length = np.linalg.norm(np.array(p2) - np.array(p1))
            if segment_length > 0.1: # Only dimension non-trivial segments
                 try:
                      msp.add_aligned_dim(p1=p1, p2=p2, distance=0.5, # Offset distance
                                          dxfattribs={'layer': 'DIMENSIONS'}).render()
                 except Exception as dim_e:
                      print(f"Warning: Could not add dimension for segment {i}: {dim_e}")


        dxf_path = output_path / "outer_boundary_convex_hull.dxf"
        doc.saveas(dxf_path)
        print(f"Saved boundary DXF to {dxf_path}")

    except ImportError:
        print("Info: ezdxf not found. Skipping DXF output.")
    except Exception as e:
        print(f"Error during DXF creation: {e}")

    print("Outer boundary generation complete.")
    return True


def main():
    parser = argparse.ArgumentParser(description="Generate the 2D Convex Hull outer boundary from a PLY point cloud.")
    parser.add_argument("input", help="Input PLY file")
    parser.add_argument("output", help="Output directory")
    parser.add_argument("--use-floor", action='store_true', help="Calculate boundary using only points near the estimated floor level.")
    parser.add_argument("--floor-offset", type=float, default=0.1, help="Thickness around floor level if --use-floor is set (meters).")

    args = parser.parse_args()
    get_outer_boundary(args.input, args.output, args.use_floor, args.floor_offset)

if __name__ == "__main__":
    main()