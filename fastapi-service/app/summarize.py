import os
import tempfile
from pathlib import Path
import git
import numpy as np
import faiss
import json
from sentence_transformers import SentenceTransformer
import openai
from dotenv import load_dotenv

load_dotenv()

"""
RAG-powered, role-aware GitHub repo summarizer (Groq LLM) - FIXED VERSION
-----------------------------------------------------------------
1. 🔍 Retrieve top-K code chunks per role.
2. ✂️  Compress each chunk individually (≤ 120 tokens output).
3. 🧠  Send the concatenated mini-summaries to Groq model for final role
    summary (≤ 300 tokens output).
"""

# ================== CONFIG ==================
GROQ_MODEL = "llama3-8b-8192"  # Options: llama3-8b-8192, mixtral-8x7b-32768, gemma-7b-it
CHUNK_SIZE   = 800   # words-ish per raw chunk
MAX_CHUNKS   = 1200  # repo cap
TOP_K        = 10    # retrieved chunks per role (increased from 8)
CHUNK_SUM_TOKENS = 150   # output tokens per mini‑summary (increased from 120)
FINAL_SUM_TOKENS = 400   # output tokens per role summary (increased from 300)

ROLE_PROMPTS = {
    "Backend": """
    Analyze this codebase from a backend engineering perspective. Focus on:
    - Server-side architecture and design patterns
    - API endpoints, routes, and controllers
    - Database models, schemas, and data access layers
    - Authentication, authorization, and security measures
    - Middleware, services, and business logic
    - Configuration, environment setup, and deployment considerations
    Provide a comprehensive technical overview that would help a backend engineer understand the system.
    """,
    
    "Frontend": """
    Analyze this codebase from a frontend development perspective. Focus on:
    - UI components, layouts, and user interface design
    - Frontend frameworks (React, Vue, Angular) and their usage
    - State management patterns and data flow
    - API integration and data fetching strategies
    - Styling approaches (CSS, styled-components, utility frameworks)
    - Routing, navigation, and user experience flows
    - Build tools, bundling, and frontend optimization techniques
    Provide insights that would help a frontend developer understand the user-facing aspects.
    """,
    
    "AI_Engineer": """
    Analyze this codebase from an AI/ML engineering perspective. Focus on:
    - Machine learning models, algorithms, and implementations
    - Data preprocessing, feature engineering, and data pipelines
    - Training scripts, model optimization, and hyperparameter tuning
    - Model inference, deployment, and serving infrastructure
    - Data science workflows, experimentation, and model evaluation
    - AI/ML libraries and frameworks usage (PyTorch, TensorFlow, scikit-learn)
    - MLOps practices, model versioning, and monitoring
    Highlight any AI/ML components and data-driven functionality.
    """,
    
    "Product_Manager": """
    Analyze this codebase from a product management perspective. Focus on:
    - Overall product functionality and user-facing features
    - Business logic and value propositions
    - User workflows and customer journey implementations
    - Integration points and third-party services
    - Scalability considerations and technical debt
    - Development complexity and maintenance requirements
    - Market positioning and competitive advantages reflected in the code
    Explain in business terms how the technical implementation serves user needs and business goals.
    """
}

ROLE_QUERIES = {
    "Backend": "server api controller route database model schema authentication middleware service business logic backend",
    "Frontend": "react vue angular component jsx tsx html css ui frontend interface routing state management",
    "AI_Engineer": "machine learning model training data science pytorch tensorflow sklearn preprocessing feature pipeline ml ai",
    "Product_Manager": "feature functionality user business workflow integration service product application main core"
}

# ================== INIT MODELS ==================
print("🔧 Loading MiniLM embedder …")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
print("✅ Embedder loaded.")

# ================== HELPERS ==================

def clone_repo(repo_url: str, branch: str = "main") -> str:
    """Clone repository to temporary directory"""
    tmp = tempfile.mkdtemp(prefix="repo_")
    try:
        git.Repo.clone_from(repo_url, tmp, branch=branch)
        print(f"✅ Repository cloned to {tmp}")
        return tmp
    except Exception as e:
        print(f"❌ Error cloning repository: {str(e)}")
        raise


def get_code_files(root: str, exts=(
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".go", ".cpp", ".c", 
    ".rb", ".cs", ".php", ".html", ".css", ".vue", ".svelte", ".rs", 
    ".swift", ".kt", ".scala", ".R", ".sql", ".yml", ".yaml", ".json")):
    """Get all code files from repository"""
    files = []
    for p in Path(root).rglob("*"):
        if (p.suffix.lower() in exts and p.is_file() and 
            not any(skip in str(p) for skip in ['.git', 'node_modules', '__pycache__', '.env', 'dist', 'build'])):
            files.append(p)
    print(f"📁 Found {len(files)} code files")
    return files


