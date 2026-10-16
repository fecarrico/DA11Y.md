# Tooltips e popovers no canvas — gatilho, tooltip e painel

> **Escopo:** o tooltip, o popover e o gatilho dos dois, descritos em nós do Figma. O tooltip é um texto curto que aparece no hover e no foco de um controle. O popover é um painel que um controle abre, e ele pode ter controles dentro.
> **Traduz:** o [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-tooltips-popovers.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Gatilho | uma `INSTANCE` de botão ou de link dentro de um `FRAME` próprio | ele recebe foco, então é um controle, nunca um ícone solto ou texto comum ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md)) |
| Tooltip | `COMPONENT` com um `TEXT` num `FRAME` com auto layout que abraça o texto | texto curto, lido depois do nome do gatilho |
| Popover | `COMPONENT` com um `FRAME` em auto layout vertical | a ordem do auto layout é a ordem de leitura, e cada controle de dentro é um alvo |
| Lugar ao lado do gatilho | por cima da tela, por exemplo com `layoutPositioning: ABSOLUTE` | fora do fluxo, a ordem vem da geometria, então a anotação diz que ele é lido logo depois do gatilho |

## 2. Estados que o componente precisa ter

- **Gatilho: Default, Hover e Focus.** Focus que falta é aviso da Seção 2. Aponte a falta e desenhe o estado só com autorização.
- **Tooltip no hover e no foco.** O frame que mostra o tooltip aberto também põe o tooltip junto da variante Focus do gatilho. Se não puser, a anotação diz que ele aparece no foco.
- **Popover aberto**, ao lado do gatilho, com a aparência do gatilho enquanto o popover está aberto.

## 3. O que medir, a partir das propriedades

Além do piso do perfil (Seção 3 do DA11Y.md), o que é específico do tooltip e do popover:

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Protótipo | `reactions` | nenhum `AFTER_TIMEOUT` esconde o tooltip (SC 1.4.13) ou o popover. Aberto só por `ON_HOVER` ou `MOUSE_ENTER`, o popover é ação só de hover |

O hover no protótipo mostra só o caminho do ponteiro. O resto do SC 1.4.13 vai para a anotação.

## 4. O que vira anotação

**Na anotação da instância do gatilho**, com a leitura da Seção 4 do DA11Y.md no formato curto da Seção 5:

- **Nome do gatilho.** Com texto visível, o nome contém esse texto na mesma ordem (SC 2.5.3). Se o gatilho é só um ícone, dê o nome.
- **Texto do tooltip, lido depois do nome**, sem precisar abrir nada, no desktop e no celular.
- **Popover.** O conteúdo dele, controles incluídos, vem logo depois do gatilho na ordem de leitura.

**No relatório**, como requisito para o desenvolvimento:

- **Aparece no hover e no foco do teclado.**
- **As condições do SC 1.4.13.** O Esc fecha o tooltip sem mover o foco. Ele fica na tela quando o ponteiro passa para cima dele. Ele fica até a pessoa dispensar, até o gatilho perder o hover ou o foco, ou até a informação deixar de valer. Ele nunca some sozinho por tempo.
- **Popover.** Ele abre com Enter, clique ou toque. O Esc fecha.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). No `FRAME` do gatilho, fixe `minWidth` e `minHeight`. No texto do tooltip, fixe `fills` e `fontSize`.

```markdown
3 · botão só com ícone
🔊 botão "Informação sobre tarifas", com a descrição "Transferências para o exterior têm tarifa."
```

## 5. Tooltip ou popover

- **O tooltip nunca recebe foco.** O Esc fecha o tooltip enquanto o foco fica no gatilho. Link ou botão dentro dele não tem caminho pelo teclado (SC 2.1.1).
- **O popover é alcançado.** A pessoa abre o popover, e cada controle de dentro pode ser alcançado. Conteúdo com controle é popover.

## 6. Quando a tarefa cria ou muda o tooltip ou o popover no design system

- **Descrição, uma por componente:** "Tooltip. Use para um texto curto sobre um controle, mostrado no hover e no foco. Não use para conteúdo com links ou botões (use Popover). Apelidos: dica, balão de informação, hint." e "Popover. Use para um painel que um controle abre e que pode ter links e botões. Não use para uma decisão que precisa de resposta agora (use Dialog). Apelidos: flyout, hover card, painel flutuante."
- **Propriedades:** o `State` (VARIANT) do gatilho, com Default, Hover e Focus, e o `Text` (TEXT) do tooltip.

## 7. Antipadrões no canvas

- **Tooltip em algo que não recebe foco**, como um ícone solto ou um texto comum.
- **Tooltip desenhado só com o Hover**, sem nada dizendo que ele também aparece no foco.
- **Um `AFTER_TIMEOUT` que esconde o tooltip ou o popover.**
- **Link ou botão dentro de um tooltip.**
- **Popover que abre só no hover.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-tooltips-popovers.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
