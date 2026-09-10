# ADR-002 — Representação de protocolos

- **Status:** PROPOSED
- **Maturidade (auditoria):** parcialmente prematuro
- **Decidir até:** não antes de existir recorte clínico validado o bastante para um primeiro artefato; no máximo no início do trabalho de motores (horizonte intermediário)

## A. Problema

Como guardar a definição de um exame (campos, seções, regras, frases) de forma que não fique espalhada na interface, possa ser revisada, testada e versionada, sem construir um editor visual agora.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Regras clínicas não devem viver em componentes de UI | `KNOWN` (princípio de produto) |
| Construtor visual não é do ciclo 1 | `KNOWN` (adiado) |
| Protocolo como documento estruturado (JSON **ou** YAML) | `PROPOSED` |
| Versionar em git **e** snapshot no banco na publicação | `PROPOSED` / `PENDING TECHNICAL VALIDATION` |
| `ProtocolVersion` imutável após publicar | `PROPOSED` (ligado ao ADR-003) |
| Níveis 2–3 de autoração depois de outro domínio | `PROPOSED` (horizonte distante) |
| Quais seções e campos o primeiro protocolo contém | `PENDING CLINICAL DISCOVERY` |
| JSON vs YAML vs outro formato | `PENDING PRODUCT DECISION` |

## C. Prematuridade

**Parcialmente prematuro.** A direção “protocolo como dados, não como tela” cabe à Sprint 0. Exigir já git+banco+formato concreto e metamodelo completo antecipa o primeiro recorte clínico.

## Invalidation Triggers

- Descoberta mostrar que o primeiro fluxo é tão pequeno que um artefato único versionado em código seria mais simples no MVP 1 (`PENDING PRODUCT DECISION` se isso ocorrer).
- Evidência de que a abstração de “protocolo genérico” está superdimensionada para um único exame.
- Requisito ainda desconhecido de edição por não-técnicos no ciclo 1 (improvável; invalidaria “só Nível 1”).
- Impossibilidade técnica de snapshot imutável no provedor escolhido (`PENDING TECHNICAL VALIDATION`).

## Decisão proposta (restrita)

Manter a **intenção**: definição de exame fora da UI, versionável. Não aceitar formato, persistência dupla (git+DB) nem metamodelo completo até o recorte clínico orientar o primeiro artefato.

## Alternativas (ainda abertas)

| Alternativa | Comentário |
|---|---|
| Só código TypeScript no MVP 1, extrair depois | Mais rápido; risco de obstetrícia grudar no deploy |
| Só git, snapshot no banco depois | Menos peça móvel |
| Só banco | Pior para review nesta fase |
| DSL clínica rica | Overengineering |

## Consequências se aceita cedo demais

Motor genérico nas Sprints 3–5 sem vertical slice; retrabalho quando o laudo real não couber no metamodelo imaginado.
