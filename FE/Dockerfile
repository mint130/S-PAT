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
