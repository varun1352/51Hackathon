"""
SafetyGauss - Safety Analysis Module
-----------------------------------
This module analyzes 3D reconstructions for safety hazards.
It provides functionality to:
1. Analyze visibility and blind spots in 3D reconstructions
2. Detect potential safety hazards
3. Generate reports and visualizations
4. Store analysis results in MongoDB

Requirements:
- Python 3.6+
- NumPy
- PyMongo
- Open3D (for point cloud processing)
- Matplotlib (for visualization)
"""

import os
import sys
import json
import numpy as np
import pymongo
import logging
from pathlib import Path
from datetime import datetime
import open3d as o3d
import matplotlib.pyplot as plt
import matplotlib.colors as colors
from scipy.spatial import KDTree
from mpl_toolkits.mplot3d import Axes3D


class SafetyAnalyzer:
    def __init__(self, 
                scene_id,
                db_connection_string="mongodb://localhost:27017/",
                db_name="safetyGauss",
                output_dir=None,
                logger=None):
        """
        Initialize the safety analysis module.
        
        Args:
            scene_id (str): ID of the scene to analyze
            db_connection_string (str): MongoDB connection string
            db_name (str): MongoDB database name
            output_dir (str): Directory to store analysis results
            logger: Logger object for output
        """
        self.scene_id = scene_id
        self.db_connection_string = db_connection_string
        self.db_name = db_name
        self.output_dir = Path(output_dir) if output_dir else Path(f"./output/analysis_{scene_id}")
        
        # Set up logger
        if logger:
            self.logger = logger
        else:
            self.logger = logging.getLogger("SafetyGauss.Analysis")
            self.logger.setLevel(logging.INFO)
            if not self.logger.handlers:
                handler = logging.StreamHandler()
                formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
                handler.setFormatter(formatter)
                self.logger.addHandler(handler)
        
        # Connect to MongoDB
        try:
            self.client = pymongo.MongoClient(self.db_connection_string)
            self.db = self.client[self.db_name]
            self.scenes_collection = self.db["scenes"]
            self.analysis_collection = self.db["safety_analysis"]
            self.logger.info(f"Connected to MongoDB database: {self.db_name}")
        except Exception as e:
            self.logger.error(f"Failed to connect to MongoDB: {e}")
            self.client = None
            self.db = None
            
        # Load scene data
        self.scene_data = self.load_scene_data()
        
        # Initialize point cloud
        self.point_cloud = None
        self.camera_positions = None
        self.kdtree = None
        
        # Create output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def load_scene_data(self):
        """
        Load scene data from MongoDB.
        
        Returns:
            dict: Scene data including reconstruction information
        """
        if not self.db:
            self.logger.error("Database connection not available")
            return None
            
        from bson.objectid import ObjectId
        scene_data = self.scenes_collection.find_one({"_id": ObjectId(self.scene_id)})
        
        if not scene_data:
            self.logger.error(f"Scene with ID {self.scene_id} not found")
            return None
            
        self.logger.info(f"Loaded scene data for {scene_data['name']}")
        return scene_data
    
    def load_point_cloud(self, ply_path=None):
        """
        Load point cloud data from a PLY file.
        If ply_path is not provided, try to get it from the scene data.
        
        Args:
            ply_path (str, optional): Path to the PLY file
            
        Returns:
            bool: True if successful, False otherwise
        """
        # If no PLY path is provided, try to get it from the scene data
        if not ply_path and self.scene_data and "file_paths" in self.scene_data:
            ply_path = self.scene_data["file_paths"].get("point_cloud")
            
        if not ply_path:
            self.logger.error("No point cloud path provided or found in scene data")
            return False
            
        try:
            # Load the point cloud using Open3D
            self.logger.info(f"Loading point cloud from {ply_path}")
            self.point_cloud = o3d.io.read_point_cloud(ply_path)
            
            if not self.point_cloud or len(self.point_cloud.points) == 0:
                self.logger.error(f"Failed to load point cloud or point cloud is empty: {ply_path}")
                return False
                
            # Extract points and colors as numpy arrays
            self.points = np.asarray(self.point_cloud.points)
            self.colors = np.asarray(self.point_cloud.colors) if self.point_cloud.has_colors() else None
            
            # Create KD-tree for nearest neighbor queries
            self.kdtree = KDTree(self.points)
            
            self.logger.info(f"Loaded point cloud with {len(self.point_cloud.points)} points")
            return True
        except Exception as e:
            self.logger.error(f"Exception during point cloud loading: {e}")
            return False
    
    def extract_camera_positions(self):
        """
        Extract camera positions from the scene reconstruction data.
        
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.scene_data or "reconstruction_data" not in self.scene_data:
            self.logger.error("No reconstruction data found in scene data")
            return False
            
        try:
            reconstruction_data = self.scene_data["reconstruction_data"]
            
            # Extract camera positions from images
            camera_positions = []
            for image_id, image_data in reconstruction_data["images"].items():
                # Camera position is the negative translation rotated back to world coordinates
                translation = np.array(image_data["translation"])
                camera_positions.append(translation)
                
            self.camera_positions = np.array(camera_positions)
            
            self.logger.info(f"Extracted {len(self.camera_positions)} camera positions")
            return True
        except Exception as e:
            self.logger.error(f"Exception during camera position extraction: {e}")
            return False
                
    def calculate_visibility_from_point(self, viewpoint, max_distance=None, resolution=100):
        """
        Calculate visibility from a specific viewpoint using ray casting.
        
        Args:
            viewpoint (ndarray): 3D coordinates of the viewpoint
            max_distance (float, optional): Maximum distance to consider
            resolution (int): Number of rays in each direction (spherical)
            
        Returns:
            dict: Visibility analysis results
        """
        self.logger.info(f"Calculating visibility from viewpoint {viewpoint}")
        
        if self.point_cloud is None:
            self.logger.error("Point cloud not loaded")
            return None
            
        # Create a spherical grid of rays
        theta = np.linspace(0, np.pi, resolution)
        phi = np.linspace(0, 2*np.pi, resolution)
        
        # Create meshgrid for all combinations
        theta_grid, phi_grid = np.meshgrid(theta, phi)
        
        # Convert to Cartesian coordinates (unit vectors)
        x = np.sin(theta_grid) * np.cos(phi_grid)
        y = np.sin(theta_grid) * np.sin(phi_grid)
        z = np.cos(theta_grid)
        
        # Stack into ray directions
        ray_directions = np.stack([x.flatten(), y.flatten(), z.flatten()], axis=1)
        
        # Set up results
        visibility_results = {
            "viewpoint": viewpoint.tolist(),
            "visible_points": [],
            "visible_count": 0,
            "total_rays": len(ray_directions),
            "max_distance": max_distance
        }
        
        # Convert point cloud to trimesh for ray casting
        # Since Open3D doesn't have built-in ray casting for point clouds,
        # we'll use nearest-neighbor search with the KD-tree
        
        visible_points = []
        hit_points = []
        
        for i, direction in enumerate(ray_directions):
            # Normalize direction
            direction = direction / np.linalg.norm(direction)
            
            # Define a set of points along the ray for sampling
            num_samples = 50  # Number of samples along the ray
            if max_distance:
                sample_distances = np.linspace(0, max_distance, num_samples)
            else:
                # Use a heuristic based on the point cloud size
                point_cloud_extent = np.max(self.points, axis=0) - np.min(self.points, axis=0)
                point_cloud_diameter = np.linalg.norm(point_cloud_extent)
                sample_distances = np.linspace(0, point_cloud_diameter, num_samples)
                
            closest_hit = None
            closest_distance = float('inf')
            
            for dist in sample_distances:
                # Point along the ray
                sample_point = viewpoint + direction * dist
                
                # Find nearest neighbor in the point cloud
                distances, indices = self.kdtree.query(sample_point, k=1)
                
                # If the nearest point is close enough, consider it a hit
                if distances < 0.1:  # 10cm threshold - adjust as needed
                    closest_point = self.points[indices]
                    dist_to_viewpoint = np.linalg.norm(closest_point - viewpoint)
                    
                    if dist_to_viewpoint < closest_distance:
                        closest_distance = dist_to_viewpoint
                        closest_hit = closest_point
                        
                    # No need to check further along this ray
                    break
            
            if closest_hit is not None:
                hit_points.append(closest_hit)
                if max_distance is None or closest_distance <= max_distance:
                    visible_points.append(closest_hit)
        
        visibility_results["visible_points"] = visible_points
        visibility_results["visible_count"] = len(visible_points)
        
        self.logger.info(f"Visibility analysis complete: {len(visible_points)}/{len(ray_directions)} points visible")
        return visibility_results
    
    def identify_blind_spots(self, observer_height=1.7, grid_resolution=1.0, max_distance=10.0):
        """
        Identify blind spots in the scene by analyzing visibility from a grid of viewpoints.
        
        Args:
            observer_height (float): Height of the observer (in meters)
            grid_resolution (float): Resolution of the grid (in meters)
            max_distance (float): Maximum visibility distance (in meters)
            
        Returns:
            dict: Blind spot analysis results
        """
        self.logger.info(f"Identifying blind spots with grid resolution {grid_resolution}m")
        
        if self.point_cloud is None:
            self.logger.error("Point cloud not loaded")
            return None
            
        # Calculate the bounds of the scene
        min_bound = np.min(self.points, axis=0)
        max_bound = np.max(self.points, axis=0)
        
        # Create a 2D grid within the XY bounds (horizontal plane)
        x_range = np.arange(min_bound[0], max_bound[0], grid_resolution)
        y_range = np.arange(min_bound[1], max_bound[1], grid_resolution)
        
        # Set Z to a fixed height (observer's eye level)
        # Find ground level (approximate as minimum Z)
        ground_level = min_bound[2]
        observer_z = ground_level + observer_height
        
        # Initialize visibility grid
        visibility_grid = np.zeros((len(x_range), len(y_range)))
        
        # Keep track of blind spots
        blind_spots = []
        
        # Analyze visibility from each grid point
        for i, x in enumerate(x_range):
            for j, y in enumerate(y_range):
                viewpoint = np.array([x, y, observer_z])
                
                # Check if the viewpoint is inside or very close to geometry
                # by finding the nearest point in the point cloud
                distances, _ = self.kdtree.query(viewpoint, k=1)
                
                # If the viewpoint is too close to geometry, skip it
                if distances < 0.2:  # 20cm threshold
                    visibility_grid[i, j] = np.nan  # Mark as invalid viewpoint
                    continue
                    
                # Calculate visibility from this viewpoint
                visibility = self.calculate_visibility_from_point(
                    viewpoint, 
                    max_distance=max_distance,
                    resolution=20  # Lower resolution for grid analysis
                )
                
                if visibility is None:
                    self.logger.warning(f"Failed to calculate visibility from viewpoint {viewpoint}")
                    continue
                    
                # Calculate visibility score as the percentage of visible rays
                visibility_score = visibility["visible_count"] / visibility["total_rays"]
                visibility_grid[i, j] = visibility_score
                
                # Identify blind spots (areas with low visibility)
                if visibility_score < 0.3:  # 30% threshold for blind spots
                    blind_spots.append({
                        "position": viewpoint.tolist(),
                        "visibility_score": visibility_score
                    })
        
        # Analyze clusters of blind spots to identify hazardous areas
        hazardous_areas = self.cluster_blind_spots(blind_spots, min_cluster_size=3, max_cluster_distance=2.0)
        
        # Generate result
        blind_spot_analysis = {
            "grid_resolution": grid_resolution,
            "observer_height": observer_height,
            "max_distance": max_distance,
            "grid_dimensions": [len(x_range), len(y_range)],
            "x_range": x_range.tolist(),
            "y_range": y_range.tolist(),
            "visibility_grid": visibility_grid.tolist(),
            "blind_spots": blind_spots,
            "hazardous_areas": hazardous_areas
        }
        
        self.logger.info(f"Blind spot analysis complete: {len(blind_spots)} blind spots, {len(hazardous_areas)} hazardous areas")
        return blind_spot_analysis
    
    def cluster_blind_spots(self, blind_spots, min_cluster_size=3, max_cluster_distance=2.0):
        """
        Cluster blind spots to identify hazardous areas.
        
        Args:
            blind_spots (list): List of blind spot dictionaries
            min_cluster_size (int): Minimum number of blind spots to form a cluster
            max_cluster_distance (float): Maximum distance between blind spots in a cluster
            
        Returns:
            list: List of hazardous area dictionaries
        """
        if not blind_spots:
            return []
            
        # Extract positions
        positions = np.array([spot["position"] for spot in blind_spots])
        
        # Use a simple clustering algorithm (can be replaced with DBSCAN for better clustering)
        clusters = []
        unclustered = list(range(len(blind_spots)))
        
        while unclustered:
            # Start a new cluster with the first unclustered point
            current_cluster = [unclustered[0]]
            unclustered.remove(unclustered[0])
            
            # Grow the cluster
            i = 0
            while i < len(current_cluster):
                point_idx = current_cluster[i]
                point_pos = positions[point_idx]
                
                # Find nearby unclustered points
                for j in list(unclustered):
                    other_pos = positions[j]
                    distance = np.linalg.norm(point_pos - other_pos)
                    
                    if distance <= max_cluster_distance:
                        current_cluster.append(j)
                        unclustered.remove(j)
                        
                i += 1
                
            # Add cluster if it meets the minimum size requirement
            if len(current_cluster) >= min_cluster_size:
                cluster_positions = [blind_spots[idx]["position"] for idx in current_cluster]
                cluster_center = np.mean(cluster_positions, axis=0).tolist()
                
                clusters.append({
                    "center": cluster_center,
                    "size": len(current_cluster),
                    "points": [blind_spots[idx] for idx in current_cluster],
                    "radius": max([np.linalg.norm(np.array(blind_spots[idx]["position"]) - np.array(cluster_center)) 
                                  for idx in current_cluster])
                })
        
        return clusters
    
    def analyze_safety_risks(self, blind_spot_analysis=None):
        """
        Analyze safety risks based on blind spot analysis.
        
        Args:
            blind_spot_analysis (dict, optional): Blind spot analysis results
            
        Returns:
            dict: Safety risk analysis results
        """
        self.logger.info("Analyzing safety risks")
        
        if blind_spot_analysis is None:
            self.logger.error("No blind spot analysis provided")
            return None
            
        # Calculate overall visibility score
        visibility_grid = np.array(blind_spot_analysis["visibility_grid"])
        valid_cells = ~np.isnan(visibility_grid)
        if np.sum(valid_cells) > 0:
            overall_visibility = np.nanmean(visibility_grid)
        else:
            overall_visibility = 0
            
        # Identify high-risk areas (large clusters of blind spots)
        high_risk_areas = []
        for area in blind_spot_analysis["hazardous_areas"]:
            risk_level = "high" if area["size"] >= 5 else "medium" if area["size"] >= 3 else "low"
            
            high_risk_areas.append({
                "position": area["center"],
                "radius": area["radius"],
                "size": area["size"],
                "risk_level": risk_level,
                "recommendation": self.generate_recommendation(area, risk_level)
            })
            
        # Calculate risk score (0-100)
        # Higher score = higher risk
        if len(blind_spot_analysis["hazardous_areas"]) > 0:
            max_cluster_size = max([area["size"] for area in blind_spot_analysis["hazardous_areas"]])
            cluster_size_factor = min(max_cluster_size / 10, 1.0)  # Normalized to [0,1]
        else:
            cluster_size_factor = 0
            
        blind_spot_percentage = len(blind_spot_analysis["blind_spots"]) / (blind_spot_analysis["grid_dimensions"][0] * blind_spot_analysis["grid_dimensions"][1])
        blind_spot_factor = min(blind_spot_percentage * 5, 1.0)  # Normalized to [0,1]
        
        visibility_factor = 1.0 - overall_visibility  # Low visibility = higher risk
        
        # Weighted risk score
        risk_score = (0.5 * visibility_factor + 0.3 * blind_spot_factor + 0.2 * cluster_size_factor) * 100
        
        safety_risk_analysis = {
            "overall_visibility": overall_visibility,
            "risk_score": risk_score,
            "risk_level": "high" if risk_score >= 70 else "medium" if risk_score >= 40 else "low",
            "high_risk_areas": high_risk_areas,
            "recommendations": self.generate_overall_recommendations(risk_score, high_risk_areas)
        }
        
        self.logger.info(f"Safety risk analysis complete: risk score {risk_score:.2f}, risk level {safety_risk_analysis['risk_level']}")
        return safety_risk_analysis
    
    def generate_recommendation(self, hazardous_area, risk_level):
        """
        Generate a safety recommendation for a hazardous area.
        
        Args:
            hazardous_area (dict): Information about the hazardous area
            risk_level (str): Risk level (high, medium, low)
            
        Returns:
            str: Safety recommendation
        """
        if risk_level == "high":
            return "Install mirrors or cameras to monitor this blind spot area. Consider redesigning the layout to improve visibility."
        elif risk_level == "medium":
            return "Mark the area as a caution zone and install warning signs. Consider adding lighting to improve visibility."
        else:
            return "Monitor this area periodically to ensure it does not become more hazardous."
    
    def generate_overall_recommendations(self, risk_score, high_risk_areas):
        """
        Generate overall safety recommendations.
        
        Args:
            risk_score (float): Risk score (0-100)
            high_risk_areas (list): List of high-risk areas
            
        Returns:
            list: List of safety recommendations
        """
        recommendations = []
        
        if risk_score >= 70:
            recommendations.append("Conduct an immediate safety audit and take corrective actions to improve visibility.")
            recommendations.append("Install adequate lighting throughout the space to improve overall visibility.")
            recommendations.append("Consider redesigning the layout to eliminate major blind spots.")
        elif risk_score >= 40:
            recommendations.append("Implement regular safety audits to monitor and address visibility issues.")
            recommendations.append("Mark hazardous areas with warning signs and enhance lighting where needed.")
        else:
            recommendations.append("Maintain current visibility and regularly review for changes.")
            
        # Add recommendations for specific high-risk areas
        for i, area in enumerate(high_risk_areas):
            if area["risk_level"] == "high":
                recommendations.append(f"High-risk area {i+1}: {area['recommendation']}")
                
        return recommendations
    
    def visualize_blind_spots(self, blind_spot_analysis):
        """
        Generate a visualization of blind spots.
        
        Args:
            blind_spot_analysis (dict): Blind spot analysis results
            
        Returns:
            str: Path to the saved visualization
        """
        self.logger.info("Generating blind spot visualization")
        
        if not blind_spot_analysis:
            self.logger.error("No blind spot analysis provided")
            return None
            
        # Create figure
        fig, ax = plt.subplots(figsize=(12, 10))
        
        # Extract grid data
        visibility_grid = np.array(blind_spot_analysis["visibility_grid"])
        x_range = np.array(blind_spot_analysis["x_range"])
        y_range = np.array(blind_spot_analysis["y_range"])
        
        # Create a masked array to handle NaN values
        visibility_grid_masked = np.ma.masked_invalid(visibility_grid)
        
        # Create heatmap
        cmap = plt.cm.RdYlGn  # Red (low visibility) to yellow to green (high visibility)
        cmap.set_bad('gray')  # Gray for invalid points
        
        im = ax.imshow(visibility_grid_masked.T, origin='lower', 
                      extent=[x_range[0], x_range[-1], y_range[0], y_range[-1]],
                      cmap=cmap, vmin=0, vmax=1, aspect='equal')
        
        # Add colorbar
        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('Visibility Score')
        
        # Mark high-risk areas
        if "hazardous_areas" in blind_spot_analysis:
            for area in blind_spot_analysis["hazardous_areas"]:
                circle = plt.Circle((area["center"][0], area["center"][1]), 
                                   area["radius"], 
                                   color='red', fill=False, linewidth=2)
                ax.add_patch(circle)
                ax.text(area["center"][0], area["center"][1], f"Risk: {area['size']} points",
                       ha='center', va='center', color='white', 
                       bbox=dict(facecolor='red', alpha=0.5))
        
        # Add labels and title
        ax.set_xlabel('X (meters)')
        ax.set_ylabel('Y (meters)')
        ax.set_title('Visibility Analysis and Blind Spots')
        
        # Add grid
        ax.grid(True, linestyle='--', alpha=0.6)
        
        # Save figure
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        output_path = self.output_dir / f"blind_spot_analysis_{timestamp}.png"
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close(fig)
        
        self.logger.info(f"Saved blind spot visualization to {output_path}")
        return str(output_path)
    
    def visualize_3d_safety_analysis(self, safety_analysis):
        """
        Generate a 3D visualization of the safety analysis.
        
        Args:
            safety_analysis (dict): Safety analysis results
            
        Returns:
            str: Path to the saved visualization
        """
        self.logger.info("Generating 3D safety visualization")
        
        if not safety_analysis or self.point_cloud is None:
            self.logger.error("No safety analysis or point cloud available")
            return None
            
        # Create a new point cloud for visualization
        vis_point_cloud = o3d.geometry.PointCloud()
        vis_point_cloud.points = self.point_cloud.points
        
        # Set default colors
        default_colors = np.ones((len(self.point_cloud.points), 3)) * 0.7  # Gray
        
        # Highlight risky areas
        if "high_risk_areas" in safety_analysis:
            for area in safety_analysis["high_risk_areas"]:
                center = np.array(area["position"])
                radius = area["radius"]
                
                # Find points within the hazardous area
                distances = np.linalg.norm(np.asarray(self.point_cloud.points) - center, axis=1)
                risky_points = distances < radius
                
                # Set color based on risk level
                if area["risk_level"] == "high":
                    default_colors[risky_points] = [1, 0, 0]  # Red
                elif area["risk_level"] == "medium":
                    default_colors[risky_points] = [1, 0.5, 0]  # Orange
                else:
                    default_colors[risky_points] = [1, 1, 0]  # Yellow
        
        vis_point_cloud.colors = o3d.utility.Vector3dVector(default_colors)
        
        # Create a coordinate system for orientation
        coordinate_frame = o3d.geometry.TriangleMesh.create_coordinate_frame(
            size=1.0, origin=[0, 0, 0])
        
        # Add camera positions if available
        camera_markers = []
        if self.camera_positions is not None:
            for cam_pos in self.camera_positions:
                camera_marker = o3d.geometry.TriangleMesh.create_sphere(radius=0.1)
                camera_marker.paint_uniform_color([0, 0, 1])  # Blue
                camera_marker.translate(cam_pos)
                camera_markers.append(camera_marker)
        
        # Create high-risk area markers
        risk_markers = []
        if "high_risk_areas" in safety_analysis:
            for area in safety_analysis["high_risk_areas"]:
                center = area["position"]
                marker = o3d.geometry.TriangleMesh.create_sphere(radius=0.2)
                
                # Set color based on risk level
                if area["risk_level"] == "high":
                    marker.paint_uniform_color([1, 0, 0])  # Red
                elif area["risk_level"] == "medium":
                    marker.paint_uniform_color([1, 0.5, 0])  # Orange
                else:
                    marker.paint_uniform_color([1, 1, 0])  # Yellow
                    
                marker.translate(center)
                risk_markers.append(marker)
        
        # Save visualization as separate images from different viewpoints
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        output_paths = []
        
        # Create a visualization object
        vis = o3d.visualization.Visualizer()
        vis.create_window(width=1200, height=800)
        
        # Add geometries
        vis.add_geometry(vis_point_cloud)
        vis.add_geometry(coordinate_frame)
        for marker in camera_markers:
            vis.add_geometry(marker)
        for marker in risk_markers:
            vis.add_geometry(marker)
        
        # Setup view
        vis.get_render_option().background_color = np.array([0.1, 0.1, 0.1])
        vis.get_render_option().point_size = 3.0
        
        # Capture view 1: Top view
        view_control = vis.get_view_control()
        view_control.set_zoom(0.7)
        view_control.set_front([0, 0, -1])
        view_control.set_up([0, 1, 0])
        
        output_path_1 = self.output_dir / f"3d_safety_analysis_top_{timestamp}.png"
        vis.capture_screen_image(str(output_path_1), do_render=True)
        output_paths.append(str(output_path_1))
        
        # Capture view 2: Perspective view
        view_control.set_front([1, 1, -1])
        view_control.set_up([0, 0, 1])
        
        output_path_2 = self.output_dir / f"3d_safety_analysis_perspective_{timestamp}.png"
        vis.capture_screen_image(str(output_path_2), do_render=True)
        output_paths.append(str(output_path_2))
        
        vis.destroy_window()
        
        self.logger.info(f"Saved 3D safety visualizations to {output_paths}")
        return output_paths
    
    def save_analysis_to_database(self, blind_spot_analysis, safety_analysis, visualization_paths):
        """
        Save analysis results to MongoDB.
        
        Args:
            blind_spot_analysis (dict): Blind spot analysis results
            safety_analysis (dict): Safety analysis results
            visualization_paths (list): Paths to visualizations
            
        Returns:
            str: ID of the saved document
        """
        if not self.db:
            self.logger.error("Database connection not available")
            return None
            
        self.logger.info("Saving analysis results to database")
        
        # Prepare analysis data
        analysis_data = {
            "scene_id": self.scene_id,
            "created_at": datetime.now(),
            "blind_spot_analysis": {
                "grid_resolution": blind_spot_analysis["grid_resolution"],
                "observer_height": blind_spot_analysis["observer_height"],
                "max_distance": blind_spot_analysis["max_distance"],
                "blind_spot_count": len(blind_spot_analysis["blind_spots"]),
                "hazardous_area_count": len(blind_spot_analysis["hazardous_areas"])
            },
            "safety_analysis": {
                "overall_visibility": safety_analysis["overall_visibility"],
                "risk_score": safety_analysis["risk_score"],
                "risk_level": safety_analysis["risk_level"],
                "high_risk_area_count": len(safety_analysis["high_risk_areas"]),
                "recommendations": safety_analysis["recommendations"]
            },
            "visualization_paths": visualization_paths
        }
        
        # Insert into database
        analysis_id = self.analysis_collection.insert_one(analysis_data).inserted_id
        self.logger.info(f"Saved analysis with ID: {analysis_id}")
        
        return str(analysis_id)
    
    def generate_safety_report(self, safety_analysis, visualization_paths, output_format="html"):
        """
        Generate a safety report.
        
        Args:
            safety_analysis (dict): Safety analysis results
            visualization_paths (list): Paths to visualizations
            output_format (str): Output format (html, pdf, json)
            
        Returns:
            str: Path to the generated report
        """
        self.logger.info(f"Generating safety report in {output_format} format")
        
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        
        if output_format == "json":
            # Generate JSON report
            report_data = {
                "timestamp": datetime.now().isoformat(),
                "scene_id": self.scene_id,
                "safety_analysis": safety_analysis,
                "visualization_paths": visualization_paths
            }
            
            output_path = self.output_dir / f"safety_report_{timestamp}.json"
            with open(output_path, 'w') as f:
                json.dump(report_data, f, indent=2)
                
        elif output_format == "html":
            # Generate HTML report
            output_path = self.output_dir / f"safety_report_{timestamp}.html"
            
            # Simple HTML template
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>SafetyGauss Safety Analysis Report</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 20px; }}
                    h1, h2, h3 {{ color: #333366; }}
                    .risk-high {{ color: red; font-weight: bold; }}
                    .risk-medium {{ color: orange; font-weight: bold; }}
                    .risk-low {{ color: green; font-weight: bold; }}
                    .recommendation {{ background-color: #f0f0f0; padding: 10px; margin: 10px 0; }}
                    img {{ max-width: 100%; height: auto; margin: 10px 0; }}
                    table {{ border-collapse: collapse; width: 100%; }}
                    th, td {{ text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }}
                    tr:hover {{background-color: #f5f5f5;}}
                </style>
            </head>
            <body>
                <h1>SafetyGauss Safety Analysis Report</h1>
                <p><strong>Date:</strong> {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
                <p><strong>Scene ID:</strong> {self.scene_id}</p>
                
                <h2>Safety Analysis Summary</h2>
                <p><strong>Overall Visibility:</strong> {safety_analysis["overall_visibility"]:.2f} (0-1 scale)</p>
                <p><strong>Risk Score:</strong> {safety_analysis["risk_score"]:.2f} (0-100 scale)</p>
                <p><strong>Risk Level:</strong> <span class="risk-{safety_analysis["risk_level"]}">{safety_analysis["risk_level"].upper()}</span></p>
                
                <h2>High-Risk Areas</h2>
                <p>Number of high-risk areas identified: {len(safety_analysis["high_risk_areas"])}</p>
                """
            
            if safety_analysis["high_risk_areas"]:
                html_content += "<table>"
                html_content += "<tr><th>Position</th><th>Size</th><th>Risk Level</th><th>Recommendation</th></tr>"
                
                for area in safety_analysis["high_risk_areas"]:
                    html_content += f"""
                    <tr>
                        <td>({area["position"][0]:.2f}, {area["position"][1]:.2f}, {area["position"][2]:.2f})</td>
                        <td>{area["size"]}</td>
                        <td class="risk-{area["risk_level"]}">{area["risk_level"].upper()}</td>
                        <td>{area["recommendation"]}</td>
                    </tr>
                    """
                html_content += "</table>"
            else:
                html_content += "<p>No high-risk areas identified.</p>"
            
            html_content += """
                <h2>Recommendations</h2>
                <ul>
            """
            
            for recommendation in safety_analysis["recommendations"]:
                html_content += f"<li class='recommendation'>{recommendation}</li>"
                
            html_content += "</ul>"
            
            html_content += "<h2>Visualizations</h2>"
            
            for path in visualization_paths:
                # Use relative path for the HTML
                rel_path = os.path.basename(path)
                html_content += f"<div><img src='{rel_path}' alt='Safety Visualization'></div>"
            
            html_content += """
            </body>
            </html>
            """
            
            with open(output_path, 'w') as f:
                f.write(html_content)
                
        elif output_format == "pdf":
            # For PDF output, you would need additional libraries like reportlab
            # This is a placeholder implementation
            self.logger.warning("PDF output is not implemented yet")
            output_path = self.output_dir / f"safety_report_{timestamp}.txt"
            
            with open(output_path, 'w') as f:
                f.write(f"SafetyGauss Safety Analysis Report\n")
                f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"Scene ID: {self.scene_id}\n\n")
                f.write(f"Risk Score: {safety_analysis['risk_score']:.2f}\n")
                f.write(f"Risk Level: {safety_analysis['risk_level'].upper()}\n\n")
                f.write("Recommendations:\n")
                for recommendation in safety_analysis["recommendations"]:
                    f.write(f"- {recommendation}\n")
        else:
            self.logger.error(f"Unsupported output format: {output_format}")
            return None
        
        self.logger.info(f"Generated safety report at {output_path}")
        return str(output_path)
    
    def run_full_analysis(self, ply_path=None, observer_height=1.7, grid_resolution=1.0, 
                         max_distance=10.0, output_format="html"):
        """
        Run the full safety analysis pipeline.
        
        Args:
            ply_path (str, optional): Path to the PLY file
            observer_height (float): Height of the observer (in meters)
            grid_resolution (float): Resolution of the grid (in meters)
            max_distance (float): Maximum visibility distance (in meters)
            output_format (str): Output format for the report
            
        Returns:
            dict: Analysis results
        """
        self.logger.info(f"Starting full safety analysis for scene: {self.scene_id}")
        
        # Load point cloud
        if not self.load_point_cloud(ply_path):
            return None
            
        # Extract camera positions
        self.extract_camera_positions()
        
        # Identify blind spots
        blind_spot_analysis = self.identify_blind_spots(
            observer_height=observer_height,
            grid_resolution=grid_resolution,
            max_distance=max_distance
        )
        
        if not blind_spot_analysis:
            return None
            
        # Analyze safety risks
        safety_analysis = self.analyze_safety_risks(blind_spot_analysis)
        
        if not safety_analysis:
            return None
            
        # Generate visualizations
        visualization_paths = []
        
        blind_spot_viz_path = self.visualize_blind_spots(blind_spot_analysis)
        if blind_spot_viz_path:
            visualization_paths.append(blind_spot_viz_path)
            
        safety_viz_paths = self.visualize_3d_safety_analysis(safety_analysis)
        if safety_viz_paths:
            visualization_paths.extend(safety_viz_paths)
            
        # Save analysis to database
        analysis_id = self.save_analysis_to_database(
            blind_spot_analysis, safety_analysis, visualization_paths)
            
        # Generate safety report
        report_path = self.generate_safety_report(
            safety_analysis, visualization_paths, output_format)
            
        # Prepare results
        results = {
            "analysis_id": analysis_id,
            "blind_spot_analysis": blind_spot_analysis,
            "safety_analysis": safety_analysis,
            "visualization_paths": visualization_paths,
            "report_path": report_path
        }
        
        self.logger.info(f"Safety analysis completed successfully for scene: {self.scene_id}")
        
        return results


