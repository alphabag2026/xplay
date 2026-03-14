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
NC='\033[0m'

# 1. 시스템 업데이트 및 Docker 설치
echo -e "${YELLOW}[1/7] 시스템 업데이트 및 Docker 설치...${NC}"
if ! command -v docker &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
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
echo -e "${YELLOW}[2/7] 프로젝트 디렉토리 설정...${NC}"
PROJECT_DIR="/opt/xplay-revenue-site"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR

# 3. 환경변수 확인
echo -e "${YELLOW}[3/7] 환경변수 확인...${NC}"
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ .env.production 파일이 없습니다!${NC}"
    echo "   .env.production.example을 복사하여 값을 입력해주세요:"
    echo "   cp .env.production.example .env.production"
    echo "   nano .env.production"
    exit 1
fi
echo -e "${GREEN}✅ .env.production 확인됨${NC}"

# 4. SSL 인증서 디렉토리 생성
echo -e "${YELLOW}[4/7] SSL 인증서 디렉토리 설정...${NC}"
mkdir -p nginx/ssl
if [ ! -f nginx/ssl/fullchain.pem ]; then
    echo -e "${YELLOW}⚠️  SSL 인증서가 없습니다. 자체 서명 인증서를 생성합니다...${NC}"
    echo "   (프로덕션에서는 Let's Encrypt 사용을 권장합니다)"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/privkey.pem \
        -out nginx/ssl/fullchain.pem \
        -subj "/CN=xplay.infoweb4.vip" 2>/dev/null
    echo -e "${GREEN}✅ 자체 서명 인증서 생성 완료${NC}"
else
    echo -e "${GREEN}✅ SSL 인증서 확인됨${NC}"
fi

# 5. Docker 이미지 빌드
echo -e "${YELLOW}[5/7] Docker 이미지 빌드...${NC}"
docker compose build --no-cache
echo -e "${GREEN}✅ Docker 이미지 빌드 완료${NC}"

# 6. 기존 컨테이너 정리 및 시작
echo -e "${YELLOW}[6/7] 서비스 시작...${NC}"
docker compose down 2>/dev/null || true
docker compose up -d
echo -e "${GREEN}✅ 서비스 시작 완료${NC}"

# 7. 상태 확인
echo -e "${YELLOW}[7/7] 서비스 상태 확인...${NC}"
sleep 10
docker compose ps

echo ""
echo "================================================"
echo -e "${GREEN}🎉 XPLAY Revenue Site 배포 완료!${NC}"
echo ""
echo "📌 접속 URL:"
echo "   - HTTP:  http://xplay.infoweb4.vip"
echo "   - HTTPS: https://xplay.infoweb4.vip"
echo "   - 백오피스: https://xplay.infoweb4.vip/admin"
echo ""
echo "📌 유용한 명령어:"
echo "   - 로그 확인:    docker compose logs -f"
echo "   - 서비스 중지:  docker compose down"
echo "   - 서비스 재시작: docker compose restart"
echo "   - 상태 확인:    docker compose ps"
echo ""
echo "📌 Let's Encrypt SSL 설정:"
echo "   sudo apt install certbot"
echo "   sudo certbot certonly --webroot -w /var/www/certbot -d xplay.infoweb4.vip"
echo "   cp /etc/letsencrypt/live/xplay.infoweb4.vip/fullchain.pem nginx/ssl/"
echo "   cp /etc/letsencrypt/live/xplay.infoweb4.vip/privkey.pem nginx/ssl/"
echo "   docker compose restart nginx"
echo "================================================"
