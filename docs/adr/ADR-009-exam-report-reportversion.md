# ADR-009 — Exam vs Report vs ReportVersion

- **Status:** PROPOSED
- **Maturidade (auditoria):** parcialmente prematuro
- **Decidir até:** antes do MVP 1, **depois** de validar com a profissional como ela corrige laudo hoje

## A. Problema

Separar o **evento clínico** (o ultrassom que aconteceu) do **documento** (o laudo que se emite e, se preciso, se corrige), para não falsificar a história de exames e para não sobrescrever papel já emitido.

## B. Classificação das partes — não misturar

| Afirmação | Tipo | Estado |
|---|---|---|
| Há um evento clínico distinto do PDF/DOCX | Decisão de arquitetura **candidata** | `PROPOSED` |
| Modelo `Exam → Report → ReportVersion` | Decisão de arquitetura **candidata** | `PROPOSED` |
| 1:1 Exam–Report no ciclo 1 | Hipótese de produto | `PROPOSED` / `PENDING PRODUCT DECISION` |
| Documento emitido não se sobrescreve (novo arquivo + hash) | Intenção documental de produto | `PROPOSED` (forte); validar prática dela |
| **Retificação não cria novo exame** | Decisão de fluxo de produto/documento | **`PROPOSED PRODUCT/DOCUMENT WORKFLOW DECISION`** — ver reconciliação v0.1 abaixo; **não** é regra clínica |
| Motivo, autor, timestamp na correção | Hipótese de fluxo | `PENDING CLINICAL DISCOVERY` + `PENDING PRODUCT DECISION` |
| Findings de trabalho no Exam + snapshot na versão | Decisão de arquitetura candidata | `PROPOSED` |
| Como ela corrige hoje no Turing (novo exame, adendo, reimpressão…) | Fato a descobrir | `PENDING CLINICAL DISCOVERY` |

A separação conceitual exame vs documento **pode permanecer** como proposta. A frase “retificação não cria novo exame” **não** está aceita: era hipótese apresentada com força demais no baseline anterior.

Não foram adicionados estados ou comportamentos além dos já candidatos no ADR-012.

## C. Prematuridade

**Parcialmente prematuro.** Três camadas (Exam/Report/ReportVersion) podem ser mais que o MVP 1 precisa se o fluxo de correção for outro. A invariante “não apagar o PDF emitido” é mais estável que a tríade.

## Invalidation Triggers

- Fluxo real em que “corrigir” = novo procedimento / novo registro de exame no sistema atual (ela pode querer o mesmo hábito).
- Prática documental de adendo sem nova versão completa.
- Requisito de um exame com vários documentos independentes no ciclo 1.
- Evidência de que Exam+ReportVersion (sem Report) basta — abstração superdimensionada.
- Descoberta incompatível com snapshot duplo de findings.

## Reconciliação Clinical Discovery v0.1 — needs amendment

A afirmação "retificação não cria outro `Exam`" apareceu na discovery. Ela é reclassificada, não aceita:

| Antes | Agora |
|---|---|
| `PENDING CLINICAL DISCOVERY` (tratada como fato clínico a descobrir) | `PROPOSED PRODUCT/DOCUMENT WORKFLOW DECISION` |

Justificativa da reclassificação: preservar a integridade da história de exames é decisão de **produto e documento**, não uma regra clínica que a médica dita. O que continua sendo pergunta clínica/operacional é **como ela corrige um laudo hoje** (novo registro, adendo, reimpressão) — isso segue `PENDING CLINICAL DISCOVERY` e é pergunta bloqueante antes de implementar emissão.

O que **não** muda: a tríade `Exam → Report → ReportVersion` continua `PROPOSED`, e a invariante "documento emitido não se sobrescreve" continua a parte mais estável do ADR.

Consequência para a próxima sprint: se o incremento parar antes da emissão do documento, esta decisão não precisa ser fechada.

## Decisão proposta (restrita)

Manter a tríade como **modelo conceitual candidato**. Validar correção de laudo na descoberta (tema P do guia; **não** na primeira conversa se o tempo não der). Não implementar.
