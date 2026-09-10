# Documentação do evolUSG

Este diretório contém o baseline de produto e arquitetura da **Sprint 0**.

Nenhum documento aqui autoriza implementação de aplicação, banco, APIs ou motor clínico.

## Como ler

1. Visão: [`product/PRODUCT_VISION.md`](product/PRODUCT_VISION.md)
2. Recorte de MVP (ainda em descoberta): [`product/MVP_SCOPE.md`](product/MVP_SCOPE.md)
3. Roadmap e horizontes: [`roadmap/ROADMAP.md`](roadmap/ROADMAP.md)
4. Riscos: [`roadmap/RISK_REGISTER.md`](roadmap/RISK_REGISTER.md)
5. Sprint 0: [`clinical-discovery/SPRINT_0.md`](clinical-discovery/SPRINT_0.md)
6. Rastreabilidade (processo): [`clinical-discovery/TRACEABILITY.md`](clinical-discovery/TRACEABILITY.md)
7. Modelo conceitual: [`architecture/DOMAIN_MODEL.md`](architecture/DOMAIN_MODEL.md)
8. ADRs: [`adr/README.md`](adr/README.md)

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
| `ACCEPTED` | Só após aprovação explícita. Nenhum ADR está neste estado nesta fase. |

## O que este repositório ainda não contém

- aplicação Next.js
- Prisma / migrations
- autenticação
- motores de protocolo, formulário ou texto
- geração de PDF/DOCX
- qualquer funcionalidade clínica executável
