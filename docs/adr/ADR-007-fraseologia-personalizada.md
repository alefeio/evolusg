# ADR-007 — Fraseologia personalizada

- **Status:** PROPOSED
- **Maturidade (auditoria):** prematuro no comportamento de upgrade; adequado como problema a resolver
- **Decidir até:** modelo mínimo pode esperar o motor textual; overrides persistentes são posteriores ao MVP 1. Comportamento de incompatibilidade: `PENDING PRODUCT DECISION` e, se afetar o texto que a médica considera “seu”, `PENDING CLINICAL DISCOVERY` / validação com ela.

## A. Problema

Permitir que o mesmo dado clínico gere frases diferentes por profissional, **sem** alterar o significado estruturado, e **sem** que um laudo já emitido mude. Quando o protocolo evolui, a preferência pessoal pode deixar de ser aplicável com segurança.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Dado permanece; texto pode variar | `KNOWN` (princípio) |
| Override não reescreve documento já emitido | `KNOWN` (junto ao ADR-003/009) |
| Identidade `phraseKey` + contrato de placeholders + `textRuleId` | `PROPOSED` |
| Exemplo `obstetrics.fetus.presentation` | ilustrativo; **não** é descoberta clínica |
| Uma phraseKey = no máximo uma TextRule ativa por ProtocolVersion | `PROPOSED` |
| Edição pontual no laudo ≠ override | `PROPOSED` |
| MVP 1 sem override persistente | `PROPOSED` / `PENDING PRODUCT DECISION` |
| Comportamento se o contrato ficar incompatível (A, B ou C abaixo) | **`PENDING PRODUCT DECISION`** (e validação com a profissional se houver overrides reais) |
| Quais frases são pessoais | `PENDING CLINICAL DISCOVERY` |

A estratégia `phraseKey + placeholder contract + textRuleId` **permanece proposta** e **desacoplada** de qualquer regra clínica ainda não validada. Não é obrigatoriamente a melhor; é a candidata a avaliar quando houver frases reais.

## C. Prematuridade

**Prematuro** fechar o upgrade. **Adequado** registrar o problema. A versão anterior deste ADR apresentava fallback para o padrão como “a mais segura”, o que misturava hipótese com decisão e podia **alterar em silêncio o texto que a profissional espera ver**.

## Invalidation Triggers

- Descoberta de que ela não usa frases pessoais persistentes (só edição no laudo) — simplifica ou elimina override.
- Placeholders reais impossíveis de versionar como contrato.
- Fluxo em que qualquer mudança de protocolo deve manter o texto personalizado a qualquer custo (puxa para estratégia C).
- Evidência de que phraseKey genérica colapsa conceitos distintos.
- Superdimensionamento: um único template por seção basta no MVP.

## Comportamento de incompatibilidade — alternativas em aberto

Nenhuma das três está aceita. “Alteração silenciosa do conteúdo clínico” aqui significa: o **texto** que a profissional considera seu (ou o padrão que ela não revisou) muda sem ato explícito dela. O **dado estruturado** não deve mudar em nenhum dos três.

### Estratégia A — Fallback automático para frase padrão

Override `INCOMPATIBLE` deixa de ser aplicado; o laudo **novo** (não o emitido) usa a frase padrão evolUSG até revisão.

| | |
|---|---|
| Vantagens | Sempre há texto; publicação de protocolo não trava; emitidos intactos |
| Riscos | Ela pode não perceber que o jeito dela sumiu |
| Segurança | Dado estruturado intacto; **texto clínico apresentado** pode mudar sem confirmação |
| UX | Menos atrito; mais surpresa |
| Versionamento | Protocolo sobe livremente; override fica pendente |
| Alteração silenciosa de conteúdo textual | **Sim, nos laudos ainda não emitidos** — é o risco principal desta estratégia |

### Estratégia B — Marcar incompatível e exigir revisão antes do uso

Enquanto o override daquela `phraseKey` não for revisado, o fluxo de elaboração **bloqueia** aquele fragmento (ou o exame) até ela escolher: nova frase, aceitar padrão, ou descartar override.

| | |
|---|---|
| Vantagens | Nenhuma frase “falsa” no lugar da dela sem ato |
| Riscos | Trava atendimento se a atualização cair em dia de agenda cheia |
| Segurança | Evita texto gerado sob identidade dela sem revisão; risco operacional (não emitir) |
| UX | Fricção alta, previsível |
| Versionamento | Publicar V2 pode exigir janela de revisão |
| Alteração silenciosa de conteúdo textual | **Não**, no fragmento afetado; o risco é não produzir laudo |

### Estratégia C — Preservar o contrato/protocolo anterior até revisar o override

Quem tem override incompatível continua elaborando na **versão de protocolo (ou contrato de frase) anterior** até revisar; outros podem ir à V2.

| | |
|---|---|
| Vantagens | Continuídade do texto pessoal e do atendimento |
| Riscos | Duas versões ativas; operação e testes mais caros; divergência entre profissionais |
| Segurança | Texto conhecido permanece; aumenta superfície de erro (“qual versão estou usando?”) |
| UX | Estável para ela; confuso se não for visível |
| Versionamento | Multi-versão ativa de propósito (além do versionamento documental) |
| Alteração silenciosa de conteúdo textual | **Não** para quem ficou na versão antiga; risco de comparar laudos gerados em contratos diferentes |

**Não escolher A, B ou C nesta auditoria.**

## Decisão proposta (restrita)

Manter a candidata de identidade dupla (`phraseKey` + contrato + `textRuleId`) como `PROPOSED`. Comportamento de incompatibilidade: `PENDING PRODUCT DECISION` (estratégias A/B/C). Não implementar override na Sprint 0 nem no MVP 1 salvo decisão posterior.
