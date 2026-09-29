# Catálogo de frases

Status: **frases singleton da rodada 1 importadas do handoff.** Textos literais abaixo são `CLINICALLY_APPROVED` como fraseologia. Onde a emissão da frase depende de threshold/referência, a classificação permanece `SOURCE_VALIDATION_PENDING` — ver [`REFERENCE_VALIDATION_BACKLOG.md`](REFERENCE_VALIDATION_BACKLOG.md).

A frase pessoal **nunca** altera o dado clínico. O mesmo código pode gerar textos diferentes.

Hierarquia conceitual futura (apenas registrada, não implementada):

```text
Protocol Phrase → Organization Phrase → Professional Phrase → Manual Edit
```

Override pessoal continua `PENDING PRODUCT DECISION` (ADR-007; estratégias A/B/C em aberto).

Identidade proposta (ADR-007, `PROPOSED`): `phraseKey` semântica estável + regra versionada no protocolo.

## Estrutura

| Atributo | Descrição |
|---|---|
| Phrase Key | Identidade semântica estável |
| Conceito clínico associado | Field key(s) / codeset |
| Frase padrão evolUSG | Catálogo do protocolo |
| Frase pessoal da Dra. Karen | Override; vazio se igual ao padrão |
| Placeholders | Ex.: `{{lie}}`, `{{presentation}}` |
| Condições | Quando o fragmento entra no laudo |
| Exemplo | Findings → texto |
| Status | `DISCOVERED` \| `CLINICALLY_APPROVED` \| `IMPLEMENTED` \| `DEPRECATED` |
| Fonte / emissão | `SOURCE_NOT_REQUIRED` ou `SOURCE_VALIDATION_PENDING` (emissão automática) |

`IMPLEMENTED` só fará sentido após existir motor. Nesta fase o máximo é `CLINICALLY_APPROVED`.

## Índice — Obstétrica com Doppler v0.1 (gestação única)

Regra de composição: chave sem dado de entrada **não** gera frase, e ausência **não** gera negativa (ver princípio "não marcado ≠ ausente"). Exceção: `protocol.technique`, que não depende de campo.

Frases cuja emissão depende de classificação por referência **não** podem ser emitidas automaticamente antes de `SOURCE_VALIDATED`. Documentar a frase ≠ autorizar emissão automática.

### Dados clínicos

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `pregnancy.correctedGestationalAge` | "Idade gestacional corrigida com base na primeira ultrassonografia: {{semanas e dias}}." | IG corrigida disponível | `SOURCE_NOT_REQUIRED` (exibição); cálculo de produção depende de política de datação |
| `exam.biometryGestationalAge` | "Idade gestacional estimada pela biometria atual: {{semanas e dias}}." | IG biométrica disponível | `SOURCE_VALIDATION_PENDING` (método) |

Regra: a diferença entre essas duas idades **não** gera alerta automático.

### Técnica

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `protocol.technique` | "Exame realizado com transdutor convexo multifrequencial." | sempre; pertence à `ProtocolVersion` | `SOURCE_NOT_REQUIRED` |

### Situação / apresentação

Templates aprovados (adaptar valores conforme seleção):

| Phrase Key | Texto exemplo | Condição | Fonte / emissão |
|---|---|---|---|
| `fetus.position.longitudinal` | "Feto único, em situação longitudinal, apresentação {{cefálica\|pélvica}}, dorso à {{direita\|esquerda}}." | situação = longitudinal | `SOURCE_NOT_REQUIRED` |
| `fetus.position.transverse` | "Feto único, em situação transversa, apresentação córmica, com polo cefálico à {{direita\|esquerda}}." | situação = transversa | `SOURCE_NOT_REQUIRED` |

Exemplos literais do handoff:

- "Feto único, em situação longitudinal, apresentação cefálica, dorso à direita."
- "Feto único, em situação longitudinal, apresentação pélvica, dorso à esquerda."
- "Feto único, em situação transversa, apresentação córmica, com polo cefálico à direita."

### Vitalidade

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `fetus.vitality.movementsAndSwallowing` | "Movimentos fetais e deglutição presentes." | ambos marcados presentes | `SOURCE_NOT_REQUIRED` |

