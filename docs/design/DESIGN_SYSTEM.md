# evolUSG — Design System

**Escopo:** fundação visual pós–Sprint 1 (Brand / UI / UX).  
**Não é** Sprint 2. Não define domínio clínico, billing, admin, referral ou APIMG.

## Visão

`Clinical Technology + Premium SaaS + Calm Precision`

A interface comunica precisão clínica, confiabilidade, tecnologia, segurança, modernidade, serenidade e cuidado — com sofisticação sem ostentação. O médico deve conseguir usar o sistema por longos períodos sem cansaço visual.

A UI **não** deve parecer startup gamer, crypto, dashboard neon, sistema hospitalar antigo, app infantil ou landing genérica.

## Princípios

1. **Clareza antes de efeito** — hierarquia tipográfica forte, espaço generoso, contraste AA.
2. **Marca como âncora** — navy estrutural; cyan só como energia/destaque.
3. **Light por padrão** — fundo claro predominante; navy em shell/auth institucional, não como dark mode global.
4. **Só o que existe** — navegação e CTAs apenas para fluxos reais (identidade e acesso).
5. **Feedback humano** — loading, sucesso, erro e disabled em toda ação relevante; pt-BR profissional.

## Paleta

### Brand

| Token | Hex |
|---|---|
| `--brand-navy-950` | `#011B4B` |
| `--brand-navy-800` | `#01387E` |
| `--brand-blue-700` | `#0152AC` |
| `--brand-blue-600` | `#0175D1` |
| `--brand-cyan-500` | `#01A8E8` |
| `--brand-cyan-300` | `#06D5F4` |

### Semantic base

| Token | Hex |
|---|---|
| `--background` | `#F6FAFD` |
| `--surface` | `#FFFFFF` |
| `--surface-soft` | `#EEF6FB` |
| `--border` | `#D8E4EC` |
| `--text-primary` | `#0F172A` |
| `--text-secondary` | `#5F6F7F` |
| `--text-on-dark` | `#FFFFFF` |

### Estados funcionais

Success (verde clínico), Warning (âmbar), Danger (vermelho), Info (azul).  
Cor **nunca** sozinha: combinar ícone/texto + cor.

## Gradiente institucional

`#011B4B → #0152AC → #06D5F4`

Uso moderado: painel lateral de autenticação, hero, highlights, CTA especial ocasional.  
Não usar em todos os botões, cards, inputs ou tabelas.

## Contraste (WCAG AA)

- Texto branco: navy-950, navy-800, blue-700; blue-600 conforme tamanho/peso.
- Sobre cyan-500 / cyan-300: preferir texto navy-950. Evitar branco pequeno sobre cyan claro.

## Tipografia

**Geist Sans** (única família nesta fundação).  
Geist Mono reservado a dados técnicos futuros.

| Papel | Desktop | Mobile | Peso |
|---|---|---|---|
| Display / H1 | 36px | 30–32px | 650–700 |
| H2 | 28–30px | — | 600–650 |
| H3 | 20–24px | — | 600 |
| Body | 16px | 16px | 400 |
| Small / labels | 14px | 14px | labels 550–600 |

Valores clínicos futuros: `font-variant-numeric: tabular-nums` (ainda sem dados clínicos).

## Spacing, radius, shadows

- Controles (input/button): radius 10–12px (`--radius-control`).
- Cards: 12–16px (`--radius-card`).
- Cards: sombra quase ausente ou muito leve; modais/elevados um pouco maior.
- Sem sombras neon/azuis em massa. Sem “bubble UI”.

## Componentes

Base atual: `Logo`, `Button`, `Input`, `Field`, `Card`, `Alert`, `AuthShell`, `AppShell`, `PageHeader`.

### Botões

- **Primary:** bg `#0152AC`, texto branco, hover `#01387E`, focus ring acessível, disabled claro, loading sem layout shift.
- **Secondary:** superfície clara, border `#D8E4EC`, texto navy/ink; não compete com primary.
- **Danger:** só ações destrutivas reais (nenhuma exclusão de conta nesta etapa).

### Inputs

Altura confortável, label sempre visível, erro abaixo do campo (não só cor), focus blue/cyan institucional.

### Alert / Feedback

Tons `success | warning | error | info` com borda + fundo suave + texto.

## Autenticação

- **Desktop ≥ 1024px:** split — área institucional (~45–50%, navy/gradiente + logo) + formulário claro (~400–460px).
- **Mobile:** coluna — logo → título → descrição → formulário → links. Sem split.

Logomarca oficial: `public/brand/evolusg-logo.png` (fundo transparente). Não redesenhar, recolorir ou deformar. Alt: `evolUSG`. Sem placa/background/padding no compartimento da logo.

Favicon dedicado (somente símbolo): `PENDING BRAND ASSET` — não bloquear merge; não recortar o símbolo da logomarca automaticamente.

Home pública: conteúdo (logo + texto + CTAs) centralizado na viewport (horizontal e vertical).

## App shell

- Sidebar navy `#011B4B` (~240–260px) com logo, Início, Conta e área inferior.
- Topbar leve: título da página + identificação + sair.
- Mobile: drawer/menu.
- `/app`: boas-vindas reais (nome, estado da conta) — sem dashboard clínico fictício.
- `/app/conta`: seções Identidade, Segurança, Sessões.

## Densidade futura

Conceitos `comfortable` e `compact` documentados; **sem** seletor nesta etapa. Evitar componentes que inviabilizem densidade futura.

## Tabelas futuras (orientação)

Cabeçalho claro, linhas legíveis, hover discreto, números alinhados, `tabular-nums`, sticky header quando necessário, zebra moderada. **Não implementadas agora.**

## Acessibilidade

Teclado, `focus-visible`, labels, ARIA quando necessário, contraste AA, alvos adequados, erros associados aos campos, HTML semântico. Não remover outline sem substituição.

## Motion

150–220ms; hover/focus/menu/feedback discreto. Respeitar `prefers-reduced-motion`. Sem parallax, logo animada ou backgrounds pesados.

## Do / Don’t

**Do**

- Usar tokens centralizados.
- Manter microcopy pt-BR objetiva (“Entre na sua conta”).
- Mostrar loading/disabled em submits.
- Preservar proporção da logomarca oficial.

**Don’t**

- Inventar módulos clínicos na navegação.
- Usar cyan em todos os fundos.
- Exibir secrets, tokens ou IDs técnicos desnecessários.
- Implementar dark mode nesta fundação.
- Trocar regras de autenticação por conveniência visual.
