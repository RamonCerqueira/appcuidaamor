<!-- BEGIN:nextjs-agent-rules -->
# APP CUIDA E AMOR — REDESIGN FRONTEND FULL MASTER

## MISSÃO

Você é um agente sênior especializado em:

* UI/UX Mobile
* Product Design
* Design Systems
* React
* Next.js
* Tailwind CSS
* Capacitor
* acessibilidade
* animações de interface
* arquitetura frontend
* aplicativos mobile premium
* produtos digitais de saúde e Home Care

Sua missão é transformar o **frontend existente do AppCuidaAmor** em um aplicativo mobile premium, moderno, confiável, sofisticado e digno de uma grande empresa de Home Care.

O projeto já possui:

* frontend funcional;
* backend funcional;
* APIs;
* autenticação;
* integração Prisma;
* SQL Server legado;
* regras de negócio;
* telas;
* navegação;
* integração Capacitor.

## REGRA ABSOLUTA

### NÃO REFAÇA O SISTEMA DO ZERO.

Antes de modificar qualquer coisa:

1. leia a estrutura completa do projeto;
2. identifique todas as páginas;
3. identifique todos os componentes;
4. identifique todos os hooks;
5. identifique todos os providers;
6. identifique todas as APIs;
7. identifique os tipos;
8. identifique os serviços;
9. identifique a autenticação;
10. identifique as integrações;
11. identifique o fluxo de navegação;
12. identifique os dados utilizados por cada tela;
13. identifique as regras existentes.

Preserve a lógica existente.

O objetivo principal é:

> TRANSFORMAR A EXPERIÊNCIA VISUAL E UX DO PRODUTO SEM QUEBRAR A LÓGICA EXISTENTE.

---

# 1. STACK EXISTENTE

Respeite a stack atual do projeto.

Tecnologias identificadas:

* Next.js 16.2.6
* React 19.2.4
* TypeScript
* Tailwind CSS v4
* Capacitor 8.3.4
* Prisma ORM 6.19
* SQL Server
* App Router
* JWT
* biblioteca `jose`
* cookie HTTP-only `mobile_token`
* Lucide Icons

Não substitua tecnologias sem necessidade.

Não introduza uma biblioteca pesada apenas para resolver algo que pode ser feito com as tecnologias já existentes.

---

# 2. OBJETIVO DO REDESIGN

O aplicativo atualmente funciona.

Agora ele precisa parecer um produto de grande empresa.

Não quero:

* aparência de sistema administrativo;
* aparência de site responsivo;
* aparência de dashboard genérico;
* excesso de cards;
* interfaces genéricas feitas com Tailwind;
* excesso de gradientes;
* excesso de sombras;
* excesso de bordas;
* botões gigantes sem propósito;
* visual infantil;
* visual excessivamente feminino;
* visual de aplicativo genérico de saúde.

Quero:

> PREMIUM + HUMANIZADO + CORPORATIVO + MODERNO + CONFIÁVEL + MOBILE FIRST.

O usuário precisa sentir que está usando o aplicativo oficial de uma empresa profissional de Home Care.

---

# 3. IDENTIDADE VISUAL

A identidade da empresa utiliza:

## ROSA

O rosa é a cor principal da marca Cuida e Amor.

Portanto:

### NÃO crie uma identidade azul.

### NÃO substitua o rosa por roxo.

### NÃO transforme o aplicativo em uma interface totalmente rosa.

O rosa deve funcionar como:

* identidade da marca;
* cor de ação;
* destaque;
* navegação ativa;
* indicadores;
* elementos importantes;
* estados selecionados;
* detalhes visuais.

A interface deve utilizar bastante:

* branco;
* rosa extremamente claro;
* tons neutros;
* grafite;
* cinza;
* superfícies claras.

O resultado deve ser elegante.

---

# 4. FILOSOFIA VISUAL

Utilize o conceito:

## "Care Premium"

A interface deve transmitir:

* cuidado;
* confiança;
* segurança;
* acolhimento;
* profissionalismo;
* tecnologia;
* organização;
* tranquilidade.

O aplicativo não deve parecer uma rede social.

Também não deve parecer uma fintech.

Deve parecer um produto premium de Home Care.

---

# 5. DESIGN SYSTEM

Antes de redesenhar todas as telas, crie ou reorganize um Design System centralizado.

Criar tokens para:

## Cores

Exemplo conceitual:

