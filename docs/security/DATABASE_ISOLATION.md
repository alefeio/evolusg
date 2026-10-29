# Isolamento do banco

Auditoria de 2026-10-29, depois do merge do PR #15.

`PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE`

`REAL_PATIENT_DATA_ALLOWED = false`

`DATABASE_ENVIRONMENT_ISOLATION = FAILED_SHARED_TARGET`

## Prova atual

O CLI da Vercel não devolve o valor dos secrets. A prova não usa connection string.

Cada variável abaixo é um único registro, com alvo Production e Preview ao mesmo tempo:

- `RUNTIME_DATABASE_URL` presente
- `DATABASE_URL` presente
- `POSTGRES_URL` presente
- `PRISMA_DATABASE_URL` presente
- `DIRECT_URL` ausente
- `DATABASE_ENV = preview` nos dois ambientes

Runtime dos dois ambientes resolve para o mesmo `RUNTIME_DATABASE_URL`. Migration dos dois resolve para o mesmo `POSTGRES_URL`. Os fingerprints de host, porta e database são portanto iguais. O SHA-256 não foi impresso porque o secret não é legível.

Nenhuma contagem foi consultada e nenhum dado foi copiado ou apagado.

## Corte

O corte não foi feito. Trocar o banco de Production derruba o login em `https://evolusg.com.br`. A validação fictícia da Dra. Karen continua no banco atual.

Para isolar, o owner precisa:

1. Criar um PostgreSQL vazio só para Production. Não copiar pacientes, episódios, exames, fetos, sessões, contas ou tokens.
2. Aplicar nesse banco vazio somente as migrations versionadas, com `npx prisma migrate deploy`. Não usar `db push`, `migrate reset`, `DROP` ou `TRUNCATE`. O comando não pode apontar para o banco compartilhado atual.
3. Na Vercel, manter o valor atual apenas em Preview. Criar valores próprios de Production para `RUNTIME_DATABASE_URL`, `DATABASE_URL`, `POSTGRES_URL` e `PRISMA_DATABASE_URL`. `DATABASE_ENV` de Production passa a `production`; Preview permanece `preview`.
4. Fazer redeploy só de Production.
5. Rodar `npm run db:audit-isolation` com as URLs dos dois ambientes. O resultado precisa ser `PASSED`.
6. Quem for usar Production depois do corte se cadastra de novo pelo fluxo normal.

## Guarda

`npm run db:audit-isolation`

Sem as variáveis `ISOLATION_PRODUCTION_*` e `ISOLATION_PREVIEW_*`, o comando imprime `NOT_CONFIGURED` e sai com código 0. Com os dois ambientes informados, imprime só fingerprints curtos e sai com código 1 quando os targets são iguais ou quando runtime e migration do mesmo ambiente divergem. A URL não entra na saída.
