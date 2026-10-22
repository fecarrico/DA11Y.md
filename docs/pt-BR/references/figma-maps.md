# Mapas no canvas — a lista, o mapa, marcadores e controles

> **Escopo:** mapas embutidos e interativos (localizador de lojas, rastreio de entrega, seletor de área, mapa de cobertura), descritos em nós do Figma. Vale o Princípio Zero. Se a tarefa só pode ser concluída no mapa, ela não pode ser concluída.
> **Traduz:** o [`guide-maps.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-maps.md) do A11Y.md, fixado no commit `9fb9a02`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

**A lista é a alternativa do mapa.** Para uma parcela grande das pessoas ela é o caminho principal, e não um plano B (Seção 5). Com a lista pronta, o que resta é fazer o mapa em si não atrapalhar.

## 1. Onde ele aparece nos nós

Primeiro classifique o mapa. O agente sugere a classe e a pessoa confirma, porque dizer que um mapa é decorativo é decisão humana.

| Tipo | No canvas | O que ele deve |
| :--- | :--- | :--- |
| Decorativo | ilustração estilizada de uma cidade atrás de um título | fica escondido da tecnologia assistiva, e o endereço vem escrito em `TEXT`, como sempre |
| Estático informativo | nó com preenchimento de imagem mostrando um único local | é imagem ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-images.md)). A alternativa é o endereço, nunca "Mapa mostrando nossa localização" |
| Interativo | mover, dar zoom, marcadores clicáveis, filtros | tudo o que vem abaixo |

O mapa interativo, em nós:

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Seção | `FRAME` com auto layout vertical e um `TEXT` de título em primeiro lugar ("Lojas perto de 01310-100") | a ordem do auto layout é a ordem de leitura: título, mapa, lista |
| Área do mapa | `FRAME` com o mapa de base, que é um preenchimento de imagem com os tiles (os blocos de imagem do mapa) ou o lugar onde entra o mapa de um provedor | o nome dela é uma anotação (Seção 4) |
| Marcadores | `INSTANCE` do marcador da biblioteca, num `FRAME` próprio | forma, número ou rótulo além da cor |
| Rotas e áreas | `LINE`, `VECTOR` ou `POLYGON` | são gráficos com significado e pedem 3:1 (Seção 3) |
| Controles do mapa | `INSTANCE`s de botão ("Aproximar", "Afastar" e um para cada direção em que o mapa se move), cada uma num `FRAME` próprio | alvos de verdade, com nome ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md)), e nunca um ícone num `GROUP` |
| Rótulos que você põe no mapa | `TEXT` | seguem os pisos do perfil |
| Lista de resultados | `FRAME` com auto layout vertical e um `FRAME` por resultado, com nome, endereço, distância, status e ação | fica no fluxo e traz a informação e a ação de cada marcador |
| Campo de endereço | o campo de texto da biblioteca ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md)) | existe sempre que um pin pode ser arrastado para marcar um local |

## 2. Estados que o mapa precisa ter

Estado que falta na biblioteca é aviso da Seção 2, então aponte e desenhe só com autorização.

- **Foco no mapa.** A área do mapa é uma única parada de Tab, então ela tem um estado Focus.
- **Marcador:** Default, Hover, Focus e Selected. Quando o mapa segue a seleção da lista, o item da lista também tem o estado Selected, e os dois mostram a seleção além da cor.
- **Informação do hover também no foco.** O que um marcador mostra quando o mouse passa por cima (hover) aparece também no Focus ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-tooltips-popovers.md)) e está na lista.
- **Controles do mapa** vêm do botão da biblioteca, com o estado Focus dele.
- **Pausado, para rastreio ao vivo.** Rastreio que atualiza o tempo todo tem um controle de pausa visível (SC 2.2.2).
- **Filtrado.** A lista e o mapa mostram o mesmo conjunto filtrado.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Rotas, áreas e marcadores | o `strokes` ou o `fills` deles contra as cores em volta | 3:1 (SC 1.4.11). Quando o mapa de base é um preenchimento de imagem, nenhuma propriedade dá a cor atrás da linha. Registre o par como não testado e diga qual área alguém precisa conferir |
| Duas rotas ou zonas lado a lado | o `strokes` ou o `fills` de uma contra o da outra | 3:1 |
| Categoria além da cor | as variantes de marcador de cada categoria ("disponível", "lotado") lado a lado | muda a forma, o número ou o rótulo, e não só o `fills` (SC 1.4.1) |
| Rótulos que você põe | o `fills` do `TEXT` contra o que está atrás dele, e o `fontSize` | o piso do perfil (Seção 3 do DA11Y.md). Texto de mapa não é isento de nada |
| Texto dentro dos tiles | a imagem do mapa de base | não redimensiona e costuma falhar no contraste. O que importa é repetido em `TEXT` na lista |
| Marcadores como alvos | `width`, `height`, `minWidth` e `minHeight` do `FRAME` de cada marcador | o piso do perfil (Seção 3 do DA11Y.md). Marcador abaixo do piso só passa pela exceção de alvo equivalente dos SC 2.5.8 e 2.5.5, quando a lista oferece a mesma ação num alvo que cumpre o piso |
| Protótipo | `reactions` no mapa e nos marcadores | `ON_DRAG` que posiciona um pin sem campo de endereço é só arrasto. Informação do marcador em `ON_HOVER` ou `MOUSE_ENTER` sem caminho por foco ou clique é só hover. `AFTER_TIMEOUT` que atualiza a posição precisa do controle de pausa |

Pinça e movimento com dois dedos não estão entre os gatilhos de protótipo (Seção 5 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). Os dois gestos precisam de botões como alternativa de ponteiro único (SC 2.5.1). Os botões de zoom substituem a pinça, e os de mover o mapa substituem os dois dedos.

## 4. O que vira anotação

**Na anotação da área do mapa ou do marcador**, no formato curto da Seção 5 do DA11Y.md:

- **Tipo**, que pode ser decorativo, estático informativo ou interativo.
- **Nome do mapa**, como "Mapa das lojas próximas", e nunca um frame sem nome. Com o mapa embutido de um provedor, esse nome também é o `title` do iframe.
- **Marcadores.** O nome de cada um ("Unidade Paulista, 1,2 km"), ou a decisão de que os marcadores se alcançam pela lista e o mapa segue a seleção dela. O segundo desenho é mais fácil de acertar.
- **Anúncio**, com o resultado, como "4 lojas na área visível". Nunca "mapa movido".

**No relatório**, como requisito para o desenvolvimento:

- **Teclado:** o mapa é uma única parada de Tab, em que se entra e de que se sai, `Esc` sempre devolve à página, as setas movem o mapa e `+`/`-` dão zoom.
- **Gestos**, como pinça e movimento com dois dedos, com os botões de zoom e de mover o mapa como alternativa.
- **Rastreio ao vivo** não reanuncia a cada atualização.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). Nas rotas e áreas, fixe `strokes` ou `fills` com a razão, ou "não testado" e a área. Nos marcadores e nos controles do mapa, fixe `minWidth` e `minHeight`. Nos rótulos, fixe `fills` e `fontSize`.

```markdown
3–5 · mapa "Mapa das lojas próximas"
3) 🔊 mapa "Mapa das lojas próximas"
4) 🔊 botão "Aproximar"
5) 🔊 botão "Afastar"
📢 ao mover ou filtrar: "4 lojas na área visível"
```

## 5. A lista ao lado do mapa

- **Tudo o que o mapa comunica é texto na lista:** o que tem aqui, a que distância, em que ordem, o que acontece se eu escolher. Cada item tem o nome, o endereço, a distância, o status e a ação ("Detalhes").
- **Mesma página, mesmos filtros.** A lista atualiza com os filtros que mudam o mapa.
- **Nunca faça do mapa o único jeito** de escolher um endereço, definir uma área de entrega, selecionar uma loja, confirmar uma localização ou ver um status.
- **Arrastar um pin nunca é o único jeito de marcar um local.** Um fluxo de arrastar o pin sem campo de endereço é um formulário que não se usa pelo teclado.

## 6. Quando a tarefa cria ou muda o mapa no design system

- **Descrição do marcador:** "Marcador de mapa. Use para mostrar um lugar num mapa interativo. Não use como único jeito de escolher um lugar, porque esse caminho é a lista ao lado do mapa. Apelidos: pin, map pin, marcador de local."
- **Propriedades:** no marcador, `State` (VARIANT) com Default, Hover, Focus e Selected, `Category` (VARIANT, com uma forma diferente por categoria) e `Number` (TEXT). No item da lista, `State` com Default, Focus e Selected.

## 7. Antipadrões no canvas

- **O mapa como único jeito** de fazer a tarefa, inclusive um pin para arrastar sem campo de endereço.
- **Mapa estático cuja alternativa é "Mapa mostrando nossa localização".**
- **"Verde = disponível, vermelho = lotado"** sem forma, número ou rótulo.
- **Informação só no hover do marcador.**
- **Zoom ou movimento só por gesto**, ou controles do mapa feitos de ícones num `GROUP`, sem caixa e sem nome.
- **O que importa só dentro dos tiles**, e rótulos que você pôs abaixo dos pisos do perfil.
- **Lista que não segue os filtros do mapa.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-maps.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-maps.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
