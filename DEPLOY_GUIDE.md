# 🚀 Guia de Deploy - Docker com Traefik

## 📋 Pré-requisitos

### No Servidor:
- ✅ Docker instalado
- ✅ Docker Compose instalado
- ✅ Traefik já em execução na rede `e258techmozambique`
- ✅ MySQL já em execução
- ✅ Domínios configurados no DNS:
  - `faculdade.e258tech.tech` → IP do servidor
  - `api-facul.e258tech.tech` → IP do servidor

---

## 🔧 Configuração

### 1. Preparar Arquivos

```bash
# Clonar repositório no servidor
git clone <your-repo-url> faculdade
cd faculdade

# Criar arquivo .env
cp .env.example .env

# Editar variáveis de ambiente
nano .env
```

### 2. Verificar Rede Externa

```bash
# Verificar se a rede e258techmozambique existe
docker network ls | grep e258techmozambique

# Se não existir, criar:
docker network create e258techmozambique
```

### 3. Verificar Volume MySQL

```bash
# Verificar se volume MySQL existe
docker volume ls | grep mysql_data

# Se necessário criar:
docker volume create mysql_data
```

### 4. Configurar MySQL Externo

Se o MySQL já existe como container separado, atualize o `docker-compose.yml`:

```yaml
# Adicionar ao docker-compose.yml se MySQL é externo
services:
  mysql:
    external: true
    name: <nome-do-container-mysql>
```

---

## 🚀 Deploy

### Opção 1: Deploy Simples

```bash
# Build e start
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Verificar status
docker-compose ps
```

### Opção 2: Deploy com Variáveis de Ambiente

```bash
# Exportar variáveis
export MYSQL_USER=seu_user
export MYSQL_PASSWORD=sua_password

# Ou usar ficheiro .env
docker-compose --env-file .env up -d --build
```

### Opção 3: Deploy com Docker Compose V2

```bash
docker compose up -d --build
```

---

## 🔍 Verificação

### 1. Verificar Containers

```bash
docker ps | grep faculdade
```

Deve ver:
- `faculdade-backend` - Porta 8080
- `faculdade-frontend` - Porta 80

### 2. Verificar Logs

```bash
# Backend
docker logs -f faculdade-backend

# Frontend
docker logs -f faculdade-frontend
```

### 3. Testar Endpoints

```bash
# Frontend
curl -I https://faculdade.e258tech.tech

# Backend API
curl -I https://api-facul.e258tech.tech/api/auth/signin

# Health check
curl https://api-facul.e258tech.tech/actuator/health
```

### 4. Verificar Traefik

```bash
# Aceder ao dashboard do Traefik
https://traefik.e258tech.tech

# Ou verificar logs do Traefik
docker logs -f traefik
```

---

## 🔧 Configuração do MySQL

Se precisa criar a base de dados e utilizador:

```bash
# Aceder ao MySQL
docker exec -it <mysql-container> mysql -u root -p

# Criar base de dados e utilizador
CREATE DATABASE IF NOT EXISTS faculdade CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'faculdade_user'@'%' IDENTIFIED BY 'faculdade_pass';
GRANT ALL PRIVILEGES ON faculdade.* TO 'faculdade_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🔄 Atualização

```bash
# Parar serviços
docker-compose down

# Pull最新代码
git pull

# Build e start
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

---

## 🛑 Parar Serviços

```bash
# Parar mas manter dados
docker-compose down

# Parar e remover volumes (CUIDADO!)
docker-compose down -v

# Parar e remover imagens também
docker-compose down --rmi all
```

---

## 🐛 Troubleshooting

### Backend não conecta ao MySQL

```bash
# Verificar se MySQL está na mesma rede
docker network inspect e258techmozambique

# Verificar conexão do backend ao MySQL
docker exec faculdade-backend ping mysql
```

### Traefik não reconhece serviços

```bash
# Verificar labels
docker inspect faculdade-backend | grep -A 20 Labels

# Verificar configuração do Traefik
docker exec traefik cat /etc/traefik/traefik.yml

# Restart Traefik
docker restart traefik
```

### Erro de CORS

Verificar se as labels do Traefik estão corretas no `docker-compose.yml`:
- `traefik.http.middlewares.backend-cors.headers.accesscontrolalloworiginlist`

### Certificado SSL não gera

```bash
# Verificar logs do Traefik
docker logs traefik | grep -i "certificate\|acme\|letsencrypt"

# Verificar se DNS está correto
dig faculdade.e258tech.tech
dig api-facul.e258tech.tech
```

---

## 📊 Monitorização

### Recursos dos Containers

```bash
docker stats faculdade-backend faculdade-frontend
```

### Espaço em Disco

```bash
docker system df
docker system prune -a
```

### Logs em Tempo Real

```bash
# Todos os logs
docker-compose logs -f

# Apenas backend
docker logs -f faculdade-backend

# Apenas frontend
docker logs -f faculdade-frontend
```

---

## 🔐 Segurança

### 1. Alterar Passwords Default

Editar `.env`:
```env
MYSQL_USER=user_seguro
MYSQL_PASSWORD=password_forte_123!
```

### 2. HTTPS Forçado

Traefik já configura HTTPS automaticamente com `certresolver=letsencrypt`.

### 3. Firewall

```bash
# Permitir apenas portas necessárias
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 8080/tcp  # Backend só via Traefik
```

---

## ✅ Checklist de Deploy

- [ ] Docker e Docker Compose instalados
- [ ] Traefik em execução na rede `e258techmozambique`
- [ ] MySQL em execução e acessível
- [ ] DNS configurado para ambos domínios
- [ ] Ficheiro `.env` criado e configurado
- [ ] Rede `e258techmozambique` existe
- [ ] Build e start dos serviços
- [ ] Backend acessível via `https://api-facul.e258tech.tech`
- [ ] Frontend acessível via `https://faculdade.e258tech.tech`
- [ ] Certificados SSL gerados
- [ ] Logs verificados sem erros

---

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs: `docker-compose logs -f`
2. Verificar status: `docker-compose ps`
3. Verificar redes: `docker network ls`
4. Verificar Traefik dashboard

---

**Deploy realizado com sucesso! 🎉**
