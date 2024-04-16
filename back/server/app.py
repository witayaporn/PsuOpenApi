import uvicorn # type: ignore
from typing import Union
from fastapi import FastAPI # type: ignore
from dotenv import dotenv_values # type: ignore
from pymongo import MongoClient # type: ignore

from routes_student import router_student

config = dotenv_values("./mongo/.env")

app = FastAPI()

@app.on_event("startup")
def startup_db_client():
    try:
        app.mongodb_client = MongoClient(config["ATLAS_URI"])
        app.database = app.mongodb_client[config["DB_NAME"]]
        print("Connected to the MongoDB database!")
    except:
        print("Fail Connect to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

app.include_router(router_student, tags=["student"], prefix="/student")


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
    