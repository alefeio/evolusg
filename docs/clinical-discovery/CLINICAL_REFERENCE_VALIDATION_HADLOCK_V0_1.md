# Pacote de validação — referências Hadlock v0.1

Princípio: [ADR-014](../adr/ADR-014-referencias-clinicas-versionadas.md). Implementação: [`../roadmap/SPRINT_3.md`](../roadmap/SPRINT_3.md). Catálogos: [`CALCULATION_CATALOG.md`](CALCULATION_CATALOG.md), [`CLINICAL_FIELD_CATALOG.md`](CLINICAL_FIELD_CATALOG.md), [`REFERENCE_VALIDATION_BACKLOG.md`](REFERENCE_VALIDATION_BACKLOG.md).

As três referências do conjunto `BIOMETRY_GROWTH_HADLOCK_V1` estão `IMPLEMENTED_NOT_CLINICALLY_RELEASED`. Nenhuma está `CLINICALLY_RELEASED`.

## Review da fundação

`CLINICAL REFERENCE FOUNDATION REVIEW APPROVED`

O review de 2026-10-08 aprovou a arquitetura, não o uso clínico. O status daquele momento era candidato. A Sprint 3 implementou o motor sem promover as referências a `CLINICALLY_RELEASED`.

## Motor V1

`CLINICAL REFERENCE VALIDATION — BIOMETRY & GROWTH` foi executado como Sprint 3, só para PFE, percentil do PFE e percentil da CA.

| Referência | Versão | Status |
|---|---|---|
| `EFW_HADLOCK_1985_BPD_HC_AC_FL` | `@1` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` |
| `EFW_GROWTH_HADLOCK_1991_CHART_Z_INTERP` | `@1` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` |
| `AC_GROWTH_HADLOCK_1984` | `@1` | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` |

`EFW_GROWTH_HADLOCK_1991` permanece o nome da família. Não é o identificador do método V1, porque Hadlock 1991 sozinho não fixa tabela versus equação. O método autorizado é `HADLOCK 1991 CHART ANCHORS + DAY INTERPOLATION + Z INTERPOLATION`. Não é “a fórmula original de percentil exato do Hadlock”.

`GE_VOLUSON_E6_EFW_CONFIGURATION = PENDING DEVICE CONFIRMATION` continua. Isso é `PRACTICAL DEVICE COMPATIBILITY GATE`, não bloqueio matemático da V1.

`REPORT AUTO-CONSOLIDATION = PRODUCT DECISION APPROVED`. O gerador textual futuro consolida o laudo a partir dos dados estruturados, sem botão artificial. Essa Sprint não gera texto nem conclusão.

Não há classificação de crescimento, PIG, GIG, FGR, conclusão, Doppler interpretado nem laudo.

## Preferência clínica registrada

Família Hadlock. A Dra. Karen quer comportamento compatível com o GE Voluson como referência prática. DBP, CC, CA e CF são as medidas capturadas e desejadas. Isso nomeia a candidata de peso; não confirma a variante gravada no aparelho e não aprova coeficientes.

## Dispositivo de compatibilidade

| Afirmação | Estado |
|---|---|
| `REFERENCE DEVICE = GE VOLUSON E6` | dispositivo identificado |
| Configuração de PFE confirmada | não |
| `GE_VOLUSON_E6_EFW_CONFIGURATION` | `PENDING DEVICE CONFIRMATION` |

O Voluson é `REFERENCE DEVICE / PRACTICAL COMPATIBILITY TARGET`. Não substitui a publicação científica. O aparelho pode oferecer mais de uma variante Hadlock. Não assumir que GE Voluson E6 significa automaticamente DBP + CC + CA + CF.

`GE_VOLUSON_E6_EFW_CONFIGURATION = PENDING DEVICE CONFIRMATION` permanece. Uma observação posterior, em outro equipamento, não altera esse estado.

Duas perguntas futuras, ambas rastreáveis:

1. O cálculo está correto segundo a referência científica?
2. O resultado é compatível com o comportamento esperado do dispositivo da Dra. Karen?

## Hierarquia de fonte

A ordem da ADR-014 permanece: publicação primária; documentação oficial do fabricante; diretriz ou sociedade; revisão metodológica robusta; fonte secundária apenas como apoio.

LOINC pode corroborar a identificação e a representação padronizada de uma equação. Não substitui a publicação primária na governança científica.

## Candidatas

### `EFW_HADLOCK_1985_BPD_HC_AC_FL` — peso fetal estimado

| Atributo | Valor nesta fundação |
|---|---|
| Finalidade | Calcular o PFE a partir de biometria |
| Família | Hadlock |
| Entradas desejadas | BPD / DBP, HC / CC, AC / CA, FL / CF |
| Saída | PFE em gramas |
| Status | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` `@1` |
| Implementação | motor puro; não `CLINICALLY_RELEASED` |
| Cálculo dependente | `fetus.efw.hadlock` |

A compatibilidade com o GE Voluson E6 continua pendente e não bloqueia o cálculo. A equação V1, em centímetros, é:

```text
log10(EFW[g]) = 1.3596 - 0.00386*AC*FL + 0.0064*HC + 0.00061*BPD*AC + 0.174*FL + 0.0424*AC
EFW[g] = 10 ^ log10(EFW)
```

A interface captura milímetros. A conversão é `cm = mm / 10`, sem arredondamento intermediário. A tela mostra `round(rawWeightGrams)`. O percentil recebe o peso cru. Não há fallback para outra combinação Hadlock. Falta de qualquer medida deixa o PFE `UNAVAILABLE_INCOMPLETE_INPUT` e não impede o rascunho.

