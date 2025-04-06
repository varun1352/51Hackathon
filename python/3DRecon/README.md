# 3D Gaussian Splatting Pipeline

This repository contains a complete pipeline for generating 3D point clouds (.ply files) from a set of input images using COLMAP for Structure from Motion (SfM) and 3D Gaussian Splatting for neural rendering.

## Overview

The pipeline consists of three main stages:

1. **COLMAP Processing**: Uses COLMAP to perform Structure from Motion on the input images, estimating camera parameters and generating a sparse 3D point cloud.
2. **Format Conversion**: Converts COLMAP's output format into the format required by 3D Gaussian Splatting.
3. **3D Gaussian Splatting**: Trains a 3D Gaussian Splatting model and exports the resulting point cloud as a PLY file.

## Requirements

### Software Dependencies

- Python 3.8+
- COLMAP (latest version recommended)
- PyTorch 2.0.0+
- CUDA-enabled GPU (for faster processing)

### Python Packages

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### Third-party Dependencies

This pipeline depends on the 3D Gaussian Splatting repository. Clone it into the `third_party` directory:

```bash
mkdir -p third_party
cd third_party
git clone https://github.com/graphdeco-inria/gaussian-splatting.git
cd gaussian-splatting
pip install -e .
cd ../..
```

## Usage

### 1. Prepare Your Images

Place your input images in the `data/images` directory (or specify a different directory in the configuration file).

### 2. Configure the Pipeline

Adjust the configuration in `config/pipeline_config.yaml` as needed. You can customize:

- Input/output paths
- COLMAP settings
- 3D Gaussian Splatting training parameters

### 3. Run the Pipeline

Execute the main script to run the entire pipeline:

```bash
python scripts/run_pipeline.py
```

Or specify a custom configuration file:

```bash
python scripts/run_pipeline.py -c path/to/your/config.yaml
```

### 4. View the Results

After successful completion, you'll find:

- The final 3D point cloud in `output/gaussian/point_cloud.ply`
- Intermediate results in the `output` directory

## Configuration Options

The `pipeline_config.yaml` file contains all the configurable parameters:

### Paths

```yaml
paths:
  input_images_dir: "data/images"   # Directory containing input images
  output_dir: "output"              # Main output directory
  colmap_dir: "output/colmap"       # COLMAP output directory
  gaussian_dir: "output/gaussian"   # 3DGS output directory
  ply_output_path: "output/gaussian/point_cloud.ply"  # Final PLY file path
```

### COLMAP Settings

```yaml
colmap:
  matcher: "exhaustive"             # Feature matcher type
  camera_model: "PINHOLE"           # Camera model
  camera_params: ""                 # Optional camera parameters
  gpu_index: 0                      # GPU index for COLMAP
```

### 3D Gaussian Splatting Settings

```yaml
gaussian_splatting:
  iterations: 7000                  # Training iterations
  densification_interval: 100       # How often to perform densification
  opacity_reset_interval: 3000      # How often to reset opacity
  # ... other parameters ...
```

## Troubleshooting

### Common Issues

1. **COLMAP not found**: Make sure COLMAP is installed and in your PATH.
2. **GPU memory issues**: Reduce image resolution or batch size in the config.
3. **Poor reconstruction quality**: Try more images, better image overlap, or adjust COLMAP parameters.

## License

This project is released under the MIT License. The 3D Gaussian Splatting repository has its own license - please review it for your use case.

## Acknowledgements

This pipeline integrates and builds upon the following outstanding works:

- [COLMAP](https://github.com/colmap/colmap)
- [3D Gaussian Splatting](https://github.com/graphdeco-inria/gaussian-splatting)