def chunk_text(txt: str, limit: int = CHUNK_SIZE):
    """Split text into chunks with word limit"""
    if not txt.strip():
        return []
    
    buf, out = "", []
    lines = txt.splitlines()
    
    for ln in lines:
        line_words = len(ln.split())
        buf_words = len(buf.split())
        
        if buf_words + line_words < limit:
            buf += ln + "\n"
        else:
            if buf.strip():
                out.append(buf.strip())
            buf = ln + "\n"
    
    if buf.strip():
        out.append(buf.strip())
    
    return [chunk for chunk in out if len(chunk.strip()) > 50]  # Filter very small chunks


def build_index(chunks):
    """Build FAISS index for semantic search"""
    if not chunks:
        return None
    
    print(f"🔧 Building FAISS index for {len(chunks)} chunks...")
    vecs = embedder.encode(chunks, convert_to_tensor=False, show_progress_bar=True).astype("float32")
    faiss_idx = faiss.IndexFlatL2(vecs.shape[1])
    faiss_idx.add(vecs)
    print("✅ FAISS index built successfully")
    return faiss_idx


def retrieve(query: str, chunks, idx, k=TOP_K):
    """Retrieve top-k most relevant chunks for query"""
    if not chunks or idx is None:
        return []
    
    # Expand query with synonyms for better retrieval
    expanded_query = f"{query} code implementation development programming software"
    qvec = embedder.encode([expanded_query]).astype("float32")
    _, ids = idx.search(qvec, min(k, len(chunks)))
    
    retrieved_chunks = [chunks[i] for i in ids[0] if i < len(chunks)]
    print(f"🔍 Retrieved {len(retrieved_chunks)} chunks for query: {query[:50]}...")
    return retrieved_chunks


def generate(prompt: str, max_tokens: int):
    """Generate text using Groq API"""
    try:
        client = openai.OpenAI(
            api_key=os.environ.get('GROQ_API_KEY'),
            base_url="https://api.groq.com/openai/v1"
        )
        
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        
        result = response.choices[0].message.content.strip()
        print(f"✅ Generated {len(result)} characters of text")
        return result
        
    except Exception as e:
        error_msg = f"[Groq API Error: {str(e)}]"
        print(f"❌ {error_msg}")
        return error_msg


def summarise_for_role(role: str, chunks):
    """Generate hierarchical summary for specific role"""
    if not chunks:
        return f"No relevant code found for {role}. The repository may not contain components typically relevant to this role."
    
    print(f"📝 Generating summary for {role} using {len(chunks)} chunks...")
    
    # Generate mini-summaries for each chunk
    mini_summaries = []
    for i, chunk in enumerate(chunks):
        print(f"  Processing chunk {i+1}/{len(chunks)}...")
        mini_prompt = f"""
        As a {role}, analyze this code snippet and provide a concise technical summary:
        
        Code:
        {chunk}
        
        Focus on aspects most relevant to {role}. Be specific about technologies, patterns, and functionality.
        """
        mini_summary = generate(mini_prompt, CHUNK_SUM_TOKENS)
        if mini_summary and not mini_summary.startswith("[Groq API Error"):
            mini_summaries.append(mini_summary)
    
    if not mini_summaries:
        return f"Unable to generate summary for {role} due to API issues."
    
    # Combine mini-summaries into final summary
    combined_insights = "\n\n".join(mini_summaries)
    
    final_prompt = f"""
    {ROLE_PROMPTS[role]}
    
    Based on the following code analysis insights, provide a comprehensive summary:
    
    {combined_insights}
    
    Structure your response to give {role} a clear understanding of:
    1. Key technologies and frameworks used
    2. Architecture and design patterns
    3. Main functionality and features
    4. Areas of particular interest for your role
    5. Recommendations or observations
    
    Be thorough but concise, focusing on actionable insights.
    """
    
    final_summary = generate(final_prompt, FINAL_SUM_TOKENS)
    print(f"✅ Final summary generated for {role}")
    return final_summary


# ================== PIPELINE ==================

