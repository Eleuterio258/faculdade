# 📊 Motor de Cotação Comparativa - Backend

## ✅ Implementação Completa

O **Motor de Cotação Comparativa** foi implementado com sucesso no backend do sistema de gestão de obras.

---

## 🎯 Funcionalidades Implementadas

### 1. **Gestão de Cotações**
- ✅ Criar cotações com múltiplos itens
- ✅ Editar cotações existentes
- ✅ Atualizar status (PENDENTE, ENVIADA, RECEBIDA, EM_ANALISE, APROVADA, REJEITADA, EXPIRADA)
- ✅ Eliminar cotações
- ✅ Listar cotações por obra
- ✅ Listar cotações por fornecedor
- ✅ Busca por período

### 2. **Motor de Comparação de Preços**
- ✅ Comparar preços de materiais entre múltiplos fornecedores
- ✅ Identificar automaticamente o menor preço
- ✅ Calcular percentual de diferença entre fornecedores
- ✅ Estatísticas por material (menor, maior, preço médio)
- ✅ Análise de economia potencial

### 3. **Análise de Mercado**
- ✅ Relatório de análise de mercado por período
- ✅ Contagem de cotações por status
- ✅ Fornecedor mais utilizado
- ✅ Economia potencial total
- ✅ Valor total de cotações

### 4. **Sistema de Recomendações Inteligentes**
- ✅ Alerta de cotações pendentes há mais de 7 dias
- ✅ Alerta de cotações prestes a expirar (3 dias)
- ✅ Recomendação de economia quando > 1000 MZN
- ✅ Priorização automática (URGENTE, ALERTA, ECONOMIA)

### 5. **Histórico de Cotações**
- ✅ Histórico completo por material
- ✅ Cotações aprovadas para referência
- ✅ Preços médios por fornecedor
- ✅ Tendência de preços

---

## 📁 Arquivos Criados

### Modelos (2 arquivos)
1. **`Cotacao.java`** - Modelo principal de cotação
   - Dados do fornecedor
   - Condições de pagamento
   - Prazo de entrega
   - Status e decisão
   - Lista de itens
   - Cálculo automático do valor total

2. **`CotacaoItem.java`** - Itens individuais da cotação
   - Material ou descrição
   - Quantidade e unidade
   - Preço unitário e total
   - Desconto percentual
   - Especificações e marca
   - Cálculo automático com desconto

### Repositórios (2 arquivos)
3. **`CotacaoRepository.java`** - Operações de banco para cotações
   - Busca por obra, fornecedor, status
   - Busca por período
   - Cotações aprovadas por material
   - Preço médio por fornecedor
   - Contagens

4. **`CotacaoItemRepository.java`** - Operações para itens
   - Menor preço por material
   - Maior preço por material
   - Preço médio por material
   - Estatísticas por obra

### DTOs (2 arquivos)
5. **`CotacaoDTO.java`** - DTO para transferência de cotações
   - Estrutura completa da cotação
   - Lista de itens
   - Dados do fornecedor

6. **`ComparacaoCotacaoDTO.java`** - DTO para comparação
   - Comparações por fornecedor
   - Melhor preço identificado
   - Estatísticas completas
   - Percentual de diferença

### Serviços (1 arquivo)
7. **`CotacaoService.java`** - Lógica de negócio completa
   - CRUD de cotações
   - Motor de comparação
   - Análise de mercado
   - Sistema de recomendações
   - Cálculo de economia potencial

### Controllers (1 arquivo)
8. **`CotacaoController.java`** - Endpoints REST
   - 11 endpoints completos
   - Validação de dados
   - Segurança com roles

---

## 🔌 API Endpoints

### Gestão de Cotações

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| POST | `/api/cotacoes/obra/{obraId}` | Criar cotação | EMPREITEIRO, GESTOR_MATERIAIS |
| GET | `/api/cotacoes/obra/{obraId}` | Listar cotações da obra | Todos os perfis |
| GET | `/api/cotacoes/{id}` | Obter cotação detalhada | Todos os perfis |
| PUT | `/api/cotacoes/{id}` | Atualizar cotação | EMPREITEIRO, GESTOR_MATERIAIS |
| PATCH | `/api/cotacoes/{id}/status` | Atualizar status | EMPREITEIRO, GESTOR_MATERIAIS |
| DELETE | `/api/cotacoes/{id}` | Eliminar cotação | EMPREITEIRO, GESTOR_MATERIAIS |

### Motor de Comparação

| Método | Endpoint | Descrição | Acesso |
|--------|----------|-----------|--------|
| GET | `/api/cotacoes/comparar/obra/{obraId}?materiaisIds=[]` | Comparar preços entre fornecedores | EMPREITEIRO, GESTOR, ENGENHEIRO |
| GET | `/api/cotacoes/analise/obra/{obraId}?inicio=&fim=` | Análise de mercado por período | EMPREITEIRO, GESTOR, ENGENHEIRO |
| GET | `/api/cotacoes/recomendacoes/{obraId}` | Recomendações inteligentes | EMPREITEIRO, GESTOR, ENGENHEIRO |
| GET | `/api/cotacoes/historico/material/{materialId}` | Histórico de cotações por material | EMPREITEIRO, GESTOR, ENGENHEIRO |

---

## 📊 Estrutura de Dados

