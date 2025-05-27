# S-PAT
### SSAFY 12기 자율 프로젝트(기업연계) - S108 Team "특허의 정석"
![S-PAT](img/ReadMe/S-PAT.gif)
> 사람 대신 분류해주는 '생성형 AI 특허 기술 분류 솔루션'


<br />

## 목차

1. [**서비스 소개**](#1-서비스-소개)
2. [**데모 영상**](#2-데모-영상)
3. [**주요 기능**](#3-주요-기능)
4. [**개발 환경**](#4-개발-환경)
5. [**프로젝트 산출물**](#5-프로젝트-산출물)
6. [**프로젝트 진행**](#6-프로젝트-진행)
7. [**개발 일정**](#7-개발-일정)
8. [**기타 산출물**](#8-기타-산출물)
9. [**팀원 소개**](#9-팀원-소개)
10. [**포팅 메뉴얼**](#10-포팅-메뉴얼)


<br />

<div id="1-서비스-소개"></div>

## 💁 서비스 소개


> 사람 대신 분류해주는 '생성형 AI 특허 기술 분류 솔루션'

<br />


### 서비스 설명 (주요 기능)

[ 사람 대신 분류해주는 '생성형 AI 특허 기술 분류 솔루션' ]

### 사용자 모드

1. LLM을 이용하여 특허기술분류체계 생성 
  - LLM을 이용하여 분류체계를 만들거나 기존에 가지고 있는 분류체계를 업로드 하여 그대로 사용하거나 프롬프트를 이용해 보강이 가능

2. 생성된 분류체계 수정 및 엑셀파일로 다운로드
  - 셀 수정, 행 추가,삭제가 가능하고 엑셀파일로 다운로드 받아 다음에도 사용 가능

3. 최적의 LLM을 이용하여 RAG 기반 특허기술 분류
  - 프로그래스 바를 이용하여 실시간 진행상황 파악 가능

4. 분류가 완료된 특허 기술 결과물을 엑셀파일로 제공
  - 정렬 및 검색, 엑셀로 다운로드 가능
   <br />

### 전문가 모드
  **1~2 사용자 모드와 동일** <br />

3. GPT,Claude, Gemini, Grok 4가지 LLM을 병렬로 특허 분류 
  - 프로그래스 바를 이용하여 각각의 진행상황 및 전체 진행상황을 파악 가능

4. 4가지의 LLM으로 분류된 결과를 확인 및 전문가 평가 실시 
  - 버튼을 통해 각각의 결과를 확인 및 행 마다 전문가 평가 가능, 필요시 생략 가능

5. 최종 결과 리포트 및 최적의 LLM 선택 
  - Reasoning LLM 평가, 벡터 기반 유사도와 전문가 평가를 종합한 최종 Score 제공 및 최적의 LLM 선택
   <br />

### 프로젝트 특장점

1. 사용자 맞춤형 특허기술분류 체계 생성
 - 프롬프트 기반으로 쉽고 간단하게 제작 가능
 - 필요시 사용자가 직접 수정 가능

2. RAG 기반 최적의 특허분류
 - 관리자모드에서 여러 LLM간 분류결과 비교 제공을 하여 최적의 LLM 지정 가능 
 - 위 과정에서 선택된 LLM을 사용하여 사용자들은 최상의 결과를 얻을 수 있음

3. 결과 다운로드
  - 분류가 완료된 파일을 엑셀 형식으로 다운로드 가능
  - 분류 결과 시각화 제공

4. 최적의 LLM 비교 평가
  - Reasoning LLM 평가, 벡터 기반 유사도와 전문가 평가를 종합한 최종 Score 제공 및 최적의 LLM 선택

<br />

### 프로젝트 차별점/독창성

1. 쉽게 수정이 가능한 UI
  -  AG Grid Table을 이용한 테이블 UI로 사용자가 쉽게 문서를 수정할 수 있도록 처리

2. 구조화된 output을 얻기위한 프롬프트 기법 적용
  - 원하는 output을 얻기 위해 few-shot prompting 기법을 사용

3. 관리자 모드에서의 특허 기술 분류
  - 성능 비교를 위해 4개의 LLM(ChatGPT, Claude, Gemeni, Grok) 병렬로 처리

4. Celery 기반 특허 분류 병렬 처리
  - Celery와 Redis로 비동기 병렬 처리 환경을 구축해 특허 분류 속도를 개선함

5. 실시간 작업 진행 상황 모니터링
  -  Redis Pub/Sub과 SSE를 이용해 분류 진행 상황을 실시간으로 사용자에게 전달

6. Blue-Green 무중단 배포
  - 배포 중에도 서비스 중단 없이 안정적으로 트래픽 전환 가능
  - Health Check를 통해 신규 배포 환경의 안정성을 검증한 후 배포 진행

7. 다크 모드 지원
  - 모든 페이지에 다크모드를 적용, 화이트 모드와 번갈아 사용이 가능

<div id="2-데모-영상"></div>

## 🎥 데모 영상


![image.png](img/ReadMe/데모.png)
[영상 포트폴리오 보러가기](https://youtu.be/8LIwFlyI8Vs)

<br /><br />


<div id="3-주요-기능"></div>

# 💡 주요 기능

모드 선택 <br />
![image-5.png](img/ReadMe/모드선택.png)
<br />

다크모드 적용 <br />
![다크모드](img/ReadMe/다크모드.gif)
<br />

## 사용자 모드
### 특허 분류 체계 생성
프롬프트 사용하여 생성 <br />
![체계생성.gif](img/ReadMe/체계생성.gif)
<br />
기존 파일 업로드 <br />
![기존파일업로드.gif](img/ReadMe/기존파일업로드.gif)
<br />

### 특허 분류 체계 수정
행 추가 <br />
![image-6.png](img/ReadMe/행추가.png)
<br />

셀 수정 <br />
![수정.gif](img/ReadMe/수정.gif)
<br />

행 삭제 <br />
![행삭제.gif](img/ReadMe/행삭제.gif)
<br />

### 특허 데이터 업로드
![특허업로드.gif](img/ReadMe/특허업로드.gif)
<br />

### 특허 분류
![분류중.gif](img/ReadMe/분류중.gif)
<br />

### 분류 결과 확인
![image-7.png](img/ReadMe/분류결과확인.png)
<br />

## 전문가 모드

### 특허 분류(LLM 병렬 처리)
![전문가분류중.gif](img/ReadMe/전문가분류중.gif)
<br />

### 전문가 평가
![전문가평가.gif](img/ReadMe/전문가평가.gif)
<br />

### 대시보드
![대시보드.gif](img/ReadMe/대시보드.gif)
<br />

### 최적의 LLM 선택
![LLM적용.gif](img/ReadMe/LLM적용.gif)
<br />
<br />


<div id="4-개발-환경"></div>

## 🛠 개발 환경


### 백엔드
![FastAPI Badge](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=fff&style=flat-square)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=flat-square)
![Redis Badge](https://img.shields.io/badge/Redis-FF4438?style=flat-square&logo=redis&logoColor=fff)
![Celery Badge](https://img.shields.io/badge/Celery-37814A?style=flat-square&logo=Celery&logoColor=fff)

### 프론트엔드
![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=flat-square)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat-square)
![TailwindCSS Badge](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=fff&style=flat-square)

### 인프라
![AWS EC2 Badge](https://img.shields.io/badge/AmazonEC2-FF9900?logo=amazonec2&logoColor=fff&style=flat-square)
![Ubuntu Badge](https://img.shields.io/badge/Ubuntu-E95420?logo=ubuntu&logoColor=fff&style=flat-square)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=flat-square)
![Nginx Badge](https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=fff)
![Jenkins Badge](https://img.shields.io/badge/jenkins-D24939?style=flat-square&logo=jenkins&logoColor=fff)


### 디자인
![Figma Badge](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=fff&style=flat-square)

### 상태 관리
![Gitlab Badge](https://img.shields.io/badge/GitLab-FC6D26?style=flat-square&logo=gitlab&logoColor=fff)
![Jira Badge](https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=fff&style=flat-square)
![Mattermost Badge](https://img.shields.io/badge/Mattermost-0058CC?logo=mattermost&logoColor=fff&style=flat-square)


### 모니터링
![Grafana Badge](https://img.shields.io/badge/grafana-F46800?style=flat-square&logo=grafana&logoColor=fff)
![Prometheus Badge](https://img.shields.io/badge/prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=fff)




<br />


<div id="5-프로젝트-산출물"></div>

## 🎈 프로젝트 산출물


### 기능 명세서
[📖 기능 명세서](https://www.notion.so/1d5f083ba14d80868f12db70f5506b8d)

![image-1.png](img/ReadMe/기능명세서1.png)
<br />
![image-2.png](img/ReadMe/기능명세서2.png)

<br /><br />

### ERD 다이어그램
![image-3.png](img/ReadMe/ERD.png)

<br /><br />

### 시스템 아키텍처
![image-4.png](img/ReadMe/아키텍처.png)


<br /><br />

### API 명세서
[📖 API 명세서](https://www.notion.so/API-1d5f083ba14d80d5b690c3c88856dd59)

<br />
<br /><br />

<div id="6-프로젝트-진행"></div>

## ✏ 프로젝트 진행

### 프로젝트 전체 관리 방법
<img src="https://lab.ssafy.com/s12-ai-image-sub1/S12P21D201/-/raw/master/img/프로젝트관리방법.png?ref_type=heads" width="700" />

<br />
<br />
<br />

### Git
<img src="/img/ReadMe/git.gif" width="700" />
<br />


<div id="7-개발-일정"></div>

## 📅 개발 일정


개발 기간: 2025.04.14 ~ 2025.05.16 <br />
QA  기간: 2025.05.17 ~ 2025.05.22 <br />

<br />



<div id="8-기타-산출물"></div>

## 👷 기타 산출물


[포팅 메뉴얼 보러가기](exec/포팅 매뉴얼.pdf)

[중간 발표회 PPT 보러가기](exec/scenario/S108_S-PAT_중간발표회PPT.pptx)

[최종 발표회 PPT 보러가기](exec/scenario/S108_S-PAT_최종발표회PPT.pptx)

[사용 메뉴얼 보러가기](exec/scenario/S-PAT 사용메뉴얼.pptx)

<br />
<br />


<div id="9-팀원-소개"></div>

<br />

<table>
  <tr>
    <td align="center" width="150px">
      <a href="https://github.com/" target="_blank">
        <img src="" alt="제동균 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/" target="_blank">
        <img src="" alt="김은영 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/" target="_blank">
        <img src="" alt="이송희 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/" target="_blank">
        <img src="" alt="김민주 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/" target="_blank">
        <img src="" alt="정은아 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/" target="_blank">
        <img src="" alt="김정모 프로필" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/" target="_blank">
        제동균<br />(Frontend & 팀장)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/" target="_blank">
        김은영<br />(Frontend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/">
        이송희<br />(Frontend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/" target="_blank">
        김민주<br />(Infra,Backend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/" target="_blank">
        정은아<br />(AI,Backend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/" target="_blank">
        김정모<br />(AI,Backend)
      </a>
    </td>
  </tr>
</table>

<br />

<br />

| 이름  |        역할        | <div align="center">개발 내용</div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|:---:|:----------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 제동균 | Frontend<br />팀장 | **기술 스택**<br />- React, TypeScript 기반 프론트엔드 개발<br />- Zustand를 활용한 전역 상태 관리<br />- Figma를 활용한 UI/UX 설계 및 프로토타이핑<br />**주요 개발 내용**<br />- **공통 기능**<br />&nbsp;&nbsp;&nbsp;&nbsp;- localStorage를 이용한 사용자 Role 구분 시스템 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자 역할(User/Admin)에 따른 권한별 라우팅 및 접근 제어<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 재사용 가능한 컴포넌트 아키텍처 설계<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Step2에서 사용되는 WarningModal 컴포넌트 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 최적 LLM 선택 완료 시 표시되는 SuccessModal 컴포넌트 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 모달 상태 관리를 위한 useModal 커스텀 훅 개발 (isOpen, close, open 등)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Tailwind Config를 통한 일관된 디자인 시스템 적용<br />- **Step1 분류체계 생성**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- API 응답 데이터를 동적 테이블 형태로 렌더링<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자와 AI(S-PAT) 간 실시간 대화 인터페이스 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 메시지 타입별 시각적 구분 및 타임스탬프 표시<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 새 메시지 추가 시 자동 스크롤 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 파일 업로드 후 사용 방법 선택 모달 처리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 드래그 앤 드롭 파일 업로드 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- useLocation 훅을 통한 컴포넌트 간 상태 전달<br />  &nbsp;&nbsp;&nbsp;&nbsp;- API 에러 핸들링 및 사용자 피드백 제공<br />- **LLM 선택 시스템**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- GPT, Claude, Gemini, Grok 모델 선택 옵션 제공<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 단일 선택 제약 조건 구현 (라디오 버튼 방식)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand 스토어를 통한 선택 상태 전역 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 선택 상태에 따른 실시간 시각적 피드백 제공<br />- **Step4 관리자 전문가 평가**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand를 활용한 평가 점수 데이터 영속성 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Map 자료구조로 각 LLM별 특허 데이터 독립 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 전문가 평가 생략 기능을 위한 ExpertSkip 컴포넌트 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 다크모드 테마 지원<br />- **Step5 종합 대시보드**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand Persist 미들웨어를 통한 브라우저 새로고침 시 데이터 보존<br />  &nbsp;&nbsp;&nbsp;&nbsp;- ReCharts 라이브러리를 활용한 평가 점수 BarChart 시각화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 테마별 동적 색상, 그리드, 툴팁 스타일링 시스템<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 스마트 시간 포맷팅 유틸리티 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 전문가 평가 참여 여부에 따른 점수 계산 로직 분기 처리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- useMemo 훅을 통한 데이터 변경 시 자동 재계산 최적화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 종합 점수 표시 UI 컴포넌트 구현<br /> 
| 김은영 |     Frontend     | - 앨범 및 사진 기능<br />&nbsp;&nbsp;&nbsp;&nbsp;- 앨범 목록 슬라이딩 기능 구현<br />&nbsp;&nbsp;&nbsp;&nbsp;- 앨범 커버 타이틀 투명 애니메이션 구현<br />&nbsp;&nbsp;&nbsp;&nbsp;- Intersection Observer API 활용하여 cursor 기반 무한스크롤 구현<br />&nbsp;&nbsp;&nbsp;&nbsp;- 반응형 그리드 레이아웃 구현<br />- 편지 작성 및 보관함 기능<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자 경험 개선을 위한 글자수 제한 및 페이지 이동 시 경고 알림 표시<br />  &nbsp;&nbsp;&nbsp;&nbsp;- MediaRecorder API 활용하여 음성 녹음 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- CSS 애니메이션을 활용한 파도 및 카세트 릴 회전 애니메이션 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 편지 오픈 애니메이션 적용<br />- 이미지 자르기 및 업로드<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 이미지 업로드 기능 구현: 파일 유효성 검사 및 크기 제한<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 이미지 크롭 기능 구현: 원본 유지하며 미리보기용 다운샘플링 및 WebP 변환 처리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 업로드 시 WebP 형식 변환<br />- UI/UX 요소<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Tailwind CSS 기반 반응형 디자인 적용<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 커스텀 Alert 메시지 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 로딩 애니메이션 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 버튼 컴포넌트 분리하여 재사용 가능하게 구현<br />- 랜딩 페이지 및 인트로 애니메이션<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 글자가 채워지는 진행도 기반 그라데이션 효과<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 페이지 간 자연스러운 전환을 위한 커튼 애니메이션 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 스크롤에 따라 확대되는 원형 클리핑 마스크 애니메이션<br />- 성능 최적화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand 기반 상태 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 점진적 이미지 로딩 구현: 고화질 이미지를 불러오기 전 저화질 이미지를 우선 로드하여 사용자 경험 개선<br />                                                                                                                                                                                                                                                                                                                                                                                     |
| 이송희 |     Frontend     | - 앨범 및 사진 기능<br />&nbsp;&nbsp;&nbsp;&nbsp;- 앨범 목록 슬라이딩 기능 구현<br />&nbsp;&nbsp;&nbsp;&nbsp;- 앨범 커버 타이틀 투명 애니메이션 구현<br />&nbsp;&nbsp;&nbsp;&nbsp;- Intersection Observer API 활용하여 cursor 기반 무한스크롤 구현<br />&nbsp;&nbsp;&nbsp;&nbsp;- 반응형 그리드 레이아웃 구현<br />- 편지 작성 및 보관함 기능<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자 경험 개선을 위한 글자수 제한 및 페이지 이동 시 경고 알림 표시<br />  &nbsp;&nbsp;&nbsp;&nbsp;- MediaRecorder API 활용하여 음성 녹음 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- CSS 애니메이션을 활용한 파도 및 카세트 릴 회전 애니메이션 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 편지 오픈 애니메이션 적용<br />- 이미지 자르기 및 업로드<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 이미지 업로드 기능 구현: 파일 유효성 검사 및 크기 제한<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 이미지 크롭 기능 구현: 원본 유지하며 미리보기용 다운샘플링 및 WebP 변환 처리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 업로드 시 WebP 형식 변환<br />- UI/UX 요소<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Tailwind CSS 기반 반응형 디자인 적용<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 커스텀 Alert 메시지 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 로딩 애니메이션 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 버튼 컴포넌트 분리하여 재사용 가능하게 구현<br />- 랜딩 페이지 및 인트로 애니메이션<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 글자가 채워지는 진행도 기반 그라데이션 효과<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 페이지 간 자연스러운 전환을 위한 커튼 애니메이션 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 스크롤에 따라 확대되는 원형 클리핑 마스크 애니메이션<br />- 성능 최적화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand 기반 상태 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 점진적 이미지 로딩 구현: 고화질 이미지를 불러오기 전 저화질 이미지를 우선 로드하여 사용자 경험 개선<br />                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 김민주 |      Infra       | - DB 설계 및 API 명세 작성<br />- Swagger UI를 활용한 API 문서 자동화<br />- 인증/인가 구현(Spring Security, JWT, OAuth2.0)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Spring Security 기반 인증/인가 시스템 구축<br />  &nbsp;&nbsp;&nbsp;&nbsp;- JWT 기반 토큰 인증 시스템 설계 및 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Redis를 활용한 JWT 블랙 리스트 구현, JWT 토큰 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- OAuth2.0 사용 카카오 소셜 로그인 연동<br />- 그룹 관련 기능 API 개발<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 24시간 유효한 가입 코드 생성 및 Redis에 저장, 조회 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 그룹 생성 및 가입 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 그룹 정보 수정 및 조회 기능 구현<br />- 앨범, 사진, 감상평 관련 기능 API 개발<br />  &nbsp;&nbsp;&nbsp;&nbsp;- S3 Presigned URL을 이용한 사진 업로드 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- CloudFront Signed URL을 통한 사진 조회 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 클라이언트에서 쿼리파라미터로 이미지 리사이징<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 앨범 썸네일 변경, 앨범 이동 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사진에 텍스트, 음성 감상평 작성하는 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 음성의 경우 S3 Presigned URL을 이용한 업로드 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- CloudFront Signed URL을 통한 조회 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사진 상세(감상평) 조회 시 발생하는 N+1 문제 해결<br />- 일정 관련 기능 API 개발<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 일정 수정, 조회, 삭제, 앨범 연결 기능 구현<br />- 편지 관련 기능 API 개발<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 텍스트, 음성 편지 전송 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 음성의 경우 S3 Presigned URL을 이용한 업로드 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- CloudFront Signed URL을 통한 조회 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 편지 목록 조회, 상세 조회 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 편지 상세 조회 시 발생하는 N+1 문제 해결<br />- FCM 백그라운드, 포그라운드 알림 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 새로운 편지 도착 및 폰트 생성 요청, 생성 완료, 생성 요청 거절 시 알림 발송<br />- 기타 QA 과정 중 Back, Front 에러 수정<br /> |
| 정은아 |        AI,Backend        | - font generation task 조사<br />- 모델 학습을 위한 데이터셋 수집<br />- DM-Font model<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 논문 정리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 코드 뜯어보기<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 학습<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 추론<br />- LF-Font model<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 논문 정리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 코드 뜯어보기<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 학습<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 추론<br />- 폰트 생성 설명서 만들기<br />- 템플릿 전처리 코드 작성<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 이미지 픽셀값 보정<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 각 문자별 이미지 파일 저장<br />- 훈련 step별 결과 비교 후 최종 모델 LF-Font로 선정<br />- 생성된 이미지로 ttf 만드는 코드 작성<br />  &nbsp;&nbsp;&nbsp;&nbsp;- fontforge, potrace 라이브러리 이용<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 이미지에서 딴 선 후처리<br />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 김정모 |        AI,Backend        | - **DB 설계 및 API 명세서 작성**<br />&nbsp;&nbsp;&nbsp;&nbsp;- 도메인 기반 데이터 모델링 및 ERD 설계<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Swagger 기반 REST API 명세서 작성 및 자동 문서화<br />- **폰트 기능 구현**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 폰트 생성 요청 및 조회 API 개발<br /> &nbsp;&nbsp;&nbsp;&nbsp;- 가족 단위 폰트 조회 시 발생하는 N+1 문제 해결 (Fetch Join 적용)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- S3 Presigned URL을 활용한 템플릿 업로드 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- CloudFront Signed URL을 통해 TTF 파일 보안 조회 기능 구현- **AWS 클라우드 인프라 구축**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- EC2(Ubuntu) 인스턴스를 이용한 애플리케이션 서버 구성<br />  &nbsp;&nbsp;&nbsp;&nbsp;- S3를 이용한 미디어 리소스 저장소 구성<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Docker, Docker Compose를 이용한 백엔드 애플리케이션 컨테이너화<br />- **CI/CD 파이프라인 및 무중단 배포**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Jenkins 기반 빌드/테스트/배포 자동화 구축<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Nginx 리버스 프록시 설정 및 배포 안정성 강화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Blue-Green 배포 전략 적용으로 무중단 배포 지원<br />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 신규 컨테이너 헬스 체크 기반 트래픽 전환<br />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- 빌드 실패 시 자동 롤백 시스템 구현<br />- **모니터링 및 성능 테스트**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Prometheus + Grafana를 통한 실시간 시스템 모니터링 대시보드 구축  &nbsp;&nbsp;&nbsp;&nbsp;- ngrinder를 통한 부하 테스트 및 병목 구간 식별<br />- **이미지 최적화**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Lambda@Edge를 활용한 서버리스 실시간 이미지 리사이징 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 쿼리 파라미터 기반 이미지 크기 조절로 트래픽 및 속도 최적화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 이미지 크롭 및 미리보기 시 다운샘플링된 손실 압축 이미지 제공<br />  |


<div id="10-포팅-메뉴얼"></div>

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

  | Variable Name          | Default Value                                                                                                                                                                                | Description              |
  |------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
  | LANGSMITH_TRACING      | true                                                                                                                                                                                         | Enable LangSmith tracing |
  | LANGSMITH_ENDPOINT     | "https://api.smith.langchain.com"                                                                                                                                                            | URL to LangSmith API     |
  | LANGSMITH_API_KEY      |                                                                                                                                                                                              | LangSmith API key        |
  | LANGSMITH_PROJECT      | "S-PAT"                                                                                                                                                                                      | LangSmith 프로젝트 명      |
  | OPENAI_API_KEY         |                                                                                                                                                                                              | OpenAI API key           |
  | CLAUDE_API_KEY         |                                                                                                                                                                                              | Claude API key           |
  | GEMINI_API_KEY         |                                                                                                                                                                                              | Gemini API key           |
  | GROK3_API_KEY          |                                                                                                                                                                                              | Grok3 API key            |
  | DATABASE_URL           | postgresql://{docker에서 실행시 지정한 POSTGRES_USER}:{docker에서 실행시 지정한 POSTGRES_PASSWORD}@localhost:5432/{docker에서 실행시 지정한 POSTGRES_DB}<br/>default: postgresql://postgres:1234@localhost:5432/mydb | Database connection URL  |
  | DEBUG                  | True                                                                                                                                                                                         | Enable debug mode        |
  | REDIS_HOST             | localhost                                                                                                                                                                                    | Redis host               |
  | REDIS_PORT             | 6379                                                                                                                                                                                         | Redis port               |
  | REDIS_URL              | redis://localhost:6379/0                                                                                                                                                                     | Redis connection URL     |
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
    # docker Postgres 실행시 지정한 POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
    DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}
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

- Celery 실행 (새로운 bash: BE 폴더 내에서)

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

- BE 폴더 아래 .env 작성
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
  | GROK3_API_KEY          | <br/>                                                                                                                                    | Grok3 API key            |
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
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=${REDIS_PASSWORD}
    REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
    ```


## 2.3 Docker compose 실행

```bash
docker compose up -d
```
---
# 개선 사항
## 사용자 모드
### 특허 데이터 100건, 6명 동시 실행 (AWS EC2 기준)
- GPT: 평균 1,182초 소요, 1명 중단
- Claude: 평균 1,132초 소요, 1명 중단
- Gemini: 평균 256초 소요
- Grok: 평균 1,342초 소요

## 관리자 모드
### 특허 데이터 100건, 4명 동시 실행 (AWS EC2 기준)
- GPT: 304초 / 1,154초 소요, 2명 중단
- Claude: 584초 / 600초 소요, 2명 중단
- Gemini: 평균 1,664초 소요
- Grok: 평균 529초 소요

## 문제점
- Celery 환경 차이: 사용자 모드에서 Celery를 사용하는 경우, AWS EC2(리눅스 기반)에서는 worker를 4개로 실행해 병렬 처리가 가능하지만, Windows 환경에서는 기본적으로 worker가 1개로 제한되어 기존 background task 방식과 속도 차이가 거의 없음
- Rate limit: GPT, Claude와 같이 TPM(Token Per Minute)이 낮은 모델은 동시에 여러 사용자가 접근할 경우 rate limit에 걸려 속도 저하 발생
- 실패 복구 미흡: background task 방식에는 재시도(retry) 로직이 없어, 모델 응답 실패 시 특허 분류가 비정상적으로 종료됨

## 해결 방안
- API Key 분산 사용: TPM이 낮은 GPT, Claude의 경우 여러 개의 API key를 라운드 로빈 또는 큐 방식으로 분산 사용해 rate limit 회피
- Retry 및 예외처리 로직 강화: Celery task 및 background task 모두에 retry 로직과 예외 처리 로직 강화하여 중단 없이 복구 가능하도록 개선
- 실행 상태 모니터링 도입: 작업 실패나 중단 상황에 대응할 수 있도록 Celery Dashboard (Flower 등) 구축