```text
Primary
Primary Dark
Primary Light
Primary Soft
Background
Surface
Surface Elevated
Text Primary
Text Secondary
Text Muted
Border
Success
Warning
Danger
Info
```

IMPORTANTE:

Os valores finais dos tons de rosa devem ser escolhidos analisando a identidade visual existente e o logo disponível no projeto.

Não inventar uma cor aleatória.

Garantir contraste WCAG.

---

# 6. TIPOGRAFIA

Utilizar uma tipografia moderna, extremamente legível e adequada para aplicativo mobile.

Hierarquia:

```text
Display
Heading 1
Heading 2
Heading 3
Body Large
Body
Body Small
Caption
Label
```

Evitar fontes decorativas.

A leitura deve ser excelente para usuários de diferentes idades.

---

# 7. ESPAÇAMENTO

Criar uma escala consistente.

Exemplo:

```text
4
8
12
16
20
24
32
40
48
64
```

Não utilizar valores aleatórios espalhados pelo projeto.

---

# 8. BORDER RADIUS

Utilizar cantos modernos, mas sem exagero.

Evitar:

* tudo excessivamente arredondado;
* cards com aparência infantil;
* elementos completamente pill sem necessidade.

Usar radius de maneira hierárquica.

---

# 9. SOMBRAS

Usar sombras extremamente discretas.

Priorizar:

* contraste;
* bordas;
* hierarquia;
* elevação através de superfície.

Não transformar cada componente em uma caixa com sombra.

---

# 10. ÍCONES

Utilizar Lucide Icons.

Manter:

* tamanho consistente;
* stroke consistente;
* alinhamento;
* espaçamento.

Não misturar famílias diferentes de ícones.

---

# 11. COMPONENTES PRINCIPAIS

Criar/reorganizar componentes reutilizáveis:

```text
AppHeader
PageHeader
PatientHeader
PatientCard
CaregiverCard
CaregiverStatus
VitalityCard
HealthSummary
MedicationCard
ScheduleCard
ScheduleDay
ScheduleList
InvoiceCard
RequestCard
NotificationItem
DocumentCard
Timeline
StatusBadge
Avatar
SearchBar
SegmentedControl
Calendar
BottomSheet
Modal
ConfirmDialog
Toast
Skeleton
EmptyState
ErrorState
OfflineState
LoadingState
PrimaryButton
SecondaryButton
IconButton
Input
Select
```

Não duplicar componentes entre páginas.

---

# 12. DASHBOARD

Redesenhar completamente `/`.

A Home deve ser a tela mais importante do aplicativo.

Estrutura recomendada:

```text
HEADER

Olá, [nome]

[avatar]
[notificações]

────────────────────

PACIENTE

[foto/avatar]

Nome do paciente

● Assistência ativa

────────────────────

CUIDADO AGORA

Foto da cuidadora

Nome
Cuidadora

● Em plantão

07:00 — 19:00

[Ver escala]

────────────────────

VISÃO DE SAÚDE

Vitalidade
86%

[Ver quadro de saúde]

────────────────────

ACESSO RÁPIDO

Saúde
Escala
Financeiro
Pedidos

────────────────────

PRÓXIMO PLANTÃO

Data
Horário
Cuidador

────────────────────

ATUALIZAÇÕES

Últimas notificações

────────────────────

BOTTOM NAV
```

A Home deve ser visualmente excelente.

Não colocar todas as informações existentes simultaneamente.

Criar hierarquia.

---

# 13. PACIENTE

Criar uma experiência visual forte para o paciente assistido.

O paciente deve ser uma entidade central do aplicativo.

Utilizar:

* avatar/foto;
* nome;
* status;
* informações essenciais;
* vitalidade;
* cuidador atual;
* próximo plantão.

Criar um componente reutilizável:

```text
PatientCard
```

---

# 14. CUIDADOR ATUAL

Criar uma área visual:

## QUEM ESTÁ CUIDANDO AGORA?

Mostrar:

* foto/avatar;
* nome;
* função;
* status;
* início do plantão;
* término;
* ações permitidas.

Exemplo:

```text
Ana Paula
Cuidadora

● Em plantão

07:00 — 19:00

[Ver escala]
```

Não inventar informações que a API não fornece.

---

# 15. QUADRO DE SAÚDE

Redesenhar `/quadro`.

A tela deve parecer uma central de informações de saúde, mas sem aparência hospitalar fria.

Estrutura:

```text
Quadro de Saúde

Paciente

────────────────

Vitalidade

86%

Status
Estável

────────────────

Medicamentos

5 ativos

────────────────

Hábitos

Alimentação
Atividade física

────────────────

Patologias

...

────────────────

Evoluções

Timeline

────────────────
```

Utilizar visualizações gráficas apenas quando realmente úteis.

Não exagerar em gráficos.

---

# 16. VITALIDADE

O indicador de vitalidade deve ser visualmente premium.

Pode utilizar:

* progress ring;
* indicador circular;
* gráfico;
* evolução histórica.

Mostrar:

```text
86%

Boa condição

Última avaliação
26/08/2026
```

Não inventar interpretações médicas.

Se o backend não fornece determinada interpretação, não criar artificialmente.

---

# 17. MEDICAMENTOS

Criar cards extremamente claros.

Cada medicamento pode apresentar:

* nome;
* horário;
* frequência;
* informações existentes;
* status.

Não inventar informações médicas.

Priorizar legibilidade.

---

# 18. ESCALA

Redesenhar `/escala`.

A experiência deve funcionar muito bem no mobile.

Criar:

```text
Escala

Agosto 2026

< Agosto >

[Calendário] [Lista]
```

No calendário:

* dias de plantão;
* cuidador;
* status;
* indicação visual clara.

Na lista:

```text
26 AGO

07:00 — 19:00

Ana Paula
● Confirmado
```

Criar uma experiência visual premium.

---

# 19. ESCALA — DETALHAMENTO

Ao tocar em um dia:

abrir Bottom Sheet ou tela de detalhes.

Mostrar:

```text
26 de Agosto

Cuidadora
Ana Paula

07:00 — 19:00

Status
Confirmado

[Ver detalhes]
```

Não criar informações que não existem.

---

# 20. PEDIDOS

Redesenhar `/pedidos`.

Transformar em uma verdadeira Central de Solicitações.

Criar:

```text
Minhas solicitações

[ + Nova solicitação ]

────────────────

#10291

Troca de cuidadora

● Em análise

Solicitado
26/08/2026

[Ver detalhes]
```

---

# 21. TIMELINE DE SOLICITAÇÃO

Quando houver informações suficientes:

```text
Solicitação

Troca de cuidadora

────────────────

26 AGO
Solicitação aberta

26 AGO
Recebida pela equipe

26 AGO
Em análise

● Aguardando resposta
```

Utilizar os dados reais existentes.

Não fabricar eventos.

Se a tabela Cupom não possui histórico detalhado, não fingir que possui.

---

# 22. FINANCEIRO

Redesenhar `/boletos`.

O financeiro deve transmitir:

* segurança;
* clareza;
* organização.

Criar destaque para:

```text
Fatura atual

R$ XXXXX

Vencimento
XX/XX/XXXX

Status

[Copiar código]
[Visualizar boleto]
```

Depois:

```text
Histórico
```

Com lista de faturas.

---

# 23. DOCUMENTOS

Se houver infraestrutura/API suficiente, preparar visualmente uma área:

```text
Documentos

Contrato
Recibos
Relatórios
Comprovantes
Outros
```

Não implementar backend inexistente.

Se os dados ainda não estiverem disponíveis:

criar somente a estrutura visual quando isso não quebrar o produto.

---

# 24. NOTIFICAÇÕES

Redesenhar `/notificacoes`.

Criar:

```text
Notificações

Todas
Não lidas

────────────────

Hoje

Nova atualização de escala

Sua escala foi atualizada.

10 min

────────────────

Ontem

Nova fatura disponível

...
```

Separar visualmente:

* informação;
* sucesso;
* atenção;
* importante.

---

# 25. PERFIL

Redesenhar `/perfil`.

Organizar em grupos:

```text
Minha conta

[Avatar]

Nome
CPF

────────────────

Paciente assistido

Maria

────────────────

Conta

Dados pessoais
Segurança
Preferências

────────────────

Ajuda

Central de ajuda
Suporte

────────────────

Sair
```

---

# 26. SUPORTE

Redesenhar `/suporte`.

Criar uma experiência realmente profissional.

```text
Central de Ajuda

Como podemos ajudar?

[Pesquisar]

Perguntas frequentes

▸ Escala
▸ Pagamentos
▸ Solicitações
▸ Conta

────────────────

Precisa falar conosco?

[WhatsApp]
[Ligar]
[E-mail]
```

Utilizar os canais existentes.

---

# 27. LOGIN

Redesenhar `/login`.

O login deve parecer aplicativo de empresa grande.

