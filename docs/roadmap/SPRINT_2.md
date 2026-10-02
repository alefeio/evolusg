# Sprint 2 — Structured Clinical Draft

**Status:** `SPRINT 2 = COMPLETED FOR CLINICAL PILOT` · `STRUCTURED CLINICAL DRAFT GATE = PASSED`  
**QA:** `SPRINT 2 QA APPROVED` — proprietário/QA Alexandre  
**Branch:** `feat/sprint-2-clinical-draft`  
**PR:** https://github.com/alefeio/evolusg/pull/8  
**Autorização:** formal (captura + draft; sem laudo)

Isso **não** significa laudo clínico completo, classificação automática, produto pronto para uso clínico real nem autorização para dados reais. `PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE` permanece.

## Escopo

Professional autenticado → Patient → PregnancyEpisode mínimo → Exam (`OBSTETRIC_DOPPLER`, singleton) → formulário estruturado → salvar/reabrir draft.

## Implementado

| Peça | Detalhe |
|---|---|
| Patient | nome; data nascimento opcional; notes; ownership por `ownerUserId` |
| PregnancyEpisode | DUM; G/P/A; 1ª USG + IG semanas/dias |
| Exam | DRAFT; comorbidades/medicações snapshot; placenta; líquido; uterinas |
| Fetus | ordinal 0 (singleton); posição; BCF; biometria; Doppler fetal |
| Regras | situação/apresentação; dorso/polo; não marcado ≠ ausente |
| Aritmética | IP médio uterinas; RCP matemático (sem classificação) |
| Rotas | `/app/pacientes`, `/novo`, `/[patientId]`, `/app/exames`, `/[examId]` |

## Migration

`20260923180000_clinical_draft_foundation`

- **Aditiva:** CREATE TYPE / CREATE TABLE / CREATE INDEX / FK
- **Sem** DROP, TRUNCATE, ALTER destrutivo
- Tabelas Better Auth **não** alteradas (apenas FKs novas apontando para `user`)
- Aplicada no banco compartilhado (topologia temporária aceita)

## Decisões técnicas

1. Presence: `true` = presente; `null` = não informado; nunca persistir `false` como “ausente” para movimentos/deglutição/incisura.
2. Fetus em tabela própria com `ordinal` — singleton agora, repeating group possível depois.
3. Sem Report / emissão / PDF nesta Sprint.
4. Sem classificação clínica (`SOURCE_VALIDATION_PENDING`).
5. Unit tests excluem `*.integration.test.ts`; integração via `npm run test:integration`.

## Explicitamente fora

Hadlock, percentil, crescimento, P5/P95, BCF auto, líquido auto, conclusão, PDF/DOCX, múltiplos, timeline, billing, LLM.

## Preview

- Alias: `https://evolusg-git-feat-sprint-2-clinical-draft-alefeios-projects.vercel.app`
- Deployment Protection da Vercel ativa neste Preview (SSO) — distinto da exception do host piloto.
- QA humano: Alexandre, dados fictícios apenas.

## Human QA

`SPRINT 2 QA APPROVED`

Validado manualmente pelo proprietário/QA Alexandre, com dados fictícios e sem blocker:

- criação e localização de paciente fictícia;
- contexto gestacional;
- criação do exame Obstétrica com Doppler;
- preenchimento estruturado;
- salvamento do rascunho;
- reabertura, edição e persistência;
- logout/login e recuperação posterior;
- regras estruturais do formulário.

Nenhum dado do teste é registrado aqui.

Próximo passo após consolidação no piloto público: feedback clínico da Dra. Karen sobre a experiência de preenchimento, ainda somente com dados fictícios. Nenhuma Sprint 3 foi iniciada.

## Clinical pilot feedback — batch 1

Incorporado depois do primeiro retorno da Dra. Karen, sem iniciar Sprint 3:

- técnica: convexo multifrequencial e endocavitário podem coexistir no mesmo exame (`transducersUsed`);
- dorso: direita, esquerda ou variável;
- placenta: grau 0, I, II ou III.

