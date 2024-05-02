from typing import Annotated, Any, Callable, Optional
from pydantic import BaseModel, Field  # type: ignore
from pydantic_core import core_schema # type: ignore
from bson import ObjectId # type: ignore


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

class Student(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias='_id',default=ObjectId())
    studentId: int = Field(...)
    interestSubject: int = Field(...)
    section: int = Field(...)
    term: int = Field(...)
    year: int = Field(...)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "studentId": 6410110123,
                "interestSubject": 240,
                "section": 1,
                "term": 1,
                "year": 2567,
            }
        }

class StudentUpdate(BaseModel):
    studentId: Optional[int]
    interestSubject: Optional[int]
    section: int = Field(...)
    term: int = Field(...)
    year: int = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "studentId": 6410110123,
                "interestSubject": 200,
                "section": 1,
                "term": 1,
                "year": 2567
            }
        }

class SubjectInterest(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias='_id',default=ObjectId())
    subjectId: int = Field(...)
    No_Interest: Optional[int] = Field(...)
    No_Agro_Industry: Optional[int] = Field(...)
    No_Dentistry: Optional[int] = Field(...)
    No_Economics: Optional[int] = Field(...)
    No_Engineering: Optional[int] = Field(...)
    No_Environmental_Management: Optional[int] = Field(...)
    No_Law: Optional[int] = Field(...)
    No_Liberal_Arts: Optional[int] = Field(...)
    No_Management_Sciences: Optional[int] = Field(...)
    No_Medical_Technology: Optional[int] = Field(...)
    No_Medicine: Optional[int] = Field(...)
    No_Natural_Resources: Optional[int] = Field(...)
    No_Nursing: Optional[int] = Field(...)
    No_Pharmaceutical_Sciences: Optional[int] = Field(...)
    No_Science: Optional[int] = Field(...)
    No_Traditional_Thai_Medicine: Optional[int] = Field(...)
    No_Veterinary_Science: Optional[int] = Field(...)
    No_Other: Optional[int] = Field(...)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "subjectId": 1,
                "No_Interest": 1,
                "No_Agro_Industry": 1,
                "No_Dentistry": 1,
                "No_Economics": 1,
                "No_Engineering": 1,
                "No_Environmental_Management": 1,
                "No_Law": 1,
                "No_Liberal_Arts": 1,
                "No_Management_Sciences": 1,
                "No_Medical_Technology": 1,
                "No_Medicine": 1,
                "No_Natural_Resources": 1,
                "No_Nursing": 1,
                "No_Pharmaceutical_Sciences": 1,
                "No_Science": 1,
                "No_Traditional_Thai_Medicine": 1,
                "No_Veterinary_Science": 1,
                "No_Other": 1
            }
        }

class SubjectInterestUpdate(BaseModel):
    subjectId: Optional[int]
    No_Interest: Optional[int]
    No_Agro_Industry: Optional[int]
    No_Dentistry: Optional[int]
    No_Economics: Optional[int]
    No_Engineering: Optional[int]
    No_Environmental_Management: Optional[int]
    No_Law: Optional[int]
    No_Liberal_Arts: Optional[int]
    No_Management_Sciences: Optional[int]
    No_Medical_Technology: Optional[int]
    No_Medicine: Optional[int]
    No_Natural_Resources: Optional[int]
    No_Nursing: Optional[int]
    No_Pharmaceutical_Sciences: Optional[int]
    No_Science: Optional[int]
    No_Traditional_Thai_Medicine: Optional[int]
    No_Veterinary_Science: Optional[int]
    No_Other: Optional[int]

    class Config:
        json_schema_extra = {
            "example": {
                "subjectId": 1,
                "No_Interest": 1,
                "No_Agro_Industry": 1,
                "No_Dentistry": 1,
                "No_Economics": 1,
                "No_Engineering": 1,
                "No_Environmental_Management": 1,
                "No_Law": 1,
                "No_Liberal_Arts": 1,
                "No_Management_Sciences": 1,
                "No_Medical_Technology": 1,
                "No_Medicine": 1,
                "No_Natural_Resources": 1,
                "No_Nursing": 1,
                "No_Pharmaceutical_Sciences": 1,
                "No_Science": 1,
                "No_Traditional_Thai_Medicine": 1,
                "No_Veterinary_Science": 1,
                "No_Other": 1
            }
        }

class comment(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias='_id',default=ObjectId())
    commentId: int
    studentId: int
    comment: str
    subjectId: int
    verifyInfo: str

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "commentId": 1,
                "studentId": 6410110123,
                "comment": "test",
                "subjectId": 1,
                "verifyInfo": 1
            }
        }

class commentUpdate(BaseModel):
    commentId: Optional[int]
    studentId: Optional[int]
    comment: Optional[str]
    subjectId: Optional[int]
    verifyInfo: Optional[str]

    class Config:
        json_schema_extra = {
            "example": {
                "commentId": 1,
                "studentId": 6410110123,
                "comment": "test",
                "subjectId": 1,
                "verifyInfo": 1
            }
        }