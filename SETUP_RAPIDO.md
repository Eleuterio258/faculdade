# ⚡ Configuração Rápida - Deploy com Traefik e MySQL Externos

## 🚀 Setup em 3 Passos

### Passo 1: Descobrir Nomes das Redes

No servidor, executar:

```bash
# Dar permissão
chmod +x discover-networks.sh

# Executar script
./discover-networks.sh
```

Ou manualmente:

```bash
# Listar redes
docker network ls

# Ver rede do Traefik
docker ps | grep traefik
docker inspect <nome-traefik> | grep -A 5 Networks

# Ver rede do MySQL
docker ps | grep mysql  
docker inspect <nome-mysql> | grep -A 5 Networks
```

---

### Passo 2: Configurar .env

```bash
# Copiar exemplo
cp .env .env.backup

# Editar
nano .env
```

**Variáveis OBRIGATÓRIAS para alterar:**

```env
# NOMES DAS REDES - DESCOBRIR COM docker network ls
TRAEFIK_NETWORK=<nome-rede-traefik>
MYSQL_NETWORK=<nome-rede-mysql>

# MySQL - ajustar se necessário
MYSQL_HOST=mysql
MYSQL_USER=seu_user_mysql
MYSQL_PASSWORD=sua_password_mysql
MYSQL_DATABASE=faculdade
```

---

### Passo 3: Deploy

```bash
# Build e start
docker compose up -d --build

# Ver logs
docker compose logs -f

# Verificar status
docker compose ps
```

---

## ✅ Verificação

### 1. Containers a correr?

```bash
docker ps | grep faculdade
```

Deve mostrar:
- `faculdade-backend` 
- `faculdade-frontend`

### 2. URLs acessíveis?

```bash
# Frontend
curl -I https://faculdade.e258tech.tech

# Backend
curl -I https://api-facul.e258tech.tech/api/obras
```

Deve retornar `HTTP/2 200`

### 3. SSL funcional?

```bash
curl -vI https://faculdade.e258tech.tech 2>&1 | grep "SSL certificate"
```

Deve mostrar certificado válido.

### 4. Conexão MySQL?

```bash
# Ver logs do backend
docker logs faculdade-backend | grep -i "connected\|started"
```

Deve mostrar "Started GestaoObrasApplication".

---

## 🔧 Configuração Comum

### MySQL noutra rede

Se MySQL não está acessível por nome, usar IP:

```bash
# Ver IP do MySQL
docker inspect mysql | grep IPAddress

# Ou obter IP dinamicamente
MYSQL_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mysql)
echo $MYSQL_IP
```

Atualizar `.env`:

```env
MYSQL_HOST=<ip-do-mysql>
```

---

### Traefik não deteta serviço

**Verificar:**

```bash
# Se container está na rede correta
docker network inspect <rede-traefik> | grep faculdade

# Se labels estão presentes
docker inspect faculdade-backend | grep -i traefik
```

**Reconectar:**

```bash
# Desconectar e reconectar
docker network disconnect <rede-traefik> faculdade-backend
docker network connect <rede-traefik> faculdade-backend

# Restart Traefik
docker restart <nome-traefik>
```

---

## 📋 Estrutura de Redes

```
┌─────────────────────────────────────────┐
│         TRAEFIK NETWORK                 │
│  (rede onde Traefik está)               │
│                                         │
│  traefik ───→ faculdade-backend         │
│            └──→ faculdade-frontend      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         MYSQL NETWORK                   │
│  (rede onde MySQL está)                 │
│                                         │
│  mysql ←─── faculdade-backend           │
└─────────────────────────────────────────┘
```

---

## 🎯 URLs Finais

| Serviço | URL | Status |
|---------|-----|--------|
| Frontend | https://faculdade.e258tech.tech | ✅ |
| Backend API | https://api-facul.e258tech.tech | ✅ |
| Swagger | https://api-facul.e258tech.tech/swagger-ui.html | ✅ |
| Health Check | https://api-facul.e258tech.tech/actuator/health | ✅ |

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| `network not found` | Verificar nome correto com `docker network ls` |
| `MySQL connection refused` | Verificar `MYSQL_HOST` e rede MySQL |
| `Traefik 404` | Verificar labels e rede Traefik |
| `SSL error` | Aguardar 2-3 min para gerar certificado |

---

## 📞 Comandos Úteis

```bash
# Ver tudo
docker compose ps
docker compose logs -f

# Restart
docker compose restart

# Stop
docker compose down

# Rebuild
docker compose up -d --build

# Ver redes
docker network ls

# Verificar conexão
docker exec faculdade-backend ping $MYSQL_HOST
```

---

**Deploy pronto! 🎉**
