<p align="center">
  <img width="450" alt="logo" src="https://github.com/user-attachments/assets/c14b85b4-0617-479c-ba2c-f4c4241db5b1"/>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nestjs,ts,mysql,aws,vercel,react,vite,next" alt="Tech Stack" />
</p>

# luckstargram-frontend

> AI가 예측한 나만의 운세를 바로 확인해보세요!

---

## 소개 (Overview)

> 이름과 생년월일을 입력하면, AI가 분석한 오늘의 운세를 제공하고,  
> 생성된 운세 결과는 숏링크로 간편하게 공유할 수 있고, 카카오톡 등 SNS에서   
> OG 메타태그를 통한 카드 미리보기를 지원합니다. (Next.js SSR 기반)   

---

## 관련 레포지토리 (Repositories)

- [LuckStargram Backend](https://github.com/yooseungmo/luckstargram-backend) — API 서버 & AI 운세 로직
- [LuckStargram Frontend](https://github.com/yooseungmo/luckstargram-frontend) — 메인 UI & 사용자 인터랙션
- [LuckStargram OG](https://github.com/yooseungmo/luckstargram-og) —  공유용 서브 도메인 & SSR Open Graph 메타태그

---

## 주요 기능 (Key Features)

### 🥠 오늘의 운세 생성

- 이름/생년월일/운세 날짜 입력 → 운세 결과 제공
- 결과 메시지, 행동 팁 포함된 카드 스타일 UI
- 매일 1회 운세 생성 가능 (티켓 시스템 기반)

---

### 🎟️ 티켓 시스템 (Gamification 요소)

- 하루 1장 기본 제공 (자정에 자동 초기화)
- 운세 결과를 공유하면 티켓 1장 추가 획득
- 공유된 링크를 통해 들어온 사용자도 1회 티켓 수신 가능
- 티켓 소진 시, 이전 결과 공유를 유도하는 UX 제공

---

### 🔗 숏링크 공유 & SSR OG 메타태그

- `share.luckstargram.com/:code` 형태의 숏링크 발급 + 서브 도메인 구성
- Next.js SSR 페이지에서 OG 메타태그를 동적으로 렌더링
- Middleware로 User-Agent 감지 후 분기 처리:
  - 크롤러 요청: 내부 rewrite → SSR OG 페이지로 OG 메타 응답
  - 일반 브라우저: redirect → 메인 도메인
- OG 메타 태그(title, description, image, url) 동적 생성 및     
  <meta httpEquiv="refresh"...>로 클라이언트 리다이렉트 처리
- 공유 완료 시, 티켓 획득 모달 표시로 보상 UX 강화

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
  - Next.js(SSR)
  - Cursor AI
  - Vercel
- **Backend**
  - NestJS + TypeScript
  - MySQL (Docker) + AWS RDS
  - OpenAI API
  - Lambda + API Gateway

---

## 아키텍처 (Architecture)

<p align="left">
  <img width="500" alt="logo" src="https://github.com/user-attachments/assets/fadacaa4-5467-4c59-953d-dc85288ebcc1"/>
</p>

---

## 라이선스 (License)

이 프로젝트는 [MIT License](./LICENSE)에 따라 배포 및 사용이 가능합니다.

---
