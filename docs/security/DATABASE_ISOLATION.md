# Isolamento do banco

Auditoria de 2026-10-29, atualizada no mesmo dia.

`PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE`

`REAL_PATIENT_DATA_ALLOWED = false`

`DATABASE_ENVIRONMENT_ISOLATION = FAILED_SHARED_TARGET`

`PRODUCTION_DATABASE_CUTOVER = WAITING_FOR_CURRENT_CLINICAL_PILOT_ROUND`

`DATABASE ISOLATION GATE MUST USE STRICT MODE`

## Rótulo de ambiente

`DATABASE_ENV` de Production é `production`.

`DATABASE_ENV` de Preview é `preview`.

As connection strings não foram trocadas. Production e Preview continuam no mesmo banco físico.

## Resolução de target

Runtime da aplicação:

`RUNTIME_DATABASE_URL` → `DATABASE_URL`

Migration, em `prisma.config.ts` e no audit:

`DIRECT_URL` → `POSTGRES_URL` → `DATABASE_URL`

`PRISMA_DATABASE_URL` = `NOT_USED_BY_CURRENT_RESOLUTION`

A variável pode continuar na Vercel quando a integração do provider a cria. Ela não entra na resolução atual. Não é requisito do corte e não deve ser apagada só por isso.

## Prova do banco compartilhado

O CLI da Vercel não devolve o valor dos secrets. Cada connection string abaixo continua um registro único, com alvo Production e Preview:

- `RUNTIME_DATABASE_URL` presente
- `DATABASE_URL` presente
- `POSTGRES_URL` presente
- `DIRECT_URL` ausente

Os fingerprints de runtime e de migration são iguais entre os ambientes porque a string é a mesma. O SHA-256 não foi impresso.

Nenhuma contagem foi consultada. Nenhum dado foi copiado ou apagado.

## Auditoria

Execução local, sem variáveis `ISOLATION_*`:

`npm run db:audit-isolation`

Imprime `DATABASE_ISOLATION_AUDIT=NOT_CONFIGURED` e sai com código 0. Isso não aprova o isolamento.

Gate obrigatório:

`npm run db:audit-isolation:strict`

ou `ISOLATION_AUDIT_REQUIRED=true`.

No modo estrito, só `PASSED` sai com código 0. `NOT_CONFIGURED`, `MISSING_TARGET`, `FAILED_SHARED_TARGET`, `FAILED_WITHIN_ENVIRONMENT` e `DATABASE_TARGET_UNPARSEABLE` saem com código 1.

`NOT_CONFIGURED` não é aprovação.

## Corte

`PRODUCTION_DATABASE_CUTOVER = WAITING_FOR_CURRENT_CLINICAL_PILOT_ROUND`

O banco ativo de Production permanece o atual enquanto a Dra. Karen valida o motor clínico com dados fictícios. A troca não foi feita porque um banco novo vazio invalidaria as contas e sessões dessa rodada.

Não alterar agora:

- `RUNTIME_DATABASE_URL` de Production
- `DATABASE_URL` de Production
- `DIRECT_URL` de Production
- `POSTGRES_URL` de Production

## Banco novo

Criar o PostgreSQL somente com aprovação explícita se houver custo ou contratação. O banco novo deve ser exclusivo de Production, começar vazio e receber só o schema das migrations versionadas. Não clonar o banco do piloto.

Não copiar `User`, `Account`, `Session`, `Verification`, `Patient`, `PregnancyEpisode`, `Exam` nem `Fetus`.

Configuração preferida desse banco, quando o corte for autorizado:

- `RUNTIME_DATABASE_URL`: conexão runtime/pooled do banco novo
- `DIRECT_URL`: conexão direta do mesmo banco, para migrations
- `DATABASE_ENV=production`
- `DATABASE_URL` e `POSTGRES_URL`, se o provider exigir, no mesmo banco lógico de Production

Preview permanece no banco atual.

## Migrations do banco novo

Quando o banco existir, provar o target por fingerprint e só então rodar `npx prisma migrate deploy` com `DIRECT_URL` apontando para ele. Não usar `prisma db push`, `prisma migrate reset`, `DROP`, `TRUNCATE` nem `--force-reset`.

O esperado são 5 migrations aplicadas e `prisma migrate status` em schema current.

## Corte futuro

Executar só depois da autorização de Alexandre:

1. Confirmar o schema current do banco novo.
2. Manter Preview no banco antigo.
3. Apontar runtime e direct de Production para o banco novo.
4. Manter `DATABASE_ENV=production`.
5. Redeploy de Production.
6. Rodar o audit estrito.
7. Exigir runtime e migration do mesmo ambiente no mesmo target lógico, e Production diferente de Preview.
8. Só então classificar `PRODUCTION DATABASE ISOLATION — VERIFIED`.

Depois do corte, Alexandre e a Dra. Karen se cadastram de novo pelo fluxo normal, dentro da allowlist. Continuar só com dados fictícios.

`REAL_PATIENT_DATA_ALLOWED=false` permanece até uma decisão explícita posterior. O isolamento do banco não libera dado real.
