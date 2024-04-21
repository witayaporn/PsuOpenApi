from fastapi import APIRouter, Body, Request, Response, HTTPException, status # type: ignore
from fastapi.encoders import jsonable_encoder # type: ignore
from typing import List
from bson import ObjectId  # type: ignore

from mongo.models import SubjectInterest, SubjectInterestUpdate

router_subjectinterest = APIRouter()

@router_subjectinterest.get("/", response_description="List all SubjectInterest", response_model=List[SubjectInterest])
def list_subjectinterest(request: Request):
    SubjectInterest = list(request.app.database["SubjectInterest"].find())
    return SubjectInterest

@router_subjectinterest.get("/{subjectId}", response_description="Get a single subjectinterest by id", response_model=List[SubjectInterest])
def find_subjectinterest(subjectId: int, request: Request):
    if (subjectinterest := list(request.app.database["SubjectInterest"].find({"subjectId": subjectId}))) is not None:
        return subjectinterest
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"SubjectInterest with ID {subjectId} not found")


@router_subjectinterest.post("/", response_description="Create a new SubjectInterest", status_code=status.HTTP_201_CREATED, response_model=SubjectInterest)
def create_subjectinterest(request: Request, subjectinterest: SubjectInterest = Body(...)):
    subjectinterest = jsonable_encoder(subjectinterest)
    new_subjectinterest = request.app.database["SubjectInterest"].insert_one(subjectinterest)
    created_subjectinterest = request.app.database["SubjectInterest"].find_one(
        {"_id": new_subjectinterest.inserted_id}
    )
    return created_subjectinterest

@router_subjectinterest.put("/{subjectId}", response_description="Update a SubjectInterest", response_model=SubjectInterestUpdate)
def update_subjectinterest(subjectId: int, request: Request, subjectinterest: SubjectInterestUpdate = Body(...)):
    subjectinterest = {k: v for k, v in subjectinterest.dict().items() if v is not None}
    if len(subjectinterest) >= 1:
        update_result = request.app.database["SubjectInterest"].update_one(
            {"subjectId": subjectId}, {"$set": subjectinterest}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {subjectId} not found")

    if (
        existing_subjectinterest := request.app.database["SubjectInterest"].find_one({"subjectId": subjectId})
    ) is not None:
        return existing_subjectinterest

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"SubjectInterest with ID {subjectId} not found")

@router_subjectinterest.delete("/{subjectId}", response_description="Delete a SubjectInterest")
def delete_subjectinterest(subjectId: int, request: Request, response: Response):
    delete_result = request.app.database["SubjectInterest"].delete_one({"subjectId": subjectId})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {subjectId} not found")