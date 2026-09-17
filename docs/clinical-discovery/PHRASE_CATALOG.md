# Catálogo de frases

Status: **chaves da rodada 1 registradas; textos literais `PENDING HANDOFF IMPORT`.**

A frase pessoal **nunca** altera o dado clínico. O mesmo código pode gerar textos diferentes.

Hierarquia conceitual futura (apenas registrada, não implementada):

```text
Protocol Phrase → Organization Phrase → Professional Phrase → Manual Edit
```

Override pessoal continua `PENDING PRODUCT DECISION` (ADR-007; estratégias A/B/C em aberto).

Identidade proposta (ADR-007, `PROPOSED`): `phraseKey` semântica estável (ex. conceitual `obstetrics.fetus.presentation`) + regra versionada no protocolo.

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

`IMPLEMENTED` só fará sentido após existir motor. Nesta Sprint 0 o máximo é `DISCOVERED` ou `CLINICALLY_APPROVED`.

## Registro

```md
### [phraseKey] — PENDING

- Conceito clínico associado:
- Frase padrão evolUSG:
- Frase pessoal da Dra. Karen:
- Placeholders:
- Condições:
- Exemplo:
- Status: DISCOVERED
- Evidência:
```

## Índice — Obstétrica com Doppler v0.1

As chaves e condições abaixo vêm da rodada 1. O **texto literal aprovado** ainda não foi transcrito: `PENDING HANDOFF IMPORT`. Nenhum texto foi redigido pela engenharia.

| Phrase Key | Conceito | Condição de entrada | Texto |
|---|---|---|---|
| `protocol.technique` | Técnica do exame | sempre; pertence à `ProtocolVersion` | **conhecido**: "Exame realizado com transdutor convexo multifrequencial." |
| `fetus.vitality.heartRate` | BCF | valor informado | `PENDING HANDOFF IMPORT` |
| `fetus.vitality.bodyMovements` | Movimentos corporais | somente se marcado presente | `PENDING HANDOFF IMPORT` |
| `fetus.vitality.swallowing` | Deglutição | somente se marcado presente | `PENDING HANDOFF IMPORT` |
| `fetus.position.longitudinal` | Situação longitudinal + dorso | situação = longitudinal | `PENDING HANDOFF IMPORT` |
| `fetus.position.transverse` | Situação transversa + polo cefálico | situação = transversa | `PENDING HANDOFF IMPORT` |
| `maternal.uterineArtery.normal` | Uterinas sem alteração | média e lados dentro da referência | `PENDING HANDOFF IMPORT` |
| `maternal.uterineArtery.sideAltered` | Lado individual `> P95` | qualquer lado `> P95`, inclusive com média normal | `PENDING HANDOFF IMPORT` |
| `maternal.uterineArtery.meanAltered` | Média `> P95` | PI médio `> P95` | `PENDING HANDOFF IMPORT` |
| `maternal.uterineArtery.notchUnilateral` | Incisura unilateral | incisura em um lado | `PENDING HANDOFF IMPORT` |
| `maternal.uterineArtery.notchBilateral` | Incisura bilateral | incisura nos dois lados | `PENDING HANDOFF IMPORT` |
| `fetus.doppler.umbilicalArtery` | Umbilical | valor informado | `PENDING HANDOFF IMPORT` |
| `fetus.doppler.mca` | ACM | valor informado | `PENDING HANDOFF IMPORT` |
| `fetus.doppler.ductusVenosus` | Ducto venoso | valor informado | `PENDING HANDOFF IMPORT` |
| `fetus.doppler.cpr` | RCP | umbilical e ACM informados | `PENDING HANDOFF IMPORT` |
| `fetus.biometry.summary` | Biometria + IG geral | biometria informada | `PENDING HANDOFF IMPORT` |
| `fetus.growth.below` `fetus.growth.adequate` `fetus.growth.above` | Crescimento | classificação disponível | `PENDING HANDOFF IMPORT` |
| `placenta.description` | Placenta | seção preenchida | `PENDING HANDOFF IMPORT` |
| `amnioticFluid.description` | Líquido amniótico | valor informado | `PENDING HANDOFF IMPORT` |
| `conclusion.*` | Contribuições de conclusão | ver estrutura da conclusão no protocolo | `PENDING HANDOFF IMPORT` |

Regra de composição: chave sem dado de entrada **não** gera frase, e ausência **não** gera negativa (ver princípio "não marcado ≠ ausente"). Exceção conhecida: `protocol.technique`, que não depende de campo.

Frases cuja classificação depende de referência ainda não validada podem existir como chave, mas **não** podem ser emitidas com classificação automática antes de `SOURCE_VALIDATED`.
