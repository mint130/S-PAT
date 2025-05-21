# 1. 프로젝트 기술 스택

## 1.1 FrontEnd

- React `19.0.0`
- typescript `5.7.2`
- vite `6.3.1`
- axios `1.9.0`
- eslint `9.22.0`
- tailwindcss `3.4.17`
- zustand `5.0.3`
- postcss `8.5.3`
- autoprefixer `10.4.21`
- ag-grid-react `33.2.4`
- react-spinners `0.17.0`
- recharts `2.15.3`

## 1.2 BackEnd

- Python `3.11`
- FastAPI `0.115.12`
- uvicorn `0.34.2`
- Celery `5.5.2`
- SQLAlchemy `2.0.40`
- Alembic `1.15.2`
- PostgreSQl psycopg2-binary `2.9.10`
- Redis `6.0.0`
- Anthropic `0.51.0`
- OpenAI `1.76.0`
- LangChain `0.3.24`
    - langchain-anthropic `0.3.13`
    - langchain-openai `0.3.14`
    - langchain-google-genai `2.1.4`
    - langchain-community `0.3.22`
    - langchain-core `0.3.59`
- Google AI Generative Language `0.6.18`
- FAISS-CPU `1.11.0`
- Pandas `2.2.2`
- NumPy `1.26.4`
- OpenPyXL `3.1.2`
- HTTPX `0.28.1`
- Requests `2.32.3`
- aiohttp `3.11.18`
- Pydantic `2.11.3`
- Pydantic-settings `2.9.1`
- orjson `3.10.16`
- BeautifulSoup4 `4.13.4`
- Tiktoken `0.9.0`
- python-dotenv `1.1.0`
- regex `2024.11.6`

## 1.3 Infra

- AWS EC2
- Ubuntu `22.04.4`
- Docker `28.1.1`
- Docker Compose `2.35.1`
- Nginx `1.27.5`
- Redis `8.0.0`
- PostgreSQL `17.5`
- Jenkins `2.509`
---
# 2. 프로젝트 설정 파일

## 2.1 FastAPI(BackEnd)
```
📦BE
 ┣ 📂alembic
 ┣ 📂app
 ┣ 📜.gitignore
 ┣ 📜alembic.ini
 ┣ 📜Dockerfile
 ┣ 📜.env
 ┗ 📜requirements.txt
 ```

- `.env`

    ```bash
    LANGSMITH_TRACING=true
    LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
    LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
    LANGSMITH_PROJECT="S-PAT"
    
    #LLM
    OPENAI_API_KEY=${OPENAI_API_KEY}
    CLAUDE_API_KEY=${CLAUDE_API_KEY}
    GEMINI_API_KEY=${GEMINI_API_KEY}
    GROK3_API_KEY=${GROK3_API_KEY}
    
    # DB
    DATABASE_URL=postgresql://s108:s108spat!@postgres:5432/spatdb
    DEBUG=True
    
    # Redis
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=s108spat!
    REDIS_URL=redis://:s108spat%21@redis:6379/0
    ```

- `requirements.txt`

    ```python
    aiohappyeyeballs==2.6.1
    aiohttp==3.11.18
    aiosignal==1.3.2
    alembic==1.15.2
    annotated-types==0.7.0
    anthropic==0.51.0
    anyio==4.9.0
    attrs==25.3.0
    beautifulsoup4==4.13.4
    cachetools==5.5.2
    celery==5.5.2
    certifi==2025.1.31
    charset-normalizer==3.4.1
    click==8.1.8
    colorama==0.4.6
    dataclasses-json==0.6.7
    distro==1.9.0
    et_xmlfile==2.0.0
    faiss-cpu==1.11.0
    fastapi==0.115.12
    filetype==1.2.0
    frozenlist==1.6.0
    google==3.0.0
    google-ai-generativelanguage==0.6.18
    google-api-core==2.24.2
    google-api-python-client==2.169.0
    google-auth==2.40.1
    google-auth-httplib2==0.2.0
    googleapis-common-protos==1.70.0
    greenlet==3.2.1
    grpcio==1.71.0
    grpcio-status==1.71.0
    h11==0.16.0
    httpcore==1.0.9
    httplib2==0.22.0
    httptools==0.6.4
    httpx==0.28.1
    httpx-sse==0.4.0
    idna==3.10
    jiter==0.9.0
    jsonpatch==1.33
    jsonpointer==3.0.0
    langchain==0.3.24
    langchain-anthropic==0.3.13
    langchain-community==0.3.22
    langchain-core==0.3.59
    langchain-google-genai==2.1.4
    langchain-openai==0.3.14
    langchain-text-splitters==0.3.8
    langchain-xai==0.2.3
    langsmith==0.3.34
    Mako==1.3.10
    MarkupSafe==3.0.2
    marshmallow==3.26.1
    multidict==6.4.3
    mypy_extensions==1.1.0
    numpy==1.26.4
    openai==1.76.0
    openpyxl==3.1.2
    orjson==3.10.16
    packaging==24.2
    pandas==2.2.2
    propcache==0.3.1
    proto-plus==1.26.1
    protobuf==5.29.4
    psycopg2-binary==2.9.10
    pyasn1==0.6.1
    pyasn1_modules==0.4.2
    pydantic==2.11.3
    pydantic-settings==2.9.1
    pydantic_core==2.33.1
    pyparsing==3.2.3
    python-dateutil==2.9.0.post0
    python-dotenv==1.1.0
    python-multipart==0.0.20
    pytz==2025.2
    PyYAML==6.0.2
    redis==6.0.0
    regex==2024.11.6
    requests==2.32.3
    requests-toolbelt==1.0.0
    rsa==4.9.1
    six==1.17.0
    sniffio==1.3.1
    soupsieve==2.7
    SQLAlchemy==2.0.40
    starlette==0.46.2
    tenacity==9.1.2
    tiktoken==0.9.0
    tqdm==4.67.1
    typing-inspect==0.9.0
    typing-inspection==0.4.0
    typing_extensions==4.13.2
    tzdata==2025.2
    uritemplate==4.1.1
    urllib3==2.4.0
    uvicorn==0.34.2
    watchfiles==1.0.5
    websockets==15.0.1
    yarl==1.20.0
    zstandard==0.23.0
    ```
---

# 3. EC2 세팅

## 3.1 Docker, Docker Compose 설치

1. 우분투 시스템 패키지 업데이트

    ```bash
    sudo apt-get update
    ```

