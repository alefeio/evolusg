# Rastreabilidade clínica → técnica

Este documento define **processo**. Não contém regras clínicas. Não cria implementação.

Objetivo: no futuro, seguir uma cadeia curta, sem dezenas de tipos de ID.

```text
Clinical Discovery
  → Validated Clinical Requirement
    → Technical Requirement
      → Protocol artifact (campo / regra / cálculo / texto)
        → Clinical Fixture
          → Automated test (quando existir código)
            → Protocol Version
```

## Identificadores

Poucas séries. Não criar categoria nova sem necessidade.

| Prefixo | Significa | Quando nasce |
|---|---|---|
| `CD-nnn` | Achado de descoberta (evidência; natureza em `sourceType`) | Onda 1+ |
| `CR-nnn` | Requisito clínico **validado** pela médica responsável | Só após validação explícita |
| `TR-nnn` | Requisito técnico derivado de um ou mais CR | Ao transformar CR em trabalho de produto |
| `FIELD-…` | Campo no catálogo (usa a Field Key do catálogo; não duplicar número se a key já identifica) | Catálogo de campos |
| `RULE-nnn` | Regra de visibilidade/validação no protocolo | Só com CR |
| `CALC-…` | Cálculo (Calculation Key do catálogo) | Só com fonte e aprovação |
| `TEXT-…` | Frase / TextRule (`phraseKey` se essa proposta for aceita) | Catálogo de frases |
| `FIX-…` | Fixture anonimizada | `CLINICAL_FIXTURES.md` |

`CD` pode existir sem `CR`. **`CR` sem validação da médica não existe** — não promover descoberta a requisito. Não há promoção automática.

Testes automatizados não têm série própria nesta fase. Quando existirem, o teste referencia `FIX` + artefato + `ProtocolVersion`. Não inventar `TEST-nnn` agora.

## Descoberta ≠ validação

`Clinical Discovery` (`CD`) é evidência registrada. Não é, por si, requisito clínico.

Somente após **validação clínica explícita** um `CD` pode originar um `CR`. Hipótese de engenharia permanece `CD` (ou nem isso) até essa validação. Naturezas de origem diferentes nunca são equivalentes só porque compartilham a cadeia.

```text
CD-nnn          evidência registrada (ainda não é requisito)
    → validação clínica explícita (ato, pessoa, data)
        → CR-nnn    requisito clínico validado
```

## Metadata de origem e validação

Não criar identificador de fonte (`SOURCE-…`). Registrar metadata **no próprio** `CD` e `CR`.

### Campos do `CD` (evidência)

| Campo | Função |
|---|---|
| `sourceType` | Natureza da informação (ver vocabulário abaixo) |
| `sourceReference` | Ponteiro ao material (ata, arquivo anonimizado, template, nota de reunião) — sem dado identificável |
| `discoveredAt` | Data em que a evidência foi registrada |
| `recordedBy` | Quem registrou o `CD` (engenharia/produto). **Não** é validação clínica |
| `notes` | Contexto, ambiguidades, o que ainda não foi perguntado |

### Campos do `CR` (validação)

| Campo | Função |
|---|---|
| `originCds` | Um ou mais `CD` que esta validação cobre |
| `validatedBy` | Pessoa responsável pela validação clínica (médica responsável) |
| `validatedAt` | Data da validação explícita |
| `sourceReference` | Evidência da validação (ata, confirmação), se distinta da do `CD` |
| `notes` | Escopo da validação (o que foi confirmado; o que ficou de fora) |

`validatedBy` / `validatedAt` existem **só** no `CR`. Um `CD` não se torna válido por ter `recordedBy`.

### Vocabulário de `sourceType`

Chaves estáveis. Não são novos IDs de rastreio.

| `sourceType` | Significa |
|---|---|
| `interview` | Declarado pela médica em entrevista |
| `anonymized-report` | Observado em laudo anonimizado |
| `template` | Presente em template / modelo de laudo |
| `engineering-hypothesis` | Hipótese levantada pela engenharia ou produto — **nunca** equivale a `CR` |
| `clinical-validation` | Uso no `CR`: o ato de validação explícita (além dos `CD` de origem) |

Se a origem não se encaixar, usar `notes` — não inventar prefixo novo.

## Ligações mínimas

Cada `CD` deve poder apontar: `sourceType`, `sourceReference`, `discoveredAt`, `recordedBy`, `notes`.

Cada `CR` deve poder apontar:

- `originCds`
- `validatedBy` e `validatedAt`
- `sourceReference` da validação, se houver
- `notes`
- `TR` derivados
- artefatos `FIELD` / `RULE` / `CALC` / `TEXT`
- `FIX` que exercitam o requisito
- `ProtocolVersion` em que entrou (quando houver)

Cada artefato de protocolo deve poder apontar de volta ao `CR` (e portanto à validação e, via `CD`, à origem).

Não é obrigatório preencher a cadeia inteira na Sprint 0. É obrigatório **não** implementar regra sem `CR` quando a fase de implementação começar.

## Perguntas que a cadeia deve responder

| Pergunta | Onde olhar |
|---|---|
| De que natureza é a informação (entrevista, laudo, template, hipótese)? | `CD.sourceType` |
| Qual material de evidência? | `CD.sourceReference` (e `CR.sourceReference` se a validação tiver ata própria) |
| Quando foi descoberta / registrada? | `CD.discoveredAt` |
| Quem registrou (não valida)? | `CD.recordedBy` |
| Quem validou clinicamente? | `CR.validatedBy` + `originCds` |
| Quando foi validada? | `CR.validatedAt` |
| Qual requisito técnico nasceu dela? | `CR` → `TR` |
| Quais regras/campos/cálculos/textos dependem dela? | `CR` → artefatos |
| Quais fixtures representam casos relacionados? | `CR` / artefato → `FIX` |
| Quais testes garantem o comportamento? | `FIX` → teste (futuro) |
| Em qual versão de protocolo entrou? | artefato → `ProtocolVersion` |
| O que é impactado quando ela muda? | grafo inverso: versão nova, FIX, testes, TRs dependentes |

## O que não fazer

- Inventar `CR` para “completar” o modelo.
- Pesquisar clínica externa para criar `RULE` ou `CALC`.
- Tratar `CD` como aprovado.
- Criar IDs para ADRs aqui (ADRs já têm número).
- Implementar rastreio em banco nesta fase.
- Promover `CD` a `CR` automaticamente, inclusive quando `sourceType` for `engineering-hypothesis`.

## Estado atual

Cadeia vazia de propósito. Catálogos e fixtures estão sem conteúdo clínico validado. `PENDING CLINICAL DISCOVERY`.
