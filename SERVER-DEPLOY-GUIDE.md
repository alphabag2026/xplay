# XPLAY 텔레그램 봇 서버 배포 가이드

## 개요

XPLAY 프로젝트는 두 가지 구성 요소로 이루어져 있습니다.

| 구성 요소 | 설명 | 호스팅 |
|-----------|------|--------|
| **웹사이트 (메인)** | React + Express + tRPC 기반 웹 애플리케이션 | Manus 호스팅 (자동 배포) |
| **텔레그램 봇** | `telegram-bot.mjs` — 공지/뉴스/파트너 관리 봇 | 별도 서버에서 실행 필요 |

웹사이트는 Manus에서 Publish 버튼으로 자동 배포되며, 텔레그램 봇만 별도 서버에서 24시간 실행하면 됩니다.

---

## 1단계: 서버 준비

### 최소 요구 사항

| 항목 | 최소 사양 |
|------|----------|
| OS | Ubuntu 22.04+ / Debian 12+ |
| Node.js | v18 이상 (v22 권장) |
| RAM | 512MB 이상 |
| 디스크 | 1GB 이상 |
| 네트워크 | 인터넷 접속 가능 (Telegram API 통신) |

### Node.js 설치 (없는 경우)

```bash
# Node.js 22 설치 (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 설치 확인
node -v   # v22.x.x
npm -v    # 10.x.x
```

### PM2 설치 (프로세스 관리자)

```bash
sudo npm install -g pm2
```

---

## 2단계: 봇 파일 업로드

### 방법 A: wget으로 다운로드 (권장)

Manus에서 프로젝트를 zip으로 다운로드한 후 서버에 업로드합니다.

```bash
# 서버에서 실행
mkdir -p /opt/xplay-bot
cd /opt/xplay-bot

# zip 파일 다운로드 (Manus Code 패널에서 다운로드 URL 복사)
wget -O xplay-bot.zip "다운로드_URL"
unzip xplay-bot.zip

# 또는 필요한 파일만 직접 생성
```

### 방법 B: 필요한 파일만 수동 복사

텔레그램 봇 실행에 필요한 파일은 **단 1개**입니다.

```bash
mkdir -p /opt/xplay-bot
cd /opt/xplay-bot
```

`telegram-bot.mjs` 파일을 서버에 복사합니다. SCP, SFTP, 또는 직접 nano/vim으로 붙여넣기 가능합니다.

```bash
# SCP로 로컬에서 서버로 복사
scp telegram-bot.mjs user@서버IP:/opt/xplay-bot/

# 또는 서버에서 직접 편집
nano /opt/xplay-bot/telegram-bot.mjs
```

### 방법 C: GitHub에서 클론

Manus Settings > GitHub에서 코드를 GitHub에 내보낸 후:

```bash
cd /opt
git clone https://github.com/사용자명/xplay-revenue-site.git xplay-bot
cd xplay-bot
```

---

## 3단계: 의존성 설치

텔레그램 봇은 `dotenv` 패키지만 필요합니다.

```bash
cd /opt/xplay-bot
npm init -y
npm install dotenv
```

---

## 4단계: 환경변수 설정

`.env` 파일을 생성합니다.

```bash
cd /opt/xplay-bot
nano .env
```

아래 내용을 입력합니다.

```env
# 텔레그램 봇 토큰 (BotFather에서 발급)
TELEGRAM_BOT_TOKEN=여기에_봇_토큰_입력

# 텔레그램 봇 시크릿 (Manus Secrets에 설정한 값과 동일해야 함)
TELEGRAM_BOT_SECRET=여기에_시크릿_입력

# 웹사이트 URL (Manus에서 배포된 도메인)
WEBHOOK_URL=https://xplay.infoweb4.vip
```

**중요:** `TELEGRAM_BOT_SECRET` 값은 Manus 프로젝트의 Settings > Secrets에 설정된 값과 **반드시 동일**해야 합니다. 이 값이 일치하지 않으면 봇에서 보낸 요청이 서버에서 거부됩니다.

---

## 5단계: 봇 실행

### 테스트 실행

