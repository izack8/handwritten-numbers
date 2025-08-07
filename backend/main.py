import os
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model_config.model_utils import predict
from PIL import Image, ImageOps

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://caasi.vercel.app", "https://www.izack.dev", 
                   "https://izack.dev", "http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}


@app.post("/api/predict")
async def predict_digit(file: UploadFile = File(...)):
    try:

        image = Image.open(file.file)

        if image.mode != 'L':
            image = image.convert('L')
        image = ImageOps.invert(image)

        prediction = predict(image)
        print(f"Prediction received: {prediction}")

        return {"prediction": prediction}
    except Exception as e:
        return {"error": str(e)}