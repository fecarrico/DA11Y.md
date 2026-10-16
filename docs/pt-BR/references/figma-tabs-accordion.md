# Abas e acordeões no canvas — lista de abas, aba, painel e cabeçalho do acordeão

> **Escopo:** a lista de abas e os painéis dela, e o acordeão com os cabeçalhos e os painéis dele, descritos em nós do Figma.
> **Traduz:** o [`guide-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-tabs-accordion.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

As abas mostram um painel por vez. O acordeão abre e fecha seções no próprio lugar. Nos dois, o painel vem logo depois do controle dele, porque é ali que a leitura continua.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Lista de abas | `FRAME` com auto layout horizontal e uma `INSTANCE` para cada aba | a ordem do auto layout é a ordem das abas. Nunca um `GROUP` |
| Aba | `INSTANCE` de um `COMPONENT_SET` com `State` e `Selected`. A caixa dela é um `FRAME` com o `TEXT` do rótulo | a caixa é o alvo. O indicador de seleção (barra, sublinhado) é uma forma dentro da caixa |
| Painel da aba | `FRAME` logo depois da lista de abas, no auto layout do pai | aparece um painel por vez, o da aba selecionada |
| Acordeão | `FRAME` com auto layout vertical e uma `INSTANCE` de item para cada seção | a ordem do auto layout é a ordem das seções |
| Item do acordeão | `COMPONENT_SET` com `State` e `Expanded`, em auto layout vertical: Header, Panel | o painel vem logo depois do cabeçalho dele |
| Cabeçalho do acordeão | `FRAME` com o `TEXT` do título e uma `INSTANCE` de ícone de seta (chevron) | o cabeçalho inteiro é o alvo, nunca o chevron |
| Painel do acordeão | `FRAME` dentro do item, depois do cabeçalho | com `Expanded` desligado ele não existe ou fica com `visible: false`, e assim o conteúdo dele sai da ordem de leitura |

## 2. Estados que os componentes precisam ter

Estado que falta na biblioteca é aviso da Seção 2. Aponte a falta e desenhe o estado só com autorização.

- **Aba:** Default, Hover e Focus, cada um com `Selected` ligado e desligado. A aba selecionada aparece por mais do que a cor, com barra, sublinhado ou peso junto com a cor.
- **Selecionada com foco.** Quem entra na lista de abas pousa na aba selecionada, então as duas coisas sempre se encontram. Ou o conjunto tem essa combinação, ou o contorno de foco continua chegando a 3:1 por cima da aparência de Selected.
- **Cabeçalho do acordeão:** Default, Hover e Focus, cada um com `Expanded` ligado e desligado. O foco fica no cabeçalho depois que ele abre ou fecha, então o Focus é desenhado nos dois. O chevron muda de direção e o painel aparece, e assim o estado nunca depende só da cor.

## 3. O que medir, a partir das propriedades

Além do piso do perfil (Seção 3 do DA11Y.md), o que é específico das abas e dos acordeões:

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto da aba e do cabeçalho | o `fills` do `TEXT` contra o preenchimento do ancestral mais próximo, com `Selected` ligado e desligado | o piso vale também com `Selected` desligado, porque aba não selecionada não é aba desabilitada |
| Indicador de seleção e chevron | o `fills` ou o `strokes` deles contra a cor em volta | o piso do perfil (Seção 3 do DA11Y.md) |
| Só por hover | `reactions` das abas e dos cabeçalhos | trocar de aba ou abrir um painel nunca acontece só por `ON_HOVER` ou `MOUSE_ENTER` |

## 4. O que vira anotação

**Na anotação da lista de abas ou do acordeão**, com a leitura da Seção 4 do DA11Y.md no formato curto da Seção 5:

- **Abas.** A anotação dá o nome da lista de abas, "aba, n de N" em cada aba e "selecionada" na ativa. O painel da aba vem logo em seguida na ordem de leitura.
- **Acordeão.** Cada cabeçalho é um botão que diz "recolhido" ou "expandido". O conteúdo de um painel fechado é pulado.

**No relatório**, como requisito para o desenvolvimento:

- **Abas.** No teclado, a lista inteira é uma parada só, `←` e `→` andam entre as abas e `Tab` entra no painel.
- **Acordeão.** `Enter` ou `Espaço` abre e fecha o painel, e o foco fica no cabeçalho.

Fixe na anotação o valor medido: `minHeight` na aba e no cabeçalho, `fills` no indicador de seleção, `itemSpacing` na lista de abas.

```markdown
2–4 · abas "Detalhes do pedido"
2) 🔊 aba "Itens", 1 de 3, selecionada
3) 🔊 aba "Entrega", 2 de 3
4) 🔊 aba "Pagamento", 3 de 3
```

## 5. Abas só quando são abas

Abas são um dos casos em que a aparência engana (Seção 4 do DA11Y.md). Uma fileira que mostra um painel por vez, no próprio lugar, é aba. Uma fileira que leva a pessoa para outras telas é navegação ([`figma-navigation.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-navigation.md)). Uma faixa de miniaturas ou um conjunto de filtros é uma fileira de botões ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md)). Anotar uma fileira como abas promete o padrão inteiro, com lista de abas, abas, painéis e setas do teclado. Meio padrão é pior do que botões simples (Seção 6 do núcleo do A11Y.md).

## 6. Quando a tarefa cria ou muda abas ou acordeões no design system

- **Descrição, uma por componente:** "Abas. Use para alternar entre painéis de conteúdo relacionado na mesma tela, um por vez. Não use para ir a outra tela (use Navigation) nem para abrir várias seções ao mesmo tempo (use Accordion). Apelidos: tabs, tab bar, barra de abas." e "Acordeão. Use para seções que a pessoa abre e fecha no próprio lugar. Não use para alternar entre visões (use Tabs). Apelidos: accordion, collapsible, expansível, sanfona, disclosure."
- **Propriedades:** na aba, `State` (VARIANT: Default, Hover, Focus), `Selected` (VARIANT) e `Label` (TEXT). No item do acordeão, `State`, `Expanded` (VARIANT) e `Title` (TEXT).

## 7. Antipadrões no canvas

- **Aba não selecionada abaixo do piso de texto**, como se estivesse desabilitada.
- **O chevron como único alvo** do cabeçalho do acordeão.
- **Aba ou painel que abre só no hover.**
- **Fileira anotada como abas** que é navegação, faixa de miniaturas ou conjunto de filtros.

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-tabs-accordion.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
