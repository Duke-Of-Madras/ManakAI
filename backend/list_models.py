import google.generativeai as genai

API_KEY = "AIzaSyBSeO3HZwORIMv6pAow03tvy1nlQo5aLow"
genai.configure(api_key=API_KEY)

print("Available Models:")
for m in genai.list_models():
    print(m.name)