Estrutura:

```text
LOGO

Cuida e Amor

Cuidado que conecta famílias.

CPF

Senha

[ Entrar ]

Esqueci minha senha
```

Não remover funcionalidades existentes.

Manter as regras atuais.

---

# 28. RECUPERAÇÃO DE SENHA

Redesenhar:

```text
/esqueci-senha
/verificacao
/nova-senha
```

Criar um fluxo visual contínuo.

Utilizar:

* progress indicator;
* código de 6 dígitos;
* auto focus;
* teclado adequado;
* feedback;
* estados de erro;
* sucesso.

---

# 29. SPLASH

Redesenhar `/splash`.

Preservar a ideia existente de:

* partículas;
* corações;
* animação;
* identidade Cuida e Amor.

Porém reduzir o excesso visual.

A splash precisa parecer:

## PREMIUM

Não infantil.

Usar o rosa da identidade.

---

# 30. ONBOARDING

Redesenhar `/onboarding`.

Manter as 3 etapas existentes.

Criar:

* ilustrações/imagens adequadas;
* progress indicator;
* swipe;
* botão continuar;
* pular;
* animações suaves.

Não bloquear usuários que já concluíram o onboarding.

---

# 31. BOTTOM NAVIGATION

Redesenhar o BottomNav.

Não tentar colocar todos os módulos.

Priorizar:

```text
Início
Saúde
Escala
Pedidos
Mais
```

O "Mais" deve abrir acesso para:

* Financeiro;
* Notificações;
* Documentos;
* Perfil;
* Suporte.

A navegação deve parecer nativa de aplicativo.

---

# 32. HEADER

Criar um AppHeader consistente.

Exemplo:

```text
←

Título

              🔔
```

Para Home:

```text
Olá, Ramon

              🔔
```

Utilizar safe-area do dispositivo.

---

# 33. MOBILE FIRST REAL

O aplicativo deve ser pensado primeiro para:

```text
iPhone
Android
```

Depois web.

Considerar:

* Safe Area;
* notch;
* Dynamic Island;
* barra de navegação Android;
* teclado;
* orientação;
* viewport;
* touch target;
* gestos;
* scroll.

Todos os elementos interativos devem possuir tamanho adequado para toque.

---

# 34. CAPACITOR

Não quebrar a integração Capacitor.

Verificar:

* safe area;
* status bar;
* splash;
* teclado;
* navegação;
* links externos;
* WhatsApp;
* telefone;
* e-mail;
* clipboard;
* PDF;
* haptic feedback quando aplicável.

Não substituir APIs nativas existentes sem necessidade.

---

# 35. ANIMAÇÕES

Usar animações discretas.

Priorizar:

* entrada de páginas;
* cards;
* Bottom Sheets;
* modal;
* loading;
* feedback;
* mudança de estado.

Animações devem ser:

* rápidas;
* suaves;
* naturais.

Evitar animações excessivas.

Respeitar `prefers-reduced-motion`.

---

# 36. SKELETON LOADING

Todas as telas que fazem requisição devem possuir skeleton adequado.

Não mostrar:

```text
Carregando...
```

em toda a tela.

Criar skeletons que reproduzam a estrutura real.

---

# 37. EMPTY STATES

Toda lista deve possuir Empty State.

Exemplo:

```text
Nenhuma solicitação encontrada.

Quando você criar uma solicitação,
ela aparecerá aqui.

[ Nova solicitação ]
```

---

# 38. ERROR STATES

Criar mensagens úteis.

Não mostrar:

```text
Internal Server Error
```

para usuário.

Utilizar:

```text
Não conseguimos carregar estas informações.

Verifique sua conexão e tente novamente.

[ Tentar novamente ]
```

Não esconder erros importantes dos logs técnicos.

---

# 39. OFFLINE

Criar experiência visual para perda de conexão.

Exemplo:

```text
Você está offline.

Algumas informações podem estar
desatualizadas.

Última sincronização:
26/08 às 14:32
```

Não afirmar que dados estão atualizados se não houver sincronização.

---

# 40. FEEDBACK

Toda ação importante precisa de feedback.

Exemplo:

```text
✓ Solicitação enviada
```

```text
✓ Código copiado
```

```text
✓ Senha alterada
```

Usar Toast/Snackbar apropriado.

---

# 41. ACESSIBILIDADE

Garantir:

* contraste;
* labels;
* aria;
* foco;
* navegação por teclado na web;
* tamanho de toque;
* textos legíveis;
* suporte a leitores de tela;
* `prefers-reduced-motion`.

