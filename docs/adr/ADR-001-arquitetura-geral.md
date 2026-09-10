# ADR-001 — Arquitetura geral

- **Status:** PROPOSED
- **Decidir até:** antes da Sprint 1 de fundação

## Contexto

Equipe pequena, um produto, um tenant inicial, consistência forte entre exame, achados, texto, auditoria e documento. Experiência do time: Next.js, React, TypeScript, PostgreSQL, Prisma, Docker, Auth.js. Familiaridade não é critério único.

## Decisão proposta

Monólito modular em Next.js (App Router) + TypeScript + PostgreSQL. Domínio em módulos internos testáveis sem React. Um deploy no ciclo 1.

Motores (protocolo, regras, texto) como código puro.

## Alternativas

| Alternativa | Motivo para não adotar agora |
|---|---|
| Next.js + NestJS separados | Dois contratos e dois deploys atrasam o MVP médico |
| Microserviços | Custo operacional e falhas parciais sem ganho clínico |
| Backend Java/C# | Fora da capacidade atual da equipe |

## Consequências

+ velocidade, transações simples, testes de motor isolados  
− risco de “monólito bagunçado” se fronteiras não forem respeitadas  
− API pública para outros clientes fica para depois

## Quando aceitar

Após Sprint 0 ter recorte de MVP 1, ou conscientemente no início da Sprint 1 com risco de retrabalho de modelo de paciente.
