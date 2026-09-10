# Sprint 1 — Fundação e autenticação

**Status:** implementada; **ainda não aceita tecnicamente**. Hardening & Integration Gate em andamento.  
**Descoberta clínica (Sprint 0):** continua **em paralelo** e **não está encerrada**.

A Sprint 1 está autorizada porque o escopo é **independente** das regras clínicas ainda pendentes. O encerramento da Sprint 0 clínica continua necessário antes de um vertical slice clínico.

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
| Pooler serverless (`pooled.db.prisma.io`) | Não identificado neste ambiente. Runtime usa `DATABASE_URL` (TCP direto `db.prisma.io`). Reavaliar se a Vercel fornecer URL pooled. |
| Migration `auth_foundation` no banco remoto | SQL versionado no repositório. **Não aplicada** automaticamente: o banco existente não está rotulado Dev/Preview/Production. `IMPLEMENTED BUT OPERATIONAL CONFIGURATION PENDING` até `prisma migrate deploy` em ambiente identificado. |

`PILOT_REGISTRATION_ENABLED=false` em Production abriria o cadastro. Manter `true` no piloto.

## Como rodar localmente

1. Copiar `.env.example` para `.env` (já gitignored).
2. Preencher `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
3. Preencher `PILOT_ALLOWED_EMAILS` com o e-mail autorizado do piloto.
4. `npm install` (gera o client Prisma).
5. `npx prisma migrate deploy` somente se `DATABASE_ENV` (ou `VERCEL_ENV`) for `development`, `preview` ou `test`.
6. `npm run dev`

Scripts: `npm run lint` (ESLint CLI), `npm run typecheck`, `npm test`, `npm run test:integration`, `npm run build`.

Sem Resend configurado, o envio transacional não completa em produção. Em desenvolvimento, o sender é no-op se a chave/from estiverem vazios (`IMPLEMENTED BUT OPERATIONAL CONFIGURATION PENDING`).

## Hardening & Integration Gate

Esta seção registra o gate técnico **antes do merge**. A Sprint 1 não está aceita só porque o código existe. A Sprint 0 clínica permanece aberta e fora deste gate.

| Item | Estado | Notas |
|---|---|---|
| Next.js 16.3.4 | `PASSED` | Upgrade de 15.5.9. React 19.1 mantido. |
| `src/proxy.ts` | `PASSED` | Redirect otimista por cookie. Autorização real em `requireSession()`. |
| ESLint CLI | `PASSED` | `npm run lint` → `eslint .`. `next lint` removido. |
| typecheck / build | `PASSED` | `tsc --noEmit` e `next build` (Turbopack). |
| Testes in-memory | `PASSED` | 30 testes passando (Vitest). |
| Integração Better Auth + Prisma + PostgreSQL | `BLOCKED` | Suíte escrita; 2 testes skip. Sem `DATABASE_ENV`/`VERCEL_ENV` seguro. |
| Runtime vs migration URL | `PASSED` com pendência operacional | Runtime: `DATABASE_URL`. CLI: `DIRECT_URL` \|\| `POSTGRES_URL` \|\| `DATABASE_URL`. As três URLs atuais são TCP direto `db.prisma.io`, **sem** pooler. URL pooled: `PENDING OPERATIONAL CONFIGURATION`. |
| Migration `auth_foundation` | `BLOCKED — DATABASE ENVIRONMENT NOT IDENTIFIED` | Não aplicada. Sem rótulo development/preview. Production não autorizada. |
| Browser / HTTP real | `BLOCKED` para fluxos autenticados | Página estática `/esqueci-senha` e `/redefinir-senha` (token ausente) renderizaram. Proxy redirecionou `/app` sem cookie para `/entrar?next=/app`. Páginas dinâmicas (`/entrar`, `/cadastro`) falharam: `BETTER_AUTH_SECRET` ausente. Cadastro/login/sessão/reset reais dependem também da migration em ambiente identificado. |
| Resend | `IMPLEMENTED BUT OPERATIONAL CONFIGURATION PENDING` | `RESEND_API_KEY` e `EMAIL_FROM` ausentes. Sem domínio inventado. Mock nos testes. |
| Preview Vercel | `PREVIEW DEPLOYMENT BLOCKED` | CLI deslogada (`vercel whoami` → Logged out). Sem Production. Sem merge. |
| Secrets no Git | `PASSED` | `.env` ignorado; `.env.example` só nomes/valores vazios. Sem `NEXT_PUBLIC_` em secrets. |
| Allowlist fail-safe | `PASSED` (unitário) | Confirmado in-memory; persistência real bloqueada pelo banco. |

Não iniciar Sprint 2. Não fazer merge em `main` neste gate.
