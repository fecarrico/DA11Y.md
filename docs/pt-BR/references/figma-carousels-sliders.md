# Carrosséis no canvas — slides, pausa, Anterior e Próximo, pontos seletores

> **Escopo:** carrosséis, banners rotativos e sliders de conteúdo (os slides, o controle de pausa, Anterior e Próximo, os pontos seletores), descritos em nós do Figma. O slider que escolhe um valor numa faixa é um controle de formulário ([`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-form-controls.md)).
> **Traduz:** o [`guide-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-carousels-sliders.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

O avanço automático é o problema de acessibilidade. Todo o resto é um conjunto de slides com nome e com botões.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Carrossel | `FRAME` com auto layout, ou uma `INSTANCE` do carrossel da biblioteca, com o nome do que ele mostra | as anotações do carrossel ficam aqui |
| Controle de pausa | `INSTANCE` de botão num `FRAME` próprio, o **primeiro** filho na ordem do auto layout do carrossel | é o primeiro na ordem de foco, alcançável antes que a rotação mude qualquer coisa. Se fica por cima do slide com `layoutPositioning: ABSOLUTE`, ele sai do fluxo e a ordem passa a vir da geometria, então a anotação de ordem de foco diz que ele é o primeiro |
| Slide | `FRAME` ou `INSTANCE`, um por slide, com a posição no nome ("Slide 3 de 8") ou o título | texto sobre a imagem do slide fica sobre uma camada de contraste, o scrim (Seção 3) |
| Anterior e Próximo | `INSTANCE`s de botão, cada uma num `FRAME` no alvo mínimo do perfil | visíveis no estado padrão, nunca só no hover. Ver [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md) |
| Pontos seletores | uma `INSTANCE` de botão por slide, num `FRAME` com auto layout horizontal | cada ponto é um alvo. A caixa é o `FRAME` dele, nunca o desenho do ponto. Nunca um `GROUP` |

## 2. Estados que o componente precisa ter

Estado que falta na biblioteca é aviso da Seção 2, então aponte e desenhe só com autorização.

- **Controle de pausa com Playing e Paused.** Cada estado mostra o próprio ícone e o próprio nome ("Pausar", "Reproduzir"). Carrossel que avança sozinho por mais de 5 segundos sem estado pausado falha no SC 2.2.2.
- **Movimento reduzido.** Uma variante em que o avanço automático não começa, por exemplo `Motion=Reduced`, sem `AFTER_TIMEOUT`. É Regra da Casa†, em todos os perfis.
- **Foco** no controle de pausa, em Anterior, em Próximo e em cada ponto (Seção 3).
- **Ponto atual.** Compare as variantes do ponto. O atual muda em mais do que o preenchimento (tamanho, forma ou contorno), ou o carrossel mostra a posição em texto ("3 de 8"). Só o preenchimento falha no SC 1.4.1.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Avanço automático | `reactions` com `AFTER_TIMEOUT` nos slides ou nas variantes (Seção 5) | quando a rotação dura mais de 5 segundos, existe um controle de pausa visível e ele é o primeiro na ordem (SC 2.2.2, Nível A, em todos os perfis) |
| Movimento reduzido | `animations`, `timelines`, `animationStyles` e a cadeia de `AFTER_TIMEOUT` | existe uma variante sem movimento, e nada avança nela (Regra da Casa†) |
| Controles sem hover | `visible` de Anterior, Próximo e pausa na variante padrão, e reações `ON_HOVER` ou `MOUSE_ENTER` que os mostram | os controles aparecem sem hover (Seção 3 do DA11Y.md) |
| Só por deslize | reações `ON_DRAG` nos slides | Anterior e Próximo existem, com `ON_CLICK` ou `ON_PRESS` |
| Slide atual além da cor | as variantes atual e padrão do ponto lado a lado | algo além do preenchimento muda (SC 1.4.1) |
| Pontos e ícones dos controles | o `fills` e o `strokes` deles contra a cor de trás, inclusive a imagem do slide | 3:1 (SC 1.4.11), no pior caso da imagem |
| Texto nos slides | o `fills` do `TEXT` contra o scrim ou o preenchimento de trás, e o `fontSize` dele | o piso de texto do perfil (4.5:1 no Standard, 7:1 no Shield) e a fonte mínima (12px no Standard, 14px no Shield). Sobre imagem, num scrim medido no pior caso |
| Foco | o `strokes` e o `strokeWeight` da variante Focus contra a cor vizinha | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7). Sombra em `effects` sozinha não conta |
| Alvos | `width`, `height`, `minWidth` e `minHeight` do `FRAME` de cada controle e de cada ponto | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` do frame dos pontos e entre os controles | 8px entre alvos vizinhos (Regra da Casa†) |
| Texto que cresce | `textAutoResize` do texto do slide e `layoutSizingVertical` do slide | nada de `TRUNCATE`, `maxLines` ou altura `FIXED` que corte o texto no zoom de 200% |

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, no carrossel, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Papel e nome.** Um carrossel, com nome ("Produtos em destaque"). Cada slide é um "slide" que tem como nome a posição ("3 de 8") ou o título.
- **Ordem de foco.** A pausa vem primeiro, e depois o resto. Só o conteúdo do slide visível é alcançável. Os slides fora da tela ficam fora do foco e fora da árvore de acessibilidade.
- **A rotação para** no hover, quando o foco entra no carrossel e enquanto um tooltip está aberto. O slide em que o foco está nunca vai embora.
- **Os pontos** são botões com o nome do slide ("Slide 3: Coleção de primavera"), e o atual vem marcado como atual.
- **Anúncios.** Depois de Anterior ou Próximo, uma mensagem que não interrompe o leitor de tela (polite), com o texto exato ("Slide 4 de 8"). A rotação automática nunca é anunciada.
- **Movimento reduzido.** Quando a pessoa pede movimento reduzido, o avanço automático não começa.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). No `FRAME` de cada ponto e de cada controle, fixe `minWidth` e `minHeight`. No ponto atual, fixe `fills` e `strokes` com a razão medida.

```markdown
**Sugestão do agente — confirmar**
Carrossel "Produtos em destaque" · cada slide com o nome "n de 8" ou o título
Ordem de foco: Pausar → Anterior → Próximo → pontos → só o slide visível
A rotação para no hover, com foco dentro e com tooltip aberto · nunca começa com movimento reduzido
Depois de Próximo: "Slide 4 de 8" (polite) · rotação automática: silêncio
```

## 5. O avanço automático no protótipo

- **Onde ler.** Nos frames dos slides e em cada variante (`COMPONENT`). O `COMPONENT_SET` não tem protótipo, então não mostra nada.
- **O que conta.** Uma reação `AFTER_TIMEOUT` que leva ao slide seguinte é avanço automático. Siga a cadeia, porque o movimento é a rotação inteira, e não um `timeout` só. Cadeia que volta ao primeiro slide, ou que passa de 5 segundos no total, precisa do controle de pausa (SC 2.2.2). Ser decorativo não é isenção.
- **A pausa no protótipo.** O controle de pausa tem uma reação `ON_CLICK` que leva a um estado sem `AFTER_TIMEOUT`. Avanço automático sem estado pausado é aviso da Seção 2. A parada no foco e com tooltip aberto não dá para prototipar, então vai para a anotação.

## 6. Quando a tarefa cria ou muda o componente no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada ao carrossel:

- **Descrição:** "Carrossel. Use para mostrar um conjunto de slides um de cada vez, com Anterior, Próximo e pontos seletores, e com controle de pausa quando ele avança sozinho. Não use para escolher um valor numa faixa (use Slider). Apelidos: carrossel, carousel, slideshow, banner rotativo, slider de conteúdo."
- **Propriedades:** `Autoplay` (BOOLEAN), `Motion` (VARIANT: Default, Reduced), `Label` (TEXT) para o nome do carrossel. No controle de pausa, `Playback` (VARIANT: Playing, Paused). No ponto, `Current` (BOOLEAN) e `State` (VARIANT: Default, Hover, Focus).
- **Camadas com o nome do que são, na ordem de leitura, com a pausa primeiro:** Pause, Previous, Next, Slides, Picker.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, com o resultado medido de cada estado em cada modo.

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

Os papéis e nomes do carrossel e dos slides, Anterior, Próximo e os pontos como botões de verdade, o ponto atual, os slides fora da tela tirados do foco e da árvore de acessibilidade, o anúncio depois da ação da pessoa, a parada no hover e no foco e a preferência de movimento reduzido são implementados seguindo o [`guide-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-carousels-sliders.md) do A11Y.md. Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
