import os
import git
import shutil
import traceback
import google.generativeai as genai
import re
import json

from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

os.environ['GEMINI_API_KEY'] = "AIzaSyBMB3SQxsuZN07lRLE-sqwn-i2Nw1fJI-0"

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

# --- Mermaid Syntax Validation ---
def validate_mermaid_syntax(mermaid_code):
    """
    Validates basic Mermaid syntax patterns
    Returns: (is_valid: bool, errors: list)
    """
    try:
        errors = []
        mermaid_code = mermaid_code.strip()
        
        if not mermaid_code:
            return False, ["Empty diagram code"]
        
        # Remove markdown backticks if present
        mermaid_code = re.sub(r'```mermaid\n?|```\n?', '', mermaid_code).strip()
        
        # Check for valid diagram type declaration
        valid_diagram_types = [
            'classDiagram', 'sequenceDiagram', 'erDiagram', 
            'graph TD', 'graph TB', 'graph LR', 'graph RL',
            'flowchart TD', 'flowchart TB', 'flowchart LR', 'flowchart RL'
        ]
        
        has_valid_type = any(mermaid_code.startswith(dtype) for dtype in valid_diagram_types)
        if not has_valid_type:
            errors.append("Missing or invalid diagram type declaration")
        
        # Basic syntax checks based on diagram type
        if mermaid_code.startswith('classDiagram'):
            errors.extend(validate_class_diagram(mermaid_code))
        elif mermaid_code.startswith('sequenceDiagram'):
            errors.extend(validate_sequence_diagram(mermaid_code))
        elif mermaid_code.startswith('erDiagram'):
            errors.extend(validate_er_diagram(mermaid_code))
        elif any(mermaid_code.startswith(ft) for ft in ['graph', 'flowchart']):
            errors.extend(validate_flowchart(mermaid_code))
        
        # Check for unbalanced brackets/parentheses
        brackets = {'(': ')', '[': ']', '{': '}'}
        stack = []
        for char in mermaid_code:
            if char in brackets:
                stack.append(brackets[char])
            elif char in brackets.values():
                if not stack or stack.pop() != char:
                    errors.append("Unbalanced brackets or parentheses")
                    break
        
        if stack:
            errors.append("Unbalanced brackets or parentheses")
        
        return len(errors) == 0, errors
        
    except Exception as e:
        return False, [f"Validation error: {str(e)}"]

def validate_class_diagram(code):
    """Validate class diagram specific syntax"""
    errors = []
    lines = code.split('\n')
    
    for line_num, line in enumerate(lines[1:], 2):  # Skip first line (classDiagram)
        line = line.strip()
        if not line or line.startswith('%%'):  # Skip empty lines and comments
            continue
            
        # Check for valid class diagram patterns
        valid_patterns = [
            r'^class\s+\w+\s*{',  # class declaration
            r'^\w+\s*:\s*.+',     # class member
            r'^\w+\s*--[>|]\s*\w+',  # relationship
            r'^\w+\s*<\|--\s*\w+',   # inheritance
            r'^\w+\s*\*--\s*\w+',    # composition
            r'^\w+\s*o--\s*\w+',     # aggregation
            r'^}$',               # closing brace
            r'^\w+$'              # simple class name
        ]
        
        if not any(re.match(pattern, line) for pattern in valid_patterns):
            errors.append(f"Invalid class diagram syntax at line {line_num}: {line}")
    
    return errors

def validate_sequence_diagram(code):
    """Validate sequence diagram specific syntax"""
    errors = []
    lines = code.split('\n')
    
    for line_num, line in enumerate(lines[1:], 2):
        line = line.strip()
        if not line or line.startswith('%%'):
            continue
            
        valid_patterns = [
            r'^participant\s+\w+',  # participant declaration
            r'^\w+\s*-[>+x-]+\s*\w+\s*:\s*.+',  # message
            r'^Note\s+(left|right|over)\s+\w+\s*:\s*.+',  # note
            r'^activate\s+\w+',     # activation
            r'^deactivate\s+\w+',   # deactivation
            r'^loop\s+.+',          # loop
            r'^alt\s+.+',           # alternative
            r'^else\s*.*',          # else
            r'^end$'                # end
        ]
        
        if not any(re.match(pattern, line) for pattern in valid_patterns):
            errors.append(f"Invalid sequence diagram syntax at line {line_num}: {line}")
    
    return errors

