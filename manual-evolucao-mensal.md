# Manual de Integração: Quadro de Saúde e Evolução Mensal

Este documento detalha o comportamento esperado pelo aplicativo "Cuida e Amor" em relação à ficha de anamnese (Quadro de Saúde) do paciente e seu histórico evolutivo mensal.

## 1. O Novo Paradigma: Histórico Evolutivo (Timeline)

O aplicativo móvel agora possui uma funcionalidade de **Evolução Mensal**. Isso significa que as famílias podem ver a avaliação médica mais recente (o "Quadro Atual") e também podem voltar no tempo para ler avaliações de meses anteriores (o "Histórico").

Para que isso seja possível, o banco de dados e o sistema de gestão (ERP / Painel Admin) devem registrar os dados em formato de **Log / Inserções contínuas**.

## 2. Instrução para os Desenvolvedores do Painel (Backend)

🚨 **IMPORTANTE: NÃO FAÇA UPDATE NA FICHA EXISTENTE!** 🚨

Até então, o comportamento comum ao editar um dado médico de um paciente (Ex: Mudou a patologia ou o funcionamento intestinal) poderia ser atualizar a linha existente na tabela `FichaAnamnese`.
**A partir de agora, a cada nova avaliação (mensal ou periódica), você deve fazer um `INSERT` de uma nova ficha para aquele `CodCli`.**

### Exemplo de Comando Esperado:

> [!WARNING]
> **Ação Inicial Necessária no Banco de Dados (SQL Server):**
> O aplicativo agora exige a nota de saúde para gerar o gráfico animado. Antes de fazer o INSERT, **você precisa rodar o seguinte script SQL manualmente no seu SQL Server** para criar a coluna que o App agora exige:
> 
> ```sql
> ALTER TABLE FichaAnamnese ADD ScoreSaude INT;
> ```

Quando a enfermeira clicar em "Salvar Avaliação Mensal" no seu ERP, o comando que vai para o SQL Server deve ser:

```sql
INSERT INTO FichaAnamnese (
    CodCli, 
    DataCriacao, 
    ScoreSaude,
    AtividadeFisica, 
    Patologias, 
    FuncionamentoIntestinal, 
    Consistencia, 
    Observacoes
) VALUES (
    384,                -- Código do Paciente (Idoso)
    GETDATE(),          -- Data exata em que a enfermeira está salvando
    85,                 -- NOVO: Score de Saúde de 0 a 100% (usado no Gráfico de Evolução)
    1,                  -- Pratica Atividade Física?
    'Hipertensão, Diabetes', 
    'Funcionamento normalizado após medicação',
    'Pastosa',
    'Anotações internas: Paciente apresentou melhora significativa na digestão este mês.'
);
```

### O que acontece no App quando você insere (INSERT)?
1. A nova ficha (com a data mais recente) assume imediatamente a página principal de "Quadro de Saúde" da família.
2. A ficha do mês passado é empurrada automaticamente para baixo, para a sessão de **"Evoluções Anteriores"**, onde a família pode clicar para expandir e comparar a melhora.

### E a tabela FichaAnamnese_medicamento?
A regra se aplica a ela também. Como a tabela `FichaAnamnese_medicamento` recebe a chave estrangeira `AnamneseId`, sempre que você inserir uma *nova* FichaAnamnese para o mês, você deve copiar/inserir os medicamentos vigentes daquele mês atrelados ao *novo* `AnamneseId` que acabou de ser gerado.

Se o paciente toma "Losartana" há 3 meses seguidos, existirão 3 registros na `FichaAnamnese`, cada um com seu próprio `AnamneseId` (ex: 10, 11 e 12), e cada um deles deve ter a "Losartana" linkada na tabela de medicamentos. Assim, se no mês 4 ele parar de tomar o remédio, a evolução registrará a ausência perfeitamente.

## 3. Como o Aplicativo Consome esses Dados

O aplicativo fará a seguinte Query internamente:
```sql
SELECT * FROM FichaAnamnese 
WHERE CodCli = [Id do Paciente]
ORDER BY DataCriacao DESC;
```
- A `Linha 0` é renderizada como o Prontuário Médico atual.
- Da `Linha 1` em diante, são renderizadas como "Evolução Mensal" na linha do tempo abaixo do prontuário.
