FROM python:3.11-slim

# curl 설치
RUN apt update && apt install -y curl

# 컨테이너 내 작업 디렉토리를 /app으로 설정
WORKDIR /code

# requirements.txt 복사 및 설치
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir -r /code/requirements.txt

# 전체 app 디렉토리를 컨테이너에 복사
COPY ./app /code/app

# alembic 관련 파일들 복사
COPY ./alembic /code/alembic
COPY ./alembic.ini /code/alembic.ini

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/api/health || exit 1

# 포트 오픈
EXPOSE 8000

# FastAPI 앱 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