def validate_er_diagram(code):
    """Validate ER diagram specific syntax"""
    errors = []
    lines = code.split('\n')
    
    for line_num, line in enumerate(lines[1:], 2):
        line = line.strip()
        if not line or line.startswith('%%'):
            continue
            
        valid_patterns = [
            r'^\w+\s*{',            # entity start
            r'^\w+\s+\w+(\s+PK)?(\s+FK)?',  # attribute
            r'^}$',                 # entity end
            r'^\w+\s*\|\|--[o|]\{\s*\w+\s*:\s*.+',  # relationship
            r'^\w+\s*}[o|]--\|\|\s*\w+\s*:\s*.+',  # relationship
        ]
        
        if not any(re.match(pattern, line) for pattern in valid_patterns):
            errors.append(f"Invalid ER diagram syntax at line {line_num}: {line}")
    
    return errors

def validate_flowchart(code):
    """Validate flowchart/graph specific syntax"""
    errors = []
    lines = code.split('\n')
    
    for line_num, line in enumerate(lines[1:], 2):
        line = line.strip()
        if not line or line.startswith('%%'):
            continue
            
        valid_patterns = [
            r'^\w+\[.+\]',          # rectangular node
            r'^\w+\(.+\)',          # rounded node
            r'^\w+\{.+\}',          # diamond node
            r'^\w+\[\[.+\]\]',      # subroutine node
            r'^\w+\s*--[>|]\s*\w+', # arrow connection
            r'^\w+\s*---\s*\w+',    # line connection
            r'^\w+\s*-\.\s*\w+',    # dotted connection
        ]
        
        if not any(re.match(pattern, line) for pattern in valid_patterns):
            errors.append(f"Invalid flowchart syntax at line {line_num}: {line}")
    
    return errors

def correct_mermaid_syntax(mermaid_code, diagram_type, context):
    """
    Use Gemini to correct Mermaid syntax errors
    """
    try:
        print(f"🔧 Correcting {diagram_type} diagram syntax...")
        
        model = get_gemini_model()
        
        prompt = f"""
You are a Mermaid.js syntax expert. The following {diagram_type} has syntax errors and needs to be corrected.

RULES:
1. Output ONLY valid Mermaid.js syntax
2. Do NOT include markdown backticks (```mermaid)
3. Ensure proper {diagram_type} syntax
4. Keep the logical structure and relationships intact
5. Fix any syntax errors while preserving the diagram's meaning

INVALID DIAGRAM CODE:
{mermaid_code}

CONTEXT FOR REFERENCE:
{context[:2000]}

Please provide the corrected Mermaid syntax:
"""
        
        response = model.generate_content(prompt)
        corrected_code = response.text.strip()
        
        # Clean up any markdown backticks that might be added
        corrected_code = re.sub(r'```mermaid\n?|```\n?', '', corrected_code).strip()
        
        print(f"✅ Corrected {diagram_type} diagram syntax")
        return corrected_code
        
    except Exception as e:
        print(f"❌ Error correcting diagram syntax: {str(e)}")
        return mermaid_code  # Return original if correction fails

# --- Clone GitHub Repository ---
def clone_repo(repo_url, repo_dir="repo", branch="main"):
    try:
        # Windows-safe way to remove directory
        if os.path.exists(repo_dir):
            print(f"🗑️ Removing existing directory: {repo_dir}")
            repo_dir = remove_directory_safely(repo_dir)
        
        print(f"📥 Cloning {repo_url} (branch: {branch})...")
        git.Repo.clone_from(repo_url, repo_dir, branch=branch)
        print(f"✅ Repository cloned successfully to {repo_dir}")
        return repo_dir
        
    except Exception as e:
        print(f"❌ Error cloning repository: {str(e)}")
        traceback.print_exc()
        raise