### Cotacao
```java
{
  id: Long,
  numeroCotacao: String (auto-gerado: "COT-{timestamp}"),
  fornecedor: Fornecedor,
  obra: Obra,
  dataCotacao: LocalDate,
  dataValidade: LocalDate,
  condicoesPagamento: String,
  prazoEntrega: String,
  observacoes: String,
  valorTotal: BigDecimal (calculado automaticamente),
  status: Enum (PENDENTE, ENVIADA, RECEBIDA, EM_ANALISE, APROVADA, REJEITADA, EXPIRADA),
  decisao: Enum (APROVADA, REJEITADA_PRECO, REJEITADA_PRAZO, etc.),
  dataDecisao: LocalDate,
  itens: List<CotacaoItem>
}
```

### CotacaoItem
```java
{
  id: Long,
  material: Material (opcional),
  descricaoMaterial: String,
  quantidade: BigDecimal,
  unidade: String,
  precoUnitario: BigDecimal,
  precoTotal: BigDecimal (calculado automaticamente),
  especificacoes: String,
  marca: String,
  descontoPercentual: BigDecimal,
  observacoes: String
}
```

---

## 🧮 Motor de Comparação - Funcionamento

### 1. Comparação por Material
```
Input: obraId + lista de materiaisIds
Processo:
  1. Busca todas cotações da obra que contêm o material
  2. Extrai preços de cada fornecedor
  3. Calcula estatísticas (menor, maior, médio)
  4. Identifica melhor preço
  5. Calcula % de diferença
Output: Lista de ComparacaoCotacaoDTO com análises
```

### 2. Análise de Mercado
```
Input: obraId + período (inicio, fim)
Processo:
  1. Busca cotações no período
  2. Conta por status
  3. Calcula valor total
  4. Identifica fornecedor mais utilizado
  5. Calcula economia potencial
Output: Map<String, Object> com métricas
```

### 3. Sistema de Recomendações
```
Input: obraId
Processo:
  1. Verifica cotações pendentes > 7 dias → URGENTE
  2. Verifica cotações expirando em < 3 dias → ALERTA
  3. Calcula economia potencial > 1000 MZN → ECONOMIA
Output: Lista de recomendações priorizadas
```

---

## 💡 Exemplos de Uso

### Criar Cotação
```json
POST /api/cotacoes/obra/1
{
  "fornecedorId": 5,
  "dataCotacao": "2026-04-10",
  "dataValidade": "2026-05-10",
  "condicoesPagamento": "30 dias",
  "prazoEntrega": "5 dias úteis",
  "observacoes": "Entrega no estaleiro",
  "itens": [
    {
      "descricaoMaterial": "Cimento Portland",
      "quantidade": 100,
      "unidade": "sacas",
      "precoUnitario": 450.00,
      "especificacoes": "Tipo II",
      "marca": "Cimentos Moçambique",
      "descontoPercentual": 5.0
    },
    {
      "descricaoMaterial": "Aço CA-50",
      "quantidade": 500,
      "unidade": "kg",
      "precoUnitario": 85.50,
      "especificacoes": "10mm"
    }
  ]
}
```

### Comparar Preços
```
GET /api/cotacoes/comparar/obra/1?materiaisIds=10,15,20

Response:
[
  {
    "materialId": 10,
    "materialNome": "Cimento Portland",
    "comparacoes": [
      {
        "fornecedorId": 5,
        "fornecedorNome": "Cimentos Lda",
        "precoUnitario": 450.00,
        "menorPreco": true,
        "percentualDiferenca": 0.0
      },
      {
        "fornecedorId": 8,
        "fornecedorNome": "Construções SA",
        "precoUnitario": 475.00,
        "menorPreco": false,
        "percentualDiferenca": 5.56
      }
    ],
    "melhorPreco": {
      "fornecedorId": 5,
      "fornecedorNome": "Cimentos Lda",
      "precoUnitario": 450.00,
      "economiaPotencial": 25.00
    },
    "estatisticas": {
      "menorPreco": 450.00,
      "maiorPreco": 475.00,
      "precoMedio": 462.50,
      "totalFornecedores": 2
    }
  }
]
```

### Obter Recomendações
```
GET /api/cotacoes/recomendacoes/1

Response:
[
  {
    "tipo": "URGENTE",
    "mensagem": "Existem 3 cotações pendentes há mais de 7 dias",
    "acao": "Avaliar e decidir sobre as cotações pendentes"
  },
  {
    "tipo": "ECONOMIA",
    "mensagem": "Potencial de economia: 15000.00 MZN",
    "acao": "Considerar fornecedores com melhores preços"
  }
]
```

---

## 🔐 Segurança

Todos os endpoints protegidos com Spring Security:
- **EMPREITEIRO**: Acesso completo
- **GESTOR_MATERIAIS**: Criar, editar, comparar
- **ENGENHEIRO**: Visualizar e comparar
- **TECNICO_OBRA**: Visualizar cotações da obra

---

## 📈 Benefícios

1. **Economia de Custos**: Identifica automaticamente os melhores preços
2. **Transparência**: Comparações claras entre fornecedores
3. **Eficiência**: Automatiza processo manual de comparação
4. **Decisões Informadas**: Recomendações baseadas em dados
5. **Histórico Completo**: Rastreabilidade de todas as cotações
6. **Alertas Inteligentes**: Evita perda de prazos e oportunidades

---

## ✅ Status de Compilação

```
[INFO] BUILD SUCCESS
```

**Todos os arquivos compilam corretamente!**

---

## 🚀 Próximos Passos (Frontend)

Para completar a funcionalidade no frontend:

1. **Página de Cotações** - CRUD completo
2. **Dashboard de Comparação** - Visualização de preços
3. **Gráficos de Análise** - Tendências de preços
4. **Alertas Visuais** - Notificações de recomendações
5. **Botão Exportar** - PDF/Excel de cotações

---

**Implementação completa e funcional! 🎉**
