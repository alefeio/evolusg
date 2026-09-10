# ADR-006 — Motor textual

- **Status:** PROPOSED
- **Maturidade (auditoria):** parcialmente prematuro
- **Decidir até:** após existirem frases do recorte no catálogo; modelo mínimo antes de overrides persistentes

## A. Problema

Gerar texto de laudo de forma determinística (sem LLM), revisável pela profissional, a partir de dados e templates — de modo que testes possam detectar mudança silenciosa.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Laudo básico sem IA generativa | `KNOWN` |
| Mesmos dados + mesma versão + mesmo catálogo → mesmo texto gerado | `PROPOSED` (meta de testabilidade) |
| Fragmentos com id e `phraseKey` | `PROPOSED` (acoplado ao ADR-007) |
| Omitir fragmento se o dado falta, salvo regra de “não avaliado” | **mistura:** omissão é `PROPOSED`; “não avaliado” é `PENDING CLINICAL DISCOVERY` — não há regra validada |
| `GeneratedNarrative` vs `ReviewedNarrative` | `PROPOSED` |
| Edição pontual ≠ override pessoal automático | `PROPOSED` / `PENDING PRODUCT DECISION` |
| Composição na ordem do protocolo | `PROPOSED` |

O exemplo de `phraseKey` do tipo `obstetrics.fetus.presentation` é **ilustrativo**. Não é campo clínico validado.

## C. Prematuridade

**Parcialmente prematuro.** Determinismo e revisão humana são adequados. Fragmentos, phraseKey e política de omissão antecipam um catálogo ainda vazio.

## Invalidation Triggers

- Fraseologia real inseparável de um bloco único (sem fragmentos).
- Descoberta de que ela sempre reescreve o laudo inteiro — o motor ainda pode gerar rascunho, mas a composição fina perde valor.
- Regra validada de “não avaliado” / “não visualizado” incompatível com omissão simples.
- Dois geradores (UI e servidor) divergindo — recusar na implementação futura; hoje só risco.

## Decisão proposta (restrita)

Motor determinístico + revisão humana. Não aceitar política de omissão nem amarração a `phraseKey` como definitivas. Overrides persistentes continuam depois do MVP 1 (`PENDING PRODUCT DECISION` no recorte).
