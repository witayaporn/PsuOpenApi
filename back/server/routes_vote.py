from fastapi import APIRouter, Body, Request, Response, HTTPException, status # type: ignore
from fastapi.encoders import jsonable_encoder # type: ignore
from typing import Annotated, Any, Callable, List, Optional
from pydantic import BaseModel, Field  # type: ignore
from pydantic_core import core_schema, PydanticOmit # type: ignore
from pydantic.json_schema import GenerateJsonSchema, JsonSchemaValue # type: ignore
from bson import ObjectId  # type: ignore

from mongo.models import Vote, VoteUpdate

class _ObjectIdPydanticAnnotation:
    # Based on https://docs.pydantic.dev/latest/usage/types/custom/#handling-third-party-types.

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

PydanticObjectId = Annotated[
    ObjectId, _ObjectIdPydanticAnnotation
]

router_vote = APIRouter()

@router_vote.get("/", response_description="List all Vote", response_model=List[Vote])
async def list_vote(request: Request):
    vote = list(request.app.database["Vote"].find())
    return vote

@router_vote.get("/{commentId}", response_description="Get a Vote by Comment Id", response_model=List[Vote])
async def find_vote(commentId: PydanticObjectId, request: Request):
    if (vote := list(request.app.database["Vote"].find({"commentId": commentId}))) is not None:
        return vote
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Comment with ID {commentId} not found")

@router_vote.post("/", response_description="Create a new Vote", status_code=status.HTTP_201_CREATED, response_model=Vote)
async def create_vote(request: Request, comment: Vote = Body(...)):
    vote = jsonable_encoder(comment)
    new_vote = request.app.database["Vote"].insert_one(vote)
    created_vote = request.app.database["Vote"].find_one(
        {"_id": new_vote.inserted_id}
    )
    return created_vote

@router_vote.put("/{commentId}", response_description="Update a Vote", response_model=Vote)
async def update_vote(commentId: PydanticObjectId, request: Request, vote: VoteUpdate = Body(...)):
    vote = {k: v for k, v in vote.dict().items() if v is not None}
    if len(vote) >= 1:
        update_result = request.app.database["Vote"].update_one(
            {"commentId": commentId}, {"$set": vote}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Vote with ID {commentId} not found")

    if (
        existing_vote := request.app.database["Vote"].find_one({"commentId": commentId})
    ) is not None:
        return existing_vote

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Vote with ID {commentId} not found")

@router_vote.delete("/{commentId}", response_description="Delete a Vote")
async def delete_vote(commentId: PydanticObjectId, request: Request, response: Response):
    delete_result = request.app.database["Vote"].delete_one({"commentId": commentId})
    
    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Vote with ID {commentId} not found")