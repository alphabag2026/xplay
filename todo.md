# TODO

- [x] 히어로 상단에 레퍼럴 등록 버튼 + 내 레퍼럴로 시작하기 CTA 추가
- [x] 하단 플라이휠 섹션에 시작하기(레퍼럴 탑재) + 공유하기 버튼 + 레퍼럴 입력 영역 추가
- [x] 페이지 공유 시 URL에 레퍼럴 자동 포함
- [x] 네이버 블로그 링크 자료실에 추가
- [x] 레퍼럴 모달 개선 - 공유 편의성 강화
- [ ] 수익 시뮬레이터 섹션 추가 - 투자금 입력 → 봇별 예상 수익 + 세금 계산
- [x] 브라우저 언어 자동 감지 - navigator.language 기반 자동 언어 설정 + localStorage 기억

## 공지방 게시판 + 텔레그램 봇 연동
- [x] 백엔드 업그레이드 (web-static → web-db-user)
- [x] 공지 DB 테이블 생성
- [x] 텔레그램 봇 백엔드 API (공지 CRUD + 이미지 업로드)
- [x] 공지방 게시판 프론트엔드 컴포넌트
- [x] 텔레그램 봇 스크립트 작성
- [x] 채팅 Pinned Message와 공지방 연동
- [x] 전체 테스트 (6/6 통과)
- [x] Fix: announcements.pinned 쿼리가 undefined 반환하는 버그 수정 (null 반환으로 변경)

## 뉴스/URL 공유 + 번역 뷰어
- [x] DB: newsLinks 테이블 (url, title, description, imageUrl, translatedContent)
- [x] 백엔드: URL 메타데이터 크롤링 + LLM 번역 API
- [x] 텔레그램 봇: /뉴스 URL 명령어 → URL 파싱 → 서버 등록
- [x] 프론트엔드: 뉴스 카드 미리보기 + 번역 뷰어 모달

## 텔레그램 삭제 기능
- [x] 텔레그램 봇: /삭제, /뉴스삭제 명령어 → 공지/뉴스 삭제
- [x] 백엔드: 삭제 API (soft delete)

## 좋아요 + 인기 공지
- [x] DB: announcementLikes 테이블
- [x] 백엔드: 좋아요 토글 API + 인기순 정렬
- [x] 프론트엔드: 좋아요 버튼 + 인기 공지 배지 (HOT)

## 검색 기능
- [x] 백엔드: 제목/내용 기반 검색 API
- [x] 프론트엔드: 검색바 + 결과 필터링

## 댓글 + 텔레그램 알림
- [x] DB: announcementComments 테이블
- [x] 백엔드: 댓글 CRUD API
- [x] 텔레그램 봇: 새 댓글 시 텔레그램 알림 전송
- [x] 프론트엔드: 댓글 UI (작성/목록/접기펼치기)

## 소통 파트너 섹션
- [x] DB: communicationPartners 테이블 (name, phone, telegram, kakao, whatsapp, wechat)
- [x] 백엔드: 소통 파트너 CRUD API
- [x] 텔레그램 봇: /파트너, /파트너삭제 명령어로 등록/삭제
- [x] 프론트엔드: 소통 파트너 카드 섹션 (연락처 버튼들)

## 백오피스 + Cloudflare R2 + Vultr 자체 서버 배포
- [x] Cloudflare R2 스토리지 연동 모듈 (이미지/영상 업로드)
- [x] R2 환경변수 설정 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL)
- [x] 백오피스 백엔드 API (관리자 인증 + 공지/뉴스/파트너/미디어 CRUD)
- [x] 백오피스 대시보드 UI (통계, 최근 활동)
- [x] 백오피스 공지 관리 페이지 (목록/생성/수정/삭제/고정)
- [x] 백오피스 뉴스 관리 페이지 (목록/생성/삭제)
- [x] 백오피스 소통 파트너 관리 페이지 (목록/생성/수정/삭제)
- [x] 백오피스 미디어 관리 페이지 (이미지/영상 R2 업로드/삭제)
- [x] Vultr 자체 서버 배포 스크립트 (Docker Compose)
- [x] Dockerfile + docker-compose.yml 작성
- [x] Nginx 리버스 프록시 + SSL 설정
- [x] 배포 가이드 문서 업데이트
- [x] 전체 테스트 (14/14 통과)

## 부관리자(sub-admin) 권한 시스템
- [x] DB 스키마: users.role에 'sub_admin' 추가
- [x] 백엔드: 부관리자 권한 미들웨어 (뉴스/파트너만 관리 가능)
- [x] 백오피스: 사용자 관리 페이지 (역할 변경)
- [x] 백오피스: 부관리자 접근 시 제한된 메뉴만 표시

## Let's Encrypt SSL 자동 발급
- [x] certbot 자동 설치 + 인증서 발급 스크립트 (setup-ssl.sh)
- [x] docker-compose에 certbot 서비스 추가 (12시간마다 자동 갱신)
- [x] Nginx 설정에 ACME challenge 경로 추가
- [x] SSL 인증서 자동 갱신 certbot 컨테이너 설정

