# Visão de arquitetura

Status: **PROPOSED** (ADR-001). Não implementar nesta fase.

## Intenção

Monólito modular, um deploy, um banco, módulos com fronteira explícita.

**Generalizar a arquitetura, especializar a implementação.** O núcleo não contém obstetrícia; o primeiro protocolo sim.

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

**Protocolo obstétrico:** campos, opções, visibilidade, frases, cálculos aprovados.

**Proibido:** `if (obstetric)` no motor; frases no JSX; colunas `apresentacao` no núcleo.

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
