# Modelo de domínio (conceitual)

Status das fronteiras abaixo: **PROPOSED**, alinhado aos ADRs 008, 009 e 012.  
Conteúdo clínico de campos: incorporado para o protocolo [`Obstétrica com Doppler v0.1`](../protocols/OBSTETRIC_DOPPLER_V0_1.md); o resto permanece **PENDING CLINICAL DISCOVERY**.

**Nenhuma tabela é criada por este documento.** Não há schema físico, migration ou model Prisma clínico.

## Separações obrigatórias

```text
User                    identidade e acesso
ProfessionalProfile     identidade médica e preferências
Patient                 pessoa atendida (longitudinal)
PregnancyEpisode        contexto gestacional (agrupa exames da mesma gravidez)
Exam                    evento clínico realizado
Fetus                   escopo fetal dentro do exame
Finding                 dado estruturado daquele evento
Report                  família documental daquele exame
ReportVersion           uma emissão ou rascunho dessa família
IssuedDocument          PDF/DOCX + hash de uma versão ISSUED
```

Dado clínico ≠ frase ≠ texto revisado ≠ documento emitido.

## Ownership do dado

A classificação campo a campo está em [`../clinical-discovery/CLINICAL_FIELD_CATALOG.md`](../clinical-discovery/CLINICAL_FIELD_CATALOG.md#ownership-v1--decisões-fechadas-primeira-vertical-slice).

Níveis conceituais: `Patient` · `PregnancyEpisode` · `Exam` / `ExamClinicalContext` · `Fetus` · `Finding` · `Report` · `ProfessionalPreference`.

### Ownership consolidado V1 (sem schema físico)

| Entidade | Conteúdo V1 |
|---|---|
| **Patient** | identidade mínima da paciente; entidade longitudinal futura. Sem identificadores clínicos extras inventados nesta fase. |
| **PregnancyEpisode** | DUM informativa; G/P/A snapshot; data da 1ª USG; IG da 1ª USG (semanas + dias). `PREGNANCY_EPISODE_MINIMUM_V1 = APPROVED FOR SPRINT_2 MODELING` |
| **Exam / ExamClinicalContext** | comorbidades snapshot; medicações de uso contínuo snapshot; IG atual **derivada**; IG estimada pela biometria atual; uterinas; placenta; líquido amniótico; demais findings maternos do exame |
| **Fetus** | situação; apresentação; dorso / polo cefálico; BCF; movimentos; deglutição; biometria; PFE; percentil; Doppler fetal |
| **Report** | representação textual; conclusão; revisão documental |

**G/P/A:** snapshot obstétrico no `PregnancyEpisode`. Isso **não** significa imutabilidade ao longo da vida da paciente. Histórico obstétrico longitudinal = futuro. Não criar entidade de histórico obstétrico na Sprint 2.

**Comorbidades:** conceitualmente podem pertencer ao Patient a longo prazo; na V1 = `COMORBIDITIES_V1 = EXAM_CONTEXT_SNAPSHOT`. Sem tabela longitudinal, active/inactive, onset, resolução. Futuro: `PATIENT LONGITUDINAL COMORBIDITY MODEL — FUTURE`.

**Medicações:** `CONTINUOUS_MEDICATIONS_V1 = EXAM_CONTEXT_SNAPSHOT` (uso contínuo informado no exame). Sem medication history, prescription model, start/end. Futuro: `PATIENT LONGITUDINAL MEDICATION MODEL — FUTURE`.

**IG corrigida atual:** valor **derivado** do contexto do episódio + data do exame/atual. Não duplicar como fonte independente. **IG pela biometria** pertence ao exame atual, não ao episódio.

## Escopo fetal e múltiplos

`Fetus` existe como **escopo conceitual** desde o início, mesmo com a primeira vertical slice restrita a gestação única (`SINGLETON ONLY`).

Motivo: campos, frases e contribuições de conclusão já nascem com escopo (materno / fetal / global). Modelar biometria e Doppler fetal como atributos diretos do `Exam` criaria uma decisão que **impediria** múltiplos depois — exatamente o tipo de decisão que a reconciliação recusa.

Suporte a gemelares/trigemelares, corionicidade, amnionicidade, discordância e sFGR: `DOCUMENTED FOR FUTURE IMPLEMENTATION`. Não implementar agora.

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

## Paciente e episódio gestacional

```text
Patient ──< PregnancyEpisode ──< Exam ──< Fetus
                 └── ExamClinicalContext (snapshots do exame)
```

MVP 1 exige **Paciente Core**: cadastro mínimo, busca simples, associação obrigatória.  
Patient Advanced (merge, anti-duplicidade, filtros) é posterior.

Campos do cadastro: **PENDING CLINICAL DISCOVERY** (identidade mínima já requerida pelo produto; sem inventar identificadores extras aqui).

`PregnancyEpisode` mínimo V1: **aprovado para modelagem da Sprint 2** (`PREGNANCY_EPISODE_MINIMUM_V1`). Campos: DUM informativa; G/P/A snapshot; data da 1ª USG; IG na 1ª USG (semanas + dias). **Sem tabela nesta tarefa.**

## Histórico longitudinal (direção estratégica)

```text
Patient → PregnancyEpisode → Exams → structured findings → evolução
```

Registrado como **direção**, não como entrega: sem timeline, sem matching automático de exames, sem compartilhamento entre organizações. A exigência é apenas que a modelagem inicial não impossibilite essa evolução — o que `PregnancyEpisode` + findings com `path` estável já preservam.

## Achados

Finding canônico (PROPOSED):

- `path`
- `valueType`
- `code` + `codeSystem` quando codificado
- `quantity` `{ value, unit }` quando numérico
- `source`: `USER` | `CALCULATED` | `DEFAULT`
- `protocolVersionId`

Não persistir a frase como verdade.

Duas exigências que a rodada 1 acrescenta ao formato canônico:

| Exigência | Motivo clínico |
|---|---|
| `path` precisa suportar escopo repetível (ex. conceitual `fetuses[n].biometry.ac`) | biometria e Doppler são por feto; múltiplos são futuro documentado |
| ausência de `Finding` significa **não informado**, nunca "ausente" | princípio validado "não marcado ≠ ausente"; nenhuma camada pode inferir negativa a partir de campo vazio |

## Explicabilidade clínica (princípio futuro)

Quando uma regra gerar classificação, alerta ou contribuição de conclusão, deve ser possível rastrear: dado → valor → referência → percentil/faixa → contexto → regra → protocolo → versões.

Registrado como **princípio de modelagem**, não como interface: nenhuma tela de explainability nesta fase. A consequência prática é que `Classification` sem `SourceVersion` associada não deve existir no modelo.

## Frases

Ver ADR-007. Proposta: `phraseKey` estável + TextRule versionada no protocolo. Override do `ProfessionalProfile` amarra-se à chave semântica, com checagem de placeholders na troca de `ProtocolVersion`.

## Organização (futuro)

**Princípio (ADR-010):** não desenhar o ciclo 1 de modo a inviabilizar multi-tenancy depois.

**Decisão física** (`organization_id` em todas as entidades desde a v1): `PROPOSED`, sem evidência suficiente para aceitar. Ciclo 1: um tenant lógico. Sem billing e sem isolamento por schema.

## O que não entra no núcleo genérico

Campos obstétricos concretos (`apresentação`, `ILA`, `CRL`, …) vivem no **protocolo**, não como colunas do motor. `PENDING CLINICAL DISCOVERY` para a lista.
