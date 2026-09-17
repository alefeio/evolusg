# Escopo do MVP

Status do recorte MVP 1: **DEFINIDO na rodada 1 de Clinical Discovery**

| | Antes | Depois da reconciliação v0.1 |
|---|---|---|
| Recorte | `PENDING CLINICAL DISCOVERY` | Ultrassonografia obstétrica com Doppler |
| Amplitude | indefinida | `SINGLETON ONLY` — gestação única |
| Doppler no MVP | explicitamente fora, "salvo se a discovery provar que é a rotina" | **dentro** — é o exame de alta frequência dela |
| Múltiplos | indefinido | fora; `DOCUMENTED FOR FUTURE IMPLEMENTATION` |
| Campos mínimos | `PENDING CLINICAL DISCOVERY` | catalogados em [`../clinical-discovery/CLINICAL_FIELD_CATALOG.md`](../clinical-discovery/CLINICAL_FIELD_CATALOG.md) |
| Classificações automáticas | não discutido | bloqueadas por [`referências pendentes`](../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md) |

Protocolo: [`../protocols/OBSTETRIC_DOPPLER_V0_1.md`](../protocols/OBSTETRIC_DOPPLER_V0_1.md).

Fluxo do MVP 1:

```text
Paciente → contexto gestacional mínimo → novo exame → Obstétrica com Doppler
  → gestação única → preenchimento estruturado → cálculos/regras permitidos
    → geração textual → revisão → documento/laudo
```

"Cálculos/regras permitidos" significa: só o que estiver `CLINICALLY_APPROVED` **e** com fonte suficiente. Estrutura pode ser construída antes da fonte; classificação clínica automática não.

## Definição de MVP 1 (critério de verdade)

A Dra. Karen consegue, no evolUSG:

1. identificar ou cadastrar a paciente (núcleo mínimo);
2. registrar o exame obstétrico do recorte escolhido;
3. gerar o texto do laudo a partir de dados estruturados;
4. revisar o texto;
5. emitir PDF e DOCX com identidade profissional.

MVP **não** é protótipo visual.

## O que o MVP 1 deve incluir (capacidade, não protocolo)

| Capacidade | Notas |
|---|---|
| Autenticação de `User` | Conta web, sessão |
| `ProfessionalProfile` mínimo | Nome profissional, CRM/UF o suficiente para o documento |
| Paciente Core | Cadastro mínimo + busca simples + `Exam → Patient` |
| Protocolo versionado do fluxo escolhido | Obstétrica com Doppler v0.1, gestação única |
| `PregnancyEpisode` mínimo | contexto gestacional para não misturar gestações; granularidade `PENDING PRODUCT DECISION` |
| Formulário dinâmico desse fluxo | Condicionais do recorte |
| Texto gerado + revisão | Catálogo padrão; override pessoal persistente pode ficar para depois do MVP 1 |
| Ciclo do laudo | Máquina candidata ADR-012 (`PENDING CLINICAL DISCOVERY` no fluxo real) |
| Documento emitido imutável | PDF e DOCX + hash (`PROPOSED`) |
| Retificação | Hipótese ADR-009; **não** requisito clínico validado. Pode ficar fora do MVP 1 (`PENDING PRODUCT DECISION`) |

## O que o MVP 1 não inclui

- outros tipos obstétricos (morfológico, 1º trimestre, colo, etc.) — permanecem `PENDING CLINICAL DISCOVERY`
- gemelares, trigemelares, corionicidade, discordância, sFGR — `DOCUMENTED FOR FUTURE IMPLEMENTATION`
- Patient Advanced (merge, anti-duplicidade sofisticada, filtros ricos)
- linha do tempo e matching longitudinal automático
- compartilhamento entre profissionais/organizações
- construtor visual de protocolos
- IA / ditado / LLM em qualquer ponto do motor clínico
- DICOM, PACS, portal do paciente, QR Code
- classificação clínica automática que dependa de referência ainda não validada

## Paciente Core vs Patient Advanced

| Paciente Core (antes ou no primeiro fluxo obstétrico; bloqueia MVP 1) | Patient Advanced (depois do MVP 1) |
|---|---|
| Cadastro mínimo | Busca otimizada |
| Associação obrigatória `Exam → Patient` | Anti-duplicidade |
| Busca simples (nome + identificador a confirmar) | Merge manual |
| | Histórico e filtros |

Campos mínimos do cadastro: **PENDING CLINICAL DISCOVERY**.

## Releases (diferenciação)

| Release | O que diferencia |
|---|---|
| Protótipo | Não é meta de produto. Demos internas não contam como MVP. |
| **MVP 1 obstétrico** | Um fluxo real + paciente core + emissão. |
| **MVP 2 obstétrico** | Cobertura ampliada da rotina semanal; histórico; Patient Advanced inicia aqui ou na sprint de histórico. |
| **Beta obstétrico** | Uso real controlado + hardening + métricas. |
| **V1 obstétrica** | Rotina congelada do recorte V1 sem depender do Turing nesse recorte. |
| **Spike multiprotocolo** | Um exame estruturalmente diferente, só para testar o motor. |
| **V1 multiprotocolo** | Fora deste ciclo. |

## Capacidades comerciais futuras (não implementadas)

O evolUSG será um produto **pago** para médicos.

**Assinaturas** — períodos previstos: mensal, trimestral, semestral, anual. Combinação definitiva de períodos, preços e regras: `PENDING PRODUCT/BUSINESS DECISION`. Não implementar `Subscription` / `Plan` / `Payment` agora.

**Programa de indicação** — `PROPOSED FUTURE CAPABILITY`: um usuário/médico poderá indicar outro médico e receber uma porcentagem sobre a assinatura do indicado. Percentual, duração, recorrência, atribuição, estorno, tributação, antifraude e correlatos **não** estão definidos. Não implementar `Referral` / `Commission` / códigos agora.

**Administração** — haverá funções administrativas no futuro. Escopo exato indefinido. Não implementar admin/RBAC nesta fundação.

**Exclusão de conta:** `PENDING PRODUCT/LEGAL/ARCHITECTURAL DECISION` (retenção, documentos, billing).

## Gate para congelar este documento

| Item | Estado |
|---|---|
| Resposta da Dra. Karen: qual exame primeiro | **atendido** — Obstétrica com Doppler |
| Campos mínimos desse exame | **atendido em estrutura**; detalhes de placenta e dados clínicos em aberto |
| Exemplos anonimizados suficientes para fixtures | parcial — fixtures estruturais catalogadas; expected output clínico pendente de referência |
| ADRs 008, 009 e 012 revisados com o recorte | **atendido** — ver [`impacto da reconciliação`](../adr/README.md#impacto-da-reconciliação-clinical-discovery-v01); seguem `PROPOSED` |
| Referências clínicas validadas | **não atendido** — [`backlog`](../clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md) |

O recorte está congelado. O **conteúdo interpretativo** (classificações, thresholds, conclusão automática) não pode ser congelado antes das referências.
