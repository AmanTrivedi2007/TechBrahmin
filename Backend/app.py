import logging
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request,responses
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("techbrahmin")

db = MongoClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=5000)[
    os.getenv("DB_NAME", "techbrahmin")
]
try:
    db.subscribers.create_index("email", unique=True)
except PyMongoError:
    log.exception("Could not create subscribers index")

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class Contact(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    mobile_number: str = Field(default="", min_length=10,max_length=10, pattern=r"^[0-9+\-\s()]*$")
    company: str = Field(default="", max_length=120)
    service: str = Field(default="", max_length=100)
    message: str = Field(min_length=1, max_length=2000)


class Subscribe(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    email: EmailStr

@app.post("/api/contact", status_code=201)
@limiter.limit("5/minute")
def contact(request: Request, c: Contact):
    try:
        db.messages.insert_one({**c.model_dump(), "created": datetime.now(timezone.utc)})
    except PyMongoError:
        log.exception("Failed to save contact message")
        raise HTTPException(status_code=503, detail="Service temporarily unavailable")
    return {"ok": True}


@app.post("/api/subscribe", status_code=201)
@limiter.limit("5/minute")
def subscribe(request: Request, s: Subscribe):
    try:
        db.subscribers.insert_one({"email": s.email.lower(), "created": datetime.now(timezone.utc)})
    except DuplicateKeyError:
        return {"message":"Response Already Saved"}
    except PyMongoError:
        log.exception("Failed to save subscriber")
        raise HTTPException(status_code=503, detail="Service temporarily unavailable")
    return {"ok": True}


@app.get("/api/projects")
@limiter.limit("60/minute")
def get_projects(request: Request,type: str = Query(default="all", max_length=100)):
    try:
        # Fetch available categories from MongoDB
        type_docs = list(db["type"].find({}))

        # Assumes each document uses {"name": "AI"}
        allowed_categories = list(dict.fromkeys(
            str(item["name"]).strip()
            for item in type_docs
            if item.get("name") and str(item["name"]).strip()
        ))

        category = type.strip().casefold()

        # Validate category against database values
        if category != "all":
            matched_category = next(
                (item for item in allowed_categories
                 if item.casefold() == category),
                None
            )

            if matched_category is None:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid project category."
                )

            query = {"type": matched_category}
        else:
            query = {}

        # Fetch matching projects
        projects = list(db["project"].find(
            query,
            {
                "name": 1,
                "type": 1,
                "description": 1,
                "status": 1,
                '"status"': 1,
                "link": 1
            }
        ))

        # Convert ObjectId to string
        for project in projects:
            project["_id"] = str(project["_id"])

        return {
            "success": True,
            "count": len(projects),
            "types": allowed_categories,
            "projects": projects
        }

    except HTTPException:
        raise
    except Exception:
        # Keep internal database errors out of the public response
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch projects."
        )
