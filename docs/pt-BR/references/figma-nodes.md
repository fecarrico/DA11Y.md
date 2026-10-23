# Os nós do Figma e o que a API oferece — a base para desenhar acessível

> **Escopo:** o que cada tipo de nó do Figma pode carregar, ler e escrever, e onde a acessibilidade cabe (e não cabe) nesse modelo. É a fundação dos guias de componente do DA11Y.md.
> **Fontes, conferidas em 09/10/2026:** tipos oficiais da Plugin API, `@figma/plugin-typings` **1.141.0** (publicado em 05/10/2026), e a especificação OpenAPI da REST, `figma/rest-api-spec` **0.44.0** (07/10/2026). Tudo o que não vem dessas duas fontes está marcado.

## 0. As portas de acesso

| Porta | Quem usa | Lê | Escreve |
| :--- | :--- | :--- | :--- |
| **Plugin API** | plugins, o `use_figma` do MCP oficial e, pelo que a documentação sugere, o agente do Figma | tudo, incluindo a seleção | tudo |
| **REST API** | ferramentas de fora, com token | o arquivo inteiro e imagens renderizadas; não vê a seleção | só comentários, recursos de dev, webhooks e (Enterprise) variáveis — **nunca camadas** |

Os nomes de layout e aparência são os mesmos nas duas (`layoutMode`, `itemSpacing`, `fills`…). As diferenças que importam estão na Seção 6.

## 1. O que não existe: nenhum campo de acessibilidade
A Plugin API **não tem** papel, nome acessível, texto alternativo, nível de título, ordem de foco nem região. Nenhum tipo de nó carrega isso. Toda essa camada só existe em três lugares, por convenção:

1. **Anotação** (Seção 4) — o canal certo, visível no Dev Mode.
2. **Nome da camada** — lido por agentes como pista, e por isso ele não pode mentir.
3. **Descrição do componente** (`description`, `descriptionMarkdown`) — o contexto que acompanha o componente para onde ele for.

O Figma Sites tem campos próprios de semântica (tags HTML, `alt`, `aria-label`, `role`), mas eles não aparecem nos tipos da Plugin API usados no Figma Design.

## 2. Os tipos de nó

A Plugin API define **34 tipos de nó de cena**. Os que importam para desenhar interface:

| Tipo | O que é | Auto layout | Aceita anotação | Para acessibilidade |
| :--- | :--- | :--- | :--- | :--- |
| `FRAME` | container; filho direto da página = uma tela | ✅ (incl. `GRID`) | ✅ | a caixa do frame interativo é a **área de toque**; a ordem do auto layout é a **ordem estrutural** |
| `COMPONENT` | componente principal | ✅ | ✅ | onde a correção de verdade acontece; carrega descrição e propriedades |
| `COMPONENT_SET` | conjunto de variantes | ✅ | ✅ | onde se confere se os estados obrigatórios existem; **não tem protótipo** (`ReactionMixin` ausente) |
| `INSTANCE` | uso de um componente | ✅ | ✅ | o papel vem do componente principal, que se lê com `getMainComponentAsync()`. O `remote` do principal diz se ele vem de uma biblioteca, de fora deste arquivo. Sobrescrita local fura o token |
| `SLOT` | área de conteúdo livre dentro de componente | ✅ | ✅ | existe na API; o agente do Figma ainda não usa slots ("em breve") |
| `GROUP` | agrupamento | ❌ | ❌ | sem padding, sem auto layout e **sem anotação**: um "botão" feito de grupo não tem área de toque definida nem lugar para a evidência |
| `TRANSFORM_GROUP` | grupo com transformação (beta) | ❌ | ❌ | como o grupo |
| `SECTION` | organização do arquivo | ❌ | ❌ | não é tela; tem `devStatus` |
| `TEXT` | texto | — | ✅ | contraste, tamanho, ritmo, alinhamento, corte, listas, links |
| `RECTANGLE`, `ELLIPSE`, `POLYGON`, `STAR`, `LINE`, `VECTOR` | formas e ícones | — | ✅ | gráfico com significado precisa de 3:1; com pintura de imagem, é imagem |
| `BOOLEAN_OPERATION` | ícone composto | — | ❌ | anote no frame ou na instância que o contém |
| `TEXT_PATH` | texto em curva | — | ✅ | raro em interface |
| `TABLE`, `MEDIA` | tabela, mídia | — | ❌ | nós opacos: a API expõe pouco |

