# ADR-008 — User vs ProfessionalProfile

- **Status:** PROPOSED
- **Decidir até:** Sprint 2 (modelo); identidade visual no documento na Sprint 7

## Contexto

No ciclo 1 haverá praticamente uma médica. Ainda assim, autenticar “o médico” como se fosse a conta mistura login com CRM, frases e logomarca. Futuro: secretária, administrador, colaborador.

## Decisão proposta

**User** = identidade de acesso: credenciais, sessão, dispositivo, papéis, autorização.

**ProfessionalProfile** = identidade médica: nome profissional, CRM, UF, assinatura, cabeçalho/rodapé/logo, preferências clínicas, overrides de `phraseKey`.

O laudo referencia o `ProfessionalProfile` que o assume. A auditoria registra o `User` que efetuou a ação.

Um User pode não ter ProfessionalProfile (admin/secretária futura).

## Alternativas

| Alternativa | Problema |
|---|---|
| Professional = User | Secretária vira “médica”; CRM na tabela de login |
| Só User com colunas opcionais de CRM | Mesmo acoplamento, mais difícil de evoluir |

## Consequências

+ autorização e clínica evoluem separado  
− um cadastro a mais no fluxo inicial (aceitável: uma profissional)
