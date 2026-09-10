# ADRs — evolUSG

ADRs 001–012 permanecem **PROPOSED**.  
**ADR-013** (autenticação da Sprint 1) está **ACCEPTED** apenas no escopo autorizado dessa sprint. Não promover ADRs clínicos.

Não transformar hipótese em decisão. Auditoria da Sprint 0: ver classificação `KNOWN` / `PROPOSED` / pendências **dentro de cada ADR**.

## Índice atual

| ID | Título | Status | Maturidade (auditoria) |
|---|---|---|---|
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura geral | PROPOSED | Adequado ao estágio (direção) |
| [ADR-002](ADR-002-representacao-de-protocolos.md) | Representação de protocolos | PROPOSED | Parcialmente prematuro |
| [ADR-003](ADR-003-versionamento-de-protocolos.md) | Versionamento de protocolos | PROPOSED | Parcialmente prematuro |
| [ADR-004](ADR-004-motor-de-regras.md) | Motor de regras | PROPOSED | Prematuro no detalhe |
| [ADR-005](ADR-005-representacao-dos-dados-clinicos.md) | Representação dos dados clínicos | PROPOSED | Parcialmente prematuro |
| [ADR-006](ADR-006-motor-textual.md) | Motor textual | PROPOSED | Parcialmente prematuro |
| [ADR-007](ADR-007-fraseologia-personalizada.md) | Fraseologia personalizada | PROPOSED | Prematuro no comportamento de upgrade |
| [ADR-008](ADR-008-user-vs-professional-profile.md) | User vs ProfessionalProfile | PROPOSED | Adequado ao estágio |
| [ADR-009](ADR-009-exam-report-reportversion.md) | Exam vs Report vs ReportVersion | PROPOSED | Parcialmente prematuro |
| [ADR-010](ADR-010-multi-tenant-futuro.md) | Multi-tenant futuro | PROPOSED | Prematuro na decisão física |
| [ADR-011](ADR-011-residencia-e-transferencia-de-dados.md) | Residência e transferência internacional | PROPOSED | Adequado ao estágio |
| [ADR-012](ADR-012-estados-do-laudo.md) | Estados do laudo | PROPOSED | Máquina candidata; não definitiva |
| [ADR-013](ADR-013-fundacao-de-autenticacao.md) | Fundação de autenticação | **ACCEPTED** | Somente decisões da Sprint 1 (Better Auth, e-mail+senha, Resend, allowlist) |

## Classificação usada nos ADRs

| Marca | Significado |
|---|---|
| `KNOWN` | Fato ou restrição já explícita no projeto (não é detalhe de desenho) |
| `PROPOSED` | Hipótese arquitetural ou de produto; não aceita |
| `PENDING CLINICAL DISCOVERY` | Depende da médica responsável |
| `PENDING PRODUCT DECISION` | Depende de escolha de produto, não de clínica |
| `PENDING TECHNICAL VALIDATION` | Depende de spike ou prova técnica |

## Backlog (não abrir agora)

- PDF (gerador)
- DOCX (gerador)
- armazenamento de documentos (object storage / região)
- autenticação detalhada (provedor MFA)
- modelo fino de auditoria
- política de findings ocultos (persistir vs apagar)
