# TODO

- [x] 히어로 상단에 레퍼럴 등록 버튼 + 내 레퍼럴로 시작하기 CTA 추가
- [x] 하단 플라이휠 섹션에 시작하기(레퍼럴 탑재) + 공유하기 버튼 + 레퍼럴 입력 영역 추가
- [x] 페이지 공유 시 URL에 레퍼럴 자동 포함
- [x] 네이버 블로그 링크 자료실에 추가
- [x] 레퍼럴 모달 개선 - 공유 편의성 강화
- [ ] 수익 시뮬레이터 섹션 추가 - 투자금 입력 → 봇별 예상 수익 + 세금 계산
- [ ] 브라우저 언어 자동 감지 - navigator.language 기반 자동 언어 설정

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
