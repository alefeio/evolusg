# Sprint 2 — Structured Clinical Draft

**Status:** implementação em andamento → QA gate  
**Branch:** `feat/sprint-2-clinical-draft`  
**Autorização:** formal (captura + draft; sem laudo)

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

## Decisões técnicas

1. Presence: `true` = presente; `null` = não informado; nunca persistir `false` como “ausente” para movimentos/deglutição/incisura.
2. Fetus em tabela própria com `ordinal` — singleton agora, repeating group possível depois.
3. Sem Report / emissão / PDF nesta Sprint.
4. Sem classificação clínica (`SOURCE_VALIDATION_PENDING`).

## Explicitamente fora

Hadlock, percentil, crescimento, P5/P95, BCF auto, líquido auto, conclusão, PDF/DOCX, múltiplos, timeline, billing, LLM.

## QA

- Humano (Alexandre) no Preview com dados fictícios.
- Dra. Karen: `WAITING FOR SPRINT 2 QA`.
