# Árvores no canvas — árvore, nó, chevron e profundidade

> **Escopo:** árvores (tree views), exploradores de arquivo, seletores de hierarquia aninhada e painéis de camadas, descritos em nós do Figma.
> **Traduz:** o [`guide-treeview.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-treeview.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Primeiro pergunte se aquilo é uma árvore

A maioria das hierarquias desenhadas como árvore é outra coisa. Anotadas como árvore, elas pioram. A árvore é um componente de seleção com navegação por setas, então os comandos normais de leitura da pessoa param de funcionar e os links deixam de ser anunciados como links. O papel vai na anotação (Seção 5), então decida isso antes.

| O que aquilo realmente é | Anotar como | Guia |
| :--- | :--- | :--- |
| navegação do site ou da documentação, com links | navegação, com links em listas aninhadas e seções que expandem como botões com estado expandido | [`figma-navigation.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-navigation.md) |
| seções de conteúdo que abrem e fecham | acordeão | [`figma-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-tabs-accordion.md) |
| um filtro com checkboxes aninhados | grupos de checkboxes | [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-form-controls.md) |
| **selecionar ou explorar itens numa hierarquia** (explorador de arquivos, seletor de organograma, painel de camadas) | **árvore** | este guia |

Se a pessoa está indo a algum lugar, é navegação. Se está escolhendo algo dentro de uma hierarquia, é árvore.

## 2. Anatomia em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Árvore | `FRAME` com auto layout vertical | a ordem do auto layout é a ordem dos nós visíveis. Nunca um `GROUP` |
| Nó | `INSTANCE` de um `COMPONENT_SET`. A linha dele é um `FRAME` com auto layout horizontal: Chevron, Icon, Label | a linha inteira é o alvo. O chevron (ícone de seta) que faz algo diferente da linha é outro alvo, com `FRAME` próprio |
| Filhos | `FRAME` aninhado dentro do nó pai, depois da linha dele | a árvore de camadas espelha a hierarquia, e os filhos vêm logo depois do pai |
| Chevron | `INSTANCE` de ícone, só nos nós que têm filhos | a folha, que é o nó sem filhos, não tem chevron nem estado Expanded. Folha com cara de fechada anuncia algo que nunca vai abrir |
| Profundidade | o aninhamento, ou o `paddingLeft` da linha | o recuo é só visual. Quando a árvore é desenhada plana, com a profundidade só no `paddingLeft`, a anotação dá o nível de cada nó (Seção 5) |

## 3. Estados que o componente precisa ter

Estado que falta na biblioteca é aviso da Seção 2. Aponte a falta e desenhe o estado só com autorização.

- **Nó:** Default, Hover e Focus, cada um com `Selected` ligado e desligado. O nó selecionado aparece por mais do que a cor, com ícone, barra ou peso junto com a cor.
- **Expandir não é selecionar.** `Expanded` e `Selected` são propriedades de variante separadas, e nunca dois valores do mesmo `State`. Um nó pode estar aberto e não selecionado, ou selecionado e fechado. Um conjunto com uma aparência só de "aberto e destacado" não consegue desenhar "abri esta pasta para olhar dentro sem escolhê-la".
- **Selecionado com foco.** `Espaço` seleciona o nó que está com foco, então as duas coisas se encontram. Ou o conjunto tem essa combinação, ou o contorno de foco continua chegando a 3:1 por cima da aparência de Selected.
- **Carregando** (Loading), no ramo que carrega os filhos sob demanda. O anúncio fica na Seção 5.

## 4. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto do rótulo | o `fills` do `TEXT` contra o preenchimento da linha, com `Selected` ligado e desligado | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| Indicador de seleção e chevron | o `fills` ou o `strokes` deles contra a cor em volta | 3:1 |
| Foco | o `strokes` e o `strokeWeight` da variante Focus, também com `Selected` ligado | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7) |
| Alvo | `minHeight` do `FRAME` da linha, e `minWidth` e `minHeight` do `FRAME` de um chevron que age sozinho | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` da árvore, e entre um chevron separado e a linha | 8px entre alvos vizinhos (Regra da Casa†). Linhas que se encostam geram aviso, nunca falha. Flexibilizar a regra vai para o `A11Y-DECISIONS.md` |
| Só por hover | `reactions` da linha e do chevron | expandir e selecionar usam `ON_CLICK` ou `ON_PRESS`, e nunca só `ON_HOVER` ou `MOUSE_ENTER` |
| Texto que cresce e fonte | `textAutoResize` e `fontSize` dos rótulos | sem `TRUNCATE`, `maxLines` ou altura `FIXED`, e 12px no Standard, 14px no Shield |

## 5. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, na árvore, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Papel e nome.** O papel é "árvore", com o nome dela ("Arquivos do projeto"). Ele só entra depois que a Seção 1 confirmar que é árvore.
- **Nível e posição.** Quando os ramos carregam sob demanda, ou só uma parte da árvore aparece de cada vez, a anotação diz isso. Aí todo nó visível precisa do nível, da posição e do tamanho do conjunto dele, como em "src, expandido, nível 1, 2 de 5".
- **Expandido ou recolhido** nos nós que têm filhos, e nenhum dos dois nas folhas.
- **Seleção** única ou múltipla. Na árvore de seleção múltipla, todo nó diz "selecionado" ou "não selecionado", e nunca fica em silêncio.
- **Carregamento**, com o texto exato. Primeiro vem a espera, depois o resultado ("src expandido, 12 itens").
- **Teclado.** A árvore inteira é uma parada só de `Tab`. `↑` e `↓` andam só pelos nós visíveis. `→` expande e depois entra no primeiro filho. `←` recolhe e depois sobe ao pai. `Home` e `End` vão às pontas. `Enter` ativa, `Espaço` seleciona, uma letra pula para o próximo nó que começa com ela e `*` expande todos os irmãos do nível.

Fixe na anotação o valor medido: `minHeight` na linha, `fills` no indicador de seleção, `itemSpacing` na árvore.

```markdown
**Sugestão do agente — confirmar**
Árvore "Arquivos do projeto" · seleção única · uma parada de Tab
Pastas: expandida ou recolhida · arquivos: nenhum dos dois · Enter abre · Espaço seleciona
Ramo carregando: anunciar a espera, depois "src expandido, 12 itens"
```

## 6. Quando a tarefa cria ou muda a árvore no design system

- **Descrição:** "Árvore (tree view). Use para selecionar ou explorar itens numa hierarquia, como arquivos, um organograma ou camadas. Não use para a navegação do site (use Navigation), para seções que abrem e fecham (use Accordion) nem para filtros aninhados (use Checkbox). Apelidos: tree, tree view, explorador de arquivos, seletor de hierarquia."
- **Propriedades:** `State` (VARIANT: Default, Hover, Focus, Loading), `Selected` e `Expanded` (VARIANT, separadas), `Has children` (BOOLEAN), `Label` (TEXT), `Icon` (INSTANCE_SWAP).
- **Camadas na ordem de leitura:** no nó, Chevron, Icon, Label, Children.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 4, com o resultado de cada estado em cada modo.

## 7. Antipadrões no canvas

- **Navegação anotada como árvore.**
- **Chevron numa folha**, ou folha com cara de fechada.
- **Expanded e Selected desenhados como um estado só.**
- **Profundidade só no `paddingLeft`**, sem o nível em nenhuma anotação.
- **Ramo que carrega sem anúncio escrito.**

## 8. O que fica para o código

Os papéis de árvore, de nó e de grupo, os estados expandido e selecionado, o nível e a posição, a parada única de `Tab` com o foco andando pelas setas e o anúncio de carregamento são implementados seguindo o [`guide-treeview.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-treeview.md) do A11Y.md. Esse guia recomenda adotar uma biblioteca robusta em vez de construir a lógica do zero. Os cenários de verificação dele (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
