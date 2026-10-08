# Pacote de validação — referências Hadlock v0.1

Fundação documental. Não implementa cálculo, não cria fixture numérica e não libera uso clínico.

Princípio: [ADR-014](../adr/ADR-014-referencias-clinicas-versionadas.md). Catálogos: [`CALCULATION_CATALOG.md`](CALCULATION_CATALOG.md), [`CLINICAL_FIELD_CATALOG.md`](CLINICAL_FIELD_CATALOG.md), [`REFERENCE_VALIDATION_BACKLOG.md`](REFERENCE_VALIDATION_BACKLOG.md).

Nenhum item abaixo está `READY_FOR_IMPLEMENTATION`, `IMPLEMENTED_NOT_CLINICALLY_RELEASED` ou `CLINICALLY_RELEASED`. Nenhum `@n` está ativo.

## Review da fundação

`CLINICAL REFERENCE FOUNDATION REVIEW APPROVED`

O review documental e arquitetural aprovou a fundação, não as referências clínicas. Foram aprovados: a ADR-014 como princípio arquitetural; a taxonomia de status; a separação entre `ClinicalReference` e `Calculation`; o versionamento; a rastreabilidade; a especificação conceitual de fixtures; a separação entre referência científica e compatibilidade de dispositivo; o pacote Hadlock v0.1; e a manutenção dos blockers metodológicos.

Esse review não altera status clínico. Permanecem `EFW_HADLOCK_1985_BPD_HC_AC_FL` = `DEVICE_MATCH_PENDING`, `EFW_GROWTH_HADLOCK_1991` = `METHOD_DEFINITION_PENDING` e `AC_GROWTH_HADLOCK_1984` = `SOURCE_VALIDATION_PENDING`.

Os blockers restantes pertencem à validação dos futuros cálculos. Para o PFE: configuração específica do GE Voluson E6, conferência direta da equação no texto primário, unidades/precisão/arredondamento e fixtures sintéticas validadas. Para o percentil do PFE: método exato Hadlock 1991, tabela versus equação ou distribuição, política de semanas + dias, interpolação, precisão/limites/arredondamento, fixtures e comparação futura com dispositivo. Para o percentil da CA: publicação, método/equação/tabela, dispersão, semanas + dias, política de percentil e fixtures.

## Próximo bloco

`CLINICAL REFERENCE VALIDATION — BIOMETRY & GROWTH = NEXT`

Ainda não iniciado. Prioridades, sem execução nesta consolidação: fechar o PFE Hadlock 1985; definir o método do percentil do PFE Hadlock 1991; validar o percentil da CA Hadlock 1984; semanas + dias; unidades, precisão e arredondamento; fixtures científicas ou sintéticas. Isso não abre Sprint nova e não ativa cálculo.

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
| Status global | `DEVICE_MATCH_PENDING` |
| Implementação | não implementado; não `ACTIVE`; não `READY_FOR_IMPLEMENTATION` |
| Cálculo dependente | `fetus.efw.hadlock` |

`DEVICE_MATCH_PENDING` não significa mais “fórmula desconhecida”. A família da fórmula está fortemente identificada. O que falta para sair desse status é a compatibilidade específica com o GE Voluson E6.

| Eixo | Estado |
|---|---|
| Fonte científica | `IDENTIFIED` |
| Família da fórmula | AC + BPD + FL + HC / Hadlock 1985 |
| Comportamento de dispositivo independente | `OBSERVED AND MATHEMATICALLY CONSISTENT` |
| Compatibilidade com o GE Voluson E6 | `PENDING` |
| Publicação primária identificada | sim |
| Corroboração da fórmula por terminologia clínica padronizada | sim |
| Conferência direta da transcrição da equação no texto completo do artigo | pendente |
| Unidades, precisão e arredondamento | abertos |
| Fixtures sintéticas validadas | abertas |

Publicação primária candidata:

Hadlock FP, Harrist RB, Sharman RS, Deter RL, Park SK. Estimation of fetal weight with the use of head, body, and femur measurements — a prospective study. Am J Obstet Gynecol. 1985;151(3):333-337. DOI: 10.1016/0002-9378(85)90298-4.

