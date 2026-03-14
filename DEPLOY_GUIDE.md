# XPLAY 배포 가이드: Oracle Cloud Free Tier + Cloudflare

## 아키텍처 개요

```
[사용자] → [Cloudflare CDN/WAF] → [Oracle Cloud VM] → [Nginx + Docker]
                                                        ├── Frontend (React SPA)
                                                        ├── Telegram Bot (Node.js)
                                                        └── Media Storage (S3/OCI Object Storage)
```

**목표:** 동시접속 1만명 이상 커버

---

## 1단계: Oracle Cloud Free Tier 인스턴스 생성

### 1.1 Oracle Cloud 계정 생성
1. https://cloud.oracle.com 접속
2. Free Tier 계정 생성 (신용카드 필요하지만 과금 안됨)

### 1.2 VM 인스턴스 생성
- **Shape:** VM.Standard.A1.Flex (ARM 기반, 무료)
- **OCPU:** 4 (Free Tier 최대)
- **Memory:** 24GB (Free Tier 최대)
- **Boot Volume:** 200GB (Free Tier 최대)
- **OS:** Ubuntu 22.04 LTS (aarch64)
- **Region:** 서울 (ap-seoul-1) 또는 도쿄 (ap-tokyo-1)

> ARM 인스턴스는 x86보다 성능 대비 효율이 높아 1만명 동시접속에 적합

### 1.3 네트워크 설정
```bash
# Oracle Cloud Console에서 Security List 설정
# Ingress Rules 추가:
# - TCP 80 (HTTP)
# - TCP 443 (HTTPS)
# - TCP 22 (SSH)
```

---

## 2단계: 서버 초기 설정

### 2.1 SSH 접속 및 기본 설정
```bash
ssh -i <private_key> ubuntu@<서버_IP>

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Docker Compose 설치
sudo apt install docker-compose-plugin -y

# Nginx 설치
sudo apt install nginx -y

# Node.js 20 설치 (Telegram Bot용)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2
```

### 2.2 방화벽 설정
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

---

## 3단계: 프로젝트 빌드 및 배포

### 3.1 프로젝트 빌드
```bash
# 로컬에서 빌드
cd /home/ubuntu/xplay-revenue-site
npm run build

# 빌드 결과물을 서버로 전송
scp -r dist/* ubuntu@<서버_IP>:/var/www/xplay/
```

### 3.2 Nginx 설정
```nginx
# /etc/nginx/sites-available/xplay
server {
    listen 80;
    server_name xplay.infoweb4.vip;

    root /var/www/xplay;
    index index.html;

    # Gzip 압축 (성능 최적화)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # 캐시 설정 (정적 자산)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # SPA 라우팅
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 프록시 (텔레그램 봇 서버)
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket 프록시 (채팅)
    location /ws {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/xplay /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4단계: Cloudflare 설정

### 4.1 도메인 추가
1. Cloudflare 대시보드 → "Add a Site"
2. 도메인 입력: `xplay.infoweb4.vip`
3. Free 플랜 선택

### 4.2 DNS 설정
```
Type    Name    Content              Proxy
A       @       <Oracle_Cloud_IP>    Proxied (주황색 구름)
A       www     <Oracle_Cloud_IP>    Proxied
CNAME   api     <Oracle_Cloud_IP>    Proxied
```

### 4.3 SSL/TLS 설정
- SSL/TLS → Overview → **Full (Strict)** 선택
- Edge Certificates → Always Use HTTPS: **ON**
- Minimum TLS Version: **TLS 1.2**

### 4.4 성능 최적화 (1만명 동시접속 대응)
```
Speed → Optimization:
- Auto Minify: JavaScript, CSS, HTML 모두 ON
- Brotli: ON
- Early Hints: ON
- Rocket Loader: ON (주의: SPA에서 문제 시 OFF)

Caching → Configuration:
- Caching Level: Standard
- Browser Cache TTL: 1 month
- Always Online: ON

