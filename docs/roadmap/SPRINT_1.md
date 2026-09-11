# Sprint 1 — Fundação e autenticação

**Status:** `ACCEPTED WITH OPERATIONAL PENDENCIES`  
**Descoberta clínica (Sprint 0):** continua **em paralelo** e **não está encerrada**.

A Sprint 1 foi **aceita tecnicamente**. Pendências restantes são de configuração externa (Vercel, pooler, Resend/domínio, e-mail real do piloto) e **não** de código da fundação. A Sprint 2 **não** foi iniciada.

> Estas pendências não bloqueiam o merge técnico da Sprint 1, mas bloqueiam o início do piloto com a Dra. Karen.

## Objetivo

Primeira fundação funcional do evolUSG: aplicação web, PostgreSQL, Prisma, identidade de `User` (cadastro controlado, login, sessão, verificação e recuperação de senha), e-mail transacional mínimo e preparação para a Vercel.

Nenhuma lógica clínica entra nesta sprint.

## Escopo

- Next.js (App Router) + TypeScript no mesmo projeto (UI + API)
- PostgreSQL + Prisma (migrations versionadas)
- Better Auth: e-mail + senha
- Cadastro com allowlist de piloto (`PILOT_REGISTRATION_ENABLED`, `PILOT_ALLOWED_EMAILS`)
- Verificação de e-mail
- Login / logout / sessões
- Recuperação e redefinição de senha
- Alteração de senha (revogar demais sessões quando adequado)
- Alteração de nome e de e-mail com verificação
- Listagem/revogação de outras sessões se o Better Auth permitir com baixa complexidade
- Abstração de e-mail via Resend (verificação, reset, troca de e-mail)
- Proteção server-side de áreas autenticadas
- Testes essenciais dos fluxos acima
- `.env.example` atualizado; secrets fora do Git
- Preparação de deploy na Vercel (sem publicar secrets)

## Não-escopo

- `ProfessionalProfile` (CRM, UF, especialidade, RQE, consultório, assinatura médica)
- Pacientes, exames, laudos, protocolos, motores, PDF/DOCX, cálculos, frases
- `Organization`, multi-tenancy, equipe
- Admin / RBAC / painel administrativo / campo `role` no User
- Billing, planos, gateway, `Subscription`, `Payment`
- Indicação / comissão / referral
- Exclusão definitiva de conta (`PENDING PRODUCT/LEGAL/ARCHITECTURAL DECISION`)
- Google, Apple, magic link, passkeys, 2FA
- Sistema genérico de notificações ou e-mail de marketing

## Backlog desta sprint

1. Bootstrap da aplicação e Prisma
2. Schema Better Auth + migration
3. Cadastro piloto + verificação + login/logout
4. Conta (nome, e-mail, senha, sessões)
5. Resend + templates
6. Testes e hardening
7. Documentação operacional (Resend/domínio, Vercel)

## Critérios de aceite

Fluxo feliz:

`usuário autorizado` → cadastro → verificação de e-mail → login → área protegida → sessão → atualização básica da identidade → alteração de senha → recuperação de senha → logout

E:

`usuário não autorizado` → cadastro bloqueado (server-side).

Fail-safe: em Preview/Production, piloto com allowlist ausente ou vazia **bloqueia** novos cadastros. Login de contas existentes não depende da allowlist.

## Definition of Done

- Build, typecheck, lint e testes essenciais passando
- Migrations reproduzíveis
- Secrets fora do Git
- Documentação desta sprint atualizada
- Nenhuma entidade clínica, billing ou admin
- Dependências externas (Resend/domínio/Vercel) não comprovadas em ambiente real marcadas como `IMPLEMENTED BUT OPERATIONAL CONFIGURATION PENDING`

## Dependências

- PostgreSQL já vinculado (variáveis `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL`)
- Conta Resend e `EMAIL_FROM` (domínio: pendência operacional se não houver)
- Vercel para Preview/Production
- E-mail da Dra. Karen **somente** via env (`PILOT_ALLOWED_EMAILS`), nunca hardcoded

## Riscos

| Risco | Mitigação |
|---|---|
| Três URLs de banco com o mesmo host direto (`db.prisma.io`) — sem pooler explícito | Usar `DATABASE_URL` para app e migrate; documentar ausência de URL pooled |
| Resend sem domínio verificado | Templates prontos; testes com mock; marcar config operacional pendente |
| Better Auth CLI vs Prisma 7 | Seguir adapter oficial; migration pelo Prisma, não `db push` permanente |
| Banco único sem rótulo Dev/Preview | Não rodar operações destrutivas; só criar tabelas de auth se o banco estiver vazio/adequado |

## Dependências operacionais

| Item | Estado |
|---|---|
| Resend (`RESEND_API_KEY`, `EMAIL_FROM`) e domínio de envio | `IMPLEMENTED BUT OPERATIONAL CONFIGURATION PENDING` até as variáveis reais e o domínio existirem. Não inventar domínio. |
| Allowlist do piloto (`PILOT_ALLOWED_EMAILS`) | Configurar por ambiente. Nunca hardcodar o e-mail da Dra. Karen. |
| Vercel Preview/Production | Preparado no código; deploy e env vars no dashboard da Vercel ficam pendentes até publicação controlada. |
| Pooler serverless (`pooled.db.prisma.io`) | `POOLED RUNTIME CONNECTION REQUIRED BEFORE VERCEL PREVIEW/PRODUCTION`. O ambiente local usa TCP direto. Isso não é adequado para runtime serverless da Vercel. Não inventar URL pooled. |
| Migration `auth_foundation` no banco remoto | Aplicada neste PostgreSQL classificado como **development** (Prisma Postgres, database `postgres`, schema `public`, PostgreSQL 17.2, host direto `db.prisma.io`). `DATABASE_ENV=development` no `.env` local refere-se **somente** a essa instância. |

