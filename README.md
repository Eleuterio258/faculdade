# Sistema de Gestão de Obras de Construção Civil

## 📌 Descrição Geral

Este projecto consiste no desenvolvimento de uma **aplicação web para gestão de obras de construção civil**, concebida para apoiar pequenas e médias empresas (PMEs) moçambicanas no controlo de **prazos, custos, materiais e equipas**. O sistema visa substituir processos manuais por uma plataforma digital integrada, promovendo eficiência, transparência e melhor tomada de decisão.

O sistema foi idealizado no âmbito de um trabalho académico e está alinhado com princípios de **Engenharia de Software** e **Sistemas de Informação** aplicados à construção civil.

---

## 🎯 Objectivos

### Objectivo Geral

Desenvolver um sistema digital integrado para a gestão de obras de construção civil, adaptado à realidade de Moçambique.

### Objectivos Específicos

* Centralizar a informação das obras
* Controlar cronogramas e prazos
* Monitorizar custos previstos e realizados
* Gerir materiais e stock
* Registar actividades diárias (diário de obra)
* Apoiar a tomada de decisões através de relatórios

---

## 👥 Perfis de Utilizadores

* **Empreiteiro (Administrador)** – gestão geral do sistema
* **Engenheiro** – controlo técnico e progresso da obra
* **Gestor de Materiais** – stock e aprovisionamento
* **Técnico da Obra** – supervisão diária e equipas
* **Trabalhador** – participação indirecta

---

## 🧩 Funcionalidades Principais

* ✅ Autenticação e controlo de acessos
* ✅ Registo e gestão de obras
* ✅ Cronograma de actividades
* ✅ Diário de obra digital
* ✅ Gestão de materiais e stock
* ✅ Controlo de custos
* ✅ Gestão de equipas
* ✅ Relatórios automáticos
* ✅ Upload de documentos
* ✅ Painéis de controlo (dashboards)

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Java 17
* Spring Boot 3.2.0
* Spring Security + JWT
* JPA / Hibernate
* Maven

### Frontend

* React 18
* Vite
* HTML5 / CSS3
* Tailwind CSS
* React Router
* Axios

### Base de Dados

* MySQL 8.0+

---

## 🗄️ Modelo de Dados (Principais Entidades)

* **Utilizador** - Gestão de utilizadores e perfis
* **Obra** - Informações das obras
* **Cronograma** - Cronogramas de actividades
* **Atividade** - Actividades do cronograma
* **Diário de Obra** - Registos diários
* **Material** - Gestão de materiais
* **Movimento de Material** - Entradas e saídas de materiais
* **Custo** - Controlo de custos
* **Equipa** - Gestão de equipas
* **Presença** - Controlo de presenças
* **Documento** - Upload de documentos

---

## 🔐 Segurança

* Autenticação baseada em JWT
* Perfis e permissões por utilizador
* Protecção de dados sensíveis
* CORS configurado

---

## 🚀 Instalação e Execução

### Pré-requisitos

* Java 17 ou superior
* Maven 3.6+
* Node.js 18+ e npm
* MySQL 8.0+

### Backend

1. Navegue para a pasta do backend:
```bash
cd backend
```

2. Configure a base de dados no arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestao_obras?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=sua_senha
```

3. Compile e execute o projeto:
```bash
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`

### Frontend

1. Navegue para a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

---

## 📊 Estrutura do Projeto

```
faculdade/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/construction/gestao/
│   │   │   │   ├── controller/     # Controllers REST
│   │   │   │   ├── service/        # Lógica de negócio
│   │   │   │   ├── repository/     # Repositórios JPA
│   │   │   │   ├── model/          # Entidades JPA
│   │   │   │   ├── security/       # Configuração de segurança
│   │   │   │   └── dto/            # Data Transfer Objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── context/         # Context API
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🔌 API Endpoints Principais

### Autenticação
* `POST /api/auth/signin` - Login
* `POST /api/auth/signup` - Registo

### Obras
* `GET /api/obras` - Listar obras
* `GET /api/obras/{id}` - Obter obra
* `POST /api/obras` - Criar obra
* `PUT /api/obras/{id}` - Actualizar obra
* `DELETE /api/obras/{id}` - Eliminar obra

### Cronogramas
* `GET /api/cronogramas/obra/{obraId}` - Listar cronogramas
* `POST /api/cronogramas/obra/{obraId}` - Criar cronograma

### Materiais
* `GET /api/materiais/obra/{obraId}` - Listar materiais
* `POST /api/materiais/obra/{obraId}` - Criar material

### Custos
* `GET /api/custos/obra/{obraId}` - Listar custos
* `POST /api/custos/obra/{obraId}` - Criar custo

### Diários de Obra
* `GET /api/diarios-obra/obra/{obraId}` - Listar diários
* `POST /api/diarios-obra/obra/{obraId}` - Criar diário

### Equipas
* `GET /api/equipas/obra/{obraId}` - Listar equipas
* `POST /api/equipas/obra/{obraId}` - Criar equipa

---

## 📊 Resultados Esperados

* Redução de atrasos nas obras
* Melhor controlo de custos e materiais
* Diminuição de desperdícios
* Comunicação eficiente entre estaleiro e escritório
* Maior transparência e organização

---

## 📌 Futuras Melhorias

* Integração com sensores IoT
* Módulo de previsão de custos
* Aplicação mobile nativa
* Integração com pagamentos electrónicos
* Relatórios avançados com gráficos
* Notificações em tempo real

---

## 🧪 Testes

Para executar os testes do backend:
```bash
cd backend
mvn test
```

---

## 📄 Licença

Projecto académico desenvolvido para fins educacionais.

---

## ✍️ Autor

**José Estêvão Dava**

Curso: Engenharia Informática  
Instituição: Universidade Eduardo Mondlane

---

## 🤝 Contribuições

Este é um projecto académico. Contribuições são bem-vindas para fins educacionais.

---

## 📞 Suporte

Para questões ou suporte, contacte o autor através do repositório.