Os demais (`STICKY`, `CONNECTOR`, `SHAPE_WITH_TEXT`, `WIDGET`, `SLIDE`…) são de FigJam, Slides ou widgets, e ficam fora do escopo.

## 3. Os blocos que importam
Cada nó é feito de blocos de propriedades ("mixins"). Os que decidem acessibilidade:

| Bloco | Campos | Uso |
| :--- | :--- | :--- |
| Dimensão e posição | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `absoluteBoundingBox` | medir o alvo; `minWidth`/`minHeight` garantem o piso mesmo com conteúdo pequeno |
| Layout | `absoluteRenderBounds`, `rotation`, `layoutSizingHorizontal`/`Vertical` (`FIXED`, `HUG`, `FILL`) | `FIXED` em container de texto corta quando o texto cresce |
| Auto layout | `layoutMode` (`NONE`, `HORIZONTAL`, `VERTICAL`, `GRID`), `paddingTop`/`Right`/`Bottom`/`Left`, `itemSpacing`, `counterAxisSpacing`, `layoutWrap`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `itemReverseZIndex`, `primaryAxisSizingMode`, `counterAxisSizingMode` | ordem de leitura, distância entre alvos, área de toque |
| Filho de auto layout | `layoutPositioning` (`AUTO`, `ABSOLUTE`), `layoutAlign`, `layoutGrow` | filho `ABSOLUTE` sai do fluxo: a ordem dele passa a vir da geometria |
| Grade | `gridRowCount`, `gridColumnCount`, `gridRowGap`, `gridColumnGap`, `gridRowSizes`, `gridColumnSizes`; no filho, `gridRowAnchorIndex`, `gridColumnAnchorIndex`, spans | ordem na grade: linha, depois coluna |
| Filhos | `children` — **de trás para a frente** (o primeiro é o de baixo) | empilhamento não é ordem de leitura |
| Nó de cena | `visible`, `locked`, `boundVariables`, `setBoundVariable`, `inferredVariables`, `resolvedVariableModes`, `componentPropertyReferences` | qual token está ligado e em que modo |
| Pintura e efeito | `fills`, `strokes`, `strokeWeight`, `effects`, `isMask`, `opacity`, e o `opacity` de cada pintura | contraste. A cor de um `SOLID` não tem alfa, que fica no `opacity` da pintura. Anel de foco feito de sombra some em alto contraste |
| Texto | `textAutoResize` (`NONE`, `WIDTH_AND_HEIGHT`, `HEIGHT`, `TRUNCATE`), `textTruncation`, `maxLines`, `textAlignHorizontal` (inclui `JUSTIFIED`), `lineHeight`, `paragraphSpacing`, listas (`getRangeListOptions`), e `hyperlink`, `fills`, `fontSize` e `fontWeight` por trecho (`getStyledTextSegments`), porque no nó esses três voltam `figma.mixed` quando os trechos diferem | texto que corta, ritmo, alinhamento, listas e links declarados, e o contraste de cada trecho |
| Publicável | `description`, `descriptionMarkdown`, `documentationLinks` | a camada de contexto para agentes (DA11Y.md, Seção 2.2) |
| Propriedades de componente | `componentPropertyDefinitions` — `VARIANT`, `BOOLEAN`, `TEXT`, `INSTANCE_SWAP`, `SLOT`; `add`/`edit`/`deleteComponentProperty` | estados como variantes; rótulo como propriedade de texto |
| Variante | `variantProperties` | qual estado esta instância mostra |
| Protótipo | `reactions`, `setReactionsAsync` | ver Seção 5 |
| Status de dev | `devStatus`, recursos de dev (`addDevResourceAsync`…) | ligar o componente à documentação e ao código |
| Movimento | `animations`, `timelines`, `animationStyles` | o que anima precisa de variante de movimento reduzido |