def summarize_repo_for_role(repo_url: str, branch: str = "main", role: str = None) -> str:
    """Generate summary for a specific role only"""
    if role and role not in ROLE_PROMPTS:
        return f"Error: Invalid role '{role}'. Available roles: {list(ROLE_PROMPTS.keys())}"
    
    print(f"\n🚀 Starting analysis of {repo_url} @ branch '{branch}' for role: {role}")
    
    try:
        # Clone repository
        repo_path = clone_repo(repo_url, branch)
        
        # Get all code files
        files = get_code_files(repo_path)
        if not files:
            return "Error: No code files found in repository"
        
        # Extract and chunk code
        raw_chunks = []
        for i, fp in enumerate(files):
            if len(raw_chunks) >= MAX_CHUNKS:
                print(f"⚠️ Reached maximum chunk limit ({MAX_CHUNKS}), stopping file processing")
                break
                
            try:
                print(f"📄 Processing file {i+1}/{len(files)}: {fp.name}")
                txt = Path(fp).read_text(encoding="utf-8", errors="ignore")
                file_chunks = chunk_text(txt)
                
                # Add file context to chunks
                contextualized_chunks = []
                for chunk in file_chunks:
                    context_chunk = f"File: {fp.name}\nPath: {str(fp.relative_to(repo_path))}\n\n{chunk}"
                    contextualized_chunks.append(context_chunk)
                
                raw_chunks.extend(contextualized_chunks)
                
            except Exception as e:
                print(f"⚠️ Error processing {fp}: {str(e)}")
                continue
        
        print(f"📊 Total chunks created: {len(raw_chunks)}")
        
        if not raw_chunks:
            return "Error: No valid code chunks could be extracted"
        
        # Build semantic search index
        idx = build_index(raw_chunks)
        if idx is None:
            return "Error: Failed to build search index"
        
        # Generate summary for the specific role only
        print(f"\n🎯 Processing role: {role}")
        
        # Retrieve relevant chunks for this role
        top_chunks = retrieve(ROLE_QUERIES[role], raw_chunks, idx)
        
        # Generate role-specific summary
        role_summary = summarise_for_role(role, top_chunks)
        
        print(f"✅ Summary completed for {role}")
        return role_summary
        
    except Exception as e:
        error_msg = f"Pipeline error: {str(e)}"
        print(f"❌ {error_msg}")
        return error_msg


def summarize_repo(repo_url: str, branch: str = "main") -> dict:
    """Main pipeline to generate role-specific summaries - DEPRECATED
    Use summarize_repo_for_role instead for single role processing"""
    print(f"\n🚀 Starting analysis of {repo_url} @ branch '{branch}'")
    
    try:
        # Clone repository
        repo_path = clone_repo(repo_url, branch)
        
        # Get all code files
        files = get_code_files(repo_path)
        if not files:
            return {"error": "No code files found in repository"}
        
        # Extract and chunk code
        raw_chunks = []
        for i, fp in enumerate(files):
            if len(raw_chunks) >= MAX_CHUNKS:
                print(f"⚠️ Reached maximum chunk limit ({MAX_CHUNKS}), stopping file processing")
                break
                
            try:
                print(f"📄 Processing file {i+1}/{len(files)}: {fp.name}")
                txt = Path(fp).read_text(encoding="utf-8", errors="ignore")
                file_chunks = chunk_text(txt)
                
                # Add file context to chunks
                contextualized_chunks = []
                for chunk in file_chunks:
                    context_chunk = f"File: {fp.name}\nPath: {str(fp.relative_to(repo_path))}\n\n{chunk}"
                    contextualized_chunks.append(context_chunk)
                
                raw_chunks.extend(contextualized_chunks)
                
            except Exception as e:
                print(f"⚠️ Error processing {fp}: {str(e)}")
                continue
        
        print(f"📊 Total chunks created: {len(raw_chunks)}")
        
        if not raw_chunks:
            return {"error": "No valid code chunks could be extracted"}
        
        # Build semantic search index
        idx = build_index(raw_chunks)
        if idx is None:
            return {"error": "Failed to build search index"}
        
        # Generate summaries for each role
        summaries = {}
        for role in ROLE_PROMPTS.keys():
            print(f"\n🎯 Processing role: {role}")
            
            # Retrieve relevant chunks for this role
            top_chunks = retrieve(ROLE_QUERIES[role], raw_chunks, idx)
            
            # Generate role-specific summary
            role_summary = summarise_for_role(role, top_chunks)
            summaries[role] = role_summary
            
            print(f"✅ Summary completed for {role}")
        
        print(f"\n🎉 Analysis complete! Generated summaries for {len(summaries)} roles")
        return summaries
        
    except Exception as e:
        error_msg = f"Pipeline error: {str(e)}"
        print(f"❌ {error_msg}")
        return {"error": error_msg}


# ================== ENTRY ==================
# if __name__ == "__main__":
#     # Test with a sample repository for a specific role
#     result = summarize_repo_for_role(
#         "https://github.com/karangondaliya/Dot-Net-Core-MVC-Ecommerce-Web-App", 
#         role="Frontend Developers"
#     )
    
#     # Print result
#     print(f"\n{'='*50}")
#     print(f"ROLE: Frontend Developers")
#     print(f"{'='*50}")
#     print(result)
#     print()