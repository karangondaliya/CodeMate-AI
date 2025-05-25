import os
import git
import google.generativeai as genai

from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

# --- Diagram role mapping ---
role_to_diagrams = {
    "backend": ["Class Diagram", "Sequence Diagram", "ER Diagram"],
    "frontend": ["Use Case Diagram", "Sequence Diagram"],
    "ai_engineer": ["Class Diagram", "ER Diagram"],
    "product_manager": ["Use Case Diagram"]
}

def get_diagrams_for_role(role, requested_diagrams=None):
    role = role.lower()
    if role not in role_to_diagrams:
        raise ValueError(f"Invalid role '{role}'. Valid roles: {list(role_to_diagrams.keys())}")

    default_diagrams = role_to_diagrams[role]
    if requested_diagrams:
        requested_diagrams = [d.strip().title() for d in requested_diagrams]
        all_diagrams = list(set(default_diagrams + requested_diagrams))
        extra = [d for d in requested_diagrams if d not in default_diagrams]
        if extra:
            print(f"Note: {extra} are not typical for role '{role}', but will be generated.")
        return all_diagrams
    else:
        return default_diagrams

# --- Clone GitHub Repository ---
def clone_repo(repo_url, repo_dir="repo", branch="main"):
    if os.path.exists(repo_dir):
        os.system(f"rm -rf {repo_dir}")
    git.Repo.clone_from(repo_url, repo_dir, branch=branch)
    print(f"Repository cloned from {repo_url} (branch: {branch}).")

# --- Read code files ---
def read_code_files(repo_dir="repo"):
    code_chunks = []
    for root, dirs, files in os.walk(repo_dir):
        for file in files:
            if file.endswith(('.py', '.js', '.ts', '.java', '.cs', '.cpp', '.go', '.html')):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, repo_dir)
                try:
                    with open(file_path, 'r', errors='ignore') as f:
                        code = f.read()
                        code_chunks.append(f"# File: {relative_path}\n{code}")
                except:
                    continue
    return "\n\n".join(code_chunks)

# --- Chunk codebase ---
def split_code_into_chunks(codebase):
    splitter = RecursiveCharacterTextSplitter(chunk_size=12000, chunk_overlap=1000)
    documents = splitter.create_documents([codebase])
    for i, doc in enumerate(documents):
        doc.metadata["chunk_id"] = i
    return documents

# --- Embed and store chunks ---
def embed_chunks(documents, persist_directory="chroma_store"):
    embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("google_api_key"))
    vectordb = Chroma.from_documents(documents, embedding=embedding, persist_directory=persist_directory)
    vectordb.persist()
    return vectordb

# --- Retrieve relevant chunks ---
def retrieve_relevant_chunks(vectordb, diagram_type, repo_name, k=6):
    query = f"Relevant classes, components, or logic for generating a {diagram_type} in the {repo_name} project"
    retriever = vectordb.as_retriever(search_kwargs={"k": k})
    docs = retriever.get_relevant_documents(query)
    
    print(f"\n🔍 Retrieved {len(docs)} chunks for '{diagram_type}':")
    for doc in docs:
        print(f" - Chunk #{doc.metadata.get('chunk_id', 'N/A')}")

    context = "\n\n".join([doc.page_content for doc in docs])
    return context

# --- Configure Gemini ---
genai.configure(api_key=os.getenv("google_api_key"))  # Replace this
model = genai.GenerativeModel('gemini-2.0-flash')

# --- Generate Mermaid diagram ---
def generate_diagram(context, diagram_type):
    prompt = f"""
You are an expert software architecture assistant.

Based on the following project codebase context, generate a **{diagram_type}** using **Mermaid.js** syntax ONLY.
Do not generate explanations. Just output the diagram inside triple backticks with `mermaid` syntax.

- Use Mermaid's proper syntax like `classDiagram`, `sequenceDiagram`, `erDiagram`, or `graph TD`.
- Prefer full class names and indicate relationships clearly.
- Avoid over-compacting or omitting important nodes.
- If a class/function is only partially present, infer logical structure if needed.
- If it's a Use Case Diagram, use Mermaid's flowchart syntax to simulate it.

Here is the codebase context:
{context}
"""
    response = model.generate_content(prompt)
    return response.text

def generate_diagrams(
    repo_url: str,
    branch: str,
    role: str,
    requested_diagrams: list[str] = None
) -> dict:
    """
    Clones the given repo+branch, builds RAG index, and returns
    a dict mapping diagram type → mermaid code.
    """
    repo_name = repo_url.rstrip("/").split("/")[-1]

    # 1️⃣ Determine which diagrams to produce
    diagram_types = get_diagrams_for_role(role, requested_diagrams)

    # 2️⃣ Clone + load code
    clone_repo(repo_url, repo_dir="repo", branch=branch)
    codebase = read_code_files(repo_dir="repo")

    # 3️⃣ Chunk + embed
    documents = split_code_into_chunks(codebase)
    vectordb   = embed_chunks(documents)

    # 4️⃣ Generate each diagram
    outputs = {}
    for diag in diagram_types:
        # retrieve RAG context
        context = retrieve_relevant_chunks(vectordb, diag, repo_name, k=15)
        # ask Gemini for the mermaid text
        mermaid_code = generate_diagram(context, diag)
        outputs[diag] = mermaid_code.strip()

    return outputs


# === Main Execution ===
# if __name__ == "__main__":
#     repo_url = "https://github.com/krushang18/newmedconnect"
#     role = "frontend"
#     requested_diagrams = ["Class Diagram"]

#     repo_name = repo_url.split("/")[-1]
#     diagram_types = get_diagrams_for_role(role, requested_diagrams)

#     # Clone and process repo
#     clone_repo(repo_url, "repo", "main")
#     codebase = read_code_files()

#     # Chunk, embed and store
#     documents = split_code_into_chunks(codebase)
#     vectordb = embed_chunks(documents)

#     # Generate diagrams
#     for diagram_type in diagram_types:
#         print(f"\n🎯 Generating {diagram_type}...")
#         context = retrieve_relevant_chunks(vectordb, diagram_type, repo_name, k=15)
#         mermaid_output = generate_diagram(context, diagram_type)
#         print("\n📈 Mermaid Diagram Output:")
#         print(mermaid_output)
