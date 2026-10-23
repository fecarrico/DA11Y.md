# Modais no canvas — diálogo, fundo, fechar e confirmação

> **Escopo:** o diálogo modal aberto sobre uma tela, incluindo a gaveta lateral (drawer) e o diálogo de confirmação, descritos em nós do Figma.
> **Traduz:** o [`guide-modals.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-modals.md) do A11Y.md, com a Seção 6 do A11Y.md (*Focus Traps Vazados*), fixados no commit `9fb9a02`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Cada diálogo aberto é um frame do fluxo, com a tela atrás, um fundo escurecido e o diálogo por cima.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Diálogo | `COMPONENT` na biblioteca, e cada uso é uma `INSTANCE` | diálogo que falta na biblioteca é aviso (Seção 2 do DA11Y.md), e só se desenha com autorização |
| Contêiner | `FRAME` com auto layout vertical: Título, Corpo, Ações | a ordem do auto layout é a ordem de leitura, e o título, que dá nome ao diálogo, vem primeiro |
| Título | `TEXT` visível, exposto como propriedade `TEXT` chamada "Title" | diz para que serve o diálogo ("Confirmar exclusão") |
| Botão Fechar | uma `INSTANCE` de botão dentro de um `FRAME` próprio | sempre presente, visível e com rótulo. Num canto com `layoutPositioning: ABSOLUTE`, ele sai do fluxo, então a anotação de ordem diz onde ele fica |
| Corpo | `TEXT` e instâncias num `FRAME` que abraça o conteúdo | conteúdo que cresce empurra o diálogo e nunca é cortado |
| Ações | `INSTANCE`s de botão num `FRAME` com auto layout horizontal | cada uma é um alvo |
| Fundo escurecido | `RECTANGLE` ou `FRAME` cobrindo a tela | a página atrás dele sai da ordem de leitura e de foco enquanto o diálogo está aberto |

## 2. Estados que o componente precisa ter

- **Foco no Fechar e em cada ação**, vindo do conjunto `State` do componente de botão ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-buttons.md)).
- **Um frame aberto para cada diálogo**, sobre a tela que tem o controle que abre o diálogo. Assim a anotação consegue dizer para onde o foco volta.
- **Um frame de confirmação** quando o diálogo tem dados digitados (Seção 5).

## 3. O que medir, a partir das propriedades

Além do piso do perfil (Seção 3 do DA11Y.md), o que é específico do diálogo:

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Entrada e saída | o Fechar e as `reactions` do controle que abre | o Fechar está desenhado e visível, e isso basta, porque a reação dele no protótipo é opcional. Um controle que abre o diálogo só por `ON_HOVER` ou `MOUSE_ENTER` é ação só de hover. Um `ON_KEY_DOWN` para o Esc é bem-vindo. Sem ele, o Esc vai para a anotação |

## 4. O que vira anotação

**Na anotação da instância do diálogo**, com a leitura da Seção 4 do DA11Y.md no formato curto da Seção 5:

- **Papel e nome.** É um diálogo modal, com o nome tirado do título visível.
- **Quem abre.** Diga qual controle abre o diálogo.
- **Nome do Fechar.** É "Fechar", quando o botão é só um ícone.
- **Ordem.** No frame aberto, a anotação de ordem lista só os elementos do diálogo.

**No relatório**, como requisito para o desenvolvimento:

- **Foco quando abre.** O foco vai para dentro do diálogo, no título ou no primeiro controle. Diga qual.
- **O foco fica dentro.** `Tab` e `Shift+Tab` circulam só pelo diálogo. A página atrás fica fora de alcance pelo teclado e pelo leitor de tela.
- **O Esc sempre fecha.**
- **Foco quando fecha.** O foco volta ao controle que abriu o diálogo.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-nodes.md)). No `FRAME` do Fechar, fixe `minWidth` e `minHeight`. No título, fixe `fills` e `fontSize`. No contêiner, fixe `fills`.

```markdown
1–2 · diálogo "Confirmar exclusão"
1) 🔊 diálogo modal "Confirmar exclusão", aberto por "Excluir arquivo"
2) 🔊 botão "Fechar"
```

## 5. Dados não salvos e confirmação

- **Dados não salvos.** Quando o diálogo tem dados digitados e a pessoa pressiona Esc ou Fechar, o produto pergunta antes de os dados se perderem. No canvas, isso é mais um frame do fluxo, o que o Fechar abre. A anotação diz que o Esc também leva para lá. Fluxo sem esse frame é aviso para a pessoa.
- **Confirmação destrutiva.** Diálogo e diálogo de alerta são escolhas igualmente conformes. A anotação propõe uma, e a escolha vai para o [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/A11Y-DECISIONS.md) por padrão, nunca por tela (Seção 2 do A11Y.md, *Decision Memory*).

## 6. Quando a tarefa cria ou muda o diálogo no design system

- **Descrição:** "Diálogo modal. Use para uma tarefa ou decisão que precisa de resposta antes de voltar à página. Não use para uma mensagem passageira (use Toast) nem para informação extra sobre um controle (use Tooltip ou Popover). Apelidos: modal, diálogo, popup, drawer, gaveta."
- **Propriedades:** `Title` e os rótulos das ações (TEXT). Nunca um BOOLEAN que esconde o Fechar.

## 7. Antipadrões no canvas

- **Sem Fechar visível e com rótulo**, ou Fechar escondido por uma propriedade do componente.
- **Esc ou clique fora como a única saída.**
- **Anotação de ordem que ainda lista a página atrás** do diálogo aberto.
- **Diálogo com formulário e sem confirmação** antes de perder o que foi digitado.

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-modals.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-modals.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
