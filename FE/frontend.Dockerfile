# 빌드
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json, package-lock.json 설치
COPY package*.json ./

# 소스코드 복사
COPY . .

# 종속성 설치
RUN npm install

# 5173 포트 노출
EXPOSE 5173

CMD ["npm", "run", "dev"]

