# Tooltips e popovers no canvas — gatilho, tooltip e painel

> **Escopo:** o tooltip, o popover e o gatilho dos dois, descritos em nós do Figma. O tooltip é um texto curto que aparece no hover e no foco de um controle. O popover é um painel que um controle abre, e ele pode ter controles dentro.
> **Traduz:** o [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-tooltips-popovers.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Gatilho | uma `INSTANCE` de botão ou de link dentro de um `FRAME` próprio | ele recebe foco, então é um controle, nunca um ícone solto ou texto comum ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md)) |
| Tooltip | `COMPONENT` com um `TEXT` num `FRAME` com auto layout que abraça o texto | texto curto, lido depois do nome do gatilho |
| Popover | `COMPONENT` com um `FRAME` em auto layout vertical | a ordem do auto layout é a ordem de leitura, e cada controle de dentro é um alvo |
| Lugar ao lado do gatilho | por cima da tela, por exemplo com `layoutPositioning: ABSOLUTE` | fora do fluxo, a ordem vem da geometria, então a anotação diz que ele é lido logo depois do gatilho |

Nunca use um `GROUP` para nenhum deles, porque o grupo não tem caixa para medir nem aceita anotação.

## 2. Estados que o componente precisa ter

- **Gatilho: Default, Hover e Focus.** Focus que falta é aviso da Seção 2. Aponte a falta e desenhe o estado só com autorização.
- **Tooltip no hover e no foco.** O frame que mostra o tooltip aberto também põe o tooltip junto da variante Focus do gatilho. Se não puser, a anotação diz que ele aparece no foco.
- **Popover aberto**, ao lado do gatilho, com a aparência do gatilho enquanto o popover está aberto.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto do tooltip e do popover | o `fills` do `TEXT` contra o `fills` do tooltip ou do popover | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| Ícone do gatilho | o `fills` ou o `strokes` do ícone contra o preenchimento atrás dele | 3:1 (SC 1.4.11) |
| Foco do gatilho | o `strokes` e o `strokeWeight` da variante Focus contra a cor vizinha | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7). Sombra em `effects` sozinha não conta |
| Alvo do gatilho e do popover | `width`, `height`, `minWidth`, `minHeight` de cada `FRAME`, nunca do ícone | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` em volta do gatilho e entre os controles do popover | 8px entre alvos vizinhos (Regra da Casa†) |
| Texto que cresce | `textAutoResize` do texto, `layoutSizingVertical` do contêiner dele | `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de `HUG`. `TRUNCATE`, `maxLines` ou altura `FIXED` cortam o texto no zoom de 200% |
| Tamanho da fonte | `fontSize` do texto do tooltip e do popover | a fonte mínima do perfil: 12px no Standard, 14px no Shield |
| Protótipo | `reactions` | nenhum `AFTER_TIMEOUT` esconde o tooltip (SC 1.4.13) ou o popover. O popover abre com `ON_CLICK` ou `ON_PRESS`. Aberto só por `ON_HOVER` ou `MOUSE_ENTER`, ele é ação só de hover |

O hover no protótipo mostra só o caminho do ponteiro. O resto do SC 1.4.13 vai para a anotação.

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, na instância do gatilho, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Nome do gatilho.** Com texto visível, o nome contém esse texto na mesma ordem (SC 2.5.3). Se o gatilho é só um ícone, dê o nome.
- **Texto do tooltip, lido depois do nome**, sem precisar abrir nada, no desktop e no celular.
- **Aparece no hover e no foco do teclado.**
- **As condições do SC 1.4.13.** O Esc fecha o tooltip sem mover o foco. Ele fica na tela quando o ponteiro passa para cima dele. Ele fica até a pessoa dispensar, até o gatilho perder o hover ou o foco, ou até a informação deixar de valer. Ele nunca some sozinho por tempo.
- **Popover.** Ele abre com Enter, clique ou toque. O Esc fecha. O conteúdo dele, controles incluídos, vem logo depois do gatilho na ordem de leitura.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). No `FRAME` do gatilho, fixe `minWidth` e `minHeight`. No texto do tooltip, fixe `fills` e `fontSize`.

```markdown
**Sugestão do agente — confirmar**
Gatilho "Informação sobre tarifas" (botão só com ícone) · nome: Informação sobre tarifas
Tooltip: "Transferências para o exterior têm tarifa." (lido depois do nome · no hover e no foco)
Esc fecha, o foco fica no gatilho · fica sob o ponteiro · nunca some por tempo
```

## 5. Tooltip ou popover

- **O tooltip nunca recebe foco.** O Esc fecha o tooltip enquanto o foco fica no gatilho. Link ou botão dentro dele não tem caminho pelo teclado (SC 2.1.1).
- **O popover é alcançado.** A pessoa abre o popover, e cada controle de dentro pode ser alcançado. Conteúdo com controle é popover.

## 6. Quando a tarefa cria ou muda o tooltip ou o popover no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md:

- **Descrição do tooltip:** "Tooltip. Use para um texto curto sobre um controle, mostrado no hover e no foco. Não use para conteúdo com links ou botões (use Popover). Apelidos: dica, balão de informação, hint."
- **Descrição do popover:** "Popover. Use para um painel que um controle abre e que pode ter links e botões. Não use para uma decisão que precisa de resposta agora (use Dialog). Apelidos: flyout, hover card, painel flutuante."
- **Propriedades:** o `State` (VARIANT) do gatilho, com Default, Hover e Focus, e o `Text` (TEXT) do tooltip.
- **Camadas na ordem de leitura:** Trigger, depois Tooltip text ou Popover content.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, mais as condições do SC 1.4.13. Elas ficam como não testadas até o código verificar.

## 7. Antipadrões no canvas

- **Tooltip em algo que não recebe foco**, como um ícone solto ou um texto comum.
- **Tooltip desenhado só com o Hover**, sem nada dizendo que ele também aparece no foco.
- **Um `AFTER_TIMEOUT` que esconde o tooltip ou o popover.**
- **Link ou botão dentro de um tooltip.**
- **Popover que abre só no hover.**

## 8. O que fica para o código

O papel e o nome do gatilho, a ligação entre o gatilho e o tooltip, aparecer no foco, o Esc sem mover o foco, ficar sob o ponteiro, nunca sumir por tempo, e a abertura, o fechamento e o lugar do popover na ordem de foco são implementados seguindo o [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-tooltips-popovers.md) do A11Y.md. Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
