# Campos de data no canvas — campo digitável, formato, grade do calendário e intervalos

> **Escopo:** o campo de data (um campo de texto com um botão de calendário), o calendário (legenda do mês, botões de mês, cabeçalhos dos dias da semana, células de dia) e o seletor de intervalo, em nós do Figma. O rótulo, o texto de ajuda e o erro do campo estão no [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md).
> **Traduz:** o [`guide-datepicker.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-datepicker.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

**O campo de texto é a funcionalidade. O calendário é um extra em cima dele.** Quem já sabe a data digita em um segundo. Quando o calendário é a única entrada, quem usa teclado, controle por voz ou leitor de tela precisa percorrer um mês inteiro para inserir uma data que poderia digitar.

Quando o produto não precisa de intervalo, de datas indisponíveis definidas pelo produto nem de identidade visual específica, o seletor da própria plataforma é a resposta melhor. Nesse caso, o desenho anota o seletor nativo em vez de desenhar um calendário. Numa tela de app, veja o [`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-platform-native.md). Os motivos para não usar o nativo são decisões de produto, registradas uma vez no [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md).

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Campo de data | a `INSTANCE` do campo de texto da biblioteca ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md)) | um campo em que a pessoa digita. Nunca um `FRAME` com "Selecione uma data" que só abre o calendário |
| Formato e limites | `TEXT` de ajuda ("Formato: DD/MM/AAAA"), visível no estado vazio | visível antes de digitar, fora do campo. Um limite que importa ("no máximo 30 dias a partir de hoje") fica ao lado do rótulo, e nunca só no erro |
| Botão do calendário | uma `INSTANCE` de ícone dentro de um `FRAME` próprio, no fim do campo | é outro alvo, com nome próprio. O `ON_CLICK` do protótipo que abre o calendário fica neste `FRAME` |
| Calendário | `FRAME` com auto layout vertical: cabeçalho do mês, dias da semana, dias | a ordem do auto layout é a ordem de leitura |
| Legenda do mês | `TEXT` com mês e ano ("Março de 2026") | sempre visível, porque é o nome da grade |
| Botões de mês | `INSTANCE`s de ícone, cada uma num `FRAME` próprio | são outros alvos, cada um com nome próprio ("Próximo mês") |
| Dias da semana | `TEXT` na primeira linha da grade | cabeçalhos de coluna, e não decoração |
| Dias | `FRAME` com `layoutMode: GRID` e 7 colunas, ou um auto layout vertical de linhas de semana | linhas são semanas e células são dias. A grade se lê por linha e depois por coluna. Célula com `layoutPositioning: ABSOLUTE` sai dessa ordem |
| Célula de dia | `INSTANCE` de um `COMPONENT_SET` de dia com a variante `State` | a caixa do `FRAME` dela é o alvo. Nunca um `GROUP` |
| Dia indisponível | a mesma célula em `State=Unavailable` | continua na grade, visível, marcada por mais do que a cor (Seção 3), e o motivo vai na anotação |

## 2. Estados que o componente precisa ter

Estado que falta na biblioteca é aviso (Seção 2 do DA11Y.md). Aponte a falta e desenhe o estado só com autorização.

