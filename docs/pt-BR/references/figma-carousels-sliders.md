# Carrosséis no canvas — slides, pausa, Anterior e Próximo, pontos seletores

> **Escopo:** carrosséis, banners rotativos e sliders de conteúdo (os slides, o controle de pausa, Anterior e Próximo, os pontos seletores), descritos em nós do Figma. O slider que escolhe um valor numa faixa é um controle de formulário ([`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-form-controls.md)).
> **Traduz:** o [`guide-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-carousels-sliders.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

O avanço automático é o problema de acessibilidade. Todo o resto é um conjunto de slides com nome e com botões.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Carrossel | `FRAME` com auto layout, ou uma `INSTANCE` do carrossel da biblioteca, com o nome do que ele mostra | as anotações do carrossel ficam aqui |
| Controle de pausa | `INSTANCE` de botão num `FRAME` próprio, o **primeiro** filho na ordem do auto layout do carrossel | é o primeiro na ordem de foco, alcançável antes que a rotação mude qualquer coisa. Se fica por cima do slide com `layoutPositioning: ABSOLUTE`, ele sai do fluxo e a ordem passa a vir da geometria, então a anotação de ordem de foco diz que ele é o primeiro |
| Slide | `FRAME` ou `INSTANCE`, um por slide, com a posição no nome ("Slide 3 de 8") ou o título | texto sobre a imagem do slide fica sobre uma camada de contraste, o scrim (Seção 3) |
| Anterior e Próximo | `INSTANCE`s de botão, cada uma num `FRAME` no alvo mínimo do perfil | visíveis no estado padrão, nunca só no hover. Ver [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md) |
| Pontos seletores | uma `INSTANCE` de botão por slide, num `FRAME` com auto layout horizontal | cada ponto é um alvo. A caixa é o `FRAME` dele, nunca o desenho do ponto. Nunca um `GROUP` |

## 2. Estados que o componente precisa ter

Estado que falta na biblioteca é aviso da Seção 2, então aponte e desenhe só com autorização.

- **Controle de pausa com Playing e Paused.** Cada estado mostra o próprio ícone e o próprio nome ("Pausar", "Reproduzir"). Carrossel que avança sozinho por mais de 5 segundos sem estado pausado falha no SC 2.2.2.
- **Movimento reduzido.** Uma variante em que o avanço automático não começa, por exemplo `Motion=Reduced`, sem `AFTER_TIMEOUT`. É Regra da Casa†, em todos os perfis.
- **Ponto atual.** Compare as variantes do ponto. O atual muda em mais do que o preenchimento (tamanho, forma ou contorno), ou o carrossel mostra a posição em texto ("3 de 8"). Só o preenchimento falha no SC 1.4.1.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Avanço automático | `reactions` com `AFTER_TIMEOUT` nos slides ou nas variantes (Seção 5) | quando a rotação dura mais de 5 segundos, existe um controle de pausa visível e ele é o primeiro na ordem (SC 2.2.2, Nível A, em todos os perfis) |
| Movimento reduzido | `animations`, `timelines`, `animationStyles` e a cadeia de `AFTER_TIMEOUT` | existe uma variante sem movimento, e nada avança nela (Regra da Casa†) |
| Controles sem hover | `visible` de Anterior, Próximo e pausa na variante padrão, e reações `ON_HOVER` ou `MOUSE_ENTER` que os mostram | os controles aparecem sem hover |
| Só por deslize | reações `ON_DRAG` nos slides | Anterior e Próximo estão desenhados |
| Pontos e ícones dos controles | o `fills` e o `strokes` deles contra a cor de trás, inclusive a imagem do slide | 3:1 (SC 1.4.11), no pior caso da imagem |
| Texto nos slides | o `fills` do `TEXT` contra o scrim ou o preenchimento de trás | o piso do perfil (Seção 3 do DA11Y.md), num scrim medido no pior caso da imagem |
| Espaçamento | `itemSpacing` do frame dos pontos | o espaçamento da Regra da Casa† (Seção 3 do DA11Y.md). Faltar é aviso, e nunca falha |
| Texto que cresce | `layoutSizingVertical` do slide | nenhuma altura `FIXED` que corte o texto do slide no zoom de 200% |

## 4. O que vira anotação

Cada item é uma anotação no carrossel:

- **Papel e nome.** Um carrossel, com nome ("Produtos em destaque"). Cada slide é um "slide" que tem como nome a posição ("3 de 8") ou o título.
- **Ordem de foco.** A pausa vem primeiro, e depois o resto. Só o conteúdo do slide visível é alcançável. Os slides fora da tela ficam fora do foco e fora da árvore de acessibilidade.
- **A rotação para** no hover, quando o foco entra no carrossel e enquanto um tooltip está aberto. O slide em que o foco está nunca vai embora.
- **Os pontos** são botões com o nome do slide ("Slide 3: Coleção de primavera"), e o atual vem marcado como atual.
- **Anúncios.** Depois de Anterior ou Próximo, uma mensagem que não interrompe o leitor de tela (polite), com o texto exato ("Slide 4 de 8"). A rotação automática nunca é anunciada.
- **Movimento reduzido.** Quando a pessoa pede movimento reduzido, o avanço automático não começa.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). No `FRAME` de cada ponto e de cada controle, fixe `minWidth` e `minHeight`. No ponto atual, fixe `fills` e `strokes` com a razão medida.

```markdown
5–8 · carrossel "Produtos em destaque"
5) 🔊 botão "Pausar"
6) 🔊 botão "Anterior"
7) 🔊 botão "Próximo"
8) 🔊 cada slide: "4 de 8"
📢 depois de Próximo: "Slide 4 de 8" · na rotação automática, nada
```

## 5. O avanço automático no protótipo

- **Onde ler.** Nos frames dos slides e em cada variante (`COMPONENT`). O `COMPONENT_SET` não tem protótipo, então não mostra nada.
- **O que conta.** Uma reação `AFTER_TIMEOUT` que leva ao slide seguinte é avanço automático. Siga a cadeia, porque o movimento é a rotação inteira, e não um `timeout` só. Cadeia que volta ao primeiro slide, ou que passa de 5 segundos no total, precisa do controle de pausa (SC 2.2.2). Ser decorativo não é isenção.
- **A pausa.** O controle de pausa desenhado e visível basta, e a reação dele no protótipo é opcional. A parada no foco e com tooltip aberto vai para a anotação.

## 6. Quando a tarefa cria ou muda o componente no design system

- **Descrição:** "Carrossel. Use para mostrar um conjunto de slides um de cada vez, com Anterior, Próximo e pontos seletores, e com controle de pausa quando ele avança sozinho. Não use para escolher um valor numa faixa (use Slider). Apelidos: carrossel, carousel, slideshow, banner rotativo, slider de conteúdo."
- **Propriedades:** `Autoplay` (BOOLEAN), `Motion` (VARIANT: Default, Reduced), `Label` (TEXT) para o nome do carrossel. No controle de pausa, `Playback` (VARIANT: Playing, Paused). No ponto, `Current` (BOOLEAN) e `State` (VARIANT: Default, Hover, Focus).

## 7. Antipadrões no canvas

- **Avanço automático sem pausa**, ou pausa que só aparece no hover.
- **Controle de pausa no fim da ordem**, ou por cima do slide com `ABSOLUTE` e sem ordem anotada.
- **Slide atual mostrado só pelo preenchimento do ponto.**
- **Pontos feitos só do desenho**, sem caixa de alvo própria, ou dentro de um `GROUP`.
- **Anterior e Próximo só no hover.**
- **Deslizar como único jeito** de trocar de slide.
- **Texto sobre a imagem do slide sem scrim medido.**
- **Anotação que anuncia a rotação automática.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-carousels-sliders.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
