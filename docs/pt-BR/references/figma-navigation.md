# Navegação no canvas — regiões, menus, links, breadcrumbs e títulos

> **Escopo:** as regiões da tela, o skip link (o link que pula a navegação), menus e submenus, breadcrumbs (trilhas de navegação), links, a estrutura de títulos e o que se repete de uma tela para outra, descritos em nós do Figma.
> **Traduz:** o [`guide-navigation.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-navigation.md) do A11Y.md, fixado no commit `9fb9a02`, com o núcleo do A11Y.md sobre título da página (SC 2.4.2), foco não escondido (SC 2.4.11) e ajuda consistente (SC 3.2.6).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Tela | `FRAME` filho direto da página, com auto layout vertical | a ordem do auto layout das regiões é a ordem de leitura |
| Região (cabeçalho, navegação, conteúdo principal, rodapé, conteúdo lateral) | `FRAME` com o nome do que é: "Header", "Main navigation", "Main" | nunca um `GROUP`, que não aceita anotação e deixa a região sem nome |
| Skip link | `INSTANCE` com uma variante Focus (Seção 2) | vem primeiro na ordem de leitura (SC 2.4.1). Posicionado com `layoutPositioning: ABSOLUTE`, ele sai do fluxo, e a anotação de ordem o coloca em primeiro |
| Menu | `FRAME` com auto layout e uma `INSTANCE` de item para cada link | a ordem do auto layout é a ordem dos itens |
| Item de menu | `INSTANCE` de um `COMPONENT_SET`. A caixa dele é um `FRAME` com o `TEXT` do rótulo | o alvo é a caixa, nunca o texto |
| Botão de menu em tela pequena | `INSTANCE` de botão só com ícone | segue o [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md). Menu que abre como gaveta sobre a página segue o [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-modals.md) |
| Breadcrumb | `FRAME` com auto layout horizontal e a página atual por último | é uma região de navegação própria, chamada "Breadcrumb", e uma lista ordenada. O último item é marcado como "página atual" |
| Link no texto corrido | trecho de `TEXT` com `hyperlink` (`getStyledTextSegments`) | Seção 5 |
| Título (H1 a H6) | `TEXT` | o nível vem da estrutura, nunca do tamanho (Seção 5) |

## 2. Estados que os componentes precisam ter

Estado que falta na biblioteca é aviso da Seção 2. Aponte a falta e desenhe o estado só com autorização.

- **Item de menu:** Default, Hover e Focus, cada um com `Current` ligado e desligado. O item atual aparece por mais do que a cor, com sublinhado, barra, peso ou ícone.
- **Atual com foco.** Quem percorre o menu com Tab chega ao item atual. Ou o conjunto tem essa combinação, ou o contorno de foco continua chegando a 3:1 por cima da aparência de Current.
- **Gatilho de submenu:** Collapsed e Expanded, cada um com Focus.
- **Skip link.** Ele precisa de Focus, porque é o estado em que aparece. Sem esse estado, ninguém vê o skip link e quem desenvolve inventa um.

## 3. O que medir, a partir das propriedades

Além do piso do perfil (Seção 3 do DA11Y.md), o que é específico da navegação:

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Indicador do item atual | o `fills` ou o `strokes` dele contra a cor em volta | o piso do perfil (Seção 3 do DA11Y.md) |
| Alvo | `minWidth` e `minHeight` do `FRAME` de cada item, de cada link do breadcrumb e do botão de menu | o piso do perfil (Seção 3 do DA11Y.md). Link dentro do texto corrido entra na exceção de alvo em linha (SC 2.5.8, e SC 2.5.5 no Shield) |
| Só por hover | `reactions` do gatilho de submenu | o submenu não abre só com `ON_HOVER` ou `MOUSE_ENTER`, porque assim teclado e toque nunca chegam a ele (🔴, Seção 1 do DA11Y.md) |
| Outra aba | ação `URL` com `openInNewTab` | o texto do link ou o nome anotado diz "abre em nova aba" |

## 4. O que vira anotação

**Na anotação do elemento**, com a leitura da Seção 4 do DA11Y.md no formato curto da Seção 5:

- **No frame da tela:**
  - o título da página (SC 2.4.2), único no produto e com a parte mais específica primeiro, como em `Fatura #482 · <produto>`
  - a ordem de leitura numerada, com o skip link em primeiro
  - a estrutura de títulos (Seção 5)
- **No menu**, a anotação diz "lista, N itens" e marca "página atual" no item desta tela.

**No relatório**, como requisito para o desenvolvimento:

- **No frame da tela:**
  - as regiões, com um nome diferente para cada uma que se repete ("Navegação principal", "Breadcrumb", "Navegação do rodapé")
  - a ordem de foco numerada, com o skip link em primeiro e o conteúdo principal como destino dele
- **Na tela de destino aberta sem recarregar**, o foco vai para o H1 do conteúdo novo ou para o topo da página, e o título muda.
- **No cabeçalho que fica parado enquanto a página rola**, o foco do que passa por baixo dele nunca fica escondido por inteiro (SC 2.4.11).
- **No menu**, cada submenu abre com `Enter`, clique ou toque e fecha com `Esc`.

Fixe na anotação o valor medido: `minHeight` no item, `fills` no rótulo e no indicador do item atual, `itemSpacing` no menu, `textStyleId` e `fontSize` em cada título.

```markdown
1–3 · cabeçalho
1) 🔊 link "Pular para o conteúdo"
2) 🔊 link "Início" (logo)
3) 🔊 navegação "Navegação principal", 5 itens, página atual: "Pedidos"
```

## 5. Links, títulos e a mesma navegação em todas as telas

- **O texto do link diz aonde ele leva** (SC 2.4.4). Quando os cards repetem "Leia mais", a anotação dá a cada um o nome formado pelo título do card e pelo texto visível.
- **Link para arquivo** diz o formato e, se possível, o tamanho, como em "Baixar o relatório anual (PDF, 2 MB)".
- **Títulos** (SC 2.4.6, 1.3.1). Um H1 por tela, que descreve a tela. Os níveis não pulam, porque um H2 seguido de H4 é um buraco no sumário. O texto do título descreve a seção que ele abre. `textStyleId`, `fontSize` e `fontWeight` são pistas, nunca o nível. Texto do corpo em negrito que abre uma seção é título.
- **Listas.** Itens relacionados em sequência formam uma lista, e o menu também. Lista dentro de um `TEXT` é declarada como lista (`getRangeListOptions`), e não feita com caracteres digitados.
- **A mesma navegação em todas as telas** (SC 3.2.3, 3.2.4). Cabeçalho e menu são instâncias do mesmo componente principal em todas as telas do fluxo. Compare o `mainComponent` e a ordem dos itens entre as telas, com a ajuda incluída (SC 3.2.6).
- **Breadcrumb** (SC 2.4.8, AAA). No Shield, o SC 2.4.8 se aplica, e o breadcrumb é um jeito de cumpri-lo. No Standard, ele é recomendado para qualquer hierarquia com mais de dois níveis.
- **Navegação lateral com seções que expandem é navegação, e não árvore** (Seção 1 do [`figma-treeview.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-treeview.md)).

## 6. Quando a tarefa cria ou muda a navegação no design system

- **Descrição:** "Navegação principal. Use para os links que se repetem em todas as telas. Não use para ações na página (use Button) nem para escolher dentro de uma hierarquia (use Tree view). Apelidos: nav, menu, navbar, barra superior."
- **Propriedades:** `State` (VARIANT: Default, Hover, Focus), `Current` e `Expanded` (VARIANT), `Label` (TEXT), `Has submenu` (BOOLEAN).

## 7. Antipadrões no canvas

- **Submenu que abre só no hover.**
- **Link para outra aba que não avisa.**
- **Título escolhido pelo tamanho**, ou texto em negrito que abre uma seção e fica fora da estrutura de títulos.
- **Navegação redesenhada numa tela**, fora do componente principal comum ou com os itens em outra ordem.
- **Skip link sem o estado Focus desenhado.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-navigation.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-navigation.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
