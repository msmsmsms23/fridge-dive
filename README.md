# 🍳 FridgeDive

> **AI 기반 스마트 냉장고 관리 & 인터랙티브 레시피 큐레이션 서비스**
> 
> "냉장고 속 남은 재료, 이제 AI와 함께 근사한 요리로 재탄생시키세요."

[실제 서비스 보러 가기 (Demo)](https://fridge-dive-dt1l9raw0-msmsmsms23s-projects.vercel.app)

---

## ✨ Key Features

### 1. AI 레시피 스마트 분석 (Text & Image)
- 사용자가 입력한 텍스트나 촬영한 레시피 사진을 **Google Gemini AI**가 분석하여 요리명, 설명, 재료, 단계별 조리법을 자동으로 구조화합니다.
- 분석된 결과는 사용자가 직접 수정 및 보완하여 나만의 레시피로 저장할 수 있습니다.

### 2. 인터랙티브 쿠킹 모드 (Step-by-Step)
- **몰입형 UX:** 요리 중 단계를 놓치지 않도록 버튼 클릭으로 진행 상황을 제어하는 기능을 제공합니다.
- **자동 타이머:** 조리 과정에 포함된 시간에 맞춰 스마트 타이머가 내장되어, 조리 시간을 효율적으로 관리하고 요리 몰입도를 극대화합니다.

### 3. 지능형 요리 아카이빙
- 완성된 요리를 사진 및 메모와 함께 기록하여 나만의 요리 히스토리를 관리합니다.
- 재료 기반의 데이터를 통해 과거에 기록한 요리들을 한눈에 확인할 수 있습니다.

---

[실제 서비스 보러 가기 (Demo)](https://fridge-dive-dt1l9raw0-msmsmsms23s-projects.vercel.app/recipes/1)

1. 내 레시피 모음
![메인화면](https://github.com/user-attachments/assets/38dab17c-d700-45b6-8ecc-396664e098ab)
사용자가 저장한 레시피 모음

2. 요리 기록 타임라인
![메인화면2](https://github.com/user-attachments/assets/117d697b-8c97-4041-8372-1be10444bf10)
사용자가 기록한 요리 모음

3. AI 분석 (텍스트/이미지)
![AI요약화면](https://github.com/user-attachments/assets/bbf5aae6-5d0e-4f7b-9ffe-7e48a184b26a)

4. 데이터 검토 및 수정
![확인화면](https://github.com/user-attachments/assets/9bec6c38-938a-4017-a6af-cc6fc08695a4)

5. 레시피 상세 정보
![레시피화면](https://github.com/user-attachments/assets/8f58be00-681e-4479-b242-079b72a4f38c)

6. 인터랙티브 쿠킹 & 타이머
![쿠킹화면](https://github.com/user-attachments/assets/442c1c33-4b27-4837-a56b-19b714d20246)

7. 요리 기록 저장 - 사진 및 메모 업로드
![요리기록저장화면](https://github.com/user-attachments/assets/ab2708f1-d294-4546-9c09-41cf2c59369e)

8. 개별 기록 상세
![기록화면](https://github.com/user-attachments/assets/83677eea-84f0-47a0-ae9f-e9e276631781)

---

## 🛠 Tech Stack

### Frontend & Backend
![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Database & Infrastructure
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Upstash](https://img.shields.io/badge/Upstash_Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

### AI
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

---

## 🧠 Development Insights

- **AI 바이브 코딩 (LLM Collaboration):** 단순한 코드 생성을 넘어, AI 모델과의 능동적인 페어 프로그래밍을 통해 복잡한 DB 스키마 설계 및 비즈니스 로직을 효율적으로 구축했습니다.
- **Serverless & Cloud Native:** Supabase, Vercel, Upstash를 활용한 서버리스 아키텍처를 통해 인프라 관리 비용을 최적화하고 확장성 있는 환경을 구성했습니다.

---

## 🚀 Roadmap

- [x] Web 서비스 MVP 개발 및 Vercel 배포 완료
- [x] Gemini AI 연동 레시피 자동 분석 기능 구현
- [ ] **Mobile App (iOS/Android) 출시 예정**
  - 모바일 사용자 편의성을 위한 하이브리드 앱 전환 및 네이티브 기능 도입
- [ ] 소셜 공유 기능을 통한 유저 간 레시피 커뮤니티 활성화
