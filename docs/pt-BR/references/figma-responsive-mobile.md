# Layout responsivo no canvas — larguras, zoom, refluxo e alvos de toque

> **Escopo:** o layout web nas várias larguras de tela, o texto que cresce com o zoom, os alvos de toque e os gestos, em frames, auto layout e propriedades de texto do Figma. Telas de app (iOS, Android) ficam no [`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-platform-native.md).
> **Traduz:** o [`guide-responsive-mobile.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-responsive-mobile.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Onde isso aparece nos nós

| O quê | Nó e propriedade | Regra |
| :--- | :--- | :--- |
| Tela numa largura | `FRAME` filho direto da página, e o `width` dele | numa tela web, a unidade do arquivo vale como o CSS px |
| Conteúdo que se adapta | auto layout com `layoutSizingHorizontal` em `FILL` ou `HUG`, `layoutWrap`, `minWidth` e `maxWidth` | largura `FIXED` não acompanha a tela |
| Grade | `layoutMode: GRID` e `gridColumnCount` | o frame estreito mostra como as colunas se dobram |
| Elemento fora do fluxo | `layoutPositioning: ABSOLUTE` | o auto layout não posiciona esse elemento, então confira em cada largura |
| Texto | `textAutoResize`, `maxLines`, `textTruncation` e o `layoutSizingVertical` do contêiner | o texto que a pessoa lê cresce em altura |
| Alvo | a caixa do `FRAME` ou da `INSTANCE` interativa, com `width`, `height`, `minWidth` e `minHeight` | nunca o ícone dentro dela |
| Gesto | uma entrada de `reactions` com `ON_DRAG` | precisa de caminho por toque ou clique num controle visível |

## 2. As larguras que o desenho precisa mostrar

- **A tela mais estreita, com 320 de largura** (SC 1.4.10). São 320 CSS px, o mesmo que zoom de 400% numa janela de navegador (viewport) de 1280px. O código vai precisar desse layout. Se nenhum frame mostra esse layout, quem desenvolve inventa, como acontece com um estado que falta (Seção 2.1 do DA11Y.md).
- **Texto em 200%** (SC 1.4.4). O canvas não dá zoom no texto. As propriedades da Seção 3 mostram se o texto cresceria ou seria cortado.
- **Orientação** (SC 1.3.4). Desenho feito só em retrato não trava a orientação. Travar é uma decisão e precisa de motivo (Seção 4).

## 3. O que medir

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Refluxo (reflow) | no frame de 320, o `width` e o `absoluteBoundingBox` de cada filho contra o frame | nada é mais largo que o frame, então nada rola nas duas direções. Tabelas de dados, mapas e gráficos são a exceção e rolam dentro do próprio contêiner (SC 1.4.10) |
| Larguras fixas | `layoutSizingHorizontal` e `width` dos contêineres de texto e de controles | `FILL` ou `HUG`, com `maxWidth` quando for preciso. Contêiner `FIXED` mais largo que o frame quebra o refluxo |
| Texto que cresce | `textAutoResize`, `maxLines`, `textTruncation` e o `layoutSizingVertical` do contêiner | texto em `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de um contêiner `HUG`. `TRUNCATE`, `maxLines` ou altura `FIXED` cortam o texto em 200% (SC 1.4.4) e com o espaçamento de texto escolhido pelo usuário (SC 1.4.12) |
| Alvo | `width`, `height`, `minWidth` e `minHeight` da caixa interativa | o piso do perfil (Seção 3 do DA11Y.md). No Standard, alvo dentro de uma linha de texto é mais uma exceção (SC 2.5.8) |
| Espaçamento | `itemSpacing` entre alvos, e `counterAxisSpacing` entre linhas que quebram | o espaçamento da Regra da Casa† (Seção 3 do DA11Y.md), em todas as larguras |
| Gestos | reações com `ON_DRAG` | o mesmo resultado existe num controle desenhado e visível (SC 2.5.1) |

## 4. O que vira anotação

Cada item é uma anotação no frame da tela ou no nó (Seção 4 do DA11Y.md):

- **O que muda de lugar na largura estreita.** Diga para onde vai cada item que sai do layout (um botão de menu, um bloco que abre e fecha), para nenhum conteúdo e nenhuma função se perder.
- **Conteúdo que continua rolando nas duas direções** (tabela, mapa, gráfico). Diga qual contêiner rola, como exceção do SC 1.4.10.
- **Orientação.** A orientação não fica travada. Se o desenho trava, diga por que isso é essencial (SC 1.3.4).
- **Equivalentes de gesto.** Para cada deslize ou gesto com vários dedos, diga qual controle visível faz o mesmo (SC 2.5.1).

Fixe `width` no frame da tela, `minWidth` e `minHeight` em cada alvo, e `itemSpacing` no contêiner de alvos vizinhos.

```markdown
❓ com 320 de largura, a barra de filtros vira o botão "Filtros"? Proposta: sim
❓ a tabela "Histórico de pedidos" rola na horizontal dentro dela? Proposta: sim, exceção do SC 1.4.10
```

## 5. Antipadrões no canvas

- **Só um frame largo**, com o layout estreito deixado para quem desenvolve inventar.
- **Contêiner `FIXED` mais largo que 320** com texto ou controles dentro.
- **Texto numa caixa de altura `FIXED`, ou com `maxLines` ou `TRUNCATE`**, cortado em 200%.
- **Deslizar (`ON_DRAG`) como único jeito** de passar de um item para outro.
- **Conteúdo escondido na largura estreita** sem caminho para chegar a ele.

## 6. O que fica para o código

O zoom de verdade, o refluxo, as unidades relativas, a orientação e a área de toque são implementados seguindo o [`guide-responsive-mobile.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-responsive-mobile.md) do A11Y.md. A verificação desse guia roda no produto construído e entra no relatório como requisito para o desenvolvimento.
