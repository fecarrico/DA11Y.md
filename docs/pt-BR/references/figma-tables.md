# Tabelas no canvas — legenda, cabeçalhos, linhas e células

> **Escopo:** tabelas de dados e grades de dados (data grids), montadas com frames para que cada linha e cada célula seja um nó que se pode medir, nomear e anotar.
> **Traduz:** o [`guide-tables.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/pt-BR/references/guide-tables.md) do A11Y.md, fixado no commit `68f4be1`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

O nó `TABLE` é opaco. A API expõe pouco dele e ele não aceita anotação (Seções 2 e 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). Por isso a tabela que precisa de evidência é montada com frames. Quando o arquivo já tem um nó `TABLE`, vale a Seção 5.

## 1. Anatomia em nós

Duas estruturas funcionam, e nas duas a ordem do auto layout é a ordem de leitura:

- **Um `FRAME` com `layoutMode: GRID`.** As colunas ficam alinhadas e a ordem é linha, depois coluna. Não existe nó de linha.
- **Um `FRAME` vertical com um `FRAME` por linha**, e cada linha é um auto layout horizontal de células. Cada linha vira um nó próprio, e isso espelha a estrutura de linhas que o código precisa.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Tabela | `FRAME` (ou uma `INSTANCE` da tabela da biblioteca) com uma das estruturas acima | nunca um `GROUP` e nunca camadas `TEXT` soltas, posicionadas à mão. Sem auto layout a ordem sai da geometria, e os `children` vão de trás para a frente |
| Legenda | `TEXT`, o primeiro do frame da tabela | descreve a tabela ("Dados de funcionários") e vira a legenda dela no código |
| Linha de cabeçalho | `FRAME` com auto layout horizontal, a primeira linha | as células dela são os cabeçalhos das colunas |
| Cabeçalho de coluna | `FRAME` com um `TEXT` | tem o nome da coluna ("Nome", "Cargo") |
| Linha | `FRAME` com auto layout horizontal, na ordem dos dados | linha ou célula em `ABSOLUTE` sai do fluxo, e a ordem de leitura sai junto |
| Cabeçalho de linha | a primeira célula da linha, quando ela identifica a linha | o fato de ser cabeçalho vai numa anotação da Seção 4 |
| Célula | `FRAME` com um `TEXT` | não recebe foco (Seção 2) |
| Controle numa célula (link, botão, checkbox) | a `INSTANCE` da biblioteca num `FRAME` próprio | é a única coisa da tabela que recebe foco |

## 2. O que recebe foco

Célula não recebe foco. Só os controles de verdade dentro da tabela recebem (links, botões, checkboxes), na ordem de leitura. Cada um traz os próprios estados do próprio componente, Focus incluído ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md), [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-form-controls.md)). Controle sem o estado Focus é aviso da Seção 2. Um estado Focus desenhado numa célula comum contradiz o que a tabela construída precisa fazer, então aponte isso para a pessoa.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto da legenda, dos cabeçalhos e das células | o `fills` do `TEXT` contra o preenchimento do ancestral mais próximo que tenha um, seja a célula, a linha (cada linha zebrada incluída) ou a tabela | o piso do perfil (Seção 3 do DA11Y.md) |
| Tamanho da fonte | `fontSize` da legenda, dos cabeçalhos e das células | a fonte mínima do perfil (Seção 3 do DA11Y.md). A exceção de densidade de 10px cobre metadado secundário como um selo (badge), e nunca as células de dados |
| Controle numa célula | `width`, `height`, `minWidth` e `minHeight` do `FRAME` do controle | o piso do perfil (Seção 3 do DA11Y.md). Numa tabela densa em que o controle visível é menor que o piso, o `FRAME` do controle, com o espaçamento interno (padding), carrega a área de toque |
| Texto que cresce | `textAutoResize` do `TEXT` de cada célula, e `layoutSizingVertical` das linhas | texto em `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de linhas `HUG`. Altura `FIXED` na linha esconde o conteúdo no zoom de 200% |
| Ordem | a ordem do auto layout das linhas e das células, ou a ordem do `GRID` | bate com a leitura visual, sem linha nem célula em `ABSOLUTE` |

## 4. O que vira anotação

Cada item é uma anotação no `FRAME` da tabela:

- **Papel**, que é tabela de dados.
- **Legenda**, com o texto exato, quando o título desenhado não é a legenda ou quando não há título.
- **Cabeçalhos de coluna**, dizendo em que linha eles estão.
- **Cabeçalhos de linha**, dizendo em que coluna eles estão, quando existem.
- **Células não recebem foco.** Os controles dentro delas recebem, na ordem de leitura.
- **Nome de cada controle sem texto visível** numa célula.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). Numa tabela em `GRID`, fixe `gridRowCount` e `gridColumnCount`. No texto dos cabeçalhos e das células, fixe `fills` e `fontSize`. Em cada `FRAME` de controle, fixe `minWidth` e `minHeight`.

```markdown
4–5 · tabela "Dados de funcionários"
4) 🔊 tabela "Dados de funcionários" · cabeçalhos: linha 1 (Nome, Cargo) e coluna 1 (o nome de cada pessoa)
5) 🔊 em cada linha, botão "Editar"
```

## 5. Quando o arquivo já tem um nó `TABLE`

- **A biblioteca vem primeiro.** Não monte a tabela de novo por conta própria.
- **Ele não aceita anotação.** Anote o `FRAME` ou a `INSTANCE` mais próxima que contém o nó, e diga de qual tabela a anotação fala.
- **O que não dá para ler dele fica como não testado**, e nunca estimado. Diga isso no relatório.
- **Avise a pessoa** que uma tabela montada com frames dá a cada linha e a cada célula um nó para a evidência. Remonte só com autorização.

## 6. Quando a tarefa cria ou muda a tabela no design system

- **Descrição:** "Tabela de dados. Use para dados que a pessoa compara entre linhas e colunas. Não use para uma lista simples de itens (use List). Apelidos: tabela, table, data grid, grade, datatable."
- **Propriedades:** `Caption` (TEXT) e, no componente de célula, `Type` (VARIANT) com Column header, Row header e Data. Assim o código sabe quais células são cabeçalho.

## 7. Antipadrões no canvas

- **Tabela nova montada num nó `TABLE`**, que não aceita anotação.
- **Tabela feita de um `GROUP`** ou de camadas `TEXT` soltas, posicionadas à mão.
- **Sem legenda**, sem nada que dê nome à tabela.
- **Cabeçalho que é só texto mais grosso**, sem anotação dizendo que ele é cabeçalho.
- **Estado Focus em célula comum.**
- **Ícone numa célula como único alvo**, sem `FRAME` próprio.
- **Conteúdo cortado por reticências ou por altura fixa da linha.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-tables.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/pt-BR/references/guide-tables.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
