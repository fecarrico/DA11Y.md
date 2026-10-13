# Arrastar e soltar no canvas — alça, menu Mover, alvos de soltura e zona de arquivo

> **Escopo:** listas reordenáveis, quadros kanban, zonas de soltar arquivo e qualquer coisa ordenável (o item, a alça dele, o menu Mover, o item enquanto se move e os alvos de soltura), descritos em nós do Figma.
> **Traduz:** o [`guide-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-drag-drop.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Arrastar é um atalho, nunca o mecanismo. Desenhe primeiro o desfecho (mover o item X para a posição Y) e depois três jeitos de chegar lá: arrastar, tocar ou clicar sem arrastar (o ponteiro único) e usar o teclado.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Lista ou coluna do quadro | `FRAME` com auto layout, com os itens como `INSTANCE`s | a ordem do auto layout é a ordem dos itens e a ordem de leitura |
| Item | `INSTANCE` da linha ou do card, com variante `State` | com o nome do conteúdo ("Fatura.pdf") |
| Alça | `INSTANCE` de botão de ícone num `FRAME` próprio, no alvo mínimo do perfil | um botão de verdade, com um nome que diz qual é o item. Um ícone solto (`VECTOR`) não tem caixa de alvo, e um `BOOLEAN_OPERATION` não aceita anotação |
| Menu Mover | uma `INSTANCE` de botão de menu no item, que abre Mover para cima, Mover para baixo e Mover para… | a alternativa de ponteiro único (SC 2.5.7), visível sem hover |
| Alvo de soltura | `FRAME` cujo estado de alvo acrescenta um contorno (`strokes`), um padrão ou uma linha de inserção (`LINE` ou `RECTANGLE`) | 3:1 e uma pista que não é cor |
| Zona de soltar arquivo | `FRAME` com um `TEXT` e uma `INSTANCE` de botão que abre o seletor de arquivos | Seção 5 |

## 2. Estados que o componente precisa ter

A propriedade `State` do item tem pelo menos **Default, Focus e Grabbed** (o item pego, em movimento). A alça e o botão de menu têm Focus. O alvo de soltura tem um estado para alvo válido, e outro para o alvo atual quando o desenho destaca esse alvo. Estado que falta na biblioteca é aviso da Seção 2. Aponte e desenhe só com autorização.

- **Foco durante o movimento.** A variante Grabbed mantém o contorno de foco, porque o foco visível acompanha o item durante o movimento inteiro (SC 2.4.7).
- **Grabbed além da cor.** Compare Default e Grabbed. Se só o preenchimento muda, o estado é mostrado só por cor.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Só por arrasto | reações `ON_DRAG` nos itens, nas alças e nas zonas (em cada `COMPONENT`, porque o `COMPONENT_SET` não tem protótipo) | o mesmo movimento também existe num controle desenhado, como o menu Mover ou o botão de arquivo. Sem isso, a ação é só por arrasto, e isso é 🔴 CRITICAL (SC 2.5.7) |
| Só por hover | `visible` da alça e do botão de menu na variante Default, e reações `ON_HOVER` ou `MOUSE_ENTER` que os mostram | os dois aparecem sem hover |
| Indicador de soltura | o `strokes` da variante de alvo, ou o `fills` ou o `strokes` da linha de inserção, contra a cor vizinha | 3:1 (SC 1.4.11) |
| Alvo além da cor | as variantes padrão e de alvo válido lado a lado | aparece um contorno, um padrão ou uma linha de inserção, e não só uma troca de preenchimento |
| Foco no Grabbed | o `strokes` e o `strokeWeight` da variante Grabbed contra a cor vizinha | o piso de foco do perfil (Seção 3 do DA11Y.md), o mesmo da variante Focus |

## 4. O que vira anotação

Cada item é uma anotação na alça ou na lista (Seção 4 do DA11Y.md):

- **Alça.** Um botão com o nome do item ("Reordenar Fatura.pdf") e instruções permanentes de como movê-lo, porque o padrão não dá para adivinhar.
- **Modelo de teclado.** `Espaço` ou `Enter` pega o item, as setas movem uma posição, `Espaço` solta e `Esc` cancela e devolve o item para onde estava. O foco fica no item o tempo todo.
- **Três anúncios, com o texto exato,** num só status que não interrompe o leitor de tela (polite). Por exemplo: "Fatura.pdf pego, posição 2 de 5" → "movido para a posição 3 de 5" → "solto na posição 3". No cancelamento, "reordenação cancelada, devolvido à posição 2". O alvo atual é dito no anúncio, e não só destacado.
- **Menu Mover.** As opções e o anúncio da nova posição.
- **App nativo.** Os mesmos movimentos expostos como ações personalizadas, as custom actions ([`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-platform-native.md)).
- **Zona de soltar arquivo.** O botão abre o seletor de arquivos.

Fixe `minWidth` e `minHeight` no `FRAME` da alça, e `strokes` e `strokeWeight` com a razão medida na variante de alvo (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)).

```markdown
**Decisão sua · proposta do agente**
Alça de "Fatura.pdf" · papel: botão · nome: Reordenar Fatura.pdf
Instruções (permanentes): Espaço ou Enter pega, setas movem, Espaço solta, Esc cancela
Anunciar (polite): "Fatura.pdf pego, posição 2 de 5" → "movido para a posição 3 de 5" → "solto na posição 3"
Esc: "reordenação cancelada, devolvido à posição 2" · o foco fica na alça
```

## 5. Três caminhos para o mesmo movimento, e a zona de arquivo

- **Arrastar.** `ON_DRAG` no protótipo. É um atalho.
- **Ponteiro único.** O menu Mover, ou a escolha da posição por número, desenhados. É também o caminho de quem usa controle por voz, acionador e toque com limitação motora.
- **Teclado.** A anotação da Seção 4. Uma reação `ON_KEY_DOWN`, quando o protótipo tem, mostra que o desenho previu o teclado, e ela não substitui a anotação.
- **Zona de soltar arquivo.** A zona vem com um botão visível que abre o seletor de arquivos ("Escolher arquivos"). "Arraste os arquivos para cá" como único caminho falha no SC 2.5.7 logo no primeiro passo do fluxo.

## 6. Quando a tarefa cria ou muda o componente no design system

- **Descrição:** "Item ordenável. Use numa lista ou num quadro que a pessoa pode reordenar, com a alça e o menu Mover. Não use numa lista de ordem fixa. Apelidos: alça de arrasto, drag handle, reordenar, sortable, card de kanban." Para a zona, "Zona de soltar arquivo. Sempre com o botão Escolher arquivos. Apelidos: dropzone, upload de arquivo, uploader."
- **Propriedades:** `State` (VARIANT: Default, Hover, Focus, Grabbed) e `Item name` (TEXT), o texto de onde sai o nome da alça. No alvo de soltura, `State` (VARIANT: Default, Valid target, Current target).

## 7. Antipadrões no canvas

- **Arrastar como único jeito** de reordenar ou de enviar arquivo.
- **Alça que é só um ícone**, sem caixa e sem nome, ou que só aparece no hover.
- **Menu Mover só no hover.**
- **Alvo de soltura mostrado só pela cor de fundo.**
- **Contorno de foco perdido no estado Grabbed.**
- **"Arraste os arquivos para cá" sem botão.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-drag-drop.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
