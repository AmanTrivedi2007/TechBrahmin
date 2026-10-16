import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient

load_dotenv()
db = MongoClient(os.environ["MONGO_URL"])[os.getenv("DB_NAME")]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # change to your real domain when live
    allow_methods=["*"],
    allow_headers=["*"],
)

class Contact(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    mobile_number: str = Field(min_length=10,max_length=10)
    message: str = Field(min_length=1, max_length=2000)

@app.post("/api/contact")
def contact(c: Contact):
    db.messages.insert_one({**c.model_dump(), "created": datetime.now(timezone.utc)})
    return {"message": "Response Saved"}

@app.get("/api/projects")
def projects():
    return list(db.projects.find({}, {"_id": 0}))