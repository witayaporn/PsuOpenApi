from fastapi import APIRouter, Body, Request, Response, HTTPException, status # type: ignore
from fastapi.encoders import jsonable_encoder # type: ignore
from typing import List
from bson import ObjectId  # type: ignore

from mongo.models import Student, StudentUpdate

router_student = APIRouter()

@router_student.get("/", response_description="List all Student", response_model=List[Student])
def list_student(request: Request):
    student = list(request.app.database["Student"].find())
    return student

@router_student.get("/{id}", response_description="Get a single student by id", response_model=Student)
def find_student(id: str, request: Request):
    if (student := request.app.database["Student"].find_one({"_id": ObjectId(id)})) is not None:
        return student
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {id} not found")

@router_student.post("/", response_description="Create a new Student", status_code=status.HTTP_201_CREATED, response_model=Student)
def create_student(request: Request, student: Student = Body(...)):
    student = jsonable_encoder(student)
    new_student = request.app.database["Student"].insert_one(student)
    created_student = request.app.database["Student"].find_one(
        {"_id": new_student.inserted_id}
    )
    return created_student

@router_student.put("/{id}", response_description="Update a Student", response_model=Student)
def update_student(id: str, request: Request, student: StudentUpdate = Body(...)):
    student = {k: v for k, v in student.dict().items() if v is not None}
    if len(student) >= 1:
        update_result = request.app.database["Student"].update_one(
            {"_id": ObjectId(id)}, {"$set": student}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {id} not found")

    if (
        existing_student := request.app.database["Student"].find_one({"_id": ObjectId(id)})
    ) is not None:
        return existing_student

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with ID {id} not found")

@router_student.delete("/{id}", response_description="Delete a Student")
def delete_student(id: str, request: Request, response: Response):
    delete_result = request.app.database["Student"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Book with ID {id} not found")
