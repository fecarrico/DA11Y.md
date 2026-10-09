# Toasts e notificações no canvas — mensagem, ação, fechar e lugar

> **Escopo:** o toast, o snackbar, o banner e a mensagem de status, descritos em nós do Figma.
> **Traduz:** o [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-toasts-notifications.md) do A11Y.md, fixado no commit `57564be`. Resposta que exige ação agora é diálogo, e está no [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-modals.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

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

Nunca use um `GROUP` para o toast ou para os botões dele, porque o grupo não tem caixa para medir nem aceita anotação.

## 2. Estados e variantes que o componente precisa ter

- **`Type`: status e erro.** Status é o padrão. Erro, para o que exige atenção imediata, é a exceção.
- **Com ação ou link, o toast persiste** até ser dispensado. Ação com cronômetro é limite de tempo (SC 2.2.1), e quem usa zoom, leitor de tela ou reage devagar perde.
- **Sem ação, ele pode fechar sozinho**, depois de ficar tempo suficiente para ser lido. A base é de cerca de 6 segundos, e cresce com o tamanho da mensagem.
- **Foco no Fechar e na ação**, vindo do conjunto `State` do componente de botão ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md)). Botão sem Focus é aviso da Seção 2.
- **Repetição colapsada.** Três eventos iguais viram um toast só ("3 itens arquivados"), nunca uma pilha.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto da mensagem e da ação | o `fills` do `TEXT` contra o `fills` do toast | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| Ícone do tipo e ícone do Fechar | o `fills` ou o `strokes` do ícone contra o `fills` do toast | 3:1 (SC 1.4.11) |
| Foco | o `strokes` e o `strokeWeight` da variante Focus contra o preenchimento do toast | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7). Sombra em `effects` sozinha não conta |
| Alvo do Fechar e da ação | `width`, `height`, `minWidth`, `minHeight` de cada `FRAME`, nunca do ícone | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` entre a ação e o Fechar | 8px entre alvos vizinhos (Regra da Casa†) |
| Texto que cresce | `textAutoResize` da mensagem, `layoutSizingVertical` do contêiner | `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de `HUG`. `TRUNCATE`, `maxLines` ou altura `FIXED` cortam a mensagem no zoom de 200% |
| Tamanho da fonte | `fontSize` da mensagem e da ação | a fonte mínima do perfil: 12px no Standard, 14px no Shield |
| Erro além da cor | as variantes de status e de erro lado a lado | o ícone e o texto mudam, e não só o preenchimento |
| Tempo na tela | `reactions` na instância ou no frame que mostra o toast (o `COMPONENT_SET` não tem protótipo) | com ação ou link, nenhum `AFTER_TIMEOUT` tira o toast da tela. Sem ação, o `timeout` (em ms) dá cerca de 6 segundos, e mais para mensagem mais longa |
| Mesmo lugar | a posição do toast dentro de cada frame de tela do fluxo | o mesmo lugar relativo em todas as telas |

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, na instância do toast, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Anúncio, com o texto exato.** O padrão é status, que espera a vez. Alerta interrompe, e fica só para erro que exige atenção imediata. Nunca os dois.
- **O foco não vai para o toast.** Quem está digitando continua digitando.
- **Quanto tempo ele fica.** Com ação ou link, ele fica até ser dispensado. Sem ação, diga o tempo na tela.
- **Fechar.** O nome dele é "Fechar", e o `Tab` alcança o botão. O Esc dispensa o toast que está com foco.
- **Onde mais a ação mora.** Diga o lugar, que é o menu do item ou o histórico.
- **Repetição colapsada**, com o texto dela.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). No `FRAME` do Fechar, fixe `minWidth` e `minHeight`. Na mensagem, fixe `fills` e `fontSize`.

```markdown
**Sugestão do agente — confirmar**
Toast "Item arquivado." · anunciado como status (espera a vez) · o foco não se move
Ação "Desfazer" · fica até ser dispensado · também no menu do item
Fechar: botão "Fechar", alcançado pelo Tab · Esc dispensa · repetição: "3 itens arquivados"
```

## 5. Onde a ação mora

- **O toast é atalho, não o endereço da funcionalidade.** "Desfazer" que só existe no toast tem prazo de validade. Confira se o menu do item ou o histórico tem a mesma operação. Se não tiver, avise a pessoa.
- **Resposta que exige ação agora é diálogo**, não toast ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-modals.md)).

## 6. Quando a tarefa cria ou muda o toast no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada ao toast:

- **Descrição:** "Toast. Use para uma mensagem curta sobre algo que acabou de acontecer. Não use para erro de um campo (mostre ao lado do campo) nem para uma decisão que precisa de resposta agora (use Dialog). Apelidos: snackbar, notificação, mensagem de status, banner."
- **Propriedades:** `Type` (VARIANT), `Message` (TEXT), `Action` (BOOLEAN) com o rótulo dela (TEXT). Nenhuma propriedade esconde o Fechar.
- **Camadas na ordem de leitura:** Icon, Message, Action, Close button.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, mais o anúncio e a persistência. Eles ficam como não testados até o código verificar.

## 7. Antipadrões no canvas

- **Ação ou link num toast que some sozinho** por um `AFTER_TIMEOUT`.
- **"Desfazer" que só existe no toast.**
- **Pilha de toasts iguais** em vez de uma mensagem colapsada.
- **Toast num lugar diferente em cada tela.**
- **Toast de erro diferenciado só pela cor.**
- **Toast sem Fechar, ou com ícone de Fechar sem nome.**

## 8. O que fica para o código

A região viva que existe antes da primeira mensagem, o papel de status ou de alerta (nunca os dois), o foco que não se move, o tempo na tela, o Fechar como botão de verdade e o Esc são implementados seguindo o [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-toasts-notifications.md) do A11Y.md (SC 4.1.3, 2.2.1 e 2.1.1). Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
