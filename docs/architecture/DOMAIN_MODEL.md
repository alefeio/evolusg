# Modelo de domínio (conceitual)

Status das fronteiras abaixo: **PROPOSED**, alinhado aos ADRs 008, 009 e 012.  
Conteúdo clínico de campos: **PENDING CLINICAL DISCOVERY**.

## Separações obrigatórias

```text
User                    identidade e acesso
ProfessionalProfile     identidade médica e preferências
Patient                 pessoa atendida
Exam                    evento clínico realizado
Finding                 dado estruturado daquele evento
Report                  família documental daquele exame
ReportVersion           uma emissão ou rascunho dessa família
IssuedDocument          PDF/DOCX + hash de uma versão ISSUED
```

Dado clínico ≠ frase ≠ texto revisado ≠ documento emitido.

## User ≠ ProfessionalProfile

`User` não é o médico.

| Entidade | Responsabilidade |
|---|---|
| **User** | login, autenticação, sessão, dispositivo, papéis, autorização |
| **ProfessionalProfile** | nome profissional, CRM, UF, assinatura, identidade visual, preferências clínicas, fraseologia |

Um `User` poderá ser médico, administrador, secretária ou outro papel. No ciclo 1 haverá praticamente uma médica; mesmo assim o modelo não acopla auth à identidade médica.

Relação proposta: um `User` **pode** ter zero ou um `ProfessionalProfile` (ciclo 1). Secretária futura: `User` sem perfil médico, com autorização limitada.

Quem assina o laudo é o `ProfessionalProfile`. Quem se autentica é o `User`.

## Exam e documento (candidato)

`Exam` é o procedimento/evento **candidato**. A correção de laudo **não** está validada como “nunca é um novo exame”: ver ADR-009 (`PENDING CLINICAL DISCOVERY` na prática atual).

Ilustração **candidata** (não é fluxo validado):

```text
Patient
  └── Exam                    (evento clínico — candidato)
        ├── Finding[]         (trabalho corrente — PROPOSED)
        └── Report            (1:1 no ciclo 1 — PROPOSED)
              └── ReportVersion …  (máquina candidata ADR-012)
                    └── IssuedDocument (não sobrescrever emitido — PROPOSED)
```

Como ela corrige laudo hoje: `PENDING CLINICAL DISCOVERY`. Não assumir retificação neste diagrama.

## Paciente

```text
Patient ──< Exam
```

MVP 1 exige **Paciente Core**: cadastro mínimo, busca simples, associação obrigatória.  
Patient Advanced (merge, anti-duplicidade, filtros) é posterior.

Campos do cadastro: **PENDING CLINICAL DISCOVERY**.  
Episódio gestacional (agrupar exames da mesma gravidez): **PENDING CLINICAL DISCOVERY**.

## Achados

Finding canônico (PROPOSED):

- `path`
- `valueType`
- `code` + `codeSystem` quando codificado
- `quantity` `{ value, unit }` quando numérico
- `source`: `USER` | `CALCULATED` | `DEFAULT`
- `protocolVersionId`

Não persistir a frase como verdade.

## Frases

Ver ADR-007. Proposta: `phraseKey` estável + TextRule versionada no protocolo. Override do `ProfessionalProfile` amarra-se à chave semântica, com checagem de placeholders na troca de `ProtocolVersion`.

## Organização (futuro)

**Princípio (ADR-010):** não desenhar o ciclo 1 de modo a inviabilizar multi-tenancy depois.

**Decisão física** (`organization_id` em todas as entidades desde a v1): `PROPOSED`, sem evidência suficiente para aceitar. Ciclo 1: um tenant lógico. Sem billing e sem isolamento por schema.

## O que não entra no núcleo genérico

Campos obstétricos concretos (`apresentação`, `ILA`, `CRL`, …) vivem no **protocolo**, não como colunas do motor. `PENDING CLINICAL DISCOVERY` para a lista.
