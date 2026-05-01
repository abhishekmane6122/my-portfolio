from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from pydantic import BaseModel
from typing import List, Optional, Dict

app = FastAPI(title="Abhishek Mane Portfolio API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Project(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    image: Optional[str] = None
    github: Optional[str] = None
    live: Optional[str] = None
    tags: List[str]
    featured: bool

class Experience(BaseModel):
    id: str
    company: str
    position: str
    duration: str
    description: Optional[str] = None

class Education(BaseModel):
    id: str
    institution: str
    degree: str
    duration: str
    description: Optional[str] = None

class SocialLinks(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    email: Optional[str] = None
    resume: Optional[str] = None

class Portfolio(BaseModel):
    fullName: str
    title: str
    tagline: str
    bio: str
    skills: List[str]
    socialLinks: SocialLinks
    experience: List[Experience]
    education: List[Education]
    projects: List[Project]

def load_resume_data():
    data_path = os.path.join(os.path.dirname(__file__), "data", "resume.json")
    with open(data_path, "r") as f:
        return json.load(f)

@app.get("/")
async def root():
    return {"message": "Welcome to Abhishek Mane Portfolio API"}

@app.get("/portfolio", response_model=Portfolio)
async def get_portfolio():
    return load_resume_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
