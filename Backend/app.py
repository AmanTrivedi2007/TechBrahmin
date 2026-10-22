import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import FastAPI,Request   
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient
from fastapi import Query, HTTPException
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()
db = MongoClient(os.environ["MONGO_URL"])[os.getenv("DB_NAME")]


limiter = Limiter(key_func=get_remote_address)

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)
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
@limiter.limit("5/minute")
def contact(request: Request, c: Contact):
    db.messages.insert_one({
        **c.model_dump(),
        "created": datetime.now(timezone.utc)
    })
    return {"message": "Response Saved"}


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
