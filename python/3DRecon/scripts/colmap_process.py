#!/usr/bin/env python3
"""
Script to process images using COLMAP for structure from motion.
"""

import os
import sys
import yaml
import argparse
import subprocess
import shutil
from pathlib import Path

def run_command(command):
    """Run a command and return its output."""
    try:
        print(f"Running: {command}")
        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True
        )
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            print(f"Error executing command: {command}")
            print(f"Error message: {stderr.decode('utf-8')}")
            return False
        
        return True
    except Exception as e:
        print(f"Exception while running command: {e}")
        return False

def run_colmap(config):
    """Run the COLMAP pipeline on the input images."""
    # Extract configuration
    paths = config['paths']
    colmap_config = config['colmap']
    
    # Create output directories
    os.makedirs(paths['colmap_dir'], exist_ok=True)
    os.makedirs(os.path.join(paths['colmap_dir'], 'sparse'), exist_ok=True)
    os.makedirs(os.path.join(paths['colmap_dir'], 'dense'), exist_ok=True)
    
    # Database path
    db_path = os.path.join(paths['colmap_dir'], 'database.db')
    
    # 1. Feature extraction
    feature_extractor_cmd = (
        f"colmap feature_extractor "
        f"--database_path {db_path} "
        f"--image_path {paths['input_images_dir']} "
        f"--ImageReader.camera_model {colmap_config['camera_model']} "
    )
    
    if colmap_config['camera_params']:
        feature_extractor_cmd += f"--ImageReader.camera_params {colmap_config['camera_params']} "
    
    if colmap_config['gpu_index'] >= 0:
        feature_extractor_cmd += f"--SiftExtraction.use_gpu 1 --SiftExtraction.gpu_index {colmap_config['gpu_index']}"
    else:
        feature_extractor_cmd += "--SiftExtraction.use_gpu 0"
    
    if not run_command(feature_extractor_cmd):
        print("Feature extraction failed.")
        return False
    
    # 2. Feature matching
    matcher_cmd = (
        f"colmap {colmap_config['matcher']}_matcher "
        f"--database_path {db_path} "
    )
    
    if colmap_config['gpu_index'] >= 0:
        matcher_cmd += f"--SiftMatching.use_gpu 1 --SiftMatching.gpu_index {colmap_config['gpu_index']}"
    else:
        matcher_cmd += "--SiftMatching.use_gpu 0"
    
    if not run_command(matcher_cmd):
        print("Feature matching failed.")
        return False
    
    # 3. Sparse reconstruction - Incremental mapping
    sparse_dir = os.path.join(paths['colmap_dir'], 'sparse')
    mapper_cmd = (
        f"colmap mapper "
        f"--database_path {db_path} "
        f"--image_path {paths['input_images_dir']} "
        f"--output_path {sparse_dir} "
    )
    
    if not run_command(mapper_cmd):
        print("Sparse reconstruction failed.")
        return False
    
    # 4. Convert to dense format for consistency
    os.makedirs(os.path.join(paths['colmap_dir'], 'dense', '0'), exist_ok=True)
    
    # Copy and rename sparse model to match expected format
    sparse_src = os.path.join(sparse_dir, '0')
    dense_model_dir = os.path.join(paths['colmap_dir'], 'dense', '0')
    
    for file_name in ['cameras.bin', 'images.bin', 'points3D.bin']:
        src_path = os.path.join(sparse_src, file_name)
        dst_path = os.path.join(dense_model_dir, file_name)
        if os.path.exists(src_path):
            shutil.copy(src_path, dst_path)
    
    print("COLMAP processing completed successfully.")
    return True

def main():
    parser = argparse.ArgumentParser(description='Run COLMAP processing on a set of images')
    parser.add_argument('-c', '--config', type=str, default='config/pipeline_config.yaml',
                        help='Path to configuration YAML file')
    args = parser.parse_args()
    
    # Load configuration
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)
    
    # Run COLMAP processing
    success = run_colmap(config)
    
    if success:
        print("COLMAP processing completed successfully")
        return 0
    else:
        print("COLMAP processing failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())