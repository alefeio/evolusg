# Sprint 3 — Biometry & Growth Engine V1

Primeira Sprint que ativa cálculos clínicos dependentes de referências versionadas. A captura singleton já estava estabilizada. Esta Sprint não é laudo, classificação nem liberação clínica.

`REPORT AUTO-CONSOLIDATION = PRODUCT DECISION APPROVED`

Quando existir gerador textual, o laudo se consolida a partir dos dados estruturados, sem botão “Gerar laudo”. Isso não foi implementado aqui.

## Escopo

Implementado:

- PFE Hadlock 1985 com DBP, CC, CA e CF (`EFW_HADLOCK_1985_BPD_HC_AC_FL@1`);
- percentil do PFE pela política `EFW_GROWTH_HADLOCK_1991_CHART_Z_INTERP@1`;
- percentil da CA Hadlock 1984 (`AC_GROWTH_HADLOCK_1984@1`);
- resultado imediato na biometria, com a mesma função pura no cliente, no servidor e nos testes;
- fixtures sintéticas.

Fora de escopo: classificação de crescimento, PIG/GIG/FGR, conclusão, interpretação Doppler, P5/P95, texto clínico, PDF/DOCX, múltiplos e LLM.

## Registro

O conjunto é `BIOMETRY_GROWTH_HADLOCK_V1`, em `src/lib/clinical/growth/`. Não há framework universal nem tabela Prisma de referência. Os resultados não são gravados: saem dos inputs persistidos e da versão da referência. `NO DATABASE MIGRATION`.

A precisão interna não é a precisão de tela. O PFE interno permanece cru; a tela arredonda para gramas inteiras; o percentil do PFE usa o peso cru.

## Idade gestacional

A IG corrigida usa a primeira ultrassonografia de datação mais os dias civis até a data do exame. Não usa DUM como fallback. Sem âncora confiável, os percentis ficam indisponíveis e o PFE ainda pode ser calculado.

Não há campo próprio de data do exame. A V1 lê o calendário UTC de `Exam.createdAt`, na mesma forma `YYYY-MM-DD` das outras datas clínicas, e subtrai datas civis. Isso evita horário local e DST. Não é a confirmação de um campo clínico futuro de “data do exame”.

## Dispositivo

`GE_VOLUSON_E6_EFW_CONFIGURATION = PENDING DEVICE CONFIRMATION`

`PRACTICAL DEVICE COMPATIBILITY GATE`. Não bloqueia esta implementação.

## Status

As três referências ficam `IMPLEMENTED_NOT_CLINICALLY_RELEASED`.

`NOT CLINICALLY RELEASED`

`PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE`

A ordem do formulário permanece `CLINICAL FORM ORDER = VALIDATED BY PILOT USER`. A seção de biometria passou a mostrar um campo por linha e o resultado ao lado do dado, sem mudar a ordem das seções.
