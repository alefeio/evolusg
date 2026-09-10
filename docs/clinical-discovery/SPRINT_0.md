# Sprint 0 — Descoberta clínica obstétrica

**Status:** em andamento (descoberta clínica **não encerrada**).  
**Duração prevista:** 2 semanas, em ondas.  
**Implementação clínica:** continua proibida.  
**Paralelo:** a Sprint 1 (fundação e autenticação) está autorizada porque não depende de regras clínicas. Ver [`../roadmap/SPRINT_1.md`](../roadmap/SPRINT_1.md).

## Objetivo

Produzir conhecimento suficiente para definir o MVP 1:

- qual exame obstétrico implementar primeiro
- quais campos mínimos o compõem

Essas duas respostas **não** devem ser dadas pela engenharia. Dependem da Dra. Karen.

## Princípio de coleta

A Sprint 0 é **progressiva**. Não exigir todo o material para começar.

**Para iniciar (Onda 1):**

- primeira conversa (30–45 min)
- template atual (Turing/Word)
- alguns laudos anonimizados

**Depois:** normais, alterados, Doppler, gemelares, complexos.

## Ondas

### Onda 1 — Descobrir a rotina

Entender o trabalho real. Primeira conversa. Ver checklist abaixo.

**Resultado esperado:** candidato a MVP 1 nomeado pela Dra. Karen (ainda pode ser confirmado na Onda 4).

### Onda 2 — Descobrir o laudo

Decompor templates e laudos em seções, campos, ordem de preenchimento, conclusão vs corpo.

### Onda 3 — Descobrir regras e frases

Separar: DADO | REGRA | CÁLCULO | FRASE | PREFERÊNCIA.

Nenhum cálculo presumido.

### Onda 4 — Definir MVP 1

Congelar o fluxo, campos mínimos, o que fica para MVP 2 / Beta / V1.

### Onda 5 — Validar arquitetura

Confrontar o modelo **candidato** (`User` / `ProfessionalProfile`, tríade Exam/Report/ReportVersion, `phraseKey`) com o que foi descoberto. Ajustar ADRs `PROPOSED`. Não escrever código. Não tratar hipótese como regra dela.

## Checklist — Onda 1

Use durante e após a primeira conversa.

- [ ] Agendar 30–45 minutos com a Dra. Karen
- [ ] Seguir o roteiro da primeira conversa em [`INTERVIEW_GUIDE.md`](INTERVIEW_GUIDE.md)
- [ ] Listar os tipos de USG obstétrica que ela realiza (nomes dela, não os nossos)
- [ ] Marcar frequência relativa: alta / média / baixa / rara
- [ ] Registrar o candidato dela a “exame para começar”
- [ ] Entender o fluxo atual no Turing (passos, onde salva, onde imprime)
- [ ] Anotar os 3–5 maiores ladrões de tempo
- [ ] Anotar o que o Turing tem que o evolUSG não pode piorar
- [ ] Anotar o que mais incomoda no Turing
- [ ] Entender como ela estrutura o laudo (seções, ordem mental)
- [ ] Perguntar quais frases ela considera pessoais
- [ ] Pedir o material imediato (ver seção abaixo)
- [ ] Receber template atual (anonimizado)
- [ ] Receber alguns laudos anonimizados (quantidade pequena já serve)
- [ ] Preencher [`EXAM_INVENTORY.md`](EXAM_INVENTORY.md) só com o que foi dito
- [ ] Registrar lacunas como `PENDING CLINICAL DISCOVERY`
- [ ] **Não** escolher o MVP 1 sozinhos se a resposta dela não estiver clara; marcar follow-up

### Material a pedir já na Onda 1 (não bloquear a conversa se faltar)

1. Template/modelo atual do laudo que ela mais usa
2. 2–5 laudos anonimizados desse tipo (podem ser reescritos com dados fictícios)
3. Exemplo de documento emitido (timbre/logo) com dados fictícios, se fácil

Não pedir base de pacientes, dumps, nem imagens identificáveis.

### O que a Onda 1 não precisa

- tabelas de percentis
- Doppler completo
- gemelares
- todos os casos raros
- decisão jurídica de residência de dados