Page Rules (무료 3개):
1. *xplay.infoweb4.vip/assets/*
   → Cache Level: Cache Everything
   → Edge Cache TTL: 1 month

2. *xplay.infoweb4.vip/*.js
   → Cache Level: Cache Everything
   → Edge Cache TTL: 1 month

3. *xplay.infoweb4.vip/*.css
   → Cache Level: Cache Everything
   → Edge Cache TTL: 1 month
```

### 4.5 보안 설정
```
Security → WAF:
- Security Level: Medium
- Challenge Passage: 30 minutes
- Browser Integrity Check: ON

Under Attack Mode:
- DDoS 공격 시 활성화 (평소 OFF)

Bot Fight Mode: ON
```

---

## 5단계: Telegram Bot 서버 (미디어 업로드 + 튜토리얼 관리)

### 5.1 봇 생성
1. Telegram에서 @BotFather 검색
2. `/newbot` 명령으로 봇 생성
3. API Token 저장

### 5.2 봇 서버 코드 (Node.js)
```bash
mkdir -p /opt/xplay-bot
cd /opt/xplay-bot
npm init -y
npm install telegraf express multer sharp
```

```javascript
// /opt/xplay-bot/index.js
const { Telegraf } = require('telegraf');
const express = require('express');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

const MEDIA_DIR = '/var/www/xplay/media';
const DATA_DIR = '/opt/xplay-bot/data';

// 미디어 디렉토리 생성
fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

// 텔레그램에서 사진 수신
bot.on('photo', async (ctx) => {
  const photo = ctx.message.photo[ctx.message.photo.length - 1];
  const file = await ctx.telegram.getFile(photo.file_id);
  const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
  
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = `${Date.now()}_${photo.file_id}.jpg`;
  fs.writeFileSync(path.join(MEDIA_DIR, filename), buffer);
  
  // 미디어 목록 업데이트
  updateMediaList({ type: 'image', filename, caption: ctx.message.caption || '' });
  ctx.reply(`✅ 이미지 업로드 완료: ${filename}`);
});

// 텔레그램에서 영상 수신
bot.on('video', async (ctx) => {
  const video = ctx.message.video;
  const file = await ctx.telegram.getFile(video.file_id);
  const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
  
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = `${Date.now()}_${video.file_id}.mp4`;
  fs.writeFileSync(path.join(MEDIA_DIR, filename), buffer);
  
  updateMediaList({ type: 'video', filename, caption: ctx.message.caption || '' });
  ctx.reply(`✅ 영상 업로드 완료: ${filename}`);
});

// 튜토리얼 유튜브 영상 추가 명령
// 형식: /tutorial <youtube_url> <ko:제목> <en:Title> <zh:标题> <ja:タイトル>
bot.command('tutorial', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) {
    return ctx.reply('사용법: /tutorial <youtube_url> <ko:제목> <en:Title> ...');
  }
  
  const youtubeUrl = args[0];
  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeId) return ctx.reply('❌ 유효하지 않은 YouTube URL');
  
  const titles = {};
  args.slice(1).forEach(arg => {
    const [lang, ...titleParts] = arg.split(':');
    if (lang && titleParts.length) {
      titles[lang] = titleParts.join(':');
    }
  });
  
  updateTutorialList({ youtubeId, titles });
  ctx.reply(`✅ 튜토리얼 추가 완료: ${youtubeId}`);
});

function extractYoutubeId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s]+)/);
  return match ? match[1] : null;
}

function updateMediaList(item) {
  const listPath = path.join(DATA_DIR, 'media.json');
  const list = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath)) : [];
  list.unshift({ ...item, timestamp: Date.now() });
  fs.writeFileSync(listPath, JSON.stringify(list, null, 2));
}

function updateTutorialList(item) {
  const listPath = path.join(DATA_DIR, 'tutorials.json');
  const list = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath)) : [];
  list.push({ ...item, timestamp: Date.now() });
  fs.writeFileSync(listPath, JSON.stringify(list, null, 2));
}

// API 엔드포인트
app.get('/media', (req, res) => {
  const listPath = path.join(DATA_DIR, 'media.json');
  const list = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath)) : [];
  res.json(list);
});

app.get('/tutorials', (req, res) => {
  const listPath = path.join(DATA_DIR, 'tutorials.json');
  const list = fs.existsSync(listPath) ? JSON.parse(fs.readFileSync(listPath)) : [];
  res.json(list);
});

// 정적 미디어 파일 서빙
app.use('/files', express.static(MEDIA_DIR));

app.listen(3001, () => console.log('Bot API server running on port 3001'));
bot.launch().then(() => console.log('Telegram bot started'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

### 5.3 PM2로 실행
```bash
cd /opt/xplay-bot
BOT_TOKEN=<your_bot_token> pm2 start index.js --name xplay-bot
pm2 save
pm2 startup
```

---

## 6단계: 성능 최적화 (1만명 동시접속)

### 6.1 Nginx 워커 최적화
```nginx
# /etc/nginx/nginx.conf
worker_processes auto;  # CPU 코어 수에 맞게 자동
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    keepalive_timeout 65;
    keepalive_requests 1000;
    
    # 파일 캐시
    open_file_cache max=10000 inactive=30s;
    open_file_cache_valid 60s;
    open_file_cache_min_uses 2;
    
    # 버퍼 최적화
    client_body_buffer_size 16k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;
    client_max_body_size 50m;
}
```

### 6.2 시스템 커널 최적화
```bash
# /etc/sysctl.conf에 추가
sudo tee -a /etc/sysctl.conf << EOF
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_fin_timeout = 10
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 1024 65535
fs.file-max = 2097152
EOF

sudo sysctl -p
```

### 6.3 Cloudflare + Nginx 조합으로 1만명 커버 가능한 이유
| 구성 요소 | 역할 | 동시접속 기여 |
|-----------|------|-------------|
| Cloudflare CDN | 정적 자산 캐싱, 전 세계 엣지 서버 | 95% 트래픽 처리 |
| Cloudflare WAF | DDoS 방어, 봇 차단 | 악성 트래픽 차단 |
| Nginx | 리버스 프록시, 압축, 캐싱 | 나머지 5% 처리 |
| Oracle Cloud ARM | 4 OCPU, 24GB RAM | API/Bot 처리 |

> **핵심:** SPA(Single Page Application)는 한 번 로드 후 서버 요청이 거의 없음.
> Cloudflare가 정적 자산을 캐싱하므로 실제 서버 부하는 API 요청만 처리.
> 이 구조로 **1만~5만명 동시접속** 충분히 커버 가능.

---

## 7단계: 모니터링

### 7.1 서버 모니터링
```bash
# htop 설치
sudo apt install htop -y

# PM2 모니터링
pm2 monit

# Nginx 상태 확인
sudo systemctl status nginx
```

### 7.2 Cloudflare Analytics
- Cloudflare 대시보드 → Analytics → Traffic
- 실시간 방문자 수, 대역폭, 캐시 히트율 확인

---

## 빠른 배포 체크리스트

- [ ] Oracle Cloud Free Tier 인스턴스 생성 (ARM A1.Flex 4 OCPU / 24GB)
- [ ] Docker, Nginx, Node.js 설치
- [ ] 프로젝트 빌드 후 서버 전송
- [ ] Nginx 설정 및 SSL 인증서
- [ ] Cloudflare 도메인 연결 및 DNS 설정
- [ ] Cloudflare SSL Full (Strict) 설정
- [ ] Cloudflare 캐싱 및 성능 최적화
- [ ] Telegram Bot 설정 및 PM2 실행
- [ ] 커널 파라미터 최적화
- [ ] 부하 테스트 실행
