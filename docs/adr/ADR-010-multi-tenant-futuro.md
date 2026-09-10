# ADR-010 — Multi-tenant futuro

- **Status:** PROPOSED
- **Maturidade (auditoria):** princípio adequado; **decisão física prematura**
- **Decidir até:** princípio — agora (não pintar o sistema num canto). Coluna em todas as tabelas — **não** na Sprint 0; só com evidência, no máximo na fundação, ainda como `PROPOSED`.

## A. Problema

Não construir o ciclo 1 de um jeito que torne **impossível** ou absurdamente caro atender mais de uma organização depois. Ao mesmo tempo, não pagar o custo de multi-tenancy real sem inquilinos reais.

## B. Duas coisas distintas

### Princípio arquitetural (manter)

> O sistema não deve ser projetado de forma que inviabilize multi-tenancy no futuro.

Isto **não** exige `organization_id` em toda entidade na primeira versão.

Exemplos do princípio (não são schema): não hardcodar “única médica do mundo” em regras; não misturar identidade de acesso com uma clínica só no núcleo de autenticação de forma irreversível; evitar globais que impeçam filtrar por organização depois.

Estado: `PROPOSED` como princípio de desenho — alinhado ao ciclo 1 single-tenant lógico.

### Decisão física (não definitiva)

> Todas as entidades devem possuir `organization_id` desde a primeira versão.

Estado: **`PROPOSED`**. **Não** há evidência suficiente nesta Sprint 0 para aceitar. Ciclo 1 tem um tenant lógico. Billing, convites e isolamento por schema continuam fora.

## C. Prematuridade

**Prematuro** como decisão de persistência. **Adequado** como princípio de não se pintar num canto.

## Impactos de inserir `organization_id` agora (se viesse a ser aceito)

| Área | Impacto |
|---|---|
| Persistência | Coluna (e FK) em muitas tabelas; backfill inútil com um só valor |
| Índices | Quase todo índice único/útil vira composto `(organization_id, …)` |
| Queries | Filtro obrigatório em toda leitura; risco de esquecer = vazamento lógico |
| Autorização | Todo request precisa de contexto de org; senão a coluna é teatro |
| Testes | Fixtures e casos “outra org” desde o dia 1, ou falsa segurança |
| APIs | Header/path/claim de org, mesmo com um tenant |
| Isolamento de dados | Isolamento **lógico** só existe se o filtro for infalível; coluna sozinha não isola |
| Complexidade operacional | Mais superfície, pouco ganho até o segundo tenant |

Adiar a coluna e acrescentá-la depois tem custo de migração, mas com **um** tenant esse custo é o de adicionar um valor constante — menor do que carregar disciplina de isolamento falso no MVP.

## Invalidation Triggers

- Segundo cliente/clínica no horizonte próximo (`PENDING PRODUCT DECISION`).
- Requisito de isolamento forte (schema/database por tenant) — invalidaria “só uma coluna”.
- Evidência de que a equipe já esquece fronteiras sem a coluna (argumento fraco sozinho).
- Princípio violado por outro ADR (ex. User = clínica).

## Decisão proposta (restrita)

Adotar o **princípio** de não inviabilizar multi-tenancy. Manter a **implementação física** (`organization_id` ubíquo) como `PROPOSED`, sem aceite. Não criar schema.
