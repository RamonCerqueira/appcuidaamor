# Relatório de Auditoria Técnica de Frontend: AppCuidaAmor
**Data:** 26 de Agosto de 2026  
**Objetivo:** Mapeamento minucioso de arquitetura, telas, componentes, APIs, fluxos de navegação, inconsistências visuais e plano de redesign "Care Premium" para o aplicativo mobile da empresa **Cuida e Amor**.

---

## 1. Visão Geral da Arquitetura Atual

* **Framework:** Next.js 16.2.6 (App Router) + React 19.2.4 + TypeScript 5
* **Estilização:** Tailwind CSS v4 (`@tailwindcss/postcss`) + PostCSS
* **Empacotamento Mobile:** Capacitor 8.3.4 (Android / iOS)
* **Tipografia Atual:** `Plus_Jakarta_Sans` e `Outfit` via `next/font/google`
* **Ícones:** `lucide-react` (1.16.0)
* **ORM & Banco:** Prisma 6.19.3 com conexão direta a banco legado SQL Server
* **Autenticação:** Tokens JWT assinados com `jose` (HS256) armazenados no cookie HTTP-only `mobile_token`

---

## 2. Inventário de Telas e Rotas Físicas

| Rota | Arquivo Físico | Papel / Finalidade | Status / Avaliação Atual |
| :--- | :--- | :--- | :--- |
| `/splash` | `src/app/splash/page.tsx` | Tela de abertura animada com canvas 2D de corações flutuantes. | Funcional, mas pode ser mais sofisticada e refinada para parecer corporativa. |
| `/onboarding` | `src/app/onboarding/page.tsx` | Carrossel de 3 etapas com swipe gesture para apresentação da proposta de valor. | Funcional com imagens estáticas; precisa de acabamento tipográfico e alinhamento de tokens. |
| `/login` | `src/app/login/page.tsx` | Formulário de entrada por CPF e senha vinculado a `/api/auth/login`. | Funcional, mas visual simples de formulário web em vez de tela de login mobile premium. |
| `/esqueci-senha` | `src/app/esqueci-senha/page.tsx` | Solicitação de CPF para disparo de PIN de recuperação. | Simulação funcional via timer; formulário genérico. |
| `/verificacao` | `src/app/verificacao/page.tsx` | Entrada de código PIN de 6 dígitos com auto-focus. | Boa lógica de teclado/focus, porém layout desconectado do shell global. |
| `/nova-senha` | `src/app/nova-senha/page.tsx` | Redefinição e confirmação da nova credencial de acesso. | Funcional, com validação de match básica. |
| `/` (Home) | `src/app/page.tsx` | Painel principal: idoso assistido, plantonista do dia, atalhos de Saúde e Financeiro. | Funcional via `/api/dashboard`, mas com hierarquia de cards simples e pouca densidade de valor. |
| `/quadro` | `src/app/quadro/page.tsx` | Prontuário médico, hábitos, patologias, gráfico vetorial de score e timeline de evolução. | Funcional via `/api/quadro`, mas visual sobrecarregado e gráfico com styling rudimentar. |
| `/escala` | `src/app/escala/page.tsx` | Escala mensal em grade de calendário e lista de plantonistas. | Funcional via `/api/escala`, falta abertura de bottom sheet ao tocar no dia e refinamento de status. |
| `/pedidos` | `src/app/pedidos/page.tsx` | Central de solicitações (Remover cuidadora, alterar escala, folgas em calendário). | Lógica avançada no modal de folga via `/api/solicitacoes`, mas modal inline pesado e histórico simples. |
| `/boletos` | `src/app/boletos/page.tsx` | Gestão de faturas abertas, cópia de código de barras e histórico pago. | Funcional via `/api/boletos`, botão de cópia com clipboard e PDF; falta polimento visual financeiro. |
| `/perfil` | `src/app/perfil/page.tsx` | Dados do titular, paciente vinculado, e-mail e ação de logout. | Funcional via `/api/perfil` e `/api/auth/logout`, layout com visual básico de lista. |
| `/suporte` | `src/app/suporte/page.tsx` | Canais diretos de atendimento (WhatsApp, telefone `tel:`, e-mail `mailto:` e endereço). | Funcional com links nativos; pode se transformar em uma central de suporte muito mais nobre. |
| `/notificacoes` | `src/app/notificacoes/page.tsx` | Central de comunicados e alertas. | Mockada no frontend, precisa de categorização (informativo, financeiro, escala) e empty state. |

---

## 3. Inventário de Componentes Existentes

