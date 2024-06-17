from fastapi import APIRouter, Body, Request, Response, HTTPException, status  # type: ignore
from fastapi.encoders import jsonable_encoder  # type: ignore
from typing import List
from bson import ObjectId  # type: ignore
from datetime import datetime
from mongo.models import Vote, PydanticObjectId


router_vote = APIRouter()


@router_vote.get("/", response_description="List all Vote", response_model=List[Vote])
async def list_vote(request: Request):
    try:
        vote = list(request.app.database["Vote"].find())
        return vote
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_vote.get(
    "/{commentId}",
    response_description="Get votes for comment by commentId",
    response_model=List[Vote],
)
async def find_vote(commentId: PydanticObjectId, request: Request):
    try:
        if (
            vote := list(request.app.database["Vote"].find({"commentId": commentId}))
        ) is not None:
            return vote

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vote with commentId {commentId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_vote.get(
    "/user/{studentId}",
    response_description="Get votes for student by studentId",
    response_model=List[Vote],
)
async def find_vote(studentId: str, request: Request, subjectId: str = None):
    try:
        if studentId is not None and studentId is not None:
            if (
                vote := list(
                    request.app.database["Vote"].find(
                        {"studentId": studentId, "subjectId": subjectId}
                    )
                )
            ) is not None:
                return vote
        else:
            if (
                vote := list(
                    request.app.database["Vote"].find({"studentId": studentId})
                )
            ) is not None:
                return vote
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vote with studentId {studentId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_vote.post(
    "/",
    response_description="Create a new vote",
    status_code=status.HTTP_201_CREATED,
    response_model=Vote,
)
async def create_vote(request: Request):
    try:
        vote = jsonable_encoder(await request.json())
        vote["_id"] = ObjectId()
        vote["created"] = datetime.now()
        vote["commentId"] = (
            ObjectId(vote["commentId"]) if len(vote["commentId"]) else None
        )
        new_vote = request.app.database["Vote"].insert_one(vote)
        created_vote = request.app.database["Vote"].find_one(
            {"_id": new_vote.inserted_id}
        )
        return created_vote
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_vote.post(
    "/update/{voteId}", response_description="Update a vote", response_model=Vote
)
async def update_vote(voteId: PydanticObjectId, request: Request):
    try:
        vote = jsonable_encoder(await request.json())
        vote["commentId"] = ObjectId(vote["commentId"])
        if len(vote):
            update_result = request.app.database["Vote"].update_one(
                {"_id": voteId}, {"$set": vote}
            )
            if update_result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Vote with ID {voteId} not found",
                )
        if (
            existing_vote := request.app.database["Vote"].find_one({"_id": voteId})
        ) is not None:
            return existing_vote

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vote with ID {voteId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_vote.post("/delete/{voteId}", response_description="Delete a vote")
async def delete_vote(voteId: PydanticObjectId, request: Request, response: Response):
    try:
        delete_result = request.app.database["Vote"].delete_one({"_id": voteId})

        if delete_result.deleted_count == 1:
            response.status_code = status.HTTP_204_NO_CONTENT
            return response

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vote with ID {voteId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )
