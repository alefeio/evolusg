# evolUSG

Plataforma web para elaboração estruturada de laudos de ultrassonografia.

**Ciclo 1:** obstetrícia da Dra. Karen.  
**Fase atual:** Sprint 0 clínica (em paralelo, **não encerrada**) + Sprint 1 fundação/autenticação (autorizada).  
**Implementação clínica:** ainda não iniciada.

A documentação de produto, arquitetura e descoberta clínica está em [`docs/`](docs/README.md). Detalhe da Sprint 1: [`docs/roadmap/SPRINT_1.md`](docs/roadmap/SPRINT_1.md).

## Aplicação (Sprint 1)

Next.js 16 (App Router) + TypeScript, PostgreSQL, Prisma, Better Auth (e-mail + senha) e Resend.

```bash
npm install
npm run dev
```

`prisma migrate deploy` somente com `DATABASE_ENV` (ou `VERCEL_ENV`) igual a `development`, `preview` ou `test`. Não aplicar em Production sem autorização.

Variáveis: copie `.env.example` para `.env`. Nenhum secret entra no Git. Nenhum secret usa `NEXT_PUBLIC_`.

Cadastro do piloto: `PILOT_REGISTRATION_ENABLED` + `PILOT_ALLOWED_EMAILS` (server-side). Allowlist vazia com o modo piloto ligado bloqueia novos cadastros.

## Scripts

- `npm run dev` — desenvolvimento
- `npm run lint` — ESLint CLI
- `npm run typecheck` / `npm test` / `npm run test:integration` / `npm run build`
- `npm run db:migrate` — criar migration (dev)
- `npm run db:deploy` — aplicar migrations
