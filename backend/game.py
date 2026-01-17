import torch
import requests
import time
import random
from PIL import Image
from io import BytesIO
from transformers import CLIPProcessor, CLIPModel

# 1. Setup Model
print("Loading model... (this may take a moment)")
model_id = "openai/clip-vit-base-patch32"
model = CLIPModel.from_pretrained(model_id)
processor = CLIPProcessor.from_pretrained(model_id)

def load_prompts(filename="prompts.txt"):
    """Parses the text file into a list of (Target, [Anti-Prompts]) tuples."""
    categories = []
    try:
        with open(filename, "r") as f:
            # Split by double newlines to get groups
            groups = f.read().strip().split("\n\n")
            for group in groups:
                lines = [line.strip() for line in group.split("\n") if line.strip()]
                if len(lines) >= 2:
                    target = lines[0]
                    antis = lines[1:]
                    categories.append((target, antis))
    except FileNotFoundError:
        print(f"Error: {filename} not found. Please create it!")
        return []
    return categories

def play_round(target_object, anti_prompt):
    print(f"\n" + "="*40)
    print(f"🎯 TARGET: {target_object.upper()}")
    print(f"🚫 AVOID:  {anti_prompt}")
    print("="*40)
    print("Find an image URL and paste it below.")
    
    start_time = time.time()
    url = input("\nURL: ")
    end_time = time.time()
    elapsed = end_time - start_time
    
    try:
        # Fetch Image
        response = requests.get(url, timeout=10)
        image = Image.open(BytesIO(response.content)).convert("RGB")
        
        # Analyze with CLIP
        # Using the specific anti-prompt from your text file
        text_queries = [f"a photo of {target_object}", f"a photo of {anti_prompt}"]
        
        inputs = processor(text=text_queries, images=image, return_tensors="pt", padding=True)
        
        with torch.no_grad():
            outputs = model(**inputs)
        
        probs = outputs.logits_per_image.softmax(dim=1)
        match_confidence = probs[0][0].item() 
        
        print(f"\n⏱️  Time: {elapsed:.2f}s")
        print(f"📊 Confidence: {match_confidence*100:.2f}%")
        
        if match_confidence > 0.65:
            print("✅ SUCCESS! Great find.")
        else:
            print("❌ FAIL! CLIP thinks this looks more like the anti-prompt.")
            
    except Exception as e:
        print(f"⚠️ Error: {e}")

if __name__ == "__main__":
    db = load_prompts()
    
    if not db:
        print("No prompts found. Exiting.")
    else:
        while True:
            # Pick a random category and then a random anti-prompt from that category
            target, antis = random.choice(db)
            anti_prompt = random.choice(antis)
            
            play_round(target, anti_prompt)
            
            cont = input("\nPlay again? (y/n): ")
            if cont.lower() != 'y':
                print("Thanks for playing!")
                break