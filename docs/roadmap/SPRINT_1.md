# Sprint 1 — Fundação e autenticação

**Status:** `ACCEPTED WITH OPERATIONAL PENDENCIES` · `SPRINT 1 = COMPLETED FOR PILOT` · `PILOT IDENTITY/ACCESS GATE = PASSED`  
**Descoberta clínica (Sprint 0):** continua **em paralelo** e **não está encerrada**.

A Sprint 1 foi **aceita tecnicamente** e, após o QA funcional humano, está **fechada para o piloto**: fundação, autenticação, UI, e-mail transacional e QA manual foram validados. A Sprint 2 **não** foi iniciada.

> As pendências operacionais originais foram resolvidas ou reclassificadas como hardening. Pendências de hardening **não** reabrem a Sprint 1.

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

## Pilot Operational Readiness

**Status operacional:** `QA FUNCTIONAL APPROVED` (ambiente liberado em `QA FUNCTIONAL READY`; QA manual concluído pelo proprietário)

A Sprint 1 permanece tecnicamente `ACCEPTED WITH OPERATIONAL PENDENCIES` e está `COMPLETED FOR PILOT`. A Sprint 2 **não** foi iniciada. Nenhum domínio clínico / billing / admin / referral / APIMG foi implementado. Dra. Karen: `PILOT USER READY — FICTIONAL DATA ONLY`.

### Temporary Shared Database Strategy

Decisão consciente do proprietário para a fase de desenvolvimento e piloto fictício:

- Preview e o deploy Production existente **compartilham temporariamente** o banco atual (o único recurso Prisma Postgres vinculado ao projeto).
- Vale **somente** enquanto: não houver pacientes reais, exames reais, laudos reais nem operação comercial; todo teste clínico é fictício.
- A ausência de banco Preview dedicado **não** é mais blocker para o QA funcional nem para o piloto inicial com dados fictícios.
- Proibido nesta fase: dados de pacientes reais, exames reais, laudos reais, dados clínicos identificáveis de terceiros.
- Proibido operacionalmente: `reset`, `drop`, `truncate`, limpeza global, `db push` destrutivo. Usuários de QA/piloto podem existir no banco.
- Esta decisão é interna e **não** aparece na interface do usuário.

### FUTURE GATE

`PRODUCTION DATABASE ISOLATION — REQUIRED BEFORE REAL CLINICAL USE`

Antes de qualquer uso clínico real ou lançamento comercial, Production deve ser separado do banco de testes (banco próprio, conexões pooled/direct próprias, `DATABASE_ENV` distinto). **Não** implementado agora, por decisão de fase.

### Sincronização com main (produto + Brand/UI)

