import open3d as o3d
import numpy as np

def process_eth3d_point_cloud(input_file, voxel_size=0.005, remove_ceiling=True):
    """
    Process ETH3d point cloud dataset .ply file
    
    Parameters:
    - input_file: Path to the input .ply file
    - voxel_size: Voxel size for downsampling (default 0.05 meters)
    - remove_ceiling: Whether to remove ceiling points (default True)
    
    Returns:
    - Processed point cloud
    """
    # Read the point cloud
    pcd = o3d.io.read_point_cloud(input_file)
    
    # Print initial point cloud information for debugging
    print("Original Point Cloud:")
    print(f"Number of points: {len(pcd.points)}")
    print(f"Has colors: {len(pcd.colors) > 0}")
    
    # Downsample using voxel grid
    downsampled_pcd = pcd.voxel_down_sample(voxel_size=voxel_size)
    
    # Convert points to numpy array for processing
    points = np.asarray(downsampled_pcd.points)
    colors = np.asarray(downsampled_pcd.colors)
    
    if remove_ceiling:
        # Estimate ceiling height (95th percentile of z-coordinates)
        ceiling_height_threshold = np.percentile(points[:, 2], 75)
        
        # Create mask for points below ceiling
        mask = points[:, 2] < ceiling_height_threshold
        
        # Filter points and colors
        filtered_points = points[mask]
        filtered_colors = colors[mask] if len(colors) > 0 else []
        
        # Create new point cloud
        processed_pcd = o3d.geometry.PointCloud()
        processed_pcd.points = o3d.utility.Vector3dVector(filtered_points)
        
        # Restore colors if they exist
        if len(filtered_colors) > 0:
            processed_pcd.colors = o3d.utility.Vector3dVector(filtered_colors)
    else:
        processed_pcd = downsampled_pcd
    
    # Print processed point cloud information
    print("\nProcessed Point Cloud:")
    print(f"Number of points: {len(processed_pcd.points)}")
    print(f"Has colors: {len(processed_pcd.colors) > 0}")
    
    return processed_pcd

def save_point_cloud(pcd, output_file):
    """
    Save processed point cloud to a file
    
    Parameters:
    - pcd: Processed point cloud
    - output_file: Path to save the processed point cloud
    """
    o3d.io.write_point_cloud(output_file, pcd)

def visualize_point_cloud(pcd):
    """
    Visualize the point cloud
    
    Parameters:
    - pcd: Point cloud to visualize
    """
    o3d.visualization.draw_geometries([pcd])



if __name__ == "__main__":
    input_file = 'delivery_area/scan_clean/scan1.ply'  # Replace with your input .ply file path
    output_file = 'processed.ply'  # Replace with your desired output path
    
    # Process point cloud
    processed_pcd = process_eth3d_point_cloud(
        input_file, 
        voxel_size=0.005,  # Adjust voxel size as needed
        remove_ceiling=True
    )
    
    # Visualize processed point cloud
    o3d.visualization.draw_geometries([processed_pcd])
    
    # Save processed point cloud
    save_point_cloud(processed_pcd, output_file)
