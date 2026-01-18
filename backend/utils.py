from clip import CLIPAnalyzer
import base64
from PIL import Image
import io
clip = CLIPAnalyzer()

def get_clip_score(image : str, prompt: str):
    img_bytes = base64.b64decode(image)
    img = Image.open(io.BytesIO(img_bytes))
    
    results = clip.analyze(img, [prompt, "NOT " + prompt])
    return round(results[prompt]*100)
    