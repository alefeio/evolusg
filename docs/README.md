# Documentação do evolUSG

Este diretório contém produto, arquitetura e descoberta clínica.

A **Sprint 1** (fundação e autenticação) está concluída para piloto: [`roadmap/SPRINT_1.md`](roadmap/SPRINT_1.md). A descoberta clínica teve a **rodada 1 concluída** e segue contínua. **Nenhum documento aqui autoriza implementação clínica** — a primeira vertical slice é apenas proposta.

## Como ler

1. Visão: [`product/PRODUCT_VISION.md`](product/PRODUCT_VISION.md)
2. Recorte de MVP: [`product/MVP_SCOPE.md`](product/MVP_SCOPE.md)
3. Primeiro protocolo: [`protocols/OBSTETRIC_DOPPLER_V0_1.md`](protocols/OBSTETRIC_DOPPLER_V0_1.md)
4. Roadmap e horizontes: [`roadmap/ROADMAP.md`](roadmap/ROADMAP.md)
5. Sprint 1 (fundação): [`roadmap/SPRINT_1.md`](roadmap/SPRINT_1.md)
6. Proposta da primeira slice clínica: [`roadmap/SPRINT_2_PROPOSAL.md`](roadmap/SPRINT_2_PROPOSAL.md)
7. Riscos: [`roadmap/RISK_REGISTER.md`](roadmap/RISK_REGISTER.md)
8. Sprint 0 e catálogos: [`clinical-discovery/SPRINT_0.md`](clinical-discovery/SPRINT_0.md)
9. Rastreabilidade e eixos de status: [`clinical-discovery/TRACEABILITY.md`](clinical-discovery/TRACEABILITY.md)
10. Referências pendentes: [`clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md`](clinical-discovery/REFERENCE_VALIDATION_BACKLOG.md)
11. Modelo conceitual: [`architecture/DOMAIN_MODEL.md`](architecture/DOMAIN_MODEL.md)
12. ADRs: [`adr/README.md`](adr/README.md)

## Estrutura

```text
docs/
  product/              visão e escopo
  roadmap/              sprints e releases
  clinical-discovery/   Sprint 0 e catálogos clínicos
  architecture/         modelo e visão de arquitetura
  adr/                  decisões propostas
  protocols/            baseline do primeiro protocolo (documental)
  testing/              fixtures clínicas
  security/             baseline de segurança
```

## Convenções

| Marca | Significado |
|---|---|
| `PENDING CLINICAL DISCOVERY` | Falta evidência da Dra. Karen. Não inventar. |
| `PENDING PRODUCT DECISION` | Falta escolha de produto. |
| `PENDING TECHNICAL VALIDATION` | Falta prova técnica / inventário. |
| `KNOWN` | Restrição ou fato já explícito — ainda assim não é desenho detalhado aceito. |
| `PROPOSED` | Hipótese. Não tratar como decisão aceita. |
| `ACCEPTED` | Só após aprovação explícita. ADR-013 (autenticação da Sprint 1) está `ACCEPTED`. ADRs clínicos permanecem `PROPOSED`. |

Convenções acrescentadas pela reconciliação clínica v0.1 (detalhe em [`clinical-discovery/TRACEABILITY.md`](clinical-discovery/TRACEABILITY.md#três-eixos-de-status-reconciliação-v01)):

| Marca | Significado |
|---|---|
| `CLINICALLY_APPROVED` | Validado pela médica responsável. **Não** implica fonte científica validada. |
| `SOURCE_VALIDATION_PENDING` | Falta referência formal (tabela, fórmula, versão). Bloqueia classificação, alerta e cálculo de produção. |
| `SOURCE_VALIDATED` | Referência identificada, versionada e aceita. |
| `PENDING HANDOFF IMPORT` | Conteúdo já informado na discovery, ainda não transcrito. Singleton Doppler: importação concluída; múltiplos podem permanecer. ≠ `SOURCE_VALIDATION_PENDING`. |
| `DOCUMENTED FOR FUTURE IMPLEMENTATION` | Conhecimento preservado (ex. múltiplos) que **não** entra na primeira vertical slice. |
| `READY_FOR_IMPLEMENTATION` | Decisão clínica aprovada, fonte suficiente e desenho compreendido. |

## O que este repositório ainda não contém (domínio clínico)

A fundação Next.js/Prisma/autenticação da Sprint 1 existe no código da aplicação. Ainda **não** há:

- motores de protocolo, formulário ou texto
- geração de PDF/DOCX
- qualquer funcionalidade clínica executável
- billing, administração ou programa de indicação