2. HTTPS 관련 패키지 설치

    ```bash
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    ```

3. docker repository 접근 위한 gpg 키 설정

    ```bash
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    ```

4. docker repository 추가

    ```bash
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") \
    stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```

5. Ubuntu 시스템 패키지 업데이트, Docker, Docker Compose 설치

    ```bash
    sudo apt update
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

6. Docker, Docker Compose 버전 확인

    ```bash
    docker --version
    docker compose version
    ```


## 3.2 Docker 권한 추가하기

1. Docker 그룹에 사용자 추가

    ```bash
    sudo usermod -aG docker ${USER}
    ```

   터미널 재시작

    ```bash
    newgrp docker
    ```

2. 사용자 그룹 확인하기

    ```bash
    id -nG
    ```
---

# 4. Docker 이미지 Push & Pull

## 4.1 Docker Hub 로그인

- Docker Hub 토큰 발급받기 : Acount settings → Create access token
  - Read, Write, Delete 권한
- Docker Hub 로그인 후 발급받은 토큰 입력

    ```bash
    docker login -u [사용자명]
    ```


## 4.2 FastAPI 프로젝트 Docker File 생성, 이미지 Build & Push
  ```angular2html
    📦BE
    ┣ 📂alembic
    ┣ 📂app
    ┣ 📜alembic.ini
    ┣ 📜Dockerfile
    ┣ 📜.env
    ┗ 📜requirements.txt
  ```
- 프로젝트 루트에 `Dockerfile`생성

  ```docker
    # 
    FROM python:3.11-slim
    
    # curl 설치
    RUN apt update && apt install -y curl
    
    # 컨테이너 내 작업 디렉토리를 /code로 설정
    WORKDIR /code
    
    # 호스트의 requirements.txt를 컨테이너에 복사
    COPY ./requirements.txt /code/requirements.txt
    
    # 필요한 파이썬 패키지를 설치
    RUN pip install --no-cache-dir -r /code/requirements.txt
    
    # 컨테이너에서 사용할 포트 8000을 명시적으로 열어줌
    EXPOSE 8000
    
    # 전체 app 디렉토리를 컨테이너에 복사
    COPY ./app /code/app
    
    # alembic 관련 파일들 복사
    COPY ./alembic /code/alembic
    COPY ./alembic.ini /code/alembic.ini
    
    HEALTHCHECK --interval=30s --timeout=3s \
      CMD curl -f http://localhost:8000/api/health || exit 1
    
    # FastAPI 앱을 uvicorn으로 실행
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```

- 이미지 빌드, 푸시

    ```bash
    docker build -t [사용자명]/s-pat-fastapi:latest .
    
    # 태그 추가 - Blue Green 배포
    docker tag [사용자명]/s-pat-fastapi:latest [사용자명]/s-pat-fastapi:blue
    docker tag [사용자명]/s-pat-fastapi:latest [사용자명]/s-pat-fastapi:green
    
    # 푸쉬
    docker push [사용자명]/s-pat-fastapi:latest
    docker push [사용자명]/s-pat-fastapi:blue
    docker push [사용자명]/s-pat-fastapi:green
    ```


## 4.3 React 프로젝트 Docker File 생성, 이미지 Build & Push
```angular2html
  📦FE
  ┣ 📂public
  ┣ 📂src
  ┣ 📜Dockerfile
  ┣ 📜nginx.conf
  ┣ ..