## Vultr 배포 패키지
- [x] deploy.sh 업데이트 (방화벽 설정, SSL 안내 포함)
- [x] 전체 테스트 (21/21 통과)

## 감사 로그 (Audit Log)
- [x] DB: auditLogs 테이블 (userId, action, targetType, targetId, details, ip, createdAt)
- [x] 백엔드: 감사 로그 자동 기록 미들웨어 (관리자/부관리자 모든 작업)
- [x] 백엔드: 감사 로그 조회 API (필터링, 페이지네이션)
- [x] 백오피스: 감사 로그 페이지 (타임라인 뷰, 필터)

## 공지 예약 발행
- [x] DB: announcements 테이블에 scheduledAt, status 컨럼 추가
- [x] 백엔드: 예약 발행 스케줄러 (1분 간격 확인 → 자동 발행)
- [x] 백오피스: 공지 작성 시 예약 시간 선택 UI

## Cloudflare R2 CDN 캐시 규칙
- [x] R2 버킷에 Cache-Control 헤더 설정 코드
- [x] Cloudflare CDN 캐시 규칙 설정 가이드 문서 (R2-CDN-CACHE-GUIDE.md)
- [x] 비디오 스트리밍 최적화 (Range 요청 + CORS 헤더 가이드)

## 재사용 스킬 생성
- [x] skill-creator로 xplay-webdev 스킬 생성 (검증 통과)

## 내 연락처 삽입 (추천인 등록)
- [x] 사용자가 자신의 연락처(전화/텔레그램/카카오/왓츠앱/위챗) 등록 가능
- [x] 등록된 연락처가 소통 파트너 섹션에 표시
- [x] 내 연락처 등록을 로그인 없이 직접 이름/전화번호/간단소개 입력으로 변경

## CS 접수 시스템 (텔레그램 연동)
- [x] DB: CS 티켓 테이블 생성 (제목, 내용, 상태, 답변 등)
- [x] 백엔드: CS 접수 API + 답변 API
- [x] 프론트엔드: CS 문의 폼 + 내 문의 내역 확인 UI
- [x] 텔레그램 봇: CS 접수 알림 + 답변 명령어 (/cs, /cs답변)
- [x] 백오피스: CS 관리 페이지 (목록/답변/상태변경)

## 리더 추천 기능
- [x] DB: leaderReferrals 테이블 (추천자명, 연락처, 추천유형(본인/지인), 이전이력, 팀규모, 조직구성, 소개글 등)
- [x] 백엔드: 리더 추천 접수 API + 텔레그램 알림
- [x] 프론트엔드: 리더 추천 섹션 (최대 $10,000 보상 안내 + 추천 폼)
- [x] 백오피스: 리더 추천 관리 페이지 (목록/상태변경/메모)

## 웹 푸시 알림
- [ ] Service Worker 등록 + 푸시 구독 API
- [ ] 백엔드: 푸시 구독 저장 + 알림 발송 API
- [ ] 공지/뉴스 등록 시 자동 푸시 알림 발송
- [ ] 프론트엔드: 알림 허용 요청 UI

## 긴급 공지 띠 (Navbar 위 빨간 줄)
- [x] DB: urgentNotices 테이블 (내용, 회의유형, 회의링크, 활성여부, 시작/종료시간)
- [x] 백엔드: 긴급 공지 CRUD API + 활성 공지 조회 API
- [x] 텔레그램 봇: /긴급, /회의 명령어로 긴급 공지 등록 (Zoom, 텐센트회의, DeBox회의, 구글미팅)
- [x] 프론트엔드: Navbar 위 빨간 띠 컴포넌트 (한 줄 스크롤, 회의 링크 포함)
- [x] 백오피스: 긴급 공지 관리 (활성/비활성 토글)

## 자료실 언어별 콘텐츠 + 블로그 카드 UI 개선
- [x] DB: resources 테이블에 언어 태그(lang) + 썸네일(thumbnailUrl) + 설명(description) 필드 추가
- [x] 백엔드: 자료 목록 API에 언어별 필터링 추가 (사용자 언어에 맞는 콘텐츠만 반환)
- [x] 백엔드: 썸네일 이미지 업로드 API 추가
- [x] 백오피스: 자료 등록 시 언어 태그 선택 + 썸네일 업로드 UI
- [x] 프론트엔드: 블로그/썸네일 카드 레이아웃 (네이버 스타일 2열 그리드)
- [x] 프론트엔드: 사용자 언어에 맞는 콘텐츠만 자동 표시

## 섹션 순서 변경 + 리더추천 내용 수정
- [x] 리더추천 섹션: "10만불 최다보상" 내용 반영
- [x] 리더추천 + 소개자(레퍼럴) 섹션을 페이지 맨 아래(Footer 바로 위)로 이동
- [x] 긴급 공지(회의 한줄 띄)를 최상단(Navbar 위)으로 이동
