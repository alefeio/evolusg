# Protocolo — Ultrassonografia Obstétrica com Doppler (v0.1)

**Natureza deste documento:** baseline **documental** do primeiro protocolo. Não é artefato executável, não é schema físico e não autoriza implementação.

**Fonte clínica:** pacote clínico v0.1 (primeira rodada intensiva de Clinical Discovery, decisões validadas pela Dra. Karen). Cada item abaixo carrega os três eixos de status definidos em [`../clinical-discovery/TRACEABILITY.md`](../clinical-discovery/TRACEABILITY.md).

**Regra deste documento:** ele guarda o que é **do protocolo** (ordem, composição, dependências, condições). Campos, frases e cálculos vivem nos catálogos e **não** são duplicados aqui.

## 1. Posição no ciclo de produto

| Afirmação | Classificação |
|---|---|
| `PRODUCT INTENT = MULTIPROTOCOL` | `KNOWN` (intenção de produto) |
| `FIRST PRODUCT CYCLE = OBSTETRIC-FIRST` | `KNOWN` (decisão de produto) |
| `ARCHITECTURE = MUST NOT PRECLUDE MULTIPROTOCOL` | `KNOWN` (restrição de desenho) |
| Motor genérico para toda ultrassonografia | **não** é requisito imediato |

Este protocolo é o primeiro a ser implementado em profundidade. A abstração deve nascer de necessidade concreta dele, não de antecipação.

## 2. Primeiro protocolo escolhido

`ULTRASSONOGRAFIA OBSTÉTRICA COM DOPPLER`

Motivo registrado: alta frequência na rotina da Dra. Karen, possibilidade de validação frequente e riqueza suficiente para exercitar o produto de ponta a ponta.

## 3. Escopo da primeira vertical slice executável

`SINGLETON ONLY`

Fluxo alvo:

```text
Paciente
  → contexto gestacional mínimo
    → novo exame
      → Obstétrica com Doppler
        → GESTAÇÃO ÚNICA
          → preenchimento estruturado
            → cálculos/regras permitidos
              → geração textual
                → revisão
                  → documento/laudo
```

Fora da primeira vertical slice (documentado, não implementado): gemelares, trigemelares, sFGR avançada, protocolos de discordância tipo Gratacós, timeline longitudinal, compartilhamento entre profissionais, DICOM, PACS, portal do paciente, QR Code e matching longitudinal automático.

## 4. Ordem das seções do laudo

Ordem clinicamente aprovada; tratada como requisito do protocolo v0.1.

| # | Seção |
|---|---|
| 1 | Dados clínicos |
| 2 | Técnica do exame |
| 3 | Vitalidade / posição fetal |
| 4 | Doppler |
| 5 | Biometria fetal |
| 6 | Placenta |
| 7 | Líquido amniótico |
| 8 | Conclusão |

- Decisão clínica: `CLINICALLY_APPROVED`
- Evidência/fonte: `SOURCE_NOT_REQUIRED` (organização documental, não regra científica)
- Prontidão técnica: `READY_FOR_IMPLEMENTATION`

A composição do texto segue esta ordem. A ordem de **preenchimento** na interface pode divergir da ordem de saída: `PENDING PRODUCT DECISION`.

## 5. Técnica do exame

Frase fixa da versão do protocolo: "Exame realizado com transdutor convexo multifrequencial."

| Aspecto | Estado |
|---|---|
| A frase pertence à `ProtocolVersion`, não a um campo preenchido | `CLINICALLY_APPROVED` |
| Não pedir seleção manual de transdutor na rotina | `CLINICALLY_APPROVED` |
| Prontidão técnica | `READY_FOR_IMPLEMENTATION` |

Consequência de modelagem: existe conteúdo textual que é **do protocolo** e não deriva de `Finding`. O motor textual precisa suportar fragmento sem dado de entrada.

## 6. Situação, apresentação, dorso e polo cefálico

Codesets aprovados:

| Conceito | Opções |
|---|---|
| Situação | longitudinal, transversa |
| Apresentação | cefálica, pélvica, córmica |
| Dorso | direita, esquerda |
| Polo cefálico | direita, esquerda |

Dependências validadas:

| Regra | Enunciado |
|---|---|
| `RULE-OBD-001` | SE situação = transversa ENTÃO apresentação = córmica |
| `RULE-OBD-002` | SE apresentação = córmica ENTÃO situação = transversa |
| `RULE-OBD-003` | Situação longitudinal → exibir dorso |
| `RULE-OBD-004` | Situação transversa → ocultar dorso e exibir polo cefálico |
| `RULE-OBD-005` | Combinações incompatíveis não podem ser gravadas nem geradas |

- Decisão clínica: `CLINICALLY_APPROVED`
- Evidência/fonte: `SOURCE_NOT_REQUIRED`
- Prontidão técnica: `READY_FOR_IMPLEMENTATION`

