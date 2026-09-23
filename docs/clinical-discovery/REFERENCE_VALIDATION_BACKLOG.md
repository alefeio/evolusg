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
| 2 | Tabela de **percentis de crescimento** fetal + versionamento | classificação &lt;P5 / P5–P90 / &gt;P90 (thresholds **informados** e importados; fonte formal pendente) |
| 3 | Percentis das **artérias uterinas** por IG | avaliação automática de `> P95` (lado e média); frases de uterinas alteradas; contribuição consolidada de conclusão |
| 4 | Referência da **artéria umbilical** | classificação e frase da umbilical; contribuição de conclusão |
| 5 | Referência da **ACM** | classificação e frase da ACM |
| 6 | Referência do **ducto venoso** | classificação e frase do DV |
| 7 | Referência de interpretação do **RCP** por IG | classificação do RCP (fórmula já aprovada); proibido corte fixo `< 1` |
| 8 | Política de **interpolação semana + dia** em tabelas | qualquer classificação que dependa de IG entre semanas; IG corrigida |
| 9 | Faixa de **BCF** (120–160 informada) | classificação/frase automática normal/bradi/taqui |
| 10 | Faixas de **MBV** (3,0–8,0 / &lt;3 / &gt;8 informadas) | classificação/frase de líquido |
| 11 | Faixas de **ILA** (3,0–24,0 / &lt;3 / &gt;24 informadas) | classificação/frase de líquido |
| 12 | Critério de **janelas uterinas** (o que conta como avaliação adequada) | validade da avaliação de uterinas |
| 13 | Critérios de **sFGR** | escopo futuro de múltiplos |
| 14 | Referências para **trigemelares** | escopo futuro de múltiplos |

## Pendência paralela: transcrição vs fonte

`PENDING HANDOFF IMPORT` ≠ `SOURCE_VALIDATION_PENDING`.

| Marcador | Significa |
|---|---|
| `PENDING HANDOFF IMPORT` | fato já descoberto ainda não transcrito nos catálogos |
| `SOURCE_VALIDATION_PENDING` | referência científica/versionada ainda não validada |

Complementação singleton: frases e faixas abaixo **deixaram** de ser `PENDING HANDOFF IMPORT` e foram importadas como `CLINICALLY_APPROVED`. Continuam neste backlog como `SOURCE_VALIDATION_PENDING`:

- BCF 120–160 (e bradi/taqui);
- crescimento &lt;P5 / P5–P90 / &gt;P90;
- MBV e ILA (faixas);
- P95/P5 de uterinas, umbilical, ACM, DV, RCP;
- Hadlock / percentil / interpolação.

Transcrever **não** valida a fonte: um número informado em entrevista continua `SOURCE_VALIDATION_PENDING` até haver referência formal.

Frases de **múltiplos**: não importadas nesta complementação (`DOCUMENTED FOR FUTURE IMPLEMENTATION`); não necessárias para Sprint 2 singleton.

## Regra de saída

Um item sai deste backlog quando tiver: fonte identificada, versão, faixa de aplicação (IG mínima/máxima), política de arredondamento, política de fora de faixa e aprovação clínica explícita. Só então o artefato correspondente pode migrar para `READY_FOR_IMPLEMENTATION`.