Frases para endocavitário isolado e para a combinação dos dois transdutores: `PENDING PHRASE VALIDATION`. Nenhum texto novo foi inventado.

**QA:** `CLINICAL FEEDBACK BATCH 1 QA APPROVED`

Validado manualmente pelo proprietário/QA Alexandre, sem dados do teste registrados aqui:

- persistência e interface imediatamente após salvar;
- drafts anteriores continuam compatíveis;
- navegação “Voltar para a paciente”.

Também validados: transdutor convexo, convexo com endocavitário, nenhum transdutor, dorso variável, placenta grau 0 e reload.

## Clinical pilot feedback — batch 2

`CLINICAL PILOT FEEDBACK — BATCH 2`

### Ducto venoso

A avaliação é opcional e manual. Não há regra automática do tipo “ACM e umbilical normais, então omitir o ducto”: a classificação de normalidade continua `SOURCE_VALIDATION_PENDING`.

| Estado | Significado |
|---|---|
| `ductusVenosusAssessed = false` | Bloco não incluído neste exame. Não é normal, ausente, negativo, não detectado nem alterado. |
| `true` + IP vazio | Estado transitório da tela. **Não** pode ser salvo. O próximo save exige IP ou desmarcação. Registros antigos nesse estado ainda abrem. |
| `true` + IP preenchido | Bloco incluído com valor capturado. |
| `null` | Legado ou ainda não decidido. Se já existir IP, a tela trata o bloco como incluído. Sem IP, não presume avaliação. |

Desmarcar o bloco grava `false` e preserva o IP já digitado.

**QA:** `CLINICAL FEEDBACK BATCH 2 QA APPROVED`

Validado manualmente pelo proprietário/QA Alexandre, sem dados do teste registrados aqui:

- semântica do ducto venoso opcional;
- persistência do estado `assessed`;
- rascunho parcial com bloco selecionado e sem IP;
- preservação do IP ao desmarcar;
- drafts anteriores com e sem ducto venoso;
- ausência de interpretação automática de normalidade.

### Percentis

`PFE_PERCENTILE` (`ESTIMATED_FETAL_WEIGHT_PERCENTILE`) e `CA_PERCENTILE` (`ABDOMINAL_CIRCUMFERENCE_PERCENTILE`) são requisitos clínicos essenciais e distintos. Nenhum dos dois é calculado enquanto Hadlock, as tabelas por idade gestacional e a interpolação semana+dia estiverem `SOURCE_VALIDATION_PENDING`. A redação do percentil da CA no laudo fica `PENDING PHRASE/PRODUCT VALIDATION`.

## Clinical pilot feedback — batch 3

`DUCTUS_VENOSUS_SELECTED_REQUIRES_PI = CLINICALLY_APPROVED`

`CLINICAL FORM ORDER = VALIDATED BY PILOT USER`

A Dra. Karen confirmou que conseguiria preencher o exame, com uma paciente na sua frente, na ordem atual das seções. Isso valida a macroestrutura. Não congela pequenos ajustes futuros de interface e não reorganiza as seções.

Salvar com o ducto venoso marcado exige IP. Durante a edição o campo pode aparecer vazio; o bloqueio é só no salvamento. Não selecionar continua válido e não significa normalidade. Um registro antigo marcado sem IP ainda abre; o próximo save pede o IP ou a desmarcação. Desmarcar continua preservando o IP já digitado.

Os percentis do PFE e da CA continuam essenciais e `SOURCE_VALIDATION_PENDING`, sem cálculo.

## Infra backlog

`PREVIEW AUTH ORIGIN CONFIGURATION — INFRASTRUCTURE HYGIENE`

Novas branches de Preview têm exigido override manual de `BETTER_AUTH_URL`. O objetivo futuro é reduzir essa configuração sem abrir wildcard inseguro. Não implementado nesta Batch.