Textos aprovados desta seção: ver [`../clinical-discovery/PHRASE_CATALOG.md`](../clinical-discovery/PHRASE_CATALOG.md). O texto literal ainda está `PENDING HANDOFF IMPORT` — as chaves e as condições já estão registradas.

## 7. Princípio "não marcado ≠ ausente"

Regra de modelagem e de interface, válida para todo o protocolo:

- campo não marcado **não** significa achado ausente;
- movimentos corporais e deglutição presentes → gerar frase;
- não marcados → **não** gerar frase;
- nunca gerar automaticamente "ausente" a partir de campo vazio.

| Eixo | Estado |
|---|---|
| Decisão clínica | `CLINICALLY_APPROVED` |
| Evidência/fonte | `SOURCE_NOT_REQUIRED` |
| Prontidão técnica | `READY_FOR_IMPLEMENTATION` |

Impacto direto no ADR-006: a "política de omissão" deixa de ser hipótese solta e passa a ter uma regra clínica validada — omitir na ausência, sem inferir negativa.

## 8. Biometria fetal

Campos: DBP, CC, CA, CF, PFE, percentil.

| Decisão | Eixo clínico | Eixo de fonte |
|---|---|---|
| Não exibir idade gestacional individual por medida biométrica | `CLINICALLY_APPROVED` | `SOURCE_NOT_REQUIRED` |
| Exibir idade gestacional estimada **geral** pela biometria | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` (qual composição/fórmula produz a IG geral) |
| PFE por Hadlock (conceito e dependência) | `CLINICALLY_APPROVED` como conceito | `SOURCE_VALIDATION_PENDING` (fórmula, tabela e versão exatas) |
| Percentil de peso | `CLINICALLY_APPROVED` como conceito | `SOURCE_VALIDATION_PENDING` (tabela e versão) |

Nenhum cálculo definitivo pode ser implementado enquanto a fonte não estiver validada. Ver [`../clinical-discovery/CALCULATION_CATALOG.md`](../clinical-discovery/CALCULATION_CATALOG.md) e [`../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md`](../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md).

## 9. Crescimento fetal

Conceito clínico aprovado: classificação em **abaixo**, **adequado** e **acima**.

| Eixo | Estado |
|---|---|
| Decisão clínica (existência das três classes) | `CLINICALLY_APPROVED` |
| Thresholds numéricos informados na discovery | `PENDING HANDOFF IMPORT` |
| Referência científica e versionamento dos thresholds | `SOURCE_VALIDATION_PENDING` |
| Prontidão técnica | `NOT_ANALYZED` até a fonte |

A classificação pode existir como **estrutura** (campo, opções, lugar no texto) antes da fonte; não pode gerar classificação automática, alerta ou frase de conclusão antes dela.

## 10. Arquitetura conceitual de um componente Doppler

Modelo conceitual mínimo que cada componente Doppler precisa suportar. **Não** é classe, não é engine, não é schema.

| Elemento conceitual | Papel |
|---|---|
| `MeasuredValue` | valor informado pela profissional, com unidade |
| `Reference` | tabela/fonte aplicável, versionada |
| `PercentileOrRange` | posição do valor na referência |
| `Classification` | interpretação clínica derivada |
| `Text` | frase correspondente, por chave semântica |
| `ConclusionContribution` | o que este componente entrega à conclusão |
| `SourceVersion` | qual versão de referência produziu a interpretação |

Serve para responder uma pergunta arquitetural: a modelagem prevista suporta dado → referência → interpretação → frase → contribuição à conclusão → rastreabilidade? Enquanto `Reference` e `SourceVersion` não existirem de fato, `Classification` e `ConclusionContribution` não podem ser produzidos em produção.

## 11. Artérias uterinas

Campos: PI direita, PI esquerda, PI médio, incisura direita, incisura esquerda.

Cálculo aprovado:

```text
PI médio = (PI direita + PI esquerda) / 2
```

Média aritmética simples: `SOURCE_NOT_REQUIRED` (é definição, não referência científica).

Conceitos clínicos aprovados:

| Conceito | Estado clínico |
|---|---|
| Avaliar lado direito, lado esquerdo e a média | `CLINICALLY_APPROVED` |
| `> P95` é alteração relevante | `CLINICALLY_APPROVED` |
| `< P5` **não** é regra patológica neste protocolo | `CLINICALLY_APPROVED` |
| Lado individual `> P95` deve ser sinalizado mesmo com média normal | `CLINICALLY_APPROVED` |
| Incisura: direita, esquerda, bilateral | `CLINICALLY_APPROVED` |
| Contribuição consolidada para a conclusão | `CLINICALLY_APPROVED` como conceito |

Bloqueio de fonte: a **tabela de percentis** das artérias uterinas por idade gestacional é `SOURCE_VALIDATION_PENDING`. Portanto a avaliação automática de P95 **não** está pronta para produção, mesmo com o conceito aprovado.

Frases aprovadas (lado alterado, incisura unilateral, incisura bilateral, contribuição de conclusão): chaves registradas no catálogo de frases, texto literal `PENDING HANDOFF IMPORT`.

## 12. Umbilical, ACM, ducto venoso e RCP

| Componente | Conceito clínico | Referência |
|---|---|---|
| Artéria umbilical | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` |
| ACM | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` |
| Ducto venoso | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` |
| RCP | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` |

Fórmula aprovada:

```text
RCP = PI da ACM / PI da artéria umbilical
```

Restrições registradas:

- **não** usar corte fixo `< 1`;
- a classificação depende de idade gestacional precisa;
- **não** inventar interpolação entre semanas/dias.

Frases aprovadas de cada componente: chaves no catálogo, texto `PENDING HANDOFF IMPORT`.

## 13. BCF, líquido amniótico e outras faixas

| Item | Estado |
|---|---|
| BCF (faixa informada na discovery) | `PENDING HANDOFF IMPORT` + `SOURCE_VALIDATION_PENDING` |
| MBV | `PENDING HANDOFF IMPORT` + `SOURCE_VALIDATION_PENDING` |
| ILA | `PENDING HANDOFF IMPORT` + `SOURCE_VALIDATION_PENDING` |
| Placenta (localização, aspecto) | `CLINICALLY_APPROVED` como seção; campos a detalhar no catálogo |

Nenhum desses números vira comportamento de produção nesta fase. Estrutura sim; classificação automática não.

## 14. Conclusão

A discovery mostrou que a conclusão **não** é concatenação simples de frases. Requisitos conceituais mínimos:

| Requisito | Significado |
|---|---|
| `priority` | ordem clínica de importância entre contribuições |
| `deduplication` | não repetir a mesma informação vinda de dois componentes |
| `consolidation` | agrupar contribuições relacionadas numa única afirmação |
| maternal scope | achados do contexto materno |
| fetal scope | achados por feto |
| global scope | afirmações do exame como um todo |
| `suppression` | contribuição que deixa de aparecer diante de outra mais forte |
| merging compatible findings | fundir contribuições compatíveis sem perder significado |

Restrições: sem LLM; determinístico; **não** construir engine genérico agora. A proposta é a **menor estrutura determinística suficiente** para este protocolo — lista ordenada de contribuições com escopo e chave de consolidação, avaliada em ordem fixa.

- Decisão clínica (a conclusão precisa desses comportamentos): `CLINICALLY_APPROVED`
- Desenho da estrutura: `PROPOSED`
- Prontidão técnica: `NOT_ANALYZED` (depende das referências que alimentam as contribuições)

## 15. Fraseologia

`DADO CLÍNICO ≠ FRASE` permanece princípio (ADR-005, ADR-006, ADR-007).

Hierarquia conceitual futura, apenas registrada:

```text
Protocol Phrase → Organization Phrase → Professional Phrase → Manual Edit
```

Override pessoal continua `PENDING PRODUCT DECISION` (ADR-007, estratégias A/B/C em aberto). Não implementar override neste ciclo.

## 16. Múltiplos — documentado para o futuro

`DOCUMENTED FOR FUTURE IMPLEMENTATION`

Conhecimento preservado da discovery: gemelares, trigemelares, corionicidade, amnionicidade, discordância, sFGR e identificação fetal.

Função **agora**: teste arquitetural. A modelagem inicial não deve impedir:

- `repeating groups` (N fetos no mesmo exame);
- escopo fetal em campos, frases e contribuições de conclusão;
- identificação estável de cada feto ao longo do episódio gestacional.

Isso **não** significa implementar suporte a múltiplos na próxima Sprint. Significa que caminhos de modelagem que travem esses três pontos devem ser rejeitados.

## 17. Rastreabilidade

Cada item deste documento deve, quando entrar em trabalho técnico, existir como `CR` validado e `TR` derivado, com artefatos `FIELD` / `RULE` / `CALC` / `TEXT` nos catálogos, `FIX` em [`../testing/CLINICAL_FIXTURES.md`](../testing/CLINICAL_FIXTURES.md) e vínculo com a `ProtocolVersion` que o publicar. Ver [`../clinical-discovery/TRACEABILITY.md`](../clinical-discovery/TRACEABILITY.md).

## 18. Pendências deste protocolo

| Pendência | Tipo |
|---|---|
| Importar textos literais das frases aprovadas do pacote clínico v0.1 | `PENDING HANDOFF IMPORT` |
| Importar faixas numéricas informadas (crescimento, BCF, MBV, ILA) | `PENDING HANDOFF IMPORT` |
| Validar formalmente todas as referências do backlog | `SOURCE_VALIDATION_PENDING` |
| Campos de dados clínicos, placenta e líquido detalhados no catálogo | `PENDING CLINICAL DISCOVERY` (detalhe) |
| Ordem de preenchimento na interface | `PENDING PRODUCT DECISION` |
| Estrutura final da conclusão | `PROPOSED` |
