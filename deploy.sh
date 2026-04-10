#!/bin/bash

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}  ${GREEN}🚀 Script de Deploy - Faculdade${NC}                          ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}  ${YELLOW}faculdade.e258tech.tech${NC}                                ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}  ${YELLOW}api-facul.e258tech.tech${NC}                                ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para verificar erros
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro: $1${NC}"
        exit 1
    fi
}

# Verificar se Docker está instalado
echo -e "${YELLOW}📋 Verificando Docker...${NC}"
docker --version > /dev/null 2>&1
check_error "Docker não está instalado!"
echo -e "${GREEN}✅ Docker encontrado${NC}"

# Verificar se Docker Compose está instalado
echo -e "${YELLOW}📋 Verificando Docker Compose...${NC}"
docker compose version > /dev/null 2>&1 || docker-compose --version > /dev/null 2>&1
check_error "Docker Compose não está instalado!"
echo -e "${GREEN}✅ Docker Compose encontrado${NC}"

# Verificar se rede e258techmozambique existe
echo -e "${YELLOW}📋 Verificando rede e258techmozambique...${NC}"
docker network ls | grep -q e258techmozambique
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Rede e258techmozambique encontrada${NC}"
else
    echo -e "${RED}❌ Rede e258techmozambique não encontrada!${NC}"
    echo -e "${YELLOW}📝 Criar rede? (s/n)${NC}"
    read -r resposta
    if [ "$resposta" = "s" ]; then
        docker network create e258techmozambique
        check_error "Não foi possível criar a rede"
        echo -e "${GREEN}✅ Rede criada${NC}"
    else
        exit 1
    fi
fi

# Verificar ficheiro .env
echo -e "${YELLOW}📋 Verificando ficheiro .env...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}⚠️  Ficheiro .env não encontrado!${NC}"
    echo -e "${YELLOW}📝 Criar ficheiro .env? (s/n)${NC}"
    read -r resposta
    if [ "$resposta" = "s" ]; then
        cp .env.example .env 2>/dev/null || cat > .env << EOF
MYSQL_USER=faculdade_user
MYSQL_PASSWORD=faculdade_pass
MYSQL_DATABASE=faculdade
VITE_API_URL=https://api-facul.e258tech.tech
EOF
        echo -e "${GREEN}✅ Ficheiro .env criado! Edite-o com as suas configurações.${NC}"
        nano .env
    else
        exit 1
    fi
else
    echo -e "${GREEN}✅ Ficheiro .env encontrado${NC}"
fi

# Perguntar tipo de deploy
echo ""
echo -e "${YELLOW}📋 Tipo de deploy:${NC}"
echo "1) Build e Start (primeira vez)"
echo "2) Restart (atualização)"
echo "3) Parar serviços"
echo "4) Ver logs"
echo "5) Ver status"
echo ""
read -p "Escolha uma opção (1-5): " opcao

case $opcao in
    1)
        echo -e "\n${BLUE}🚀 Iniciando build e start...${NC}"
        
        # Pull latest code if in git repo
        if [ -d .git ]; then
            echo -e "${YELLOW}📥 Atualizando código...${NC}"
            git pull
        fi
        
        echo -e "${YELLOW}🔨 Building imagens...${NC}"
        docker compose build --no-cache
        check_error "Build falhou!"
        
        echo -e "${YELLOW}🚀 Iniciando serviços...${NC}"
        docker compose up -d
        check_error "Start falhou!"
        
        echo -e "\n${GREEN}✅ Deploy concluído com sucesso!${NC}"
        echo -e "\n${BLUE}📊 URLs:${NC}"
        echo -e "   Frontend: ${GREEN}https://faculdade.e258tech.tech${NC}"
        echo -e "   Backend:  ${GREEN}https://api-facul.e258tech.tech${NC}"
        echo -e "\n${YELLOW}⏳ Aguardando serviços iniciarem (60s)...${NC}"
        sleep 60
        
        echo -e "\n${BLUE}📋 Status dos serviços:${NC}"
        docker compose ps
        
        echo -e "\n${BLUE}📝 Para ver logs:${NC}"
        echo -e "   ${YELLOW}docker compose logs -f${NC}"
        ;;
        
    2)
        echo -e "\n${BLUE}🔄 Reiniciando serviços...${NC}"
        
        if [ -d .git ]; then
            echo -e "${YELLOW}📥 Atualizando código...${NC}"
            git pull
        fi
        
        docker compose down
        docker compose build
        docker compose up -d
        
        echo -e "\n${GREEN}✅ Serviços reiniciados!${NC}"
        ;;
        
    3)
        echo -e "\n${BLUE}🛑 Parando serviços...${NC}"
        docker compose down
        
        echo -e "${GREEN}✅ Serviços parados!${NC}"
        ;;
        
    4)
        echo -e "\n${BLUE}📝 Mostrando logs...${NC}"
        echo -e "${YELLOW}Ctrl+C para sair${NC}\n"
        docker compose logs -f
        ;;
        
    5)
        echo -e "\n${BLUE}📊 Status dos serviços:${NC}"
        docker compose ps
        
        echo -e "\n${BLUE}💾 Uso de recursos:${NC}"
        docker stats --no-stream faculdade-backend faculdade-frontend 2>/dev/null
        ;;
        
    *)
        echo -e "${RED}❌ Opção inválida!${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Deploy concluído!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
