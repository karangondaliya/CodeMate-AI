# main.py
import uvicorn
import time
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from app.summarize import summarize_repo
from app.diagram_generator import (
    generate_diagrams,
    generate_diagram,
    get_diagrams_for_role
)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagramRequest(BaseModel):
    repo_url: str
    branch: str = "main"
    role: str
    requested_diagrams: List[str] = []

class RepoRequest(BaseModel):
    repo_url: str
    branch: str = "main"

# Add timeout middleware
@app.middleware("http")
async def add_timeout_header(request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response
    except Exception as e:
        print(f"Request failed after {time.time() - start_time} seconds: {str(e)}")
        raise

@app.post("/summarize")
async def summarize_codebase(req: RepoRequest):
    try:
        summary = summarize_repo(req.repo_url, req.branch)
        return {"success": True, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-diagrams")
async def generate(request: DiagramRequest):
    try:
        # Ensure no duplicates in requested_diagrams
        if request.requested_diagrams:
            seen = set()
            request.requested_diagrams = [x for x in request.requested_diagrams if not (x in seen or seen.add(x))]
        
        # Debug print
        print(f"Requested diagrams after deduplication: {request.requested_diagrams}")
        
        output = generate_diagrams(
            repo_url=request.repo_url,
            branch=request.branch,
            role=request.role,
            requested_diagrams=request.requested_diagrams
        )
        return {"success": True, "diagrams": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-from-summary")
async def generate_from_summary(request: DiagramRequest):
    """
    1️⃣ Summarize the repo for the given role.
    2️⃣ Determine which diagrams.
    3️⃣ For each diagram type, call generate_diagram(summary, diagram_type).
    4️⃣ Return both summary + diagrams.
    """
    try:
        # 1️⃣ Get the natural-language summary
        summary = summarize_repo(request.repo_url, request.branch)

        # Ensure no duplicates in requested_diagrams
        if request.requested_diagrams:
            seen = set()
            request.requested_diagrams = [x for x in request.requested_diagrams if not (x in seen or seen.add(x))]

        # 2️⃣ Decide which diagrams to produce
        diagram_types = get_diagrams_for_role(request.role, request.requested_diagrams)
        
        # Print diagram types for debugging
        print(f"Generating diagrams for types: {diagram_types}")

        # 3️⃣ Generate diagrams by passing the SUMMARY as 'context'
        diagrams = {}
        for dt in diagram_types:
            diagrams[dt] = generate_diagram(summary, dt)

        # 4️⃣ Return both
        return {
            "success": True,
            "summary": summary,
            "diagrams": diagrams
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
