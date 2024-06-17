from fastapi import APIRouter, Body, Request, Response, HTTPException, status  # type: ignore
from fastapi.encoders import jsonable_encoder  # type: ignore
from typing import List
from bson import ObjectId  # type: ignore
from mongo.models import Student

router_student = APIRouter()


@router_student.get(
    "/",
    response_description="List all subject interested",
    response_model=List[Student],
)
async def list_student(request: Request):
    try:
        student = list(request.app.database["Student"].find({}))
        return student
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_student.get(
    "/{studentId}",
    response_description="Get student's subject interest by studentId, year and term",
    response_model=List[Student],
)
async def find_student(
    studentId: str, request: Request, term: str = None, year: str = None
):
    try:
        if term is not None and year is not None:
            if (
                student := list(
                    request.app.database["Student"].find(
                        {"studentId": studentId, "term": term, "year": year}
                    )
                )
            ) is not None:
                return student
        else:
            if (
                student := list(
                    request.app.database["Student"].find({"studentId": studentId})
                )
            ) is not None:
                return student
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {studentId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_student.post(
    "/",
    response_description="Create a new subject interested for student",
    status_code=status.HTTP_201_CREATED,
    response_model=Student,
)
async def create_student(request: Request):
    try:
        student = jsonable_encoder(await request.json())
        student["_id"] = ObjectId()
        new_student = request.app.database["Student"].insert_one(student)
        created_student = request.app.database["Student"].find_one(
            {"_id": new_student.inserted_id}
        )
        return created_student
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_student.post(
    "/deleteSubjectInterest/{dataId}",
    response_description="Delete a subject interested",
)
async def delete_student(dataId: str, request: Request, response: Response):
    try:
        delete_result = request.app.database["Student"].delete_one(
            {"_id": ObjectId(dataId)}
        )

        if delete_result.deleted_count == 1:
            response.status_code = status.HTTP_204_NO_CONTENT
            return response

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject interested with ID {dataId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_student.get(
    "/getInterestSubject/{subjectId}",
    response_description="Get a subject interested by subjectId, year and term",
    response_model=List[Student],
)
async def find_student(
    subjectId: str, request: Request, year: str = None, term: str = None
):
    try:
        if year is not None or term is not None:
            if (
                result := list(
                    request.app.database["Student"].find(
                        {"subjectId": subjectId, "year": year, "term": term}
                    )
                )
            ) is not None:
                return result
        else:
            if (
                result := list(
                    request.app.database["Student"].find({"subjectId": subjectId})
                )
            ) is not None:
                return result
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interested subject with studentID {subjectId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )


@router_student.get(
    "/getSubjectStat/{subjectId}",
    response_description="Get a subject stat by subjectId",
    response_model=List,
)
async def find_student(
    subjectId: str, request: Request, year: str = None, term: str = None
):
    try:
        if year is not None or term is not None:
            result = request.app.database["Student"].aggregate(
                [
                    {"$match": {"subjectId": subjectId, "term": term, "year": year}},
                    {
                        "$group": {
                            "_id": {
                                "section": "$section",
                                "studentFaculty": "$studentFaculty",
                            },
                            "count": {"$sum": 1},
                            "totalSectionCount": {"$sum": 1},
                        }
                    },
                    {
                        "$group": {
                            "_id": "$_id.section",
                            "summary": {
                                "$push": {
                                    "studentFaculty": "$_id.studentFaculty",
                                    "count": "$count",
                                }
                            },
                            "totalCount": {"$sum": "$totalSectionCount"},
                        }
                    },
                ]
            )
            return result
        else:
            if (
                result := list(
                    request.app.database["Student"].find({"subjectId": subjectId})
                )
            ) is not None:
                return result
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stat for subjectId {subjectId} not found",
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal Error {str(err)}",
        )
