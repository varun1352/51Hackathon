
# Multi-Component 3D Processing & Surveillance System

This repository contains two main components:

1. **Python Processing Tools**  
   Scripts and utilities to process 3D scans (PLY files), extract floorplans and wall plans, and generate boundaries.  
   - **Location:** `python/`
   - **Key Files & Folders:**
     - `SafetyGauss.py`: (Describe what it does, e.g., safety processing for scan data)
     - `boundary_generator.py`: Generates boundaries (e.g., convex hull, etc.)
     - `boundary_output/`: Contains output boundary files (DXF, PNG)
     - `delivery_area/`: Contains raw scan data, such as `scan1.ply`, `scan2.ply` and alignment files. **Note:** This folder is kept empty in the repository; add your own scans if needed.
     - `downsampler.py`: Downsampling tool for PLY point clouds.
     - `extract_floorplan.py` & `extract_wallplan.py`: Scripts to extract floor and wall plans from point cloud data.
     - `output.ply` and `output_folder/`: Final generated outputs (including images, CSVs, DXFs, etc.)
     - `requirements.txt`: Python dependencies.
   - **Setup:**
     1. Ensure you have [Python 3](https://www.python.org/downloads/) installed.
     2. Create a virtual environment (optional but recommended):
        ```bash
        cd python
        python -m venv venv
        source venv/bin/activate  # On Windows use `venv\Scripts\activate`
        ```
     3. Install dependencies:
        ```bash
        pip install -r requirements.txt
        ```
     4. **Note:** The `delivery_area` folder is ignored so it will be empty on clone. To run the processing scripts, place your own scan files (e.g., `.ply` files) into `python/delivery_area/scan_clean/` or use the provided sample `scan1.ply` (if applicable).

2. **Surveillance System (Web Application)**  
   A Next.js application that includes various components, such as a 3D viewer, floorplan viewer, measurement tools, and more.
   - **Location:** `surveillance-system/`
   - **Key Folders & Files:**
     - `app/`: Next.js pages organized by route (including about, contact, login, etc.).
     - `components/`: Contains React components such as `three-d-viewer.tsx` (which likely integrates the 3D PLY viewer), `floorplan-viewer.tsx`, and various UI components.
     - `public/`: Contains static assets including an `output.ply` file (for testing the viewer), images, etc.
     - `styles/` & configuration files: Global styles, Tailwind configuration, TypeScript configuration, etc.
   - **Setup:**
     1. Make sure you have [Node.js](https://nodejs.org/) installed (LTS version is recommended).
     2. From the `surveillance-system/` directory, install dependencies using your preferred package manager:
        ```bash
        # Using npm
        npm install
        # or using pnpm
        pnpm install
        # or using yarn
        yarn install
        ```
     3. Run the development server:
        ```bash
        npm run dev
        ```
     4. Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Project Structure Overview

```
.
├── python
│   ├── SafetyGauss.py
│   ├── boundary_generator.py
│   ├── boundary_output
│   │   ├── outer_boundary_convex_hull.dxf
│   │   └── outer_boundary_convex_hull.png
│   ├── check.html
│   ├── delivery_area
│   │   └── scan_clean
│   │       ├── scan1.ply
│   │       ├── scan2.ply
│   │       └── scan_alignment.mlp
│   ├── delivery_area_scan_clean.7z
│   ├── downsampler.py
│   ├── extract_floorplan.py
│   ├── extract_wallplan.py
│   ├── output.ply
│   ├── output_folder
│   │   ├── clean_grid.png
│   │   ├── final_boundary.png
│   │   ├── floorplan_simplified_with_dims.dxf
│   │   ├── outer_boundary.dxf
│   │   ├── raw_grid.png
│   │   ├── wall_contours_comparison.png
│  │   ├── wall_floorplan_grid_processed.csv
│  │   ├── wall_floorplan_processed.png
│  │   └── wall_points.ply
│  ├── requirements.txt
│  └── scan1.ply
└── surveillance-system
    ├── app
    │  ├── about
    │  │   └── page.tsx
    │  ├── b2b
    │  │   ├── dashboard
    │  │   │   └── page.tsx
    │  │   ├── demo
    │  │   │   └── page.tsx
    │  │   └── page.tsx
    │   ├── contact
    │  │   └── page.tsx
    │  ├── d2c
    │  │   ├── dashboard
    │  │   │   └── page.tsx
    │  │   ├── demo
    │  │   │   └── page.tsx
    │  │   └── page.tsx
    │  ├── faq
    │  │   └── page.tsx
    │  ├── forgot-password
    │  │   └── page.tsx
    │  ├── globals.css
    │  ├── how-it-works
    │  │   └── page.tsx
    │  ├── layout.tsx
    │  ├── login
    │  │   └── page.tsx
    │  ├── page.tsx
    │  ├── pricing
    │  │   └── page.tsx
    │  └── signup
    │     └── page.tsx
    ├── components
    │  ├── cta-section.tsx
    │  ├── features-section.tsx
    │  ├── floorplan-viewer.tsx
    │  ├── hero-section.tsx
    │  ├── main-nav.tsx
    │  ├── measurement-tool.tsx
    │  ├── site-footer.tsx
    │  ├── theme-provider.tsx
    │  ├── three-d-viewer.tsx
    │  └── ui
    │      ├── accordion.tsx
    │      ├── alert-dialog.tsx
    │      ├── alert.tsx
    │      ├── aspect-ratio.tsx
    │      ├── avatar.tsx
    │      |── badge.tsx
    │      ├── breadcrumb.tsx
    │      ├── button.tsx
    │      ├── calendar.tsx
    │      ├── card.tsx
    │      ├── carousel.tsx
    │      ├── chart.tsx
    │       ├── checkbox.tsx
    │      ├── collapsible.tsx
    │      ├── command.tsx
    │      ├── context-menu.tsx
    │      ├── dialog.tsx
    │      ├── drawer.tsx
    │      ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── spinner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       ├── tooltip.tsx
    │       ├── use-mobile.tsx
    │       └── use-toast.ts
    ├── components.json
    ├── hooks
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib
    │   └── utils.ts
    ├── next-env.d.ts
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── public
    │   ├── final_boundary.png
    │   ├── images
    │   │   └── floorplan_example.png
    │   ├── output.ply
    │   ├── placeholder-logo.png
    │   ├── placeholder-logo.svg
    │   ├── placeholder-user.jpg
    │   ├── placeholder.jpg
    │   └── placeholder.svg
    ├── styles
    │   └── globals.css
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## How to Recreate/Set Up the Project

1. **Clone the Repository**  
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Python Environment Setup**  
   - Navigate to the `python/` folder.
   - (Optional) Create and activate a virtual environment.
   - Install dependencies with:
     ```bash
     pip install -r requirements.txt
     ```
   - If you plan to run processing scripts, add your PLY scan files to the `python/delivery_area/scan_clean/` folder. (The folder is empty by default to avoid tracking large files.)

3. **Web Application Setup (Surveillance System)**  
   - Navigate to the `surveillance-system/` folder.
   - Install Node.js dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Version Control & Skipped Files**  
   - The `.gitignore` file is set to skip:
     - `node_modules/`
     - All `.7z` files (e.g., `delivery_area_scan_clean.7z`)
     - Contents of the `python/delivery_area/` folder (while keeping the folder structure empty)
   - This keeps the repository lightweight and only tracks source files. To add new scan data locally, place them in `python/delivery_area/scan_clean/`.

---

## .gitignore

Below is the content of the `.gitignore` for this project:

```gitignore
# Node.js dependencies
node_modules/

# Python virtual environments
venv/
__pycache__/
*.py[cod]

# Archives
*.7z

# Delivery area scans (do not track large scan files)
python/delivery_area/*
# If you want to keep an empty folder in the repo, add an empty .gitkeep file inside delivery_area/scan_clean
!python/delivery_area/scan_clean/.gitkeep

# Logs and temporary files
*.log
.DS_Store
```

---

## Additional Notes

- **Modifying the PLY Viewer:**  
  The 3D viewer code (in the web app) is set up to parse both ASCII and binary PLY files. If you encounter issues with output (e.g., points not displaying), check the file’s header and property order. Adjust the parser accordingly.

- **Contributing & Issues:**  
  Feel free to open an issue or a pull request if you have suggestions or bug fixes.

