# Documentação da API — Automations Monitor

## Informações Gerais

- **Base URL:** `http://<host>/api/`
- **Formato:** JSON (exceto upload de foto de usuário, que usa `multipart/form-data`)
- **Autenticação:** JWT (Bearer Token)
- **Documentação interativa (Swagger):** `http://<host>/docs/`

---

## Autenticação

Todos os endpoints (exceto os de token) exigem o header:

```
Authorization: Bearer <access_token>
```

### Endpoints de Token

| Método | URL | Descrição |
|--------|-----|-----------|
| `POST` | `/api/token/` | Obter par de tokens (access + refresh) |
| `POST` | `/api/token/refresh/` | Renovar o access token |
| `POST` | `/api/token/verify/` | Verificar validade de um token |

#### POST `/api/token/`

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Resposta 200:**
```json
{
  "access": "<jwt_access_token>",
  "refresh": "<jwt_refresh_token>"
}
```

#### POST `/api/token/refresh/`

**Body:**
```json
{
  "refresh": "<jwt_refresh_token>"
}
```

**Resposta 200:**
```json
{
  "access": "<jwt_access_token>"
}
```

#### POST `/api/token/verify/`

**Body:**
```json
{
  "token": "<jwt_token>"
}
```

---

## Usuários

**Base:** `/api/users/`

> Operações disponíveis: **Listar**, **Criar**, **Detalhar**, **Atualizar** (sem exclusão).  
> Upload de foto utiliza `Content-Type: multipart/form-data`.

### Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/users/` | Listar usuários |
| `POST` | `/api/users/` | Criar usuário |
| `GET` | `/api/users/{id}/` | Detalhar usuário |
| `PUT` | `/api/users/{id}/` | Atualizar usuário (completo) |
| `PATCH` | `/api/users/{id}/` | Atualizar usuário (parcial) |

### Campos

#### Leitura (GET)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID do usuário |
| `last_login` | datetime | Último login |
| `is_superuser` | boolean | É superusuário |
| `username` | string | Nome de usuário |
| `first_name` | string | Primeiro nome |
| `last_name` | string | Sobrenome |
| `email` | string | E-mail |
| `is_staff` | boolean | É staff |
| `is_active` | boolean | Está ativo |
| `date_joined` | datetime | Data de cadastro (somente leitura) |
| `telephone` | string\|null | Telefone |
| `birthday` | date\|null | Data de aniversário |
| `photo` | string\|null | URL da foto de perfil |
| `department` | integer\|null | ID do departamento |
| `department_data` | object\|null | Dados do departamento (somente leitura) |
| `updated_by` | integer\|null | ID do usuário que fez a última atualização (somente leitura) |
| `updated_by_data` | object\|null | Dados do usuário atualizador (somente leitura) |

#### Escrita (POST / PUT / PATCH)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `username` | string | Sim | Nome de usuário |
| `first_name` | string | Não | Primeiro nome |
| `last_name` | string | Não | Sobrenome |
| `email` | string | Não | E-mail |
| `password` | string | Sim (criação) / Não (atualização) | Senha (mín. 8 caracteres, write-only) |
| `telephone` | string | Não | Telefone |
| `birthday` | date | Não | Data de aniversário |
| `photo` | file | Não | Foto de perfil (máx. 2MB) |
| `department` | integer | Não | ID do departamento |
| `is_active` | boolean | Não | Status ativo |
| `is_staff` | boolean | Não | Acesso staff |

### Filtros (query params)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `username` | string | Filtra por nome de usuário (contém, case-insensitive) |
| `email` | string | Filtra por e-mail (contém) |
| `first_name` | string | Filtra por nome (contém) |
| `last_name` | string | Filtra por sobrenome (contém) |

### Exemplo de resposta (GET `/api/users/`)

```json
[
  {
    "id": 1,
    "last_login": "2026-03-17T10:00:00Z",
    "is_superuser": false,
    "username": "joao.silva",
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao@example.com",
    "is_staff": false,
    "is_active": true,
    "date_joined": "2026-01-01T00:00:00Z",
    "telephone": "11999999999",
    "birthday": "1990-05-20",
    "photo": "/media/user_photos/foto.jpg",
    "department": 2,
    "department_data": {
      "name": "TI",
      "description": "Departamento de TI",
      "status": true
    },
    "updated_by": 1,
    "updated_by_data": {
      "first_name": "Admin",
      "last_name": "Sistema"
    }
  }
]
```

---

## Departamentos

**Base:** `/api/departments/`

> Operações disponíveis: **Listar**, **Criar**, **Detalhar**, **Atualizar** (sem exclusão).

### Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/departments/` | Listar departamentos |
| `POST` | `/api/departments/` | Criar departamento |
| `GET` | `/api/departments/{id}/` | Detalhar departamento |
| `PUT` | `/api/departments/{id}/` | Atualizar departamento (completo) |
| `PATCH` | `/api/departments/{id}/` | Atualizar departamento (parcial) |

### Campos

