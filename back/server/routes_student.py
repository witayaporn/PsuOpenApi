from fastapi import APIRouter, Body, Request, Response, HTTPException, status # type: ignore
from fastapi.encoders import jsonable_encoder # type: ignore
from typing import List, Optional
from bson import ObjectId  # type: ignore

from mongo.models import Student, StudentUpdate

router_student = APIRouter()

@router_student.get("/", response_description="List all Student", response_model=List[Student])
def list_student(request: Request):
    student = list(request.app.database["Student"].find())
    return student

@router_student.get("/{studentId}", response_description="Get a single student by id", response_model=List[Student])
def find_student(studentId: int, request: Request):
    if (student := list(request.app.database["Student"].find({"studentId": studentId}))) is not None:
        return student
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {studentId} not found")

@router_student.post("/", response_description="Create a new Student", status_code=status.HTTP_201_CREATED, response_model=Student)
def create_student(request: Request, student: Student = Body(...)):
    student = jsonable_encoder(student)
    new_student = request.app.database["Student"].insert_one(student)
    created_student = request.app.database["Student"].find_one(
        {"_id": new_student.inserted_id}
    )
    return created_student

@router_student.put("/{studentId}", response_description="Update a Student", response_model=Student)
def update_student(studentId: str, request: Request, student: StudentUpdate = Body(...)):
    student = {k: v for k, v in student.dict().items() if v is not None}
    if len(student) >= 1:
        update_result = request.app.database["Student"].update_one(
            {"studentId": studentId}, {"$set": student}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {studentId} not found")

    if (
        existing_student := request.app.database["Student"].find_one({"studentId": studentId})
    ) is not None:
        return existing_student

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {studentId} not found")

@router_student.delete("/{studentId}", response_description="Delete a Student")
def delete_student(studentId: str, request: Request, response: Response):
    delete_result = request.app.database["Student"].delete_one({"studentId": studentId})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {studentId} not found")

@router_student.get("/{year}", response_description="Get a student by year and term", response_model=List[Student])
def find_student(year: int, term: Union[int, None] = None request: Request):
    if (term != None):
        if (student := list(request.app.database["Student"].find({"year": year, "term": term}))) is not None:
            return student
    else:
        if (student := list(request.app.database["Student"].find({"year": year}))) is not None:
            return student
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {studentId} not found")