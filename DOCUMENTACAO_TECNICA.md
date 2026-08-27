# AppCuidaAmor — Documentação Técnica Completa

**Versão:** 1.0  
**Data:** Agosto de 2026  
**Classificação:** Confidencial — Uso Interno

---

## 1. Visão Geral do Sistema

O **AppCuidaAmor** é um aplicativo mobile e web desenvolvido para a empresa **Cuida e Amor Home Care**, com o objetivo de conectar famílias contratantes ao serviço de Home Care.

A plataforma permite que os responsáveis pelos pacientes acompanhem em tempo real:
- Quem está cuidando do familiar
- A escala de cuidadores
- O quadro de saúde do paciente
- Faturas e situação financeira
- Solicitações e comunicações com a empresa

---

## 2. Arquitetura do Sistema

### 2.1 Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework Web | Next.js (App Router) | 16.2.6 |
| Linguagem | TypeScript | 5.x |
| UI | React | 19.2.4 |
| Estilo | Tailwind CSS | v4 |
| Mobile | Capacitor | 8.3.4 |
| ORM | Prisma | 6.19 |
| Banco de Dados | SQL Server (legado SoftCare) | — |
| Autenticação | JWT (biblioteca `jose`) | — |
| Ícones | Lucide React | — |

### 2.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                  CLIENTE (Browser / App)                 │
│                                                          │
│   React 19 + Next.js App Router + Tailwind CSS v4       │
│   Capacitor 8 (Android / iOS)                           │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / HTTPS
                         │ Cookie: mobile_token (httpOnly)
┌────────────────────────▼────────────────────────────────┐
│                   NEXT.JS SERVER                         │
│                                                          │
│  ┌─────────────────┐   ┌──────────────────────────────┐ │
│  │   Middleware     │   │       API Routes             │ │
│  │ (route protect) │   │  /api/auth/login             │ │
│  │                 │   │  /api/auth/logout            │ │
│  │ JWT validation  │   │  /api/dashboard              │ │
│  │ Cookie check    │   │  /api/escala                 │ │
│  └─────────────────┘   │  /api/quadro                 │ │
│                        │  /api/pedidos                │ │
│                        │  /api/solicitacoes           │ │
│                        │  /api/boletos                │ │
│                        │  /api/perfil                 │ │
│                        │  /api/cuidadores-ativos      │ │
│                        └──────────────┬───────────────┘ │
└───────────────────────────────────────┼─────────────────┘
                                        │ Prisma ORM
┌───────────────────────────────────────▼─────────────────┐
│                  SQL SERVER (SoftCare ERP)               │
│                                                          │
│  CLIENTEs │ Senha │ servico │ servico1 │ FichaAnamnese   │
│  Caixa    │ receber│ Cupom  │ Vale1    │ FichaAnamnese_  │
│                                          Medicamento     │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Fluxo de Autenticação

```
Usuário → CPF + Senha
     ↓
POST /api/auth/login
     ↓
Rate Limiter (5 tentativas / 15 min por CPF)
     ↓
Busca CLIENTEs WHERE CPF contains (substring)
     ↓
Filtra match exato (remove pontuações)
     ↓
Busca Senha WHERE CodUsu = cliente.CodUsu
     ↓
Compara senha (compatibilidade banco legado)
     ↓
signToken() → JWT HS256 / TTL 8h
     ↓
Set-Cookie: mobile_token (httpOnly, SameSite=Strict, Secure em prod)
     ↓
Redirect → /
```

---

