# -*- coding: utf-8 -*-
# FastAPI를 이용한 간단한 Python 백엔드 서버 예시입니다.
# 이 파일은 현재 "Smart Chamber Finder"의 작동에 직접적인 영향을 주지 않지만,
# 향후 기능을 확장할 때 데이터베이스 연동, API 제공 등의 기반으로 사용할 수 있습니다.

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# FastAPI 앱 생성
app = FastAPI()

# 항온항습기 데이터 모델 정의
class Chamber(BaseModel):
    model: str
    w: int
    h: int
    d: int

# 현재는 JavaScript 파일에 내장된 데이터를 그대로 사용합니다.
# 추후 이 데이터를 데이터베이스에서 불러오도록 수정할 수 있습니다.
chamber_data = [
    {"model": "203-항온항습-ARS0390-1호", "w": 700, "h": 700, "d": 800},
    {"model": "203-항온항습-ARS0390-2호", "w": 700, "h": 700, "d": 800},
    {"model": "203-항온항습-2CA-3호", "w": 609, "h": 749, "d": 600},
    {"model": "203-항온항습-2CA-2호", "w": 609, "h": 749, "d": 600},
    {"model": "203-항온항습-LHU-1호", "w": 500, "h": 599, "d": 390},
    {"model": "203-항온항습-LHU-2호", "w": 500, "h": 599, "d": 390},
    {"model": "203-항온항습-LHU-3호", "w": 500, "h": 599, "d": 390},
    {"model": "203-항온항습-ATT", "w": 601, "h": 545, "d": 692},
    {"model": "203-항온항습-2CA-1호", "w": 609, "h": 749, "d": 600},
    {"model": "203-항온항습-2K", "w": 609, "h": 749, "d": 600},
    {"model": "204-항온항습-662-1호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-662-2호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-662-3호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-662-4호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641신-1호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641신-2호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641구-2호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641신-3호", "w": 400, "h": 400, "d": 400},
    {"model": "204-항온항습-641구-1호", "w": 400, "h": 400, "d": 400}
]

# 루트 엔드포인트
@app.get("/")
def read_root():
    return {"message": "Smart Chamber Finder API에 오신 것을 환영합니다."}

# 모든 항온항습기 데이터를 반환하는 API 엔드포인트
@app.get("/api/chambers", response_model=List[Chamber])
def get_chambers():
    return chamber_data

# 서버 실행 방법 (터미널에서 아래 명령어 실행):
# 1. FastAPI 및 uvicorn 설치: pip install fastapi uvicorn
# 2. 서버 실행: uvicorn app:app --reload
