# Roadmap — evolUSG

Sprints de **duas semanas** são um **calendário de referência**, não um contrato. Implementação de produto **não** começa nesta Sprint 0.

Numeração **não** foi alterada nesta auditoria. O que muda é o **grau de compromisso**.

## Três horizontes

### Horizonte próximo (concreto o bastante para planejar a semana)

- **Sprint 0** — descoberta e consolidação documental.
- Nada além disso está autorizado como execução de produto.
- Sprints 1–2 só entram no horizonte próximo **depois** dos [critérios de saída da Sprint 0](../clinical-discovery/SPRINT_0.md#sprint-0-exit-criteria). Até lá são *preparação indicativa*.

### Horizonte intermediário (indicativo; sujeito à descoberta)

- **Sprints 1–2** — fundação e identidade (`User` ≠ `ProfessionalProfile`), se a saída da Sprint 0 permitir.
- **Sprints 3–7** — primeiro recorte clínico **validado** orienta a forma **inicial** dos motores, paciente core, obstetrícia do recorte e documentos / MVP 1.

Princípio: **não** construir nas Sprints 3–5 um framework genérico para um domínio ainda não compreendido. O vertical slice do recorte MVP 1 puxa o motor, não o contrário.

Decomposição “3 = protocolos, 4 = form, 5 = texto, 6 = paciente+core, 7 = documentos” é **ordem candidata**, não especialização prematura. Se o recorte for mínimo, estas sprints podem colapsar; se o laudo for mais rico, o motor cresce com evidência.

### Horizonte distante (direção estratégica; sem compromisso de ordem ou escopo)

- **Sprints 8–11** — nomes (biometria, Doppler, gemelar, etc.) são **rótulos provisórios**, não backlog clínico. `PENDING CLINICAL DISCOVERY`.
- **Sprints 12–15** — histórico, frases persistentes, UX, timeline.
- **Sprints 16–19** — hardening, piloto, V1 do recorte que vier a ser congelado.
- **Sprint 20** — spike de **outro tipo de exame**, empírico.

## Três ideias que não são a mesma coisa

| Conceito | O que é | Quando importa |
|---|---|---|
| **Versionar um protocolo** | O mesmo tipo de exame evolui (V1 → V2) sem reescrever emitidos | Preciso antes do primeiro laudo emitido (ADR-003) |
| **Um protocolo ativo versionado** | Modo operacional do ciclo 1: um recorte obstétrico, várias versões no tempo | Ciclo 1 |
| **Arquitetura “capaz de mais de um tipo”** | Princípio: não grudar obstetrícia no núcleo | Restrição de desenho; **não** é entrega |
| **Spike multiprotocolo (Sprint 20)** | Experimento com um exame **estruturalmente diferente** depois da V1 obstétrica | Horizonte distante; **não** é o gate das Sprints 3–5 |

O gate antigo “o motor aceitaria outro ExamType na Sprint 3” misturava o spike distante com o primeiro motor. **Retirado como critério da Sprint 3.**

## Correções de baseline (ainda hipóteses onde indicado)

- `User` ≠ `ProfessionalProfile` — ADR-008 `PROPOSED`
- Retificação = nova `ReportVersion` no mesmo `Exam` — **hipótese** ADR-009; `PENDING CLINICAL DISCOVERY` na prática dela
- Paciente Core antes do MVP 1 — decisão de produto do recorte (capacidade); campos `PENDING CLINICAL DISCOVERY`
- `organization_id` ubíquo — **não** aceito; ver ADR-010 (princípio ≠ coluna)
- Fraseologia `phraseKey` — `PROPOSED`; upgrade A/B/C em aberto (ADR-007)

## Visão das fases (indicativa)

| Fase | Conteúdo | Sprints | Horizonte |
|---|---|---|---|
| A | Descoberta clínica | 0 | Próximo |
| B | Fundação, User, ProfessionalProfile | 1–2 | Intermediário |
| C | Motores **orientados pelo recorte** | 3–5 | Intermediário |
| D | Paciente Core + obstetrícia do recorte | 6 | Intermediário |
| Documentos | Emissão → **MVP 1** | 7 | Intermediário |
| E | Obstetrícia avançada (rótulos provisórios) | 8–11 | Distante |
| G | Histórico + Patient Advanced | 12 | Distante |
| | Fraseologia persistente, UX | 13–14 | Distante |
| H | Timeline (condicional) | 15 | Distante |
| J–L | Hardening, piloto, V1 | 16–19 | Distante |
| M | Spike **outro tipo de exame** | 20 | Distante |

## Sprints (referência; compromisso só no horizonte correspondente)

### Sprint 0 — Descoberta clínica obstétrica

Horizonte próximo. Ver [`../clinical-discovery/SPRINT_0.md`](../clinical-discovery/SPRINT_0.md).

---

### Sprint 1 — Fundação da plataforma

Indicativa. Monólito modular, CI, ambientes. Sem formulário clínico. Sem aceitar `organization_id` ubíquo só porque a sprint existe (ADR-010).

**Gate (quando esta sprint for autorizada):** staging vazio; ADR-001 e inventário ADR-011 em discussão; Sprint 0 com critérios de saída atendidos **ou** risco de retrabalho explícito e aceito.

---

### Sprint 2 — Identidade: User, sessão, ProfessionalProfile

Indicativa. Não tratar médico como sinônimo de usuário.

---

### Sprint 3 — Primeiro núcleo de protocolo (mínimo)

Indicativa. Artefato versionável **do recorte validado**, não um metamodelo para dezenas de exames. Fixture = dados desse recorte.

**Gate:** o recorte da Sprint 0 cabe no artefato; regras clínicas só as validadas. **Não** exigir segundo ExamType.

---

### Sprint 4 — Formulário do recorte

Indicativa. Runtime suficiente para o recorte (condicionais **descobertos**, não um form-builder). Teclado no caminho feliz.

---

### Sprint 5 — Texto do recorte

Indicativa. Dados + templates do catálogo descoberto → narrativa; golden com fixtures anonimizadas. `phraseKey` só se ainda fizer sentido frente às frases reais.

---

### Sprint 6 — Paciente Core + obstetrícia do recorte

Indicativa. Cadastro mínimo, busca simples, exame associado a paciente, fluxo do MVP 1 candidato. Sem merge avançado.

---

### Sprint 7 — Documentos e emissão → MVP 1

Indicativa. PDF/DOCX, identidade do `ProfessionalProfile`, documento imutável. Retificação no modelo ADR-009 **somente** se o fluxo tiver sido validado; senão emitir + não sobrescrever já cumpre o MVP 1 mínimo (`PENDING PRODUCT DECISION`).

**Gate MVP 1 (capacidade):** paciente + recorte + revisar + emitir. Conteúdo clínico = o que a Sprint 0 congelar.

---

### Sprints 8–11 — Obstetrícia além do recorte

Horizonte distante. Títulos atuais (biometria, placenta/líquido, Doppler, múltiplos) são **placeholders**. Substituir pelos blocos que a descoberta nomear. Condicionais: só se houver evidência de rotina.

---

### Sprint 12 — Histórico + Patient Advanced

Distante. Apoio, não substituto da avaliação. Sem copy automático de achados.

---

### Sprints 13–14 — Frases persistentes e UX

Distante. Upgrade de override: ADR-007 estratégias A/B/C ainda abertas.

---

### Sprint 15 — Linha do tempo

Distante e condicional. Paths estáveis são princípio; UI não é compromisso.

---

### Sprints 16–19 — Hardening, piloto, V1 do recorte congelado

Distante.

---

### Sprint 20 — Spike de tipo de exame diferente

Distante. Não é versionamento do protocolo obstétrico. Não é “arquitetura genérica pronta”. É teste empírico de reuso.

---

## Dependências (indicativas)

```text
0  →  [saída Sprint 0]  →  1 → 2 →  (3–5 orientados pelo recorte) → 6 → 7 [MVP 1]
                                                                      └→ 8+ (distante)
```

Paciente Core continua **antes** do critério de laudo real do MVP 1, se o MVP 1 for definido como hoje em [`MVP_SCOPE.md`](../product/MVP_SCOPE.md).

## Construtor de protocolos

Nível 1 (artefato técnico) — intermediário, mínimo. Níveis 2–3 — distantes.

## Fora do ciclo 1

IA generativa, ditado, mobile nativo, marketplace, dezenas de protocolos, BI, microserviços, DICOM, construtor visual.
