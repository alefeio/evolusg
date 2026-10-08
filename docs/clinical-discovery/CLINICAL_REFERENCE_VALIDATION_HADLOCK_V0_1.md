# Pacote de validação — referências Hadlock v0.1

Fundação documental. Não implementa cálculo, não cria fixture numérica e não libera uso clínico.

Princípio: [ADR-014](../adr/ADR-014-referencias-clinicas-versionadas.md). Catálogos: [`CALCULATION_CATALOG.md`](CALCULATION_CATALOG.md), [`CLINICAL_FIELD_CATALOG.md`](CLINICAL_FIELD_CATALOG.md), [`REFERENCE_VALIDATION_BACKLOG.md`](REFERENCE_VALIDATION_BACKLOG.md).

Nenhum item abaixo está `READY_FOR_IMPLEMENTATION`, `IMPLEMENTED_NOT_CLINICALLY_RELEASED` ou `CLINICALLY_RELEASED`. Nenhum `@n` está ativo.

## Preferência clínica registrada

Família Hadlock. A Dra. Karen quer comportamento compatível com o GE Voluson como referência prática. DBP, CC, CA e CF são as medidas capturadas e desejadas. Isso nomeia a candidata de peso; não confirma a variante gravada no aparelho e não aprova coeficientes.

## Dispositivo de compatibilidade

| Afirmação | Estado |
|---|---|
| `REFERENCE DEVICE = GE VOLUSON E6` | dispositivo identificado |
| Configuração de PFE confirmada | não |
| `GE_VOLUSON_E6_EFW_CONFIGURATION` | `PENDING DEVICE CONFIRMATION` |

O Voluson é `REFERENCE DEVICE / PRACTICAL COMPATIBILITY TARGET`. Não substitui a publicação científica. O aparelho pode oferecer mais de uma variante Hadlock. Não assumir que GE Voluson E6 significa automaticamente DBP + CC + CA + CF.

Duas perguntas futuras, ambas rastreáveis:

1. O cálculo está correto segundo a referência científica?
2. O resultado é compatível com o comportamento esperado do dispositivo da Dra. Karen?

## Candidatas

### `EFW_HADLOCK_1985_BPD_HC_AC_FL` — peso fetal estimado

| Atributo | Valor nesta fundação |
|---|---|
| Finalidade | Calcular o PFE a partir de biometria |
| Família | Hadlock |
| Entradas desejadas | BPD / DBP, HC / CC, AC / CA, FL / CF |
| Saída | PFE em gramas |
| Status | `DEVICE_MATCH_PENDING` |
| Implementação | não implementado; não `ACTIVE` |
| Cálculo dependente | `fetus.efw.hadlock` |

A candidata existe porque a família, o ano frequentemente associado à fórmula de quatro medidas e as entradas capturadas estão nomeados. A fórmula não está aprovada. Falta confirmar a variante no Voluson E6, a publicação primária, os coeficientes, as unidades, a política de arredondamento e as fixtures.

Sequência conceitual, ainda sem motor:

```text
biometria capturada → PFE
```

### `EFW_GROWTH_HADLOCK_1991` — percentil do PFE

Entrada distinta da fórmula de peso. Não reutilizar o identificador do PFE.

| Atributo | Valor nesta fundação |
|---|---|
| Finalidade | Comparar o PFE com uma referência de crescimento por idade gestacional e obter o percentil do peso |
| Status | `METHOD_DEFINITION_PENDING` |
| Implementação | não implementado; não `ACTIVE` |
| Cálculo dependente | `fetus.efwPercentile` |
| Depende de | `EFW_HADLOCK_1985_BPD_HC_AC_FL` para o peso; política de idade gestacional ainda aberta |

A família Hadlock está identificada. Ainda faltam: método de percentil contínuo, equação ou tabela, tratamento de semana + dia, interpolação e concordância com o Voluson.

```text
biometria → PFE → comparação do PFE com a referência por idade gestacional → percentil do PFE
```

### `AC_GROWTH_HADLOCK_1984` — percentil da CA

| Atributo | Valor nesta fundação |
|---|---|
| Finalidade | Derivar o percentil da circunferência abdominal |
| Entrada clínica | CA medida |
| Saída | percentil da CA |
| Status | `SOURCE_VALIDATION_PENDING` |
| Implementação | não implementado; não `ACTIVE` |
| Cálculo dependente | `fetus.acPercentile` |

A CA medida é captura. O percentil da CA é derivado e é diferente do percentil do PFE. A Dra. Karen confirmou que os dois percentis são essenciais. A publicação, a equação ou tabela, o desvio-padrão quando aplicável, a política de semana + dia e as fixtures ainda não estão validados.

## Semanas + dias

`GESTATIONAL_AGE_DAY_LEVEL_POLICY = REFERENCE_DEFINED`.

Cada referência acima declara a própria política quando o método fechar. Opções: `CONTINUOUS_EQUATION`, `DISCRETE_WEEK_LOOKUP`, `INTERPOLATED_TABLE`, `REFERENCE_DEFINED_OTHER`. Nesta v0.1 as três candidatas estão com política **não declarada**. `decimalWeeks = weeks + days / 7` não se aplica a elas até que a referência congele `CONTINUOUS_EQUATION`.

## O que este pacote não contém

- Coeficientes, tabelas ou exemplos numéricos tratados como verdade clínica.
- Imagens ou transcrições de exames reais enviados na investigação. Esse material não entra no repositório, não vira fixture e não identifica paciente.
- Migration, schema, API, formulário ou teste executável.
