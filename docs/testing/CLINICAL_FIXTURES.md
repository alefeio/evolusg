# Fixtures clínicas

Casos **anonimizados** para golden tests futuros. Não copiar nome, prontuário, telefone, fotos ou qualquer identificador.

Nesta Sprint 0 apenas catalogar. Não implementar testes.

## Identificadores

Padrão: `{AREA}-{RECORTE}-{TIPO}-{NNN}`

Exemplo de forma (o recorte é PENDING): `OB-CORE-NORMAL-001`

Tipos: `NORMAL` | `ALTERADO` | `GEMELAR` | `DOPPLER` | `COMPLEXO` | `OUTRO`

## Ficha

```md
### ID: OB-CORE-NORMAL-001

- Tipo: normal
- Protocol candidate: PENDING CLINICAL DISCOVERY
- Origem do material: (template / laudo reescrito / outro) — anonimizado
- Input (findings): pending
- Expected narrative: pending
- Clinical approval: pending
- Notas:
```

## Índice

| ID | Tipo | Protocol candidate | Aprovação |
|---|---|---|---|
| OB-CORE-NORMAL-001 | normal | pending | pending |

A linha de exemplo acima é **reserva de ID**, não um caso clínico preenchido.
