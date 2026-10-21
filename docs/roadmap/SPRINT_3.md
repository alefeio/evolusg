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

O conjunto é `BIOMETRY_GROWTH_HADLOCK_V1`, em `src/lib/clinical/growth/`. Não há framework universal nem tabela Prisma de referência. Os resultados derivados não são gravados: saem dos inputs persistidos e da versão da referência.

A data em que a ultrassonografia foi realizada é `Exam.examDate`, coluna PostgreSQL `DATE`, dia civil, sem hora. `EXAM CLINICAL DATE != RECORD CREATED AT`. `createdAt MUST NEVER BE USED AS GESTATIONAL-AGE CLINICAL INPUT`. A migration é só aditiva e não copia `createdAt` para exames antigos.

A precisão interna não é a precisão de tela. O PFE interno permanece cru; a tela arredonda para gramas inteiras; o percentil do PFE usa o peso cru.

## Idade gestacional

A IG corrigida usa a primeira ultrassonografia de datação mais os dias civis até `Exam.examDate`. Não usa DUM como fallback. Sem data do exame, os percentis ficam `UNAVAILABLE_MISSING_EXAM_DATE` e o PFE ainda pode ser calculado. Sem âncora completa, os percentis continuam indisponíveis. Se a data do exame for anterior à primeira ultrassonografia, o cálculo não segue em silêncio.

`EXAM CLINICAL DATE != RECORD CREATED AT`. `createdAt MUST NEVER BE USED AS GESTATIONAL-AGE CLINICAL INPUT`. A subtração é de datas civis, sem horário local, offset ou DST. Exames anteriores à coluna permanecem com `examDate` nulo até a data ser informada.

## Dispositivo

`GE_VOLUSON_E6_EFW_CONFIGURATION = PENDING DEVICE CONFIRMATION`

`PRACTICAL DEVICE COMPATIBILITY GATE`. Não bloqueia esta implementação.

## Status

As três referências ficam `IMPLEMENTED_NOT_CLINICALLY_RELEASED`.

`NOT CLINICALLY RELEASED`

`PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE`

A ordem do formulário permanece `CLINICAL FORM ORDER = VALIDATED BY PILOT USER`. A seção de biometria passou a mostrar um campo por linha e o resultado ao lado do dado, sem mudar a ordem das seções.
