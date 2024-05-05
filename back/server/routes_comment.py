from fastapi import APIRouter, Body, Request, Response, HTTPException, status # type: ignore
from fastapi.encoders import jsonable_encoder # type: ignore
from typing import List, Optional
from bson import ObjectId  # type: ignore

from mongo.models import comment, commentUpdate

router_comment = APIRouter()

@router_comment.get("/", response_description="List all Comment", response_model=List[comment])
def list_comment(request: Request):
    comment = list(request.app.database["Comment"].find())
    return comment

@router_comment.get("/{subjectId}", response_description="Get a Comment by subjectId", response_model=List[comment])
def find_comment(subjectId: int, request: Request):
    if (comment := list(request.app.database["comment"].find({"subjectId": subjectId}))) is not None:
        return comment
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {subjectId} not found")

@router_comment.post("/", response_description="Create a new Comment", status_code=status.HTTP_201_CREATED, response_model=comment)
def create_comment(request: Request, comment: comment = Body(...)):
    comment = jsonable_encoder(comment)
    new_comment = request.app.database["comment"].insert_one(comment)
    created_comment = request.app.database["comment"].find_one(
        {"_id": new_comment.inserted_id}
    )
    return created_comment

@router_comment.put("/{commentId}", response_description="Update a Comment", response_model=comment)
def update_comment(commentId: str, request: Request, comment: commentUpdate = Body(...)):
    comment = {k: v for k, v in comment.dict().items() if v is not None}
    if len(comment) >= 1:
        update_result = request.app.database["comment"].update_one(
            {"commentId": commentId}, {"$set": comment}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Comment with ID {commentId} not found")

    if (
        existing_comment := request.app.database["comment"].find_one({"commentId": commentId})
    ) is not None:
        return existing_comment

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {commentId} not found")

@router_comment.delete("/{commentId}", response_description="Delete a Comment")
def delete_comment(commentId: int, request: Request, response: Response):
    delete_result = request.app.database["comment"].delete_one({"commentId": commentId})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {commentId} not found")