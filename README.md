# Automations Monitor

<div align="center">

[![Django](https://img.shields.io/badge/Django-6.0.3-green?style=flat-square)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square)](https://www.python.org/)
[![DRF](https://img.shields.io/badge/DRF-3.16.1-red?style=flat-square)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#licença)

Plataforma de monitoramento de automações com API RESTful robusta, autenticação JWT e documentação interativa.

[Features](#features) • [Instalação](#instalação) • [Configuração](#configuração) • [API](#api) • [Estrutura](#estrutura-do-projeto)

</div>

---

## 📋 Sobre o Projeto

**Automations Monitor** é uma aplicação web desenvolvida com Django REST Framework que fornece uma plataforma completa para gerenciar e monitorar automações. A aplicação oferece:

- ✅ API RESTful com documentação Swagger interativa
- ✅ Autenticação segura com JWT (JSON Web Tokens)
- ✅ Gerenciamento de usuários personalizado
- ✅ Deployable com Docker e Docker Compose
- ✅ Banco de dados PostgreSQL com alto desempenho
- ✅ Reverse proxy com Nginx e suporte HTTPS
- ✅ Filtros avançados com Django Filters
- ✅ CORS configurável para aplicações frontend

---

## ⚡ Features

### Backend
- **Django REST Framework**: API robusta e profissional
- **JWT Authentication**: Autenticação segura com tokens
- **DRF Spectacular**: Documentação automática (Swagger/OpenAPI)
- **Django Filters**: Filtros avançados para endpoints
- **CORS Support**: Integração com qualquer frontend
- **Custom User Model**: Modelo de usuário personalizado com campos extras

### Infraestrutura
- **Docker & Docker Compose**: Ambiente containerizado completo
- **PostgreSQL 16**: Banco de dados robusto e escalável
- **Nginx**: Reverse proxy com SSL/TLS ready
- **Gunicorn**: WSGI HTTP Server para produção
- **Volumes**: Persistência de dados, mídia e logs

### Segurança
- **Environment Variables**: Configuração sensível via `.env`
- **Django Security Middleware**: Headers de segurança HTTP
- **HTTPS Ready**: Nginx pré-configurado para certificados SSL
- **CSRF Protection**: Proteção contra ataques CSRF

---

## 📦 Requisitos

### Globalais
- **Docker** >= 20.10
- **Docker Compose** >= 2.0

### Desenvolvimento Local
- **Python** >= 3.12
- **PostgreSQL** >= 16
- **pip** ou **conda**

---

## 🚀 Instalação

### Opção 1: Docker Compose (Recomendado)

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/automations_monitor.git
cd automations_monitor
```

#### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,seu-dominio.com

# Database
POSTGRES_DB=automations_monitor
POSTGRES_USER=postgres
POSTGRES_PASSWORD=seu-senha-segura
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django User Padrão
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=seu-senha-segura
```

#### 3. Inicie os serviços
```bash
docker-compose up -d
```

#### 4. Execute migrações e create superuser (se necessário)
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

#### 5. Acesse a aplicação
- **API**: `http://localhost/api/`
- **Swagger**: `http://localhost/api/schema/swagger-ui/`
- **ReDoc**: `http://localhost/api/schema/redoc/`

### Opção 2: Instalação Local

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/automations_monitor.git
cd automations_monitor
```

#### 2. Instale PostgreSQL
- **Windows**: Download em https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql@16`
- **Linux (Ubuntu/Debian)**: `sudo apt-get install postgresql-16`

#### 3. Crie o ambiente virtual
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3.12 -m venv venv
source venv/bin/activate
```

#### 4. Configure variáveis de ambiente
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edite `.env` conforme necessário (banco local, etc)

#### 5. Instale dependências
```bash
pip install -r requirements.txt
```

#### 6. Execute migrações
```bash
python manage.py migrate
```

#### 7. Crie um superuser
```bash
python manage.py createsuperuser
```

#### 8. Inicie servidor de desenvolvimento
```bash
python manage.py runserver
```

Acesse `http://localhost:8000/api/`

---

## ⚙️ Configuração

### Variáveis de Ambiente Essenciais

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SECRET_KEY` | Chave secreta do Django (gere uma segura) | `django-insecure-...` |
| `DEBUG` | Modo debug (sempre `False` em produção) | `False` |
| `ALLOWED_HOSTS` | Hosts permitidos (separados por vírgula) | `localhost,api.exemplo.com` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `senha-segura-aqui` |
| `CORS_ALLOWED_ORIGINS` | Origens CORS permitidas | `http://localhost:3000` |

### Estrutura de Pastas Importantes

```
backend/
├── config/          # Configurações do Django
│   ├── settings.py  # Principais configurações
│   ├── urls.py      # URLs raiz
│   └── urls_api.py  # URLs da API
├── apps/            # Aplicações do projeto
│   └── users/       # App de usuários
├── requirements.txt # Dependências Python
└── manage.py        # Gerenciador do Django
```

---

## 📡 API

### Endpoints Principais

#### Autenticação
```
POST   /api/users/token/           - Obter access token
POST   /api/users/token/refresh/   - Atualizar access token
```

### Documentação Interativa

Acesse a documentação Swagger completa em:
- **Swagger UI**: `/api/schema/swagger-ui/`
- **ReDoc**: `/api/schema/redoc/`
- **OpenAPI JSON**: `/api/schema/`

---

## 📁 Estrutura do Projeto

```
automations_monitor/
│
├── backend/                          # Código Django
│   ├── apps/
│   │   └── users/                    # App de usuários
│   │       ├── api/
│   │       │   ├── views.py          # ViewSets
│   │       │   ├── serializers.py    # Serializers
│   │       │   ├── filters.py        # Filtros
│   │       │   └── urls.py           # Rotas
│   │       ├── models/
│   │       │   └── user.py           # Modelo User
│   │       ├── migrations/           # Migrations DB
│   │       └── apps.py               # Config do app
│   │
│   ├── config/                       # Configurações Django
│   │   ├── settings.py               # Principais settings
│   │   ├── urls.py                   # URLs raiz
│   │   ├── urls_api.py               # URLs API
│   │   ├── wsgi.py                   # WSGI app
│   │   └── asgi.py                   # ASGI app
│   │
│   ├── requirements.txt              # Dependências
│   ├── manage.py                     # Django CLI
│   ├── Dockerfile                    # Imagem Docker
│   └── entrypoint.sh                 # Startup script
│
├── frontend/                         # Aplicação frontend (React, Vue, etc)
│
├── nginx/                            # Configuração Nginx
│   ├── nginx.conf                    # Config Nginx
│   ├── Dockerfile                    # Imagem Nginx
│   └── cert/                         # Certificados SSL
│
├── docker-compose.yml                # Orquestração Docker
├── .env                              # Variáveis de ambiente
├── .env.example                      # Template .env
└── README.md                         # Este arquivo
```

---

## 🐳 Comandos Docker

### Iniciar serviços
```bash
docker-compose up -d
```

### Parar serviços
```bash
docker-compose down
```

### Ver logs
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f db
```

### Executar comando no container
```bash
docker-compose exec backend python manage.py <comando>
docker-compose exec db psql -U postgres -d automations_monitor
```

### Reconstruir imagens
```bash
docker-compose build --no-cache
```

---

## 🔐 Segurança

### Em Produção
- ✅ Configure `DEBUG=False`
- ✅ Gere uma `SECRET_KEY` segura
- ✅ Configure `ALLOWED_HOSTS` corretamente
- ✅ Use HTTPS com certificados válidos
- ✅ Configure postgres com senha forte
- ✅ Restrinja CORS apenas para domínios confiáveis
- ✅ Configure firewall adequadamente

### Gerar SECRET_KEY Segura
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 📊 Modelos de Dados

### User
Modelo de usuário personalizado com campos adicionais:
- `username` - Nome de usuário único
- `email` - Email único
- `first_name` - Primeiro nome
- `last_name` - Sobrenome
- `telephone` - Telefone
- `birthday` - Data de nascimento
- `photo` - Fotografia do perfil
- `is_active` - Usuário ativo
- `is_staff` - Permissões de staff
- Timestamps (created_at, updated_at)

---

## 📝 Development

### Criar uma nova app
```bash
python manage.py startapp nome_da_app
```

### Criar migração
```bash
python manage.py makemigrations
```

### Aplicar migrações
```bash
python manage.py migrate
```

### Recolher arquivos estáticos
```bash
python manage.py collectstatic --noinput
```

### Testar a aplicação
```bash
python manage.py test
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra** um Pull Request

### Diretrizes
- Siga a estrutura de código existente
- Adicione testes para novas features
- Atualize o README se necessário
- Use Django best practices

---

## 📚 Stack Tecnológico

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Linguagem | Python | 3.12 |
| Framework | Django | 6.0.3 |
| API | Django REST Framework | 3.16.1 |
| Autenticação | JWT (SimpleJWT) | 5.5.1 |
| Docs | DRF Spectacular | 0.29.0 |
| Filtros | Django Filters | 25.2 |
| CORS | django-cors-headers | 4.9.0 |
| Banco de Dados | PostgreSQL | 16 |
| Server | Gunicorn | 25.1.0 |
| Proxy | Nginx | Latest |
| Container | Docker | 20.10+ |

---

## 🐛 Troubleshooting

### Erro: "permission denied" ao executar Docker
```bash
# Linux: adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### Erro: "database is locked"
```bash
# Reinicie os containers
docker-compose restart db
```

### Erro: "No module named 'apps'"
```bash
# Tenha certeza que PYTHONPATH está correto
cd backend
export PYTHONPATH="$PWD"
```

### Porta 80/443 já em uso
```bash
# Altere as portas no docker-compose.yml
# De:  ports: ["80:80"]
# Para: ports: ["8080:80"]
```

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

Para suporte, abra uma **issue** no repositório ou entre em contato através de:
- 📧 Email: dev@example.com
- 💬 Issues: https://github.com/seu-usuario/automations_monitor/issues

---

## ✨ Agradecimentos

- Django & Django REST Framework pela excelente documentação
- Comunidade open source Python
- Todos os contribuintes deste projeto

---

<div align="center">

**Feito com ❤️ por [Seu Nome/Equipe]**

⭐ Se este projeto foi útil, considere dar uma star!

</div>
