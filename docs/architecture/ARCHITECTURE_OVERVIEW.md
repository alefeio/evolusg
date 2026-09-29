# Visão de arquitetura

Status: **PROPOSED** (ADR-001). Não implementar nesta fase.

## Intenção

Monólito modular, um deploy, um banco, módulos com fronteira explícita.

**Generalizar a arquitetura, especializar a implementação.** O núcleo não contém obstetrícia; o primeiro protocolo sim.

### Formulação corrigida (reconciliação v0.1)

| Afirmação | Estado |
|---|---|
| `PRODUCT INTENT = MULTIPROTOCOL` | `KNOWN` |
| `FIRST PRODUCT CYCLE = OBSTETRIC-FIRST` | `KNOWN` |
| `ARCHITECTURE = MUST NOT PRECLUDE MULTIPROTOCOL` | `KNOWN` |
| `GENERIC ENGINE FOR ALL ULTRASOUND` | **não** é requisito imediato |

O objetivo não é provar que a arquitetura suporta toda a ultrassonografia. É implementar o primeiro protocolo em profundidade sem criar decisões que impeçam expansão depois. A abstração deve surgir de necessidade concreta.

Pergunta de controle a cada decisão da primeira vertical slice: *existe aqui alguma decisão que claramente impediria adicionar outro protocolo depois?* Se sim, ajustar. Se não, **não** criar abstração adicional.

## Camadas (alvo)

1. **Web clínica** — formulário dinâmico, revisão, emissão. Zero regra clínica hardcoded.
2. **API da aplicação** — no mesmo monólito. Orquestra auth, autorização, auditoria.
3. **Domínio** — `identity`, `professional-profile`, `patients`, `exams`, `reports`, `protocol-engine`, `form-runtime`, `text-engine`, `documents`, `audit`.
4. **Persistência** — relacional + JSONB para findings e snapshots de protocolo.
5. **Object storage** — documentos emitidos, não só disco local.
6. **Observabilidade** — log técnico distinto de auditoria clínica.

Stack candidata (familiaridade vs adequação, ainda `PROPOSED`): Next.js + TypeScript + PostgreSQL, Auth.js, Docker. NestJS e microserviços **não** no ciclo 1.

Motores de protocolo, regra, cálculo e texto: TypeScript puro, testável sem React.

## Limite núcleo vs obstetrícia

**Núcleo (candidato, mínimo):** definição versionável de exame, Finding estruturado, form/texto **do recorte**, Patient, User, ProfessionalProfile, documento emitido imutável.

`RepeatingGroup`, `phraseKey`, ExamType genérico e ReportVersion são **propostas** — incluir só se o recorte validado exigir. Não construir o núcleo para dezenas de exames nas Sprints 3–5.

**Protocolo obstétrico:** campos, opções, visibilidade, frases, cálculos aprovados. Baseline: [`../protocols/OBSTETRIC_DOPPLER_V0_1.md`](../protocols/OBSTETRIC_DOPPLER_V0_1.md).

**Proibido:** `if (obstetric)` no motor; frases no JSX; colunas `apresentacao` no núcleo.

### Três pontos que a primeira slice não pode travar

Derivados da discovery de múltiplos e de referências (ver protocolo, seções 10 e 16):

1. **escopo repetível** — findings, frases e contribuições de conclusão precisam suportar N fetos depois, mesmo que hoje seja sempre um;
2. **referência versionada** — classificação clínica precisa apontar para tabela + versão; ver ADR-014;
3. **conclusão com escopo** — contribuições precisam carregar escopo materno / fetal / global desde o início.

Nenhum dos três exige engine genérico agora. Todos os três exigem não fechar a porta.

## Motores (resumo)

| Motor | Comportamento | ADR |
|---|---|---|
| Protocolos | Schema versionado; publish imutável | 002, 003 |
| Regras | Operadores restritos; sem `eval`; ordem fixa | 004 |
| Formulários | UI = schema + findings + visibilidade | — |
| Texto | Fragmentos determinísticos; IA fora | 006, 007 |

Cálculos: whitelist de funções + dados no protocolo. Nenhum cálculo sem catálogo aprovado.

## Segurança

Baseline em [`../security/SECURITY_BASELINE.md`](../security/SECURITY_BASELINE.md). Segurança desde a fundação; hardening antes do piloto. Residência: ADR-011.

## O que esta visão recusa agora

Microserviços, construtor visual, FHIR completo, IA no pipeline do laudo, app nativo, overengineering de dezenas de exames.
