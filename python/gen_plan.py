import json
from PIL import Image, ImageDraw

def generate_floorplan_image(json_file='floorplan_data.json', output_file='gt_floorplan.png'):
    # Read the JSON file
    with open(json_file, 'r') as f:
        floorplan_data = json.load(f)
    
    # Extract points
    points = floorplan_data['points']
    dims = floorplan_data['dimensions']
    
    # Create a new white image with fixed size
    width, height = 1000, 800  # Increased canvas size
    
    # Create image with white background
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    
    # Calculate offsets to center the floorplan
    min_x = dims['min_x']
    min_y = dims['min_y']
    
    # Calculate centering offsets
    center_x = (width - dims['width_pixels']) // 2
    center_y = (height - dims['height_pixels']) // 2
    
    # Adjust points to be centered
    adjusted_points = [
        (
            int((p[0] - min_x) + center_x), 
            int((p[1] - min_y) + center_y)
        ) for p in points
    ]
    
    # Draw the outline
    draw.polygon(adjusted_points, outline='black', fill=None)
    
    # Draw points
    point_radius = 3
    for point in adjusted_points:
        draw.ellipse([
            point[0] - point_radius, 
            point[1] - point_radius, 
            point[0] + point_radius, 
            point[1] + point_radius
        ], fill='red')
    
    # Save the image
    image.save(output_file)
    print(f"Centered floorplan image saved as {output_file}")
    
    # Return dimensions for reference
    return width, height

def main():
    generate_floorplan_image()

if __name__ == "__main__":
    main()