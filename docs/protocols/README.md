# Protocolos versionados

Pasta para definições de protocolo (Nível 1: artefato versionado, não construtor visual).

Nesta fase o conteúdo é **documental**: baseline clínico do protocolo, sem artefato executável e sem schema físico.

| Protocolo | Documento | Estado |
|---|---|---|
| Ultrassonografia Obstétrica com Doppler | [`OBSTETRIC_DOPPLER_V0_1.md`](OBSTETRIC_DOPPLER_V0_1.md) | baseline v0.1 — primeira vertical slice `SINGLETON ONLY` |

Regras da pasta:

- não colocar regras clínicas inventadas;
- não duplicar catálogos de campos, frases ou cálculos — referenciar `../clinical-discovery/`;
- o que vive aqui é o que pertence ao protocolo: ordem das seções, composição, dependências e condições.
