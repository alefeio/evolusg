# Baseline de segurança

Status: **PROPOSED** para o desenho; obrigatório como *intenção* desde a fundação. Não é uma sprint só no fim.

O evolUSG tratará dados pessoais de saúde. Isso exige minimização, acesso autenticado, menor privilégio, rastreio e cuidado com logs.

## Fundação (quando houver produto)

- contas individuais (`User`); sem senha compartilhada
- sessão no servidor, cookie seguro, expiração
- TLS em trânsito
- hashing de senha (Argon2id ou equivalente atual)
- RBAC mínimo: papéis no `User`, não no CRM
- não logar findings nem PII em log técnico
- headers de segurança e rate limit de login
- backups com exercício de restore por release
- documentos só com autorização; object storage, não anexo eterno em e-mail de log

## Evolução antes do piloto

- MFA (TOTP) — dívida explícita se não couber na Sprint 2; data-alvo: piloto
- listagem de sessões e logout remoto
- histórico de acesso (timestamp, user-agent; **não** amarrar a IP/máquina)
- criptografia de identificadores altamente sensíveis se existirem (ex. CPF — **PENDING CLINICAL DISCOVERY** se o cadastro usa)
- retenção e exclusão: fluxo manual documentado no ciclo 1 é aceitável se explícito

## LGPD (proporcional, sem parecer jurídico)

- minimização: não pedir o que o laudo não usa
- finalidade: documentação assistencial
- material da Sprint 0 **anonimizado**
- transferências internacionais: possíveis em tese, com bases da LGPD/ANPD — ver ADR-011
- validação jurídica/compliance **antes de produção**

## Auditoria clínica vs log técnico

Log técnico: operação, erros, sem corpo de laudo.  
Auditoria clínica: quem criou/alterou/emitiu, qual exame, qual `ReportVersion`, hash do documento.

Modelo detalhado de auditoria: ADR futuro (backlog). Event sourcing completo **não** no dia 1.

## Sprint 0

Nenhum dado identificável de paciente no repositório. Fixtures anonimizadas apenas.
