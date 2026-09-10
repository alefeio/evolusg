# ADR-011 — Residência, localização e transferência internacional de dados

- **Status:** PROPOSED
- **Maturidade (auditoria):** adequado ao estágio atual
- **Decidir até:** rascunho de inventário na fundação; **aceite de produção** só após validação jurídica/compliance

Este ADR **não é parecer jurídico**.

## A. Problema

O produto tratará dados de saúde. É preciso não tratar “Brasil sempre” como dogma da LGPD, nem enviar dado para o exterior por conveniência, sem registro e validação.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Dado de saúde exige cuidado de localização e operadores | `KNOWN` (intenção) |
| Este texto não é parecer legal | `KNOWN` |
| Preferência operacional por Brasil quando viável | `PROPOSED` (política operacional, não conclusão jurídica) |
| Transferência internacional pode ser lícita sob LGPD/ANPD | `PROPOSED` como **possibilidade**; validade no caso concreto = validação externa |
| Inventário de subprocessadores e regiões antes da produção | `PROPOSED` / obrigatório como processo de produto |
| Região efetiva do Prisma Postgres / Vercel já vinculados | `PENDING TECHNICAL VALIDATION` (inventariar; não concluir) |
| Posição jurídica sobre o stack real | `PENDING PRODUCT DECISION` + compliance externo |

## C. Prematuridade

**Adequado.** Não fecha região nem fornecedor. O risco é o contrário: produção com stack já escolhido (Prisma/Vercel) **antes** do inventário.

## Invalidation Triggers

- Posição jurídica/compliance que **exija** residência estrita no Brasil — vira política interna explícita, não “mito LGPD”.
- Posição que autorize regiões específicas com cláusulas/contratos.
- Impossibilidade técnica ou econômica de hospedar no Brasil.
- Mudança de subprocessador (Auth, storage, observabilidade) que altere o inventário.
- Produção com paciente real sem inventário — invalidaria o *processo*, não o ADR em si (seria violação).

## Decisão proposta (restrita)

Inventariar. Preferir BR quando viável. Não emitir conclusão legal. Não tratar o vínculo atual Prisma/Vercel como decisão de residência aceita.