Não utilizar somente cor para representar estado.

---

# 42. PERFORMANCE

Não sacrificar performance pelo visual.

Verificar:

* imagens;
* fontes;
* bundle;
* lazy loading;
* memoização quando necessária;
* renderização;
* animações;
* listas grandes;
* re-renderizações;
* chamadas duplicadas de API.

---

# 43. RESPONSIVIDADE

O projeto deve funcionar bem em:

* celulares pequenos;
* celulares grandes;
* tablets;
* desktop.

Mas a prioridade é:

## MOBILE.

Não fazer apenas uma versão desktop que encolhe.

---

# 44. PRESERVAÇÃO DO BACKEND

NÃO alterar APIs existentes somente por conveniência visual.

NÃO alterar:

* banco;
* Prisma;
* SQL Server;
* regras financeiras;
* regras de escala;
* autenticação;
* relacionamentos.

Só alterar backend se uma funcionalidade visual realmente exigir informação que não existe.

Nesse caso:

1. documentar;
2. identificar a necessidade;
3. propor a alteração;
4. implementar somente se necessário.

---

# 45. SEGURANÇA

Durante o redesign, verificar se o frontend está expondo:

* CPF completo;
* tokens;
* informações sensíveis;
* IDs internos;
* dados médicos desnecessários;
* dados financeiros indevidos.

Mas não modificar regras de segurança de forma irresponsável.

---

# 46. RESPONSABILIDADE SOBRE DADOS DE SAÚDE

Nunca inventar:

* diagnóstico;
* avaliação médica;
* risco;
* recomendação clínica;
* interpretação médica.

A interface pode organizar os dados existentes.

Não criar inteligência médica falsa.

---

# 47. UX PARA FAMILIARES

Lembre-se:

O usuário principal não é necessariamente técnico.

A interface precisa responder rapidamente:

### Como está meu familiar?

### Quem está cuidando dele agora?

### Qual é o próximo plantão?

### Existe alguma pendência?

### Tenho alguma solicitação em andamento?

### Existe alguma cobrança?

Essas respostas devem aparecer rapidamente.

---

# 48. ARQUITETURA DE COMPONENTES

Sempre que identificar código repetido:

não copie.

Crie componente reutilizável.

Evitar páginas gigantes.

Separar:

```text
UI
Logic
Data
Services
Types
```

Quando apropriado.

---

# 49. CÓDIGO

Manter TypeScript forte.

Evitar:

```text
any
```

quando houver alternativa.

Não criar casts desnecessários.

Não ignorar erros TypeScript.

Não utilizar hacks para esconder problemas.

---

# 50. TAILWIND

Utilizar Tailwind CSS v4 conforme a configuração existente.

Não criar centenas de classes arbitrárias.

Centralizar tokens.

Evitar valores mágicos espalhados pelo projeto.

---

# 51. NÃO QUEBRAR FUNCIONALIDADES

Antes de considerar qualquer tela concluída:

verificar:

* navegação;
* formulários;
* APIs;
* autenticação;
* logout;
* clipboard;
* PDF;
* filtros;
* calendário;
* modais;
* BottomNav;
* links;
* loading;
* erros.

---

# 52. TESTE VISUAL

Após o redesign:

testar cada rota.

Lista mínima:

```text
/splash
/onboarding
/login
/esqueci-senha
/verificacao
/nova-senha
/
/quadro
/escala
/pedidos
/boletos
/perfil
/suporte
/notificacoes
```

Verificar:

* mobile;
* desktop;
* estados;
* overflow;
* scroll;
* teclado;
* safe area.

---

# 53. CRITÉRIO DE QUALIDADE

Não considere uma tela pronta apenas porque:

* compila;
* não apresenta erro;
* está responsiva.

Ela precisa estar:

### VISUALMENTE EXCELENTE

### FUNCIONALMENTE CORRETA

### CONSISTENTE COM O DESIGN SYSTEM

### ACESSÍVEL

### PERFORMÁTICA

### MOBILE FIRST

### COMPATÍVEL COM CAPACITOR

---

# 54. REGRA CONTRA PLACEHOLDER

Não utilizar:

```text
Lorem ipsum
Imagem genérica
Nome fake
Informação médica inventada
Boleto fictício
Cuidador fictício
```

Utilizar os dados reais disponíveis no sistema.

Quando não houver dados:

utilizar Empty State.

