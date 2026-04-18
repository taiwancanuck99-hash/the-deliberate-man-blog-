import json
import os
from PIL import Image, ImageDraw, ImageFont

# --- CONFIGURATION ---
WIDTH = 1080
HEIGHT = 1350
BG_COLOR = "#0A0A0A"
GOLD_COLOR = "#C8AA6E"
WHITE_COLOR = "#FFFFFF"

# Paths
FONTS_DIR = "fonts"
OUTPUT_DIR = "output"
DATA_FILE = "slides.json"

# Make output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load Fonts
def get_font(font_path, size):
    try:
        # For .ttc (TrueType Collection), Pillow can load them
        # Sometimes index needs to be specified if it's a collection, but default usually works
        return ImageFont.truetype(font_path, size)
    except IOError:
        print(f"Error loading font: {font_path}. Using default.")
        return ImageFont.load_default()

font_title = get_font("/System/Library/Fonts/Times.ttc", 90)
font_title_large = get_font("/System/Library/Fonts/Times.ttc", 110)
font_subtitle = get_font("/System/Library/Fonts/Helvetica.ttc", 55)
font_body = get_font("/System/Library/Fonts/Helvetica.ttc", 60)

# Load data
try:
    with open(DATA_FILE, "r") as f:
        slides = json.load(f)
except FileNotFoundError:
    print(f"Could not find {DATA_FILE}")
    exit(1)

def draw_text_centered(draw, text, font, color, y_start):
    text_width, text_height = draw.textbbox((0, 0), text, font=font)[2:]
    x = (WIDTH - text_width) / 2
    draw.text((x, y_start), text, font=font, fill=color)
    return y_start + text_height

for index, slide in enumerate(slides):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    if slide.get("is_title_slide", False):
        # --- TITLE SLIDE LAYOUT ---
        current_y = 250
        
        # Title (allow multiple lines)
        title_lines = slide.get("title", "").split("\n")
        for i, line in enumerate(title_lines):
            color = GOLD_COLOR if i == 0 else WHITE_COLOR
            current_y = draw_text_centered(draw, line, font_title_large, color, current_y)
            current_y += 20 # Line spacing

        current_y += 60 # Space before subtitle

        # Subtitle
        if slide.get("subtitle"):
            draw_text_centered(draw, slide["subtitle"], font_subtitle, GOLD_COLOR, current_y)

    else:
        # --- CONTENT SLIDE LAYOUT ---
        current_y = 150
        
        # Title
        title_lines = slide.get("title", "").split("\n")
        for line in title_lines:
            current_y = draw_text_centered(draw, line, font_title, GOLD_COLOR, current_y)
            current_y += 10
            
        current_y += 40
        
        # Gold Line
        line_y = current_y
        line_length = 800
        x_start = (WIDTH - line_length) / 2
        x_end = x_start + line_length
        draw.line([(x_start, line_y), (x_end, line_y)], fill=GOLD_COLOR, width=4)
        
        current_y += 80 # Space after line
        
        # Body text (left aligned, but indented)
        x_padding = 100
        for line in slide.get("body", []):
            draw.text((x_padding, current_y), line, font=font_body, fill=WHITE_COLOR)
            current_y += 110 # Spacing between bullet points/paragraphs

    # Save image
    output_path = os.path.join(OUTPUT_DIR, f"slide_{index + 1:02d}.png")
    img.save(output_path)
    print(f"Generated {output_path}")

print("Done! All slides generated successfully.")
