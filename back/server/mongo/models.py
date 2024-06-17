from typing import Annotated, Any, Callable, Optional
from pydantic import BaseModel, Field  # type: ignore
from pydantic_core import core_schema, PydanticOmit  # type: ignore
from pydantic.json_schema import GenerateJsonSchema, JsonSchemaValue  # type: ignore
from bson import ObjectId  # type: ignore
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
                core_schema.is_instance_schema(ObjectId),
                core_schema.no_info_plain_validator_function(validate_from_str),
            ],
            serialization=core_schema.to_string_ser_schema(),
        )


PydanticObjectId = Annotated[ObjectId, _ObjectIdPydanticAnnotation]


class Student(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias="_id", default=ObjectId())
    studentId: str = Field(...)
    studentFaculty: str = Field(...)
    subjectId: str = Field(...)
    section: str = Field(...)
    term: str = Field(...)
    year: str = Field(...)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "studentId": "6410110123",
                "studentFaculty": "eng",
                "subjectId": "00123456",
                "section": "01",
                "term": "1",
                "year": "2567",
            }
        }


class StudentUpdate(BaseModel):
    studentId: Optional[str]
    studentFaculty: Optional[str]
    subjectId: Optional[str]
    section: str = Field(...)
    term: str = Field(...)
    year: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "studentId": "6410110123",
                "studentFaculty": "eng",
                "subjectId": "00123456",
                "section": "1",
                "term": "1",
                "year": "2567",
            }
        }


class Comment(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias="_id", default=ObjectId())
    subjectId: str = Field(...)
    studentId: str = Field(...)
    studentInfoTH: str = Field(default="")
    studentInfoEN: str = Field(default="")
    extraInfo: str = Field(default="")
    parentId: Optional[PydanticObjectId] = None
    content: str = Field(...)
    created: datetime = Field(default=datetime.now(tz=timezone(timedelta(hours=7))))
    voting: dict = {"upvote": 0, "downvote": 0}
    vote: int = 0

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "subjectId": "0022683",
                "studentId": "6410110123",
                "studentInfoTH": "นายxxxxx xxxxx",
                "studentInfoEN": "xxxxxx xxxxx",
                "parentId": "",
                "content": "ทดสอบ comment",
                "voting": [],
            }
        }


class CommentUpdate(BaseModel):
    subjectId: Optional[str]
    studentId: Optional[str]
    studentInfoTH: Optional[str]
    studentInfoEN: Optional[str]
    extraInfo: Optional[str]
    content: Optional[str]

    class Config:
        json_schema_extra = {
            "example": {
                "subjectId": "0022683",
                "studentId": "6410110123",
                "studentInfoTH": "นายxxxxx xxxxx",
                "studentInfoEN": "xxxxxx xxxxx",
                "content": "ทดสอบ comment",
            }
        }


class Vote(BaseModel):
    id: Optional[PydanticObjectId] = Field(alias="_id", default=ObjectId())
    studentId: str = Field(...)
    commentId: Optional[PydanticObjectId] = Field(alias="commentId", default=None)
    subjectId: str = Field(...)
    voteType: str = Field(...)
    created: datetime = Field(default=datetime.now())

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "studentId": "6410110123",
                "commentId": "",
                "sujectId": "",
                "voteType": "up",
            }
        }


class VoteUpdate(BaseModel):
    studentId: Optional[str]
    commentId: Optional[PydanticObjectId]
    subjectId: Optional[str]
    voteType: Optional[str]

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {"studentId": "6410110123", "commentId": "", "voteType": 2}
        }


class MyGenerateJsonSchema(GenerateJsonSchema):
    def handle_invalid_for_json_schema(
        self, schema: core_schema.CoreSchema, error_info: str
    ) -> JsonSchemaValue:
        raise PydanticOmit


Student.model_json_schema(mode="serialization")
StudentUpdate.model_json_schema(mode="serialization")
Comment.model_json_schema(mode="serialization")
CommentUpdate.model_json_schema(mode="serialization")
Vote.model_json_schema(mode="serialization")
VoteUpdate.model_json_schema(mode="serialization")
