# Catálogo de cálculos

Status: **cálculos nomeados na rodada 1 registrados; quase todos bloqueados por fonte.**

Nenhum cálculo obstétrico (IG, percentil, peso estimado, índices Doppler, etc.) deve ser presumido. Sem fonte, aprovação da Dra. Karen e casos de teste, o cálculo **não** está Ready.

Fórmula aprovada clinicamente **não** é o mesmo que referência validada: uma fórmula pode estar aprovada e a **tabela de interpretação** continuar `SOURCE_VALIDATION_PENDING`. Ver [`REFERENCE_VALIDATION_BACKLOG.md`](REFERENCE_VALIDATION_BACKLOG.md).

## Estrutura

| Atributo | Descrição |
|---|---|
| Calculation Key | Identidade estável |
| Nome | Nome clínico |
| Inputs | Campos / unidades |
| Outputs | Campos / unidades |
| Unidades | |
| Fórmula | Só com fonte |
| Fonte | Paper, tabela, fabricante, protocolo institucional |
| Versão / referência | |
| Arredondamento | |
| Faixa válida | |
| Casos especiais | Ausência de input, gemelar, etc. |
| Aprovação clínica | pendente / aprovado / rejeitado |
| Test cases | Entrada → saída esperada |
| Status | `NAMED` \| `SOURCED` \| `APPROVED` \| `REJECTED` |

## Registro

```md
### [calculationKey] — PENDING

- Nome:
- Inputs:
- Outputs:
- Unidades:
- Fórmula:
- Fonte:
- Versão / referência:
- Arredondamento:
- Faixa válida:
- Casos especiais:
- Aprovação clínica: pendente
- Test cases:
- Status: NAMED
```

## Índice — Obstétrica com Doppler v0.1

| Calculation Key | Nome | Fórmula | Fonte | Status |
|---|---|---|---|---|
| `uterineArtery.meanPi` | IP médio das artérias uterinas | `(IP direita + IP esquerda) / 2` | `SOURCE_NOT_REQUIRED` (definição aritmética) | `APPROVED` — candidato Sprint 2 (sem P95) |
| `fetus.cpr` | Relação cerebroplacentária | `IP ACM / IP artéria umbilical` | fórmula aprovada; **interpretação** por IG `SOURCE_VALIDATION_PENDING` | `SOURCED` na fórmula, bloqueado na classificação |
| `fetus.efw.hadlock` | Peso fetal estimado (Hadlock); margem ±10% versionável | conceito aprovado; fórmula/versão exatas pendentes | `SOURCE_VALIDATION_PENDING` | `NAMED` |
| `fetus.efwPercentile` | Percentil de peso fetal | depende de tabela por IG | `SOURCE_VALIDATION_PENDING` | `NAMED` |
| `fetus.gestationalAgeByBiometry` | IG estimada geral pela biometria (exame atual) | composição das medidas; método exato pendente | `SOURCE_VALIDATION_PENDING` | `NAMED` |
| `exam.correctedGestationalAge` | IG corrigida atual (derivada do episódio + data) | política de datação + aritmética de semanas/dias | `SOURCE_VALIDATION_PENDING` (política e interpolação) | `NAMED` |
| `reference.weekDayInterpolation` | Interpolação semana + dia em tabelas de referência | **não definir** | `SOURCE_VALIDATION_PENDING` | `NAMED` — proibido inventar |

Nota: o handoff usa **IP** (índice de pulsatilidade); a chave técnica `meanPi` / `pi` permanece estável.

Restrições registradas:

- RCP **não** usa corte fixo `< 1`; a classificação depende de idade gestacional precisa (semanas + dias).
- Nenhuma interpolação entre semanas/dias pode ser inventada pela engenharia.
- Cálculo cuja saída alimente classificação, alerta ou conclusão só entra em produção com `SOURCE_VALIDATED`.
- Cálculo puramente aritmético (`uterineArtery.meanPi`) pode ser candidato à Sprint 2; a **comparação com P95** não.
