# ADR-014 — Referências clínicas versionadas

- **Status:** ACCEPTED — somente o princípio arquitetural
- **Aceite do princípio:** 2026-10-07
- **Maturidade (auditoria):** princípio fechado; schema, persistência, interpolação universal e qualquer curva específica continuam abertos
- **Decidir até:** antes de qualquer classificação clínica automática entrar em produção (não é pré-requisito da captura já entregue)

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
| Idade gestacional em semanas e dias; a política de cada curva é da própria referência | `KNOWN` como restrição (`GESTATIONAL_AGE_DAY_LEVEL_POLICY = REFERENCE_DEFINED`); método de cada curva continua aberto |
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

## Decisão

**Aceito**, em 2026-10-07, somente este princípio:

> Clinical calculations must depend on explicit, versioned, traceable references.

As cinco restrições acima fazem parte desse princípio. **Não** estão aceitos: schema físico, migration, formato de armazenamento, política universal de interpolação, escolha de curva, coeficiente ou percentil. Nenhuma referência Hadlock fica validada por esta decisão.

Pacote candidato e status: [`../clinical-discovery/CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md`](../clinical-discovery/CLINICAL_REFERENCE_VALIDATION_HADLOCK_V0_1.md).

## Modelo conceitual

`ClinicalReference` é conceito. Não é tabela Prisma.

- `referenceId`, `displayName`, `source`, `sourceYear`, `sourceVersion`
- `purpose`, `inputFields`, `inputUnits`, `output`
- `gestationalAgeRange`, `gestationalAgePolicy`, `percentilePolicy`
- `validationStatus`, `implementationVersion`
- `dependentCalculations`, `fixtures`, histórico de mudança

O identificador versionado tem a forma `referenceId@implementationVersion`, por exemplo `EFW_HADLOCK_1985_BPD_HC_AC_FL@1`. Mudança de fórmula, coeficiente, tabela, fonte, faixa gestacional, interpolação, arredondamento ou política de percentil gera nova versão. Referência já usada em resultado clínico não é sobrescrita em silêncio. Nesta fundação nenhum `@n` está ativo: a versão nasce quando método, coeficientes e política forem congelados.

IDs preferem finalidade, família, ano e entradas. Numeração solta (`HADLOCK_1` … `HADLOCK_4`) fica proibida, porque fabricantes e publicações não concordam nessa ordem.

## Taxonomia de `validationStatus`

Vale para o objeto referência. Não substitui os três eixos de campo, frase e cálculo em [`TRACEABILITY.md`](../clinical-discovery/TRACEABILITY.md). Enquanto a referência não estiver `CLINICALLY_RELEASED`, o eixo de fonte do cálculo dependente permanece `SOURCE_VALIDATION_PENDING`.

| Status | Significado |
|---|---|
| `SOURCE_NOT_IDENTIFIED` | Ainda não há fonte candidata. |
| `SOURCE_IDENTIFIED` | Existe publicação candidata. |
| `SOURCE_VALIDATION_PENDING` | Fonte candidata ainda sem validação metodológica ou clínica. |
| `DEVICE_MATCH_PENDING` | Referência científica candidata; falta comparar com a configuração do equipamento de referência prática. |
| `METHOD_DEFINITION_PENDING` | Família identificada; falta o método exato, a interpolação ou a política operacional. |
| `READY_FOR_IMPLEMENTATION` | Fonte, método, entradas, unidades, limites e fixtures definidos. |
| `IMPLEMENTED_NOT_CLINICALLY_RELEASED` | Código existe; uso clínico não liberado. |
| `CLINICALLY_RELEASED` | Somente depois de todos os gates futuros. |

Nenhuma referência Hadlock está em `READY_FOR_IMPLEMENTATION`.

## Idade gestacional e precisão

`GESTATIONAL_AGE_DAY_LEVEL_POLICY = REFERENCE_DEFINED`.

A idade gestacional é semanas + dias. Não há regra universal de “sempre a semana anterior”, “sempre arredondar” ou “sempre a semana seguinte”. `decimalWeeks = weeks + days / 7` só é aceitável quando a própria referência declarar função contínua. Cada `ClinicalReference` declara uma política: `CONTINUOUS_EQUATION`, `DISCRETE_WEEK_LOOKUP`, `INTERPOLATED_TABLE` ou `REFERENCE_DEFINED_OTHER`.

`CALCULATION_PRECISION != DISPLAY_PRECISION`. O cálculo interno futuro mantém precisão suficiente. O arredondamento de tela ou laudo é outra decisão. O número de casas decimais não fecha nesta ADR.

## Hierarquia de fonte

1. Publicação primária.
2. Documentação oficial do fabricante.
3. Diretriz ou sociedade científica.
4. Revisão metodológica robusta.
5. Fonte secundária apenas como apoio.

Chat, blog e página não oficial podem ajudar a investigação e nunca são `ClinicalReference`.

## Dispositivo e publicação

O equipamento de referência prática responde se o resultado é compatível com o comportamento esperado no consultório. A publicação responde se o cálculo está correto segundo a ciência. As duas perguntas permanecem rastreáveis e uma não substitui a outra. O GE Voluson E6 está identificado como dispositivo; a configuração de PFE dele não está confirmada.

## Cadeia

```text
ClinicalReference
  → ClinicalRequirement
    → Calculation
      → Fixture
        → Automated Test
          → ProtocolVersion
            → ReportVersion futura
```

Um número clínico futuro precisa poder responder qual versão da referência o gerou.
