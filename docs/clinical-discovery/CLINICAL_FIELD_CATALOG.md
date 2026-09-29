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

### Ownership V1 — decisões fechadas (primeira vertical slice)

`PREGNANCY_EPISODE_MINIMUM_V1 = APPROVED FOR SPRINT_2 MODELING`

Não criar schema físico. Ver detalhe em [`../architecture/DOMAIN_MODEL.md`](../architecture/DOMAIN_MODEL.md).

| Dado | Nível V1 | Justificativa | Estado |
|---|---|---|---|
| DUM (informativa) | `PregnancyEpisode` | âncora de datação da gestação | `APPROVED FOR SPRINT_2 MODELING` |
| G / P / A | `PregnancyEpisode` (snapshot obstétrico) | snapshot do episódio; **não** significa imutável na vida da paciente; histórico obstétrico longitudinal = futuro | `APPROVED FOR SPRINT_2 MODELING` |
| Data da 1ª USG de datação | `PregnancyEpisode` | âncora de datação | `APPROVED FOR SPRINT_2 MODELING` |
| IG na 1ª USG (semanas + dias) | `PregnancyEpisode` | âncora de datação | `APPROVED FOR SPRINT_2 MODELING` |
| IG corrigida atual | **derivada** (episódio + data do exame) | não duplicar como fonte independente | `APPROVED FOR SPRINT_2 MODELING` (conceito); cálculo de produção `NOT_ANALYZED` |
| IG estimada pela biometria atual | `Exam` / Fetus (contexto do exame atual) | **não** pertence ao PregnancyEpisode | `APPROVED FOR SPRINT_2 MODELING` (conceito) |
| Comorbidades | `Exam` / ExamClinicalContext (**snapshot**) | `COMORBIDITIES_V1 = EXAM_CONTEXT_SNAPSHOT`; longitudinal Patient = futuro | `APPROVED FOR SPRINT_2 MODELING` |
| Medicações de uso contínuo | `Exam` / ExamClinicalContext (**snapshot**) | `CONTINUOUS_MEDICATIONS_V1 = EXAM_CONTEXT_SNAPSHOT`; longitudinal Patient = futuro | `APPROVED FOR SPRINT_2 MODELING` |
| Biometria, Doppler fetal, vitalidade, posição | `Fetus` | por feto | `APPROVED FOR SPRINT_2 MODELING` |
| Doppler materno (uterinas), placenta, líquido | `Exam` (materno) | escopo materno do exame | `APPROVED FOR SPRINT_2 MODELING` |
| Frases | artefato `TEXT` do protocolo | `DADO ≠ FRASE` | `KNOWN` |
| Conclusão / revisão textual | `Report` | documento, não campo | `APPROVED FOR SPRINT_2 MODELING` (conceito) |

Futuro (não V1): `PATIENT LONGITUDINAL COMORBIDITY MODEL — FUTURE` · `PATIENT LONGITUDINAL MEDICATION MODEL — FUTURE` · histórico obstétrico G/P/A.

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