## 3. Estrutura de Arquivos

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       — Autenticação com rate limiting
│   │   │   └── logout/route.ts      — Limpeza do cookie
│   │   ├── dashboard/route.ts       — Dados da home
│   │   ├── escala/route.ts          — Escala mensal do paciente
│   │   ├── quadro/route.ts          — Quadro de saúde / anamnese
│   │   ├── pedidos/route.ts         — Solicitações tipo Vale
│   │   ├── solicitacoes/route.ts    — Solicitações de escala (Cupom)
│   │   ├── boletos/route.ts         — Situação financeira (Receber)
│   │   ├── perfil/route.ts          — Dados do contratante
│   │   └── cuidadores-ativos/route.ts — Cuidadores com plantões futuros
│   │
│   ├── splash/page.tsx              — Tela de abertura animada
│   ├── onboarding/page.tsx          — Apresentação do app (3 etapas)
│   ├── login/page.tsx               — Autenticação CPF + Senha
│   ├── esqueci-senha/page.tsx       — Recuperação de senha (UI)
│   ├── verificacao/page.tsx         — Código de verificação (UI)
│   ├── nova-senha/page.tsx          — Definir nova senha (UI)
│   ├── (app)/                       — Grupo de rotas protegidas
│   │   ├── layout.tsx               — Layout com BottomNav
│   │   ├── page.tsx                 — Home / Dashboard
│   │   ├── quadro/page.tsx          — Quadro de saúde
│   │   ├── escala/page.tsx          — Escala de cuidadores
│   │   ├── pedidos/page.tsx         — Central de solicitações
│   │   ├── boletos/page.tsx         — Financeiro
│   │   ├── perfil/page.tsx          — Perfil do usuário
│   │   ├── suporte/page.tsx         — Central de ajuda
│   │   └── notificacoes/page.tsx    — Notificações
│   │
│   ├── globals.css                  — Tokens de design, CSS global
│   └── layout.tsx                   — Root layout (meta, viewport, fonts)
│
├── components/
│   ├── ui/                          — Primitivos de UI
│   │   ├── Avatar.tsx               — Avatar com iniciais ou foto
│   │   ├── Button.tsx               — Botões primary/secondary/icon
│   │   ├── Input.tsx                — Input acessível com label, erro, ícone
│   │   ├── StatusBadge.tsx          — Badge de status com pulse opcional
│   │   └── Skeleton.tsx             — Loading skeleton
│   │
│   └── shared/                      — Componentes de domínio
│       ├── MeuFamiliarAgora.tsx     — Card principal da home
│       ├── TimelineCuidado.tsx      — Timeline de eventos
│       ├── BottomNav.tsx            — Navegação inferior
│       └── AppHeader.tsx            — Header padrão das telas
│
├── lib/
│   ├── auth.ts                      — JWT: verifyToken, signToken, AUTH_COOKIE
│   ├── prisma.ts                    — Singleton PrismaClient com slow query log
│   ├── rateLimiter.ts               — Rate limiting em memória por chave
│   └── fetchWithAuth.ts             — Fetch com tratamento automático de 401
│
├── generated/
│   └── client/                      — PrismaClient gerado
│
└── middleware.ts                     — Proteção de rotas (verifica mobile_token)
```

---

## 4. Banco de Dados

O sistema utiliza o banco SQL Server legado do sistema ERP **SoftCare**, via **Prisma ORM** como camada de abstração.

### 4.1 Principais Tabelas Utilizadas

| Tabela | Uso |
|--------|-----|
| `CLIENTEs` | Contratantes E pacientes (diferenciados por `CodCli1`) |
| `Senha` | Credenciais de acesso (campo `CodUsu` → `CLIENTEs.CodUsu`) |
| `servico` | Configuração dos pedidos de serviço (horários, paciente) |
| `servico1` | Plantões individuais (data, cuidador `CodInd`, status) |
| `FichaAnamnese` | Fichas de avaliação de saúde do paciente |
| `FichaAnamnese_Medicamento` | Medicamentos ativos por ficha |
| `receber` | Faturas/cobranças (situação financeira) |
| `Cupom` | Solicitações de alteração de escala |
| `Vale1` | Solicitações gerais do cliente via app |

### 4.2 Relacionamento Contratante ↔ Paciente

```
CLIENTEs (contratante)           CLIENTEs (paciente)
   CodCli = 1001          ←——     CodCli1 = 1001
   Cliente = "João Silva"         Cliente = "Maria Silva"
   CPF = "123.456.789-00"         CodCli = 2050
   CodUsu = 45
