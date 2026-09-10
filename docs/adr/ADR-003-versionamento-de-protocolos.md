# ADR-003 — Versionamento de protocolos

- **Status:** PROPOSED
- **Maturidade (auditoria):** parcialmente prematuro
- **Decidir até:** antes de emitir o primeiro laudo real (MVP 1), não no detalhe durante a Sprint 0

## A. Problema

Impedir que a mudança da definição atual de um exame altere, em silêncio, laudos já elaborados ou emitidos.

## B. O que está em que estado

| Item | Classificação |
|---|---|
| Laudo emitido não deve ser reescrito porque o modelo atual mudou | `KNOWN` (intenção de produto/segurança documental) |
| Estados `DRAFT` → `PUBLISHED` → `DEPRECATED` do **protocolo** | `PROPOSED` (não confundir com estados do laudo, ADR-012) |
| Guardar `protocolVersionId` no exame/versão emitida | `PROPOSED` |
| Snapshot de schema + catálogo de frases no emitido | `PROPOSED` |
| Rascunhos abertos: ficar na versão antiga **ou** reabrir na nova | `PENDING PRODUCT DECISION` |
| Nunca migrar findings em silêncio | `PROPOSED` (princípio; fluxo de UI ainda aberto) |
| Um único protocolo ativo versionado no ciclo 1 vs vários ExamTypes | ver roadmap: **não é a mesma coisa** que o spike multiprotocolo |

Isto **não** é arquitetura multiprotocolo (vários tipos de USG) nem o spike da Sprint 20. É versionar **um** protocolo ao longo do tempo.

## C. Prematuridade

**Parcialmente prematuro.** A invariante “emitido não muda com o protocolo novo” é adequada agora. A máquina de estados do artefato de protocolo e a política de rascunhos abertos ainda não têm fluxo real validado.

## Invalidation Triggers

- Fluxo real em que a profissional espera que rascunhos acompanhem sempre a última definição.
- Requisito regulatório de reprocessar texto antigo (não observado; não presumir).
- Descoberta de que “versão de protocolo” e “versão de laudo” se confundem na prática dela — exigiria outro recorte de modelo.
- Evidência de que snapshot completo é superdimensionado (bastaria o id da versão).

## Decisão proposta (restrita)

Preservar a invariante de não reescrever emitidos. Não aceitar ainda a política de rascunhos nem os nomes de estado do artefato de protocolo como definitivos.

## Alternativas

| Alternativa | Risco |
|---|---|
| Protocolo mutável | Laudos antigos reescritos |
| Migração automática de campos | Alteração silenciosa de significado |
