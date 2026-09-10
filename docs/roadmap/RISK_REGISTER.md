# Registro de riscos — Sprint 0

Apenas riscos **já observáveis** nesta fase. Sem riscos clínicos específicos inventados.

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
