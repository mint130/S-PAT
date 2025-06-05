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


[포팅 메뉴얼 보러가기](exec/PortingManual.md)

[중간 발표회 PPT 보러가기](exec/scenario/S108_S-PAT_중간발표회PPT.pptx)

[최종 발표회 PPT 보러가기](exec/scenario/S108_S-PAT_최종발표회PPT.pptx)

[사용 메뉴얼 보러가기](exec/scenario/S-PAT_사용메뉴얼.pptx)

<br />
<br />


<div id="9-팀원-소개"></div>

<br />

<table>
  <tr>
    <td align="center" width="150px">
      <a href="https://github.com/jegyun" target="_blank">
        <img src="img/ReadMe/동균.png" alt="제동균 프로필" />
      </a>
    </td>
    <td align="center" width="116px">
      <a href="https://github.com/key9425" target="_blank">
        <img src="img/ReadMe/은영.png" alt="김은영 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/shlee1103" target="_blank">
        <img src="img/ReadMe/송희.jpg" alt="이송희 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/mint130" target="_blank">
        <img src="img/ReadMe/민주.jpg" alt="김민주 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/euna-jeong20" target="_blank">
        <img src="img/ReadMe/은아.png" alt="정은아 프로필" />
      </a>
    </td>
    <td align="center" width="150px">
      <a href="https://github.com/mo-jeong" target="_blank">
        <img src="img/ReadMe/정모.png" alt="김정모 프로필" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/jegyun" target="_blank">
        제동균<br />(Frontend & 팀장)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/key9425" target="_blank">
        김은영<br />(Frontend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/shlee1103">
        이송희<br />(Frontend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mint130" target="_blank">
        김민주<br />(Infra,Backend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/euna-jeong20" target="_blank">
        정은아<br />(AI,Backend)
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mo-jeong" target="_blank">
        김정모<br />(AI,Backend)
      </a>
    </td>
  </tr>
</table>

<br />

<br />

| 이름  |        역할        | <div align="center">개발 내용</div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|:---:|:----------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 제동균 | Frontend<br />팀장 | **기술 스택**<br />- React, TypeScript 기반 프론트엔드 개발<br />- Zustand를 활용한 전역 상태 관리<br />- Figma를 활용한 UI/UX 설계 및 프로토타이핑<br /><br />**주요 개발 내용**<br />- **공통 기능**<br />&nbsp;&nbsp;&nbsp;&nbsp;- localStorage를 이용한 사용자 Role 구분 시스템 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자 역할(User/Admin)에 따른 권한별 라우팅 및 접근 제어<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 재사용 가능한 컴포넌트 아키텍처 설계<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Step2에서 사용되는 WarningModal 컴포넌트 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 최적 LLM 선택 완료 시 표시되는 SuccessModal 컴포넌트 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 모달 상태 관리를 위한 useModal 커스텀 훅 개발 (isOpen, close, open 등)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Tailwind Config를 통한 일관된 디자인 시스템 적용<br />- **Step1 분류체계 생성**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- API 응답 데이터를 동적 테이블 형태로 렌더링<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자와 AI(S-PAT) 간 실시간 대화 인터페이스 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 메시지 타입별 시각적 구분 및 타임스탬프 표시<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 새 메시지 추가 시 자동 스크롤 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 파일 업로드 후 사용 방법 선택 모달 처리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 드래그 앤 드롭 파일 업로드 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- useLocation 훅을 통한 컴포넌트 간 상태 전달<br />  &nbsp;&nbsp;&nbsp;&nbsp;- API 에러 핸들링 및 사용자 피드백 제공<br />- **LLM 선택 시스템**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- GPT, Claude, Gemini, Grok 모델 선택 옵션 제공<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 단일 선택 제약 조건 구현 (라디오 버튼 방식)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand 스토어를 통한 선택 상태 전역 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 선택 상태에 따른 실시간 시각적 피드백 제공<br />- **Step4 관리자 전문가 평가**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand를 활용한 평가 점수 데이터 영속성 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Map 자료구조로 각 LLM별 특허 데이터 독립 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 전문가 평가 생략 기능을 위한 ExpertSkip 컴포넌트 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 다크모드 테마 지원<br />- **Step5 종합 대시보드**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand Persist 미들웨어를 통한 브라우저 새로고침 시 데이터 보존<br />  &nbsp;&nbsp;&nbsp;&nbsp;- ReCharts 라이브러리를 활용한 평가 점수 BarChart 시각화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 테마별 동적 색상, 그리드, 툴팁 스타일링 시스템<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 스마트 시간 포맷팅 유틸리티 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 전문가 평가 참여 여부에 따른 점수 계산 로직 분기 처리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- useMemo 훅을 통한 데이터 변경 시 자동 재계산 최적화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 종합 점수 표시 UI 컴포넌트 구현<br /> 
| 김은영 | Frontend | **기술 스택**<br />- React, TypeScript 기반 프론트엔드 개발<br />- Zustand를 활용한 상태 관리<br />- Figma를 활용한 UI/UX 설계<br />- AG Grid를 활용한 데이터 테이블 구현<br />- XLSX 라이브러리를 통한 엑셀 파일 처리<br /><br />**주요 개발 내용**<br />- **재사용 가능한 Button 컴포넌트 구현**<br />&nbsp;&nbsp;&nbsp;&nbsp;- primary, outline, dark-outline 등 다양한 variant 지원<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 로딩 상태 표시 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Tailwind CSS 클래스 충돌 방지를 위한 크기별(sm, md, lg) props 기반 스타일링<br />  &nbsp;&nbsp;&nbsp;&nbsp;- disabled 상태 및 접근성 고려한 UI 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- React.ButtonHTMLAttributes 확장으로 기본 버튼 기능 상속<br />- **DataTable 컴포넌트 구현**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- AG Grid 기반 데이터 테이블 구축<br />  &nbsp;&nbsp;&nbsp;&nbsp;- forwardRef를 활용한 외부 컴포넌트에서 그리드 API 직접 접근 가능<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 다크모드 테마 지원 (themeQuartz, colorSchemeDarkWarm 적용)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 자동 컬럼 크기 조정(fitGridWidth) 및 최소 너비 설정<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 편집 모드 시 다중 행 선택, 행 드래그 앤 드롭, 셀 편집 기능 구현<br />- **DataTableToolbar 컴포넌트 구현**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 테이블 재렌더링 최적화를 위한 툴바 분리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 계층적 분류(대/중/소분류)에 따른 모달 기반 행 추가 기능<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 선택된 행에 대한 삭제 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 실시간 검색 필터링(quickFilterText) 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 컬럼 표시/숨김 필터링 기능 및 전체 선택/해제 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- useRef와 외부 클릭 감지를 통한 드롭다운 메뉴 상태 관리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 드롭다운 표시 시 테이블 컬럼 상태를 동적으로 조회하여 현재 순서 및 가시성 반영<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 분류 단계별 코드 추출 및 실시간 중복 검사를 통한 행 추가 시 계층 구조 유지<br />  &nbsp;&nbsp;&nbsp;&nbsp;- XLSX 라이브러리를 활용한 파일 다운로드<br />- **Step2 분류체계 수정**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 편집된 테이블 데이터를 API를 통해 분류체계로 저장<br />  &nbsp;&nbsp;&nbsp;&nbsp;- UX를 고려하여 행 선택 컬럼을 테이블 왼쪽에 고정<br />- **Step4 분류 결과 확인**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- (관리자) 테이블 컬럼에 cellRenderer 적용한 점수 선택 UI 구현(EvaluationRenderer)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- (관리자) UX를 고려하여 전문가 평가 컬럼을 테이블 오른쪽에 고정<br />  &nbsp;&nbsp;&nbsp;&nbsp;- (관리자) 전문가 평가 업데이트 및 실시간 카운트 표시<br />  &nbsp;&nbsp;&nbsp;&nbsp;- (사용자) 에러 처리 및 재시도 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- (사용자) 특허 분류 데이터 결과를 엑셀 파일로 다운로드하는 API 연동<br /> |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 이송희 | Frontend | **기술 스택**<br />- React, TypeScript 기반 프론트엔드 개발<br />- Zustand를 활용한 상태 관리<br />- Figma를 활용한 UI/UX 설계<br /><br />**주요 개발 내용**<br />- **공통 기능**<br />&nbsp;&nbsp;&nbsp;&nbsp;- Figma를 활용한 전체 서비스 UI/UX 디자인 시스템 구축<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 컴포넌트 폴더 구조 설계 및 구축<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 공통 컴포넌트 계층 설계<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 배경 그라데이션 Tailwind CSS 커스텀 설정<br />  &nbsp;&nbsp;&nbsp;&nbsp;- CSS radial-gradient 및 mix-blend-mode를 활용한 복합 배경 효과<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 컴포넌트 간 일관된 디자인 가이드라인 적용<br />- **다크모드 기능**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Zustand persist 미들웨어를 활용한 다크모드 전역 상태 관리 (새로고침 시에도 상태 유지)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 다크/라이트 모드별 그라데이션 및 색상 시스템 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 커스텀 토글 스위치 컴포넌트 개발<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 모드별 차별화된 UI 컴포넌트 스타일링<br />- **사이드바**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사이드바 컴포넌트 UI 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- useLocation 훅을 통한 URL 경로 기반 현재 단계 자동 감지<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 조건부 렌더링을 활용한 전문가/사용자 모드 구분<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 단계별 진행 상황 하이라이팅<br />- **Step0 메인페이지**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- CSS @keyframes를 활용한 moveGradient 서비스 타이틀 애니메이션<br />  &nbsp;&nbsp;&nbsp;&nbsp;- React Router Link 컴포넌트 기반 모드별 라우팅 시스템<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Math.random()을 활용한 세션 ID 생성 및 localStorage 저장<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자/전문가 모드별 카드 및 체크리스트 UI 구현<br />- **Step1 분류체계 생성**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 분류 체계 생성 컴포넌트 UI 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 서비스 소개 컴포넌트 UI 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 프롬프트 입력 컴포넌트 UI 구현<br />- **Step3 특허데이터 업로드**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 특허데이터 업로드 컴포넌트 UI 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- HTML5 Drag and Drop API를 활용한 드래그앤드롭 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 엑셀 형태의 특허 데이터 파일 업로드 기능<br />  &nbsp;&nbsp;&nbsp;&nbsp;- FileReader API를 통한 확장자 및 파일 읽기 검증 로직 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- useState를 통한 드래그 상태 관리 및 시각적 피드백<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 업로드 상태 표시 및 로딩 UI<br />- **Step3 특허 데이터 분류 실시간 로딩 시스템**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- EventSource API를 활용한 SSE 실시간 데이터 스트리밍<br />  &nbsp;&nbsp;&nbsp;&nbsp;- CSS @keyframes 기반 Ripple 확산 애니메이션 효과<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 현재 처리 건수/전체 건수 실시간 표시<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 평균 처리 시간 기반 예상 완료 시간 자동 계산<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 진행률 퍼센티지 기반 그라데이션 표시<br />  &nbsp;&nbsp;&nbsp;&nbsp;- setTimeout을 활용한 네트워크 자동 재연결 로직 개발<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 사용자 모드 UserLoading 컴포넌트 구현<br /> |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 김민주 |  Infra, Backend  | **- CI/CD 파이프라인 구축 및 무중단 배포 시스템 구성** <br> &nbsp;&nbsp;&nbsp;&nbsp; - Jenkins 기반 자동화 파이프라인 구축: 빌드, 테스트, 배포 전 과정을 자동화<br> &nbsp;&nbsp;&nbsp;&nbsp; - Nginx 리버스 프록시 설정: 서비스별 요청 라우팅 및 리다이렉션 처리<br> &nbsp;&nbsp;&nbsp;&nbsp; - Blue-Green 배포 전략 적용: 이중 환경 구성으로 무중단 배포 실현<br> &nbsp;&nbsp;&nbsp;&nbsp; - 헬스 체크 기반 트래픽 전환: 컨테이너 상태 확인 후 안정적인 트래픽 전환 구현<br> &nbsp;&nbsp;&nbsp;&nbsp; - FastAPI 기반 Celery Worker 컨테이너 운영: 단일 이미지로 웹 서버와 워커 통합 실행<br> &nbsp;&nbsp;&nbsp;&nbsp; - 자동 롤백 시스템 구현: 배포 실패 시 이전 안정 버전으로 자동 복구<br> &nbsp;&nbsp;&nbsp;&nbsp;- DB 마이그레이션 자동화: 배포 시 스키마 변경 자동 적용<br>**- 로컬 개발환경 구축 및 인프라 구성**<br> &nbsp;&nbsp;&nbsp;&nbsp;- Docker Compose 기반 개발환경 구성: 다중 컨테이너 환경을 위한 Dockerfile 작성 및 로컬 실행 환경 구축<br>**- Redis 환경 설정 및 활용** : 작업 결과 데이터를 저장 및 반환하는 로직 구현<br>**- SSE 기반 실시간 진행 상황 전송 기능 구현** <br> &nbsp;&nbsp;&nbsp;&nbsp;- SSE(Server-Sent Events) 방식 구현: 사용자 및 전문가 모드에서 실시간 진행 상황 제공<br>     - Background Tasks 및 asyncio.Queue 활용: 전문가 모드에서 비동기 처리를 위한 큐 시스템 구성, SSE 엔드포인트에서 작업 진행 상황을 실시간으로 전달<br>**- Celery 기반 비동기 분산 처리 시스템 구현** <br>     - Celery + Redis 활용: 사용자 모드에서 분류 속도 향상을 위한 비동기 큐 구성 (Redis를 브로커 및 백엔드로 사용)<br>     - 예외 처리 로직 추가: Rate Limit 오류 대비를 위한 retry, backoff, countdown 설정<br>     - Redis Pub/Sub 연동: 작업 상태를 발행(Publish)하고, 해당 메시지를 SSE를 통해 사용자에게 전달                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 정은아 |    Backend,AI    | **기술 스택**<br />- FastAPI 기반 백엔드 개발<br />- FAISS, Langchain, pandas를 활용<br /><br />**주요 개발 내용**<br / - 특허 분류 체계 생성<br />    - 특허 분류 체계 생성을 위한 few-shot 프롬프트 작성<br />      - langchain 프레임워크 활용<br />      - 이전 대화를 기억하기 위해 ChatMessageHistory() 사용<br />      - 새로고침해도 대화가 유지되기 위해 postgreSQL을 이용한 대화 저장 및 불러오기 API 개발<br />      - output형식 지정을 위해 JsonOutputParser() 사용<br />- 분류 체계 FAISS 벡터 DB에 저장<br />      - 중분류와 소분류만을 저장, 이때 대,중,소의 구조적 정보를 활용한 임베딩 생성<br />      - 프롬프트에 활용하기 위해 meta정보에도 구조적 정보 저장<br />- 특허 데이터 분류<br />      - DB에 저장된 최적의 LLM 설정 및 반환 API 개발<br />      - 특허 데이터를 입력 받으면 벡터 DB에서 retrieve해서 top 3개중 하나로 분류하도록 프롬프트 작성<br />      - langchain 프레임워크 활용<br />      - ClassificationSchema를 지정하여 outputparser 정의<br />      - 분류 결과 엑셀 파일로 저장 후 반환 기능 개발<br />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 김정모 | Backend<br />AI | **기술 스택**<br />- FastAPI 기반 백엔드 개발<br />- FAISS, Langchain, pandas를 활용<br /><br />**주요 개발 내용**<br />- **분류 체계 생성**<br />&nbsp;&nbsp;&nbsp;&nbsp;- 분류 체계 생성 프롬프팅<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 분류 체계 생성 시 엑셀 파일 업로드 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 분류 체계 생성 시 엑셀 파일 업로드 및 프롬프트 사용 기능 구현<br />  &nbsp;&nbsp;&nbsp;&nbsp;- pandas를 이용하여 엑셀 파일 json 변환<br />  &nbsp;&nbsp;&nbsp;&nbsp;- FAISS를 이용한 벡터 DB 저장<br />  &nbsp;&nbsp;&nbsp;&nbsp;- LLM API 호출을 통한 분류 체계 자동 생성<br />  &nbsp;&nbsp;&nbsp;&nbsp;- postgrSQL을 사용하여 이전 대화 기억<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Langchain 프레임워크를 활용하여 memory, parser, chain 등 활용<br />- **전문가 모드 특허 분류 및 평가**<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 특허 데이터 업로드를 통한 특허 분류<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 특허 분류에 대한 평가 (유사도, LLM 평가)<br />  &nbsp;&nbsp;&nbsp;&nbsp;- pandas를 이용한 엑셀 파일 json 변환<br />  &nbsp;&nbsp;&nbsp;&nbsp;- LLM API 호출을 통한 특허 데이터 분류<br />  &nbsp;&nbsp;&nbsp;&nbsp;- FAISS에 저장된 분류 체계와 특허 데이터를 비교<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Langchain 프레임워크를 활용한 분류 체계와 특허 데이터의 유사도 측정<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 분류 결과와 가장 유사한 분류 체계 비교<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 전문가 프롬프트로 분류 결과의 타당성 점수화<br />  &nbsp;&nbsp;&nbsp;&nbsp;- 4가지 LLM API 호출 병렬 처리<br />  &nbsp;&nbsp;&nbsp;&nbsp;- Cochran 공식을 활용한 통계적 샘플 크기 계산 함수 제공<br /> |


<div id="10-포팅-메뉴얼"></div>

## 📑 포팅 메뉴얼

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