def main():
    """
    Example usage of the SafetyAnalyzer class.
    """
    import argparse
    
    parser = argparse.ArgumentParser(description="SafetyGauss Safety Analysis")
    parser.add_argument("--scene", required=True, help="Scene ID to analyze")
    parser.add_argument("--ply-path", default=None, help="Path to point cloud PLY file")
    parser.add_argument("--output", default=None, help="Output directory")
    parser.add_argument("--observer-height", type=float, default=1.7, 
                        help="Observer height in meters")
    parser.add_argument("--grid-resolution", type=float, default=1.0, 
                        help="Grid resolution in meters")
    parser.add_argument("--max-distance", type=float, default=10.0, 
                        help="Maximum visibility distance in meters")
    parser.add_argument("--report-format", choices=["html", "pdf", "json"], default="html", 
                        help="Report output format")
    parser.add_argument("--db-connection", default="mongodb://localhost:27017/", 
                        help="MongoDB connection string")
    parser.add_argument("--db-name", default="safetyGauss", help="MongoDB database name")
    
    args = parser.parse_args()
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(f"safety_analysis_{args.scene}.log"),
            logging.StreamHandler()
        ]
    )
    
    logger = logging.getLogger("SafetyGauss.Analysis")
    
    # Create and run the analyzer
    analyzer = SafetyAnalyzer(
        scene_id=args.scene,
        db_connection_string=args.db_connection,
        db_name=args.db_name,
        output_dir=args.output,
        logger=logger
    )
    
    results = analyzer.run_full_analysis(
        ply_path=args.ply_path,
        observer_height=args.observer_height,
        grid_resolution=args.grid_resolution,
        max_distance=args.max_distance,
        output_format=args.report_format
    )
    
    if results:
        print(f"Safety analysis completed successfully for scene: {args.scene}")
        print(f"Analysis ID: {results['analysis_id']}")
        print(f"Risk Score: {results['safety_analysis']['risk_score']:.2f}")
        print(f"Risk Level: {results['safety_analysis']['risk_level'].upper()}")
        print(f"Report: {results['report_path']}")
        return 0
    else:
        print(f"Safety analysis failed for scene: {args.scene}")
        return 1


if __name__ == "__main__":
    sys.exit(main())