Se **não** marcados: não gerar frase. Não marcado ≠ ausente.

### BCF

Faixa informada (`CLINICALLY_APPROVED` + `SOURCE_VALIDATION_PENDING`): **120–160 bpm**.

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `fetus.vitality.heartRate.normal` | "Batimentos cardiofetais rítmicos, com frequência de {{BCF}} bpm, dentro dos limites da normalidade." | 120–160 | `SOURCE_VALIDATION_PENDING` |
| `fetus.vitality.heartRate.bradycardia` | "Bradicardia fetal." | &lt;120 | `SOURCE_VALIDATION_PENDING` |
| `fetus.vitality.heartRate.tachycardia` | "Taquicardia fetal." | &gt;160 | `SOURCE_VALIDATION_PENDING` |

### Biometria

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `fetus.biometry.efw` | "Peso fetal estimado: {{peso}} g (±10%), correspondente ao percentil {{percentil}} para a idade gestacional corrigida." | PFE disponível | `SOURCE_VALIDATION_PENDING` (Hadlock + percentil) |

Regras: mostrar DBP, CC, CA, CF explicitamente; **não** mostrar IG individual por medida; mostrar só IG estimada geral pela biometria. Margem inicial ±10% — configurável/versionável.

### Crescimento

Thresholds informados (`CLINICALLY_APPROVED` + `SOURCE_VALIDATION_PENDING`): &lt;P5 = abaixo; P5–P90 = adequado; &gt;P90 = acima.

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `fetus.growth.below` | "Crescimento fetal abaixo do esperado para a idade gestacional corrigida." | &lt;P5 | `SOURCE_VALIDATION_PENDING` |
| `fetus.growth.adequate` | "Crescimento fetal adequado para a idade gestacional corrigida." | P5–P90 | `SOURCE_VALIDATION_PENDING` |
| `fetus.growth.above` | "Crescimento fetal acima do esperado para a idade gestacional corrigida." | &gt;P90 | `SOURCE_VALIDATION_PENDING` |

### Placenta

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `placenta.description` | "Placenta de localização {{localização}}, grau {{grau}} de maturidade." | localização + grau informados | `SOURCE_NOT_REQUIRED` |

Localização: anterior, posterior, fúndica, lateral. Grau: I, II, III. Aparece no **corpo**; **não** repetir na conclusão.

### Líquido amniótico

Gestação única: médico escolhe manualmente **MBV** ou **ILA** — o sistema **não** escolhe automaticamente.

Faixas informadas (`CLINICALLY_APPROVED` + `SOURCE_VALIDATION_PENDING`):

| Método | Normal | Oligodrâmnio | Polidrâmnio |
|---|---|---|---|
| MBV | 3,0–8,0 | &lt;3,0 | &gt;8,0 |
| ILA | 3,0–24,0 | &lt;3,0 | &gt;24,0 |

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `amnioticFluid.normal` | "Líquido amniótico em quantidade normal." | classificação normal | `SOURCE_VALIDATION_PENDING` |
| `amnioticFluid.oligo` | "Líquido amniótico reduzido, caracterizando oligodrâmnio." | oligodrâmnio | `SOURCE_VALIDATION_PENDING` |
| `amnioticFluid.poly` | "Líquido amniótico aumentado, caracterizando polidrâmnio." | polidrâmnio | `SOURCE_VALIDATION_PENDING` |
| `conclusion.normohydramnios` | "Normodrâmnio." | conclusão quando normal | `SOURCE_VALIDATION_PENDING` |

### Artérias uterinas

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `maternal.uterineArtery.notch.right` | "Incisura protodiastólica presente na artéria uterina direita." | incisura direita | `SOURCE_NOT_REQUIRED` |
| `maternal.uterineArtery.notch.left` | "Incisura protodiastólica presente na artéria uterina esquerda." | incisura esquerda | `SOURCE_NOT_REQUIRED` |
| `maternal.uterineArtery.notch.bilateral` | "Incisura protodiastólica presente nas artérias uterinas bilateralmente." | bilateral | `SOURCE_NOT_REQUIRED` |
| `conclusion.uterine.hemodynamic` | "Alteração hemodinâmica na Dopplerfluxometria." | IP alterado sem incisura | `SOURCE_VALIDATION_PENDING` (P95) |
| `conclusion.uterine.hemodynamicPreeclampsia` | "Alteração hemodinâmica na Dopplerfluxometria. Aumento do risco para pré-eclâmpsia." | incisura uni ou bilateral | `SOURCE_NOT_REQUIRED` (incisura) + conclusão |

