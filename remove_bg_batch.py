import os
import sys
from rembg import remove, new_session
from PIL import Image
from tqdm import tqdm

def process_sequence(input_dir, output_dir, start_frame=1, end_frame=192):
    print(f"Starting AI background removal from {start_frame} to {end_frame}...")
    
    # Initialize the model session once to speed up batch processing
    # u2net is the standard reliable model for general background removal
    session = new_session("u2net")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for i in tqdm(range(start_frame, end_frame + 1), desc="Processing frames"):
        input_path = os.path.join(input_dir, f"{i}.png")
        output_path = os.path.join(output_dir, f"{i}.png")
        
        if not os.path.exists(input_path):
            print(f"Warning: Frame {i} not found at {input_path}")
            continue
            
        try:
            input_image = Image.open(input_path)
            
            # Remove background
            output_image = remove(input_image, session=session)
            
            # Save the result
            output_image.save(output_path)
            
        except Exception as e:
            print(f"Error processing frame {i}: {e}")

if __name__ == "__main__":
    input_directory = "public/images/ferrari-sequence"
    output_directory = "public/images/ferrari-sequence-transparent"
    process_sequence(input_directory, output_directory)
    print("\nBatch processing complete!")