def remove_directory_safely(directory):
    """
    Safely remove directory on Windows, handling Git file permission issues
    """
    import stat
    
    def handle_remove_readonly(func, path, exc):
        """
        Error handler for shutil.rmtree to handle read-only files on Windows
        """
        if os.path.exists(path):
            # Make the file writable and try again
            os.chmod(path, stat.S_IWRITE)
            func(path)
    
    try:
        # First attempt: normal removal
        shutil.rmtree(directory)
    except PermissionError:
        print("🔧 Handling Windows permission issues...")
        try:
            # Second attempt: with error handler for read-only files
            shutil.rmtree(directory, onerror=handle_remove_readonly)
        except Exception as e:
            print(f"⚠️ Could not remove {directory}: {str(e)}")
            # Last resort: try to make writable recursively
            try:
                for root, dirs, files in os.walk(directory, topdown=False):
                    for name in files:
                        file_path = os.path.join(root, name)
                        try:
                            os.chmod(file_path, stat.S_IWRITE)
                        except:
                            pass
                    for name in dirs:
                        dir_path = os.path.join(root, name)
                        try:
                            os.chmod(dir_path, stat.S_IWRITE)
                        except:
                            pass
                # Try removal again
                shutil.rmtree(directory)
            except Exception as final_e:
                print(f"❌ Final attempt failed: {str(final_e)}")
                # Generate a unique directory name instead
                import uuid
                new_name = f"{directory}_{uuid.uuid4().hex[:8]}"
                print(f"🔄 Using new directory name: {new_name}")
                return new_name
    
    return directory

# --- Read code files ---
def read_code_files(repo_dir="repo"):
    try:
        code_chunks = []
        file_count = 0
        
        for root, dirs, files in os.walk(repo_dir):
            for file in files:
                if file.endswith(('.py', '.js', '.ts', '.java', '.cs', '.cpp', '.go', '.html')):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, repo_dir)
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            code = f.read()
                            code_chunks.append(f"# File: {relative_path}\n{code}")
                            file_count += 1
                    except Exception as e:
                        print(f"⚠️ Warning: Could not read {relative_path}: {str(e)}")
                        continue
        
        print(f"📖 Read {file_count} code files")
        return "\n\n".join(code_chunks)
        
    except Exception as e:
        print(f"❌ Error reading code files: {str(e)}")
        traceback.print_exc()
        raise

# --- Chunk codebase ---
def split_code_into_chunks(codebase):
    try:
        if not codebase or not codebase.strip():
            raise ValueError("Codebase is empty")
            
        splitter = RecursiveCharacterTextSplitter(chunk_size=12000, chunk_overlap=1000)
        documents = splitter.create_documents([codebase])
        
        for i, doc in enumerate(documents):
            doc.metadata["chunk_id"] = i
            
        print(f"✂️ Split codebase into {len(documents)} chunks")
        return documents
        
    except Exception as e:
        print(f"❌ Error splitting code into chunks: {str(e)}")
        traceback.print_exc()
        raise

# --- Embed and store chunks ---
def embed_chunks(documents, persist_directory="chroma_store"):
    try:
        # Clean up existing chroma store
        if os.path.exists(persist_directory):
            remove_directory_safely(persist_directory)
            
        print(f"🧠 Embedding {len(documents)} chunks...")
        
        # Fixed: Use consistent variable name
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
            
        embedding = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", 
            google_api_key=gemini_api_key
        )
        
        vectordb = Chroma.from_documents(
            documents, 
            embedding=embedding, 
            persist_directory=persist_directory
        )
        vectordb.persist()
        
        print(f"✅ Vector database created with {len(documents)} embeddings")
        return vectordb
        
    except Exception as e:
        print(f"❌ Error embedding chunks: {str(e)}")
        traceback.print_exc()
        raise

# --- Retrieve relevant chunks ---
def retrieve_relevant_chunks(vectordb, diagram_type, repo_name, k=6):
    try:
        query = f"Relevant classes, components, or logic for generating a {diagram_type} in the {repo_name} project"
        retriever = vectordb.as_retriever(search_kwargs={"k": k})
        docs = retriever.get_relevant_documents(query)
        
        print(f"🔍 Retrieved {len(docs)} chunks for '{diagram_type}':")
        for doc in docs:
            print(f" - Chunk #{doc.metadata.get('chunk_id', 'N/A')}")

        context = "\n\n".join([doc.page_content for doc in docs])
        return context
        
    except Exception as e:
        print(f"❌ Error retrieving chunks: {str(e)}")
        traceback.print_exc()
        raise