`PILOT_REGISTRATION_ENABLED=false` em Production abriria o cadastro. Manter `true` no piloto.

## Como rodar localmente

1. Copiar `.env.example` para `.env` (já gitignored).
2. Preencher `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
3. Preencher `PILOT_ALLOWED_EMAILS` com o e-mail autorizado do piloto.
4. `npm install` (gera o client Prisma).
5. `npx prisma migrate deploy` somente se `DATABASE_ENV` (ou `VERCEL_ENV`) for `development`, `preview` ou `test`.
6. Opcional em desenvolvimento local: `AUTH_EMAIL_CAPTURE_FILE=.local-email-capture.json` para capturar e-mails transacionais sem Resend. Ignorado em Production/Vercel.
7. `npm run dev`

Scripts: `npm run lint` (ESLint CLI), `npm run typecheck`, `npm test`, `npm run test:integration`, `npm run build`.

Sem Resend configurado, o envio transacional não completa em produção. Em desenvolvimento local, se `AUTH_EMAIL_CAPTURE_FILE` estiver definido e `DATABASE_ENV=development`, os e-mails são gravados em arquivo gitignored — **não** é bypass público, **não** existe em Production/Vercel.

## Integration Unblock

Rodada local para destravar o que pudesse ser validado sem ações manuais externas do proprietário. Sem merge em `main`. Sem Sprint 2.

### Technical gates

| Item | Estado | Notas |
|---|---|---|
| Next.js | `PASSED` | 16.3.4 (App Router, `src/proxy.ts`). React 19.1. |
| Prisma | `PASSED` | 7.10. Client runtime: `@prisma/client` + `@prisma/adapter-pg`. Migration versionada `20260910200000_auth_foundation`. Sem `db push`. |
| Postgres | `PASSED` (development) | Auditoria somente leitura: Prisma Postgres, database `postgres`, schema `public`, PostgreSQL 17.2, TCP direto (não pooled). Antes da migration o schema público estava vazio; depois só tabelas Better Auth + `_prisma_migrations`. Sem dados clínicos/produtivos. `DATABASE_ENV=development` descreve **esta** instância. |
| Auth | `PASSED` | Better Auth + Prisma adapter + PostgreSQL real. Allowlist server-side. `requireEmailVerification` permanece ligado. |
| Browser / HTTP real | `PASSED` | `next dev` em `http://localhost:3000`. Cadastro/login/sessão/conta/logout/reset validados contra o app e o PostgreSQL. Verificação e reset sem Resend usaram captura local isolada. |
| Tests | `PASSED` | Vitest: **35 passed / 0 skipped / 0 failed**. Integração PostgreSQL: **2 passed / 0 skipped / 0 failed** (incluídos nos 35). Lint e typecheck passaram nesta rodada. |

`@prisma/streams-local` é dependência transitiva de `prisma` → `@prisma/dev` (CLI). Não entra no runtime Next. Classificação: `NO RUNTIME IMPACT`. Aviso de engine Node 22 pode aparecer no `prisma generate`; o app roda em Node 20.20.0.

`@eslint/eslintrc` foi removido das dependências diretas. Permanece transitivo via `eslint@9`. Flat config em `eslint.config.mjs` não o importa.

### Operational gates

| Item | Estado |
|---|---|
| Pooled runtime para Vercel | `POOLED RUNTIME CONNECTION REQUIRED BEFORE VERCEL PREVIEW/PRODUCTION` |
| Autenticação Vercel CLI | `PREVIEW DEPLOYMENT BLOCKED — VERCEL AUTHENTICATION REQUIRED` |
| Resend / domínio de envio | `IMPLEMENTED BUT OPERATIONAL CONFIGURATION PENDING` |
| E-mail real do piloto (`PILOT_ALLOWED_EMAILS` de produção) | Pendente de configuração pelo proprietário. Allowlist local usa apenas endereços sintéticos `.test`. Nunca hardcodar a Dra. Karen. |

Não iniciar Sprint 2. Não resolver Vercel, Resend ou pooled URL nesta aceitação.

## Aceitação formal

A Sprint 1 está tecnicamente aceita porque foram validados:

- Next.js 16
- TypeScript
- Prisma
- PostgreSQL real em Development
- migration versionada `20260910200000_auth_foundation`
- Better Auth (e-mail + senha)
- cadastro piloto com allowlist server-side
- sessão
- login / logout
- verificação de e-mail
- reset de senha
- alteração de credenciais (nome, senha, sessões)
- proteção server-side de `/app`
- testes in-memory
- testes PostgreSQL reais
- lint / typecheck / build

### Pendências operacionais (bloqueiam o piloto, não o merge técnico)

- pooled PostgreSQL para runtime Vercel
- autenticação/configuração da Vercel
- Preview Vercel
- Resend real
- domínio/remetente
- e-mail real do piloto
- smoke test de Preview

A captura local de e-mail está restrita a desenvolvimento (`NODE_ENV !== production`, sem `VERCEL_ENV`, `DATABASE_ENV=development` e arquivo explícito). Classificação: `LOCAL EMAIL CAPTURE: SAFE FOR MERGE`.
