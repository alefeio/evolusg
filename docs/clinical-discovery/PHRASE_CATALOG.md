# Catálogo de frases

Status: **PENDING CLINICAL DISCOVERY**

A frase pessoal **nunca** altera o dado clínico. O mesmo código pode gerar textos diferentes.

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

## Índice

| Phrase Key | Conceito | Status |
|---|---|---|
| — | — | (vazio até a Onda 3) |
