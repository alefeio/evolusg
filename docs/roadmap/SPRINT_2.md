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

## Infra backlog

`PREVIEW AUTH ORIGIN CONFIGURATION — INFRASTRUCTURE HYGIENE`

Novas branches de Preview têm exigido override manual de `BETTER_AUTH_URL`. O objetivo futuro é reduzir essa configuração sem abrir wildcard inseguro. Não implementado nesta Batch.
