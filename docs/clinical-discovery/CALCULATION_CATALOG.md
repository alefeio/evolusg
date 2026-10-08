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
| `fetus.efw.hadlock` | Peso fetal estimado; margem ±10% versionável | conceito aprovado; fórmula não aprovada | `EFW_HADLOCK_1985_BPD_HC_AC_FL` — `DEVICE_MATCH_PENDING` | `NAMED` — não `ACTIVE` |
| `fetus.efwPercentile` | Percentil do PFE | comparação do PFE com referência de crescimento por IG | `EFW_GROWTH_HADLOCK_1991` — `METHOD_DEFINITION_PENDING` | `NAMED` — não `ACTIVE` |
| `fetus.acPercentile` | Percentil da CA | percentil da circunferência abdominal; distinto do PFE | `AC_GROWTH_HADLOCK_1984` — `SOURCE_VALIDATION_PENDING` | `NAMED` — não `ACTIVE` |
| `fetus.gestationalAgeByBiometry` | IG estimada geral pela biometria (exame atual) | composição das medidas; método exato pendente | `SOURCE_VALIDATION_PENDING` | `NAMED` |
| `exam.correctedGestationalAge` | IG corrigida atual (derivada do episódio + data) | política de datação + aritmética de semanas/dias | `SOURCE_VALIDATION_PENDING` (política e interpolação) | `NAMED` |
| `reference.weekDayInterpolation` | Interpolação semana + dia em tabelas de referência | **não definir** | `SOURCE_VALIDATION_PENDING` | `NAMED` — proibido inventar |

Nota: o handoff usa **IP** (índice de pulsatilidade); a chave técnica `meanPi` / `pi` permanece estável.

Restrições registradas:

- RCP **não** usa corte fixo `< 1`; a classificação depende de idade gestacional precisa (semanas + dias).
- Nenhuma interpolação entre semanas/dias pode ser inventada pela engenharia.
- Cálculo cuja saída alimente classificação, alerta ou conclusão só entra em produção com `SOURCE_VALIDATED`.
- Cálculo puramente aritmético (`uterineArtery.meanPi`) pode ser candidato à Sprint 2; a **comparação com P95** não.

## Pacote Hadlock — candidatos, nenhum ativo

Detalhe e dispositivo: [`CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md`](CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md). `implementation status` de todos: não implementado. Eixo de fonte do cálculo: `SOURCE_VALIDATION_PENDING` até `CLINICALLY_RELEASED`.

### `fetus.efw.hadlock`

- Status do cálculo: `NAMED`, não `ACTIVE`.
- Referência: `EFW_HADLOCK_1985_BPD_HC_AC_FL` (`DEVICE_MATCH_PENDING`).
- Entradas exigidas pela candidata: BPD, HC, AC, FL. Unidades ainda não congeladas.
- Dependências: confirmação da variante no GE Voluson E6.
- Bloqueios: configuração do aparelho, publicação primária, coeficientes, unidades, arredondamento, fixtures.

### `fetus.efwPercentile`

- Status do cálculo: `NAMED`, não `ACTIVE`.
- Referência: `EFW_GROWTH_HADLOCK_1991` (`METHOD_DEFINITION_PENDING`).
- Entradas: PFE e idade gestacional em semanas + dias.
- Dependências: `fetus.efw.hadlock`.
- Bloqueios: publicação, método exato, semana + dia, interpolação ou equação, fixtures, comparação com o Voluson.

### `fetus.acPercentile`

- Status do cálculo: `NAMED`, não `ACTIVE`.
- Referência: `AC_GROWTH_HADLOCK_1984` (`SOURCE_VALIDATION_PENDING`).
- Entradas: CA medida e idade gestacional em semanas + dias.
- Dependências: nenhuma fórmula de peso.
- Bloqueios: publicação, equação ou tabela, desvio-padrão quando aplicável, semana + dia, fixtures.

`reference.weekDayInterpolation` não é uma política global. Cada referência declara a própria. Ver ADR-014.
