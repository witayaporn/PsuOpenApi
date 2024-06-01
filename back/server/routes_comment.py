from fastapi import APIRouter, Body, Request, Response, HTTPException, status # type: ignore
from fastapi.encoders import jsonable_encoder # type: ignore
from typing import List, Optional
from bson import ObjectId  # type: ignore

from mongo.models import Comment, CommentUpdate

router_comment = APIRouter()

@router_comment.get("/", response_description="List all Comment", response_model=List[Comment])
async def list_comment(request: Request):
    comment = list(request.app.database["Comment"].find())
    return comment

@router_comment.get("/{xSubjectId}", response_description="Get a Comment by xSubjectId", response_model=List[Comment])
async def find_comment(xSubjectId: str, request: Request):
    if (comment := list(request.app.database["Comment"].find({"xSubjectId": xSubjectId}))) is not None:
        return comment
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {xSubjectId} not found")

@router_comment.post("/", response_description="Create a new Comment", status_code=status.HTTP_201_CREATED, response_model=Comment)
async def create_comment(request: Request, comment: Comment = Body(...)):
    comment = jsonable_encoder(comment)
    new_comment = request.app.database["Comment"].insert_one(comment)
    created_comment = request.app.database["Comment"].find_one(
        {"_id": new_comment.inserted_id}
    )
    return created_comment

@router_comment.put("/{xSubjectId}", response_description="Update a Comment", response_model=Comment)
async def update_comment(xSubjectId: str, request: Request, comment: CommentUpdate = Body(...)):
    comment = {k: v for k, v in comment.dict().items() if v is not None}
    if len(comment) >= 1:
        update_result = request.app.database["Comment"].update_one(
            {"xSubjectId": xSubjectId}, {"$set": comment}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Comment with ID {xSubjectId} not found")

    if (
        existing_comment := request.app.database["Comment"].find_one({"xSubjectId": xSubjectId})
    ) is not None:
        return existing_comment

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {xSubjectId} not found")

@router_comment.delete("/{xSubjectId}", response_description="Delete a Comment")
async def delete_comment(xSubjectId: str, request: Request, response: Response):
    delete_result = request.app.database["Comment"].delete_one({"xSubjectId": xSubjectId})
    
    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {xSubjectId} not found")