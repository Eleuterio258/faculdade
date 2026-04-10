# 🔍 Guia para Descobrir Nomes das Redes Docker

## Passo 1: Listar Todas as Redes

```bash
docker network ls
```

Exemplo de output:
```
NETWORK ID     NAME                  DRIVER    SCOPE
abc123         bridge                bridge    local
def456         host                  host      local
ghi789         traefik-public        overlay   swarm
jkl012         mysql-network         bridge    local
mno345         e258techmozambique    bridge    local
```

---

## Passo 2: Identificar Rede do Traefik

```bash
# Ver containers que usam Traefik
docker ps | grep traefik

# Ver redes do container Traefik
docker inspect traefik | grep -A 5 Networks
```

**Anotar o nome da rede** (ex: `traefik-public`, `proxy`, `traefik-net`)

---

## Passo 3: Identificar Rede do MySQL

```bash
# Ver containers MySQL
docker ps | grep mysql

# Ver redes do container MySQL
docker inspect mysql | grep -A 5 Networks
```

**Anotar o nome da rede** (ex: `mysql-network`, `database`, `db-net`)

---

## Passo 4: Atualizar .env

Editar o ficheiro `.env` com os nomes corretos:

```bash
nano .env
```

Atualizar:
```env
# Se Traefik está em "traefik-public"
TRAEFIK_NETWORK=traefik-public

# Se MySQL está em "mysql-network"  
MYSQL_NETWORK=mysql-network
```

---

## Passo 5: Verificar Conexão

### Testar se consegue ver as redes:

```bash
# Ver detalhes da rede Traefik
docker network inspect $TRAEFIK_NETWORK

# Ver detalhes da rede MySQL
docker network inspect $MYSQL_NETWORK
```

---

## Passo 6: Testar Deploy

```bash
# Build e start
docker compose up -d --build

# Ver logs
docker compose logs -f
```

---

## ⚠️ Problemas Comuns

### Erro: "network not found"

```
Error: network "traefik-public" not found
```

**Solução:** A rede não existe. Verificar nome correto:
```bash
docker network ls
```

### Erro: "cannot connect to MySQL"

```
Communications link failure
```

**Soluções:**
1. Verificar se MySQL está na rede correta:
```bash
docker network connect mysql-network faculdade-backend
```

2. Ou ajustar `MYSQL_HOST` no `.env`:
```env
# Usar IP direto em vez de nome
MYSQL_HOST=172.18.0.2
```

### Erro: "Traefik não detecta serviço"

**Verificar:**
```bash
# Se container está na rede do Traefik
docker network inspect traefik-public | grep faculdade

# Se labels estão corretas
docker inspect faculdade-backend | grep -A 20 Labels
```

**Reconectar ao Traefik:**
```bash
docker network disconnect traefik-public faculdade-backend
docker network connect traefik-public faculdade-backend
```

---

## ✅ Checklist

- [ ] Identifiquei nome da rede do Traefik
- [ ] Identifiquei nome da rede do MySQL
- [ ] Atualizei `.env` com nomes corretos
- [ ] Verifiquei que ambas redes existem
- [ ] Testei deploy com sucesso

---

**Redes configuradas corretamente! 🎉**
