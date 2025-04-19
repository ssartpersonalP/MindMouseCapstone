from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

click_state = {"clicked": False}

@app.get("/click")
def get_click():
    if click_state["clicked"]:
        click_state["clicked"] = False
        return {"clicked": True}
    return {"clicked": False}

@app.post("/click")
def trigger_click():
    click_state["clicked"] = True
    return {"status": "click registered"}
