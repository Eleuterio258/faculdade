# 🚀 Deploy na Rede e258techmozambique

## ✅ Configuração Simplificada

Como **Traefik e MySQL estão na mesma rede `e258techmozambique`**, a configuração é simples!

---

## 📋 Passo a Passo

### 1. Verificar Rede

```bash
# Ver se rede existe
docker network ls | grep e258techmozambique
```

### 2. Configurar MySQL

```bash
nano .env
```

Alterar apenas:
```env
MYSQL_HOST=mysql
MYSQL_USER=faculdade_user
MYSQL_PASSWORD=sua_password
MYSQL_DATABASE=faculdade
```

### 3. Deploy

```bash
# Build e start
docker compose up -d --build

# Ver logs
docker compose logs -f

# Ver status
docker compose ps
```

---

## 🎯 URLs

| Serviço | URL |
|---------|-----|
| **Frontend** | https://faculdade.e258tech.tech |
| **Backend API** | https://api-facul.e258tech.tech |
| **Swagger** | https://api-facul.e258tech.tech/swagger-ui.html |

---

## 🔍 Verificação

```bash
# Containers a correr?
docker ps | grep faculdade

# Backend consegue ver MySQL?
docker exec faculdade-backend ping mysql

# SSL OK?
curl -I https://faculdade.e258tech.tech
```

---

## 🐛 Problemas Comuns

### MySQL não conecta

```bash
# Ver nome correto do container MySQL
docker ps | grep mysql

# Se o nome for diferente de "mysql", ajustar .env
# Ex: se for "db-mysql", usar:
MYSQL_HOST=db-mysql
```

### Traefik não deteta

```bash
# Verificar labels
docker inspect faculdade-backend | grep traefik

# Restart
docker compose restart
```

---

## 📋 Arquitetura

```
e258techmozambique (rede única)
├── traefik
├── mysql
├── faculdade-backend
└── faculdade-frontend
```

---

**Simples e direto! 🚀**
