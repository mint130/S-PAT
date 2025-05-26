# 1. 로컬에서 실행

## 1.1 Git clone

```bash
git clone https://lab.ssafy.com/s12-final/S12P31S108.git
```

## 1.2 DB 설치

- redis 설치 & 실행

    ```bash
    docker pull redis
    docker run --name redis -d -p 6379:6379 redis
    ```

    - port: 6379
    - 기본값
      - PASSWORD: none
- Postgres 설치

    ```bash
    docker pull postgres
    docker run --name postgres -e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -e POSTGRES_DB=${POSTGRES_DB} -p 5432:5432 -d postgres
    ```
    - port: 5432
    - 기본값
      - POSTGRES_USER: postgres
      - POSTGRES_PASSWORD: 1234
      - POSTGRES_DB: mydb

## 1.3 FastAPI 실행

- 폴더 열기

    ```bash
    cd BE
    ```

- BE 폴더 아래 `.env`  생성

    ```bash
    BE
     ┣ alembic
     ┣ app
     ┣ .env
     ┣ .gitignore
     ┣ alembic.ini
     ┣ backend.Dockerfile
     ┣ Dockerfile
     ┗ requirements.txt
    ```

  <details>
  <summary>BE env 표</summary>

  | Variable Name          | Default Value                                                                                                                            | Description              |
  |------------------------|------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
  | LANGSMITH_TRACING      | true                                                                                                                                     | Enable LangSmith tracing |
  | LANGSMITH_ENDPOINT     | "https://api.smith.langchain.com"                                                                                                        | URL to LangSmith API     |
  | LANGSMITH_API_KEY      |                                                                                                                                          | LangSmith API key        |
  | LANGSMITH_PROJECT      | "S-PAT"                                                                                                                                  | LangSmith 프로젝트 명      |
  | OPENAI_API_KEY         |                                                                                                                                          | OpenAI API key           |
  | CLAUDE_API_KEY         |                                                                                                                                          | Claude API key           |
  | GEMINI_API_KEY         |                                                                                                                                          | Gemini API key           |
  | GROK3_API_KEY          |                                                                                                                               | Grok3 API key            |
  | DATABASE_URL           | postgresql://{docker에서 실행할 때 지정한 POSTGRES_USER}:{docker에서 실행할 때 지정한 POSTGRES_PASSWORD}@localhost:5432/{docker에서 실행할 때 지정한 POSTGRES_DB}<br/>default: postgresql://postgres:1234@localhost:5432/mydb  | Database connection URL  |
  | DEBUG                  | True                                                                                                                                     | Enable debug mode        |
  | REDIS_HOST             | localhost                                                                                                                                    | Redis host               |
  | REDIS_PORT             | 6379                                                                                                                                     | Redis port               |
  | REDIS_URL              | redis://localhost:6379/0                                                             | Redis connection URL     |

   </details>

  ```bash
    LANGSMITH_TRACING=true
    LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
    LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
    LANGSMITH_PROJECT=${LANGSMITH_PROJECT}
    
    #LLM
    OPENAI_API_KEY=${OPENAI_API_KEY}
    CLAUDE_API_KEY=${CLAUDE_API_KEY}
    GEMINI_API_KEY=${GEMINI_API_KEY}
    GROK3_API_KEY=${GROK3_API_KEY}
    
    # DB
    DATABASE_URL=postgresql://${docker에서 실행할 때 지정한 POSTGRES_USER}:${docker에서 실행할 때 지정한 POSTGRES_PASSWORD}@localhost:5432/${docker에서 실행할 때 지정한 POSTGRES_DB}
    DEBUG=True
    
    # Redis
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_URL=redis://localhost:6379/0
    ```

- 필요한 패키지 설치, 마이그레이션 적용 후 실행

    ```bash
    # 패키지 설치
    pip install -r requirements.txt
    
    # 마이그레이션 적용
    alembic upgrade head
    
    # 적용
    uvicorn app.main:app --reload
    ```

- Celery 실행 (새로운 bash 열어서 BE 폴더 내에서 실행)

    ```bash
    # --pool solo: Window 환경용 명령어
    celery -A app.core.celery.celery_app worker --loglevel=info --pool=solo 
    ```


## 1.4 React 실행

- 폴더 열기

    ```bash
    cd FE
    ```

- FE 폴더 아래 `.env.development` 생성

    ```bash
     FE
     ┣ public
     ┣ src
     ┣ .env.development
     ┣ Dockerfile
     ┣ ...
     ┗ vite.config.ts
    ```

    ```bash
    VITE_API_URL=http://localhost:8000
    VITE_HOST=localhost
    ```

- 필요한 패키지 설치, 실행

    ```bash
    npm install
    npm run dev
    ```


# 2. 로컬에서 Docker 실행

## 2.1 Git clone

```bash
git clone https://lab.ssafy.com/s12-final/S12P31S108.git
```

