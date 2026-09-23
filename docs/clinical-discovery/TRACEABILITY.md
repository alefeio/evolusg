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

## Três eixos de status (reconciliação v0.1)

A primeira rodada intensiva de discovery mostrou uma situação que um único status não representa: **"a Dra. Karen aprovou o conceito, mas a fonte científica ainda está pendente."**

A solução **não** é uma taxonomia nova e concorrente. Os vocabulários já existentes no repositório continuam válidos e passam a ser lidos em três eixos independentes. Um item pode — e normalmente vai — ter um valor em cada eixo ao mesmo tempo.

### Eixo 1 — Decisão clínica

Vocabulário já usado em [`CLINICAL_FIELD_CATALOG.md`](CLINICAL_FIELD_CATALOG.md) e [`PHRASE_CATALOG.md`](PHRASE_CATALOG.md).

| Valor | Significa |
|---|---|
| `DISCOVERED` | registrado como evidência (`CD`); não é requisito |
| `CLINICALLY_APPROVED` | validado explicitamente pela médica responsável (habilita `CR`) |
| `REJECTED` | descartado clinicamente |
| `PENDING CLINICAL DISCOVERY` | ainda não perguntado / não respondido |

### Eixo 2 — Evidência / fonte

Eixo **novo**, porque não existia forma de dizer que falta referência científica sem sugerir que falta aprovação clínica.

| Valor | Significa |
|---|---|
| `SOURCE_NOT_REQUIRED` | não depende de referência externa (definição, organização documental, aritmética simples) |
| `SOURCE_VALIDATION_PENDING` | depende de tabela/fórmula/versão ainda não formalmente estabelecida |
| `SOURCE_VALIDATED` | referência identificada, versionada e aceita |

Complemento operacional: `PENDING HANDOFF IMPORT` marca conteúdo que **já existe** no pacote clínico mas ainda não foi transcrito. É lacuna de transcrição, não de decisão — e **não** é o mesmo que `SOURCE_VALIDATION_PENDING`.

Singleton da Obstétrica com Doppler: frases e faixas do handoff foram importadas (deixaram de ser `PENDING HANDOFF IMPORT`). Múltiplos e outros protocolos podem ainda usar o marcador.

`sourceType` (abaixo) continua descrevendo a **natureza** da evidência de descoberta. Este eixo descreve a **suficiência** da referência para produzir comportamento clínico.

### Eixo 3 — Prontidão técnica

Reaproveita e detalha `PENDING TECHNICAL VALIDATION`.

| Valor | Significa |
|---|---|
| `NOT_ANALYZED` | sem análise técnica ainda |
| `READY_FOR_IMPLEMENTATION` | decisão clínica aprovada, fonte suficiente e desenho compreendido |
| `IMPLEMENTED` | existe em código com teste |

### O que uma fonte pendente pode e não pode liberar

| Permitido com `SOURCE_VALIDATION_PENDING` | **Não** permitido |
|---|---|
| documentação | classificação clínica definitiva |
| definição de campo | alerta clínico automático |
| schema conceitual | frase de conclusão baseada em threshold |
| estrutura de interface futura | expected output clínico definitivo |
| placeholders | cálculo de produção |
| fixture estrutural | — |
| arquitetura extensível | — |

Consequência prática: `CLINICALLY_APPROVED` + `SOURCE_VALIDATION_PENDING` **não** é `READY_FOR_IMPLEMENTATION` para regra, cálculo ou conclusão — é `READY_FOR_IMPLEMENTATION` no máximo para estrutura.

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

Primeira rodada intensiva de discovery concluída. O protocolo inicial existe como baseline documental em [`../protocols/OBSTETRIC_DOPPLER_V0_1.md`](../protocols/OBSTETRIC_DOPPLER_V0_1.md).

| Elo da cadeia | Estado |
|---|---|
| `CD` (evidência) | registrada na rodada 1; frases e faixas singleton importadas do handoff |
| `CR` (requisito validado) | estrutura, ordem, posição, placenta, ownership V1, fraseologia singleton |
| `TR` | não aberto — depende de autorização da próxima sprint |
| `FIELD` / `RULE` / `CALC` / `TEXT` | catalogados; classificação por threshold bloqueada por fonte |
| `FIX` | fixtures estruturais (incl. episódio + snapshots); expected output clínico pendente |
| `ProtocolVersion` | não existe artefato executável |

Nada aqui promove `CD` a `CR` automaticamente, e nada aqui autoriza implementação.
