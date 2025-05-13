<p align="center">
  <img width="450" alt="logo" src="https://github.com/user-attachments/assets/c14b85b4-0617-479c-ba2c-f4c4241db5b1"/>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nestjs,ts,mysql,aws,vercel,react,vite" alt="Tech Stack" />
</p>

# luckstargram-frontend

> AI가 예측한 나만의 운세를 바로 확인해보세요!

---

## 소개 (Overview)

> LuckStargram은 이름과 생년월일을 입력하면,  
> AI가 분석한 오늘의 운세를 알려주고, 바로 SNS로 공유할 수 있는  
> 모바일 최적화 운세 웹서비스입니다.

---

## 주요 기능 (Key Features)

### 🥠 오늘의 운세 생성
- 이름/생년월일/운세 날짜 입력 후 운세 결과 제공
- 결과 메시지, 행동 팁 포함된 카드 스타일 UI
- 매일 1회 무료 운세 생성 가능 (티켓 시스템 기반)

---

### 🎟️ 티켓 시스템 (Gamification 요소)
- 하루 1장 기본 제공 (자정에 자동 초기화)
- 운세 결과를 공유하면 티켓 1장 추가 획득
- 공유된 링크를 통해 들어온 사용자도 1회 티켓 수신 가능
- 티켓이 0장일 경우, 이전 결과 공유를 유도하는 UX 제공

---

### 🔗 공유 페이지 최적화
- `/share/:uuid` 형태의 공유 전용 페이지 제공
- 해당 링크를 통해 공유된 운세 결과만 확인 가능
- "나의 운세 보러가기" CTA 버튼으로 홈 이동 유도
- 공유 성공 시 티켓 획득 모달 노출

---

### 🖼️ SNS 미리보기 메타태그 (OG 태그)
- 공유 시 페이지마다 동적으로 메타태그(title, description, image) 생성
- 예시: `승모님의 5월 13일 운세 🍀`
- SNS(카카오톡, 트위터 등)에서 카드 형태로 자동 미리보기 출력

---

### 🧠 퍼블릭 사용자 상태 관리 (비로그인)
- 로그인/회원가입 없이도 사용 가능
- `localStorage`를 통해 사용 기록 저장
- 저장 항목:
  - `luckstar_usedCount` : 오늘 운세 사용 횟수
  - `luckstar_sharedCount` : 공유 횟수
  - `luckstar_receiveCount` : 공유된 링크로 받은 티켓 수

---

## 🛠 기술 스택


- **Frontend**
  - Vite + React
  - Cursor AI
  - Vercel
- **Backend**
  - NestJS + TypeScrip
  - MySQL (Docker) + AWS RDS
  - OpenAI API
  - Lambda + API Gateway

---

## 아키텍처 (Architecture)

<p align="left">
  <img width="500" alt="logo" src="https://github.com/user-attachments/assets/b2c7bd8a-bf45-48d4-90b6-8869df6c668a"/>
</p>

---

## 라이선스 (License)

이 프로젝트는 [MIT License](./LICENSE)에 따라 배포 및 사용이 가능합니다.

---