- Branch: `pilot/identity-preview`
- Merge recente: `658fa50` — `merge: sync pilot preview with latest main product copy` (inclui microcopy de produto PR #4 e remoção do rótulo redundante sob a logo PR #5 / `6fd04cf` em `main`)
- Gates pós-sync: lint ✅ · typecheck ✅ · unit **41** · integration **2** · build ✅
- Preview Git Ready no alias estável da branch piloto (deployments individuais são efêmeros e não são registrados aqui)

### Fato de deploy Production

- Merge em `main` dispara deploy Git automático de **Production**. Isto é um fato do projeto; **nenhum** modelo de branch/deploy foi alterado nesta rodada.
- Este agente **não** executou `vercel --prod`, **não** promoveu Preview e **não** alterou env/migrate/usuários de Production.
- A branch `pilot/identity-preview` **não** foi mergeada em `main`.

### Host Preview estável do piloto

- Alias Git Preview: `https://evolusg-git-pilot-identity-preview-alefeios-projects.vercel.app`
- Production / domínio customizado **não** deve ser usado para QA do piloto.

### Deployment Protection

- Proprietário confirmou Exception no host piloto.
- Revalidação anônima: host piloto **HTTP 200** (app do evolUSG; sem login Vercel). Preview efêmero comum: **HTTP 302 → SSO Vercel**.
- Classificação: `PILOT PREVIEW PUBLIC EXCEPTION = PASSED`
- Deployment Protection global e Production **não** foram alterados nesta rodada.

### Runtime PostgreSQL

- Runtime: `RUNTIME_DATABASE_URL ?? DATABASE_URL` (código em `main` / piloto sincronizado).
- `RUNTIME_DATABASE_URL` listada no projeto (secret Preview+Production). Classificação herdada de host pooled: `PREVIEW RUNTIME POOLED = PASSED` (reconfirmação de fingerprint bloqueada — pull de secrets não autorizado nesta sessão).
- Migrations: `DIRECT_URL || POSTGRES_URL || DATABASE_URL` — `RUNTIME_DATABASE_URL` não participa.
- Captura local: `AUTH_EMAIL_CAPTURE_FILE` **ausente** no Preview (cwd limpo). `LOCAL EMAIL CAPTURE = DISABLED`.
- Preferir env **branch-scoped** (`pilot/identity-preview`) para valores exclusivos do piloto — **nunca** sobrescrever Production.

### Inventário do banco (auditoria por metadados)

- Recursos Prisma Postgres ligados ao projeto: **1** (status `available`). Os demais recursos da conta pertencem a outros projetos.
- `vercel env ls --json`: `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL`, `RUNTIME_DATABASE_URL` e `DATABASE_ENV` são **registros únicos** com alvo `preview + production` → mesmo valor, mesmo banco. Nenhuma variável de banco é branch-scoped.
- Ambiente Development na Vercel: sem variáveis. Desenvolvimento local usa `.env` com `DATABASE_ENV=development`.
- Connection strings são do tipo `sensitive`; a CLI não as expõe e nenhum valor foi lido/registrado.
- Classificação aceita nesta fase: `SHARED DATABASE — TEMPORARILY ACCEPTED BY OWNER`.
- Região/data de criação do recurso: não expostas pela CLI (verificar no Prisma Console se necessário).

### Estrutura do banco (sem migrar)

- `prisma migrate status`: **1 migration** encontrada, `Database schema is up to date!` — nada pendente.
- Migration da Sprint 1/auth: `20260910200000_auth_foundation` (`user`, `session`, `account`, `verification` + índices e FKs).
- **Nenhuma** migration foi executada nesta tarefa. Sem `db push`, reset, drop ou truncate.

### Better Auth / Resend

- Branch-scoped `BETTER_AUTH_URL` para `pilot/identity-preview` = host do alias Git piloto (`*.vercel.app` do piloto; não localhost; não Production/`evolusg.com.br`).
- `trustedOrigins`: `[baseURL]` — sem wildcard amplo.
- `/app` anônimo no Preview: **307 → `/entrar?next=%2Fapp`** (proteção de rota operante).
- Cadastro fora da allowlist no Preview: **HTTP 403 `REGISTRATION_NOT_ALLOWED`** com endereço sintético `.test` (sem envio a terceiros).
- `RESEND_API_KEY` / `EMAIL_FROM` presentes (listagem Vercel).
- Incidente corrigido: `EMAIL_FROM` apontava para o domínio raiz, **não verificado** no Resend, e todo envio falhava com `403 validation_error` → `EMAIL_SEND_FAILED`. O domínio verificado é o subdomínio de envio; `EMAIL_FROM` foi atualizado para um remetente nesse subdomínio, no registro compartilhado (Preview + Production, registro único preservado) e no `.env` local. Envio de teste pela API do Resend: **HTTP 200 aceito**.
- `resend-sender.ts` agora propaga nome e mensagem do erro do Resend (commit `ae0c2d1`), em vez de mascarar como código genérico.
- Preview do piloto redeployado para carregar o novo remetente; alias Git migrado para o deployment novo. Production **não** foi redeployada nem promovida.
- Delivery real ponta a ponta (verificação/reset pela aplicação): **pendente da validação do QA**.
- Captura local de e-mail: `AUTH_EMAIL_CAPTURE_FILE` **ausente** no Preview → `LOCAL EMAIL CAPTURE = DISABLED`.
- `PILOT_REGISTRATION_ENABLED=true`, `DATABASE_ENV=preview`, `VERCEL_ENV=preview` no Preview do piloto.
- Allowlist do piloto: 2 caixas reais no mesmo domínio; a caixa de QA do proprietário **está presente** (verificação por hash; endereço não registrado aqui).

### QA funcional

| Item | Estado |
|---|---|
| Host piloto público (HTTP 200, sem SSO) | `PASSED` |
| Branch sincronizada com main (copy/UI final) | `PASSED` |
| Banco operacional + estrutura auth aplicada | `PASSED` |
| Topologia compartilhada | `TEMPORARILY ACCEPTED` |
| Better Auth (proteção de rota + allowlist server-side) | `PASSED` |
| Resend configurado | `PASSED` (delivery confirmado no QA humano) |
| Allowlist contém a caixa de QA | `PASSED` |
| Cadastro/verify/login/reset pelo QA | `PASSED` (execução manual do proprietário) |

**Classificação:** `QA FUNCTIONAL READY` → `QA FUNCTIONAL APPROVED`

- O agente **não** executou cadastro, verificação, login, logout ou reset em nome do QA.
- Dra. Karen: liberada como `PILOT USER READY — FICTIONAL DATA ONLY` após a aprovação do QA humano (ver seção "Human Functional QA").
- Todo QA ocorre no host Preview piloto. O domínio Production **não** é usado para testes; sem redeploy, promote ou alteração de env de Production nesta tarefa.

## Functional QA Closure — auditoria técnica

Auditoria somente de leitura, sem tocar a conta de QA (nenhuma senha, token, sessão, verificação manual ou exclusão de usuário).

### Timezone

**Classificação:** `TIMEZONE ISSUE = DISPLAY ONLY`

Evidências:

- Todas as colunas de data do schema são `timestamp without time zone` — padrão do Prisma para `DateTime` em PostgreSQL (`user`, `session`, `account`, `verification`; inclui `expiresAt`).
- Round-trip medido no driver `pg` a partir de um processo em UTC−3: enviar um `Date`, gravar como `timestamp(3)` e ler de volta devolve **exatamente o mesmo instante** (delta `0 h`). Escrita e leitura usam o mesmo fuso do processo, então a comparação em JavaScript permanece correta.
- O registro criado pelo Preview corresponde ao horário UTC do log do Better Auth do mesmo instante (`03:57:51Z` no log ↔ `03:57:51` no banco), provando que o runtime da Vercel grava em UTC.
- A diferença de 3 h observada apareceu somente quando o mesmo registro foi lido por um script local em UTC−3: o texto gravado em UTC é reinterpretado como horário local, deslocando a leitura.

Conclusão em linguagem simples: o banco guarda a hora "sem fuso"; quem escreve e quem lê no mesmo ambiente concorda. O Preview e a Production rodam em UTC, então expiração de token e de sessão é comparada corretamente. Os 3 h eram artefato da leitura feita no computador local.

Consequências registradas (nenhuma bloqueia o piloto):

- `DISPLAY TIMEZONE NORMALIZATION — FUTURE UI CONCERN`: `SessionsPanel` formata `createdAt` com `toLocaleString("pt-BR")`. O primeiro render acontece no servidor (UTC) e o render do cliente usa o fuso do navegador, então a data de sessão pode aparecer em UTC até a hidratação.
- `TIMESTAMPTZ MIGRATION — HARDENING BACKLOG`: como o banco é compartilhado, um processo local em UTC−3 e o runtime da Vercel em UTC interpretam o mesmo texto de forma diferente. Enquanto o QA e o piloto rodarem apenas no host Preview, não há impacto; misturar dev local e Preview sobre os mesmos tokens produziria janelas de expiração deslocadas em 3 h. Migrar as colunas para `timestamptz` resolve na raiz e fica para depois da Sprint 1.

### URLs dos e-mails

- `BETTER_AUTH_URL` **branch-scoped** para `pilot/identity-preview` = `https://evolusg-git-pilot-identity-preview-alefeios-projects.vercel.app` (confirmado por leitura do override da branch). Não é localhost, não é `evolusg.com.br`.
- Verificação: URL montada pelo Better Auth a partir do `baseURL` → host piloto, com `callbackURL=/verificar-email`.
- Reset: `${baseURL}/redefinir-senha?token=…` em `createAuthOptions` → host piloto.
- Observação de higiene, sem efeito no piloto: o registro **Preview + Production** de `BETTER_AUTH_URL` aponta para `evolusg.com.br`. O override da branch tem precedência no host piloto, mas qualquer outra branch de Preview geraria links para o domínio de Production. Backlog: `PREVIEW-WIDE BASE URL — HYGIENE BACKLOG`.
- Nenhum token foi gerado, lido ou revelado nesta auditoria; a conferência final do link é do QA humano.

### Reenvio de verificação

- `/verificar-email` expõe `ResendVerificationButton`, que chama `authClient.sendVerificationEmail({ email, callbackURL: "/verificar-email" })`.
- `emailVerification.sendOnSignIn = true`: tentar entrar com a conta ainda não verificada também dispara novo e-mail, com a mensagem "Confirme seu e-mail para entrar…".
- Um usuário com `emailVerified=false` consegue solicitar novo e-mail sem nenhum bypass. Nada foi marcado como verificado pelo agente.

### Comportamento de tokens (better-auth 1.7.4)

Coberto por testes automatizados em `src/lib/auth/auth-flows.test.ts` (43 unit no total):

- Verificação: token consumido no primeiro uso — o registro sai da tabela `verification` e o reuso **não** re-verifica nem cria sessão (`autoSignInAfterVerification=false`, zero sessões após reuso). O reuso responde de forma idempotente em vez de erro; sem efeito colateral de segurança.
- Reset: token de uso único — a segunda tentativa com o mesmo token é rejeitada e a senha definida no primeiro uso continua válida.
- Expiração: 1 h para verificação e 1 h para reset (defaults da biblioteca; o código só sobrescreve nos testes). Token expirado e token inválido são rejeitados, com mensagens "Este link expirou. Solicite um novo." e "Este link é inválido. Solicite um novo.".

### Sessões

- `/app` e `/app/*` passam pelo proxy: sem cookie de sessão → `307` para `/entrar?next=…`.
- Páginas internas usam `requireSession()`; logout via `authClient.signOut()` invalida a sessão (teste: `getSession` volta `null` com os mesmos cookies).
- Reset de senha: `revokeSessionsOnPasswordReset: true` — sessões antigas caem, senha antiga é rejeitada, nova senha é aceita.
- Troca de senha autenticada com `revokeOtherSessions: true` encerra os outros dispositivos e mantém o atual.

### Enumeração de contas

- "Esqueci minha senha" responde sempre "Se o e-mail estiver cadastrado, enviaremos instruções…", independentemente de existir conta.
- Reenvio de verificação responde "Se o cadastro for possível, enviaremos um e-mail com as próximas instruções.".
- Login falho é mapeado para "E-mail ou senha inválidos.", sem distinguir usuário inexistente de senha errada.
- Único sinal intencional: e-mail fora da allowlist recebe "Este e-mail não está autorizado para cadastro neste momento." — inevitável e desejável num piloto por convite.

### Submit / proteção contra reenvio

- `Button` aplica `disabled` e `aria-busy` enquanto `pending`, com rótulo de progresso ("Entrando…", "Enviando…", "Reenviando…", "Salvando…"). Todos os formulários de auth usam esse estado, o que impede duplo clique pela UI.
- Erros do Resend chegam ao usuário como "Não foi possível enviar o e-mail neste momento. Tente novamente mais tarde." ou mensagem genérica; `mapAuthError` nunca exibe stack ou erro interno.
- Rate limiting server-side: ativo no Preview (`rateLimit.enabled` segue `NODE_ENV === "production"`), com as regras padrão da biblioteca — 3 requisições/10 s em `/sign-in`, `/sign-up`, `/change-password`, `/change-email` e 3/60 s em `/request-password-reset` e `/send-verification-email`.
- `AUTH RATE LIMITING — HARDENING BACKLOG`: o armazenamento padrão é em memória, por instância serverless, então a contagem não é compartilhada entre invocações. Não é blocker para um piloto restrito por allowlist; endurecer com armazenamento persistente fica para depois.

### EMAIL_FROM

- Registro **compartilhado Preview + Production** já corrigido para um remetente no subdomínio verificado do Resend, confirmado na leitura do escopo do Preview.
- O Preview do piloto já foi redeployado e usa o novo remetente.
- Production **não** foi redeployada nesta tarefa: o deployment atual continua com o remetente antigo até o próximo deploy, que herdará automaticamente o valor corrigido. Comportamento conhecido e esperado, não surpresa futura.

### Status

| Item | Estado |
|---|---|
| Timezone | `DISPLAY ONLY` |
| Verification URL | host piloto |
| Reset URL | host piloto |
| Token verificação/reset | consumido no uso, expiração 1 h |
| Sessões (logout, rota protegida, reset) | comportamento verificado |
| Enumeração | mensagens neutras |
| Submit/spam | UI protegida + rate limit default da lib |
| QA | `QA FUNCTIONAL APPROVED` |
| Dra. Karen | `PILOT USER READY — FICTIONAL DATA ONLY` |

Blockers de piloto identificados nesta auditoria: **nenhum**. O gate de banco segue `TEMPORARY SHARED DATABASE ACCEPTED FOR FICTIONAL PILOT`, com `PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE` como pendência futura.

## Human Functional QA

**Status:** `QA FUNCTIONAL APPROVED`

Validado manualmente pelo proprietário/QA no host Preview do piloto, sem participação do agente na execução dos fluxos:

| Fluxo | Resultado |
|---|---|
| Cadastro | `PASSED` |
| Reenvio de e-mail de verificação | `PASSED` |
| Confirmação de e-mail | `PASSED` |
| Login | `PASSED` |
| Recuperação de senha | `PASSED` |
| Alteração de dados em `/app/conta` | `PASSED` |

Nenhum blocker funcional foi identificado. Nenhum e-mail, senha, token ou link privado foi registrado nesta documentação.

Ambiente do QA e do fechamento: alias estável do Preview da branch piloto — home `200`, `/cadastro` `200`, `/app` anônimo `307 → /entrar?next=%2Fapp`, sem SSO da Vercel, copy e Brand/UI finais.

## Piloto de identidade/acesso — Dra. Karen

**Status:** `PILOT USER READY` · condição `FICTIONAL DATA ONLY`

Fluxo que a piloto executa pessoalmente, no host Preview do piloto:

1. abrir o Preview piloto;
2. clicar em "Criar conta";
3. informar nome e e-mail;
4. escolher a própria senha;
5. receber o e-mail de confirmação;
6. confirmar o e-mail;
7. fazer login;
8. acessar `/app`;
9. testar "Conta" e logout.

Regras desta etapa:

- **Somente dados fictícios.** Proibido cadastrar pacientes reais, exames reais, laudos reais ou dados clínicos identificáveis de terceiros.
- Nenhum dado clínico é solicitado nesta etapa — o escopo é identidade e acesso.
- O agente **não** cria conta, senha, token ou sessão em nome dela.
- Cadastro depende da presença do endereço dela em `PILOT_ALLOWED_EMAILS` (allowlist com 2 posições no escopo da branch piloto; uma é a caixa de QA do proprietário, comprovada por hash). A confirmação de que a segunda posição é a caixa da Dra. Karen é do proprietário; se não estiver, o cadastro é recusado com mensagem clara e basta adicioná-la.

## Hardening backlog (não bloqueia o piloto)

- `AUTH RATE LIMITING — HARDENING BACKLOG`
- `DISPLAY TIMEZONE NORMALIZATION — FUTURE UI CONCERN`
- `TIMESTAMPTZ MIGRATION — HARDENING BACKLOG`
- `PREVIEW-WIDE BASE URL — HYGIENE BACKLOG`
- Favicon oficial: `PENDING BRAND ASSET`
- `PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE` (future gate)

Nenhum destes itens reabre a Sprint 1.

## Próximo bloco de trabalho

`Clinical Discovery v0.1 Reconciliation — NOT STARTED`

Reconciliação documental do handoff clínico da conversa de descoberta, em branch documental própria a partir de `main`, somente após autorização explícita. A Sprint 2 permanece **não autorizada**.