| Eixo | Estado |
|---|---|
| Fonte científica | Hadlock et al., Am J Obstet Gynecol. 1985;151(3):333-337 |
| Família da fórmula | AC + BPD + FL + HC / Hadlock 1985 |
| LOINC | `11732-5`, corroboração; não substitui o artigo |
| Comportamento de dispositivo independente | consistente com Hadlock de quatro parâmetros; não é o Voluson E6 |
| Compatibilidade com o GE Voluson E6 | `PENDING DEVICE CONFIRMATION` |
| Unidades e arredondamento | cálculo completo; exibição em gramas inteiras |
| Fixtures | sintéticas, em `biometry-growth.test.ts` |

Publicação primária candidata:

Hadlock FP, Harrist RB, Sharman RS, Deter RL, Park SK. Estimation of fetal weight with the use of head, body, and femur measurements — a prospective study. Am J Obstet Gynecol. 1985;151(3):333-337. DOI: 10.1016/0002-9378(85)90298-4.

O texto completo do artigo não foi relido como gate separado desta Sprint. A equação acima é a transcrição autorizada para `@1`, com corroboração LOINC. A liberação clínica continua pendente.

Sequência, com motor:

```text
BPD + HC + AC + FL → Hadlock 1985 → PFE em gramas
```

Terminologia padronizada: `LOINC 11732-5`, peso fetal estimado a partir de AC, BPD, FL e HC pelo método Hadlock 1985. O LOINC documenta a equação correspondente e cita o artigo de 1985. Isso corrobora a identificação. Não substitui a publicação primária e não cola a equação neste repositório.

Evidência de dispositivo, sem identificadores e sem medidas: uma tela de equipamento de ultrassonografia, que não é o GE Voluson E6, exibiu explicitamente `Hadlock4 (AC, BPD, FL, HC)` como referência de EFW/PFE e usou BPD, HC, AC e FL no exame. Conferência independente da equação Hadlock de quatro parâmetros coincidiu, após arredondamento, com o EFW exibido. Registro metodológico: o comportamento observado é consistente com o cálculo de PFE Hadlock AC+BPD+FL+HC. Essa observação não confirma a configuração do Voluson E6 da Dra. Karen.

### `EFW_GROWTH_HADLOCK_1991_CHART_Z_INTERP` — percentil do PFE

Distinto da fórmula de peso. Chart `HADLOCK_1991_CHART_COMPAT_V1`.

| Atributo | Valor |
|---|---|
| Status | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` `@1` |
| Método | âncoras do chart + interpolação por dia + interpolação em z-score |
| Faixa | 10s 0d a 40s 0d, sem extrapolação |
| Fora das âncoras | `<P3` e `>P97`, percentil interno nulo |
| Exibição | uma casa decimal, por exemplo `P42,7` |
| Cálculo dependente | `fetus.efwPercentile` |

`KNOWN_SOURCE_ANOMALY_CORRECTION`: semana 30, P97 publicado 1649 g, canônico V1 1949 g, porque 1649 g fica abaixo do P90 publicado (1824 g). A correção é explícita e versionada. Outra escolha exige versão nova do chart.

A política de dia é desta referência: fração `dias / 7` entre a semana N e N+1, de 10s 0d até 39s 6d. 40s 0d usa a linha 40. A interpolação do percentil ocorre no z-score, não entre os rótulos 10 e 50.

```text
biometria → PFE → comparação do PFE com a referência por idade gestacional → percentil do PFE
```

### `AC_GROWTH_HADLOCK_1984` — percentil da CA

| Atributo | Valor nesta fundação |
|---|---|
| Finalidade | Derivar o percentil da circunferência abdominal |
| Entrada clínica | CA medida |
| Saída | percentil da CA |
| Status | `IMPLEMENTED_NOT_CLINICALLY_RELEASED` `@1` |
| Implementação | motor puro; não `CLINICALLY_RELEASED` |
| Cálculo dependente | `fetus.acPercentile` |

Equação, com idade gestacional decimal `semanas + dias / 7` e CA em centímetros:

```text
média = -13.3 + 1.61*IG - 0.00998*IG^2
desvio-padrão = 1.34 cm
z = (CA observada - média) / 1.34
```

Faixa inclusiva 12s 0d a 40s 0d. Fora dela, sem extrapolação. A exibição usa uma casa decimal. Valor que arredondaria para 0,0 ou 100,0 aparece como `<P0,1` ou `>P99,9`; o número interno não muda. Não classifica crescimento.

## Semanas + dias

`GESTATIONAL_AGE_DAY_LEVEL_POLICY = REFERENCE_DEFINED`.

O PFE não usa idade gestacional. O percentil do PFE usa `INTERPOLATED_TABLE`. O percentil da CA usa `CONTINUOUS_EQUATION` (`semanas + dias / 7`).

A IG corrigida do exame soma os dias civis entre a data da primeira ultrassonografia e a data do exame à IG daquela ultrassonografia. Não há fallback para DUM. Se a âncora ou a data do exame faltarem, ou se o exame for anterior à datação, os percentis ficam indisponíveis e o PFE ainda pode ser calculado.

Não existe coluna própria de data do exame. A V1 usa o calendário UTC de `Exam.createdAt`, a mesma convenção `YYYY-MM-DD` já aplicada às datas clínicas date-only. A subtração é de datas civis, sem horário local e sem DST.

## O que este pacote não contém

- Imagens, identificadores ou medidas de exames reais.
- Classificação clínica de crescimento ou texto de laudo.
- Migration. Os resultados são derivados dos inputs e da versão da referência.
- Liberação clínica. O gate do Voluson E6 continua aberto.
