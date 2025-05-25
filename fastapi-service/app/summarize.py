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
RAG-powered, role-aware GitHub repo summarizer (Groq LLM)
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
TOP_K        = 8     # retrieved chunks per role
CHUNK_SUM_TOKENS = 120   # output tokens per mini‑summary
FINAL_SUM_TOKENS = 300   # output tokens per role summary

ROLE_PROMPTS = {
    "Backend Engineers":  "Provide an overview of server-side logic, API design, authentication, and data models.",
    "Frontend Developers": "Describe UI components, routing, state management, and how the frontend consumes APIs.",
    "AI Engineers":       "Highlight data workflows, machine-learning pipelines, model training/inference code, and feature engineering.",
    "Product Managers":   "Give a high-level, jargon-free summary: purpose, main features, user impact, and roadmap considerations."
}

ROLE_QUERIES = {
    "Backend Engineers":  "server logic, REST APIs, controllers, routes, database schema, authentication, ORM",
    "Frontend Developers": "react components, html, css, vue, angular, UI, fetch, axios, API calls",
    "AI Engineers":       "machine learning, model, training script, data loader, preprocessing, pytorch, tensorflow",
    "Product Managers":   "project goals, features, user benefit, roadmap, architecture overview"
}

# ================== INIT MODELS ==================
print("🔧 Loading MiniLM embedder …")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
print("✅ Embedder loaded.")

# ================== HELPERS ==================

def clone_repo(repo_url: str, branch: str = "main") -> str:
    tmp = tempfile.mkdtemp(prefix="repo_")
    git.Repo.clone_from(repo_url, tmp, branch=branch)
    return tmp


def get_code_files(root: str, exts=(
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".go", ".cpp", ".c", ".rb", ".cs", ".php", ".html", ".css")):
    return [p for p in Path(root).rglob("*") if p.suffix in exts and p.is_file()]


def chunk_text(txt: str, limit: int = CHUNK_SIZE):
    buf, out = "", []
    for ln in txt.splitlines():
        if len(buf.split()) + len(ln.split()) < limit:
            buf += ln + "\n"
        else:
            out.append(buf.strip())
            buf = ln + "\n"
    if buf:
        out.append(buf.strip())
    return out


def build_index(chunks):
    vecs = embedder.encode(chunks, convert_to_tensor=False).astype("float32")
    faiss_idx = faiss.IndexFlatL2(vecs.shape[1])
    faiss_idx.add(vecs)
    return faiss_idx


def retrieve(query: str, chunks, idx, k=TOP_K):
    qvec = embedder.encode([query]).astype("float32")
    _, ids = idx.search(qvec, k)
    return [chunks[i] for i in ids[0]]


def generate(prompt: str, max_tokens: int):
    try:
        client = openai.OpenAI(
            api_key=os.environ['GROQ_API_KEY'],
            base_url="https://api.groq.com/openai/v1"
        )
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[Groq exception: {str(e)}]"

# ---- Hierarchical summarisation per role ----

def summarise_for_role(role: str, chunks):
    mini_summaries = []
    for ch in chunks:
        mini = generate(f"Summarise the following code for {role} guidance:\n\n{ch}\n", CHUNK_SUM_TOKENS)
        mini_summaries.append(mini)
    joined = "\n".join(mini_summaries)
    final_prompt = f"{ROLE_PROMPTS[role]}\n\nRepository insights (compressed):\n{joined}"
    return generate(final_prompt, FINAL_SUM_TOKENS)

# ================== PIPELINE ==================

def summarize_repo(repo_url: str, branch: str = "main") -> dict:
    print(f"\n🚀 Cloning {repo_url} @ branch '{branch}'")
    repo_path = clone_repo(repo_url, branch)

    files = get_code_files(repo_path)
    raw_chunks = []
    for fp in files:
        if len(raw_chunks) >= MAX_CHUNKS:
            break
        try:
            txt = Path(fp).read_text(encoding="utf-8", errors="ignore")
            raw_chunks.extend(chunk_text(txt))
        except Exception:
            pass

    if not raw_chunks:
        return {}

    idx = build_index(raw_chunks)
    summaries = {}
    for role in ROLE_PROMPTS:
        top_chunks = retrieve(ROLE_QUERIES[role], raw_chunks, idx)
        summaries[role] = summarise_for_role(role, top_chunks)

    return summaries


# ================== ENTRY ==================
# if __name__ == "__main__":
#     summarize_repo("https://github.com/karangondaliya/Dot-Net-Core-MVC-Ecommerce-Web-App")