## 4. Anotações e medidas — o lugar da evidência

**Anotação** (`node.annotations`, uma lista — um nó aceita várias). Gravar a lista troca a lista inteira: leia as anotações que o nó já tem e grave todas, com a nova no fim, ou a anotação de outra pessoa some sem aviso.

| Campo | O que guarda |
| :--- | :--- |
| `label` | texto simples |
| `labelMarkdown` | texto com formatação (subconjunto de Markdown) |
| `categoryId` | a categoria; os arquivos de design trazem quatro prontas — Development, Interaction, **Accessibility** e Content — e o id sai de `figma.annotations.getAnnotationCategoriesAsync()`. Categoria nova se cria com `figma.annotations.addAnnotationCategoryAsync({ label, color })`, e as cores são `yellow`, `orange`, `red`, `pink`, `violet`, `blue`, `teal` e `green`. As categorias de cada tipo de anotação estão na Seção 5 do DA11Y.md |
| `properties` | **propriedades fixadas**: o valor real do nó, mostrado ao vivo no Dev Mode |

As propriedades que uma anotação pode fixar: `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `fills`, `strokes`, `effects`, `strokeWeight`, `cornerRadius`, `textStyleId`, `textAlignHorizontal`, `fontFamily`, `fontStyle`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `itemSpacing`, `padding`, `layoutMode`, `alignItems`, `opacity`, `mainComponent`, `gridRowGap`, `gridColumnGap`, `gridRowCount`, `gridColumnCount`, `gridRowAnchorIndex`, `gridColumnAnchorIndex`, `gridRowSpan`, `gridColumnSpan`.

**Por que isso importa:** uma anotação de acessibilidade pode **fixar o valor que ela comenta**. `🟡 MEDIUM · Aqui: alvo abaixo de 44` com `minWidth` e `minHeight` fixados, `🟠 HIGH · Biblioteca: texto claro demais` com `fills` fixado, `🟡 MEDIUM · Aqui: parágrafo apertado` com `lineHeight` e `fontSize`. Se alguém mudar o valor depois, a anotação mostra o valor novo — a evidência não envelhece calada.

**Onde não dá:** `GROUP`, `TRANSFORM_GROUP`, `SECTION`, `BOOLEAN_OPERATION`, `TABLE` e `MEDIA` não aceitam anotação. Anote no frame, na instância ou no texto.

**Medida** (`figma.currentPage.addMeasurement`): uma distância desenhada entre dois nós, do lado escolhido de cada um, sempre no mesmo eixo — por exemplo, os 8px entre dois alvos vizinhos. **Só funciona no Dev Mode** (documentado nos tipos).

**Confirmado em campo:** o agente do Figma, trabalhando no Figma Design, escreve anotações nativas na categoria Accessibility. Escrever exige assento Full.

## 5. Protótipo

O protótipo é opcional, e a falta de uma reação nunca reprova, porque o que se exige é o controle desenhado. Uma reação que existe pode mostrar uma barreira, como nas leituras abaixo.

| Gatilho (`trigger.type`) | Leitura para acessibilidade |
| :--- | :--- |
| `ON_CLICK`, `ON_PRESS` | o nó é interativo |
| `ON_HOVER`, `MOUSE_ENTER`, `MOUSE_LEAVE` (com `delay`) | sem equivalente de clique, é ação só por hover |
| `ON_DRAG` | sem alternativa de clique, é ação só por arrasto |
| `AFTER_TIMEOUT` (com `timeout` em ms) | movimento automático, toast que some, carrossel que gira |
| `ON_KEY_DOWN` (com `device` e `keyCodes`) | o desenho previu teclado |
| `MOUSE_UP`, `MOUSE_DOWN`, `ON_MEDIA_HIT`, `ON_MEDIA_END` | interação fina e mídia |

Ações (`action.type`): `BACK`, `CLOSE`, `URL` (com `openInNewTab` — link que abre outra aba precisa dizer isso no texto), `UPDATE_MEDIA_RUNTIME`, `SET_VARIABLE`, `SET_VARIABLE_MODE`, `CONDITIONAL`, além da navegação entre telas.

## 6. Contexto de execução e diferenças entre as portas

- **Editor:** `figma.editorType` é `figma`, `figjam`, `dev`, `slides` ou `buzz`. Medidas exigem `dev`.
- **Seleção:** `figma.currentPage.selection` (Plugin API). A REST não vê seleção. No código do agente do Figma, ela vem vazia (abaixo).
- **Acesso dinâmico às páginas:** com `"documentAccess": "dynamic-page"` no manifesto, os getters síncronos antigos lançam erro; use os assíncronos (`getNodeByIdAsync`…). O `mainComponent` da instância passa a só aceitar escrita, e a leitura é com `getMainComponentAsync()`.
- **Variáveis:** a Plugin API resolve o valor no modo de quem usa (`variable.resolveForConsumer(node)`). O `valuesByMode` dá o valor de cada modo sem resolver apelidos (`VARIABLE_ALIAS`), e o `valuesByModeForCollectionAsync(collection)` faz o mesmo numa coleção de extensão (`isExtension`). A REST só entrega o id da variável, e o endpoint de variáveis é exclusivo do plano Enterprise.
- **De onde vem:** variável, coleção, estilo e componente têm `remote`, verdadeiro quando vêm de uma biblioteca, de fora deste arquivo.

| Diferença | Plugin API | REST |
| :--- | :--- | :--- |
| Protótipo | `reactions` | `interactions` |
| Anotações | `annotations` completo (Seção 4) | a especificação 0.44.0 declara o bloco vazio |
| Ordem de `children` | documentada: de trás para a frente | não documentada (mesma ordem, a confirmar) |
| Escrita | tudo | nenhuma camada |

**No agente do Figma, confirmado em campo (16/10/2026):**
- Ele executa código da Plugin API: busca nós, percorre a árvore e lê propriedades.
- No código dele, `figma.currentPage.selection` vem vazia. O agente vê a seleção da pessoa no próprio contexto, com id e tipo, e sem o nome. O código busca cada nó pelo id, com `getNodeByIdAsync`, e lê o nome dali.
- `figma.skipInvisibleInstanceChildren` vem ligado. Com ele, `children`, `findAll` e `getNodeByIdAsync` não enxergam as camadas ocultas dentro de instâncias, como a mensagem de erro que uma propriedade do componente desliga. Deixe a opção ligada, porque a avaliação só olha o que está visível (Seção 2.1 do DA11Y.md). Fora das instâncias, uma camada oculta ainda aparece no `findAll`, e o código a pula pelo `visible` dela e dos ancestrais.
- Ele lê um script por link e executa. O [`measure.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/tools/measure.js) rodou assim, sobre os ids da seleção.
- Ainda não testados no próprio agente: o [`handoff.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/tools/handoff.js), o [`report.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/tools/report.js) e a entrega em página do [`annotate.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/tools/annotate.js). Eles rodaram em 20 e 21/10/2026 como código da Plugin API num plugin, em telas reais sobre uma biblioteca real.

## 7. O que isso muda no desenho
- **A evidência vai em frame, instância, texto ou forma — nunca em grupo.** Um elemento interativo feito de grupo é aviso: sem caixa própria não há área de toque nem anotação.
- **Fixe na anotação o valor que ela comenta**, para a evidência acompanhar a mudança.
- **Medida só no Dev Mode.** O agente que trabalha no Figma Design registra distâncias no texto da anotação.
- **Nome de camada e descrição de componente são evidência para o próximo agente:** escreva o que a coisa é.
