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

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "studentId": 6410110123,
                "interestSubject": 240
            }
        }

class StudentUpdate(BaseModel):
    studentId: Optional[int]
    interestSubject: Optional[int]

    class Config:
        json_schema_extra = {
            "example": {
                "studentId": 6410110123,
                "interestSubject": 200
            }
        }
