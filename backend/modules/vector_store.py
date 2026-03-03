import os
import chromadb
import google.generativeai as genai
from core.config import GEMINI_API_KEY

# Configure ChromaDB
client = chromadb.PersistentClient(path="./chroma_db")

class GoogleEmbeddingFunction:
    """Custom embedding function for Chroma to use Google's text-embedding-004"""
    def __call__(self, input):
        # input is a list of strings
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not set")
        
        embeddings = []
        for text in input:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document"
            )
            embeddings.append(result['embedding'])
        return embeddings

google_ef = GoogleEmbeddingFunction()
# Get or create chronological collection
collection = client.get_or_create_collection(name="bis_standards", embedding_function=google_ef)

def ingest_text(doc_id: str, text: str, metadata: dict = None):
    # Basic semantic chunking fallback for hackathon (split every 1000 chars)
    # Ideally, replace with Langchain's RecursiveCharacterTextSplitter
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
    
    docs = []
    ids = []
    metadatas = []
    
    for i, chunk in enumerate(chunks):
        docs.append(chunk)
        ids.append(f"{doc_id}_chunk_{i}")
        if metadata:
            metadatas.append(metadata)
        else:
            metadatas.append({"source": doc_id})
            
    if docs:
        collection.add(
            documents=docs,
            metadatas=metadatas,
            ids=ids
        )
    return {"status": "success", "chunks_added": len(docs)}

def search_similar(query: str, top_k: int = 3):
    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )
    # Flatten result array
    documents = results['documents'][0] if results['documents'] else []
    
    return documents