Textos de normalidade no corpo (uterinas, umbilical, ACM, DV, RCP): `CLINICALLY_APPROVED` como exigência — o corpo deve ter texto específico quando normal, não só números. Texto literal completo de cada normalidade Doppler: documentado no protocolo; emissão automática de classificação permanece `SOURCE_VALIDATION_PENDING`.

### Artéria umbilical

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `conclusion.umbilical.highResistance` | "Aumento da resistência hemodinâmica materno-fetal." | IP &gt; P95 (isolado) | `SOURCE_VALIDATION_PENDING` |

`IP < P5` não gera alteração neste protocolo.

### Artéria cerebral média (ACM)

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `conclusion.mca.centralization` | "Dopplerfluxometria indicando centralização da hemodinâmica fetal." | IP &lt; P5; **somente na conclusão** | `SOURCE_VALIDATION_PENDING` |

`IP > P95` não gera frase de alteração.

### Ducto venoso

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `fetus.doppler.ductusVenosus.altered` | "IP abaixo do estimado para a idade gestacional, correspondendo a alteração da hemodinâmica fetal." | IP &lt; P5 (corpo) | `SOURCE_VALIDATION_PENDING` |
| `conclusion.ductusVenosus.altered` | "Avaliação dopplerfluxométrica evidenciando alteração da hemodinâmica fetal, com aumento do risco de hipóxia fetal." | IP &lt; P5 (conclusão) | `SOURCE_VALIDATION_PENDING` |
| `fetus.doppler.ductusVenosus.normal` | "IP do ducto venoso dentro dos limites esperados para a idade gestacional." | normal | `SOURCE_VALIDATION_PENDING` |

`IP > P95` não entra nesta regra.

### RCP

Fórmula: `RCP = IP ACM / IP artéria umbilical`. Não usar umbilical/ACM. Não usar corte fixo `&lt;1`. Classificação depende de IG precisa (semanas + dias). Sem interpolação inventada.

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `fetus.doppler.cpr.altered` | "Relação cerebro-placentária abaixo do estimado para a idade gestacional, evidenciando possível risco de prejuízo hemodinâmico materno-fetal." | RCP abaixo (corpo) | `SOURCE_VALIDATION_PENDING` |
| `conclusion.cpr.altered` | "Relação cerebro-placentária abaixo do esperado para a idade gestacional." | RCP abaixo (conclusão) | `SOURCE_VALIDATION_PENDING` |

### Conclusão — normalidade Doppler e singleton normal

| Phrase Key | Texto | Condição | Fonte / emissão |
|---|---|---|---|
| `conclusion.doppler.normal` | "Dopplervelocimetria dentro da normalidade." | Doppler global normal | `SOURCE_VALIDATION_PENDING` |
| `conclusion.singleton.liveTopical` | "Gestação tópica, única, com feto vivo." | singleton com feto vivo | `SOURCE_NOT_REQUIRED` (estrutura) |
| `conclusion.singleton.growthAdequate` | "Crescimento fetal adequado para a idade gestacional corrigida." | crescimento adequado | `SOURCE_VALIDATION_PENDING` |
| `conclusion.singleton.dopplerNormal` | "Dopplervelocimetria dentro da normalidade." | Doppler normal | `SOURCE_VALIDATION_PENDING` |
| `conclusion.singleton.normohydramnios` | "Normodrâmnio." | líquido normal | `SOURCE_VALIDATION_PENDING` |

A lista das quatro frases de conclusão normal singleton é **documentação/fraseologia**. Não autoriza geração automática enquanto as regras correspondentes não estiverem tecnicamente e cientificamente prontas.

### Múltiplos

Frases de gemelares/trigemelares: `DOCUMENTED FOR FUTURE IMPLEMENTATION`. Não inventar texto nesta complementação. Não necessário para autorizar Sprint 2 singleton.
