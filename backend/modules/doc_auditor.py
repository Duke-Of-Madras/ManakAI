import google.generativeai as genai
from pypdf import PdfReader
import io
from core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def analyze_document(pdf_bytes: bytes) -> str:
    # Extract text from PDF
    reader = PdfReader(io.BytesIO(pdf_bytes))
    extracted_text = ""
    for page in reader.pages:
        extracted_text += page.extract_text() + "\n"
        
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    prompt = (
        "Identify skill gaps in this curriculum compared to the 2026 India AI Sutra guidelines. "
        "List what is missing and provide actionable recommendations. "
        "Format the output strictly with headings for: Identified Gaps, Compliant Areas, Upgrades Recommended."
    )
    
    response = model.generate_content([prompt, extracted_text])
    return response.text