#### Leitura (GET)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID do departamento |
| `name` | string | Nome |
| `description` | string\|null | Descrição |
| `status` | boolean | Ativo (default: `true`) |
| `created_at` | datetime | Criado em (somente leitura) |
| `updated_at` | datetime | Atualizado em (somente leitura) |
| `updated_by` | integer\|null | ID do usuário atualizador (somente leitura) |
| `updated_by_data` | object\|null | Dados do atualizador (somente leitura) |

#### Escrita (POST / PUT / PATCH)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | Sim | Nome único do departamento |
| `description` | string | Não | Descrição |
| `status` | boolean | Não | Status ativo (default: `true`) |

### Filtros (query params)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `name` | string | Filtra por nome (contém, case-insensitive) |
| `description` | string | Filtra por descrição (contém) |

### Exemplo de resposta (GET `/api/departments/`)

```json
[
  {
    "id": 1,
    "name": "TI",
    "description": "Departamento de Tecnologia da Informação",
    "status": true,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-03-10T08:00:00Z",
    "updated_by": 1,
    "updated_by_data": {
      "first_name": "Admin",
      "last_name": "Sistema"
    }
  }
]
```

---

## Automações

**Base:** `/api/automations/`

> Operações disponíveis: **Listar**, **Criar**, **Detalhar**, **Atualizar** (sem exclusão).

### Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/automations/` | Listar automações |
| `POST` | `/api/automations/` | Criar automação |
| `GET` | `/api/automations/{id}/` | Detalhar automação |
| `PUT` | `/api/automations/{id}/` | Atualizar automação (completo) |
| `PATCH` | `/api/automations/{id}/` | Atualizar automação (parcial) |

### Campos

#### Leitura (GET)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID da automação |
| `name` | string | Nome |
| `description` | string\|null | Descrição |
| `is_active` | boolean | Ativa (default: `true`) |
| `created_at` | datetime | Criado em (somente leitura) |
| `updated_at` | datetime | Atualizado em (somente leitura) |
| `updated_by` | integer\|null | ID do usuário atualizador (somente leitura) |
| `updated_by_data` | object\|null | Dados do atualizador (somente leitura) |
| `department` | integer\|null | ID do departamento |
| `department_data` | object\|null | Dados do departamento (somente leitura) |
| `manual_time` | integer\|null | Tempo manual em segundos |

#### Escrita (POST / PUT / PATCH)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | Sim | Nome da automação |
| `description` | string | Não | Descrição |
| `is_active` | boolean | Não | Status ativo (default: `true`) |
| `department` | integer | Não | ID do departamento |
| `manual_time` | integer | Não | Tempo manual em segundos |

### Filtros (query params)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `name` | string | Filtra por nome (contém, case-insensitive) |
| `is_active` | boolean | Filtra por status ativo |

### Exemplo de resposta (GET `/api/automations/`)

```json
[
  {
    "id": 1,
    "name": "Relatório Mensal",
    "description": "Gera relatório mensal automaticamente",
    "is_active": true,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-03-10T08:00:00Z",
    "updated_by": 1,
    "updated_by_data": {
      "first_name": "Admin",
      "last_name": "Sistema"
    },
    "department": 1,
    "department_data": {
      "name": "TI"
    },
    "manual_time": 3600
  }
]
```

---

## Execuções

**Base:** `/api/executions/`

> Operações disponíveis: **Listar**, **Criar**, **Detalhar**, **Atualizar** (sem exclusão).  
> `date_start` é preenchido automaticamente na criação. `date_end` é preenchido automaticamente quando o status for `"concluido"`.

### Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/executions/` | Listar execuções |
| `POST` | `/api/executions/` | Criar execução |
| `GET` | `/api/executions/{id}/` | Detalhar execução |
| `PUT` | `/api/executions/{id}/` | Atualizar execução (completo) |
| `PATCH` | `/api/executions/{id}/` | Atualizar execução (parcial) |

### Status disponíveis

| Valor | Descrição |
|-------|-----------|
| `iniciado` | Execução iniciada |
| `concluido` | Execução concluída (preenche `date_end` automaticamente) |
| `erro` | Execução com erro |
| `alerta` | Execução com alerta |

### Campos

#### Leitura (GET)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID da execução |
| `date_start` | datetime | Data/hora de início (somente leitura) |
| `date_end` | datetime\|null | Data/hora de fim (somente leitura) |
| `status` | string | Status da execução |
| `automation` | integer | ID da automação |
| `automation_data` | object | Dados da automação (somente leitura) |

#### Escrita (POST / PUT / PATCH)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `automation` | integer | Sim | ID da automação |
| `status` | string | Sim | Status (`iniciado`, `concluido`, `erro`, `alerta`) |

### Filtros (query params)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `automation` | string | Filtra por nome da automação (contém) |
| `date_start` | date | Filtra por data de início (`YYYY-MM-DD`) |
| `status` | string | Filtra por status (contém) |

### Exemplo de resposta (GET `/api/executions/`)

```json
[
  {
    "id": 1,
    "date_start": "2026-03-17T08:00:00Z",
    "date_end": "2026-03-17T08:30:00Z",
    "status": "concluido",
    "automation": 1,
    "automation_data": {
      "name": "Relatório Mensal",
      "description": "Gera relatório mensal automaticamente",
      "is_active": true
    }
  }
]
```

