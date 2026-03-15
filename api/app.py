from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import pickle
import numpy as np   # ✅ ADD THIS IMPORT

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = pickle.load(open("model.pkl","rb"))

df = pd.read_csv("data/traffic.csv")

df["Unique.Visits"] = df["Unique.Visits"].str.replace(",", "").astype(float)

history = df["Unique.Visits"].tolist()


@app.get("/forecast")
def forecast(days: int = 30):

    # ⬇️ ADD THIS CODE HERE
    prediction = model.forecast(steps=days)

    forecast_values = np.exp(prediction).tolist()

    return {
        "history": history[-30:],
        "forecast": forecast_values
    }