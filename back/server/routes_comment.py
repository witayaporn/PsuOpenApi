from fastapi import APIRouter, Body, Request, Response, HTTPException, status  # type: ignore
from fastapi.encoders import jsonable_encoder  # type: ignore
from typing import List
from pydantic_core import core_schema, PydanticOmit  # type: ignore
from bson import ObjectId  # type: ignore
from datetime import datetime
from mongo.models import Comment, CommentUpdate, PydanticObjectId

router_comment = APIRouter()


@router_comment.get(
    "/{subjectId}",
    response_description="Get a comment for subject by subjectId",
    response_model=List[Comment],
)
async def find_comment(subjectId: str, request: Request):
    try:
        comments = list(request.app.database["Comment"].find({"subjectId": subjectId}))
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
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_comment.get(
    "/student/{studentId}",
    response_description="Get a comment for student by studentId",
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
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_comment.get(
    "/getPreviewComment/{subjectId}",
    response_description="Get a best comment for preview by subjectId",
    response_model=List[Comment],
)
async def find_max_vote_comment(subjectId: str, request: Request):
    try:
        comments = list(request.app.database["Comment"].find({"subjectId": subjectId}))
        maxVoteComment = None
        if comments:
            for comment in comments:
                comment["voting"] = {"upvote": 0, "downvote": 0}
                comment["vote"] = 0
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
                if vote:
                    upvote = [
                        upvote["count"] for upvote in vote if upvote["_id"] == "up"
                    ]
                    downvote = [
                        downvote["count"]
                        for downvote in vote
                        if downvote["_id"] == "down"
                    ]
                    upvote = upvote[0] if len(upvote) else 0
                    downvote = downvote[0] if len(downvote) else 0

                    comment["voting"] = {"upvote": upvote, "downvote": downvote}
                    comment["vote"] = upvote - downvote

                if maxVoteComment == None:
                    maxVoteComment = comment
                elif (
                    maxVoteComment["vote"] < comment["vote"]
                    and maxVoteComment["created"] < comment["created"]
                    and comment["parentId"] == None
                ):
                    maxVoteComment = comment
            return [maxVoteComment]
        else:
            return comments
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_comment.post(
    "/",
    response_description="Create a new comment",
    status_code=status.HTTP_201_CREATED,
    response_model=Comment,
)
async def create_comment(request: Request):
    try:
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
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_comment.post(
    "/update/{commentId}",
    response_description="Update a comment",
    response_model=CommentUpdate,
)
async def update_comment(commentId: PydanticObjectId, request: Request):
    try:
        comment = jsonable_encoder(await request.json())
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
            existing_comment := request.app.database["Comment"].find_one(
                {"_id": commentId}
            )
        ) is not None:
            return existing_comment

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with ID {commentId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_comment.post("/delete/{commentId}", response_description="Delete a comment")
async def delete_comment(
    commentId: PydanticObjectId, request: Request, response: Response
):
    try:
        childs_result = request.app.database["Comment"].aggregate(
            [
                {"$match": {"_id": commentId}},
                {
                    "$graphLookup": {
                        "from": "Comment",
                        "startWith": "$_id",
                        "connectFromField": "_id",
                        "connectToField": "parentId",
                        "as": "ids",
                    }
                },
                {
                    "$project": {
                        "ids": {
                            "$map": {"input": "$ids", "as": "id", "in": "$$id._id"}
                        },
                        "_id": 0,
                    }
                },
            ]
        )
        delete_result = request.app.database["Comment"].delete_one({"_id": commentId})

        childs = list(childs_result)[0]
        if len(childs):
            request.app.database["Comment"].delete_many({"_id": {"$in": childs["ids"]}})

        if delete_result.deleted_count == 1:
            response.status_code = status.HTTP_204_NO_CONTENT
            return response

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with ID {commentId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )
