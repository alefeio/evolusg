# Proposta — Sprint 2 (primeira vertical slice clínica)

**Status: PROPOSTA. NÃO AUTORIZADA.** Nada aqui autoriza implementação. Requer autorização explícita do proprietário.

Base: reconciliação [`Clinical Discovery v0.1`](../protocols/OBSTETRIC_DOPPLER_V0_1.md) sobre a Sprint 1 consolidada.

## Objetivo

O menor incremento **realmente utilizável**: a profissional autenticada consegue registrar, salvar e retomar um exame obstétrico com Doppler de gestação única, com dados estruturados.

```text
Professional autenticado
  → Patient
    → contexto gestacional mínimo (PregnancyEpisode)
      → Exam
        → protocolo Obstetric Doppler v0.1
          → gestação única
            → formulário estruturado
              → persistência e reabertura do draft
```

## Por que o corte para antes da geração textual

Avaliação explícita da pergunta "regras/geração textual entram nesta sprint?":

| Camada | Entra na Sprint 2? | Motivo |
|---|---|---|
| Captura estruturada | **sim** | campos `CLINICALLY_APPROVED` com `SOURCE_NOT_REQUIRED` |
| Regras de visibilidade e dependência (situação/apresentação/dorso/polo) | **sim** | validadas, sem dependência de fonte |
| Semântica "não marcado ≠ ausente" | **sim** | é regra de modelagem/UI, não de interpretação |
| Cálculo puramente aritmético (PI médio das uterinas) | **sim**, exibindo valor sem classificação | definição, não referência |
| Geração textual do laudo | **não** | os textos aprovados ainda estão `PENDING HANDOFF IMPORT`; gerar frase inventada pela engenharia é inaceitável |
| Classificação clínica, percentis, alertas | **não** | [`referências pendentes`](../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md) |
| Conclusão | **não** | depende de contribuições que dependem de classificação |
| Emissão de PDF/DOCX | **não** | exige `ProfessionalProfile` e a decisão de retificação (ADR-009), nenhuma das duas necessária para capturar |

Consequência: a Sprint 2 entrega **valor verificável** (a rotina de preenchimento existe e sobrevive a um refresh) sem consumir nenhuma decisão que ainda não pode ser tomada.

## Escopo proposto

| # | Entrega | Nota |
|---|---|---|
| 1 | `Patient` core: cadastro mínimo, busca simples, associação obrigatória do exame | campos mínimos conforme catálogo; sem merge/anti-duplicidade |
| 2 | `PregnancyEpisode` mínimo: DUM, ultrassonografia de datação, G/P/A | os três já `CLINICALLY_APPROVED`; refinamento depende da pergunta 3 do lote 2 |
| 3 | `Exam` vinculado a paciente + episódio, com protocolo e versão registrados | sem estados documentais além de rascunho |
| 4 | Protocolo Obstetric Doppler v0.1 como artefato versionado mínimo | forma do artefato é decisão da sprint (ADR-002 restrito) |
| 5 | Formulário estruturado das oito seções, escopo fetal único | ordem de saída conforme protocolo |
| 6 | Regras de dependência de posição fetal + bloqueio de combinações incompatíveis | `RULE-OBD-001` a `RULE-OBD-005` |
| 7 | Persistência de findings estruturados e reabertura do rascunho | `path` com escopo repetível desde já |
| 8 | Fixtures estruturais executáveis dos cenários sem dependência de fonte | ver [`fixtures`](../testing/CLINICAL_FIXTURES.md) |

## Fora da Sprint 2 (exclusão explícita)

múltiplos (gemelar/trigemelar) · sFGR · timeline longitudinal · matching automático · compartilhamento entre profissionais · DICOM · PACS · portal do paciente · QR Code · billing/assinaturas · administração/RBAC · programa de indicação · LLM em qualquer ponto do motor clínico · toda referência ainda não validada · geração textual do laudo · conclusão automática · emissão de PDF/DOCX · override de fraseologia.

## Pré-condições

| Pré-condição | Estado |
|---|---|
| Sprint 1 consolidada em `main` | atendido |
| Autorização explícita do proprietário | **pendente** |
| Somente dados fictícios | obrigatório enquanto o banco for compartilhado |
| `PRODUCTION DATABASE ISOLATION REQUIRED BEFORE REAL CLINICAL USE` | continua valendo; a Sprint 2 cria tabelas clínicas no banco compartilhado e **não** libera uso clínico real |

## Riscos específicos desta sprint

| Risco | Mitigação |
|---|---|
| Formulário virar form-builder genérico | runtime só do recorte; sem construtor visual |
| Findings modelados sem escopo fetal | `path` repetível desde o primeiro commit (R-13, R-15) |
| Pressão para "já gerar o texto" | frases pendentes de transcrição; gerar texto inventado é proibido |
| Tabelas clínicas em banco compartilhado | dados fictícios; gate de isolamento antes de uso real |

## Incrementos seguintes (indicativos)

1. **Geração textual** — depois de transcrever as frases aprovadas do pacote clínico v0.1.
2. **Classificações e conclusão** — depois de validar as referências do backlog (ADR-014).
3. **Emissão documental** — depois de responder como ela corrige um laudo hoje (ADR-009/012) e de `ProfessionalProfile` mínimo.
4. **Múltiplos** — somente após a primeira slice estar em uso real.