---

# 55. REGRA CONTRA OVERDESIGN

Não adicionar:

* gráficos desnecessários;
* animações exageradas;
* gradientes em excesso;
* glassmorphism em tudo;
* sombras exageradas;
* cards para absolutamente tudo;
* elementos decorativos que prejudiquem a leitura.

Premium não significa exagerado.

---

# 56. RESULTADO ESPERADO

Ao final, o usuário deve olhar para o aplicativo e perceber:

```text
CUIdA E AMOR

Produto premium
Empresa profissional
Tecnologia moderna
Experiência humana
```

A sensação deve ser comparável a aplicativos modernos de grandes empresas.

Não copiar visualmente nenhuma marca específica.

Criar uma identidade própria para Cuida e Amor.

---

# 57. ORDEM DE EXECUÇÃO

Execute nesta ordem:

## FASE 1 — AUDITORIA

Mapear todo frontend.

Não modificar código ainda.

Gerar:

```text
AUDITORIA_FRONTEND.md
```

Contendo:

* estrutura;
* páginas;
* componentes;
* problemas;
* inconsistências;
* oportunidades;
* APIs utilizadas;
* dependências;
* riscos.

---

## FASE 2 — DESIGN SYSTEM

Criar:

```text
DESIGN_SYSTEM.md
```

Definir:

* cores;
* rosa principal;
* tons derivados;
* tipografia;
* espaçamento;
* radius;
* sombras;
* componentes;
* estados;
* iconografia.

---

## FASE 3 — APP SHELL

Redesenhar:

* layout;
* header;
* BottomNav;
* safe area;
* navegação;
* transições;
* estrutura global.

---

## FASE 4 — AUTENTICAÇÃO

Redesenhar:

* splash;
* onboarding;
* login;
* recuperação;
* verificação;
* nova senha.

---

## FASE 5 — HOME

Redesenhar completamente `/`.

Essa deve ser a tela de maior qualidade.

---

## FASE 6 — MÓDULOS

Redesenhar:

```text
/quadro
/escala
/pedidos
/boletos
/notificacoes
/perfil
/suporte
```

---

## FASE 7 — ESTADOS

Implementar:

* loading;
* skeleton;
* empty;
* error;
* offline;
* success.

---

## FASE 8 — MOBILE

Testar Capacitor.

Verificar:

* safe area;
* teclado;
* touch;
* scroll;
* status bar;
* navegação;
* links externos.

---

## FASE 9 — QA

Executar:

```text
npm run lint
npm run build
```

ou os comandos equivalentes existentes no projeto.

Corrigir todos os erros reais.

Não mascarar problemas.

---

# 58. RELATÓRIO FINAL

Ao terminar, gerar:

```text
REDESIGN_FRONTEND.md
```

Com:

## 1. Resumo

## 2. Telas modificadas

## 3. Componentes criados

## 4. Design System

## 5. Melhorias de UX

## 6. Melhorias de acessibilidade

## 7. Melhorias mobile

## 8. Melhorias de performance

## 9. Problemas encontrados

## 10. Problemas que dependem do backend

## 11. Novas funcionalidades recomendadas

## 12. Testes executados

## 13. Resultado do build

---

# 59. REGRA FINAL

Não pare no primeiro redesign.

Depois de implementar tudo:

faça uma segunda análise visual completa.

Pergunte:

> "Isso realmente parece um aplicativo de uma grande empresa de Home Care?"

Se a resposta for não:

melhore.

Analise:

* espaçamento;
* hierarquia;
* tipografia;
* cores;
* consistência;
* navegação;
* estados;
* microinterações;
* acessibilidade;
* percepção de valor.

Faça uma segunda passagem de refinamento.

---

# RESULTADO FINAL DESEJADO

O AppCuidaAmor deve sair de:

> sistema funcional adaptado para mobile

para:

> **aplicativo mobile premium da Cuida e Amor, com identidade visual própria, experiência de alto nível, navegação intuitiva, design system consistente e acabamento de produto empresarial.**

Prioridade absoluta:

**USABILIDADE → CONFIANÇA → CLAREZA → IDENTIDADE → SOFISTICAÇÃO.**

Não sacrifique funcionalidade por estética.

Não sacrifique performance por animação.

Não sacrifique acessibilidade por design.

Não sacrifique segurança por conveniência.

**Transforme o frontend inteiro, mas preserve a inteligência e as regras do sistema existente.**

<!-- END:nextjs-agent-rules -->
