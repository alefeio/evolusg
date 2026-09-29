# ADR-014 — Referências clínicas versionadas

- **Status:** PROPOSED
- **Maturidade (auditoria):** problema real e necessário; decisão de desenho ainda aberta
- **Decidir até:** antes de qualquer classificação clínica automática entrar em produção (não é pré-requisito da primeira sprint de formulário)

## A. Problema

A primeira rodada de Clinical Discovery produziu conceitos clínicos aprovados que **dependem de referência externa** para significar algo: percentis de artérias uterinas, umbilical, ACM, ducto venoso, RCP por idade gestacional, percentis de crescimento, Hadlock, faixas de BCF e de líquido.

Nenhum ADR existente cobre esse tipo de dado. ADR-004 fala de regras, ADR-005 de findings, ADR-006/007 de texto — nenhum responde: *onde vive a tabela, como ela é versionada e como uma classificação aponta para a versão que a produziu?*

Sem essa decisão, o risco concreto é embutir números soltos no código ou no protocolo, sem fonte e sem versão, e depois não conseguir explicar nem reproduzir uma classificação de um laudo antigo.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Classificação clínica exige referência identificada e versionada | `KNOWN` (restrição de segurança clínica) |
| Nenhuma referência do protocolo v0.1 está formalmente validada hoje | `KNOWN` — ver [`../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md`](../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md) |
| Necessidade conceitual de algo equivalente a `ReferenceTable`, `ReferenceVersion`, `GestationalAgeRange`, `Percentiles`, `Source`, `InterpolationPolicy` | `PROPOSED` |
| A referência precisa suportar semanas **e** dias | `PROPOSED` (a discovery mostrou dependência de IG precisa) |
| Política de interpolação entre pontos da tabela | `PENDING CLINICAL DISCOVERY` — **proibido** inventar |
| Onde a tabela vive (protocolo, dados versionados em git, banco) | `PENDING PRODUCT DECISION` / `PENDING TECHNICAL VALIDATION` |
| Schema físico | **não** definido nesta fase |

## C. Prematuridade

**Adequado** registrar o problema e as restrições agora: o backlog de fontes já bloqueia trabalho real, e ignorar isso levaria a números órfãos no código.

**Prematuro** escolher formato, persistência e política de interpolação: nenhuma referência foi validada ainda, e a política de interpolação é decisão clínica, não de engenharia.

## Restrições que valem desde já

1. Nenhuma classificação, alerta ou frase de conclusão baseada em threshold pode ser produzida sem referência validada.
2. Toda classificação produzida deve poder apontar a versão da referência usada (`SourceVersion`), inclusive para laudos antigos.
3. Cálculo puramente definicional (média aritmética das uterinas, fórmula da RCP) não depende deste ADR; a **interpretação** do resultado depende.
4. Nenhuma interpolação semana/dia inventada pela engenharia.
5. Atualizar uma referência é **nova versão**, nunca edição silenciosa: laudo emitido não muda de classificação retroativamente.

## Invalidation Triggers

- Descoberta de que a Dra. Karen usa uma única referência institucional fixa para tudo, tornando o versionamento mais simples do que o previsto.
- Referências que não se expressem como faixa por idade gestacional (ex. dependentes de outro eixo), invalidando `GestationalAgeRange` como forma principal.
- Decisão de produto de exibir valor sem classificação automática no primeiro ciclo — reduz o escopo deste ADR sem eliminá-lo.
- Evidência de overengineering: um único protocolo com poucas tabelas talvez não precise de metamodelo de referências no MVP.

## Decisão proposta (restrita)

Aceitar apenas as cinco restrições acima como princípio. **Não** aceitar schema, formato de armazenamento nem política de interpolação. A forma concreta deve ser puxada pela primeira referência efetivamente validada.
