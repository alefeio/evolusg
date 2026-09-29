# Registro de riscos

Apenas riscos **já observáveis** nesta fase. Sem riscos clínicos específicos inventados.

Riscos R-01 a R-11 vêm da auditoria da Sprint 0. R-12 a R-18 foram acrescentados pela reconciliação Clinical Discovery v0.1.

| ID | Risco | Probabilidade | Impacto | Mitigação | Status |
|---|---|---|---|---|---|
| R-01 | Abstração arquitetural prematura (motores 3–5 como framework genérico) | Alta | Alto | Vertical slice do recorte valida o motor; Sprint 3 sem gate de segundo ExamType | Aberto |
| R-02 | Regras clínicas não validadas tratadas como prontas | Alta | Crítico | `PENDING CLINICAL DISCOVERY`; catálogos vazios; não pesquisar clínica externa para preencher | Aberto |
| R-03 | Acoplamento futuro protocolo ↔ código / UI | Média | Alto | Princípio “protocolo como dados”; não implementar ainda; ADR-002 restrito | Aberto |
| R-04 | Fraseologia pessoal incompatível após atualização de protocolo (texto muda sem ato) | Média | Alto | ADR-007: A/B/C em aberto; não aceitar fallback automático; overrides depois do MVP 1 | Aberto |
| R-05 | Roadmap lido como cronograma fechado até a Sprint 20 | Alta | Médio | Três horizontes no ROADMAP; distante sem compromisso de ordem/escopo | Aberto |
| R-06 | Modelagem multi-tenant física (`organization_id` em tudo) cedo demais | Média | Médio | ADR-010: princípio ≠ coluna; persistência `PROPOSED` | Aberto |
| R-07 | Ausência de rastreio descoberta → requisito → teste → versão | Alta | Alto | `TRACEABILITY.md` (processo); IDs só quando houver evidência | Aberto |
| R-08 | Hipótese documental (retificação = mesmo exame; máquina DRAFT/REVIEWED/ISSUED) aceita sem fluxo real | Média | Alto | ADR-009/012 como candidatos; validar prática atual | Aberto |
| R-09 | Stack já vinculado (Prisma/Vercel) virar residência de produção sem inventário | Média | Alto | ADR-011; inventário antes de paciente real; sem parecer jurídico da engenharia | Aberto |
| R-10 | Sprint 1 de fundação começar sem saída da Sprint 0 | Média | Médio | Exit criteria; fundação vazia só com risco explícito | Aberto |
| R-11 | Metamodelo (operadores, RepeatingGroup, phraseKey) travar mudança quando o laudo real chegar | Média | Alto | Detalhes de ADR como prematuros; recorte clínico puxa o modelo | Aberto |
| R-12 | Fonte clínica insuficiente virar comportamento de produção (threshold sem referência) | Alta | Crítico | Eixo `SOURCE_VALIDATION_PENDING`; backlog de referências; ADR-014; classificação bloqueada até `SOURCE_VALIDATED` | Aberto |
| R-13 | Ownership incorreto do dado (tudo dentro de `Exam`) | Alta | Alto | Ownership conceitual campo a campo; `PregnancyEpisode` e escopo fetal registrados antes de modelar | Aberto |
| R-14 | Conclusão implementada como concatenação de frases | Média | Alto | Requisitos de priority/dedup/consolidação/escopo/supressão documentados; emenda ao ADR-004 | Aberto |
| R-15 | Suporte a múltiplos entrar cedo demais e inflar a primeira slice | Média | Médio | `SINGLETON ONLY` explícito; múltiplos como `DOCUMENTED FOR FUTURE IMPLEMENTATION` e stress test documental | Aberto |
| R-16 | Schema amarrado à obstetrícia (campos obstétricos no núcleo) | Média | Alto | Campos vivem no protocolo; proibição de coluna clínica no núcleo (ADR-002/005) | Aberto |
| R-17 | Arquitetura genérica demais ("motor para toda ultrassonografia") | Média | Alto | `ARCHITECTURE = MUST NOT PRECLUDE MULTIPROTOCOL` em vez de motor genérico; abstração só com necessidade concreta | Aberto |
| R-18 | Frase e dado se misturarem (texto tratado como verdade clínica) | Média | Alto | `DADO ≠ FRASE`; frases só por chave; ausência nunca gera negativa | Aberto |
