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

1. 레시피 모음

1-1. 내 레시피
![메인화면1](https://github.com/user-attachments/assets/c19693f2-e0fe-444d-8b64-6cbdd8cddd50)

1-2. 팔로잉 레시피
![메인화면2](https://github.com/user-attachments/assets/8b0dc855-0b6e-45c7-9fda-b070d431cfa8)

1-3. 전체 레시피 (전체 공개 레시피 한정)
![메인화면3](https://github.com/user-attachments/assets/27ff3863-bd41-4466-8fe0-0ae89d373e56)

2. 요리 기록 타임라인 (내부 탭은 1번과 동일)
![메인화면4](https://github.com/user-attachments/assets/78ea65ab-16d4-474f-afce-692654e0ee09)

3. 친구(맞팔로우) 목록
![메인화면5](https://github.com/user-attachments/assets/859a94c7-b0ee-42e1-88f7-e30a38fc6870)

4. AI 분석

4-1. 텍스트 분석
![AI요약화면1](https://github.com/user-attachments/assets/426b1454-b056-427f-8579-4132453f0137)

4-2. 이미지 분석
![AI요약화면2](https://github.com/user-attachments/assets/e14f3997-5055-45e5-b4d2-7624d16c301b)

4-3. 데이터 검토 및 수정
![확인화면](https://github.com/user-attachments/assets/b8824e80-96b1-4410-85cb-bb22c4c25c6b)

5. 레시피 상세 정보 - 북마크 기능
![레시피화면](https://github.com/user-attachments/assets/2db3dcb0-ef4e-4f88-ad59-76890e6205ec)

6. 인터랙티브 쿠킹 & 타이머
![쿠킹화면](https://github.com/user-attachments/assets/442c1c33-4b27-4837-a56b-19b714d20246)

7. 요리 기록 저장
![기록저장화면](https://github.com/user-attachments/assets/c941d633-168a-4390-9e0d-3c4811e3968b)

8. 개별 기록 상세 - 반응 남기기
![기록상세화면](https://github.com/user-attachments/assets/7e6860e9-33d2-4e73-9076-8727f3b0f782)

9. 유저 프로필

9-1. 프로필
![프로필화면](https://github.com/user-attachments/assets/89d67b5e-308a-4a5f-afdc-749c1287e731)

9-2. 북마크 레시피
![프로필화면](https://github.com/user-attachments/assets/837dfd17-a298-4f84-9db4-633e0875a42b)

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
