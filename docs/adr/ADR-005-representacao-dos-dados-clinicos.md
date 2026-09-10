# ADR-005 — Representação dos dados clínicos

- **Status:** PROPOSED
- **Maturidade (auditoria):** parcialmente prematuro
- **Decidir até:** ao modelar o primeiro recorte (não exigir codeset universal agora)

## A. Problema

Não tratar o parágrafo do laudo como única verdade, para permitir personalizar texto, auditar significado e, no futuro, comparar exames — sem adotar FHIR completo.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Dado clínico ≠ frase | `KNOWN` (princípio de produto) |
| Não FHIR R4 completo no ciclo 1 | `PROPOSED` (adiado com justificativa de custo) |
| Finding com `path`, `valueType`, `code`, `quantity`, `source` | `PROPOSED` (formato canônico; campos reais `PENDING CLINICAL DISCOVERY`) |
| `source`: USER / CALCULATED / DEFAULT | `PROPOSED` |
| Snapshot de findings na `ReportVersion` emitida + estado de trabalho no `Exam` | `PROPOSED` (depende do ADR-009) |
| Codesets internos mapeáveis | `PROPOSED`; conteúdo `PENDING CLINICAL DISCOVERY` |

## C. Prematuridade

**Parcialmente prematuro.** O princípio é adequado. O registro canônico completo (path, codeSystem, dual storage Exam+Version) ainda não foi confrontado com um laudo real.

## Invalidation Triggers

- Laudos em que a profissional só reconhece o texto, sem campos estáveis — exigiria outro recorte de produto (não inventar campos para “forçar” estrutura).
- Descoberta de que o dado de trabalho e o snapshot emitido são o mesmo objeto na prática dela.
- Requisito de interoperabilidade FHIR no ciclo 1 (`PENDING PRODUCT DECISION`; hoje não há).
- Codeset incompatível com o vocabulário que ela realmente usa.

## Decisão proposta (restrita)

Manter “estruturar o dado, projetar o texto”. Não aceitar o schema de Finding nem o duplo armazenamento como definitivos.