---

## Logs

**Base:** `/api/executions/logs/`

> Operações disponíveis: **Listar**, **Criar**, **Detalhar**, **Atualizar** (sem exclusão).

### Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/executions/logs/` | Listar logs |
| `POST` | `/api/executions/logs/` | Criar log |
| `GET` | `/api/executions/logs/{id}/` | Detalhar log |
| `PUT` | `/api/executions/logs/{id}/` | Atualizar log (completo) |
| `PATCH` | `/api/executions/logs/{id}/` | Atualizar log (parcial) |

### Campos

#### Leitura (GET)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID do log |
| `description` | string\|null | Descrição/mensagem do log |
| `created_at` | datetime | Criado em (somente leitura) |
| `updated_at` | datetime | Atualizado em (somente leitura) |
| `execution` | integer | ID da execução |
| `execution_data` | object | Dados da execução (somente leitura) |

#### Escrita (POST / PUT / PATCH)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `execution` | integer | Sim | ID da execução |
| `description` | string | Não | Mensagem do log (máx. 250 chars) |

### Filtros (query params)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `execution` | string | Filtra por ID da execução |
| `description` | string | Filtra por descrição (contém) |
| `created_at` | date | Filtra por data de criação |

### Exemplo de resposta (GET `/api/executions/logs/`)

```json
[
  {
    "id": 1,
    "description": "Processamento iniciado com sucesso",
    "created_at": "2026-03-17T08:00:05Z",
    "updated_at": "2026-03-17T08:00:05Z",
    "execution": 1,
    "execution_data": {
      "status": "concluido",
      "date_start": "2026-03-17T08:00:00Z",
      "date_end": "2026-03-17T08:30:00Z"
    }
  }
]
```

---

## Etapas (Steps)

**Base:** `/api/executions/steps/`

> Operações disponíveis: **Listar**, **Criar**, **Detalhar**, **Atualizar** (sem exclusão).  
> `date_start` é preenchido automaticamente na criação. `date_end` e `time_execution` são calculados automaticamente ao concluir a etapa.

### Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| `GET` | `/api/executions/steps/` | Listar etapas |
| `POST` | `/api/executions/steps/` | Criar etapa |
| `GET` | `/api/executions/steps/{id}/` | Detalhar etapa |
| `PUT` | `/api/executions/steps/{id}/` | Atualizar etapa (completo) |
| `PATCH` | `/api/executions/steps/{id}/` | Atualizar etapa (parcial) |

### Status disponíveis

Os mesmos da execução: `iniciado`, `concluido`, `erro`, `alerta`.

### Campos

#### Leitura (GET)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | integer | ID da etapa |
| `identification` | string\|null | Identificador da etapa |
| `status` | string | Status |
| `date_start` | datetime | Data/hora de início (somente leitura) |
| `date_end` | datetime\|null | Data/hora de fim (somente leitura) |
| `time_execution` | integer\|null | Tempo de execução em segundos (somente leitura, calculado) |
| `execution` | integer | ID da execução |
| `execution_data` | object | Dados da execução (somente leitura) |

#### Escrita (POST / PUT / PATCH)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `execution` | integer | Sim | ID da execução |
| `identification` | string | Não | Identificador da etapa |
| `status` | string | Sim | Status (`iniciado`, `concluido`, `erro`, `alerta`) |

### Filtros (query params)

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `execution` | string | Filtra por ID da execução |
| `identification` | string | Filtra por identificação (contém) |
| `status` | string | Filtra por status (contém) |
| `date_start` | date | Filtra por data de início |

### Exemplo de resposta (GET `/api/executions/steps/`)

```json
[
  {
    "id": 1,
    "identification": "etapa_validacao",
    "status": "concluido",
    "date_start": "2026-03-17T08:00:01Z",
    "date_end": "2026-03-17T08:05:00Z",
    "time_execution": 299,
    "execution": 1,
    "execution_data": {
      "status": "concluido",
      "date_start": "2026-03-17T08:00:00Z",
      "date_end": "2026-03-17T08:30:00Z"
    }
  }
]
```

---

## Resumo dos Endpoints

| Recurso | URL Base | GET (lista) | POST | GET (detalhe) | PUT | PATCH | DELETE |
|---------|----------|-------------|------|---------------|-----|-------|--------|
| Token | `/api/token/` | — | ✅ | — | — | — | — |
| Usuários | `/api/users/` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Departamentos | `/api/departments/` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Automações | `/api/automations/` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Execuções | `/api/executions/` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Logs | `/api/executions/logs/` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Etapas | `/api/executions/steps/` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## Paginação

A API utiliza paginação padrão do Django REST Framework. Verifique nas configurações do projeto o `PAGE_SIZE` definido.

## Notas

- `updated_by` é preenchido automaticamente com o usuário autenticado que fez a requisição.
- Nenhum recurso permite exclusão (`DELETE`) via API.
- O Swagger interativo está disponível em `/docs/` e o schema OpenAPI em `/schema/`.
