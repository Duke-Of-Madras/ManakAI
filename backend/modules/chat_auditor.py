import google.generativeai as genai
from modules.vector_store import search_similar

def query_wiki(user_question: str) -> str:
    """
    1. Retrieve logic searches vector store for top 3 clauses
    2. Augmented Prompt feeds to Gemini 1.5 Flash
    """
    
    # --- The Retrieval Logic ---
    retrieved_docs = search_similar(user_question, top_k=3)
    
    context = "\n\n".join(retrieved_docs) if retrieved_docs else "No specific clauses found in the Knowledge Base."
    
    # --- The Augmented Prompt (The Secret Sauce) ---
    system_instruction = (
        "You are a BIS-Certified Auditor. Use ONLY the provided standard clauses to answer. "
        "Always cite the IS code and Clause number (e.g., IS 15700:2018 Clause 5.2). "
        "If the answer is not in the context, state that you cannot answer based on current standards."
    )
    
    prompt = f"""
    Context (Standard Clauses):
    {context}
    
    User Question:
    {user_question}
    """
    
    model = genai.GenerativeModel(
        model_name="models/gemini-2.5-flash",
        system_instruction=system_instruction
    )
    
    response = model.generate_content(prompt)
    return response.text
