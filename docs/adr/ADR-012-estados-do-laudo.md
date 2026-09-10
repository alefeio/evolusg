# ADR-012 — Estados do laudo

- **Status:** PROPOSED
- **Maturidade (auditoria):** máquina de estados **candidata**, não definitiva
- **Decidir até:** depois de validar o fluxo real de elaboração/emissão/correção; no máximo junto da emissão (MVP 1)

## A. Problema

Dar nomes estáveis aos momentos da vida de um **documento** (não do evento clínico): preenchendo, conferido, emitido, substituído — sem inventar estados a mais.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Estados aplicam-se à versão documental, não ao exame (se a tríade do ADR-009 se confirmar) | `PROPOSED` |
| Candidatos: `DRAFT`, `REVIEWED`, `ISSUED`, `SUPERSEDED` | `PROPOSED` — **máquina candidata** |
| Não usar `FINALIZADO` como estado extra no ciclo 1 | `PROPOSED` |
| Emissão exige `REVIEWED` vs revisar+emitir num ato | `PENDING CLINICAL DISCOVERY` / `PENDING PRODUCT DECISION` |
| Motivo obrigatório em retificação | `PENDING CLINICAL DISCOVERY` / `PENDING PRODUCT DECISION` |
| Fluxo real no Turing (quantos passos ela reconhece) | `PENDING CLINICAL DISCOVERY` |

**Não foram adicionados estados novos nesta auditoria.**

O fluxo real **precisa ser validado antes de qualquer implementação**. Esta lista não é a máquina a programar até essa validação.

## C. Prematuridade

**Parcialmente prematuro** como conjunto fechado. Adequado como vocabulário de discussão. `REVIEWED` pode não existir na prática dela; `SUPERSEDED` depende de como a correção for validada (ADR-009).

## Invalidation Triggers

- Ela emite sem um passo explícito de “revisado”.
- Correção que não substitui a versão (adendo paralelo) — `SUPERSEDED` não serve.
- Nomes em português obrigatórios na UI (tradução; não muda a máquina).
- Descoberta de um passo documental que estes quatro não cobrem — **não** acrescentar estado sem evidência; reabrir o ADR.

## Decisão proposta (restrita)

Tratar os quatro nomes como candidatos. Não aceitar a máquina. Não implementar.