# --- Configure Gemini ---
def get_gemini_model():
    try:
        # Fixed: Use consistent variable name
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
            
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        return model
        
    except Exception as e:
        print(f"❌ Error configuring Gemini: {str(e)}")
        traceback.print_exc()
        raise

# --- Generate Mermaid diagram ---
def generate_diagram(context, diagram_type):
    try:
        print(f"🎨 Generating {diagram_type} diagram...")
        
        model = get_gemini_model()
        
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
{context[:8000]}
"""
        
        response = model.generate_content(prompt)
        print(f"✅ Generated {diagram_type} diagram successfully")
        return response.text
        
    except Exception as e:
        print(f"❌ Error generating diagram: {str(e)}")
        traceback.print_exc()
        raise

def generate_diagrams(
    repo_url: str,
    branch: str,
    role: str,
    requested_diagrams: list[str] = None
) -> dict:
    """
    Clones the given repo+branch, builds RAG index, and returns
    a dict mapping diagram type → validated mermaid code.
    """
    try:
        print(f"🚀 Starting diagram generation for {repo_url}")
        
        repo_name = repo_url.rstrip("/").split("/")[-1]
        print(f"📁 Repository name: {repo_name}")

        # 1️⃣ Determine which diagrams to produce
        diagram_types = get_diagrams_for_role(role, requested_diagrams)
        print(f"📊 Will generate diagrams: {diagram_types}")

        # 2️⃣ Clone + load code
        actual_repo_dir = clone_repo(repo_url, repo_dir="repo", branch=branch)
        codebase = read_code_files(repo_dir=actual_repo_dir or "repo")
        
        if not codebase or not codebase.strip():
            raise ValueError("No code files found in repository")

        # 3️⃣ Chunk + embed
        documents = split_code_into_chunks(codebase)
        vectordb = embed_chunks(documents)

        # 4️⃣ Generate each diagram with validation and correction
        outputs = {}
        for diag in diagram_types:
            try:
                print(f"\n🎯 Processing diagram: {diag}")
                # retrieve RAG context
                context = retrieve_relevant_chunks(vectordb, diag, repo_name, k=15)
                
                # ask Gemini for the mermaid text
                raw_mermaid_code = generate_diagram(context, diag)
                
                # Clean up markdown backticks
                cleaned_code = re.sub(r'```mermaid\n?|```\n?', '', raw_mermaid_code).strip()
                
                # Validate syntax
                is_valid, errors = validate_mermaid_syntax(cleaned_code)
                
                if is_valid:
                    print(f"✅ {diag} syntax is valid")
                    final_code = cleaned_code
                else:
                    print(f"⚠️ {diag} has syntax errors: {errors}")
                    print("🔧 Attempting to correct syntax...")
                    
                    # Attempt to correct syntax
                    corrected_code = correct_mermaid_syntax(cleaned_code, diag, context)
                    
                    # Validate corrected syntax
                    is_corrected_valid, correction_errors = validate_mermaid_syntax(corrected_code)
                    
                    if is_corrected_valid:
                        print(f"✅ {diag} syntax corrected successfully")
                        final_code = corrected_code
                    else:
                        print(f"⚠️ Could not fully correct {diag} syntax: {correction_errors}")
                        # Use corrected version anyway as it might be better than original
                        final_code = corrected_code
                
                outputs[diag] = final_code
                print(f"✅ Successfully processed {diag}")
                
            except Exception as e:
                print(f"❌ Error processing {diag}: {str(e)}")
                outputs[diag] = f"Error generating {diag}: {str(e)}"

        print(f"🎉 Diagram generation completed. Generated {len(outputs)} diagrams.")
        return outputs
        
    except Exception as e:
        print(f"❌ Fatal error in generate_diagrams: {str(e)}")
        traceback.print_exc()
        raise