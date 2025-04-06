import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import json
import math

class FloorplanEditor:
    def __init__(self, master):
        self.master = master
        master.title("Floorplan Editor")
        
        # Image and points
        self.original_image = None
        self.displayed_image = None
        self.points = []
        self.scale_reference = None
        
        # Create canvas
        self.canvas = tk.Canvas(master, width=800, height=600)
        self.canvas.pack(expand=tk.YES, fill=tk.BOTH)
        
        # Create buttons frame
        self.button_frame = tk.Frame(master)
        self.button_frame.pack(fill=tk.X)
        
        # Create buttons
        buttons = [
            ("Load Image", self.load_image),
            ("Draw Mode: OFF", self.toggle_draw_mode),
            ("Clear Points", self.clear_points),
            ("Set Scale", self.set_scale),
            ("Save Floorplan", self.save_floorplan)
        ]
        
        for text, command in buttons:
            btn = tk.Button(self.button_frame, text=text, command=command)
            btn.pack(side=tk.LEFT, expand=True, fill=tk.X)
        
        # Drawing mode flag
        self.draw_mode = False
        
        # Bind mouse events
        self.canvas.bind('<Button-1>', self.on_canvas_click)
    
    def load_image(self):
        # Open file dialog to choose image
        file_path = filedialog.askopenfilename(
            filetypes=[
                ("Image files", "*.png *.jpg *.jpeg *.bmp *.gif"),
                ("All files", "*.*")
            ]
        )
        
        if not file_path:
            return
        
        # Read image
        self.original_image = Image.open(file_path)
        
        # Resize image to fit canvas while maintaining aspect ratio
        canvas_width = 800
        canvas_height = 600
        img_width, img_height = self.original_image.size
        scale = min(canvas_width/img_width, canvas_height/img_height)
        
        new_width = int(img_width * scale)
        new_height = int(img_height * scale)
        
        resized_image = self.original_image.resize((new_width, new_height), Image.LANCZOS)
        
        # Convert to PhotoImage
        self.displayed_image = ImageTk.PhotoImage(resized_image)
        
        # Display on canvas
        self.canvas.delete("all")
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.displayed_image)
        
        # Reset points and scale
        self.points = []
        self.scale_reference = None
    
    def toggle_draw_mode(self):
        self.draw_mode = not self.draw_mode
        # Update button text
        self.button_frame.winfo_children()[1].config(
            text=f"Draw Mode: {'ON' if self.draw_mode else 'OFF'}"
        )
    
    def on_canvas_click(self, event):
        if not self.draw_mode:
            return
        
        # Draw a point on the canvas
        point_radius = 5
        self.canvas.create_oval(
            event.x - point_radius, 
            event.y - point_radius, 
            event.x + point_radius, 
            event.y + point_radius, 
            fill='red'
        )
        
        # Store the point
        self.points.append((event.x, event.y))
    
    def clear_points(self):
        # Clear points from canvas
        self.canvas.delete("all")
        
        # Redraw the image if it exists
        if self.displayed_image:
            self.canvas.create_image(0, 0, anchor=tk.NW, image=self.displayed_image)
        
        # Reset points list
        self.points = []
        self.scale_reference = None
    
    def set_scale(self):
        if len(self.points) < 2:
            messagebox.showwarning("Warning", "Please select at least 2 points to set scale!")
            return
        
        # Let user input the real-world distance
        scale_dialog = tk.Toplevel(self.master)
        scale_dialog.title("Set Scale")
        
        tk.Label(scale_dialog, text="Enter real-world distance (in meters):").pack()
        distance_entry = tk.Entry(scale_dialog)
        distance_entry.pack()
        
        def confirm_scale():
            try:
                real_distance = float(distance_entry.get())
                # Calculate pixel distance between first two points
                x1, y1 = self.points[0]
                x2, y2 = self.points[1]
                pixel_distance = math.sqrt((x2-x1)**2 + (y2-y1)**2)
                
                # Store scale reference
                self.scale_reference = {
                    'pixel_distance': pixel_distance,
                    'real_distance': real_distance
                }
                
                messagebox.showinfo("Scale Set", f"1 pixel = {real_distance/pixel_distance:.4f} meters")
                scale_dialog.destroy()
            except ValueError:
                messagebox.showerror("Error", "Please enter a valid number")
        
        tk.Button(scale_dialog, text="Confirm", command=confirm_scale).pack()
    
    def save_floorplan(self):
        if not self.points:
            messagebox.showwarning("Warning", "No points selected!")
            return
        
        # Calculate bounding box
        x_coords = [p[0] for p in self.points]
        y_coords = [p[1] for p in self.points]
        
        min_x, max_x = min(x_coords), max(x_coords)
        min_y, max_y = min(y_coords), max(y_coords)
        
        # Calculate dimensions
        width = max_x - min_x
        height = max_y - min_y
        
        # Prepare output
        result = {
            "points": self.points,
            "dimensions": {
                "width_pixels": width,
                "height_pixels": height,
                "min_x": min_x,
                "max_x": max_x,
                "min_y": min_y,
                "max_y": max_y
            }
        }
        
        # Add scale information if set
        if self.scale_reference:
            result["scale"] = self.scale_reference
            # Calculate real-world dimensions
            pixels_per_meter = self.scale_reference['pixel_distance'] / self.scale_reference['real_distance']
            result["dimensions"]["width_meters"] = width / pixels_per_meter
            result["dimensions"]["height_meters"] = height / pixels_per_meter
        
        # Save to file
        with open("floorplan_data.json", "w") as f:
            json.dump(result, f, indent=4)
        
        messagebox.showinfo(
            "Saved", 
            f"Floorplan data saved!\nWidth: {width} pixels\nHeight: {height} pixels"
        )

def main():
    root = tk.Tk()
    root.geometry("850x700")
    app = FloorplanEditor(root)
    root.mainloop()

if __name__ == "__main__":
    main()