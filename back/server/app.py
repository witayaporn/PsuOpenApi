import os
import psutil
import uvicorn  # type: ignore
from typing import Union
from contextlib import asynccontextmanager
from fastapi import FastAPI  # type: ignore
from dotenv import dotenv_values  # type: ignore
from pymongo import MongoClient  # type: ignore
from pymongo.errors import ServerSelectionTimeoutError  # type: ignore

from routes_student import router_student
from routes_comment import router_comment
from routes_vote import router_vote

config = dotenv_values("./mongo/.env")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        app.mongodb_client = MongoClient(
            config["ATLAS_URI"], serverSelectionTimeoutMS=1
        )
        app.mongodb_client.server_info()
        app.database = app.mongodb_client[config["DB_NAME"]]
        print("Connected to the MongoDB database!")
    except ServerSelectionTimeoutError:
        print("Fail Connect to the MongoDB database!")
        pid = os.getpid()
        parent = psutil.Process(pid)
        for child in parent.children(recursive=True):
            child.kill()
        parent.kill()
    yield
    app.mongodb_client.close()


app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(router_student, tags=["student"], prefix="/student")

app.include_router(router_comment, tags=["comment"], prefix="/comment")

app.include_router(router_vote, tags=["vote"], prefix="/vote")


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
