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
| 1 | PFE Hadlock — `EFW_HADLOCK_1985_BPD_HC_AC_FL`, `DEVICE_MATCH_PENDING` | `fetus.efw.hadlock` |
| 1b | Percentil do PFE — `EFW_GROWTH_HADLOCK_1991`, `METHOD_DEFINITION_PENDING` | `fetus.efwPercentile` |
| 1c | Percentil da CA — `AC_GROWTH_HADLOCK_1984`, `SOURCE_VALIDATION_PENDING` | `fetus.acPercentile`; frase do laudo `PENDING PHRASE/PRODUCT VALIDATION` |
| 2 | Tabela de **percentis de crescimento** fetal + versionamento | classificação &lt;P5 / P5–P90 / &gt;P90 |
| 3 | Percentis das **artérias uterinas** por IG | avaliação automática de `> P95` (lado e média); frases de uterinas alteradas; contribuição consolidada de conclusão |
| 4 | Referência da **artéria umbilical** | classificação e frase da umbilical; contribuição de conclusão |
| 5 | Referência da **ACM** | classificação e frase da ACM |
| 6 | Referência do **ducto venoso** | classificação e frase do DV |
| 7 | Referência de interpretação do **RCP** por IG | classificação do RCP (fórmula já aprovada); proibido corte fixo `< 1` |
| 8 | Política de **interpolação semana + dia** em tabelas | percentis do PFE e da CA, demais classificações por IG e IG corrigida |
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

## Pacote Hadlock v0.1 — bloqueios concretos

O eixo de fonte dos cálculos continua `SOURCE_VALIDATION_PENDING`. O status fino da referência está em [`CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md`](CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md). Imagens de exame real não entram como fixture.

### PFE / `fetus.efw.hadlock`

- Confirmar a variante selecionada no GE Voluson E6 (`GE_VOLUSON_E6_EFW_CONFIGURATION = PENDING DEVICE CONFIRMATION`).
- Validar a publicação primária.
- Validar coeficientes, unidades e política de arredondamento.
- Definir fixtures sintéticas ou publicadas, com aprovação explícita.

### Percentil do PFE / `fetus.efwPercentile`

- Validar a publicação de `EFW_GROWTH_HADLOCK_1991`.
- Definir o método exato, semana + dia e interpolação ou equação.
- Definir fixtures e comparar com o comportamento esperado do Voluson.

### Percentil da CA / `fetus.acPercentile`

- Validar a publicação de `AC_GROWTH_HADLOCK_1984`.
- Validar equação ou tabela e o desvio-padrão quando a referência o usar.
- Definir semana + dia e fixtures.

### Item 8

A interpolação semana + dia não é uma regra única do produto. Cada referência declara a própria política. O item 8 permanece aberto para as candidatas acima e para as demais classificações por idade gestacional.

## Regra de saída

Um item sai deste backlog quando tiver: fonte identificada, versão, faixa de aplicação (IG mínima/máxima), política de arredondamento, política de fora de faixa e aprovação clínica explícita. Só então o artefato correspondente pode migrar para `READY_FOR_IMPLEMENTATION`.
