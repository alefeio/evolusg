# Fixtures clínicas

Casos **anonimizados** para golden tests futuros. Não copiar nome, prontuário, telefone, fotos ou qualquer identificador.

Nesta fase apenas catalogar. Não implementar testes.

## Duas categorias — não são equivalentes

### `STRUCTURAL FIXTURE`

Pode existir **mesmo com fonte clínica pendente**. Exercita forma, não interpretação:

- formato e presença de campos;
- repeating groups futuros (escopo fetal);
- escopo materno vs fetal vs global;
- composição e ordem das seções;
- semântica de presença/ausência ("não marcado ≠ ausente").

### `CLINICAL EXPECTED-OUTPUT FIXTURE`

Só pode ficar **ativo** quando as referências necessárias estiverem `SOURCE_VALIDATED` (ver [`../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md`](../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md)).

Enquanto isso, o campo de saída clínica fica marcado:

```text
EXPECTED_CLASSIFICATION = PENDING_REFERENCE
```

Proibido inventar número, percentil, classificação ou texto de conclusão para "completar" o fixture.

## Identificadores

Padrão: `{AREA}-{PROTOCOLO}-{RECORTE}-{CENÁRIO}-{NNN}`

Área `OB`; protocolo `DOPPLER`; recorte `SINGLE` (gestação única), `TWIN`, `TRIPLET`.

## Ficha

```md
### ID: OB-DOPPLER-SINGLE-NORMAL-001

- Categoria: STRUCTURAL | CLINICAL EXPECTED-OUTPUT
- Protocolo: Obstétrica com Doppler v0.1
- Recorte: gestação única
- Origem do material: (template / laudo reescrito / cenário construído) — anonimizado
- Input (findings estruturados): pending
- Expected structure: pending
- Expected classification: PENDING_REFERENCE
- Expected narrative: PENDING_REFERENCE
- Clinical approval: pending
- Notas:
```

## Índice — primeira vertical slice (gestação única)

Todos abaixo são catalogáveis agora como `STRUCTURAL`; a camada de saída clínica permanece `PENDING_REFERENCE`.

Estrutura mínima que todo fixture singleton deve poder carregar:

- `PregnancyEpisode` mínimo (DUM, G/P/A, data 1ª USG, IG 1ª USG);
- `ExamClinicalContext` com comorbidades snapshot e medicações contínuas snapshot;
- placenta (localização + grau);
- escopo fetal único.

| ID | Cenário | Estrutural | Saída clínica |
|---|---|---|---|
| `OB-DOPPLER-SINGLE-NORMAL-001` | exame sem alterações (inclui episódio + snapshots + placenta) | catalogável | `PENDING_REFERENCE` |
| `OB-DOPPLER-SINGLE-GROWTH-LOW-001` | crescimento abaixo | catalogável | `PENDING_REFERENCE` (percentis) |
| `OB-DOPPLER-SINGLE-UMBILICAL-HIGH-001` | umbilical elevada | catalogável | `PENDING_REFERENCE` |
| `OB-DOPPLER-SINGLE-MCA-LOW-001` | ACM reduzida | catalogável | `PENDING_REFERENCE` |
| `OB-DOPPLER-SINGLE-DV-LOW-001` | ducto venoso alterado | catalogável | `PENDING_REFERENCE` |
| `OB-DOPPLER-SINGLE-RCP-LOW-001` | RCP reduzida | catalogável (fórmula) | `PENDING_REFERENCE` (classificação por IG) |
| `OB-DOPPLER-UTERINE-NOTCH-001` | incisura uterina (uni e bilateral) | catalogável | `PENDING_REFERENCE` (P95) |

Cenários estruturais adicionais (sem dependência de fonte para a forma):

| ID | O que exercita |
|---|---|
| `OB-DOPPLER-SINGLE-POSITION-TRANSVERSE-001` | situação transversa → apresentação córmica, dorso oculto, polo cefálico exibido |
| `OB-DOPPLER-SINGLE-ABSENCE-SEMANTICS-001` | movimentos/deglutição não marcados → nenhuma frase, nenhuma negativa automática |
| `OB-DOPPLER-SINGLE-UTERINE-SIDE-ONLY-001` | lado individual alterado com média normal → estrutura da contribuição (sem P95 de produção) |
| `OB-DOPPLER-SINGLE-EPISODE-CONTEXT-001` | PregnancyEpisode mínimo + comorbidades/medicações snapshot + placenta conhecida |

## Índice — stress tests arquiteturais (fora da primeira slice)

`DOCUMENTED FOR FUTURE IMPLEMENTATION`. Servem para verificar que a modelagem não impede múltiplos; **não** fazem parte da primeira vertical slice executável.

| ID | Cenário |
|---|---|
| `OB-DOPPLER-TWIN-NORMAL-001` | gemelar sem alterações — repeating group de fetos |
| `OB-DOPPLER-TWIN-SFGR-001` | gemelar com sFGR — escopo fetal + discordância |
| `OB-DOPPLER-TRIPLET-DISCORDANCE-001` | trigemelar com discordância — N fetos e identificação estável |