```bash
cd /opt/xplay-bot
node telegram-bot.mjs
```

정상 실행 시 아래와 같은 메시지가 표시됩니다.

```
🤖 XPLAY Announcement Bot (Extended) started
📡 Webhook URL: https://xplay.infoweb4.vip
📋 Commands: /공지, /pin, /뉴스, /삭제, /뉴스삭제, /파트너, /파트너삭제, /help
```

텔레그램에서 봇에게 `/help`를 보내 응답이 오는지 확인합니다.

### PM2로 24시간 실행 (권장)

```bash
cd /opt/xplay-bot

# PM2로 봇 시작
pm2 start telegram-bot.mjs --name xplay-bot

# 서버 재부팅 시 자동 시작 설정
pm2 startup
pm2 save

# 상태 확인
pm2 status

# 로그 확인
pm2 logs xplay-bot

# 봇 재시작
pm2 restart xplay-bot

# 봇 중지
pm2 stop xplay-bot
```

### systemd 서비스로 실행 (대안)

```bash
sudo nano /etc/systemd/system/xplay-bot.service
```

```ini
[Unit]
Description=XPLAY Telegram Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/xplay-bot
ExecStart=/usr/bin/node /opt/xplay-bot/telegram-bot.mjs
Restart=always
RestartSec=10
EnvironmentFile=/opt/xplay-bot/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable xplay-bot
sudo systemctl start xplay-bot

# 상태 확인
sudo systemctl status xplay-bot

# 로그 확인
sudo journalctl -u xplay-bot -f
```

---

## 6단계: 동작 확인

텔레그램에서 봇에게 아래 명령어를 순서대로 테스트합니다.

| 순서 | 명령어 | 예상 결과 |
|------|--------|----------|
| 1 | `/help` | 도움말 메시지 표시 |
| 2 | `/공지 테스트 공지` | "공지 내용을 입력해주세요" 응답 |
| 3 | `테스트 내용입니다` | "공지가 등록되었습니다!" 응답 |
| 4 | `/뉴스 https://example.com` | "뉴스가 등록되었습니다!" 응답 |
| 5 | `/파트너 홍길동` | "연락처 정보를 입력해주세요" 응답 |
| 6 | `텔레그램: @test` | "파트너가 등록되었습니다!" 응답 |
| 7 | 웹사이트 공지방 확인 | 등록한 공지/뉴스/파트너가 표시됨 |

---

## 문제 해결

### 봇이 응답하지 않는 경우

```bash
# 프로세스 확인
pm2 status

# 로그 확인
pm2 logs xplay-bot --lines 50

# 환경변수 확인
cat /opt/xplay-bot/.env
```

### "Unauthorized" 에러가 발생하는 경우

`TELEGRAM_BOT_SECRET` 값이 Manus 프로젝트 Secrets의 값과 일치하는지 확인합니다.

### "TELEGRAM_BOT_TOKEN is not set" 에러

`.env` 파일이 올바른 위치에 있는지, 값이 정확한지 확인합니다.

### 이미지 업로드가 실패하는 경우

`WEBHOOK_URL`이 올바른 도메인인지, HTTPS가 정상 작동하는지 확인합니다.

---

## 봇 업데이트 방법

코드가 변경된 경우 아래 절차로 업데이트합니다.

```bash
cd /opt/xplay-bot

# 새 파일 다운로드 또는 복사
wget -O telegram-bot.mjs "새_다운로드_URL"

# PM2 재시작
pm2 restart xplay-bot
```

---

## 아키텍처 요약

```
[텔레그램 사용자] → [Telegram API] → [텔레그램 봇 (서버)]
                                           ↓
                                    POST /api/telegram/*
                                           ↓
                              [XPLAY 웹사이트 (Manus)]
                                           ↓
                                    [데이터베이스]
                                           ↓
                              [웹사이트 방문자가 확인]
```

봇은 Telegram Long Polling 방식으로 메시지를 수신하고, XPLAY 웹사이트의 API(`/api/telegram/*`)를 호출하여 데이터를 등록합니다. 웹사이트 방문자는 공지방 게시판에서 등록된 내용을 확인할 수 있습니다.
