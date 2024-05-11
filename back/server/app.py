import os
import psutil
import uvicorn # type: ignore
from typing import Union
from contextlib import asynccontextmanager
from fastapi import FastAPI # type: ignore
from dotenv import dotenv_values # type: ignore
from pymongo import MongoClient # type: ignore
from pymongo.errors import ServerSelectionTimeoutError # type: ignore

from routes_student import router_student
from routes_subjectinterest import router_subjectinterest
from routes_comment import router_comment

config = dotenv_values("./mongo/.env")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        app.mongodb_client = MongoClient(config["ATLAS_URI"], serverSelectionTimeoutMS=1)
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

#@app.on_event("startup")
#def startup_db_client():
#    try:
#        app.mongodb_client = MongoClient(config["ATLAS_URI"], serverSelectionTimeoutMS=1)
#        app.mongodb_client.server_info()
#        app.database = app.mongodb_client[config["DB_NAME"]]
#        print("Connected to the MongoDB database!")
#    except ServerSelectionTimeoutError:
#        print("Fail Connect to the MongoDB database!")
#        pid = os.getpid()
#        parent = psutil.Process(pid)
#        for child in parent.children(recursive=True):
#            child.kill()
#        parent.kill()


#@app.on_event("shutdown")
#def shutdown_db_client():
#    app.mongodb_client.close()


@app.get("/")
def read_root():
    return {"Hello": "World"}

#@app.get("/items/{item_id}")
#def read_item(item_id: int, q: Union[str, None] = None):
#    return {"item_id": item_id, "q": q}

app.include_router(router_student, tags=["student"], prefix="/student")

#app.include_router(router_subjectinterest, tags=["SubjectInterest"], prefix="/SubjectInterest")

app.include_router(router_comment, tags=["comment"], prefix="/Comment")


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
    