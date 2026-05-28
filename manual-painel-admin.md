# Integração das Solicitações no Painel Administrativo

Este documento técnico destina-se à equipe de retaguarda (Backend/Painel Administrativo) para entender como as solicitações do aplicativo foram estruturadas e como listá-las na interface web.

## 1. Nova Estrutura de Banco de Dados

Conforme alinhado, as novas solicitações disparadas pelos familiares via aplicativo móvel estão sendo salvas na tabela **`Cupom`**. Para comportar o texto descritivo dos motivos das solicitações (como a justificativa de folga ou motivo da remoção), adicionamos a coluna `Observacao`.

> [!WARNING]
> **Ação Obrigatória no Banco de Dados (SQL Server):**
> O comando do Prisma não conseguiu alterar o banco automaticamente devido a restrições de permissão em outros índices do seu banco legado. **Você precisa rodar o seguinte script SQL manualmente no seu SQL Server** para criar a coluna que o App agora exige:
> 
> ```sql
> ALTER TABLE Cupom ADD Observacao VARCHAR(MAX);
> ALTER TABLE Cupom ADD Status VARCHAR(20) DEFAULT 'Em Análise';
> ALTER TABLE Cupom ADD RespostaAdmin VARCHAR(MAX);
> ```

## 2. Dicionário de Dados das Solicitações

Quando o aplicativo envia um pedido, ele preenche a tabela `Cupom` com a seguinte lógica:

*   **`Cupom` (VARCHAR 10):** Armazena o tipo exato da solicitação. Possíveis valores:
    *   `REMOVER`: Solicitação para trocar o cuidador atual.
    *   `ESCALA`: Pedido genérico de alteração de escala/turnos.
    *   `FOLGA`: Solicitação de folga para o cuidador.
    *   `OUTRA`: Solicitação genérica.
*   **`Data` (DATETIME):** A data e hora em que a família enviou o pedido pelo app.
*   **`Indice` (FLOAT):** Guarda o código do Cliente/Responsável (`CodCli`) que realizou o pedido.
*   **`NumVen` (INT):** Guarda o código do Cuidador (`CodInd` / `CodCli`) alvo da solicitação (Ex: o cuidador que eles querem remover ou pedir folga).
*   **`Validade` (DATETIME):** Se o pedido for do tipo `FOLGA`, a data que eles querem folgar ficará gravada neste campo.
*   **`Observacao` (TEXT):** O texto digitado pela família explicando o motivo.
*   **`Status` (VARCHAR 20):** Guarda a situação ('Em Análise', 'ACEITO', 'RECUSADO'). O aplicativo lê isso para pintar a bolinha na tela de verde, amarelo ou vermelho.
*   **`RespostaAdmin` (TEXT):** Onde vocês podem escrever a justificativa da recusa ou aceite. O app exibe isso pro cliente.

## 3. Como listar os Pedidos no Painel Admin (Query SQL)

Para a equipe do painel administrativo criar a "Caixa de Entrada de Solicitações do App", basta executar uma Query SQL cruzando a tabela `Cupom` com a tabela `CLIENTEs` (para pegar os nomes):

```sql
SELECT 
    c.Lanc AS Protocolo,
    c.Data AS DataPedido,
    c.Cupom AS TipoSolicitacao,
    c.Observacao AS Motivo,
    c.Status AS SituacaoAtual,
    c.RespostaAdmin AS JustificativaDaAdministracao,
    resp.Cliente AS NomeResponsavel,
    cuid.Cliente AS NomeCuidadorAlvo,
    c.Validade AS DataFolgaRequerida
FROM 
    Cupom c
LEFT JOIN 
    CLIENTEs resp ON c.Indice = resp.CodCli
LEFT JOIN 
    CLIENTEs cuid ON c.NumVen = cuid.CodCli
WHERE 
    c.Cupom IN ('REMOVER', 'ESCALA', 'FOLGA', 'OUTRA')
ORDER BY 
    c.Data DESC;
```

Com essa Query, seu painel web exibirá em tempo real todos os novos chamados que os familiares abrirem diretamente pelo celular!

## 4. Como Responder uma Solicitação (Ação do Administrador)

Quando o administrador da empresa tomar uma decisão sobre o pedido, basta fazer um `UPDATE` no registro correspondente (usando o `Lanc` como identificador) preenchendo o `Status` e a `RespostaAdmin`.

Exemplo de aceite:
```sql
UPDATE Cupom 
SET 
    Status = 'ACEITO', 
    RespostaAdmin = 'A solicitação foi analisada e a troca de escala já foi registrada no sistema. Obrigado.'
WHERE Lanc = 1234; -- Troque pelo número do protocolo correspondente
```

Exemplo de recusa:
```sql
UPDATE Cupom 
SET 
    Status = 'RECUSADO', 
    RespostaAdmin = 'Infelizmente não há cuidadores disponíveis para cobrir esta folga na data informada.'
WHERE Lanc = 1234;
```

No mesmo segundo em que esta instrução for rodada, o aplicativo do familiar piscará a resposta na tela de histórico de solicitações!
