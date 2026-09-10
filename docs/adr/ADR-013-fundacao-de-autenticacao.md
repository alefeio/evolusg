# ADR-013 — Fundação de autenticação

- **Status:** ACCEPTED
- **Aceite:** autorização explícita da Sprint 1 (fundação técnica independente da clínica)
- **Escopo deste aceite:** somente as decisões listadas abaixo. ADRs clínicos (001–012) **permanecem `PROPOSED`**.

## Contexto

O evolUSG precisa de identidade web (`User` = acesso, não perfil médico) para o piloto da Dra. Karen, com cadastro controlado, sessão e e-mail transacional. Não há ainda regras clínicas validadas nem billing.

## Decisão

1. **Better Auth** com **e-mail + senha** no piloto.
2. Persistência via **Prisma + PostgreSQL** (adapter oficial).
3. E-mail transacional via **Resend**, atrás de uma abstração pequena (verificação, reset, troca de e-mail). Sem sistema de campanhas.
4. **Cadastro restrito por allowlist** de ambiente (`PILOT_REGISTRATION_ENABLED` + `PILOT_ALLOWED_EMAILS`). Checagem **server-side** antes de persistir o usuário. Fail-safe: allowlist vazia com piloto ligado **bloqueia** cadastros. Allowlist não impede login de contas já existentes.
5. Métodos mais fortes (OAuth, magic link, passkeys, 2FA) **poderão** ser adicionados depois; não nesta sprint.
6. Sem `role`/admin, sem `ProfessionalProfile`, sem billing no `User`.
7. Exclusão de conta **não** entra (`PENDING PRODUCT/LEGAL/ARCHITECTURAL DECISION`).

## Consequências

+ Identidade alinhada ao Better Auth (User / Session / Account / Verification).  
+ Piloto fechado sem painel admin.  
− Dependência operacional do Resend e de `BETTER_AUTH_URL` / secret.  
− Troca futura de provedor de auth exige migração de sessões/hashes.

## Alternativas consideradas

| Alternativa | Por que não agora |
|---|---|
| Auth.js / NextAuth | Prompt da Sprint 1 autorizou Better Auth |
| Clerk / Auth0 | Vendor lock-in e custo; piloto único |
| Auth caseira | Proibido (hash, cookies, tokens) |

## Riscos

- Configuração de e-mail/domínio incompleta (`IMPLEMENTED BUT OPERATIONAL CONFIGURATION PENDING`).
- Connection pooling serverless se só existir host direto `db.prisma.io`.
- Runtime (`DATABASE_URL`) e migrations (`DIRECT_URL` / `POSTGRES_URL`) devem ser separáveis; migrate só com `DATABASE_ENV`/`VERCEL_ENV` development|preview|test.
- Redirect em `src/proxy.ts` é otimista; autorização continua em `requireSession()`.
- Mensagens de erro não devem revelar existência de conta.

## Invalidation / substituição futura

- Requisito de IdP corporativo ou passkeys no piloto.
- Incompatibilidade persistente Better Auth × Prisma/Next nas versões adotadas.
- Decisão de produto por provedor gerenciado.
