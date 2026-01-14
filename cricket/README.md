### 🛠 Tech Stack
**Frontend** ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Backend** ![Spring Boot](https://img.shields.io/badge/spring%20boot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Oracle](https://img.shields.io/badge/oracle-%23F80000.svg?style=for-the-badge&logo=oracle&logoColor=white)

**Tools & Others** ![PortOne](https://img.shields.io/badge/PortOne-FF5C00?style=for-the-badge&logo=target&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

# 🏎️ HCar: 중고차 거래 커머스 플랫폼

> **자동차를 향한 열정으로 구현한 현대적 중고차 매매 시스템**

---

### 👥 Team Members
| <img src="https://github.com/KD-commits-bit.png" width="100"> | <img src="https://github.com/grrr-h.png" width="100"> |
| :---: | :---: |
| **[서경덕](https://github.com/KD-commits-bit)** | **[홍태규](https://github.com/grrr-h)** |
| Frontend / Backend | Frontend / Backend |

---

## 1. 프로젝트 개요
자동차에 대한 팀원의 열정에서 시작된 **'HCar'** 프로젝트는 단순한 커머스 기능을 넘어, 학습한 기술 스택을 극한까지 활용해보는 것을 목표로 했습니다. 중고차 매매라는 도메인에 맞춰 비즈니스 로직을 설계하고, 이를 현대적인 웹 아키텍처로 구현하는 데 집중했습니다.

## 2. SPA 구현과 상태 관리의 깨달음
저희의 핵심 목표는 웹페이지를 **Single Page Application(SPA)** 구조로 구현하는 것이었습니다. 
- **목적:** 페이지 이동 시 네비게이션 바 등 공통 레이아웃 유지 및 JSON 형태의 비동기 데이터 교환을 통한 리소스 최적화.
- **기술:** 모든 API 통신에 `Axios` 라이브러리 활용.

**[Trial & Error]** 서버 응답은 정상이나 화면이 즉각 갱신되지 않는 문제를 겪으며 **useState, useEffect 등 React Hook**과 컴포넌트 라이프사이클의 관계를 깊이 이해하게 되었습니다. 결과적으로 CSR 환경에서의 명확한 데이터 흐름을 정립할 수 있었습니다.

## 3. 실무 기능 도전: 결제 시스템 & OAuth
### 💳 포트원(PortOne) API 연동
- 실제 커머스 흐름 완성을 위해 카드 결제 시스템 구현.
- 결제 요청 → 승인 → 서버 DB 기록 프로세스 직접 설계.
- 프론트엔드, 백엔드, 외부 PG사 간의 상호작용 체득.

### 🔐 OAuth 2.0 소셜 로그인
- 정보처리기사 실기 시험에서 접한 이론을 실제 서비스에 이식.
- 공식 문서를 참고하여 인증 코드 발급 및 토큰 처리 로직 직접 구현.
- 보안 인증 구조에 대한 이해도 확장.

## 4. 협업의 진화: SVN에서 Git으로
기존의 SVN 방식을 탈피하고, 현대적인 협업을 위해 **Git**을 전격 도입했습니다.
- **도전:** 초기 브랜치 전략 미흡 및 충돌(Conflict) 발생.
- **해결:** 팀원들과의 지속적인 소통을 통해 Git Flow 익히기.
- **성과:** 효율적인 코드 관리와 협업의 즐거움을 깨닫는 핵심적인 계기.

## 5. 성과 및 마무리
비록 완벽한 서비스는 아닐지라도, **완전한 SPA 구조 구현**과 **효율적인 Git 협업 체계 확립**이라는 두 가지 큰 성과를 거두었습니다. ‘HCar’는 웹 개발의 기획부터 구현, 협업까지 전 과정을 경험하게 해준 소중한 프로젝트였으며, 어떤 복잡한 시스템 앞에서도 도전할 수 있는 자신감을 주었습니다.
