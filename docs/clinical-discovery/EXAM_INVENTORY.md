# Inventário de exames obstétricos

Status: **primeiro recorte decidido na rodada 1.** O inventário completo dos demais tipos permanece `PENDING CLINICAL DISCOVERY`.

Preencher **somente** com nomes e frequências ditos pela Dra. Karen. Não importar uma lista-padrão de internet.

## Como usar

Uma linha por tipo de exame **como ela chama**. Frequência: `alta` | `média` | `baixa` | `rara` | `desconhecida`.

| ID | Nome usado pela Dra. Karen | Frequência | Candidato a MVP 1? | Entra no mesmo protocolo ou é outro? | Notas | Fonte |
|---|---|---|---|---|---|---|
| EX-01 | Ultrassonografia obstétrica com Doppler | alta | **sim — escolhido** | protocolo próprio: [`OBSTETRIC_DOPPLER_V0_1.md`](../protocols/OBSTETRIC_DOPPLER_V0_1.md) | primeira vertical slice restrita a gestação única | rodada 1 de discovery |

## Perguntas em aberto

- Qual é o exame do dia a dia?
- Morfológico, 1º trimestre, vitalidade, Doppler e colo são protocolos separados ou seções de um mesmo exame?
- Há exames obstétricos que ela **não** quer no evolUSG no primeiro ano?

`PENDING CLINICAL DISCOVERY`

## Decisão de MVP 1

| Campo | Valor |
|---|---|
| Exame escolhido | Ultrassonografia obstétrica com Doppler |
| Recorte da primeira vertical slice | gestação única (`SINGLETON ONLY`) |
| Quem escolheu | Dra. Karen |
| Data | rodada 1 de Clinical Discovery |
| Motivo | alta frequência na rotina; permite validação frequente; riqueza suficiente para exercitar o produto de ponta a ponta |
| Múltiplos (gemelar, trigemelar) | `DOCUMENTED FOR FUTURE IMPLEMENTATION` — fora da primeira slice |
