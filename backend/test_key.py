import sys
import google.generativeai as genai

API_KEY = "AIzaSyBSeO3HZwORIMv6pAow03tvy1nlQo5aLow"

try:
    print(f"Testing key: {API_KEY[:10]}...")
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Hello")
    print("SUCCESS! Model responded:", response.text)
except Exception as e:
    print("FAILED:", str(e))
