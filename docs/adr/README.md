# ADRs — evolUSG

ADRs 001–012 e 014 permanecem **PROPOSED**.  
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
| [ADR-014](ADR-014-referencias-clinicas-versionadas.md) | Referências clínicas versionadas | PROPOSED | Problema real; desenho aberto |

## Impacto da reconciliação Clinical Discovery v0.1

Classificação do efeito da primeira rodada intensiva de discovery sobre cada ADR. **Nenhum ADR foi promovido a `ACCEPTED`** por causa da discovery.

| ADR | Impacto | O que mudou |
|---|---|---|
| ADR-001 | unaffected | direção de arquitetura inalterada |
| ADR-002 | clarified | existe baseline documental de protocolo ([`v0.1`](../protocols/OBSTETRIC_DOPPLER_V0_1.md)); confirma "protocolo como dados" com conteúdo real, sem escolher formato |
| ADR-003 | clarified | frase de técnica pertence à `ProtocolVersion`; referência atualizada gera nova versão, não edição |
| ADR-004 | needs amendment | a conclusão exige priority, deduplicação, consolidação, escopo e supressão — mais que "ordem fixa de camadas"; ainda **sem** engine genérico |
| ADR-005 | needs amendment | `path` precisa suportar escopo fetal repetível; ausência de finding = não informado, nunca "ausente" |
| ADR-006 | clarified | a política de omissão deixa de ser hipótese: "não marcado ≠ ausente" é regra clínica validada; existe fragmento sem dado de entrada (técnica) |
| ADR-007 | clarified | hierarquia conceitual Protocol → Organization → Professional → Manual Edit registrada; override segue `PENDING PRODUCT DECISION` (A/B/C em aberto) |
| ADR-008 | unaffected | separação `User` / `ProfessionalProfile` confirmada |
| ADR-009 | needs amendment | "retificação não cria outro Exam" passa a `PROPOSED PRODUCT/DOCUMENT WORKFLOW DECISION` (era `PENDING CLINICAL DISCOVERY` puro) |
| ADR-010 | unaffected | multi-tenancy segue princípio, sem coluna |
| ADR-011 | unaffected | residência de dados inalterada |
| ADR-012 | unaffected | estados do laudo seguem candidatos; nada na discovery exigiu estado novo |
| ADR-013 | unaffected | autenticação não é tocada por esta reconciliação |
| ADR-014 | **new** | referências clínicas versionadas: lacuna real, nenhum ADR anterior cobria |

Candidatos avaliados e **recusados** como ADR novo, para não criar decisão sem necessidade:

| Candidato | Por que não |
|---|---|
| ADR de escopo fetal / repeating groups | cabe como emenda ao ADR-005; criar ADR próprio seria formalizar abstração antes da necessidade |
| ADR de composição da conclusão | cabe como emenda ao ADR-004/006; a estrutura mínima ainda é `PROPOSED` |
| ADR de `PregnancyEpisode` | é modelagem conceitual do domínio, já registrada em [`../architecture/DOMAIN_MODEL.md`](../architecture/DOMAIN_MODEL.md); sem decisão arquitetural conflitante a resolver |
| ADR de explicabilidade clínica | princípio, não decisão; depende de ADR-014 |

## Classificação usada nos ADRs

| Marca | Significado |
|---|---|
| `KNOWN` | Fato ou restrição já explícita no projeto (não é detalhe de desenho) |
| `PROPOSED` | Hipótese arquitetural ou de produto; não aceita |
| `PENDING CLINICAL DISCOVERY` | Depende da médica responsável |
| `PENDING PRODUCT DECISION` | Depende de escolha de produto, não de clínica |
| `PENDING TECHNICAL VALIDATION` | Depende de spike ou prova técnica |
| `SOURCE_VALIDATION_PENDING` | Conceito pode estar aprovado clinicamente, mas falta referência formal (ver [`../clinical-discovery/TRACEABILITY.md`](../clinical-discovery/TRACEABILITY.md#três-eixos-de-status-reconciliação-v01)) |

## Backlog (não abrir agora)

- PDF (gerador)
- DOCX (gerador)
- armazenamento de documentos (object storage / região)
- autenticação detalhada (provedor MFA)
- modelo fino de auditoria
- política de findings ocultos (persistir vs apagar)