```

O campo `CodCli1` no registro do **paciente** aponta para o `CodCli` do **contratante responsável**.

### 4.3 Relacionamento Cuidador ↔ Plantão

```
servico (pedido de serviço)     servico1 (plantão)
   Pedido = 5000           ←——  Pedido = 5000
   Codcli = 2050 (paciente)     Data = 2026-08-26
   HoraInicio = "07:00"         CodInd = 3001  →  CLIENTEs.CodCli = 3001
   HoraSaida = "19:00"          Situacao = "CONFIRMADO"
```

---

## 5. Segurança

### 5.1 Autenticação

- **Mecanismo:** JWT HS256 assinado com `JWT_SECRET` (mínimo 32 caracteres)
- **Armazenamento:** Cookie `mobile_token` com flags `httpOnly`, `SameSite=Strict`, `Secure` (produção)
- **TTL:** 8 horas (sessão diária)
- **Rate Limiting:** 5 tentativas de login por CPF em janela de 15 minutos → bloqueio de 15 minutos

### 5.2 Headers HTTP de Segurança

Configurados globalmente via `next.config.ts`:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Strict-Transport-Security: max-age=63072000 (produção)
```

### 5.3 Proteção de Rotas

O `middleware.ts` intercepta todas as requisições às rotas protegidas e verifica o cookie `mobile_token`. Se ausente ou inválido, redireciona para `/login`.

Rotas públicas (sem autenticação): `/login`, `/splash`, `/onboarding`, `/esqueci-senha`, `/verificacao`, `/nova-senha`.

### 5.4 CPF nos Dados Retornados

O CPF completo nunca é retornado ao frontend. O endpoint `/api/perfil` retorna apenas a versão mascarada: `123.***.***-00`.

---

## 6. APIs

### 6.1 POST /api/auth/login

**Corpo:**
```json
{ "cpf": "12345678900", "senha": "1234" }
```

**Respostas:**
- `200` — Login bem-sucedido, cookie `mobile_token` definido
- `400` — CPF ou senha ausentes / CPF inválido
- `401` — Credenciais incorretas
- `429` — Muitas tentativas (rate limiting)
- `500` — Erro interno

---

### 6.2 GET /api/dashboard

**Auth:** Cookie `mobile_token` obrigatório

**Resposta 200:**
```json
{
  "sucesso": true,
  "responsavel": { "CodCli": 1001, "Cliente": "João" },
  "paciente": { "CodCli": 2050, "Cliente": "Maria", "Caminho": "..." },
  "cuidadorHoje": {
    "Nome": "Ana Paula",
    "HoraInicio": "07:00",
    "HoraSaida": "19:00",
    "Status": "CONFIRMADO"
  },
  "notificacoes": { "boletosPendentes": 1 }
}
```

---

### 6.3 GET /api/escala?year=2026&month=7

**Auth:** Cookie `mobile_token` obrigatório

**Parâmetros:**
- `year` — Ano (padrão: ano atual)
- `month` — Mês 0-based (padrão: mês atual)

**Resposta 200:**
```json
{
  "sucesso": true,
  "responsavel": "João Silva",
  "iniciais": "JS",
  "plantoes": [
    {
      "id": 10001,
      "data": "2026-08-26T00:00:00.000Z",
      "horaInicio": "07:00",
      "horaSaida": "19:00",
      "cuidador": "Ana Paula",
      "status": "CONFIRMADO",
      "pedido": 5000
    }
  ]
}
```

---

### 6.4 GET /api/quadro

**Auth:** Cookie `mobile_token` obrigatório

Retorna as fichas de anamnese do paciente vinculado, incluindo medicamentos ativos.

---

### 6.5 GET /api/pedidos

**Auth:** Cookie `mobile_token` obrigatório

Lista as solicitações abertas pelo usuário (tabela `Vale1`).

---