## Checklist resumido das ondas seguintes

**Onda 2**

- [ ] Decompor template em seções
- [ ] Mapear campos visíveis vs usados de verdade
- [ ] Iniciar [`CLINICAL_FIELD_CATALOG.md`](CLINICAL_FIELD_CATALOG.md)
- [ ] Catalogar fixture em [`../testing/CLINICAL_FIXTURES.md`](../testing/CLINICAL_FIXTURES.md)

**Onda 3**

- [ ] Frases padrão vs pessoais → [`PHRASE_CATALOG.md`](PHRASE_CATALOG.md)
- [ ] Cálculos **somente nomeados por ela** → [`CALCULATION_CATALOG.md`](CALCULATION_CATALOG.md)
- [ ] Turing keep/drop/rethink → [`TURING_ANALYSIS.md`](TURING_ANALYSIS.md)

**Onda 4**

- [ ] Congelar MVP 1 em [`../product/MVP_SCOPE.md`](../product/MVP_SCOPE.md)
- [ ] Listar explicitamente o que fica de fora
- [ ] Atualizar roadmap obstétrico se a decomposição mudar
- [ ] Abrir `CD`/`CR` só com evidência ([`TRACEABILITY.md`](TRACEABILITY.md))

**Onda 5**

- [ ] Percorrer um laudo real no modelo **candidato** `Exam` → `Report` → `ReportVersion` e anotar onde não cabe
- [ ] Perguntar como ela corrige laudo hoje (novo registro, adendo, reimpressão…) — **não** presumir que retificação ≠ novo exame
- [ ] Se houver frases pessoais: discutir o que deveria acontecer se o modelo de frase mudar (sem escolher A/B/C por ela)
- [ ] Anotar furos nos ADRs `PROPOSED`

## Gate da Sprint 0

Critérios objetivos: seção [Sprint 0 Exit Criteria](#sprint-0-exit-criteria) abaixo.

Sem recorte candidato e campos mínimos ditos por ela, **não** iniciar Sprint 1 de produto clínico. Fundação vazia só com risco explícito (R-10).

A Sprint 0 **não** está concluída só porque existe esta documentação.

## Sprint 0 Exit Criteria

A Sprint 0 poderá ser considerada concluída **somente depois**, quando **todos** os itens abaixo forem verdadeiros. Este bloco define o critério; **não** declara a sprint encerrada.

- [ ] Primeiro recorte clínico **candidato** identificado **pela Dra. Karen** (nome no vocabulário dela)
- [ ] Fluxo atual desse recorte compreendido (Turing: da identificação da paciente até o documento)
- [ ] Principais entradas e saídas desse recorte conhecidas (o que ela informa; o que o laudo precisa devolver) — ainda que a lista cresça depois
- [ ] Requisitos conhecidos classificados (`KNOWN` / `PROPOSED` / `PENDING CLINICAL DISCOVERY` / `PENDING PRODUCT DECISION` / `PENDING TECHNICAL VALIDATION`)
- [ ] Desconhecidos **explícitos** como `PENDING CLINICAL DISCOVERY` (não preenchidos pela engenharia)
- [ ] Exemplos/documentos anonimizados suficientes para iniciar modelagem (template + alguns laudos do recorte)
- [ ] ADRs essenciais da Sprint 0 revisados à luz da evidência (continuam `PROPOSED` até aprovação; incompatíveis com o fluxo real atualizados)
- [ ] Principais riscos desta fase registrados em [`../roadmap/RISK_REGISTER.md`](../roadmap/RISK_REGISTER.md)
- [ ] Escopo inicial e não-escopo do MVP 1 compreendidos e escritos em [`../product/MVP_SCOPE.md`](../product/MVP_SCOPE.md)
- [ ] Nenhum requisito clínico crítico inventado pela engenharia (rastreio: [`TRACEABILITY.md`](TRACEABILITY.md) — sem `CR` fictício)

Enquanto isso não ocorrer, a Sprint 0 permanece em andamento.

## Reuniões depois da primeira

Temas técnicos (Doppler, cálculos, raridades, gemelares, correção de laudo, assinatura/impressão) ganham sessões próprias. Não inflar a primeira conversa.
