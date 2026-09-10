# Catálogo de campos clínicos

Status: **PENDING CLINICAL DISCOVERY** — nenhuma linha clínica preenchida sem evidência.

Quando um trecho de laudo chegar, decompor em campos. Não armazenar o trecho como se fosse o dado.

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
| Status de aprovação | `DISCOVERED` \| `CLINICALLY_APPROVED` \| `REJECTED` |
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

## Índice

| Field Key | Nome clínico | Seção | Status |
|---|---|---|---|
| — | — | — | (vazio até a Onda 2) |
