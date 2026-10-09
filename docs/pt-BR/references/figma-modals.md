# Modais no canvas — diálogo, fundo, fechar e confirmação

> **Escopo:** o diálogo modal aberto sobre uma tela, incluindo a gaveta lateral (drawer) e o diálogo de confirmação, descritos em nós do Figma.
> **Traduz:** o [`guide-modals.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-modals.md) do A11Y.md, com a Seção 6 do A11Y.md (*Focus Traps Vazados*), fixados no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Cada diálogo aberto é um frame do fluxo, com a tela atrás, um fundo escurecido e o diálogo por cima. Os `children` vão de trás para a frente, e esse empilhamento não diz nada sobre a ordem de leitura (Seção 4).

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Diálogo | `COMPONENT` na biblioteca, e cada uso é uma `INSTANCE` | diálogo que falta na biblioteca é aviso (Seção 2 do DA11Y.md), e só se desenha com autorização |
| Contêiner | `FRAME` com auto layout vertical: Título, Corpo, Ações | a ordem do auto layout é a ordem de leitura, e o título, que dá nome ao diálogo, vem primeiro |
| Título | `TEXT` visível, exposto como propriedade `TEXT` chamada "Title" | diz para que serve o diálogo ("Confirmar exclusão") |
| Botão Fechar | uma `INSTANCE` de botão dentro de um `FRAME` próprio | sempre presente, visível e com rótulo. Num canto com `layoutPositioning: ABSOLUTE`, ele sai do fluxo, então a anotação de ordem diz onde ele fica |
| Corpo | `TEXT` e instâncias num `FRAME` que abraça o conteúdo | conteúdo que cresce empurra o diálogo e nunca é cortado |
| Ações | `INSTANCE`s de botão num `FRAME` com auto layout horizontal | cada uma é um alvo |
| Fundo escurecido | `RECTANGLE` ou `FRAME` cobrindo a tela | a página atrás dele sai da ordem de leitura e de foco enquanto o diálogo está aberto |

Nunca use um `GROUP` para o diálogo ou para os botões dele, porque o grupo não tem caixa para medir nem aceita anotação.

## 2. Estados que o componente precisa ter

- **Foco no Fechar e em cada ação**, vindo do conjunto `State` do componente de botão ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md)). Botão sem Focus é aviso da Seção 2.
- **Um frame aberto para cada diálogo**, sobre a tela que tem o controle que abre o diálogo. Assim a anotação consegue dizer para onde o foco volta.
- **Um frame de confirmação** quando o diálogo tem dados digitados (Seção 5).

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto do título, do corpo e das ações | o `fills` do `TEXT` contra o `fills` do contêiner | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| Ícone do Fechar, quando ele não tem texto | o `fills` ou o `strokes` do ícone contra o preenchimento atrás dele | 3:1 (SC 1.4.11) |
| Foco | o `strokes` e o `strokeWeight` da variante Focus contra o preenchimento do diálogo | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7). Sombra em `effects` sozinha não conta |
| Alvo do Fechar e das ações | `width`, `height`, `minWidth`, `minHeight` de cada `FRAME`, nunca do ícone | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` entre as ações, e do Fechar até os vizinhos | 8px entre alvos vizinhos (Regra da Casa†) |
| Texto que cresce | `textAutoResize` do título e do corpo, `layoutSizingVertical` dos contêineres deles | `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de `HUG`. `TRUNCATE`, `maxLines` ou altura `FIXED` cortam o texto no zoom de 200% |
| Tamanho da fonte | `fontSize` do título, do corpo e das ações | a fonte mínima do perfil: 12px no Standard, 14px no Shield |
| Entrada e saída | `reactions` do controle que abre e do Fechar | o controle que abre tem `ON_CLICK` ou `ON_PRESS`. O Fechar tem uma reação própria que fecha o diálogo (`CLOSE`, `BACK` ou navegação de volta). Um `ON_KEY_DOWN` para o Esc é bem-vindo. Sem ele, o Esc vai para a anotação |

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, na instância do diálogo, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Papel e nome.** É um diálogo modal, com o nome tirado do título visível.
- **Foco quando abre.** O foco vai para dentro do diálogo, no título ou no primeiro controle. Diga qual.
- **O foco fica dentro.** `Tab` e `Shift+Tab` circulam só pelo diálogo. A página atrás fica fora de alcance pelo teclado e pelo leitor de tela.
- **O Esc sempre fecha.**
- **Foco quando fecha.** O foco volta ao controle que abriu o diálogo. Diga qual é esse controle.
- **Nome do Fechar.** É "Fechar", quando o botão é só um ícone.
- **Ordem.** No frame aberto, a anotação de ordem lista só os elementos do diálogo.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). No `FRAME` do Fechar, fixe `minWidth` e `minHeight`. No título, fixe `fills` e `fontSize`. No contêiner, fixe `fills`.

```markdown
**Sugestão do agente — confirmar**
Diálogo modal "Confirmar exclusão" · nome: vem do título · aberto por: "Excluir arquivo"
Foco: vai para o título · Tab circula só dentro · página atrás fora de alcance
Esc e "Fechar" fecham · o foco volta para "Excluir arquivo"
```

## 5. Dados não salvos e confirmação

- **Dados não salvos.** Quando o diálogo tem dados digitados e a pessoa pressiona Esc ou Fechar, o produto pergunta antes de os dados se perderem. No canvas, isso é mais um frame do fluxo, alcançado pelo Fechar no protótipo. A anotação diz que o Esc também leva para lá. Fluxo sem esse frame é aviso para a pessoa.
- **Confirmação destrutiva.** Diálogo e diálogo de alerta são escolhas igualmente conformes. A anotação propõe uma, e a escolha vai para o [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md) por padrão, nunca por tela (Seção 2 do A11Y.md, *Decision Memory*).

## 6. Quando a tarefa cria ou muda o diálogo no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada ao diálogo:

- **Descrição:** "Diálogo modal. Use para uma tarefa ou decisão que precisa de resposta antes de voltar à página. Não use para uma mensagem passageira (use Toast) nem para informação extra sobre um controle (use Tooltip ou Popover). Apelidos: modal, diálogo, popup, drawer, gaveta."
- **Propriedades:** `Title` e os rótulos das ações (TEXT). Nunca um BOOLEAN que esconde o Fechar.
- **Camadas na ordem de leitura:** Title, Body, Actions, Close button. Onde quer que o Fechar fique, a ordem das camadas e a anotação de ordem concordam.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, mais o Esc, o foco que fica dentro e o foco que volta. Eles ficam como não testados até o código verificar.

## 7. Antipadrões no canvas

- **Sem Fechar visível e com rótulo**, ou Fechar escondido por uma propriedade do componente.
- **Esc ou clique fora como a única saída.**
- **Anotação de ordem que ainda lista a página atrás** do diálogo aberto.
- **Diálogo com formulário e sem confirmação** antes de perder o que foi digitado.

## 8. O que fica para o código

O papel de diálogo e o estado modal, o nome tirado do título, levar o foco para dentro, manter o foco lá, o Esc, devolver o foco e deixar a página atrás fora de alcance são implementados seguindo o [`guide-modals.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-modals.md) do A11Y.md e a Seção 6 do A11Y.md (*Focus Traps Vazados*). Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
