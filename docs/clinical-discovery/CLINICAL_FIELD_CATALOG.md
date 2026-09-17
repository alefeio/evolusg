# Catálogo de campos clínicos

Status: **rodada 1 de discovery incorporada** para o protocolo [`Obstétrica com Doppler v0.1`](../protocols/OBSTETRIC_DOPPLER_V0_1.md). Campos ainda não descobertos permanecem `PENDING CLINICAL DISCOVERY`. Nada aqui é schema físico.

Cada campo carrega os **três eixos de status** de [`TRACEABILITY.md`](TRACEABILITY.md#três-eixos-de-status-reconciliação-v01): decisão clínica, evidência/fonte e prontidão técnica.

Quando um trecho de laudo chegar, decompor em campos. Não armazenar o trecho como se fosse o dado.

## Ownership do dado (a que entidade conceitual pertence)

Objetivo: evitar que tudo caia dentro de `Exam`. Categorias conceituais (sem tabela, sem coluna):

| Nível | O que pertence |
|---|---|
| `Patient-level` | o que acompanha a pessoa entre gestações |
| `PregnancyEpisode-level` | o que vale para **esta** gestação (datação, paridade no episódio) |
| `Exam-level` | o que é medido/observado **neste** evento clínico |
| `Fetus-level` | o que é por feto dentro do exame (escopo fetal) |
| `Finding-level` | o registro estruturado individual (valor, unidade, origem) |
| `Report-level` | o que é do documento (narrativa, conclusão consolidada) |
| `ProfessionalPreference-level` | preferência da profissional (fraseologia, defaults de exibição) |

### Decisões de ownership da rodada 1

| Dado | Nível proposto | Justificativa | Estado |
|---|---|---|---|
| DUM | `PregnancyEpisode-level` | é âncora de datação da gestação, não atributo permanente da paciente nem medida do exame | `PROPOSED` |
| Primeira ultrassonografia (usada para datar) | `PregnancyEpisode-level` | âncora de datação do episódio | `PROPOSED` |
| IG corrigida | derivada: política de datação no `PregnancyEpisode-level`, valor calculado na data do `Exam` | evita gravar IG solta e inconsistente entre exames | `PROPOSED` |
| G / P / A | `PregnancyEpisode-level` (como informado no episódio) | muda ao longo da vida; congelar por episódio preserva a verdade do laudo | `PROPOSED` + ambiguidade registrada |
| Comorbidades | `Patient-level`, com relevância anotada no episódio | acompanham a pessoa | `PROPOSED` + ambiguidade registrada |
| Medicações | ambíguo: lista atual da paciente vs uso no momento do exame | os dois significados existem e não são o mesmo dado | `PENDING PRODUCT DECISION` |
| Biometria (DBP, CC, CA, CF, PFE, percentil) | `Fetus-level` dentro do `Exam` | é por feto, mesmo com um único feto | `PROPOSED` |
| Doppler fetal (umbilical, ACM, DV, RCP) | `Fetus-level` | é por feto | `PROPOSED` |
| Doppler materno (artérias uterinas, incisuras) | `Exam-level`, escopo materno | não é atributo de um feto | `PROPOSED` |
| Placenta | `Exam-level` no protocolo singleton | em múltiplos passa a depender de corionicidade → escopo revisto no futuro | `PROPOSED` |
| Líquido amniótico (MBV, ILA) | `Exam-level` no protocolo singleton | em múltiplos passa a ser por saco gestacional → escopo revisto no futuro | `PROPOSED` |
| Vitalidade e posição fetal | `Fetus-level` | por feto | `PROPOSED` |
| Frases | **não** é dado clínico: artefato `TEXT` do protocolo; override em `ProfessionalPreference-level` | `DADO ≠ FRASE` | `KNOWN` (princípio) |
| Conclusão | `Report-level`, montada a partir de contribuições com escopo materno/fetal/global | conclusão é do documento, não de um campo | `PROPOSED` |

Ambiguidades acima são **decisões pendentes explícitas**, não lacunas silenciosas.

## Estrutura de cada campo

| Atributo | Descrição |
|---|---|
| Field Key | Identidade estável do dado (`path` / código). Ex. conceitual: `fetuses[n].presentation` |
| Nome clínico | Como a profissional se refere ao campo |
| Seção | Seção do protocolo / do documento |
| Tipo | `CODED` \| `NUMBER` \| `BOOLEAN` \| `TEXT` \| `DATE` \| `QUANTITY` |
| Unidade | Se aplicável |
| Obrigatoriedade | sempre / opcional / condicional |
| Condição de visibilidade | Se condicional, a condição |
| Opções | Codeset, se `CODED` |
| Valor padrão | Só se clinicamente seguro; senão vazio |
| Origem | `USER` \| `CALCULATED` \| `DEFAULT` |
| Participa do texto? | `SIM` / `NÃO` |
| Text / Phrase Key | Chave semântica da frase, se houver |
| Participa da conclusão? | `SIM` / `NÃO` |
| Regra de validação | erro / warning / mensagem |
| Fonte clínica | Obrigatória para cálculo ou classificação |
| Status de aprovação (decisão clínica) | `DISCOVERED` \| `CLINICALLY_APPROVED` \| `REJECTED` |
| Status de fonte | `SOURCE_NOT_REQUIRED` \| `SOURCE_VALIDATION_PENDING` \| `SOURCE_VALIDATED` |
| Prontidão técnica | `NOT_ANALYZED` \| `READY_FOR_IMPLEMENTATION` \| `IMPLEMENTED` |
| Ownership | `Patient` \| `PregnancyEpisode` \| `Exam` \| `Fetus` \| `Finding` \| `Report` \| `ProfessionalPreference` |
| Observações | |

## Registro

Copiar o bloco abaixo para cada campo descoberto.

```md
### [Field Key] — PENDING

- Nome clínico:
- Seção:
- Tipo:
- Unidade:
- Obrigatoriedade:
- Condição de visibilidade:
- Opções:
- Valor padrão:
- Origem:
- Participa do texto?:
- Text / Phrase Key:
- Participa da conclusão?:
- Regra de validação:
- Fonte clínica:
- Status de aprovação: DISCOVERED
- Observações:
- Evidência (laudo/template, anonimizado):
```

## Índice — Obstétrica com Doppler v0.1 (gestação única)

Field Keys são **conceituais** (não são colunas). `[n]` indica escopo fetal preparado para repetição futura; na primeira vertical slice `n` é sempre único.

Legenda de status: decisão clínica / fonte / prontidão técnica.

| Field Key (conceitual) | Nome clínico | Seção | Ownership | Status |
|---|---|---|---|---|
| `pregnancy.lmp` | DUM | Dados clínicos | PregnancyEpisode | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `pregnancy.datingUltrasound` | Primeira ultrassonografia | Dados clínicos | PregnancyEpisode | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `pregnancy.correctedGestationalAge` | IG corrigida | Dados clínicos | derivado | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` (política de datação e interpolação) / `NOT_ANALYZED` |
| `pregnancy.gravidity` `pregnancy.parity` `pregnancy.abortions` | G / P / A | Dados clínicos | PregnancyEpisode | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `patient.comorbidities` | Comorbidades | Dados clínicos | Patient | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `NOT_ANALYZED` |
| `patient.medications` | Medicações | Dados clínicos | ambíguo | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `NOT_ANALYZED` (ownership `PENDING PRODUCT DECISION`) |
| `fetuses[n].vitality.heartRate` | BCF | Vitalidade | Fetus | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` + `PENDING HANDOFF IMPORT` (faixa) / `NOT_ANALYZED` |
| `fetuses[n].vitality.bodyMovements` | Movimentos corporais | Vitalidade | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].vitality.swallowing` | Deglutição | Vitalidade | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].lie` | Situação (longitudinal, transversa) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].presentation` | Apresentação (cefálica, pélvica, córmica) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].spinePosition` | Dorso (direita, esquerda) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].cephalicPolePosition` | Polo cefálico (direita, esquerda) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `maternal.uterineArtery.right.pi` | PI artéria uterina direita | Doppler | Exam (materno) | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` (percentis) / `NOT_ANALYZED` |
| `maternal.uterineArtery.left.pi` | PI artéria uterina esquerda | Doppler | Exam (materno) | idem |
| `maternal.uterineArtery.mean.pi` | PI médio | Doppler | derivado | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` (média aritmética) / `READY_FOR_IMPLEMENTATION` (cálculo) |
| `maternal.uterineArtery.right.notch` | Incisura direita | Doppler | Exam (materno) | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `maternal.uterineArtery.left.notch` | Incisura esquerda | Doppler | Exam (materno) | idem |
| `fetuses[n].doppler.umbilicalArtery.pi` | PI artéria umbilical | Doppler | Fetus | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].doppler.mca.pi` | PI ACM | Doppler | Fetus | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].doppler.ductusVenosus` | Ducto venoso | Doppler | Fetus | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].doppler.cpr` | RCP | Doppler | derivado (Fetus) | `CLINICALLY_APPROVED` (fórmula) / `SOURCE_VALIDATION_PENDING` (classificação por IG) / `NOT_ANALYZED` |
| `fetuses[n].biometry.bpd` | DBP | Biometria | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` (medida) / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].biometry.hc` | CC | Biometria | Fetus | idem |
| `fetuses[n].biometry.ac` | CA | Biometria | Fetus | idem |
| `fetuses[n].biometry.fl` | CF | Biometria | Fetus | idem |
| `fetuses[n].biometry.efw` | PFE | Biometria | derivado (Fetus) | `CLINICALLY_APPROVED` (conceito Hadlock) / `SOURCE_VALIDATION_PENDING` (fórmula/versão) / `NOT_ANALYZED` |
| `fetuses[n].biometry.efwPercentile` | Percentil de peso | Biometria | derivado (Fetus) | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` (tabela) / `NOT_ANALYZED` |
| `fetuses[n].biometry.estimatedGestationalAge` | IG estimada geral pela biometria | Biometria | derivado (Fetus) | `CLINICALLY_APPROVED` (exibir só a geral) / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].growth.classification` | Crescimento (abaixo, adequado, acima) | Biometria | derivado (Fetus) | `CLINICALLY_APPROVED` (as três classes) / `SOURCE_VALIDATION_PENDING` + `PENDING HANDOFF IMPORT` (thresholds) / `NOT_ANALYZED` |
| `placenta.*` | Placenta (localização, aspecto) | Placenta | Exam | `CLINICALLY_APPROVED` (seção) / `SOURCE_NOT_REQUIRED` / `PENDING CLINICAL DISCOVERY` (campos) |
| `amnioticFluid.mbv` | MBV | Líquido amniótico | Exam | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` + `PENDING HANDOFF IMPORT` / `NOT_ANALYZED` |
| `amnioticFluid.afi` | ILA | Líquido amniótico | Exam | idem |

Campos não listados: `PENDING CLINICAL DISCOVERY`. Não preencher por dedução de engenharia.

### Semântica de ausência

Vale para todos os campos deste catálogo: **campo não marcado ≠ achado ausente**. Ver [`o princípio no protocolo`](../protocols/OBSTETRIC_DOPPLER_V0_1.md#7-princípio-não-marcado--ausente). Nenhum campo vazio pode gerar frase negativa automática.
