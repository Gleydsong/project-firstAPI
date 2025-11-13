# 🚀 API de Gerenciamento de Tickets

Uma API REST completa para gerenciamento de tickets de suporte técnico, desenvolvida como projeto de estudos do curso da Rocketseat.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido durante o curso da Rocketseat como forma de estudo e prática das seguintes tecnologias e conceitos:

- **Node.js** com **ES Modules**
- **API REST** com operações CRUD completas
- **Sistema de rotas** customizado
- **Banco de dados** em arquivo JSON
- **Middleware** para parsing de JSON
- **Validações** e tratamento de erros
- **Gerenciamento de status** de tickets
- **Histórico de mudanças**

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **ES Modules** - Sistema de módulos moderno
- **File System** - Persistência de dados em JSON
- **UUID** - Geração de identificadores únicos
- **REST API** - Arquitetura da API

## 📁 Estrutura do Projeto

```
src/
├── controllers/
│   └── tickets/
│       ├── create.js          # Criar ticket
│       ├── index.js           # Listar tickets
│       ├── show.js            # Buscar ticket por ID
│       ├── update.js          # Atualizar ticket (PUT)
│       ├── patch.js           # Atualizar ticket (PATCH)
│       ├── updateStatus.js    # Atualizar status
│       ├── addSolution.js     # Adicionar solução
│       ├── resolveTicket.js   # Resolver ticket
│       ├── getStatusHistory.js # Histórico de status
│       └── remove.js          # Deletar ticket
├── database/
│   └── database.js            # Classe Database
├── middlewares/
│   ├── jsonHandler.js         # Parser de JSON
│   └── routeHandler.js        # Roteamento
├── routes/
│   ├── index.js               # Configuração de rotas
│   └── tickets.js             # Rotas de tickets
├── utils/
│   ├── extractQueryParams.js  # Extração de query params
│   └── ticketUtils.js         # Utilitários para tickets
└── server.js                  # Ponto de entrada
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- NPM 

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/project-firstAPI.git
cd project-firstAPI
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

## 📚 API Endpoints

### Tickets

#### Criar Ticket

```http
POST /tickets
Content-Type: application/json

{
  "equipment": "Notebook Dell",
  "description": "Tela não liga",
  "user_name": "João Silva"
}
```

#### Listar Todos os Tickets

```http
GET /tickets
```

**Com filtros:**

```http
GET /tickets?status=open&equipment=notebook&user_name=joao
```

#### Buscar Ticket por ID

```http
GET /tickets/:id
```

#### Atualizar Ticket Completo

```http
PUT /tickets/:id
Content-Type: application/json

{
  "equipment": "Notebook Dell Atualizado",
  "description": "Tela não liga - problema na fonte",
  "user_name": "João Silva",
  "status": "in_progress"
}
```

#### Atualizar Ticket Parcial

```http
PATCH /tickets/:id
Content-Type: application/json

{
  "description": "Tela não liga - problema na fonte"
}
```

#### Atualizar Status

```http
PATCH /tickets/:id/status
Content-Type: application/json

{
  "status": "in_progress"
}
```

#### Adicionar Solução

```http
PATCH /tickets/:id/solution
Content-Type: application/json

{
  "solution": "Substituir fonte de alimentação",
  "resolved_by": "Técnico Maria"
}
```

#### Resolver Ticket

```http
POST /tickets/:id/resolve
Content-Type: application/json

{
  "solution": "Problema resolvido substituindo fonte",
  "resolved_by": "Técnico Maria"
}
```

#### Ver Histórico de Status

```http
GET /tickets/:id/history
```

#### Deletar Ticket

```http
DELETE /tickets/:id
```

## 🎯 Funcionalidades Implementadas

### ✅ CRUD Completo

- **Create:** Criar novos tickets
- **Read:** Listar e buscar tickets
- **Update:** Atualizar tickets (PUT/PATCH)
- **Delete:** Remover tickets

### ✅ Sistema de Status

- **open:** Ticket aberto
- **in_progress:** Em andamento
- **closed:** Resolvido/finalizado

**Regras de transição:**

- `open` → `in_progress` ou `closed`
- `in_progress` → `open` ou `closed`
- `closed` → **imutável**

### ✅ Validações

- Campos obrigatórios
- Tipos de dados
- Transições de status válidas
- Prevenção de ações inválidas

### ✅ Recursos Avançados

- **Filtros:** Por status, equipamento, usuário, data
- **Histórico:** Rastreamento de mudanças de status
- **Soluções:** Documentação de resoluções
- **Auditoria:** Timestamps de criação/atualização

## 🧪 Testando a API

### Usando cURL

```bash
# Criar ticket
curl -X POST http://localhost:3333/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "equipment": "Computador",
    "description": "Não liga",
    "user_name": "João"
  }'

# Listar tickets
curl http://localhost:3333/tickets

# Buscar por ID
curl http://localhost:3333/tickets/{id}
```

### Usando Insomnia/Postman

1. Configure a URL base: `http://localhost:3333`
2. Use os endpoints documentados acima
3. Configure `Content-Type: application/json` para requisições POST/PUT/PATCH

## 📊 Estrutura dos Dados

### Ticket

```json
{
  "id": "uuid-v4",
  "equipment": "string",
  "description": "string",
  "user_name": "string",
  "status": "open | in_progress | closed",
  "solution": "string | null",
  "resolved_by": "string | null",
  "resolved_at": "ISO 8601 | null",
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601",
  "status_history": [
    {
      "status": "string",
      "changed_at": "ISO 8601",
      "previous_status": "string"
    }
  ]
}
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Verificar sintaxe
node --check src/server.js
```

## 📖 Conceitos Aprendidos

Durante o desenvolvimento deste projeto, foram aplicados os seguintes conceitos:

- **Arquitetura REST:** Padrões de API RESTful
- **Middleware Pattern:** Processamento de requisições
- **File System Operations:** Persistência de dados
- **Error Handling:** Tratamento de erros e validações
- **Data Validation:** Validação de entrada de dados
- **State Management:** Controle de estados (status)
- **UUID Generation:** Identificadores únicos
- **Date Handling:** Manipulação de datas e timestamps

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso da Rocketseat.

## 🙏 Agradecimentos

- **Rocketseat** - Pelo excelente conteúdo educacional
- **Comunidade Node.js** - Pela documentação e suporte
- **Open Source** - Por tornar tudo isso possível

---

**⭐ Se este projeto te ajudou nos estudos, dê uma estrela!**
