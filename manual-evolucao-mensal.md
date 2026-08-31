# Manual de Integração: Quadro de Saúde, Feed de Evoluções e Medicamentos

Este documento detalha o comportamento, o mapeamento dos campos do banco de dados SQL Server (ERP SoftCare) e as regras de negócio para a aba **Quadro de Saúde / Feed de Evolução** do paciente no aplicativo **Cuida e Amor**.

---

## 1. Visão Geral das Tabelas Integradas

A aba de Evolução Clínica e Prontuário do Paciente é alimentada por três tabelas principais do banco de dados legado:

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTEs                            │
│  CodCli (PK) │ Cliente / Razao │ Peso │ Altura │ CodSeg     │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1 : N (CodCli)
┌──────────────────────────────▼──────────────────────────────┐
│                      FichaAnamnese                          │
│  AnamneseId (PK) │ CodCli (FK) │ DataCriacao │ ScoreSaude   │
│  MotivoConsulta  │ Patologias  │ Observacoes                │
│  FuncionamentoIntestinal │ Consistencia                     │
│  AtividadeFisica │ Tabagismo │ Etilismo │ HistoricoFamiliar │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1 : N (AnamneseId)
┌──────────────────────────────▼──────────────────────────────┐
│                 FichaAnamnese_Medicamento                   │
│  MedicamentoId (PK) │ AnamneseId (FK)                       │
│  Nome │ Dose │ Horarios │ Motivo                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Mapeamento Detalhado dos Campos

### 2.1 Tabela Base: `CLIENTEs` (Dados do Paciente / Idoso)

| Campo no Banco | Tipo | Mapeamento no App / Interface | Descrição |
|---|---|---|---|
| `CodCli` | INT (PK) | Identificador do Paciente | Exibido no topo como `#ID` do paciente assistido |
| `Cliente` / `Razao` | VARCHAR | Nome do Paciente | Nome principal exibido nos cabeçalhos e cards |
| `Peso` | VARCHAR / FLOAT | Peso Cadastrado | Exibido no card de métricas físicas (`kg`) |
| `Altura` | VARCHAR / FLOAT | Altura Mapeada | Exibido no card de métricas físicas (`m`) |
| `CodSeg` | INT | Segmento de Atendimento | Identifica se o cadastro é do tipo Paciente/Idoso para liberar a aba de evolução |
| `CodCli1` | INT (FK) | Vínculo do Responsável | Relaciona o paciente ao contratante/familiar logado |

---

### 2.2 Tabela Principal: `FichaAnamnese` (Registros Evolutivos / Prontuário)

Cada postagem / registro evolutivo salvo no feed gera um novo registro nesta tabela, vinculado ao idoso através do `CodCli`.

| Campo no Banco | Tipo | Mapeamento no Feed / Interface | Descrição |
|---|---|---|---|
| `AnamneseId` | INT (PK) | Identificador da Avaliação | Chave primária do registro evolutivo |
| `CodCli` | INT (FK) | Código do Paciente | Vínculo direto com `CLIENTEs.CodCli` |
| `MotivoConsulta` | NVARCHAR(MAX) | Queixa Principal / Motivo | Motivo da avaliação ou queixa relatada |
| `Patologias` | NVARCHAR(MAX) | Comorbidades / Patologias | Diagnósticos crônicos e patologias base |
| `OutrosPatologias` | NVARCHAR | Outras Patologias | Condições secundárias observadas |
| `FuncionamentoIntestinal` | NVARCHAR(200) | Rotina Intestinal | Frequência e características do hábito intestinal |
| `Consistencia` | NVARCHAR(200) | Consistência | Consistência das fezes (ex: pastosa, normal, ressecada) |
| `HistoricoFamiliar` | NVARCHAR(500) | Histórico Familiar | Antecedentes mórbidos e histórico genético |
| `Observacoes` | NVARCHAR(MAX) | Notas da Enfermeira / Evolução | Evolução clínica detalhada e anotações de enfermagem |
| `AtividadeFisica` | BIT / CHAR | Prática de Atividade Física | Checkbox: pratica atividade física (1/0 ou 'S'/'N') |
| `AtividadeFisica_Frequencia` | NVARCHAR(150) | Frequência de Atividade | Ex: "3x por semana", "Caminhada leve diária" |
| `Tabagismo` | BIT / CHAR | Tabagismo | Checkbox: faz uso de tabaco |
| `Tabagismo_Frequencia` | NVARCHAR(150) | Frequência de Fumo | Ex: "5 cigarros/dia" |
| `Etilismo` | BIT / CHAR | Etilismo | Checkbox: consome bebida alcoólica |
| `Etilismo_Frequencia` | NVARCHAR(150) | Frequência de Álcool | Ex: "Socialmente aos fins de semana" |
| `ScoreSaude` | INT | Score Geral de Saúde (0–100%) | Valor numérico exibido no gráfico de Vitalidade do App |
| `DataCriacao` | DATETIME | Data/Hora da Publicação | Data/hora do registro (ordena a timeline descrescente) |
| `DataAlteracao` | DATETIME | Data da Última Alteração | Timestamp de auditoria de alteração |

