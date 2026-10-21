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
| `fetus.efw.hadlock` | Peso fetal estimado | Hadlock 1985, quatro medidas, mm→cm sem arredondar o meio | `EFW_HADLOCK_1985_BPD_HC_AC_FL@1` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` |
| `fetus.efwPercentile` | Percentil do PFE | chart 1991 + dia + z-score; não é a fórmula original de percentil | `EFW_GROWTH_HADLOCK_1991_CHART_Z_INTERP@1` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` |
| `fetus.acPercentile` | Percentil da CA | média quadrática Hadlock 1984, DP 1,34 cm | `AC_GROWTH_HADLOCK_1984@1` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` |
| `fetus.gestationalAgeByBiometry` | IG estimada geral pela biometria (exame atual) | composição das medidas; método exato pendente | `SOURCE_VALIDATION_PENDING` | `NAMED` |
| `exam.correctedGestationalAge` | IG corrigida atual (1ª USG + `exam.examDate`) | dias civis; nunca `Exam.createdAt` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` |
| `reference.weekDayInterpolation` | Interpolação semana + dia em tabelas de referência | **não definir** | `SOURCE_VALIDATION_PENDING` | `NAMED` — proibido inventar |

Nota: o handoff usa **IP** (índice de pulsatilidade); a chave técnica `meanPi` / `pi` permanece estável.

Restrições registradas:

- RCP **não** usa corte fixo `< 1`; a classificação depende de idade gestacional precisa (semanas + dias).
- Nenhuma interpolação entre semanas/dias pode ser inventada pela engenharia.
- Cálculo cuja saída alimente classificação, alerta ou conclusão só entra em produção com `SOURCE_VALIDATED`.
- Cálculo puramente aritmético (`uterineArtery.meanPi`) pode ser candidato à Sprint 2; a **comparação com P95** não.

## Pacote Hadlock V1 — implementado, não liberado

Detalhe: [`CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md`](CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md) e [`../roadmap/SPRINT_3.md`](../roadmap/SPRINT_3.md). Nenhum dos três está `CLINICALLY_RELEASED`. O Voluson E6 segue como gate de compatibilidade prática.

### `fetus.efw.hadlock`

- Status: `IMPLEMENTED_NOT_CLINICALLY_RELEASED`.
- Referência: `EFW_HADLOCK_1985_BPD_HC_AC_FL@1`.
- Entradas: BPD, HC, AC e FL em milímetros. Equação em centímetros.
- Saída interna crua; tela em gramas inteiras.
- Sem fallback de fórmula. Medida faltante: indisponível, rascunho continua.

### `fetus.efwPercentile`

- Status: `IMPLEMENTED_NOT_CLINICALLY_RELEASED`.
- Referência: `EFW_GROWTH_HADLOCK_1991_CHART_Z_INTERP@1`.
- Chart: `HADLOCK_1991_CHART_COMPAT_V1`. P97 de 30 semanas = 1949 g, não o 1649 g publicado.
- Entradas: peso cru e IG em semanas + dias.
- Abaixo de P3 e acima de P97 não são extrapolados.

### `fetus.acPercentile`

- Status: `IMPLEMENTED_NOT_CLINICALLY_RELEASED`.
- Referência: `AC_GROWTH_HADLOCK_1984@1`.
- Entradas: CA em milímetros e IG decimal `semanas + dias / 7`.
- Faixa 12s 0d–40s 0d. Não classifica crescimento.

`reference.weekDayInterpolation` não é política global. O percentil do PFE declara `INTERPOLATED_TABLE`. O percentil da CA declara `CONTINUOUS_EQUATION`.

### `exam.correctedGestationalAge`

- Status: `IMPLEMENTED_NOT_CLINICALLY_RELEASED`.
- Entradas: data da primeira ultrassonografia, IG em semanas e dias, e `exam.examDate`.
- `EXAM CLINICAL DATE != RECORD CREATED AT`.
- `createdAt MUST NEVER BE USED AS GESTATIONAL-AGE CLINICAL INPUT`.
- Sem `examDate`: percentis `UNAVAILABLE_MISSING_EXAM_DATE`; o PFE segue com as quatro medidas.
- Âncora incompleta: sem percentis e sem fallback de DUM.
- `examDate` anterior à primeira ultrassonografia: dado inconsistente, sem cálculo silencioso.
