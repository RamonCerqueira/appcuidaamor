# Design System: AppCuidaAmor "Care Premium"
**Versão:** 2.0.0  
**Conceito:** Cuidado Humanizado, Elegância Corporativa, Clareza Visual e Mobile First.

---

## 1. Paleta de Cores & Tokens

A paleta de cores foi extraída e calibrada a partir do logotipo oficial da **Cuida e Amor** (`#E0428C` e `#6CC5D5`), garantindo contraste acessível (WCAG AA/AAA) e uma estética acolhedora, sem parecer infantil ou excessivamente saturada.

### 💖 Primária (Identidade da Marca & Ações Principais)
* `--color-brand-primary`: `#E0428C` (Rosa Oficial Cuida e Amor)
* `--color-brand-primary-dark`: `#B8286A` (Hover / Active / Botões de ênfase)
* `--color-brand-primary-light`: `#F77CB4` (Bordas de foco / Badges)
* `--color-brand-primary-soft`: `#FDF2F7` (Superfícies ativas / Fundos de ícones)
* `--color-brand-primary-subtle`: `#FFF5F9` (Pills secundárias)

### 🩵 Secundária (Cuidado / Apoio / Badges)
* `--color-brand-secondary`: `#2DA3B8` (Ciano calibrado para contraste de texto)
* `--color-brand-secondary-light`: `#6CC5D5` (Ciano Oficial da logo)
* `--color-brand-secondary-soft`: `#F0F9FB` (Fundos suaves de plantão e saúde)

### 🌿 Semânticas & Suporte
* **Sucesso / Ativo / Confirmado:**
  * Base: `#10B981` (Emerald 500)
  * Dark: `#047857` (Emerald 700)
  * Soft: `#ECFDF5` (Emerald 50)
* **Atenção / Pendente / Em Análise:**
  * Base: `#F59E0B` (Amber 500)
  * Dark: `#B45309` (Amber 700)
  * Soft: `#FFFBEB` (Amber 50)
* **Alerta / Recusado / Perigo:**
  * Base: `#EF4444` (Rose/Red 500)
  * Dark: `#B91C1C` (Red 700)
  * Soft: `#FEF2F2` (Red 50)
* **Informativo / Consulta:**
  * Base: `#3B82F6` (Blue 500)
  * Soft: `#EFF6FF` (Blue 50)

### 🔲 Superfícies & Neutros (Fundo "Care Clean")
* `--color-brand-background`: `#F8FAFC` (Slate 50 ultra suave)
* `--color-brand-surface`: `#FFFFFF` (Branco puro para cards)
* `--color-brand-surface-elevated`: `#FFFFFF` (Cards suspensos com sombra suave)
* `--color-brand-surface-muted`: `#F1F5F9` (Fundo de inputs e divisores)
* `--color-brand-border`: `#E2E8F0` (Borda neutra sutil)
* `--color-brand-border-subtle`: `#F1F5F9` (Borda interna)
* `--color-brand-text`: `#1E293B` (Slate 800 - Leitura confortável de alto contraste)
* `--color-brand-text-secondary`: `#475569` (Slate 600 - Subtítulos e dados)
* `--color-brand-text-muted`: `#94A3B8` (Slate 400 - Labels e metadados)

---

## 2. Tipografia

Hierarquia tipográfica utilizando fontes sans-serif premium (`Plus Jakarta Sans` para UI de precisão e `Outfit` para títulos e números destacados):

| Estilo | Peso | Tamanho | Line Height | Aplicação |
| :--- | :---: | :---: | :---: | :--- |
| **Display** | Black (900) | `32px` (`2rem`) | `1.1` | Valores de faturas, Splash, Scores |
| **Heading 1** | ExtraBold (800) | `24px` (`1.5rem`) | `1.2` | Título da tela no Header, Nomes principais |
| **Heading 2** | Bold (700) | `18px` (`1.125rem`) | `1.3` | Cabeçalhos de seção, Nomes de cards |
| **Heading 3** | SemiBold (600) | `15px` (`0.9375rem`) | `1.4` | Títulos internos de itens, Modais |
| **Body Large**| Medium (500) | `15px` (`0.9375rem`) | `1.5` | Textos de leitura primária, Inputs |
| **Body** | Regular (400) / Med (500) | `14px` (`0.875rem`) | `1.5` | Descrições, Notificações, Histórico |
| **Body Small**| Regular (400) | `12px` (`0.75rem`) | `1.4` | Legendas, Horários, Informações de apoio |
| **Caption** | SemiBold (600) | `11px` (`0.6875rem`) | `1.3` | Badges, Status, Iniciais |
| **Label** | ExtraBold (800) | `10px` (`0.625rem`) | `1.2` | Rótulos UPPERCASE com tracking amplo (`tracking-wider`) |