Atualmente o projeto possui apenas **2 componentes globais** em `src/components/`:
1. `BottomNav.tsx`: Navegação inferior com 4 abas fixas e um menu popup flutuante.
2. `Header.tsx`: Cabeçalho superior com título, subtítulo e botão de perfil.

### ⚠️ Diagnóstico de Componentização:
* **Inexistência de Design System estruturado**: Não existem componentes atômicos como `PatientCard`, `CaregiverCard`, `VitalityCard`, `HealthSummary`, `MedicationCard`, `ScheduleCard`, `InvoiceCard`, `RequestCard`, `NotificationItem`, `Timeline`, `StatusBadge`, `Avatar`, `BottomSheet`, `Modal`, `Skeleton`, `EmptyState`, `ErrorState`, `Toast`, `PrimaryButton`, `Input`, etc.
* **Código Duplicado nas Páginas**: Cada página recria inputs, botões, modais, headers e alertas com dezenas de classes Tailwind inline arbitrárias.

---

## 4. Análise de Identidade Visual e Inconsistências de Cores

Na análise vetorial do logotipo oficial (`public/logo01.svg`):
* **Rosa Oficial da Marca:** `#E0428C`
* **Ciano/Teal Oficial da Marca:** `#6CC5D5`

### Problemas encontrados no código atual:
* O arquivo `src/app/globals.css` definiu `--color-brand-primary: #F472B6;`, que é um rosa pastel genérico do Tailwind, perdendo a força, contraste e elegância do rosa corporativo `#E0428C`.
* Existem tons de cinza, azuis e verdes declarados arbitrariamente em cada tela (`bg-pink-50`, `bg-pink-100`, `text-pink-500`, `bg-emerald-50`, `bg-amber-50`, `bg-blue-50`, etc.).
* O Design System precisa unificar esses tokens sob uma paleta **"Care Premium"**, com fundo claro, superfícies brancas com bordas ultra-finas, elevações discretas e o rosa atuando como cor de identidade, foco e ação.

---

## 5. Mapeamento de APIs e Dependências de Backend

Todas as chamadas existentes de API estão funcionando com segurança JWT:
1. `POST /api/auth/login`: Autenticação e definição de cookie `mobile_token`.
2. `POST /api/auth/logout`: Limpeza segura do cookie de sessão.
3. `GET /api/dashboard`: Retorna titular, paciente principal (`CodCli1`), plantonista do dia e boletos atrasados.
4. `GET /api/quadro`: Retorna a anamnese mais recente e histórico de evoluções mensais (`FichaAnamnese`).
5. `GET /api/escala?year=X&month=Y`: Retorna os plantões do paciente para o mês.
6. `GET /api/cuidadores-ativos`: Retorna cuidadores vinculados para seleção em pedidos de folga/troca.
7. `GET /api/solicitacoes` & `POST /api/solicitacoes`: Histórico e gravação de chamados na tabela `Cupom`.
8. `GET /api/boletos`: Retorna faturas abertas e pagas.
9. `GET /api/perfil`: Retorna os dados do titular cadastrado.

---

## 6. Riscos & Oportunidades Identificadas

### Riscos:
1. **Quebra de Lógica em Telas Críticas:** `/pedidos` possui lógica de seleção de múltiplos dias de folga cruzando com plantões reais do cuidador. Devemos preservar 100% dessa mecânica.
2. **Capacitor & Mobile Safe Areas:** A barra de status e barra de navegação dos celulares podem sobrepor o header ou o `BottomNav` se o espaçamento e viewport não utilizarem as variáveis de safe-area corretas (`pb-safe`, `pt-safe`).
3. **Middleware de Proteção de Rotas:** O arquivo `src/proxy.ts` está isolado e não está configurado como `src/middleware.ts` nativo do Next.js.

### Oportunidades de Redesign:
1. **Design System Centralizado:** Criar uma pasta `src/components/ui/` e `src/components/shared/` com todos os componentes essenciais reutilizáveis.
2. **App Shell Mobile Nativo:** Layout envelopado com transições suaves, Bottom Sheet nativo para o menu "Mais", e cabeçalhos contextuais elegantes.
3. **Dashboard de Alto Impacto:** Transformar a Home em um cartão de visitas de excelência da empresa (status do paciente, status em tempo real do cuidador "Quem está cuidando agora", vitalidade com donut chart e ações rápidas).
4. **Estados Completos:** Adicionar Skeletons fieis ao layout em todas as páginas, Empty States acolhedores e sistema de feedback Toast.
