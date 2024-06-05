from fastapi import APIRouter, Body, Request, Response, HTTPException, status  # type: ignore
from fastapi.encoders import jsonable_encoder  # type: ignore
from typing import Annotated, Any, Callable, List
from pydantic_core import core_schema, PydanticOmit  # type: ignore
from bson import ObjectId  # type: ignore
from mongo.models import Comment, CommentUpdate
from datetime import datetime


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

router_comment = APIRouter()


@router_comment.get(
    "/{subjectId}",
    response_description="Get a Comment by subjectId",
    response_model=List[Comment],
)
async def find_comment(subjectId: str, request: Request):
    try:
        comments = list(request.app.database["Comment"].find({"subjectId": subjectId}))

        for comment in comments:
            # comment["reply"] = []
            # comment["voting"] = {}
            # comment["vote"] = 0
            # comment["voteInfo"] = list(request.app.database["Vote"].find({'commentId': comment["_id"]}))
            vote = list(
                request.app.database["Vote"].aggregate(
                    [
                        {
                            "$match": {
                                "commentId": comment["_id"],
                            }
                        },
                        {
                            "$group": {
                                "_id": "$voteType",
                                "count": {"$sum": 1},
                            }
                        },
                    ]
                )
            )
            # print(vote)
            if vote:
                upvote = [upvote["count"] for upvote in vote if upvote["_id"] == "up"]
                downvote = [
                    downvote["count"] for downvote in vote if downvote["_id"] == "down"
                ]
                upvote = upvote[0] if len(upvote) else 0
                downvote = downvote[0] if len(downvote) else 0

                comment["voting"] = {"upvote": upvote, "downvote": downvote}
                comment["vote"] = upvote - downvote
            # print(upvote)
            # # print(type(comment["_id"]))
            # if comment["parentId"]:
            #     for parent in comments:
            #         if parent["_id"] == comment["parentId"]:
            #             # print(parent["reply"])
            #             parent["reply"].append(comment["_id"])
        # return comments

        return comments
    except BaseException:
        pass
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Comment with ID {subjectId} not found",
    )


@router_comment.get(
    "/student/{studentId}",
    response_description="Get a Comment by studentId",
    response_model=List[Comment],
)
async def find_student_comment(studentId: str, request: Request):
    try:
        comments = list(request.app.database["Comment"].find({"studentId": studentId}))

        for comment in comments:
            vote = list(
                request.app.database["Vote"].aggregate(
                    [
                        {
                            "$match": {
                                "commentId": comment["_id"],
                            }
                        },
                        {
                            "$group": {
                                "_id": "$voteType",
                                "count": {"$sum": 1},
                            }
                        },
                    ]
                )
            )
            # print(vote)
            if vote:
                upvote = [upvote["count"] for upvote in vote if upvote["_id"] == "up"]
                downvote = [
                    downvote["count"] for downvote in vote if downvote["_id"] == "down"
                ]
                upvote = upvote[0] if len(upvote) else 0
                downvote = downvote[0] if len(downvote) else 0

                comment["voting"] = {"upvote": upvote, "downvote": downvote}
                comment["vote"] = upvote - downvote

        return comments
    except BaseException:
        pass
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Comment with studentID {studentId} not found",
    )


@router_comment.post(
    "/",
    response_description="Create a new Comment",
    status_code=status.HTTP_201_CREATED,
    response_model=Comment,
)
async def create_comment(request: Request):
    comment = jsonable_encoder(await request.json())
    comment["_id"] = ObjectId()
    comment["created"] = datetime.now()
    comment["parentId"] = (
        ObjectId(comment["parentId"]) if len(comment["parentId"]) else None
    )
    new_comment = request.app.database["Comment"].insert_one(comment)
    created_comment = request.app.database["Comment"].find_one(
        {"_id": new_comment.inserted_id}
    )
    return created_comment


@router_comment.post(
    "/update/{commentId}",
    response_description="Update a Comment",
    response_model=CommentUpdate,
)
async def update_comment(commentId: PydanticObjectId, request: Request):
    # comment = {k: v for k, v in comment.dict().items() if v is not None}
    comment = jsonable_encoder(await request.json())
    # comment = ObjectId(comment["commentId"])
    if len(comment):
        update_result = request.app.database["Comment"].update_one(
            {"_id": commentId}, {"$set": comment}
        )

        if update_result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with ID {commentId} not found",
            )

    if (
        existing_comment := request.app.database["Comment"].find_one({"_id": commentId})
    ) is not None:
        return existing_comment

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Comment with ID {commentId} not found",
    )


@router_comment.post("/delete/{commentId}", response_description="Delete a Comment")
async def delete_comment(
    commentId: PydanticObjectId, request: Request, response: Response
):
    delete_result = request.app.database["Comment"].delete_one({"_id": commentId})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Comment with ID {commentId} not found",
    )
