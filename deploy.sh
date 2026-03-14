#!/bin/bash
# ============================================
# XPLAY Revenue Site - Vultr 서버 배포 스크립트
# 사용법: bash deploy.sh
# ============================================

set -e

echo "🚀 XPLAY Revenue Site 배포 시작..."
echo "================================================"

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# 1. 시스템 업데이트 및 Docker 설치
echo -e "${YELLOW}[1/8] 시스템 업데이트 및 Docker 설치...${NC}"
if ! command -v docker &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release dnsutils
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker 설치 완료${NC}"
else
    echo -e "${GREEN}✅ Docker 이미 설치됨${NC}"
fi

# Docker Compose 설치
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    sudo apt-get install -y docker-compose-plugin
    echo -e "${GREEN}✅ Docker Compose 설치 완료${NC}"
else
    echo -e "${GREEN}✅ Docker Compose 이미 설치됨${NC}"
fi

# 2. 프로젝트 디렉토리 설정
echo -e "${YELLOW}[2/8] 프로젝트 디렉토리 설정...${NC}"
PROJECT_DIR="/opt/xplay-revenue-site"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR

# 3. 환경변수 확인
echo -e "${YELLOW}[3/8] 환경변수 확인...${NC}"
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ .env.production 파일이 없습니다!${NC}"
    echo ""
    echo "   아래 명령어로 템플릿을 복사하고 값을 입력해주세요:"
    echo -e "   ${CYAN}cp .env.production.example .env.production${NC}"
    echo -e "   ${CYAN}nano .env.production${NC}"
    echo ""
    echo "   필수 환경변수:"
    echo "   - DATABASE_URL: MySQL 연결 문자열"
    echo "   - TELEGRAM_BOT_TOKEN: 텔레그램 봇 토큰"
    echo "   - TELEGRAM_BOT_SECRET: 텔레그램 봇 시크릿"
    echo "   - R2_ACCOUNT_ID: Cloudflare R2 계정 ID"
    echo "   - R2_ACCESS_KEY_ID: R2 액세스 키"
    echo "   - R2_SECRET_ACCESS_KEY: R2 시크릿 키"
    echo "   - R2_BUCKET_NAME: R2 버킷 이름"
    echo "   - R2_PUBLIC_URL: R2 퍼블릭 URL"
    exit 1
fi
echo -e "${GREEN}✅ .env.production 확인됨${NC}"

# 4. 방화벽 설정
echo -e "${YELLOW}[4/8] 방화벽 설정...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 80/tcp 2>/dev/null || true
    sudo ufw allow 443/tcp 2>/dev/null || true
    echo -e "${GREEN}✅ 방화벽 포트 80, 443 개방${NC}"
else
    echo -e "${YELLOW}⚠️  ufw 미설치 - Vultr 방화벽에서 80, 443 포트를 직접 열어주세요${NC}"
fi

# 5. SSL 인증서 디렉토리 생성
echo -e "${YELLOW}[5/8] SSL 인증서 설정...${NC}"
mkdir -p nginx/ssl
if [ ! -f nginx/ssl/fullchain.pem ]; then
    echo -e "${YELLOW}  자체 서명 인증서를 생성합니다 (초기 부팅용)...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/privkey.pem \
        -out nginx/ssl/fullchain.pem \
        -subj "/CN=xplay.infoweb4.vip" 2>/dev/null
    echo -e "${GREEN}✅ 자체 서명 인증서 생성 완료${NC}"
    echo -e "${YELLOW}  ⚠️  배포 후 setup-ssl.sh를 실행하여 Let's Encrypt 인증서로 교체하세요${NC}"
else
    echo -e "${GREEN}✅ SSL 인증서 확인됨${NC}"
fi

# 6. Docker 이미지 빌드
echo -e "${YELLOW}[6/8] Docker 이미지 빌드...${NC}"
docker compose build --no-cache
echo -e "${GREEN}✅ Docker 이미지 빌드 완료${NC}"

# 7. 기존 컨테이너 정리 및 시작
echo -e "${YELLOW}[7/8] 서비스 시작...${NC}"
docker compose down 2>/dev/null || true
docker compose up -d
echo -e "${GREEN}✅ 서비스 시작 완료${NC}"

# 8. 상태 확인
echo -e "${YELLOW}[8/8] 서비스 상태 확인...${NC}"
sleep 10
docker compose ps

echo ""
echo "================================================"
echo -e "${GREEN}🎉 XPLAY Revenue Site 배포 완료!${NC}"
echo ""
echo -e "📌 접속 URL:"
echo -e "   HTTP:  ${CYAN}http://xplay.infoweb4.vip${NC}"
echo -e "   HTTPS: ${CYAN}https://xplay.infoweb4.vip${NC} (자체 서명 인증서)"
echo -e "   백오피스: ${CYAN}https://xplay.infoweb4.vip/admin${NC}"
echo ""
echo -e "📌 ${RED}중요: Let's Encrypt SSL 인증서 발급${NC}"
echo -e "   ${CYAN}bash setup-ssl.sh xplay.infoweb4.vip${NC}"
echo -e "   (DNS가 이 서버를 가리키고 있어야 합니다)"
echo ""
echo -e "📌 유용한 명령어:"
echo -e "   로그 확인:     ${CYAN}docker compose logs -f${NC}"
echo -e "   웹 로그:       ${CYAN}docker compose logs -f xplay-web${NC}"
echo -e "   봇 로그:       ${CYAN}docker compose logs -f xplay-telegram-bot${NC}"
echo -e "   서비스 중지:   ${CYAN}docker compose down${NC}"
echo -e "   서비스 재시작: ${CYAN}docker compose restart${NC}"
echo -e "   상태 확인:     ${CYAN}docker compose ps${NC}"
echo -e "   업데이트:      ${CYAN}docker compose build --no-cache && docker compose up -d${NC}"
echo "================================================"
