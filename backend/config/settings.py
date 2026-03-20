from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv
import os


BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(dotenv_path='stack.env')

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = os.getenv('DEBUG', 'False') == 'True'
TESTING = os.getenv('TESTING', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')


DJANGO_APPS = [
    # 'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

LOCAL_APPS = [
    'apps.users.apps.UsersConfig',
    'apps.automations.apps.AutomationsConfig',
    'apps.executions.apps.ExecutionsConfig',
    'apps.departments.apps.DepartmentsConfig',
    'apps.business.apps.BusinessConfig',
    'apps.positions.apps.PositionsConfig',
]

OTHERS_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'drf_spectacular',  # para swagger UI
    'django_filters',
    # "corsheaders", Sem necessidade de usar o corsheaders, pois o frontend e backend estão no mesmo domínio, caso queira usar em um cenário de domínios separados, descomente essa linha e adicione 'corsheaders.middleware.CorsMiddleware' no MIDDLEWARE
    "silk",
    "simple_history",

]

INSTALLED_APPS = DJANGO_APPS + LOCAL_APPS + OTHERS_APPS

AUTH_USER_MODEL = 'users.User'

MIDDLEWARE = [
    # 'corsheaders.middleware.CorsMiddleware', sem necessidade de usar o corsheaders, pois o frontend e backend estão no mesmo domínio, caso queira usar em um cenário de domínios separados, descomente essa linha
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'silk.middleware.SilkyMiddleware',
    'simple_history.middleware.HistoryRequestMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        # Banco Postgree
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('POSTGRES_DB'),
            'USER': os.getenv('POSTGRES_USER'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
            'HOST': os.getenv('POSTGRES_HOST'),
            'PORT': os.getenv('POSTGRES_PORT'),
        }
    }


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]


LANGUAGE_CODE = os.getenv('LANGUAGE_CODE')

TIME_ZONE = os.getenv('TIME_ZONE')

USE_I18N = True

USE_TZ = False

# ---------------------------------------------------------------------------------------------
# Direção de arquivos estáticos e de mídia
# ---------------------------------------------------------------------------------------------
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.getenv("MEDIA_ROOT")

# ---------------------------------------------------------------------------------------------
# Rest Framework
# ---------------------------------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        "rest_framework.authentication.TokenAuthentication",
        # 'rest_framework.authentication.SessionAuthentication', Sem necessidade de usar a autenticação de sessão, pois o frontend e backend estão no mesmo domínio, caso queira usar em um cenário de domínios separados, descomente essa linha
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
}

# ---------------------------------------------------------------------------------------------
# Swagger UI
# ---------------------------------------------------------------------------------------------
SPECTACULAR_SETTINGS = {
    'TITLE': 'Django Backend API',
    'DESCRIPTION': 'Projeto em django com backend exclusivo para APIs RESTful',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    "SORT_OPERATION_PARAMETERS": False,
}

# ---------------------------------------------------------------------------------------------
# Simple JWT
# ---------------------------------------------------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('JWT_ACCESS_MINUTES', 60))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.getenv('JWT_REFRESH_DAYS', 1))),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ---------------------------------------------------------------------------------------------
# Logs
# ---------------------------------------------------------------------------------------------
if not DEBUG:
    LOGS_DIR = os.getenv('LOG_ROOT', '')
    os.makedirs(LOGS_DIR, exist_ok=True)
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'file': {
                'level': 'INFO',
                'class': 'logging.handlers.TimedRotatingFileHandler',
                'filename': os.path.join(LOGS_DIR, 'django.log'),
                'when': 'midnight',
                'interval': 1,
                'backupCount': 30,
                'encoding': 'utf-8',
                'delay': True,
            },
        },
        'loggers': {
            'django': {
                'handlers': ['file'],
                'level': 'INFO',
                'propagate': True,
            },
        },
    }

# ---------------------------------------------------------------------------------------------
# Cosrs Headers
# ---------------------------------------------------------------------------------------------
if not DEBUG:
    USE_X_FORWARDED_HOST = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    CSRF_TRUSTED_ORIGINS = [
        "https://localhost",
    ]


# configurações de CORS
# CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",") Sem necessidade de usar o corsheaders, pois o frontend e backend estão no mesmo domínio, caso queira usar em um cenário de domínios separados, descomente essa linha e adicione 'corsheaders.middleware.CorsMiddleware' no MIDDLEWARE

# Se você precisar enviar cookies / credenciais:
# CORS_ALLOW_CREDENTIALS = True Sem necessidade de usar o corsheaders, pois o frontend e backend estão no mesmo domínio, caso queira usar em um cenário de domínios separados, descomente essa linha e adicione 'corsheaders.middleware.CorsMiddleware' no MIDDLEWARE

# (opcional) Métodos e headers permitidos — geralmente os defaults já cobrem:
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
