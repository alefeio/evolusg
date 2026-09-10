# ADR-004 — Motor de regras

- **Status:** PROPOSED
- **Maturidade (auditoria):** prematuro no detalhe do motor; adequado na recusa de complexidade
- **Decidir até:** depois do primeiro recorte clínico validado orientar quais regras **existem**; não na Sprint 0

## A. Problema

Expressar visibilidade, obrigatoriedade, validação e (mais tarde) cálculo e texto de forma determinística, testável e sem linguagem geral insegura — sem espalhar isso na UI.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Sem `eval`, sem IA no motor de laudo, sem linguagem Turing-completa | `KNOWN` (restrição de produto/segurança) |
| Cálculos só com catálogo aprovado | `KNOWN` (processo); catálogo hoje vazio |
| Lista de operadores (`eq`, `neq`, …) | `PROPOSED` / **prematuro** |
| Ordem fixa: defaults → visibilidade → cálculos → validação → texto → conclusão | `PROPOSED` / **prematuro** até saber quais dessas camadas o recorte usa |
| JSON próprio vs JSONLogic restrito | `PENDING TECHNICAL VALIDATION` (e não deve ser escolhido nesta etapa) |
| Quais regras o primeiro exame realmente tem | `PENDING CLINICAL DISCOVERY` |

## C. Prematuridade

**Prematuro** como desenho de engine. **Adequado** como recusa de Drools/CEL/`eval`. Construir essa lista e essa ordem agora é framework genérico à frente do domínio.

## Invalidation Triggers

- Recorte clínico cujo condicional não se expressa com operadores binários simples.
- Descoberta de que o MVP 1 quase não tem regra — motor mínimo (ou até código pontual extraído depois) seria suficiente.
- Cálculo aprovado que exija função fora de qualquer whitelist imaginada agora (tratar só quando o cálculo existir).
- Evidência de overengineering: mais tempo no motor do que no laudo.

## Decisão proposta (restrita)

Não escolher biblioteca nem fechar operadores nesta Sprint 0. O primeiro recorte validado define o subconjunto mínimo de regras. Cálculos continuam proibidos sem catálogo.

## Alternativas

Motor rico (Drools/CEL): recusado por agora. Regras só em TypeScript por exame: acopla obstetrícia; pode ser ** paliação do MVP 1** se o recorte for mínimo (`PENDING PRODUCT DECISION`, não adotado).
