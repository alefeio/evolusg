# Proposta — Sprint 2 (primeira vertical slice clínica)

**Status: PROPOSTA. NÃO AUTORIZADA.** Nada aqui autoriza implementação. Requer autorização explícita do proprietário.

Base: reconciliação Clinical Discovery v0.1 + complementação do handoff singleton.

## Objetivo

O menor incremento **realmente utilizável**: captura estruturada + draft persistente de Obstétrica com Doppler (gestação única).

```text
Professional autenticado
  → Patient
    → PregnancyEpisode mínimo
      → Exam
        → protocolo Obstetric Doppler v0.1
          → singleton
            → formulário estruturado
              → regras estruturais seguras
                → salvar draft
                  → reabrir draft
                    → editar draft
```

## Critério de sucesso (experiência da Dra. Karen)

Ao final da Sprint 2, com **dados fictícios**, ela deve conseguir:

1. entrar no evolUSG;
2. localizar/criar uma paciente fictícia;
3. iniciar uma gestação/contexto fictício (`PregnancyEpisode` mínimo);
4. criar um novo exame;
5. escolher Obstétrica com Doppler;
6. preencher o formulário singleton;
7. sair;
8. voltar depois;
9. localizar o draft;
10. continuar preenchendo/editando.

**Sem** geração final do laudo.

## O que entra na Sprint 2

| # | Entrega | Nota |
|---|---|---|
| 1 | `Patient` core | cadastro mínimo, busca simples, associação obrigatória |
| 2 | `PregnancyEpisode` mínimo | DUM; G/P/A; data 1ª USG; IG 1ª USG (semanas + dias) — aprovado para modelagem |
| 3 | `Exam` + contexto clínico do exame | comorbidades snapshot; medicações contínuas snapshot |
| 4 | Protocolo Obstetric Doppler v0.1 (artefato mínimo) | singleton; forma do artefato = decisão da sprint (ADR-002) |
| 5 | Formulário estruturado | seções do protocolo; escopo fetal único; placenta (localização + grau); método MBV/ILA |
| 6 | Regras estruturais | situação/apresentação; transversa ↔ córmica; longitudinal → dorso; transversa → polo; não marcado ≠ ausente |
| 7 | IP médio das uterinas | `(direita + esquerda) / 2` — aritmético; **sem** classificação P95 |
| 8 | Persistência e reabertura do draft | findings com `path` repetível desde já |
| 9 | Fixtures estruturais | sem expected-output clínico de threshold |

## O que a Sprint 2 **não** implementa

| Camada | Motivo |
|---|---|
| Geração textual do laudo | incremento posterior; no máximo labels/valores estruturados na UX |
| PFE Hadlock de produção | `SOURCE_VALIDATION_PENDING` |
| Percentil / classificação de crescimento | `SOURCE_VALIDATION_PENDING` |
| Interpretação P5/P95 (qualquer Doppler) | `SOURCE_VALIDATION_PENDING` |
| Interpretação automática Doppler | fonte pendente |
| BCF normal/bradi/taqui automática | faixa informada, fonte pendente |
| Classificação automática de líquido | faixas informadas, fonte pendente |
| Frases automáticas baseadas em threshold | fonte pendente |
| Conclusão automática | depende de classificação |
| Emissão / PDF / DOCX / Report final | exige ProfessionalProfile + workflow de retificação |
| Múltiplos / sFGR | `DOCUMENTED FOR FUTURE IMPLEMENTATION` |
| Timeline / sharing / DICOM / PACS / portal | fora do ciclo |
| Billing / admin / referral | fora |
| LLM clínico | proibido no motor |

## Por que o corte antes da geração textual

| Camada | Entra? | Motivo |
|---|---|---|
| Captura estruturada | **sim** | campos e ownership V1 fechados |
| Regras de posição + ausência | **sim** | validadas, sem fonte |
| IP médio aritmético | **sim** | definição, sem P95 |
| Geração textual completa | **não** | foco = captura + draft; texto = incremento seguinte |
| Classificação / conclusão / emissão | **não** | fonte e/ou produto ainda abertos |

Frases e thresholds do handoff estão **documentados** (`CLINICALLY_APPROVED`). Isso **não** autoriza emissão automática enquanto `SOURCE_VALIDATION_PENDING`.

## Pré-condições

| Pré-condição | Estado |
|---|---|
| Sprint 1 consolidada em `main` | atendido |
| `BLOCKING CLINICAL QUESTIONS FOR SPRINT 2` | `NONE` |
| Autorização explícita do proprietário | **pendente** |
| Somente dados fictícios | obrigatório (banco compartilhado) |
| Isolamento Production antes de uso clínico real | continua obrigatório |

## Perguntas **não** bloqueantes da Sprint 2

| Pergunta | Bloqueia |
|---|---|
| Quais referências/tabelas ela usa? | classificação / interpretação futura |
| Como ela corrige laudo já entregue? | emissão / versionamento final |

## Riscos específicos

| Risco | Mitigação |
|---|---|
| Formulário virar form-builder genérico | runtime só do recorte |
| Findings sem escopo fetal | `path` repetível desde o primeiro commit |
| Pressão para "já gerar o texto" | critério de sucesso = draft, não laudo |
| Thresholds importados virarem produção | `SOURCE_VALIDATION_PENDING` explícito |
| Tabelas clínicas em banco compartilhado | dados fictícios; gate de isolamento |

## Incrementos seguintes (indicativos)

1. **Geração textual** — frases do catálogo, ainda sem classificação automática por fonte pendente quando aplicável.
2. **Classificações e conclusão** — após validar referências (ADR-014).
3. **Emissão documental** — após workflow de retificação + `ProfessionalProfile` mínimo.
4. **Múltiplos** — somente após a slice singleton em uso.
