# Sprint 2 — Structured Clinical Draft

**Status:** `IMPLEMENTED — AWAITING HUMAN QA`  
**Branch:** `feat/sprint-2-clinical-draft`  
**PR:** https://github.com/alefeio/evolusg/pull/8  
**Autorização:** formal (captura + draft; sem laudo)  
**Dra. Karen:** `WAITING FOR SPRINT 2 QA`

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

## QA manual (Alexandre)

1. login; 2. criar paciente fictícia; 3. criar gestação; 4. criar exame Doppler; 5. preencher parcialmente; 6. salvar draft; 7. sair; 8. reabrir; 9. confirmar; 10. editar; 11. salvar; 12. logout/login; 13. localizar e reabrir.

**Não mergear** até aprovação do QA humano.  
Dra. Karen não testa o módulo clínico antes disso.
