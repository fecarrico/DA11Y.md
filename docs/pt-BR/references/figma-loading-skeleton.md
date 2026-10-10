# Carregamento no canvas — skeleton, spinner, progresso e animação de entrada

> **Escopo:** o estado de carregamento de uma região (blocos de skeleton, spinner, barra de progresso), o estado carregado que entra no lugar dele e o conteúdo que entra com animação, descritos em nós do Figma.
> **Traduz:** o [`guide-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-loading-skeleton.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Estado de carregamento é promessa, não conteúdo. No canvas, ele é um **estado da região que espera**, desenhado no lugar do conteúdo que vai substituí-lo. Skeleton é o conjunto de blocos que imita o formato do conteúdo enquanto ele carrega. Spinner é o ícone que gira.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Região que espera | `FRAME` com auto layout, ou a `INSTANCE` que a preenche, com o nome do que ela guarda ("Resultados") | a espera é marcada nesta região, nunca na tela inteira. As anotações da Seção 4 ficam aqui |
| Skeleton | `FRAME` com os blocos (`RECTANGLE` ou `FRAME`), chamado "Skeleton" | é cenografia, sem reações e sem foco. Nunca um `GROUP`, que não aceita anotação. Os blocos se chamam "Skeleton / Title", nunca "Title", porque o próximo agente lê o nome da camada como evidência |
| Spinner | `INSTANCE` de ícone com um `TEXT` ao lado que diz o que está acontecendo | passado um instante, o spinner sozinho não diz nada |
| Barra de progresso | `FRAME` com trilho e preenchimento (`RECTANGLE`) e um `TEXT` de rótulo visível | quando a fração é mensurável, o desenho mostra progresso, e não spinner |
| Conteúdo carregado | a variante `State=Loaded` da mesma região | o desfecho substitui a promessa na mesma região |
| Conteúdo com animação de entrada | o `FRAME` da tela mostra o conteúdo legível | Seção 5 |

## 2. Estados que o componente precisa ter

A região, ou o componente que a preenche, tem a propriedade `State` com pelo menos **Loading** e **Loaded**. Estado que falta na biblioteca é aviso da Seção 2, então aponte e desenhe só com autorização.

- **Movimento reduzido.** O skeleton que pulsa ou tem shimmer, um brilho que passa pelos blocos, tem uma variante sem movimento, por exemplo `Motion=Reduced`, com os blocos parados. Um shimmer na página inteira é exatamente o movimento ambiente que a preferência existe para parar (Regra da Casa†, em todos os perfis).
- **Nenhum foco no skeleton.** Nenhum bloco tem variante Focus. Os controles do conteúdo carregado mantêm os próprios estados.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Movimento | `animations`, `timelines` ou `animationStyles` no skeleton, e laços de reações `AFTER_TIMEOUT` entre as variantes dele (lidas em cada `COMPONENT`, porque o `COMPONENT_SET` não tem protótipo) | toda variante que anima tem uma variante sem movimento (Regra da Casa†) |
| Skeleton é cenografia | `reactions` do skeleton e dos blocos | não há nenhuma. Reação torna o bloco interativo, e nenhum bloco de skeleton recebe foco |
| Spinner e preenchimento da barra | o `fills` do ícone contra o preenchimento de trás, e o preenchimento da barra contra o trilho | 3:1 (SC 1.4.11) |
| O estado legível é o desenhado | `opacity` e `visible` do conteúdo no `FRAME` da tela | o conteúdo aparece no próprio frame, e não só no fim de uma reação (Seção 5) |

## 4. O que vira anotação

Cada item é uma anotação na região que espera:

- **Região ocupada.** Esta região, e não a tela, fica marcada como ocupada enquanto carrega, até o conteúdo chegar.
- **Dois anúncios, com o texto exato.** Um quando o carregamento começa ("Carregando resultados") e um com o desfecho ("12 resultados carregados"). Os dois saem num status que não interrompe o leitor de tela (polite), nunca como alerta e nunca um por bloco.
- **Skeleton escondido.** Os blocos ficam escondidos da tecnologia assistiva e nunca recebem foco.
- **Foco.** Ele fica onde estava quando o conteúdo chega. Se estava dentro da região substituída, vai para o ancestral estável mais próximo, e a anotação diz qual é esse nó.
- **Progresso.** O rótulo da barra, lido junto com o valor.
- **Movimento.** O pulso para quando a pessoa pede movimento reduzido.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). No texto do spinner e no rótulo do progresso, fixe `fills` e `fontSize`. No conteúdo com animação de entrada, fixe `opacity`, e assim uma mudança para 0 aparece no Dev Mode.

```markdown
**Sugestão do agente — confirmar**
Região "Resultados" · ocupada enquanto carrega
Anunciar (polite, uma vez cada): "Carregando resultados" → "12 resultados carregados"
Skeleton: escondido da tecnologia assistiva, nunca focável · Motion=Reduced: blocos parados
Foco: fica onde está. Se estava dentro de "Resultados", vai para "Painel de busca"
```

## 5. Na animação de entrada, o estado legível é o desenhado

Estado de carregamento que nunca se resolve é o antipadrão do A11Y.md chamado *Conteúdo Refém do JavaScript*. A forma comum é a animação de entrada que começa invisível. Quando o script falha, é bloqueado ou ainda não rodou, a página fica vazia.

- **O frame da tela mostra o conteúdo legível.** A animação é um acréscimo, nos campos de movimento (`animations`, `timelines`) ou numa reação que parte do estado visível.
- **O fim de uma reação como único estado legível é aviso.** Conteúdo com `opacity` 0 ou `visible: false` na tela, que só aparece depois de um `AFTER_TIMEOUT`, é a forma que o código vai copiar. Aponte, e mude o frame só com autorização.
- **Revelar no scroll é o mesmo caso.** O conteúdo abaixo da dobra existe antes de qualquer revelação. A anotação diz que a animação se soma a um conteúdo visível, e nunca que é ela que traz o conteúdo.

## 6. Quando a tarefa cria ou muda o componente no design system

- **Descrição:** "Skeleton. Use como estado de carregamento de uma região cujo layout já se conhece. Não use numa espera cuja fração dá para medir (use Progress bar). Apelidos: skeleton, placeholder, shimmer, carregamento, loading."
- **Propriedades:** `State` (VARIANT: Loading, Loaded), `Motion` (VARIANT: Default, Reduced), `Status text` (TEXT) para o spinner.

## 7. Antipadrões no canvas

- **O skeleton mudo**, um estado de carregamento sem anúncio anotado.
- **O skeleton tagarela**, com um anúncio por bloco, ou o progresso anunciado como alerta.
- **Blocos de skeleton com nome de conteúdo** ("Title", "Price") ou com reações.
- **Shimmer sem uma variante parada.**
- **Spinner sozinho numa espera longa**, ou spinner quando a fração é conhecida.
- **Conteúdo que só existe no fim de uma reação**, partindo de `opacity` 0.
- **Anotação que manda o foco para o conteúdo novo** ou para o topo da página.

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-loading-skeleton.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
