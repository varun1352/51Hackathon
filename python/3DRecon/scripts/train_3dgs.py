#!/usr/bin/env python3
"""
Script to train a 3D Gaussian Splatting model from COLMAP data.
This script adapts functionality from the 3D Gaussian Splatting repository
to train a model and save the resulting point cloud as a PLY file.
"""

import os
import sys
import yaml
import argparse
import torch
import numpy as np
from tqdm import tqdm
import json
from pathlib import Path
import time

# Import 3DGS modules - Need to set up proper imports based on repository structure
# Here's a simplified version assuming the 3DGS repository is available and configured

def setup_3dgs_imports():
    """Add 3DGS repository to Python path for imports."""
    # Locate the 3DGS repository (this would need to be customized based on your setup)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    
    # Add 3DGS repository path to Python path
    # This assumes the 3DGS repository is at the same level as your project
    three_dgs_path = os.path.join(parent_dir, "third_party", "gaussian-splatting")
    if not os.path.exists(three_dgs_path):
        print(f"3DGS repository not found at {three_dgs_path}")
        print("Please make sure the repository is cloned correctly.")
        return False
    
    sys.path.append(three_dgs_path)
    return True

def train_gaussian_splatting(config):
    """Train a 3D Gaussian Splatting model."""
    # Setup imports
    if not setup_3dgs_imports():
        return False
    
    # Now import 3DGS modules after setting up the path
    try:
        from arguments import ModelParams, PipelineParams, OptimizationParams
        from gaussian_renderer import GaussianModel, render
        from scene import Scene, GaussianModel
        from utils.general_utils import safe_state
        from utils.image_utils import psnr
        from utils.loss_utils import l1_loss, ssim
        from utils.visualization import visualize_depth
    except ImportError as e:
        print(f"Failed to import 3DGS modules: {e}")
        print("Please make sure the 3DGS repository is properly set up.")
        return False
    
    # Extract configuration
    paths = config['paths']
    gs_config = config['gaussian_splatting']
    
    # Create a device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Set up model parameters
    model_params = ModelParams(
        sh_degree=gs_config['sh_degree'],
    )
    
    # Set up pipeline parameters
    pipeline_params = PipelineParams(
        white_background=gs_config['white_background'],
    )
    
    # Set up optimization parameters
    optimization_params = OptimizationParams(
        iterations=gs_config['iterations'],
        position_lr_init=gs_config['position_lr_init'],
        position_lr_final=gs_config['position_lr_final'],
        position_lr_delay_mult=gs_config['position_lr_delay_mult'],
        position_lr_max_steps=gs_config['position_lr_max_steps'],
        scaling_lr=gs_config['scaling_lr'],
        opacity_lr=gs_config['opacity_lr'],
        rotation_lr=gs_config['rotation_lr'],
        densify_grad_threshold=gs_config['densify_grad_threshold'],
        densify_from_iter=gs_config['densify_from_iter'],
        densify_until_iter=gs_config['densify_until_iter'],
        random_background=gs_config['random_background']
    )
    
    # Create output directory
    os.makedirs(paths['gaussian_dir'], exist_ok=True)
    
    # Load scene
    scene = Scene(
        model_params,
        pipeline_params,
        gs_config['percent_dense'],
        os.path.join(paths['gaussian_dir'], 'transforms.json'),
        paths['input_images_dir'],
        eval=False,
        shuffle=True
    )
    
    # Create Gaussian model
    gaussian_model = GaussianModel(model_params)
    gaussian_model.to(device)
    
    # Initialize model
    gaussian_model.initialize_from_pointcloud(scene.getTrainCameras(), device)
    
    # Setup optimizer
    optimizer = torch.optim.Adam([
        {
            "params": gaussian_model.densification_params,
            "lr": optimization_params.position_lr_init,
        },
        {
            "params": gaussian_model.opacity_params,
            "lr": optimization_params.opacity_lr,
        },
        {
            "params": gaussian_model.scaling_params,
            "lr": optimization_params.scaling_lr,
        },
        {
            "params": gaussian_model.rotation_params,
            "lr": optimization_params.rotation_lr,
        },
        {
            "params": gaussian_model.sh_params,
            "lr": optimization_params.position_lr_init,
        }
    ])
    
    # Training loop
    background = torch.tensor([1, 1, 1], device=device) if gs_config['white_background'] else torch.tensor([0, 0, 0], device=device)
    iter_start = torch.cuda.Event(enable_timing=True)
    iter_end = torch.cuda.Event(enable_timing=True)
    
    viewpoint_stack = None
    ema_loss_for_log = 0.0
    
    progress_bar = tqdm(range(optimization_params.iterations), desc="Training progress")
    for iteration in progress_bar:
        # Fetch data
        if viewpoint_stack is None or len(viewpoint_stack) == 0:
            viewpoint_stack = scene.getTrainCameras().copy()
        
        viewpoint_cam = viewpoint_stack.pop(0)
        
        # Start timing
        iter_start.record()
        
        # Render
        render_pkg = render(viewpoint_cam, gaussian_model, pipeline_params, background)
        image, viewspace_point_tensor, visibility_filter, radii = render_pkg["render"], render_pkg["viewspace_points"], render_pkg["visibility_filter"], render_pkg["radii"]
        
        # Compute loss
        gt_image = viewpoint_cam.original_image.to(device)
        Ll1 = l1_loss(image, gt_image)
        loss = (1.0 - optimization_params.lambda_dssim) * Ll1 + optimization_params.lambda_dssim * (1.0 - ssim(image, gt_image))
        
        # Backpropagate
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        # Densification
        if iteration < optimization_params.densify_until_iter and iteration >= optimization_params.densify_from_iter and (iteration + 1) % optimization_params.densification_interval == 0:
            # Calculate gradients in world space
            gaussian_model.compute_densification_stats(viewspace_point_tensor, visibility_filter)
            
            # Densify based on rendering gradients
            gaussian_model.densify_and_prune(
                optimization_params.densify_grad_threshold, 
                scene.cameras_extent, 
                optimization_params.scene_percent_dense
            )
            
            # Reset optimizer with new points
            gaussian_model.update_optimizer_state(optimizer)
        
        # Reset opacity if needed
        if (iteration + 1) % gs_config['opacity_reset_interval'] == 0:
            gaussian_model.reset_opacity()
        
        # Learning rate scheduling
        if iteration < optimization_params.position_lr_max_steps:
            lr_factor = optimization_params.position_lr_final / optimization_params.position_lr_init
            lr = optimization_params.position_lr_init * (lr_factor ** (iteration / optimization_params.position_lr_max_steps))
            for param_group in optimizer.param_groups:
                if param_group["name"] == "position" or param_group["name"] == "sh":
                    param_group["lr"] = lr
                    
        # Record timing
        iter_end.record()
        torch.cuda.synchronize()
        
        # Update progress bar
        elapsed = iter_start.elapsed_time(iter_end) / 1000.0
        ema_loss_for_log = 0.4 * loss.item() + 0.6 * ema_loss_for_log
        progress_bar.set_postfix({
            "Loss": f"{ema_loss_for_log:.5f}",
            "PSNR": f"{-10.0 * np.log10(ema_loss_for_log):.2f}",
        })
        
        # Save checkpoint at intervals
        if (iteration + 1) % 1000 == 0:
            print(f"Saving checkpoint at iteration {iteration + 1}...")
            gaussian_model.save_ply(os.path.join(paths['gaussian_dir'], f"iteration_{iteration + 1}.ply"))
    
    # Save final model as PLY file
    try:
        final_ply_path = paths['ply_output_path']
        gaussian_model.save_ply(final_ply_path)
        print(f"Saved final point cloud to {final_ply_path}")
    except Exception as e:
        print(f"Error saving final point cloud: {e}")
        return False
    
    print("Training completed successfully.")
    return True