# Cloudflare R2 CDN 캐시 규칙 설정 가이드

## 개요

Cloudflare R2는 기본적으로 egress(데이터 전송) 비용이 **무료**입니다. 하지만 R2 버킷에 커스텀 도메인을 연결하고 Cloudflare CDN 캐시 규칙을 설정하면, R2 자체의 읽기 요청(Class B operations)도 크게 줄일 수 있어 비용과 성능 모두 최적화됩니다.

---

## 1단계: R2 버킷에 커스텀 도메인 연결

Cloudflare 대시보드에서 R2 버킷에 커스텀 도메인을 연결합니다.

1. **Cloudflare Dashboard** > **R2** > 버킷 선택 > **Settings** > **Public access**
2. **Custom Domains** > **Connect Domain** 클릭
3. 도메인 입력 (예: `cdn.xplay.infoweb4.vip` 또는 `media.xplay.infoweb4.vip`)
4. Cloudflare가 자동으로 DNS CNAME 레코드를 생성합니다
5. SSL 인증서가 자동 발급됩니다 (약 1-5분 소요)

> **중요:** 커스텀 도메인을 연결해야 Cloudflare CDN 캐시가 활성화됩니다. `*.r2.dev` 도메인은 캐시를 지원하지 않습니다.

---

## 2단계: Cache Rules 설정 (영상 스트리밍 최적화)

Cloudflare Dashboard > **Rules** > **Cache Rules** 에서 규칙을 생성합니다.

### 규칙 1: 영상 파일 장기 캐시 (30일)

| 설정 항목 | 값 |
|-----------|-----|
| **Rule name** | Video Long Cache |
| **When** | URI Path contains `/videos/` OR File Extension is `mp4, webm, mov, avi, mkv` |
| **Then** | Cache eligibility: Eligible for cache |
| **Edge TTL** | Override origin, 30 days (2,592,000 seconds) |
| **Browser TTL** | Override origin, 7 days (604,800 seconds) |
| **Cache Key** | Include query string |

### 규칙 2: 이미지 파일 중기 캐시 (7일)

| 설정 항목 | 값 |
|-----------|-----|
| **Rule name** | Image Cache |
| **When** | File Extension is `jpg, jpeg, png, gif, webp, svg, ico` |
| **Then** | Cache eligibility: Eligible for cache |
| **Edge TTL** | Override origin, 7 days (604,800 seconds) |
| **Browser TTL** | Override origin, 1 day (86,400 seconds) |

### 규칙 3: 기타 정적 파일 캐시 (1일)

| 설정 항목 | 값 |
|-----------|-----|
| **Rule name** | Static Assets Cache |
| **When** | File Extension is `css, js, woff, woff2, ttf, eot` |
| **Then** | Cache eligibility: Eligible for cache |
| **Edge TTL** | Override origin, 1 day (86,400 seconds) |
| **Browser TTL** | Override origin, 4 hours (14,400 seconds) |

---

## 3단계: Page Rules (선택사항 - 추가 최적화)

Cloudflare Dashboard > **Rules** > **Page Rules** 에서 설정합니다.

```
URL: cdn.xplay.infoweb4.vip/videos/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 7 days
```

```
URL: cdn.xplay.infoweb4.vip/images/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 7 days
  - Browser Cache TTL: 1 day
```

---

## 4단계: Transform Rules (CORS 헤더 설정)

영상 스트리밍 시 CORS 문제를 방지하기 위해 응답 헤더를 설정합니다.

Cloudflare Dashboard > **Rules** > **Transform Rules** > **Modify Response Header**

| 헤더 | 값 |
|------|-----|
| `Access-Control-Allow-Origin` | `*` |
| `Access-Control-Allow-Methods` | `GET, HEAD, OPTIONS` |
| `Accept-Ranges` | `bytes` |

> `Accept-Ranges: bytes`는 영상 시크(seek) 기능에 필수적입니다.

---

## 5단계: 프로젝트 코드에서 R2 CDN URL 사용

### 환경변수 설정

```env
# .env.production
R2_PUBLIC_URL=https://cdn.xplay.infoweb4.vip
```

### 서버 코드 (r2Storage.ts)

프로젝트의 `server/r2Storage.ts`에서 이미 `R2_PUBLIC_URL` 환경변수를 사용하여 퍼블릭 URL을 생성합니다:

```typescript
// 업로드 후 반환되는 URL이 자동으로 CDN URL을 사용
const { url } = await r2Put("videos/intro.mp4", videoBuffer, "video/mp4");
// url = "https://cdn.xplay.infoweb4.vip/videos/intro.mp4"
```

### 프론트엔드 비디오 태그

```html
<video controls preload="metadata">
  <source src="https://cdn.xplay.infoweb4.vip/videos/intro.mp4" type="video/mp4">
</video>
```

---

## 6단계: 캐시 퍼지 (필요 시)

특정 파일의 캐시를 즉시 갱신해야 할 때:

### Cloudflare Dashboard에서 수동 퍼지
1. **Caching** > **Configuration** > **Purge Cache**
2. **Custom Purge** > URL 입력 > **Purge**

### API로 자동 퍼지

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://cdn.xplay.infoweb4.vip/videos/old-video.mp4"]}'
```

---

## 성능 모니터링

### Cloudflare Analytics에서 확인

- **Caching** > **Overview**: 캐시 히트율 확인 (목표: 90% 이상)
- **Analytics** > **Traffic**: 대역폭 절감량 확인
- **R2** > **Metrics**: R2 읽기 요청 수 확인

### 기대 효과

| 지표 | 캐시 미설정 | 캐시 설정 후 |
|------|------------|-------------|
| 영상 로딩 속도 | 1-3초 | 0.1-0.5초 |
| R2 읽기 요청 | 100% | 10-20% |
| 전 세계 접속 속도 | 가변적 | 일관적 (CDN 엣지) |
| 월간 비용 | R2 읽기 비용 | 거의 무료 |

---

## 요약 체크리스트

- [ ] R2 버킷에 커스텀 도메인 연결 (`cdn.xplay.infoweb4.vip`)
- [ ] Cache Rules 3개 생성 (영상 30일, 이미지 7일, 정적파일 1일)
- [ ] Transform Rules로 CORS + Accept-Ranges 헤더 설정
- [ ] `.env.production`에 `R2_PUBLIC_URL` 설정
- [ ] 캐시 히트율 90% 이상 달성 확인
