# Toasts e notificações no canvas — mensagem, ação, fechar e lugar

> **Escopo:** o toast, o snackbar, o banner e a mensagem de status, descritos em nós do Figma.
> **Traduz:** o [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-toasts-notifications.md) do A11Y.md, fixado no commit `9fb9a02`. Resposta que exige ação agora é diálogo, e está no [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-modals.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Um toast falha de três jeitos independentes. Ninguém ouve, ninguém alcança a ação dele a tempo, ou ele some antes de alguém ler. O tempo do protótipo mostra os dois últimos, e a anotação cuida do primeiro.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Toast | `COMPONENT_SET` com a propriedade de variante `Type`, e cada uso é uma `INSTANCE` | toast que falta na biblioteca é aviso (Seção 2 do DA11Y.md), e só se desenha com autorização |
| Contêiner | `FRAME` com auto layout horizontal: Ícone, Mensagem, Ação, Fechar | a ordem do auto layout é a ordem de leitura, com a mensagem antes da Ação e do Fechar |
| Ícone | `INSTANCE` de ícone | anda junto com o texto e a cor, nunca só a cor |
| Mensagem | `TEXT` | a mensagem inteira, nunca cortada |
| Ação ou link ("Desfazer") | uma `INSTANCE` de botão ou de link dentro de um `FRAME` próprio | é um alvo, e quando existe o toast persiste |
| Fechar | uma `INSTANCE` de botão dentro de um `FRAME` próprio | botão de verdade, com nome |
| Lugar na tela | a instância por cima do frame da tela, por exemplo com `layoutPositioning: ABSOLUTE` | o mesmo lugar relativo em todas as telas do produto |

## 2. Estados e variantes que o componente precisa ter

- **`Type`: status e erro.** Status é o padrão. Erro, para o que exige atenção imediata, é a exceção.
- **Com ação ou link, o toast persiste** até ser dispensado. Ação com cronômetro é limite de tempo (SC 2.2.1), e quem usa zoom, leitor de tela ou reage devagar perde.
- **Sem ação, ele pode fechar sozinho**, depois de ficar tempo suficiente para ser lido. A base é de cerca de 6 segundos, e cresce com o tamanho da mensagem.
- **Foco no Fechar e na ação**, vindo do conjunto `State` do componente de botão ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md)).
- **Repetição colapsada.** Três eventos iguais viram um toast só ("3 itens arquivados"), nunca uma pilha.

## 3. O que medir, a partir das propriedades

Além do piso do perfil (Seção 3 do DA11Y.md), o que é específico do toast:

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Erro além da cor | as variantes de status e de erro lado a lado | o ícone e o texto mudam, e não só o preenchimento |
| Tempo na tela | `reactions` na instância ou no frame que mostra o toast (o `COMPONENT_SET` não tem protótipo) | com ação ou link, nenhum `AFTER_TIMEOUT` tira o toast da tela. Sem ação, o `timeout` (em ms) dá cerca de 6 segundos, e mais para mensagem mais longa |
| Mesmo lugar | a posição do toast dentro de cada frame de tela do fluxo | o mesmo lugar relativo em todas as telas |

## 4. O que vira anotação

**Na anotação da instância do toast**, com a leitura da Seção 4 do DA11Y.md no formato curto da Seção 5:

- **Anúncio, com o texto exato.** O padrão é status, que espera a vez. Alerta interrompe, e fica só para erro que exige atenção imediata. Nunca os dois.
- **Fechar.** O nome dele é "Fechar".
- **Repetição colapsada**, com o texto dela.

**No relatório**, como requisito para o desenvolvimento:

- **O foco não vai para o toast.** Quem está digitando continua digitando.
- **Quanto tempo ele fica.** Com ação ou link, ele fica até ser dispensado. Sem ação, diga o tempo na tela.
- **Fechar.** O `Tab` alcança o botão. O Esc dispensa o toast que está com foco.
- **Onde mais a ação mora.** Diga o lugar, que é o menu do item ou o histórico.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)). No `FRAME` do Fechar, fixe `minWidth` e `minHeight`. Na mensagem, fixe `fills` e `fontSize`.

```markdown
5–6 · toast "Item arquivado."
📢 "Item arquivado."
5) 🔊 botão "Desfazer"
6) 🔊 botão "Fechar"
```

## 5. Onde a ação mora

- **O toast é atalho, não o endereço da funcionalidade.** "Desfazer" que só existe no toast tem prazo de validade. Confira se o menu do item ou o histórico tem a mesma operação. Se não tiver, avise a pessoa.
- **Resposta que exige ação agora é diálogo**, não toast ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-modals.md)).

## 6. Quando a tarefa cria ou muda o toast no design system

- **Descrição:** "Toast. Use para uma mensagem curta sobre algo que acabou de acontecer. Não use para erro de um campo (mostre ao lado do campo) nem para uma decisão que precisa de resposta agora (use Dialog). Apelidos: snackbar, notificação, mensagem de status, banner."
- **Propriedades:** `Type` (VARIANT), `Message` (TEXT), `Action` (BOOLEAN) com o rótulo dela (TEXT). Nenhuma propriedade esconde o Fechar.

## 7. Antipadrões no canvas

- **Ação ou link num toast que some sozinho** por um `AFTER_TIMEOUT`.
- **"Desfazer" que só existe no toast.**
- **Pilha de toasts iguais** em vez de uma mensagem colapsada.
- **Toast num lugar diferente em cada tela.**
- **Toast sem Fechar, ou com ícone de Fechar sem nome.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-toasts-notifications.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