| Field Key (conceitual) | Nome clínico | Seção | Ownership V1 | Status |
|---|---|---|---|---|
| `pregnancy.lmp` | DUM (informativa) | Dados clínicos | PregnancyEpisode | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `pregnancy.gravidity` `pregnancy.parity` `pregnancy.abortions` | G / P / A (snapshot) | Dados clínicos | PregnancyEpisode | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `pregnancy.datingUltrasound.date` | Data da 1ª USG de datação | Dados clínicos | PregnancyEpisode | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `pregnancy.datingUltrasound.gestationalAge` | IG na 1ª USG (semanas + dias) | Dados clínicos | PregnancyEpisode | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `exam.correctedGestationalAge` | IG corrigida atual | Dados clínicos | derivado (episódio + data do exame) | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` (política) / `NOT_ANALYZED` |
| `exam.comorbidities` | Comorbidades (snapshot) | Dados clínicos | ExamClinicalContext | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `exam.continuousMedications` | Medicações de uso contínuo (snapshot) | Dados clínicos | ExamClinicalContext | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].vitality.heartRate` | BCF | Vitalidade | Fetus | `CLINICALLY_APPROVED` / faixa 120–160 informada; `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].vitality.bodyMovements` | Movimentos corporais | Vitalidade | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].vitality.swallowing` | Deglutição | Vitalidade | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].lie` | Situação (longitudinal, transversa) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].presentation` | Apresentação (cefálica, pélvica, córmica) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].spinePosition` | Dorso (direita, esquerda) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].cephalicPolePosition` | Polo cefálico (direita, esquerda) | Posição fetal | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `maternal.uterineArtery.right.pi` | IP artéria uterina direita | Doppler | Exam (materno) | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` (percentis) / `NOT_ANALYZED` |
| `maternal.uterineArtery.left.pi` | IP artéria uterina esquerda | Doppler | Exam (materno) | idem |
| `maternal.uterineArtery.mean.pi` | IP médio | Doppler | derivado | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` (média aritmética) / `READY_FOR_IMPLEMENTATION` (cálculo) |
| `maternal.uterineArtery.right.notch` | Incisura direita | Doppler | Exam (materno) | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `maternal.uterineArtery.left.notch` | Incisura esquerda | Doppler | Exam (materno) | idem |
| `fetuses[n].doppler.umbilicalArtery.pi` | IP artéria umbilical | Doppler | Fetus | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].doppler.mca.pi` | IP ACM | Doppler | Fetus | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].doppler.ductusVenosus` | Ducto venoso | Doppler | Fetus | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].doppler.cpr` | RCP | Doppler | derivado (Fetus) | `CLINICALLY_APPROVED` (fórmula) / `SOURCE_VALIDATION_PENDING` (classificação por IG) / `NOT_ANALYZED` |
| `fetuses[n].biometry.bpd` | DBP | Biometria | Fetus | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` (medida) / `READY_FOR_IMPLEMENTATION` |
| `fetuses[n].biometry.hc` | CC | Biometria | Fetus | idem |
| `fetuses[n].biometry.ac` | CA | Biometria | Fetus | idem |
| `fetuses[n].biometry.fl` | CF | Biometria | Fetus | idem |
| `fetuses[n].biometry.efw` | PFE | Biometria | derivado (Fetus) | `CLINICALLY_APPROVED` (conceito Hadlock; margem ±10% versionável) / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].biometry.efwPercentile` | Percentil de peso | Biometria | derivado (Fetus) | `CLINICALLY_APPROVED` / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].biometry.estimatedGestationalAge` | IG estimada geral pela biometria | Biometria | Exam/Fetus (exame atual) | `CLINICALLY_APPROVED` (exibir só a geral) / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `fetuses[n].growth.classification` | Crescimento (&lt;P5 / P5–P90 / &gt;P90) | Biometria | derivado (Fetus) | `CLINICALLY_APPROVED` (thresholds informados) / `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `placenta.location` | Localização (anterior, posterior, fúndica, lateral) | Placenta | Exam | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `placenta.maturityGrade` | Grau de maturidade (I, II, III) | Placenta | Exam | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `amnioticFluid.method` | Método escolhido (MBV \| ILA) — escolha manual | Líquido amniótico | Exam | `CLINICALLY_APPROVED` / `SOURCE_NOT_REQUIRED` / `READY_FOR_IMPLEMENTATION` |
| `amnioticFluid.mbv` | MBV | Líquido amniótico | Exam | `CLINICALLY_APPROVED` / faixas informadas; `SOURCE_VALIDATION_PENDING` / `NOT_ANALYZED` |
| `amnioticFluid.afi` | ILA | Líquido amniótico | Exam | idem |

Campos não listados: `PENDING CLINICAL DISCOVERY`. Não preencher por dedução de engenharia.

### Semântica de ausência

Vale para todos os campos deste catálogo: **campo não marcado ≠ achado ausente**. Ver [`o princípio no protocolo`](../protocols/OBSTETRIC_DOPPLER_V0_1.md#7-princípio-não-marcado--ausente). Nenhum campo vazio pode gerar frase negativa automática.