### 6.6 POST /api/pedidos

**Auth:** Cookie `mobile_token` obrigatório

**Corpo:**
```json
{ "descricao": "Troca de cuidadora", "complemento": "Motivo detalhado..." }
```

Cria nova solicitação na tabela `Vale1`.

---

### 6.7 GET /api/solicitacoes

Lista solicitações de escala (tabela `Cupom`) do usuário.

---

### 6.8 POST /api/solicitacoes

**Corpo:**
```json
{
  "tipo": "FOLGA",
  "cuidadorId": 3001,
  "datasFolga": ["2026-09-01", "2026-09-02"],
  "observacao": "Feriado"
}
```

Tipos válidos: `FOLGA`, `REMOVER`, `ALTERAR`, `OUTRA`.

---

### 6.9 GET /api/boletos

Retorna situação financeira do contratante (tabela `receber`).

---

### 6.10 GET /api/perfil

Retorna dados do perfil do contratante com CPF mascarado.

---

## 7. Configuração e Deploy

### 7.1 Variáveis de Ambiente (.env)

```env
# Banco de dados SQL Server (SoftCare)
DATABASE_URL="sqlserver://HOST:PORT;database=NOME_DB;user=USUARIO;password=SENHA;encrypt=false"

# JWT — mínimo 32 caracteres, gerado aleatoriamente
JWT_SECRET="chave-secreta-aleatoria-minimo-32-chars"
```

### 7.2 Instalação e Execução

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm run start
```

### 7.3 Build Mobile (Capacitor)

```bash
# Build da aplicação web
npm run build

# Sincronizar com Capacitor
npx cap sync android
npx cap sync ios

# Abrir no Android Studio
npx cap open android

# Abrir no Xcode
npx cap open ios
```

---

## 8. Acessibilidade

O aplicativo segue as diretrizes **WCAG 2.1 nível AA**:

- Labels associadas a inputs via `htmlFor` + `id` (WCAG 1.3.1)
- `aria-invalid` e `aria-describedby` em campos com erro
- `aria-label` em botões sem texto visível
- Ícones decorativos com `aria-hidden="true"`
- Zoom do usuário habilitado (WCAG 1.4.4)
- Contraste de cores verificado
- Touch targets mínimos de 44×44px

---

## 9. Performance

### 9.1 Otimizações Implementadas

- **Queries em paralelo** com `Promise.all` no dashboard
- **N+1 eliminado** na escala: busca de cuidadores em batch (1 query vs. N queries)
- **Select explícito** em todas as queries Prisma (sem `SELECT *`)
- **Limite de resultados** (`take: 30`) em listas paginadas
- **Slow query log** ativo em desenvolvimento (queries > 500ms)

### 9.2 Índices do Banco Verificados

A tabela `CLIENTEs` possui índices nos campos utilizados nas queries principais. Nenhum índice adicional foi necessário para a escala atual de uso.

---

## 10. Limitações Conhecidas

| Item | Status | Dependência |
|------|--------|-------------|
| Senhas em plain-text no banco | Legado ERP SoftCare | Coordenação com time ERP |
| Recuperação de senha real | Interface criada, lógica pendente | Infraestrutura de e-mail |
| Boletos com dados reais | Interface criada, dados mockados | API Caixa Econômica Federal |
| Notificações push | Não implementado | Backend de notificações |

---

## 11. Glossário

| Termo | Significado |
|-------|-------------|
| Contratante | Familiar responsável que contrata o serviço |
| Paciente | Familiar assistido (idoso, acamado, etc.) |
| Cuidador | Profissional de Home Care escalado |
| Plantão | Período de trabalho de um cuidador em uma data |
| Pedido | Configuração de serviço (horários, paciente) |
| Solicitação | Comunicação do contratante com a empresa |
| Cupom | Registro de solicitação de alteração de escala no ERP |
| Vale1 | Registro de solicitação genérica no ERP |

---

*Documento gerado em Agosto de 2026 — AppCuidaAmor v1.0*
