# Visão do produto — evolUSG

## Nome

**evolUSG** = evolução + ultrassonografia (USG).

O produto deve transmitir: agilidade, inteligência, segurança, organização, evolução clínica e produtividade médica.

## Problema

Laudos de ultrassonografia ainda dependem de digitação repetitiva, frases rígidas de sistemas genéricos e pouco aproveitamento de dados estruturados. Isso gera lentidão no atendimento, dificuldade de personalizar o texto do profissional e pouca base para histórico e comparação.

## Solução

Plataforma web para elaboração **estruturada** de laudos de USG.

O profissional preenche achados em campos. O sistema combina:

**dados + regras + templates + preferências do profissional**

para gerar o texto do laudo. O profissional revisa e só então emite o documento.

Exemplo conceitual (não é regra clínica aprovada):

- Dados: número de fetos = 1; situação = longitudinal; apresentação = cefálica; dorso = direita
- Texto possível: "Feto único, em situação longitudinal, apresentação cefálica, com dorso à direita."

## Princípios

1. **Dado clínico ≠ frase.** A verdade é estruturada; o texto é projeção.
2. **Motor determinístico.** Sem IA generativa no laudo básico.
3. **Arquitetura genérica, implementação obstétrica.** Outros exames no futuro; profundidade obstétrica agora.
4. **Identidade ≠ perfil médico.** `User` autentica; `ProfessionalProfile` carrega CRM, frases e identidade visual.
5. **Exame vs documento.** Separar evento clínico de laudo é proposta de arquitetura. Se corrigir laudo cria ou não um novo exame na prática dela: `PENDING CLINICAL DISCOVERY` (ADR-009).
6. **Revisão humana obrigatória** antes da emissão.
7. **Protocolos versionados e imutáveis** após publicação.
8. **Velocidade clínica.** Teclado, condicionais, poucos cliques.

## Estratégia Obstetric-First

A Dra. Karen usa USG obstétrica diariamente. O primeiro ciclo do produto existe para tornar o evolUSG excelente nessa rotina.

Somente após um conjunto obstétrico maduro (V1 obstétrica do recorte definido) avaliaremos outro tipo de exame via spike técnico — sem reconstruir o sistema.

## O que o evolUSG não é (ciclo 1)

- prontuário eletrônico completo
- PACS / DICOM
- construtor visual de protocolos
- aplicativo mobile nativo
- motor de IA para redigir laudos
- plataforma multi-especialidade no lançamento

## Utilizadora âncora

Dra. Karen — especialista clínica e usuária inicial.

Feedback classificado em: `BUG` | `REGRA CLÍNICA` | `UX` | `FRASEOLOGIA` | `MELHORIA` | `NOVA FUNCIONALIDADE`.

## Estado

Visão aprovada em direção geral. Detalhe do MVP 1: `PENDING CLINICAL DISCOVERY`.
