# Gráficos no canvas — séries, rótulos, tabela de dados e dashboards

> **Escopo:** gráficos, dashboards e cards de KPI, descritos em nós do Figma. Isso inclui as séries, o que diferencia uma da outra, o texto em volta delas e a tabela de dados que é a alternativa do gráfico.
> **Traduz:** o [`guide-charts.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-charts.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

Um gráfico é dado, desenhado. A alternativa dele é **o dado**, e não a descrição do desenho. Por isso todo gráfico informativo vem com uma tabela equivalente, em todos os perfis. Quando a tabela não é viável (milhares de pontos, série ao vivo), vale um arquivo de dados para baixar (dataset) ou um endereço de API (endpoint) citado na legenda da figura. "Os números estão em outro lugar do produto" não vale.

## 1. Anatomia em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Gráfico | `FRAME` com auto layout vertical, ou uma `INSTANCE` do gráfico da biblioteca | nunca um `GROUP`, que não tem caixa para medir nem lugar para a evidência. A ordem do auto layout é a ordem de leitura: título, gráfico, controle da tabela de dados |
| Título | `TEXT`, o primeiro do frame | diz a pergunta que o gráfico responde ("Receita por mês"), nunca o tipo ("Gráfico de barras 3") |
| Área do gráfico | `FRAME` que contém as séries | o `fills` dela é o fundo contra o qual cada série é medida |
| Séries | marcas `VECTOR`, `LINE` ou `RECTANGLE`, com um `FRAME` por série quando ela tem várias marcas | a cor nunca é a codificação (Seção 3) |
| Marcadores | `ELLIPSE`, `POLYGON`, `STAR` ou uma `INSTANCE` de ícone | uma forma diferente por série é um segundo canal |
| Rótulos diretos | `TEXT` na ponta de cada linha ou em cada barra | vencem a legenda de cores, que obriga a pessoa a guardar de memória qual cor é qual nome |
| Eixos e marcações | `LINE` e `TEXT` | o texto segue os pisos do perfil |
| Controle da tabela de dados | `INSTANCE` de botão ("Ver dados como tabela") num `FRAME` próprio | é um alvo de verdade ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md)) |
| Tabela de dados | `FRAME` montado como no [`figma-tables.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-tables.md) | as mesmas séries, em linhas |
| Gráfico exportado como figura | nó com preenchimento de imagem | é imagem ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-images.md)), com a tabela de dados por perto |

## 2. Estados que o gráfico precisa ter

Gráfico estático não tem estados. Gráfico interativo, ou que atualiza, tem estes. Estado que falta na biblioteca é aviso da Seção 2, então aponte e desenhe só com autorização.