## 2.2 env 작성

- 루트 폴더 아래 `.env` 작성

    ```bash
     S12P31S108
     ┣ BE
     ┣ FE
     ┣ .env
     ┣ docker-compose.yml
     ┣ exec
     ┣ img
     ┣ README.md
     ┗ vite.config.ts
    ```
  <details>
  <summary>env 표</summary>

  | **Variable Name** | **Default Value**                                                                                                                        | **Description**    |
    | --- |------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
  | DATABASE_URL | postgresql://{POSTGRES_USER}:{POSTRGRES_PASSWORD}@postgres:5432/{POSTGRES_DB}<br/>default :postgresql://postgres:1234@postgres:5432/mydb | PostgreSQL 연결 주소   |
  | DEBUG | True                                                                                                                                     |                    |
  | POSTGRES_USER | postgres                                                                                                                                 | PostgreSQL USER 이름 |
  | POSTGRES_PASSWORD | 1234                                                                                                                                     | PostgreSQL 비밀번호    |
  | POSTGRES_DB | mydb                                                                                                                                     | PostgreSQL DB 이름   |
  | REDIS_HOST | redis                                                                                                                                    | Redis 호스트          |
  | REDIS_PORT | 6379                                                                                                                                     | Redis 포트           |
  | REDIS_PASSWORD | 1234                                                                                                                                     | Redis 비밀번호         |
  | REDIS_URL | redis://:{REDIS_PASSWORD}@redis:6379/0<br/>default: redis://:1234@redis:6379/0                                                           | Redis 연결 주소        |

  </details>

    ```bash
    # DB
    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSRGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    POSTGRES_USER=${POSTGRES_USER}
    POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    POSTGRES_DB=${POSTGRES_DB}
    
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=${REDIS_PASSWORD}
    
    REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
    ```

- BE 폴더 아래 `.env` 작성
    ```bash
    BE
     ┣ alembic
     ┣ app
     ┣ .env
     ┣ .gitignore
     ┣ alembic.ini
     ┣ backend.Dockerfile
     ┣ Dockerfile
     ┗ requirements.txt
    ```
  <details>
  <summary>BE env 표</summary>
    
  | Variable Name          | Default Value                                                                                                                            | Description              |
    |------------------------|------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
  | LANGSMITH_TRACING      | true                                                                                                                                     | Enable LangSmith tracing |
  | LANGSMITH_ENDPOINT     | "https://api.smith.langchain.com"                                                                                                        | URL to LangSmith API     |
  | LANGSMITH_API_KEY      |                                                                                                                                          | LangSmith API key        |
  | LANGSMITH_PROJECT      | "S-PAT"                                                                                                                                  | LangSmith 프로젝트 명      |
  | OPENAI_API_KEY         |                                                                                                                                          | OpenAI API key           |
  | CLAUDE_API_KEY         |                                                                                                                                          | Claude API key           |
  | GEMINI_API_KEY         |                                                                                                                                          | Gemini API key           |
  | GROK3_API_KEY          |                                                                                                                               | Grok3 API key            |
  | DATABASE_URL           | postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:5432/{POSTGRES_DB}<br/>default: postgresql://postgres:1234@postgres:5432/mydb | Database connection URL  |
  | DEBUG                  | True                                                                                                                                     | Enable debug mode        |
  | REDIS_HOST             | redis                                                                                                                                    | Redis host               |
  | REDIS_PORT             | 6379                                                                                                                                     | Redis port               |
  | REDIS_PASSWORD         | 1234                                                                                                                                     | Redis password           |
  | REDIS_URL              | redis://:{REDIS_PASSWORD}@redis:6379/0<br/>default: redis://:1234@redis:6379/0                                                           | Redis connection URL     |

   </details>
  
    ```bash
    LANGSMITH_TRACING=true
    LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
    LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
    LANGSMITH_PROJECT=${LANGSMITH_PROJECT}
    
    #LLM
    OPENAI_API_KEY=${OPENAI_API_KEY}
    CLAUDE_API_KEY=${CLAUDE_API_KEY}
    GEMINI_API_KEY=${GEMINI_API_KEY}
    GROK3_API_KEY=${GROK3_API_KEY}
    
    # DB
    # root env Database 정보와 동일
    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    DEBUG=True
    
    # Redis
    # root env Redis 정보와 동일
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=${REDIS_PASSWORD}
    REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
    ```
- FE 폴더 아래 `.env.development` 생성

    ```bash
     FE
     ┣ public
     ┣ src
     ┣ .env.development
     ┣ Dockerfile
     ┣ ...
     ┗ vite.config.ts
    ```

    ```bash
    VITE_API_URL=http://localhost:8000
    VITE_HOST=localhost
    ```

## 2.3 Docker compose 실행

```bash
docker compose up -d
```
---
# 개선 사항