O texto completo desse artigo não foi revisado nesta atualização. A conferência direta da equação no artigo permanece um gate de governança.

Terminologia padronizada: `LOINC 11732-5`, peso fetal estimado a partir de AC, BPD, FL e HC pelo método Hadlock 1985. O LOINC documenta a equação correspondente e cita o artigo de 1985. Isso corrobora a identificação. Não substitui a publicação primária e não cola a equação neste repositório.

Evidência de dispositivo, sem identificadores e sem medidas: uma tela de equipamento de ultrassonografia, que não é o GE Voluson E6, exibiu explicitamente `Hadlock4 (AC, BPD, FL, HC)` como referência de EFW/PFE e usou BPD, HC, AC e FL no exame. Conferência independente da equação Hadlock de quatro parâmetros coincidiu, após arredondamento, com o EFW exibido. Registro metodológico: o comportamento observado é consistente com o cálculo de PFE Hadlock AC+BPD+FL+HC. Essa observação não confirma a configuração do Voluson E6 da Dra. Karen.

Sequência conceitual, ainda sem motor:

```text
BPD + HC + AC + FL → Hadlock 1985 → PFE em gramas
```

### `EFW_GROWTH_HADLOCK_1991` — percentil do PFE

Entrada distinta da fórmula de peso. Não reutilizar o identificador do PFE.

| Atributo | Valor nesta fundação |
|---|---|
| Finalidade | Comparar o PFE com uma referência de crescimento por idade gestacional e obter o percentil do peso |
| Status | `METHOD_DEFINITION_PENDING` |
| Implementação | não implementado; não `ACTIVE` |
| Cálculo dependente | `fetus.efwPercentile` |
| Depende de | `EFW_HADLOCK_1985_BPD_HC_AC_FL` para o peso; política de idade gestacional ainda aberta |

A família Hadlock está identificada. `Hadlock 1991` sozinho não é especificação suficiente para implementação. Há evidência metodológica de que tabela e equações publicadas para Hadlock 1991 podem não produzir exatamente os mesmos centis.

O método oficial do evolUSG ainda precisa escolher e documentar uma política explícita:

- equações ou distribuição derivadas da metodologia;
- tabela publicada;
- interpolação da tabela;
- outra política explicitamente validada.

Continuam abertos: conversão de semanas + dias, interpolação quando aplicável, precisão, limites, arredondamento, fixtures e comparação com o dispositivo. Essa política não se estende às outras referências.

```text
biometria → PFE → comparação do PFE com a referência por idade gestacional → percentil do PFE
```

### `AC_GROWTH_HADLOCK_1984` — percentil da CA

| Atributo | Valor nesta fundação |
|---|---|
| Finalidade | Derivar o percentil da circunferência abdominal |
| Entrada clínica | CA medida |
| Saída | percentil da CA |
| Status | `SOURCE_VALIDATION_PENDING` |
| Implementação | não implementado; não `ACTIVE` |
| Cálculo dependente | `fetus.acPercentile` |

A CA medida é captura. O percentil da CA é derivado e é diferente do percentil do PFE. A Dra. Karen confirmou que os dois percentis são essenciais. A publicação, a equação ou tabela, o desvio-padrão quando aplicável, a política de semana + dia e as fixtures ainda não estão validados.

## Semanas + dias

`GESTATIONAL_AGE_DAY_LEVEL_POLICY = REFERENCE_DEFINED`.

Cada referência acima declara a própria política quando o método fechar. Opções: `CONTINUOUS_EQUATION`, `DISCRETE_WEEK_LOOKUP`, `INTERPOLATED_TABLE`, `REFERENCE_DEFINED_OTHER`. Nesta v0.1 as três candidatas estão com política **não declarada**. `decimalWeeks = weeks + days / 7` não se aplica a elas até que a referência congele `CONTINUOUS_EQUATION`.

## O que este pacote não contém

- Coeficientes, tabelas ou exemplos numéricos tratados como verdade clínica.
- Imagens ou transcrições de exames reais enviados na investigação. Esse material não entra no repositório, não vira fixture e não identifica paciente.
- Migration, schema, API, formulário ou teste executável.