- **Ponto com foco.** Um anel, um halo ou um marcador ampliado no ponto (SC 2.4.7), e nunca só um tooltip aparecendo.
- **Tooltip no foco.** Se um ponto mostra um tooltip quando o mouse passa por cima (hover), o estado Focus mostra o mesmo tooltip ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-tooltips-popovers.md)).
- **Intervalo sem arrastar.** Se arrastar seleciona um intervalo (zoom ou seleção de trecho, o brush), um controle visível seleciona o mesmo intervalo ([`figma-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-drag-drop.md)).
- **Pausado, para dado ao vivo.** Gráfico com dado ao vivo tem um controle de pausa visível (SC 2.2.2). Movimento automático contínuo não fica isento por ser dado.
- **Filtrado.** O frame da tabela de dados mostra o mesmo conjunto filtrado do gráfico. Uma tabela com o conjunto sem filtro é uma segunda resposta, e contraditória.
- **Tabela de dados aberta.** O estado aberto do controle "Ver dados como tabela" está desenhado, com a tabela visível.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Cada série contra a área do gráfico | o `strokes` ou o `fills` da série contra o `fills` da área | 3:1 (SC 1.4.11) |
| Séries vizinhas | o `strokes` ou o `fills` de duas séries que se tocam ou se cruzam | 3:1 entre si, e não só contra o fundo |
| Segundo canal | as séries lado a lado, comparando forma do marcador, tracejado, textura e rótulo direto | cada série difere das outras por algo além da cor. O tracejado não tem propriedade no [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md) (a confirmar), então leia o tracejado no gráfico renderizado |
| Título, rótulos, marcações, valor do KPI | o `fills` do `TEXT` contra o preenchimento atrás dele (a área do gráfico, ou a barra quando o rótulo fica sobre ela) | o piso do perfil (Seção 3 do DA11Y.md) |
| Protótipo | `reactions` nos pontos e na área do gráfico | tooltip em `ON_HOVER` ou `MOUSE_ENTER` sem caminho por foco ou clique é só hover. Intervalo em `ON_DRAG` sem controle é só arrasto. `AFTER_TIMEOUT` que atualiza o dado precisa do controle de pausa |

## 4. O que vira anotação

Cada item é uma anotação no frame do gráfico:

- **Forma**, que pode ser imagem estática, SVG inline ou interativo. É ela que decide o que o código deve, e errar aqui é a raiz da maioria dos gráficos quebrados.
- **Texto alternativo**, em rascunho, com a tendência e os extremos. Ele diz o que a pessoa veria, e a tabela de dados entrega o que ela aprenderia.
- **Equivalente em dados.** Onde fica a tabela, ou qual dataset ou endpoint a legenda da figura cita.
- **Teclado, no gráfico interativo:** uma parada de Tab para o gráfico, setas entre os pontos, e `Esc` sai do zoom ou do brush sem sair da página.
- **O que o ponto com foco anuncia**, com o texto exato. Por exemplo, "Março: 35.000".
- **Anúncio ao atualizar**, com o resultado, como "Filtrado por 2º trimestre: 3 séries, 12 pontos". Nunca "gráfico atualizado".

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). Em cada série, fixe `strokes` ou `fills` com a razão contra a área do gráfico e contra a série vizinha. Nos rótulos e nas marcações, fixe `fills` e `fontSize`. Em cada controle, fixe `minWidth` e `minHeight`.

```markdown
**Sugestão do agente — confirmar**
Gráfico "Receita por mês" · forma: interativo · título: H2
Alternativa: "Receita mensal, 2026. Sobe de 40 mil em janeiro a 120 mil em junho, com queda a 35 mil em março."
Dados: "Ver dados como tabela" abaixo do gráfico, mesmos filtros
Teclado: uma parada, ←/→ entre os pontos, Esc sai do zoom · ponto com foco: "Março: 35.000"
Ao trocar o filtro: "Filtrado por 2º trimestre: 3 séries, 12 pontos"
```

## 5. Dashboards

- **Cada gráfico é uma região com título de verdade.** O `FRAME` do gráfico começa pelo `TEXT` do título, que diz a pergunta. Assim o painel inteiro é navegável por títulos. O nível do título é uma anotação da Seção 4.
- **Card de KPI é texto.** O número é um nó `TEXT`, nunca um `VECTOR` nem um preenchimento de imagem.
- **Metadado pequeno** é onde a exceção de densidade de 10px mais é abusada (Seção 3 do DA11Y.md).

## 6. Quando a tarefa cria ou muda um gráfico no design system

- **Descrição:** "Gráfico de linha. Use para mostrar como um valor muda ao longo do tempo. Não use para um número só (use Card de KPI). Apelidos: line chart, gráfico de tendência, plot."
- **Propriedades:** `Title` (TEXT), `Show data table` (BOOLEAN), `Marker` (INSTANCE_SWAP) por série e, no ponto, `State` (VARIANT) com Default, Hover e Focus.

## 7. Antipadrões no canvas

- **Figura do gráfico com uma alternativa que descreve o desenho** e sem tabela de dados. Passa em todo verificador e não serve para nada.
- **Cor como única codificação** de séries, categorias ou de um estado "crítico".
- **Legenda de cores como única chave** quando as séries poderiam ser rotuladas onde estão desenhadas.
- **Duas séries vizinhas que passam contra o fundo e reprovam entre si.**
- **Foco mostrado só por um tooltip**, ou tooltip e intervalo que só se alcançam por hover ou por arrasto.
- **Gráfico ao vivo sem pausa.**
- **Título que diz o tipo do gráfico.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-charts.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-charts.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
