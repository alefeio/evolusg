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

Textos aprovados desta seção: ver [`../clinical-discovery/PHRASE_CATALOG.md`](../clinical-discovery/PHRASE_CATALOG.md) (templates longitudinais e transversos importados).

## 7. Princípio "não marcado ≠ ausente"

Regra de modelagem e de interface, válida para todo o protocolo:

- campo não marcado **não** significa achado ausente;
- movimentos corporais e deglutição presentes → gerar frase "Movimentos fetais e deglutição presentes.";
- não marcados → **não** gerar frase;
- nunca gerar automaticamente "ausente" a partir de campo vazio.

| Eixo | Estado |
|---|---|
| Decisão clínica | `CLINICALLY_APPROVED` |
| Evidência/fonte | `SOURCE_NOT_REQUIRED` |
| Prontidão técnica | `READY_FOR_IMPLEMENTATION` |

Impacto direto no ADR-006: a "política de omissão" deixa de ser hipótese solta e passa a ter uma regra clínica validada — omitir na ausência, sem inferir negativa.

## 8. Biometria fetal

Campos: DBP, CC, CA, CF (mostrar medidas); PFE; percentil.

| Decisão | Eixo clínico | Eixo de fonte |
|---|---|---|
| Não exibir IG individual por medida | `CLINICALLY_APPROVED` | `SOURCE_NOT_REQUIRED` |
| Exibir IG estimada **geral** pela biometria (contexto do exame atual) | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` |
| PFE por Hadlock; frase com ±10% (margem versionável) | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` |
| Percentil de peso | `CLINICALLY_APPROVED` | `SOURCE_VALIDATION_PENDING` |

Diferença entre IG corrigida e IG pela biometria: **não** gera alerta automático.

Nenhum cálculo definitivo de produção enquanto a fonte não estiver validada.

## 9. Crescimento fetal

Thresholds informados (`CLINICALLY_APPROVED`):

| Classificação | Faixa informada |
|---|---|
| abaixo | &lt;P5 |
| adequado | P5–P90 |
| acima | &gt;P90 |

| Eixo | Estado |
|---|---|
| Decisão clínica + thresholds informados | `CLINICALLY_APPROVED` |
| Referência científica / versionamento | `SOURCE_VALIDATION_PENDING` |
| Prontidão técnica (classificação automática) | `NOT_ANALYZED` |

Frases: ver catálogo. Estrutura pode existir antes da fonte; classificação automática e frase de conclusão por threshold **não**.

## 10. Arquitetura conceitual de um componente Doppler

Modelo conceitual mínimo (não é classe/engine/schema):

| Elemento | Papel |
|---|---|
| `MeasuredValue` | valor informado |
| `Reference` | tabela/fonte versionada |
| `PercentileOrRange` | posição na referência |
| `Classification` | interpretação derivada |
| `Text` | frase por chave |
| `ConclusionContribution` | contribuição à conclusão |
| `SourceVersion` | versão da referência |

Enquanto `Reference`/`SourceVersion` não existirem, `Classification` e contribuições de conclusão **não** podem ser produzidas em produção.

## 11. Artérias uterinas

Campos: IP direita, IP esquerda, IP médio, incisura direita, incisura esquerda.

```text
IP médio = (IP direita + IP esquerda) / 2
```

Média aritmética: `SOURCE_NOT_REQUIRED` — candidata à Sprint 2 **sem** classificação P95.

| Conceito | Estado clínico |
|---|---|
| Avaliar direita, esquerda e média | `CLINICALLY_APPROVED` |
| `> P95` = alteração; `< P5` **não** | `CLINICALLY_APPROVED` |
| Lado individual `> P95` mesmo com média normal | `CLINICALLY_APPROVED` |
| Incisura direita / esquerda / bilateral | `CLINICALLY_APPROVED` |
| Conclusão sem incisura: "Alteração hemodinâmica na Dopplerfluxometria." | `CLINICALLY_APPROVED` + emissão `SOURCE_VALIDATION_PENDING` (P95) |
| Conclusão com incisura: "... Aumento do risco para pré-eclâmpsia." | `CLINICALLY_APPROVED` |

