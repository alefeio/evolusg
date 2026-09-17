# Backlog de validação de referências clínicas

Lista consolidada de itens `SOURCE_VALIDATION_PENDING` do protocolo [`Obstétrica com Doppler v0.1`](../protocols/OBSTETRIC_DOPPLER_V0_1.md).

Um item aqui significa: **o conceito clínico pode estar aprovado pela Dra. Karen, mas a referência (tabela, fórmula, versão, fonte) ainda não está formalmente estabelecida.** Ver os [três eixos de status](TRACEABILITY.md#três-eixos-de-status-reconciliação-v01).

## O que uma pendência de fonte bloqueia

| Liberado agora | Bloqueado até `SOURCE_VALIDATED` |
|---|---|
| documentação, definição de campo, schema conceitual | classificação clínica definitiva |
| estrutura de interface, placeholders | alerta clínico automático |
| fixture estrutural | frase de conclusão baseada em threshold |
| arquitetura extensível | expected output clínico definitivo |
| — | cálculo de produção |

## Itens

| # | Referência pendente | O que ela bloqueia |
|---|---|---|
| 1 | Fórmula e versão de **Hadlock** para PFE | `fetus.efw.hadlock`; frase de biometria com peso; contribuição de conclusão por peso |
| 2 | Tabela de **percentis de crescimento** fetal + versionamento | `fetus.efwPercentile`; classificação abaixo/adequado/acima; thresholds informados na discovery |
| 3 | Percentis das **artérias uterinas** por IG | avaliação automática de `> P95` (lado e média); frases de uterinas alteradas; contribuição consolidada de conclusão |
| 4 | Referência da **artéria umbilical** | classificação e frase da umbilical; contribuição de conclusão |
| 5 | Referência da **ACM** | classificação e frase da ACM |
| 6 | Referência do **ducto venoso** | classificação e frase do DV |
| 7 | Referência de interpretação do **RCP** por IG | classificação do RCP (fórmula já aprovada); proibido corte fixo `< 1` |
| 8 | Política de **interpolação semana + dia** em tabelas | qualquer classificação que dependa de IG entre semanas; IG corrigida |
| 9 | Faixa de **BCF** | classificação/frase de BCF |
| 10 | Faixas de **MBV** | classificação/frase de líquido |
| 11 | Faixas de **ILA** | classificação/frase de líquido |
| 12 | Critério de **janelas uterinas** (o que conta como avaliação adequada) | validade da avaliação de uterinas |
| 13 | Critérios de **sFGR** | escopo futuro de múltiplos |
| 14 | Referências para **trigemelares** | escopo futuro de múltiplos |

## Pendência paralela: transcrição

Distinta de validação de fonte. `PENDING HANDOFF IMPORT` indica conteúdo que **já foi informado** na rodada 1 e ainda não está transcrito nos catálogos:

- textos literais das frases aprovadas;
- faixas numéricas informadas para crescimento, BCF, MBV e ILA.

Transcrever não valida a fonte: um número informado em entrevista continua `SOURCE_VALIDATION_PENDING` até haver referência formal.

## Regra de saída

Um item sai deste backlog quando tiver: fonte identificada, versão, faixa de aplicação (IG mínima/máxima), política de arredondamento, política de fora de faixa e aprovação clínica explícita. Só então o artefato correspondente pode migrar para `READY_FOR_IMPLEMENTATION`.
