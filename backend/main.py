from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from pydantic import BaseModel
from typing import List, Optional, Dict
import datetime

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

# View Counter Logic
VIEWS_FILE = os.path.join(os.path.dirname(__file__), "data", "views.json")

def get_views():
    if not os.path.exists(VIEWS_FILE):
        with open(VIEWS_FILE, "w") as f:
            json.dump({"total_views": 0, "daily_views": {}}, f)
        return {"total_views": 0, "daily_views": {}}
    
    with open(VIEWS_FILE, "r") as f:
        try:
            return json.load(f)
        except:
            return {"total_views": 0, "daily_views": {}}

def save_views(data):
    with open(VIEWS_FILE, "w") as f:
        json.dump(data, f, indent=4)

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

@app.post("/increment-view")
async def increment_view():
    data = get_views()
    data["total_views"] += 1
    
    # Track daily views
    today = datetime.date.today().isoformat()
    data["daily_views"][today] = data["daily_views"].get(today, 0) + 1
    
    save_views(data)
    return {"status": "success", "total_views": data["total_views"]}

@app.get("/views")
async def get_total_views():
    return get_views()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
