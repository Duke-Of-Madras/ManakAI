import google.generativeai as genai
from PIL import Image
import io
from core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def analyze_image(image_bytes: bytes, place_name: str = "Unknown Facility") -> str:
    # Convert bytes to PIL Image for Gemini
    image = Image.open(io.BytesIO(image_bytes))
    
    prompt = (
        f"The user indicates this area is a '{place_name}'. "
        "Audit this facility against IS 15700 and related BIS infrastructure standards. "
        "Identify safety assets, accessibility provisions, and spatial layout. Cite any missing requirements or gaps. "
        "Return the output in a structured format highlighting: 1) Confirmed Facility Type, 2) Compliance Score (out of 100), 3) Compliance Status, 4) Detected Assets, and 5) BIS Clause Violations."
    )
    
    # Try in order of preference; each model has its own separate daily quota
    models = ["models/gemini-2.5-flash", "models/gemini-2.0-flash-lite", "models/gemini-2.0-flash"]
    
    for i, model_name in enumerate(models):
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content([prompt, image])
            return response.text
        except Exception as e:
            is_quota_error = "429" in str(e)
            is_last_model = i == len(models) - 1
            
            if is_quota_error and not is_last_model:
                print(f"Gemini API 429 quota exceeded on {model_name}, trying next model...")
                continue
            
            print(f"Gemini API Error on {model_name}: {str(e)}")
            return f"""
**API CONNECTION ERROR 📡**

The backend failed to connect to the Gemini API Servers. 

**Diagnostic Error:**
`{str(e)}`

*If you are seeing a 503 Unavailable / TCP Stream Error, your current Wi-Fi network (or proxy) is strictly blocking the traffic. Please switch to a mobile hotspot or different network and try again to get your genuine AI analysis.*
"""
    
    return "All Gemini models quota exceeded. Please try again tomorrow or upgrade to a paid API key."
