from fastapi import APIRouter, Body, Request, Response, HTTPException, status # type: ignore
from fastapi.encoders import jsonable_encoder # type: ignore
from typing import List, Optional
from bson import ObjectId  # type: ignore

from mongo.models import Student, StudentUpdate

router_comment = APIRouter()

@router_comment.get("/", response_description="List all Comment", response_model=List[comment])
def list_comment(request: Request):
    comment = list(request.app.database["Comment"].find())
    return comment