---

## 3. Escala de Espaçamento & Grid

* `4px` (`p-1` / `gap-1`): Micro-espaçamentos de ícones e indicadores
* `8px` (`p-2` / `gap-2`): Espaçamento de chips e badges
* `12px` (`p-3` / `gap-3`): Espaçamento interno compacto
* `16px` (`p-4` / `gap-4`): Padding padrão de cards e formulários
* `20px` (`p-5` / `gap-5`): Espaçamento entre seções e margins laterais do app
* `24px` (`p-6` / `gap-6`): Padding de containers principais e modais
* `32px` (`p-8` / `gap-8`): Margem superior de telas
* `Safe Bottom Area`: `pb-28` para acomodar o `BottomNav` flutuante sem sobrepor conteúdo

---

## 4. Bordas & Radius

* **Radius Sm (`rounded-lg` - 8px):** Tags, badges, checkboxes
* **Radius Md (`rounded-xl` - 12px):** Inputs, botões de ação secundária
* **Radius Lg (`rounded-2xl` - 16px):** Botões principais, cards de item
* **Radius Xl (`rounded-3xl` - 24px):** Cards principais de paciente, cuidadores e faturas
* **Radius 2Xl (`rounded-[2rem]` - 32px):** Modais e Bottom Sheets
* **Radius Full (`rounded-full`):** Avatares, floating action buttons e pills de status

---

## 5. Elevação & Sombras (Subtle & Clean)

* **Nível 0 (Flat):** `border border-slate-100` (Cards neutros)
* **Nível 1 (Soft):** `shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-slate-100` (Cards de lista)
* **Nível 2 (Elevated):** `shadow-[0_8px_24px_-4px_rgba(224,66,140,0.08)] border border-pink-50` (PatientCard & CuidadorHoje)
* **Nível 3 (Floating):** `shadow-[0_12px_36px_-6px_rgba(0,0,0,0.1)]` (BottomNav & Modais)

---

## 6. Componentes Principais Padronizados

1. **`AppHeader`**: Cabeçalho fixo com safe-area, saudação personalizada, avatar com iniciais e sino de notificações com dot.
2. **`BottomNav`**: Barra de navegação com 5 destinos: `Início`, `Saúde`, `Escala`, `Pedidos` e `Mais` (que abre o BottomSheet nativo para Financeiro, Notificações, Perfil e Suporte).
3. **`PatientCard`**: Card de acolhimento com avatar/foto do idoso, nome completo, status de monitoramento e atalho de saúde.
4. **`CaregiverStatus` (Quem está cuidando agora)**: Destaque com foto/avatar, horário do turno (ex: 07:00 — 19:00), badge de plantão ativo e link direto para a escala.
5. **`VitalityCard`**: Medidor circular ou progress visual de score de saúde (ex: 85%) com data da última avaliação.
6. **`StatusBadge`**: Pill uniforme para indicar `Em Análise`, `ACEITO`, `RECUSADO`, `Confirmado`, `Agendado`, `Pago`, `Aberto`.
7. **`Skeleton` / `LoadingState`**: Estrutura fantasma que reproduz com precisão o formato real de cada card.
8. **`EmptyState`**: Mensagens humanizadas com ícones suaves e botões de ação para listas vazias.
9. **`BottomSheet` / `Modal`**: Gaveta inferior animada para seleção rápida de ações e filtros.
10. **`Toast`**: Notificação flutuante de feedback de sucesso, cópia ou erro.
