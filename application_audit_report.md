# Relatório de Auditoria Técnica e de Produto: AppCuidaAmor

Este relatório apresenta uma análise aprofundada de ponta a ponta do aplicativo **AppCuidaAmor**, mapeando o progresso atual, pendências de frontend e backend, botões sem comportamento ativo e a infraestrutura de rotas do sistema.

---

## 📊 Status Atual de Conclusão: **68%**

Com base na análise minuciosa de cada arquivo de tela e de API, estimamos que o projeto está **68% concluído**. A estrutura base está excelente, a interface do usuário (UI) possui uma identidade visual moderna e consistente, e os fluxos críticos de banco de dados (escala de plantão, prontuário de saúde, boletos em aberto) já possuem APIs conectadas com o SQL Server via Prisma.

*   **Progresso Médio das Telas (Frontend):** ~67%
*   **Progresso Médio das APIs (Backend):** ~74%

---

## 🔀 1. Todas as Rotas do Aplicativo

O aplicativo utiliza o Next.js App Router. Abaixo estão todas as rotas físicas mapeadas:

### 📱 Rotas de Telas (Frontend)

| Rota | Descrição | Status de Implementação | Nível de Conclusão |
| :--- | :--- | :--- | :---: |
| `/splash` | Tela de abertura animada com o logo da empresa e carregamento. | **Completa** | 100% |
| `/onboarding` | Tutorial inicial em 3 slides animados com progresso e botão de avançar. | **Completa** | 100% |
| `/login` | Formulário de autenticação por CPF e Senha. Integrada ao backend. | **Parcial** (Funciona, mas há erros de pacote no backend) | 90% |
| `/esqueci-senha` | Solicitação de CPF para envio de código de recuperação. | **Mockada** (Simulação via `setTimeout`) | 50% |
| `/verificacao` | Entrada do PIN de 6 dígitos enviado por e-mail. | **Mockada** (Simulação via `setTimeout`) | 50% |
| `/nova-senha` | Redefinição e confirmação da nova senha. | **Mockada** (Simulação via `setTimeout`) | 50% |
| `/` (Home/Dashboard) | Tela principal com cartão do paciente, plantonista do dia e acesso rápido. | **Quase Completa** (Integrada com `/api/dashboard`) | 90% |
| `/quadro` | Exibição detalhada de prontuário, medicamentos e patologias base. | **Completa** (Integrada com `/api/quadro`) | 95% |
| `/escala` | Visualização mensal/histórico de escalas e cuidadores de plantão. | **Completa** (Integrada com `/api/escala`) | 90% |
| `/boletos` | Apresentação de boletos em aberto (com Pix/PDF) e histórico pago. | **Parcial** (Falta ação nos botões Pix/PDF) | 70% |
| `/pedidos` | Formulário de novas solicitações e listagem do histórico de pedidos. | **Visual apenas** (Mockada, sem chamadas de API) | 30% |
| `/notificacoes` | Painel com avisos de boletos, mudanças de escala e comunicados. | **Visual apenas** (Mockada no frontend, sem API) | 30% |
| `/perfil` | Dados do contratante (João Silva) e botão para logout. | **Visual apenas** (Mockada no frontend, sem API) | 30% |
| `/suporte` | Canais de atendimento rápido (WhatsApp, Telefone, E-mail) e endereço. | **Visual apenas** (Links e botões desativados) | 65% |

---

### ⚙️ Rotas de API (Backend)

| Endpoint | Método | Descrição | Status do Arquivo |
| :--- | :--- | :--- | :---: |
| `/api/auth/login` | `POST` | Autentica contratante, valida a senha criptografada na tabela `Senha`, gera o JWT e define o cookie `mobile_token`. | **Implementado** (Erro de compilação do pacote `jsonwebtoken`) |
| `/api/dashboard` | `GET` | Retorna o responsável financeiro, idoso(s) vinculado(s), plantão do dia atual e quantidade de boletos atrasados. | **Completo e Funcional** |
| `/api/quadro` | `GET` | Retorna os dados da ficha de anamnese (`FichaAnamnese`) e a grade de medicação associada do primeiro idoso. | **Completo e Funcional** |
| `/api/escala` | `GET` | Lista as escalas de plantão (`Servico`) vinculadas ao idoso cadastrado. | **Completo e Funcional** |
| `/api/boletos` | `GET` | Recupera as faturas em aberto e histórico de boletos pagos (`Receber`) do responsável. | **Completo e Funcional** |
| `/api/pedidos` | `GET`/`POST` | Cria nova solicitação no banco (`Vale1`) ou recupera histórico do responsável. | **Completo no backend** (Sem integração no frontend) |

> [!WARNING]
> **Erro Crítico de Compilação no Backend:** 
> Ao rodar `npm run dev`, o Next.js (Turbopack) falha ao compilar `/api/auth/login` devido ao erro:
> `Module not found: Can't resolve 'jsonwebtoken'`
> Isso ocorre porque o `jsonwebtoken` é uma biblioteca Node.js nativa e requer polyfills ou configurações específicas dependendo da runtime em Next.js 16, ou precisa ser adequadamente empacotado.

---

## 🚫 2. Quais Botões Estão Sem Funcionalidades (Dead Buttons)

Abaixo listamos todos os elementos interativos mapeados nas telas que atualmente não possuem nenhum comportamento associado (sem `onClick`, sem `href` válido ou apenas simulação visual):

### `/boletos` (Financeiro)
*   **Botão "Copiar Pix" (`Copy`):** Não copia a chave PIX real para a área de transferência (clipboard).
*   **Botão "Ver PDF" (`FileText`):** Não abre ou baixa o arquivo PDF da fatura correspondente.

