# main.py
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

class DiagramRequest(BaseModel):
    repo_url: str
    branch: str = "main"
    role: str
    requested_diagrams: List[str] = []

class RepoRequest(BaseModel):
    repo_url: str
    branch: str = "main"

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

        # 2️⃣ Decide which diagrams to produce
        diagram_types = get_diagrams_for_role(request.role, request.requested_diagrams)

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
