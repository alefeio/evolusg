# Documentação do evolUSG

Este diretório contém produto, arquitetura e descoberta clínica.

A **Sprint 0 clínica continua em andamento**. A **Sprint 1** (fundação e autenticação) está autorizada: [`roadmap/SPRINT_1.md`](roadmap/SPRINT_1.md). Nenhum documento aqui autoriza implementação clínica.

## Como ler

1. Visão: [`product/PRODUCT_VISION.md`](product/PRODUCT_VISION.md)
2. Recorte de MVP (ainda em descoberta): [`product/MVP_SCOPE.md`](product/MVP_SCOPE.md)
3. Roadmap e horizontes: [`roadmap/ROADMAP.md`](roadmap/ROADMAP.md)
4. Sprint 1 (fundação): [`roadmap/SPRINT_1.md`](roadmap/SPRINT_1.md)
5. Riscos: [`roadmap/RISK_REGISTER.md`](roadmap/RISK_REGISTER.md)
6. Sprint 0: [`clinical-discovery/SPRINT_0.md`](clinical-discovery/SPRINT_0.md)
7. Rastreabilidade (processo): [`clinical-discovery/TRACEABILITY.md`](clinical-discovery/TRACEABILITY.md)
8. Modelo conceitual: [`architecture/DOMAIN_MODEL.md`](architecture/DOMAIN_MODEL.md)
9. ADRs: [`adr/README.md`](adr/README.md)

## Estrutura

```text
docs/
  product/              visão e escopo
  roadmap/              sprints e releases
  clinical-discovery/   Sprint 0 e catálogos clínicos
  architecture/         modelo e visão de arquitetura
  adr/                  decisões propostas
  protocols/            reserva para protocolos versionados (após descoberta)
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
| `ACCEPTED` | Só após aprovação explícita. ADR-013 (autenticação da Sprint 1) está `ACCEPTED`. ADRs clínicos 001–012 permanecem `PROPOSED`. |

## O que este repositório ainda não contém (domínio clínico)

A fundação Next.js/Prisma/autenticação da Sprint 1 existe no código da aplicação. Ainda **não** há:

- motores de protocolo, formulário ou texto
- geração de PDF/DOCX
- qualquer funcionalidade clínica executável
- billing, administração ou programa de indicação
