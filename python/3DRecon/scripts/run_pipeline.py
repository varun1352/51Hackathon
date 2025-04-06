#!/usr/bin/env python3
"""
Main script to run the entire 3D Gaussian Splatting pipeline.
This script coordinates the execution of COLMAP processing, 
conversion to 3DGS format, and training the 3DGS model.
"""

import os
import sys
import yaml
import argparse
import shutil
from pathlib import Path
import time

# Import other pipeline modules
from colmap_process import run_colmap
from convert_colmap import convert_colmap_to_3dgs
from train_3dgs import train_gaussian_splatting

def check_dependencies():
    """Check if all required dependencies are installed."""
    try:
        # Check Python packages
        import numpy
        import torch
        import tqdm
        
        # Check if COLMAP is installed
        import subprocess
        colmap_version = subprocess.run(["colmap", "--version"], 
                                       stdout=subprocess.PIPE, 
                                       stderr=subprocess.PIPE)
        if colmap_version.returncode != 0:
            print("COLMAP is not installed or not in PATH.")
            return False
        
        print("All dependencies found.")
        return True
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Please install required dependencies listed in requirements.txt")
        return False
    except Exception as e:
        print(f"Error checking dependencies: {e}")
        return False

def setup_directories(config):
    """Set up required directories."""
    try:
        # Create output and intermediate directories
        paths = config['paths']
        os.makedirs(paths['output_dir'], exist_ok=True)
        os.makedirs(paths['colmap_dir'], exist_ok=True)
        os.makedirs(paths['gaussian_dir'], exist_ok=True)
        
        # Check if input images directory exists
        if not os.path.exists(paths['input_images_dir']):
            print(f"Error: Input images directory {paths['input_images_dir']} does not exist.")
            return False
        
        # Check if input directory contains images
        valid_extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
        images = [f for f in os.listdir(paths['input_images_dir']) 
                  if any(f.endswith(ext) for ext in valid_extensions)]
        
        if len(images) == 0:
            print(f"Error: Input directory {paths['input_images_dir']} does not contain any images.")
            return False
        
        print(f"Found {len(images)} images in input directory.")
        return True
    except Exception as e:
        print(f"Error setting up directories: {e}")
        return False

def run_pipeline(config_path):
    """Run the full 3D Gaussian Splatting pipeline."""
    # Load configuration
    try:
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
    except Exception as e:
        print(f"Error loading configuration: {e}")
        return False
    
    # Check dependencies
    if not check_dependencies():
        return False
    
    # Setup directories
    if not setup_directories(config):
        return False
    
    # Start timing
    start_time = time.time()
    
    # Step 1: Run COLMAP
    print("\n== Step 1: Running COLMAP Structure from Motion ==")
    if not run_colmap(config):
        print("COLMAP processing failed.")
        return False
    
    # Step 2: Convert COLMAP output to 3DGS format
    print("\n== Step 2: Converting COLMAP output to 3DGS format ==")
    if not convert_colmap_to_3dgs(config):
        print("Conversion failed.")
        return False
    
    # Step 3: Train 3DGS model
    print("\n== Step 3: Training 3D Gaussian Splatting model ==")
    if not train_gaussian_splatting(config):
        print("3DGS training failed.")
        return False
    
    # Calculate elapsed time
    elapsed_time = time.time() - start_time
    hours, remainder = divmod(elapsed_time, 3600)
    minutes, seconds = divmod(remainder, 60)
    time_str = f"{int(hours)}h {int(minutes)}m {seconds:.2f}s"
    
    # Final output
    print("\n== Pipeline completed successfully ==")
    print(f"Total processing time: {time_str}")
    print(f"Output PLY file: {config['paths']['ply_output_path']}")
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Run 3D Gaussian Splatting pipeline')
    parser.add_argument('-c', '--config', type=str, default='config/pipeline_config.yaml',
                        help='Path to configuration YAML file')
    args = parser.parse_args()
    
    success = run_pipeline(args.config)
    
    if success:
        print("Pipeline completed successfully.")
        return 0
    else:
        print("Pipeline failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())