---

### 2.3 Tabela de Medicamentos: `FichaAnamnese_Medicamento` (Terapia Medicamentosa)

Utilizada na seção "Ajustar Terapia Medicamentosa Vigorosa" e exibida nas tags do post de evolução e no prontuário atual.

| Campo no Banco | Tipo | Mapeamento no Feed / Interface | Descrição |
|---|---|---|---|
| `MedicamentoId` | INT (PK) | ID do Medicamento | Identificador único do item de medicamento |
| `AnamneseId` | INT (FK) | Vínculo com a Ficha | Aponta para `FichaAnamnese.AnamneseId` |
| `Nome` | NVARCHAR(250) | Nome do Medicamento | Nome comercial ou princípio ativo (ex: "Losartana Potássica") |
| `Dose` | NVARCHAR(100) | Dosagem | Concentração prescrita (ex: "50mg", "2 gotas") |
| `Horarios` | NVARCHAR(200) | Horários de Tomada | Horários de uso (ex: "08:00, 20:00", "1x pela manhã") |
| `Motivo` | NVARCHAR(300) | Indicação Clínica | Motivo ou objetivo terapêutico (ex: "Controle pressórico") |

---

## 3. Regra de Gravação no ERP (Backend / Painel da Enfermagem)

> [!IMPORTANT]
> **REGRA FUNDAMENTAL: NÃO FAÇA UPDATE NA FICHA EXISTENTE!**
> Para preservar o **Histórico Evolutivo (Feed / Timeline)** do paciente, a cada nova avaliação periódica feita pela enfermagem, deve ser realizado um `INSERT` de um novo registro na tabela `FichaAnamnese` e seus respectivos itens em `FichaAnamnese_Medicamento`.

### Exemplo de Fluxo de Inserção SQL:

```sql
-- 1. Inserir a nova avaliação mensal / periódica
INSERT INTO FichaAnamnese (
    CodCli, 
    DataCriacao, 
    ScoreSaude,
    MotivoConsulta,
    Patologias, 
    FuncionamentoIntestinal, 
    Consistencia, 
    AtividadeFisica,
    AtividadeFisica_Frequencia,
    Tabagismo,
    Etilismo,
    HistoricoFamiliar,
    Observacoes
) VALUES (
    384,                                    -- CodCli do paciente
    GETDATE(),                              -- Timestamp atual
    88,                                     -- ScoreSaude (0 a 100)
    'Acompanhamento de rotina mensal',
    'Hipertensão Arterial Sistêmica, DM2',
    'Hábito intestinal preservado',
    'Normal',
    1,
    'Fisioterapia motora 2x/semana',
    0,
    0,
    'Pai hipertenso, mãe com histórico de AVC',
    'Paciente lúcido, orientado em tempo e espaço. Sinais vitais estáveis. Boa aceitação da dieta pastosa.'
);

-- Obter o ID gerado para a ficha
DECLARE @NovoAnamneseId INT = SCOPE_IDENTITY();

-- 2. Inserir os medicamentos vigentes para esta avaliação
INSERT INTO FichaAnamnese_Medicamento (AnamneseId, Nome, Dose, Horarios, Motivo)
VALUES 
    (@NovoAnamneseId, 'Losartana Potássica', '50mg', '08:00', 'Hipertensão'),
    (@NovoAnamneseId, 'Metformina', '850mg', '12:00, 20:00', 'Diabetes');
```

---

## 4. Consumo no Aplicativo Móvel (`/api/quadro`)

O endpoint `GET /api/quadro` executa a query:

```sql
SELECT TOP 10 *
FROM FichaAnamnese
WHERE CodCli = :codCliPaciente
ORDER BY DataCriacao DESC;
```

- **Ficha[0] (Mais recente):** Exibida como o **Prontuário e Evolução Atual**, com destaque para Vitalidade, Queixa Principal, Notas da Enfermeira, Medicamentos em Uso, Hábitos de Vida, Intestino, Comorbidades e Histórico Familiar.
- **Fichas[1..N] (Anteriores):** Renderizadas no **Feed de Evoluções Anteriores**, permitindo que a família acompanhe a linha do tempo, comparação de scores de vitalidade e histórico medicamentoso mês a mês.