Tabela P95: `SOURCE_VALIDATION_PENDING`. Frases literais: [`PHRASE_CATALOG.md`](../clinical-discovery/PHRASE_CATALOG.md).

## 12. Umbilical, ACM, ducto venoso e RCP

| Componente | Alteração informada | Conclusão (conceito) | Fonte |
|---|---|---|---|
| Umbilical | IP &gt; P95; IP &lt; P5 não altera | "Aumento da resistência hemodinâmica materno-fetal." | `SOURCE_VALIDATION_PENDING` |
| ACM | IP &lt; P5; IP &gt; P95 não altera | "Dopplerfluxometria indicando centralização da hemodinâmica fetal." (só conclusão) | `SOURCE_VALIDATION_PENDING` |
| Ducto venoso | IP &lt; P5; IP &gt; P95 fora | corpo + conclusão de hipóxia (ver catálogo) | `SOURCE_VALIDATION_PENDING` |
| RCP | abaixo do estimado por IG (semanas+dias) | ver catálogo | `SOURCE_VALIDATION_PENDING` |

```text
RCP = IP ACM / IP artéria umbilical
```

Não usar umbilical/ACM. Não usar corte fixo `&lt;1`. Não inventar interpolação.

Quando **normais**, o corpo deve ter texto específico para uterinas, umbilical, ACM, DV e RCP — não só números. Conclusão global normal: "Dopplervelocimetria dentro da normalidade."

## 13. BCF, placenta, líquido amniótico

| Item | Fato importado | Fonte |
|---|---|---|
| BCF | faixa 120–160 bpm; bradi &lt;120; taqui &gt;160 | `CLINICALLY_APPROVED` + `SOURCE_VALIDATION_PENDING` |
| Placenta | localização: anterior, posterior, fúndica, lateral; grau I/II/III; frase no corpo, não na conclusão | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` |
| Líquido | escolha manual MBV **ou** ILA; MBV 3,0–8,0 / &lt;3 / &gt;8; ILA 3,0–24,0 / &lt;3 / &gt;24 | `CLINICALLY_APPROVED` + `SOURCE_VALIDATION_PENDING` |

Nenhum desses números vira classificação automática de produção nesta fase.

## 14. Conclusão

Requisitos conceituais: priority, deduplication, consolidation, maternal/fetal/global scope, suppression, merging. Sem LLM; determinístico; sem engine genérico agora.

Conclusão normal singleton (fraseologia documentada — **não** autoriza geração automática ainda):

1. "Gestação tópica, única, com feto vivo."
2. "Crescimento fetal adequado para a idade gestacional corrigida."
3. "Dopplervelocimetria dentro da normalidade."
4. "Normodrâmnio."

## 15. Fraseologia

`DADO CLÍNICO ≠ FRASE`. Hierarquia futura: Protocol → Organization → Professional → Manual Edit. Override: `PENDING PRODUCT DECISION`. Catálogo atualizado com literais singleton.

## 16. Múltiplos — documentado para o futuro

`DOCUMENTED FOR FUTURE IMPLEMENTATION`

Não expandir Sprint 2. Frases literais de múltiplos **não** foram completadas nesta complementação (não necessárias para autorizar Sprint 2 singleton). Modelagem inicial não deve impedir repeating groups, escopo fetal e identificação estável de fetos.

## 17. Rastreabilidade

Ver [`../clinical-discovery/TRACEABILITY.md`](../clinical-discovery/TRACEABILITY.md).

## 18. Pendências deste protocolo

| Pendência | Tipo |
|---|---|
| Validar formalmente todas as referências do backlog | `SOURCE_VALIDATION_PENDING` |
| Frases/textos de múltiplos (gemelar/trigemelar) | `DOCUMENTED FOR FUTURE IMPLEMENTATION` — não inventar |
| Ordem de preenchimento na interface | `PENDING PRODUCT DECISION` |
| Estrutura final da conclusão (engine) | `PROPOSED` |
| Workflow de retificação de laudo entregue | `PENDING CLINICAL DISCOVERY` (não bloqueia Sprint 2 de captura) |