### `/pedidos` (Solicitações)
*   **Botões de Ação Rápida (4):** Os botões `"Remover cuidadora"`, `"Alterar escala"`, `"Solicitar folga"` e `"Outra solicitação"` não abrem formulários de envio e não executam disparos.
*   **Histórico de Pedidos:** A listagem de solicitações passadas é estática e não reflete as informações gravadas na tabela `Vale1` do banco de dados.

### `/notificacoes`
*   **Lista de Avisos:** As notificações de boleto disponível e alteração de escala são fixas em código. Não há suporte a fechar ou ler as notificações.

### `/perfil` (Menu de Perfil)
*   **Itens de Menu:** `"Dados Pessoais"`, `"E-mail Cadastrado"` e `"Política de Privacidade"` são estáticos e não abrem telas ou popups detalhados.
*   **Botão "Sair do Aplicativo" (`LogOut`):** Apenas faz redirecionamento de rota para `/login` (via `router.push`). **Não apaga o cookie `mobile_token`**, mantendo o usuário com sessão válida.

### `/suporte`
*   **Botão "WhatsApp" (`MessageCircle`):** Não possui link `https://wa.me/` configurado.
*   **Botão "Ligar agora" (`Phone`):** Não possui link `tel:` configurado.
*   **Botão "E-mail" (`Mail`):** Não possui link `mailto:` configurado.

### `/verificacao` (Esqueci Senha)
*   **Link "Reenviar e-mail":** Botão visualmente interativo mas sem nenhuma lógica implementada.

---

## 🔌 3. Quais Integrações com o Backend Faltam

Embora a maioria das APIs de leitura (`GET`) já esteja pronta, o fluxo de envio de dados e sincronização de telas precisa ser concluído:

1.  **Sincronização da Tela de Pedidos (`/pedidos`):**
    *   *Falta:* Fazer o frontend realizar a requisição `GET` para `/api/pedidos` para carregar o histórico real do banco de dados na tabela `Vale1`.
    *   *Falta:* Criar os formulários para que os botões (como "Alterar Escala") façam uma requisição `POST` para `/api/pedidos` enviando os parâmetros necessários de forma persistente.
2.  **Sincronização da Tela de Perfil (`/perfil`):**
    *   *Falta:* Criar um endpoint `/api/perfil` (ou estender `/api/dashboard`) para expor os dados pessoais, e-mail cadastrado e telefone do contratante.
    *   *Falta:* Fazer a tela de perfil puxar os dados reais da API, substituindo os placeholders da "Família Silva".
3.  **Remoção de Cookie no Logout:**
    *   *Falta:* Implementar uma rota `/api/auth/logout` que limpa o cookie `mobile_token` do navegador para deslogar o usuário com segurança antes de redirecioná-lo.
4.  **Recuperação de Senha Real (`/esqueci-senha` -> `/verificacao` -> `/nova-senha`):**
    *   *Falta:* Criar endpoints de backend para disparar e-mails de recuperação (ex: usando SendGrid/Nodemailer) e validar o token de redefinição no banco de dados. Atualmente, o fluxo é 100% simulado de ponta a ponta.
5.  **Ação de Boletos (Pix e PDF):**
    *   *Falta:* Integrar a geração da linha digitável/código Pix real e o link do boleto PDF na listagem da tabela `Receber`.

---

## 🛠️ 4. O Que Falta para Chegar aos 100%? (Plano de Ação)

Para que o aplicativo saia do estado de protótipo visual e se torne um produto 100% pronto para produção, o seguinte roteiro deve ser executado:

### 🧱 Passo 1: Correção do Erro de Compilação do `jsonwebtoken`
*   Reestruturar ou corrigir o empacotamento do JWT ou substituir o `jsonwebtoken` por uma biblioteca Edge-compatible (como `jose`) que funciona sem problemas na runtime nativa do Next.js sem depender de polyfills de Node clássico.

### 🔌 Passo 2: Integração de `/pedidos` com a API do Banco de Dados
*   Criar um modal ou popup de formulário simples em `/pedidos` para coletar o texto descritivo.
*   Conectar o envio (`POST`) e a listagem (`GET`) à API `/api/pedidos` que já manipula a tabela `Vale1`.

### 👥 Passo 3: Conexão e Segurança da Tela de Perfil
*   Adicionar a busca de dados reais em `/perfil` (lendo o cookie de login).
*   Configurar a limpeza do cookie `mobile_token` ao clicar no botão "Sair" para impedir acesso indevido subsequente.

### 💸 Passo 4: Operações de Fatura em `/boletos`
*   Adicionar comportamento de cópia da chave PIX via `navigator.clipboard.writeText`.
*   Linkar o botão de PDF para abrir o documento real anexado ao boleto do banco de dados (se houver).

### 📞 Passo 5: Ativação dos Atalhos de Contato em `/suporte`
*   Adicionar links nativos do celular:
    *   WhatsApp: `window.open('https://wa.me/5571999999999', '_blank')`
    *   Ligação Emergencial: `href="tel:0800123456"`
    *   E-mail: `href="mailto:contato@cuidaeamor.com.br"`

---

## 📄 5. Toda a Documentação e Credenciais Atuais

Atualmente, o projeto possui as seguintes credenciais de teste configuradas no arquivo `README.md` para testes locais:

*   **CPF do Responsável:** `4199160590`
*   **Senha de Teste:** `3109`

### Configuração de Banco de Dados (`.env`)
O banco de dados de teste está hospedado remotamente em SQL Server e acessível através da seguinte string de conexão configurada na variável `DATABASE_URL`:
`sqlserver://138.36.122.8:4745;database=testecuidaamnor;user=CUIDA;password=Jn54#fgDcxaa;encrypt=false;trustServerCertificate=true`