```
- 프로젝트 루트에 `Dockerfile`생성

    ```docker
    # 빌드
    FROM node:18-alpine AS build
    
    # 작업 디렉토리 설정
    WORKDIR /app
    
    # package.json, package-lock.json 설치
    COPY package*.json ./
    
    # 종속성 설치
    RUN npm ci
    
    # 소스코드 복사
    COPY . .
    
    # React 빌드
    RUN npm run build
    
    # 실행 단계
    FROM nginx:alpine
    
    # nginx 설정 파일 삭제
    RUN rm -rf /etc/nginx/conf.d/*
    
    # nginx 설정 복사
    COPY nginx.conf /etc/nginx/conf.d/app.conf
    
    # 빌드 단계에서 생성된 파일을 nginx의 서비스 디렉토리로 복사
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # 3000 포트 노출
    EXPOSE 3000
    
    # nginx 실행
    CMD ["nginx", "-g", "daemon off;"]
    ```

- 프로젝트 루트에 `nginx.conf` 생성
  ```bash
  server {
    listen 3000;
    
    location / {
      # React 앱 서비스
      root /usr/share/nginx/html;
      index index.html index.htm;
  
      try_files $uri $uri/ /index.html;
    }
  }
  ```

- 이미지 빌드&푸시

    ```bash
    docker build -t [사용자명]/s-pat-react .
    docker push [사용자명]/s-pat-react
    ```
---

# 5. SSL 설정

## 5.1 가비아 도메인 구매 및 DNS 설정

- My 가비아 → DNS 설정 → 도메인 연결 → DNS 설정
  - 타입: CNAME
  - 호스트: @
  - 값/위치: k12s108.p.ssafy.io.

## 5.2 SSL 인증서 발급

1. cerbot 설치

    ```bash
    sudo apt update
    sudo apt install certbot -y
    ```

2. SSL 인증서 발급받기

    ```bash
    sudo certbot --standalone -d k12s108.p.ssafy.io -d s-pat.site certonly
    ```
  - 갱신

    ```bash
    sudo certbot renew
    ```

3. SSL 디렉토리 생성

    ```bash
    sudo mkdir -p ./nginx/ssl
    sudo mkdir -p /etc/nginx/ssl
    ```

4. 파일 복사
  - 키 위치 확인

    ```bash
    sudo -i 
    cd /etc/letsencrypt/live/도메인명
    exit
    ```
    
  - 인증서 파일 복사

    ```bash
    sudo cp /etc/letsencrypt/live/k12s108.p.ssafy.io/fullchain.pem ./nginx/ssl
    sudo cp /etc/letsencrypt/live/k12s108.p.ssafy.io/privkey.pem ./nginx/ssl
    ```

  - 권한 설정

    ```bash
    sudo chmod 644 ./nginx/ssl/*.pem
    ```

  - 인증서 정보 조회

    ```bash
    sudo cerbot certificates
    ```
---

# 6. Nginx 설정

- Docker에서 image pull

    ```bash
    docker pull nginx:latest
    ```

- `home/ubuntu/nginx/conf.d/app.conf` 위치에 app.conf 작성

    ```bash
    sudo mkdir -p ./nginx/conf.d
    sudo vim app.conf
    ```

- `app.conf`

    ```bash
    # HTTP로 들어오면 HTTPS s-pat.site로 리다이렉트
    server {
      listen 80;
      server_name k12s108.p.ssafy.io s-pat.site;
    
      #http를 https로 리다이렉션
      return 301 https://s-pat.site$request_uri;
    }
    
    # HTTPS k12s108.p.ssafy.io로 오면 HTTPS s-pat.site로 리다이렉트
    server {
      listen 443 ssl;
      listen [::]:443 ssl;
      server_name k12s108.p.ssafy.io;
    
      ssl_certificate /etc/nginx/ssl/fullchain.pem;
      ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
      location / {
    	  return 301 https://s-pat.site$request_uri; 
      }
    }
    
    upstream backend_blue {
    	server s-pat-fastapi-blue:8000;
    }
    
    upstream backend_green {
    	server s-pat-fastapi-green:8000;
    }
    
    # HTTPS s-pat.site로 들어오면 바로 접속
    server {
      listen 443 ssl;
      listen [::]:443 ssl;
      server_name s-pat.site;
    
      ssl_certificate /etc/nginx/ssl/fullchain.pem;
      ssl_certificate_key /etc/nginx/ssl/privkey.pem;
      
      # Blue, Green 정보
      set $backend_deployment backend_blue;
    
      # 젠킨스
      location /jenkins/ {
    		proxy_pass http://jenkins:8080/jenkins/;
     		proxy_set_header Host $host;
     		proxy_set_header X-Real-IP $remote_addr;
     		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     		proxy_set_header X-Forwarded-Proto $scheme;
     		proxy_set_header X-Forwarded-Host $host;
    
    		# Jenkins의 ajp/websocket 지원
     		proxy_http_version 1.1;
     		proxy_set_header Upgrade $http_upgrade;
     		proxy_set_header Connection "upgrade";
     		
    		# Jenkins 헤더 관련 설정
     		proxy_read_timeout 90;
     		client_max_body_size 10M;
     	 }
    
      # 백엔드 
      location /api/ {
      	  proxy_pass http://$backend_deployment;
    	  proxy_set_header Host $host;
    	  proxy_set_header X-Real-IP $remote_addr;
    	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     
    	  # 연결 시간 설정 
    	  proxy_connect_timeout 86400s;
    	  proxy_read_timeout 86400s;
    	  proxy_send_timeout 86400s;
    	  send_timeout 86400s;
      }
    
      # SSE
      location ~ /api/.+progress$ {
       	  proxy_pass http://$backend_deployment;
       	  proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
       	  # SSE에 필요한 설정
       	  proxy_buffering off;                  # 버퍼링 비활성화
       	  proxy_cache off;                      # 캐싱 비활성화
      	  proxy_http_version 1.1;               # HTTP 1.1 사용
          proxy_set_header Connection "";       # Connection 헤더 비워두기 (keep-alive 유지)
        
          # 시간 초과 설정 유지
       	  proxy_connect_timeout 86400s;
       	  proxy_read_timeout 86400s;
       	  proxy_send_timeout 86400s;
       	  send_timeout 86400s;
      }
     
      # 프론트엔드
      location / {
    	  proxy_pass http://s-pat-react:3000;
    	  proxy_set_header Host $host;
    	  proxy_set_header X-Real-IP $remote_addr;
    	  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    	  proxy_set_header X-Forwarded-Proto $scheme;
      }
    }
    
    ```
  ---

# 7. 설정 파일

## 7.1 docker-compose.yml

- `/home/ubuntu` 경로에 `docker-compose.yml` 파일 생성

    ```bash
    vim docker-compose.yml
    ```

- `docker-compose.yml`

    ```bash
    services:
      nginx:
        image: nginx:latest
        container_name: nginx
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./nginx/conf.d:/etc/nginx/conf.d
          - ./nginx/ssl:/etc/nginx/ssl
        networks:
          - app-network
        restart: always
        depends_on:
          - fastapi-blue
          - fastapi-green
          - s-pat-react
    
      postgres:
        image: postgres:latest
        container_name: postgres
        environment:
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
          POSTGRES_DB: ${POSTGRES_DB}
          TZ: Asia/Seoul
        ports:
          - "54320:5432"
        volumes:
          - pgdata:/var/lib/postgresql/data
        networks:
          - app-network 
     
      # blue
      fastapi-blue:
        image: [사용자명]/s-pat-fastapi:blue
        container_name: s-pat-fastapi-blue
        env_file:
          - ./.env
        volumes:
          - excel-data:/code/classified_excels
          - temp-data:/code/temp_data
          - vectorstores-data:/code/vectorstores
        ports:
          - "8001:8000"
        depends_on:
          - postgres
          - redis
        networks:
          - app-network
        restart: always    
    
      # green
      fastapi-green:
        image: [사용자명]/s-pat-fastapi:green
        container_name: s-pat-fastapi-green
        env_file:
          - ./.env
        volumes:
          - excel-data:/code/classified_excels
          - temp-data:/code/temp_data
          - vectorstores-data:/code/vectorstores
        ports:
          - "8002:8000"
        depends_on:
          - postgres
          - redis
        networks:
          - app-network
        restart: always
      
      # celery  
      celery-worker:
        image: [사용자명]/s-pat-fastapi:blue #s-pat-fastapi:green
        container_name: celery-worker
        env_file:
          - ./.env
        volumes:
          - excel-data:/code/classified_excels
          - temp-data:/code/temp_data
          - vectorstores-data:/code/vectorstores
        command: >
          celery -A app.core.celery.celery_app worker --loglevel=info
        depends_on:
          - redis
        networks:
          - app-network
        restart: always
        healthcheck:
          test: ["CMD", "celery", "-A", "app.core.celery.celery_app", "status"]
          interval: 30s
          timeout: 10s 
          retries: 3
     
      # react   
      s-pat-react:
        image: [사용자명]/s-pat-react:latest
        container_name: s-pat-react
        expose:
          - "3000"
        networks:
          - app-network
        restart: always
    
      redis:
        image: redis:latest
        container_name: redis
        ports:
          - "17603:6379"
        volumes:
          - redis-data:/data
        environment:
          - TZ=Asia/Seoul
        command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
        networks: 
          - app-network
        restart: always
    
      jenkins:
        image: jenkins/jenkins
        container_name: jenkins
        ports:
          - "8080"
          - "50000:50000"
        environment:
          - TZ=Asia/Seoul
          - JENKINS_OPTS=--prefix=/jenkins
        volumes:
          - jenkins-data:/var/jenkins_home
          - /var/run/docker.sock:/var/run/docker.sock
          - /usr/bin/docker:/usr/bin/docker
        restart: always
        networks:
          - app-network
    
    networks:
      app-network:
        driver: bridge
    
    volumes:
      pgdata:
      jenkins-data:
      redis-data:
      excel-data:
        external: true
      temp-data:
        external: true
      vectorstores-data:
        external: true
    ```
  - Nginx: 80/443
  - Redis: 17603 → 6379
  - Frontend: 3000 → 3000
  - Backend: 8001(Blue), 8002(Green) → 8000
  - Jenkins: 8080
  - Postgres: 54320 → 5432

## 7.2 Docker volume 생성

```bash
docker volume create excel-data
docker volume create temp-data
docker volume create vectorstores-data
```

## 7.3 .env 생성

- `/home/ubuntu` 경로에 `.env` 파일 생성

    ```bash
    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    POSTGRES_USER=********
    POSTGRES_PASSWORD=********
    POSTGRES_DB=********
    
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=********
    
    REDIS_URL=redis://:${REDIS_PASSWORD_ENCODED}@redis:6379/0
    
    LANGSMITH_TRACING=true
    LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
    LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
    LANGSMITH_PROJECT="S-PAT"
    
    OPENAI_API_KEY=${OPENAI_API_KEY}
    CLAUDE_API_KEY=${CLAUDE_API_KEY}
    GEMINI_API_KEY=${GEMINI_API_KEY}
    GROK3_API_KEY=${GROK3_API_KEY}
    ```

## 7.4 Docker Compose 실행

- 실행

    ```bash
    docker compose up -d
    ```

- 실행중인 이미지 확인

    ```bash
    docker ps
    ```
---
# 8. Jenkins

## 8.1 초기 설정

- https://s-pat.site/jenkins/ 로 접속
    ![image.png](/img/portingmaual/jenkins0.webp)
    - 초기 비밀번호 확인
      ![image.png](/img/portingmaual/jenkins1.webp)
      ```bash
      docker logs jenkins
      docker exec -it jenkins cat /var/jenkins_home/secrets/initalAdminPassword
      ```

## 8.2 Security

- Jenkins 관리 → Security
    
    ![image.png](/img/portingmaual/jenkins2.webp)

## 8.3 GitLab AccessToken 발급

### 8.3.1 Jenkins에서 GitLab 플러그인 설치

- Jenkins관리 → Plugins → Available plugins → gitlab 검색 → Install without restart
    

### 8.3.2 GitLab에서 Personal Access Token 발급하기

- 프로필 → Edit profile → Access tokens → Add new token
    
    ![image.png](/img/portingmaual/gitlab0.webp)
- Scopes 전부 선택 → Create personal access token 후 나오는 `Your personal access token` 복사
    

## 8.4 Jenkins Credentials 등록

### 8.4.1 GitLab Credentials 등록

- Jenkins 관리 → Credentials → System → Global credentials
    - Kind: GitLab API token
    - API token: GitLab Personal Access Token
    - ID: gitlab_access_token

### 8.4.2 GitLab Connection 설정

- Jenkins 관리 → System → GitLab
    - Connection name: gitlab
    - GitLab host URL: https://lab.ssafy.com
    - Credentials: 생성한 GitLab Credentials(GitLab API token)

### 8.4.3 GitLab UserID/ Password 등록

- Jenkins 관리 → Credentials → System → Global credentials
  - Kind: Username with password
  - Username: GitLab 프로필의 @이하
  - Password: GitLab private access token
  - ID: root

### 8.4.4 Docker Hub Credentials 등록

- Jenkins 관리 → Credentials → System → Global credentials
  - Kind: Username with password
  - Scope: Global
  - Username: Docker Hub 사용자 계정
  - Password: `Docker Hub access token`

### 8.4.5 .env Credentials 등록

- Jenkins 관리 → Credentials → System → Global credentials
  - Kind: Secret file
  - File: .env
  - ID: ENV

- `.env`
    
    ```bash
    LANGSMITH_TRACING=true
    LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
    LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
    LANGSMITH_PROJECT="S-PAT"
    
    #LLM
    OPENAI_API_KEY=${OPENAI_API_KEY}
    CLAUDE_API_KEY=${CLAUDE_API_KEY}
    GEMINI_API_KEY=${GEMINI_API_KEY}
    GROK3_API_KEY=${GROK3_API_KEY}
    
    # DB
    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    DEBUG=True
    
    # Redis
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=********
    REDIS_URL=redis://:${REDIS_PASSWORD_ENCODED}@redis:6379/0
    ```

## 8.5 Jenkins 설정 추가

### 8.5.1 NodeJS 설정
- Jenkins 관리 → Plugins → Available plugins→ NodeJS 설치
    ![image.png](/img/portingmaual/jenkins3.webp)
- Jenkins 관리 -> Tools
    ![image.png](/img/portingmaual/jenkins4.webp)
    
    - Name: nodejs
    - Version: NodeJS 22.15.0

### 8.5.2 Mattermost 연동

1. 채널 생성
2. 통합 -> Incoming Webhook → 추가 후 URL 복사

   ![image.png](/img/portingmaual/mm0.webp)

   ![image.png](/img/portingmaual/mm1.webp)

3. Jenkins 에서 Mattermost Notification Plugin 설치 → Endpoint에 웹훅 URL 입력
   ![image.png](/img/portingmaual/mm3.webp)
   ![image.png](/img/portingmaual/mm2.webp)
    - Endpoint: webhook URL
    - Channel: 채널명(채널 URL 끝 주소)
    - Build Server URL: Jenkins 주소

## 8.6 Jenkins Item 생성

### 8.6.1 Pipeline Project 생성

- All → New Item : FastAPI, React 각각 Pipeline Project 생성
    - New Item name: fastapi / react
    - Pipeline

    ![image.png](/img/portingmaual/jenkins5.webp)

### 8.6.2 Jenkins에서 Trigger 설정

- Setting에서 등록한 GitLab 선택
    
    ![image.png](/img/portingmaual/jenkins6.webp)
    
- Triggers 등록
    
    ![image.png](/img/portingmaual/jenkins7.webp)
    
    - `고급` 에서 Secret token Generate 후 기록(Webhook 설정 시 Secret token으로 사용)

### 8.6.3 Pipeline 작성

- Jenkins 사용자에게 Docker 권한 부여
    
    ```bash
    docker exec -u 0 -it jenkins /bin/bash #루트 사용자로 접근
    groupadd -g 999 docker  # 호스트 시스템의 docker 그룹 GID와 일치하도록 설정
    usermod -aG docker jenkins
    ls -la /var/run/docker.sock # 확인용
    docker restart jenkins
    ```
    
- FastAPI
    
    ```bash
    pipeline {
        agent any
    
        environment {
            DOCKER_HUB_USERNAME = '[사용자명]'
            DOCKER_IMAGE_NAME   = 's-pat-fastapi'
            DOCKER_REGISTRY     = "${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}"
            BUILD_TAG           = "${BUILD_NUMBER}"
            
            NGINX_CONF_PATH = "/etc/nginx/conf.d/app.conf"
        }
    
        stages {
            stage('Clone repository') {
                steps {
                    git branch: 'BE', credentialsId: 'root', url: 'https://lab.ssafy.com/s12-final/S12P31S108.git'
                    echo 'BE 저장소 클론 완료'
                }
            }
    
            stage('Build Start') {
                steps {
                    script {
                        def commitHash = sh(script: "git log -1 --pretty=%h", returnStdout: true).trim()
                        def commitTitle = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                        def commitContent = sh(script: 'git log -1 --pretty=format:"%b"', returnStdout: true).trim()
                        def author     = sh(script: "git log -1 --pretty=%an", returnStdout: true).trim()
                        def serviceName = "FastAPI"
    
                        mattermostSend(
                            message: "## 🚀 ${serviceName} 빌드 시작 🚀\n" +
                             "🔢 **빌드 번호**: #${BUILD_NUMBER}\n" +
                             "🌿 **브랜치**: BE\n" +
                             "📝 **커밋 해시**: `${commitHash}`\n" +
                             "👤 **작성자**: ${author}\n" +
                             "📄 **커밋 제목**: ${commitTitle} \n" +
                             "💬 **커밋 내용**: ${commitContent}\n" +
                             "[:jira: JIRA 바로가기](https://ssafy.atlassian.net/jira/software/c/projects/S12P31S108/boards/8396/timeline) [:gitlab: GitLab 바로가기](https://lab.ssafy.com/s12-final/S12P31S108/-/tree/BE?ref_type=heads) [:jenkins7: Jenkins 바로가기](https://s-pat.site/jenkins)" ,
                            color: '#439FE0'
                        )
                    }
                }
            }
            
            stage('Create .env') {
                steps {
                    withCredentials([file(credentialsId: "ENV", variable: "ENV")]) {
                        sh '''
                            mkdir -p BE/
                            cp "$ENV" BE/.env
                            chmod 600 BE/.env
                        '''
                    }
                }
            }
            
            stage('Build FastAPI') {
                steps {
                    dir('BE') { 
                        echo 'FastAPI 빌드 완료'
                    }
                }
            }
            
            stage('Check Current Container') {
                steps {
                    script {
                        // app.conf에서 실제 실행중인 컨테이너 알아냄
                        def activeDeployment = sh(script: """
                            docker exec nginx bash -c "grep -o 'backend_deployment backend_[a-z]*' /etc/nginx/conf.d/app.conf || echo 'backend_deployment not found'"
                        """, returnStdout: true).trim()
                        
                        // 출력
                        echo "activeDeployment: ${activeDeployment}"
                        
                        // 변수 설정
                        env.CURRENT_BACKEND = activeDeployment.contains("blue") ? "blue" : "green"
                        env.TARGET_BACKEND = env.CURRENT_BACKEND == "blue" ? "green" : "blue"
                        env.CURRENT_PORT = env.CURRENT_BACKEND == "blue" ? "8001" : "8002"
                        env.TARGET_PORT = env.TARGET_BACKEND == "blue" ? "8001" : "8002"
                        
                        echo "현재 활성 환경: ${env.CURRENT_BACKEND} (포트: ${env.CURRENT_PORT})"
                        echo "배포 대상 환경: ${env.TARGET_BACKEND} (포트: ${env.TARGET_PORT})"
                    }
                }
            }
            
            stage('Build Docker Image') {
                steps {
                    dir('BE') {
                        sh '''
                            docker build -t ${DOCKER_REGISTRY}:${BUILD_TAG} -t ${DOCKER_REGISTRY}:${TARGET_BACKEND} .        
                        '''
                        sh "docker images | grep ${DOCKER_REGISTRY}"
                        echo 'Docker 이미지 빌드 완료'
                    }
                }
            }
            
            stage('Login to DockerHub') {
                steps {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_access_token', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        '''
                        echo 'Docker Hub 로그인 완료'
                    }
                }
            }
    
            stage('Push to Registry') {
                steps {
                    sh "docker push ${DOCKER_REGISTRY}:${TARGET_BACKEND}"
                    echo "${TARGET_BACKEND}: Docker Hub 이미지 푸시 완료"
                }
            }
    
            stage('Deploy Container') {
                steps {
                    // 기존 컨테이너 중지 및 제거
                    sh "docker stop ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true"
                    sh "docker rm ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true"
                   
                    // 새이미지로 컨테이너 실행
                    sh """
                        docker run -d --name ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} \
                        --env-file BE/.env \
                        -p ${TARGET_PORT}:8000 \
                        --network ubuntu_app-network \
                        -v excel-data:/code/classified_excels \
                        -v temp-data:/code/temp_data \
                        -v vectorstores-data:/code/vectorstores \
                        ${DOCKER_REGISTRY}:${TARGET_BACKEND}
                    """
                    // 실행된 컨테이너와 이미지 정보 확인
                    sh "docker ps --format '{{.Names}} - Image: {{.Image}}' | grep ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND}"
                    
                    // 기존 Celery Worker 중지 및 제거
                    sh "docker stop celery-worker || true"
                    sh "docker rm celery-worker || true"
                    
                    // 새 Celery Worker 실행 (고정된 이름, 동일한 backend 이미지 사용)
                    sh """
                        docker run -d \
                        --name celery-worker \
                        --env-file BE/.env \
                        --network ubuntu_app-network \
                        -v excel-data:/code/classified_excels \
                        -v temp-data:/code/temp_data \
                        -v vectorstores-data:/code/vectorstores \
                        --health-cmd='celery -A app.core.celery.celery_app status || exit 1' \
                        --health-interval=30s \
                        --health-retries=3 \
                        --health-start-period=20s \
                        --health-timeout=10s \
                        ${DOCKER_REGISTRY}:${TARGET_BACKEND} \
                        celery -A app.core.celery.celery_app worker --loglevel=info
                    """
                    // 로그 출력
                    sh "docker ps --format '{{.Names}} - Image: {{.Image}}'"
                    
                    echo "${TARGET_BACKEND}: Docker 컨테이너 배포 완료"
                }
            }
            
            stage('Health Check') {
                steps {
                    script {
                        echo "새 환경 ${TARGET_BACKEND} 상태 확인 중"
                        
                        // 컨테이너 실행 여부 확인
                        def containerExists = sh(script: "docker ps -q -f name=${DOCKER_IMAGE_NAME}-${TARGET_BACKEND}", returnStdout: true).trim()
                        if (!containerExists) {
                            sh """
                                docker stop ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true
                                docker rm ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true
                            """
                            error "컨테이너 ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND}이(가) 실행 중이 아닙니다."
                        }
                        
                        // 헬스 체크 상태 확인 (최대 1분 대기)
                        def maxAttempts = 24
                        def attempt = 1
                        env.isHealthy = false
                        
                        while (attempt <= maxAttempts && env.isHealthy != 'true') {
                            def status = sh(script: "docker inspect --format '{{.State.Health.Status}}' ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND}", returnStdout: true).trim()
                            echo "컨테이너 상태 확인 (${attempt}/${maxAttempts}): ${status}"
                            
                            if (status == 'healthy') {
                                env.isHealthy = 'true'
                                echo "컨테이너가 정상 상태입니다."
                            } else {
                                sleep 5
                                attempt++
                            }
                        }
                        
                        if (env.isHealthy != 'true') {
                            echo "❌ Health check 실패: ${TARGET_BACKEND} 환경이 정상 작동하지 않습니다."
    		                env.HEALTHCHECK_FAILED = 'true'
    		                
                            sh """
                                docker stop ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true
                                docker rm ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true
                            """
                            error "Health check 실패"
                        }
                        
                        echo "Health check 통과: ${TARGET_BACKEND} 준비 완료"
                    }
                }
            }
             stage('Health Check celery') {
                steps {
                    script {
                        echo "새 환경 celery 상태 확인 중"
                        
                        // Celery 헬스체크 확인
                        def celeryAttempts = 24
                        def celeryTry = 1
                        env.celeryHealthy = false
    										
    					while (celeryTry <= celeryAttempts && env.celeryHealthy != 'true') {
    					    def celeryStatus = sh(script: "docker inspect --format '{{.State.Health.Status}}' celery-worker", returnStdout: true).trim()
    					    echo "Celery 상태 확인 (${celeryTry}/${celeryAttempts}): ${celeryStatus}"
    					    
    					    if (celeryStatus == 'healthy') {
    					        env.celeryHealthy = 'true'
    					        echo "✅ Celery Worker가 정상 상태입니다."
    					    } else {
    					        sleep 5
    					        celeryTry++
    					   }
    					}
    					if (env.celeryHealthy != 'true') {
    					    echo "❌ Celery Health check 실패"
    					    sh "docker stop celery-worker || true"
    					    sh "docker rm celery-worker || true"
    					    error "Celery Health check 실패"
    					}
    					echo "Health check 통과: celery 준비 완료"
                    }
                }
            }
            
            stage('Database Migration') {
                steps {
                    script {
                        if (env.isHealthy == 'true') {
                            echo "컨테이너가 정상 작동 중입니다. DB 마이그레이션을 수행합니다."
                            try {
                                sh "docker exec ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} alembic upgrade head"
                                echo 'DB 마이그레이션 완료'
                            } catch (Exception e) {
                                error "DB 마이그레이션 중 오류 발생: ${e.getMessage()}"
                            }
                        } else {
                            error "컨테이너가 정상 작동하지 않습니다. DB 마이그레이션을 수행할 수 없습니다."
                        }
                    }
                }
            }
            
            stage ('Switch Active Environment') {
                steps {
                    script {
                        // Nginx 설정 확인
                        sh "docker ps -a | grep nginx"
                        
                        // TARGET_BACKEND 변수 확인
                        echo "현재 TARGET_BACKEND 값 : ${TARGET_BACKEND}"
                        sh """
                            docker exec nginx bash -c 'sed -i "s/set \\\$backend_deployment backend_${CURRENT_BACKEND};/set \\\$backend_deployment backend_${TARGET_BACKEND};/" ${NGINX_CONF_PATH} && nginx -t && nginx -s reload'
                        """
                        
                        echo "${TARGET_BACKEND} 환경으로 활성화된 환경 정보 수정 완료"
                    }
                }
            }
            
            stage('Shutdown Old Environment') {
                steps {
                    script {
                        echo "이전 환경: ${CURRENT_BACKEND} 중단 중"
                        
                        sh """
                            docker stop ${DOCKER_IMAGE_NAME}-${CURRENT_BACKEND} || true
                            docker rm ${DOCKER_IMAGE_NAME}-${CURRENT_BACKEND} || true
                        """
                        
                        echo "이전 환경: ${CURRENT_BACKEND} 중단 완료"
                    }
                }    
            }
            
            stage('Clean up') {
                steps {
                    sh 'docker image prune -af --filter "until=24h"'
                    echo '오래된 Docker 이미지 정리 완료'
                }
            }
        }
        
        post {
            success {
                script {
                    echo "✅ 파이프라인이 성공적으로 완료되었습니다. ✅"
                    echo "현재 활성 환경: ${TARGET_BACKEND}"
                    def commitHash = sh(script: "git log -1 --pretty=%h", returnStdout: true).trim()
                    def commitTitle = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                    def commitContent = sh(script: 'git log -1 --pretty=format:"%b"', returnStdout: true).trim()
                    def author = sh(script: "git log -1 --pretty=%an", returnStdout: true).trim()
                    def serviceName = "FastAPI"
    
                    mattermostSend(
                        message: "## ✅ ${serviceName} 빌드 성공 ✅\n" +
                        "🔢 **빌드 번호**: #${BUILD_NUMBER}\n" +
                        "🌿 **브랜치**: BE\n" +
                        "📝 **커밋 해시**: `${commitHash}`\n" +
                        "👤 **작성자**: ${author}\n" +
                        "📄 **커밋 제목**: ${commitTitle}\n" +
                        "💬 **커밋 내용**: ${commitContent}\n" +
                        "[:jira: JIRA 바로가기](https://ssafy.atlassian.net/jira/software/c/projects/S12P31S108/boards/8396/timeline) [:gitlab: GitLab 바로가기](https://lab.ssafy.com/s12-final/S12P31S108/-/tree/BE?ref_type=heads) [:jenkins7: Jenkins 바로가기](https://s-pat.site/jenkins)" ,
                        color: 'good'
                    )
                }
            }
            failure {
                script { 
                    // 마이그레이션이 적용된 경우에만 다운그레이드 수행
                    echo "❌ 파이프라인 실행 중 오류가 발생했습니다.❌ "
                    
                    try {
                        // Health Check 실패 여부에 따른 메시지 출력
                        if (env.HEALTHCHECK_FAILED == 'true') {
                            echo "⚠️ Health check 실패로 인해 롤백을 진행합니다."
                        }
                        // 마이그레이션이 적용된 경우에만 다운그레이드 수행
                        if (env.DB_MIGRATION_APPLIED == 'true') {
                            try {
                                echo "마이그레이션이 적용되었으므로 다운그레이드를 시도합니다."
                                sh "docker exec ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} alembic downgrade ${env.DB_PREV_VERSION ?: '-1'}"
                                echo "데이터베이스 마이그레이션 다운그레이드 완료"
                            } catch (Exception e) {
                                echo "⚠️ 데이터베이스 마이그레이션 다운그레이드 중 오류 발생: ${e.getMessage()}"
                            }
                        } else {
                            echo "DB 마이그레이션이 적용되지 않았으므로 다운그레이드가 필요하지 않습니다."
                        }
                        // 실패 시 롤백 시도
                        sh """
                            docker stop ${DOCKER_IMAGE_NAME}-${CURRENT_BACKEND} || true
                            docker rm ${DOCKER_IMAGE_NAME}-${CURRENT_BACKEND} || true
                            docker run -d \
                            --name ${DOCKER_IMAGE_NAME}-${CURRENT_BACKEND} \
                            --env-file BE/.env -p ${CURRENT_PORT}:8000 \
                            --network ubuntu_app-network \
                            -v excel-data:/code/classified_excels \
                            -v temp-data:/code/temp_data \
                            -v vectorstores-data:/code/vectorstores \
                            ${DOCKER_REGISTRY}:${CURRENT_BACKEND}
                        """
                        // Celery worker도 동일 이미지로 다시 실행
                        sh """
                            docker stop celery-worker || true
                            docker rm celery-worker || true
                            docker run -d \
                            --name celery-worker \
                            --env-file BE/.env \
                            --network ubuntu_app-network \
                            -v excel-data:/code/classified_excels \
                            -v temp-data:/code/temp_data \
                            -v vectorstores-data:/code/vectorstores \
                            ${DOCKER_REGISTRY}:${CURRENT_BACKEND} \
                            celery -A app.core.celery.celery_app worker --loglevel=info
                        """
                        // Nginx 설정 롤백
                        try {
                            sh """
                                docker exec nginx bash -c 'sed -i "s/set \\\$backend_deployment backend_${TARGET_BACKEND};/set \\\$backend_deployment backend_${CURRENT_BACKEND};/" ${NGINX_CONF_PATH} && nginx -t && nginx -s reload'
                            """
                        } catch (Exception e) {
                            echo "⚠️ Nginx 설정 복구 중 오류 발생: ${e.getMessage()}"
                        }
                        // 실패한 대상 컨테이너 정리
                        sh """
                            docker stop ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true
                            docker rm ${DOCKER_IMAGE_NAME}-${TARGET_BACKEND} || true 
                        """
    				} catch (Exception e) {
    				    echo "⚠️ 롤백 처리 중 예외 발생: ${e.getMessage()}"
    				}
                    // 알림 전송 (항상 시도)
                    try {
                        def commitHash = sh(script: "git log -1 --pretty=%h", returnStdout: true).trim()
                        def commitTitle = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                        def commitContent = sh(script: 'git log -1 --pretty=format:"%b"', returnStdout: true).trim()
                        def author = sh(script: "git log -1 --pretty=%an", returnStdout: true).trim()
                        def serviceName = "FastAPI"
            
                        mattermostSend(
                          message: "## ❌ ${serviceName} 빌드 실패 ❌\n" +
                          "🔢 **빌드 번호**: #${BUILD_NUMBER}\n" +
                          "🌿 **브랜치**: BE\n" +
                          "📝 **커밋 해시**: `${commitHash}`\n" +
                          "👤 **작성자**: ${author}\n" +
                          "📄 **커밋 제목**: ${commitTitle}\n" +
                          "💬 **커밋 내용**: ${commitContent}\n" +
                          "[:jira: JIRA 바로가기](https://ssafy.atlassian.net/jira/software/c/projects/S12P31S108/boards/8396/timeline) [:gitlab: GitLab 바로가기](https://lab.ssafy.com/s12-final/S12P31S108/-/tree/BE?ref_type=heads) [:jenkins: Jenkins바로가기]" ,
                          color: 'danger'
                        )
                    } catch (Exception e) {
                        echo "⚠️ Mattermost 알림 전송 실패: ${e.getMessage()}"
                    }
                }
            }
            always {
                echo '파이프라인 실행 완료'
                sh "docker logout"
            }
        }
    }
    ```
    
- React
    
    ```bash
    pipeline {
        agent any
    
        tools {
            nodejs "nodejs"
        }
    
        environment {
            DOCKER_HUB_USERNAME = '[사용자명]'
            DOCKER_IMAGE_NAME   = 's-pat-react'
            DOCKER_REGISTRY     = "${DOCKER_HUB_USERNAME}/${DOCKER_IMAGE_NAME}"
            BUILD_TAG           = "${BUILD_NUMBER}"
        }
    
        stages {
            stage('Clone repository') {
                steps {
                    git branch: 'FE', credentialsId: 'root', url: 'https://lab.ssafy.com/s12-final/S12P31S108.git'
                    echo 'FE 저장소 클론 완료'
                }
            }
    
            stage('Build Start') {
                steps {
                    script {
                        def commitHash = sh(script: "git log -1 --pretty=%h", returnStdout: true).trim()
                        def commitTitle = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                        def commitContent = sh(script: 'git log -1 --pretty=format:"%b"', returnStdout: true).trim()
                        def author     = sh(script: "git log -1 --pretty=%an", returnStdout: true).trim()
                        def serviceName = "React"
    
                        mattermostSend(
                            message: "## 🚀 ${serviceName} 빌드 시작 🚀\n" +
                             "🔢 **빌드 번호**: #${BUILD_NUMBER}\n" +
                             "🌿 **브랜치**: FE\n" +
                             "📝 **커밋 해시**: `${commitHash}`\n" +
                             "👤 **작성자**: ${author}\n" +
                             "📄 **커밋 제목**: ${commitTitle}\n" +
                             "💬 **커밋 내용**: ${commitContent}\n" +
                             "[:jira: JIRA 바로가기](https://ssafy.atlassian.net/jira/software/c/projects/S12P31S108/boards/8396/timeline) [:gitlab: GitLab 바로가기](https://lab.ssafy.com/s12-final/S12P31S108/-/tree/FE?ref_type=heads) [:jenkins7: Jenkins 바로가기](https://s-pat.site/jenkins)" ,
                            ,
                            color: '#439FE0'
                        )
                    }
                }
            }
    
            stage('Build React') {
                steps {
                    dir('FE') {
                        sh 'npm install'
                        sh 'npm run build'
                        echo 'React 빌드 완료'
                    }
                }
            }
    
            stage('Build Docker Image') {
                steps {
                    dir('FE') {
                        sh '''
                            docker build -t ${DOCKER_REGISTRY}:${BUILD_TAG} -t ${DOCKER_REGISTRY}:latest .
                        '''
                        echo 'Docker 이미지 빌드 완료'
                    }
                }
            }
    
            stage('Login to DockerHub') {
                steps {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_access_token', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        '''
                        echo 'Docker Hub 로그인 완료'
                    }
                }
            }
    
            stage('Push to Registry') {
                steps {
                    sh "docker push ${DOCKER_REGISTRY}:latest"
                    echo 'Docker Hub 이미지 푸시 완료'
                }
            }
    
            stage('Deploy Container') {
                steps {
                    sh "docker stop ${DOCKER_IMAGE_NAME} || true"
                    sh "docker rm ${DOCKER_IMAGE_NAME} || true"
                    sh "docker pull ${DOCKER_REGISTRY}:latest"
                    sh "docker run -d --name ${DOCKER_IMAGE_NAME} -p 3000:3000 --network ubuntu_app-network ${DOCKER_REGISTRY}:latest"
                    echo 'Docker 컨테이너 배포 완료'
                }
            }
    
            stage('Clean up') {
                steps {
                    sh 'docker image prune -af --filter "until=24h"'
                    echo '오래된 Docker 이미지 정리 완료'
                }
            }
        }
    
        post {
            success {
                script {
                    def commitHash = sh(script: "git log -1 --pretty=%h", returnStdout: true).trim()
                    def commitTitle = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                    def commitContent = sh(script: 'git log -1 --pretty=format:"%b"', returnStdout: true).trim()
                    def author     = sh(script: "git log -1 --pretty=%an", returnStdout: true).trim()
                    def serviceName = "React"
    
                    mattermostSend(
                        message: "## ✅ ${serviceName} 빌드 성공 ✅\n" +
                        "🔢 **빌드 번호**: #${BUILD_NUMBER}\n" +
                        "🌿 **브랜치**: FE\n" +
                        "📝 **커밋 해시**: `${commitHash}`\n" +
                        "👤 **작성자**: ${author}\n" +
                        "📄 **커밋 제목**: ${commitTitle} \n" +
                        "💬 **커밋 내용**: ${commitContent}\n" +
                        "[:jira: JIRA 바로가기](https://ssafy.atlassian.net/jira/software/c/projects/S12P31S108/boards/8396/timeline) [:gitlab: GitLab 바로가기](https://lab.ssafy.com/s12-final/S12P31S108/-/tree/FE?ref_type=heads) [:jenkins7: Jenkins 바로가기](https://s-pat.site/jenkins)" ,
                        color: 'good'
                    )
                }
            }
            failure {
                script {
                    def commitHash = sh(script: "git log -1 --pretty=%h", returnStdout: true).trim()
                    def commitTitle = sh(script: 'git log -1 --pretty=format:"%s"', returnStdout: true).trim()
                    def commitContent = sh(script: 'git log -1 --pretty=format:"%b"', returnStdout: true).trim()
                    def author     = sh(script: "git log -1 --pretty=%an", returnStdout: true).trim()
                    def serviceName = "React"
    
                    mattermostSend(
                       message: "## ❌ ${serviceName} 빌드 실패 ❌\n" +
                       "🔢 **빌드 번호**: #${BUILD_NUMBER}\n" +
                       "🌿 **브랜치**: FE\n" +
                       "📝 **커밋 해시**: `${commitHash}`\n" +
                       "👤 **작성자**: ${author}\n" +
                       "📄 **커밋 제목**: ${commitTitle}\n" +
                       "💬 **커밋 내용**: ${commitContent}\n" +
                       "[:jira: JIRA 바로가기](https://ssafy.atlassian.net/jira/software/c/projects/S12P31S108/boards/8396/timeline) [:gitlab: GitLab 바로가기](https://lab.ssafy.com/s12-final/S12P31S108/-/tree/FE?ref_type=heads) [:jenkins7: Jenkins 바로가기](https://s-pat.site/jenkins)" ,
                       color: 'danger'
                    )
                }
            }
            always {
                echo '파이프라인 실행 완료'
                sh "docker logout"
            }
        }
    }
    ```
## 8.7 Webhook 설정

### 8.7.1 GitLab에서 Webhook 설정

- GitLab 프로젝트 → Settings → Webhooks → Add new webhook → URL, Generate token 작성 → Add Webhook

  ![image.png](/img/portingmaual/gitlab1.webp)

    - URL: Pipeline 프로젝트 트리거 등록 시 나오는 GItLab Webhook URL
    - Secret Token: Pipeline 프로젝트 트리거 등록 시 Generate 한 Secret 토큰
    - Trigger: push event