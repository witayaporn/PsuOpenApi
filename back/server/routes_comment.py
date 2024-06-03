from fastapi import APIRouter, Body, Request, Response, HTTPException, status  # type: ignore
from fastapi.encoders import jsonable_encoder  # type: ignore
from typing import List, Optional
from bson import ObjectId  # type: ignore
from mongo.models import Comment, CommentUpdate
from datetime import datetime, timezone, timedelta

router_comment = APIRouter()

# @router_comment.get("/", response_description="List all Comment", response_model=List[Comment])
# async def list_comment(request: Request):
#     comment = list(request.app.database["Comment"].find())
#     return comment


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


@router_comment.put(
    "/{subjectId}", response_description="Update a Comment", response_model=Comment
)
async def update_comment(
    subjectId: str, request: Request, comment: CommentUpdate = Body(...)
):
    comment = {k: v for k, v in comment.dict().items() if v is not None}
    if len(comment) >= 1:
        update_result = request.app.database["Comment"].update_one(
            {"subjectId": subjectId}, {"$set": comment}
        )

        if update_result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Comment with ID {subjectId} not found",
            )

    if (
        existing_comment := request.app.database["Comment"].find_one(
            {"subjectId": subjectId}
        )
    ) is not None:
        return existing_comment

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Comment with ID {subjectId} not found",
    )


@router_comment.delete("/{subjectId}", response_description="Delete a Comment")
async def delete_comment(subjectId: str, request: Request, response: Response):
    delete_result = request.app.database["Comment"].delete_one({"subjectId": subjectId})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Comment with ID {subjectId} not found",
    )
