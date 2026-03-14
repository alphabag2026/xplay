#!/bin/bash
# ============================================
# XPLAY - Let's Encrypt SSL 자동 발급 스크립트
# 사용법: bash setup-ssl.sh [도메인]
# 예시:   bash setup-ssl.sh xplay.infoweb4.vip
# ============================================

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

DOMAIN=${1:-"xplay.infoweb4.vip"}
EMAIL=${2:-"admin@${DOMAIN}"}
PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)

echo -e "${CYAN}🔒 XPLAY Let's Encrypt SSL 설정${NC}"
echo "================================================"
echo -e "도메인: ${GREEN}${DOMAIN}${NC}"
echo -e "이메일: ${GREEN}${EMAIL}${NC}"
echo -e "프로젝트: ${GREEN}${PROJECT_DIR}${NC}"
echo "================================================"
echo ""

# 1. 사전 조건 확인
echo -e "${YELLOW}[1/6] 사전 조건 확인...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker가 설치되어 있지 않습니다. deploy.sh를 먼저 실행하세요.${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null 2>&1; then
    echo -e "${RED}❌ Docker Compose가 설치되어 있지 않습니다.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker & Docker Compose 확인됨${NC}"

# 2. DNS 확인
echo -e "${YELLOW}[2/6] DNS 확인...${NC}"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "unknown")
DNS_IP=$(dig +short ${DOMAIN} 2>/dev/null || nslookup ${DOMAIN} 2>/dev/null | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' || echo "unknown")

echo -e "  서버 IP: ${CYAN}${SERVER_IP}${NC}"
echo -e "  DNS IP:  ${CYAN}${DNS_IP}${NC}"

if [ "$SERVER_IP" != "unknown" ] && [ "$DNS_IP" != "unknown" ] && [ "$SERVER_IP" != "$DNS_IP" ]; then
    echo -e "${RED}⚠️  경고: DNS IP와 서버 IP가 다릅니다!${NC}"
    echo -e "   DNS가 이 서버를 가리키도록 설정해주세요."
    read -p "   계속 진행하시겠습니까? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "취소되었습니다."
        exit 1
    fi
fi
echo -e "${GREEN}✅ DNS 확인 완료${NC}"

# 3. 임시 Nginx 설정 (HTTP only, certbot 인증용)
echo -e "${YELLOW}[3/6] 임시 HTTP 서버 설정 (인증서 발급용)...${NC}"

# 임시 nginx 설정 백업 및 생성
cp ${PROJECT_DIR}/nginx/nginx.conf ${PROJECT_DIR}/nginx/nginx.conf.bak

cat > ${PROJECT_DIR}/nginx/nginx-temp-http.conf << 'NGINX_TEMP'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name _;

        # Let's Encrypt ACME challenge
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Proxy all other requests to backend
        location / {
            proxy_pass http://xplay-web:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
NGINX_TEMP

# 임시 설정으로 nginx 재시작
docker compose -f ${PROJECT_DIR}/docker-compose.yml exec -T nginx sh -c "cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak" 2>/dev/null || true
docker cp ${PROJECT_DIR}/nginx/nginx-temp-http.conf xplay-nginx:/etc/nginx/nginx.conf 2>/dev/null || true
docker compose -f ${PROJECT_DIR}/docker-compose.yml exec -T nginx nginx -s reload 2>/dev/null || {
    echo -e "${YELLOW}  Nginx가 실행 중이 아닙니다. 서비스를 시작합니다...${NC}"
    # 임시로 SSL 없이 시작
    cp ${PROJECT_DIR}/nginx/nginx-temp-http.conf ${PROJECT_DIR}/nginx/nginx.conf
    docker compose -f ${PROJECT_DIR}/docker-compose.yml up -d nginx
    sleep 5
}

echo -e "${GREEN}✅ 임시 HTTP 서버 준비 완료${NC}"

# 4. Let's Encrypt 인증서 발급
echo -e "${YELLOW}[4/6] Let's Encrypt 인증서 발급...${NC}"

docker compose -f ${PROJECT_DIR}/docker-compose.yml run --rm certbot \
    certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d ${DOMAIN}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 인증서 발급 실패!${NC}"
    echo "   DNS가 이 서버를 가리키는지 확인하세요."
    echo "   방화벽에서 80번 포트가 열려있는지 확인하세요."
    # 원래 nginx 설정 복원
    cp ${PROJECT_DIR}/nginx/nginx.conf.bak ${PROJECT_DIR}/nginx/nginx.conf
    exit 1
fi

echo -e "${GREEN}✅ SSL 인증서 발급 완료${NC}"

# 5. Nginx 설정을 Let's Encrypt 인증서 사용으로 업데이트
echo -e "${YELLOW}[5/6] Nginx SSL 설정 업데이트...${NC}"

# 원래 nginx.conf 복원 후 SSL 경로 수정
cp ${PROJECT_DIR}/nginx/nginx.conf.bak ${PROJECT_DIR}/nginx/nginx.conf

# Let's Encrypt 인증서 경로로 전환
sed -i "s|# ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;|ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;|" ${PROJECT_DIR}/nginx/nginx.conf
sed -i "s|# ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;|ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;|" ${PROJECT_DIR}/nginx/nginx.conf
sed -i "s|ssl_certificate     /etc/nginx/ssl/fullchain.pem;|# ssl_certificate     /etc/nginx/ssl/fullchain.pem;|" ${PROJECT_DIR}/nginx/nginx.conf
sed -i "s|ssl_certificate_key /etc/nginx/ssl/privkey.pem;|# ssl_certificate_key /etc/nginx/ssl/privkey.pem;|" ${PROJECT_DIR}/nginx/nginx.conf

# 도메인 치환 (혹시 다른 도메인인 경우)
sed -i "s|server_name xplay.infoweb4.vip;|server_name ${DOMAIN};|g" ${PROJECT_DIR}/nginx/nginx.conf

echo -e "${GREEN}✅ Nginx SSL 설정 업데이트 완료${NC}"

# 6. 전체 서비스 재시작
echo -e "${YELLOW}[6/6] 전체 서비스 재시작...${NC}"

# 임시 파일 정리
rm -f ${PROJECT_DIR}/nginx/nginx-temp-http.conf
rm -f ${PROJECT_DIR}/nginx/nginx.conf.bak

docker compose -f ${PROJECT_DIR}/docker-compose.yml down
docker compose -f ${PROJECT_DIR}/docker-compose.yml up -d

sleep 10
docker compose -f ${PROJECT_DIR}/docker-compose.yml ps

echo ""
echo "================================================"
echo -e "${GREEN}🎉 SSL 설정 완료!${NC}"
echo ""
echo -e "📌 접속 URL:"
echo -e "   ${CYAN}https://${DOMAIN}${NC}"
echo -e "   ${CYAN}https://${DOMAIN}/admin${NC} (백오피스)"
echo ""
echo -e "📌 인증서 정보:"
echo -e "   경로: /etc/letsencrypt/live/${DOMAIN}/"
echo -e "   자동 갱신: certbot 컨테이너가 12시간마다 자동 갱신"
echo ""
echo -e "📌 수동 갱신 (필요시):"
echo -e "   docker compose run --rm certbot renew"
echo -e "   docker compose exec nginx nginx -s reload"
echo ""
echo -e "📌 인증서 상태 확인:"
echo -e "   docker compose run --rm certbot certificates"
echo "================================================"
