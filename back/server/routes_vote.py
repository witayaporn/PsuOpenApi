from fastapi import APIRouter, Body, Request, Response, HTTPException, status  # type: ignore
from fastapi.encoders import jsonable_encoder  # type: ignore
from typing import Annotated, Any, Callable, List, Optional
from pydantic import BaseModel, Field  # type: ignore
from pydantic_core import core_schema, PydanticOmit  # type: ignore
from pydantic.json_schema import GenerateJsonSchema, JsonSchemaValue  # type: ignore
from bson import ObjectId  # type: ignore
from mongo.models import Vote, VoteUpdate
from datetime import datetime, timezone, timedelta


class _ObjectIdPydanticAnnotation:
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: Callable[[Any], core_schema.CoreSchema],
    ) -> core_schema.CoreSchema:
        def validate_from_str(input_value: str) -> ObjectId:
            return ObjectId(input_value)

        return core_schema.union_schema(
            [
                # check if it's an instance first before doing any further work
                core_schema.is_instance_schema(ObjectId),
                core_schema.no_info_plain_validator_function(validate_from_str),
            ],
            serialization=core_schema.to_string_ser_schema(),
        )


PydanticObjectId = Annotated[ObjectId, _ObjectIdPydanticAnnotation]

router_vote = APIRouter()


@router_vote.get("/", response_description="List all Vote", response_model=List[Vote])
async def list_vote(request: Request):
    vote = list(request.app.database["Vote"].find())
    return vote


@router_vote.get(
    "/{commentId}",
    response_description="Get a Vote by Comment Id",
    response_model=List[Vote],
)
async def find_vote(commentId: PydanticObjectId, request: Request):
    if (
        vote := list(request.app.database["Vote"].find({"commentId": commentId}))
    ) is not None:
        return vote
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Vote with ID {commentId} not found",
    )


@router_vote.get(
    "/user/{studentId}",
    response_description="Get a Vote by Student Id",
    response_model=List[Vote],
)
async def find_vote(studentId: str, request: Request, subjectId: str = None):
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
            vote := list(request.app.database["Vote"].find({"studentId": studentId}))
        ) is not None:
            return vote
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Vote with ID {studentId} not found",
    )


@router_vote.post(
    "/",
    response_description="Create a new Vote",
    status_code=status.HTTP_201_CREATED,
    response_model=Vote,
)
async def create_vote(request: Request):
    vote = jsonable_encoder(await request.json())
    vote["_id"] = ObjectId()
    vote["created"] = datetime.now()
    vote["commentId"] = ObjectId(vote["commentId"]) if len(vote["commentId"]) else None
    new_vote = request.app.database["Vote"].insert_one(vote)
    created_vote = request.app.database["Vote"].find_one({"_id": new_vote.inserted_id})
    return created_vote


@router_vote.post(
    "/update/{voteId}", response_description="Update a Vote", response_model=Vote
)
async def update_vote(voteId: PydanticObjectId, request: Request):
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
        # print(update_result)
    if (
        existing_vote := request.app.database["Vote"].find_one({"_id": voteId})
    ) is not None:
        return existing_vote

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Vote with ID {voteId} not found",
    )


@router_vote.post("/delete/{voteId}", response_description="Delete a Vote")
async def delete_vote(voteId: PydanticObjectId, request: Request, response: Response):
    delete_result = request.app.database["Vote"].delete_one({"_id": voteId})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Vote with ID {voteId} not found",
    )
