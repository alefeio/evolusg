# evolUSG

Plataforma web para elaboração estruturada de laudos de ultrassonografia.

**Ciclo 1:** obstetrícia da Dra. Karen.  
**Fase atual:** Sprint 0 clínica (em paralelo, **não encerrada**) + Sprint 1 fundação/autenticação (autorizada).  
**Implementação clínica:** ainda não iniciada.

A documentação de produto, arquitetura e descoberta clínica está em [`docs/`](docs/README.md). Detalhe da Sprint 1: [`docs/roadmap/SPRINT_1.md`](docs/roadmap/SPRINT_1.md).

## Aplicação (Sprint 1)

Next.js (App Router) + TypeScript, PostgreSQL, Prisma, Better Auth (e-mail + senha) e Resend.

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Variáveis: copie `.env.example` para `.env`. Nenhum secret entra no Git. Nenhum secret usa `NEXT_PUBLIC_`.

Cadastro do piloto: `PILOT_REGISTRATION_ENABLED` + `PILOT_ALLOWED_EMAILS` (server-side). Allowlist vazia com o modo piloto ligado bloqueia novos cadastros.

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` / `npm run typecheck` / `npm run lint` / `npm test`
- `npm run db:migrate` — criar migration (dev)
- `npm run db:deploy` — aplicar migrations
