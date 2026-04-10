#!/bin/bash

# Script para descobrir redes Docker automaticamente

echo "╔════════════════════════════════════════════════╗"
echo "║  🔍 Descobrir Redes Docker                     ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# 1. Listar todas as redes
echo "📋 REDES EXISTENTES:"
echo "────────────────────────────────────────────────"
docker network ls --format "table {{.Name}}\t{{.Driver}}\t{{.Scope}}"
echo ""

# 2. Procurar Traefik
echo "🔍 TRAEFIK:"
echo "────────────────────────────────────────────────"
TRAEFIK_CONTAINER=$(docker ps | grep -i traefik | awk '{print $NF}' | head -n1)
if [ -n "$TRAEFIK_CONTAINER" ]; then
    echo "✅ Container Traefik encontrado: $TRAEFIK_CONTAINER"
    echo ""
    echo "📡 Redes do Traefik:"
    docker inspect $TRAEFIK_CONTAINER --format='{{range $key, $value := .NetworkSettings.Networks}}  - {{$key}}{{println}}{{end}}'
else
    echo "❌ Container Traefik não encontrado"
fi
echo ""

# 3. Procurar MySQL
echo "🔍 MYSQL:"
echo "────────────────────────────────────────────────"
MYSQL_CONTAINER=$(docker ps | grep -i mysql | awk '{print $NF}' | head -n1)
if [ -n "$MYSQL_CONTAINER" ]; then
    echo "✅ Container MySQL encontrado: $MYSQL_CONTAINER"
    echo ""
    echo "📡 Redes do MySQL:"
    docker inspect $MYSQL_CONTAINER --format='{{range $key, $value := .NetworkSettings.Networks}}  - {{$key}}{{println}}{{end}}'
else
    echo "❌ Container MySQL não encontrado"
fi
echo ""

# 4. Gerar sugestão de configuração
echo "💡 SUGESTÃO DE CONFIGURAÇÃO:"
echo "────────────────────────────────────────────────"
echo ""

# Sugestão para Traefik
TRAEFIK_NET=$(docker inspect $(docker ps | grep -i traefik | awk '{print $NF}' | head -n1) --format='{{range $key, $value := .NetworkSettings.Networks}}{{$key}}{{println}}{{end}}' | grep -v "none\|host" | head -n1)
if [ -n "$TRAEFIK_NET" ]; then
    echo "TRAEFIK_NETWORK=$TRAEFIK_NET"
else
    echo "# TRAEFIK_NETWORK=<nome-da-rede-do-traefik>"
fi

# Sugestão para MySQL
MYSQL_NET=$(docker inspect $(docker ps | grep -i mysql | awk '{print $NF}' | head -n1) --format='{{range $key, $value := .NetworkSettings.Networks}}{{$key}}{{println}}{{end}}' | grep -v "none\|host" | head -n1)
if [ -n "$MYSQL_NET" ]; then
    echo "MYSQL_NETWORK=$MYSQL_NET"
else
    echo "# MYSQL_NETWORK=<nome-da-rede-do-mysql>"
fi

echo ""
echo "────────────────────────────────────────────────"
echo ""
echo "📝 Copie estas linhas para o ficheiro .env"
echo ""

# 5. Guardar configuração
echo "💾 Guardar configuração automaticamente? (s/n)"
read -r resposta

if [ "$resposta" = "s" ]; then
    cat > redes.env << EOF
# Configuração automática gerada em $(date)
TRAEFIK_NETWORK=${TRAEFIK_NET:-traefik-public}
MYSQL_NETWORK=${MYSQL_NET:-mysql-network}
EOF
    echo "✅ Configuração guardada em: redes.env"
    echo ""
    echo "Para usar:"
    echo "  cp redes.env .env"
    echo "  nano .env  # editar outras variáveis"
fi
