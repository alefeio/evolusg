# Escopo do MVP

Status do recorte MVP 1: **PENDING CLINICAL DISCOVERY**

Nenhum tipo de exame obstétrico está escolhido. A Sprint 0 existe para decidir isso com a Dra. Karen.

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
| Protocolo versionado do fluxo escolhido | Definido na Sprint 0 |
| Formulário dinâmico desse fluxo | Condicionais do recorte |
| Texto gerado + revisão | Catálogo padrão; override pessoal persistente pode ficar para depois do MVP 1 |
| Ciclo do laudo | Máquina candidata ADR-012 (`PENDING CLINICAL DISCOVERY` no fluxo real) |
| Documento emitido imutável | PDF e DOCX + hash (`PROPOSED`) |
| Retificação | Hipótese ADR-009; **não** requisito clínico validado. Pode ficar fora do MVP 1 (`PENDING PRODUCT DECISION`) |

## O que o MVP 1 não inclui

- todos os tipos obstétricos
- Patient Advanced (merge, anti-duplicidade sofisticada, filtros ricos)
- linha do tempo
- construtor visual de protocolos
- IA / ditado
- Doppler, gemelares, biometria avançada — **salvo se a Sprint 0 provar que isso é o fluxo mais frequente** (não presumir)

Hipóteses frequentes (morfológico, obstétrico de rotina, 1º trimestre, etc.) permanecem **PENDING CLINICAL DISCOVERY**. Não selecionar candidato a MVP 1 neste documento.

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

## Gate para congelar este documento

- resposta da Dra. Karen: qual exame primeiro
- campos mínimos desse exame
-  exemplos anonimizados suficientes para fixtures
- ADRs 008, 009 e 012 revisados com o recorte (ainda `PROPOSED` até aprovação)
