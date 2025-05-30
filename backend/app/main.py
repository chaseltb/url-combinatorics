from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import pytesseract
from PIL import Image
import io
import re
import os
import requests
from itertools import product

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility: extract text from image
def extract_text_from_image(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes))
    return pytesseract.image_to_string(image)

# Utility: find URLs using regex
def extract_urls(text: str) -> List[str]:
    return re.findall(r'https://[\w\.-]+(?:/\S*)?', text)

# Utility: try a URL and return if valid
def is_url_valid(url: str) -> bool:
    try:
        response = requests.get(url, timeout=3)
        return response.status_code == 200
    except Exception:
        return False

# Utility: generate permutations with common OCR confusions
def generate_url_combinations(url: str) -> List[str]:
    swap_map = {
        'l': ['l', 'I'],
        'I': ['I', 'l'],
        '0': ['0', 'O'],
        'O': ['O', '0'],
        '1': ['1', 'l']
    }

    positions = [(i, swap_map[c]) for i, c in enumerate(url) if c in swap_map]
    if not positions:
        return []

    combinations = []
    for replacements in product(*[p[1] for p in positions]):
        temp = list(url)
        for (i, _), char in zip(positions, replacements):
            temp[i] = char
        combinations.append(''.join(temp))
    return combinations

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    extracted_text = extract_text_from_image(image_bytes)
    urls = extract_urls(extracted_text)
    return {"urls": urls, "raw_text": extracted_text}

@app.post("/validate-url")
def validate_url(original_url: str = Form(...)):
    if is_url_valid(original_url):
        return {"valid_url": original_url}

    alternatives = generate_url_combinations(original_url)
    for alt_url in alternatives:
        if is_url_valid(alt_url):
            return {"valid_url": alt_url, "suggested": True}

    return JSONResponse(content={"error": "No valid URL found."}, status_code=404)