- **Campo.** Os estados da Seção 2 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md).
- **Botão do calendário e botões de mês.** Os estados de botão da Seção 2 do [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md), sempre com Focus.
- **Célula de dia.** `State` com pelo menos **Default, Focus, Selected, Today e Unavailable**, e também **Range start, In range e Range end** quando o produto escolhe intervalos.
- **Foco no dia selecionado.** Abrir o calendário põe o foco na data selecionada, ou em hoje. Então o foco acontece junto com Selected e com Today. Ou o conjunto tem essas combinações, ou o contorno de foco continua chegando a 3:1 por cima da aparência de Selected e de Today.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Números dos dias, legenda, dias da semana, ajuda | o `fills` do `TEXT` contra o preenchimento do ancestral mais próximo que tenha um. Exceto o número do dia em `State=Unavailable`, que é isento por ser componente inativo (SC 1.4.3) | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| O que marca Selected, Today e o intervalo | o `fills` ou o `strokes` da marca contra a cor em volta dela | 3:1 (SC 1.4.11) |
| Estado além da cor | as variantes Default, Selected, Today, Unavailable e as de intervalo lado a lado | cada uma muda mais do que a cor, com forma, linha, texto ou ícone (SC 1.4.1). As pontas do intervalo são marcadas por texto ou forma, e nunca só por um fundo colorido |
| Foco | o `strokes` e o `strokeWeight` da variante Focus contra a cor vizinha | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7) |
| Alvos | `width`, `height`, `minWidth` e `minHeight` de cada `FRAME` de célula, do botão do calendário e dos botões de mês | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `gridColumnGap` e `gridRowGap`, ou `itemSpacing` das linhas de semana | 8px entre alvos vizinhos (Regra da Casa†). Menos que isso é aviso, nunca falha |
| Tamanho da fonte | `fontSize` dos números dos dias e dos dias da semana | a fonte mínima do perfil: 12px no Standard, 14px no Shield |
| Formato antes de digitar | a variante Default do campo, vazia | o `TEXT` de ajuda com o formato está visível, e não só em `State=Error` ou no placeholder |

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **No campo.** O nome e o formato ligado a ele, ouvidos enquanto o campo está vazio. Ele aceita `01/02/2026`, `1/2/26`, `2026-02-01` e colagem, porque bloquear a colagem transforma um "copiar" em teste de memória (SC 3.3.8). Teclado numérico no celular.
- **No botão do calendário.** O nome dele, como "Escolher data de entrada no calendário".
- **No calendário.** Um diálogo de seleção de data com uma grade, e o nome da grade é a legenda visível. Cada dia tem como nome a data completa ("15 de março de 2026"), e também "selecionado", ou "indisponível" com o motivo ("estadia mínima de duas noites"). Hoje é marcado como a data atual. O nome do mês novo é anunciado quando a grade muda de mês.
- **Teclado e foco no calendário.** Uma só parada de `Tab` na grade. ←/→ andam por dia, ↑/↓ por semana, `Home`/`End` vão às bordas da semana, `PageUp`/`PageDown` mudam de mês, e `Shift` com essas teclas muda de ano. Abrir põe o foco na data selecionada ou em hoje. `Esc` fecha e devolve o foco ao botão do calendário. Escolher um dia fecha, devolve o foco ao campo, e o campo guarda a data como texto.

Fixe na anotação os valores medidos (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). Na célula de dia, fixe `minWidth`, `minHeight` e `fills`. Nos dias da semana, fixe `fontSize` e `fills`. Na grade, fixe `gridColumnGap` e `gridRowGap`.

```markdown
**Sugestão do agente — confirmar**
Calendário de "Data de entrada" · diálogo de seleção de data, grade com o nome "Março de 2026"
Dia: "15 de março de 2026" (+ "selecionado" ou "indisponível, estadia mínima de duas noites") · mudança de mês anunciada
Teclado: uma parada de Tab · setas dia/semana · Home/End · PageUp/PageDown mês · Esc volta ao botão do calendário
```

## 5. Intervalos

- **Dois campos**, cada um com o próprio rótulo ("Data inicial", "Data final"), e nunca um campo só em que a pessoa precisa clicar duas vezes.
- **O intervalo aparece sem depender só de um fundo colorido.** As pontas também são marcadas por texto ou forma, com as variantes Range start e Range end.
- **O estado da seleção é anunciado**, com o texto exato na anotação, por exemplo "Início 12 de março selecionado. Escolha a data final."
- **Um limite que a primeira data põe na segunda** é anunciado quando muda. Só esmaecer metade da grade não basta.

## 6. Quando a tarefa cria ou muda o seletor de data no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada ao seletor de data:

- **Descrição:** "Campo de data. Use para informar uma data digitando, com o calendário como extra opcional. Não use quando o seletor da plataforma serve, nem como campo único para um intervalo (use dois). Apelidos: date picker, datepicker, calendário, seletor de data, campo de data."
- **Propriedades:** no campo, as da Seção 6 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md). Na célula de dia, `State` (VARIANT) com os valores da Seção 2 e `Day` (TEXT).
- **Camadas com o nome do que são, na ordem de leitura:** Label, Box, Value, Calendar button, Help text, Error message. No calendário, Month header (legenda e botões de mês), Weekday headers, Days.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, com o resultado medido de cada estado em cada modo.

## 7. Antipadrões no canvas

- **O calendário como única entrada**, com um campo "Selecione uma data" cujo clique só abre a grade.
- **O formato só no placeholder ou só no erro.**
- **Um campo só para um intervalo**, esperando dois cliques.
- **Dias indisponíveis tirados da grade**, ou marcados só pela cor.
- **Intervalo mostrado só por um fundo colorido.**
- **Célula de dia feita de um `GROUP`**, sem caixa para medir e sem lugar para a anotação.
- **Calendário próprio onde o seletor da plataforma serviria**, sem decisão registrada.

## 8. O que fica para o código

A semântica da grade, a parada única de tabulação e as setas, a data completa como nome de cada célula, as marcas de hoje e de selecionado, os dias indisponíveis que continuam alcançáveis, o anúncio do mês, o foco ao abrir e ao fechar e a leitura das datas digitadas e coladas são implementados seguindo o [`guide-datepicker.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-datepicker.md) do A11Y.md. De preferência, isso vem de uma biblioteca acessível, e não é construído do zero. Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
