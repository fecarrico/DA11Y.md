# Feeds no canvas — lista, Carregar mais, carregamento automático e rodapé

> **Escopo:** feeds, listas sem fim e paginação automática (a lista, os itens, o botão Carregar mais, o atalho para pular a lista e o rodapé), descritos em nós do Figma.
> **Traduz:** o [`guide-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-infinite-scroll.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

"Carregar mais" é o padrão acessível. Scroll infinito, a lista que carrega sozinha quando a pessoa rola, é a exceção que precisa merecer. Carregar no scroll tira da pessoa o rodapé, a barra de rolagem como noção de posição e o botão Voltar.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Lista ou feed | `FRAME` com auto layout vertical (ou `GRID`), com os itens como `INSTANCE`s | a ordem do auto layout é a ordem de leitura. Um lote novo entra depois do último item |
| Item | `INSTANCE` do card ou da linha | o foco pousa no primeiro item novo depois de Carregar mais, então o item tem estado Focus |
| Carregar mais | `INSTANCE` de botão num `FRAME` próprio, depois do último item | um botão visível. Ver [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md) |
| Carregamento do lote | o estado de carregamento da lista | ver [`figma-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-loading-skeleton.md) |
| Atalho para pular a lista | uma `INSTANCE` de link antes da lista, ou um `FRAME` que contém um `TEXT` com `hyperlink` | necessário quando a lista cresce sozinha e não tem Carregar mais |
| Rodapé | `FRAME` depois da lista | o desenho mostra como se chega até ele |

## 2. Estados que o componente precisa ter

Estado que falta na biblioteca é aviso da Seção 2. Aponte e desenhe só com autorização.

- **Antes e depois de um lote.** Dois frames da mesma lista. O segundo mantém os itens que já existiam na mesma ordem e acrescenta os novos depois deles.
- **Foco** em Carregar mais, no item e no atalho.
- **Carregamento automático que para.** Quando a lista carrega sozinha, um frame mostra onde ela para depois de alguns lotes e Carregar mais aparece. Esse frame só não é preciso quando um atalho já leva para depois da lista.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Itens novos vêm depois | a ordem do auto layout da lista nos frames de antes e de depois | os itens que já existiam mantêm a ordem e os novos vêm depois do último. Item inserido acima, ou lista reordenada, falha, porque é mudança de contexto que ninguém pediu (o espírito do SC 3.2.2) |
| Rodapé alcançável | o frame da tela | existe Carregar mais, um frame em que o carregamento automático para, ou um atalho antes da lista (Princípio Zero, SC 2.4.1) |

## 4. O que vira anotação

Cada item é uma anotação na lista (Seção 4 do DA11Y.md):

- **Papel.** Um feed de verdade, que é um fluxo de artigos, recebe o papel de feed, e cada artigo leva a posição ("21 de 200") quando o total é conhecido.
- **Carregar mais.** Depois que a pessoa aciona o botão, o foco vai para o primeiro item novo. Nunca para o topo, e nunca fica num botão que mudou de lugar.
- **Carregamento automático.** Um anúncio por lote, que não interrompe o leitor de tela (polite), com o texto exato ("mais 20 resultados, 60 de 200"), e nunca um por item. O gatilho que dispara o carregamento não é focável e não entra na árvore de acessibilidade.
- **Acréscimo.** Os itens novos entram depois da posição de leitura. Nada do que a pessoa está lendo se move ou muda.
- **Voltar.** Volta para a mesma posição, com os mesmos itens carregados.
- **Rodapé.** Como se chega a ele. Pode ser Carregar mais, o carregamento automático que para depois de alguns lotes (diga quantos) ou o atalho.

Fixe `minWidth` e `minHeight` no `FRAME` de Carregar mais, e `strokes` e `strokeWeight` na variante Focus do item (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)).

```markdown
**Decisão sua · proposta do agente**
Lista "Resultados da busca" · feed de artigos · cada um "n de 200"
Carregar mais → foco no primeiro item novo ("21 de 200")
Carregamento automático: "mais 20 resultados, 60 de 200" (polite, uma vez por lote)
Rodapé: o carregamento automático para depois de <n> lotes e vira Carregar mais · Voltar: mesma posição, mesmos itens
```

## 5. Carregar mais ou carregamento automático

Carregamento automático desenhado no layout, ou embutido na biblioteca, é decisão anterior (Seção 2 do DA11Y.md). O agente não troca isso por um botão. Ele confere se o que torna o carregamento automático aceitável está no arquivo e avisa o que falta. São três coisas:

- o anúncio por lote, anotado com o texto exato
- um rodapé alcançável, com o carregamento que para e vira Carregar mais, ou com um atalho
- uma posição que se recupera, com Voltar e o "n de m" anotados

O relatório também diz que Carregar mais é o padrão acessível, como escolha para a pessoa.

## 6. Quando a tarefa cria ou muda o componente no design system

- **Descrição:** "Feed. Use para uma lista longa que carrega em lotes, com Carregar mais no fim. Não use para dados comparados em linhas e colunas (use Table). Apelidos: feed, infinite scroll, scroll infinito, lista sem fim, carregar mais."
- **Propriedades:** `Load more` (BOOLEAN), `Label` (TEXT) para o botão. No item, `State` (VARIANT: Default, Hover, Focus).

## 7. Antipadrões no canvas

- **Carregamento automático sem Carregar mais e sem atalho**, com o rodapé que foge quando a pessoa se aproxima.
- **Lote novo inserido acima**, ou a lista reordenada quando carrega.
- **Carregar mais sem destino de foco anotado.**
- **Item sem estado Focus** onde o foco deve pousar.
- **Um anúncio por item.**
- **Trocar o scroll infinito da biblioteca por um botão** sem autorização. Isso é aviso, e quem decide é a pessoa.

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-infinite-scroll.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
