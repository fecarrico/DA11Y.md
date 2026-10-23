# Banners de consentimento no canvas — bloquear ou não, espaço para o foco e escolhas iguais

> **Escopo:** avisos de consentimento, banners de cookies e sobreposições de privacidade, como modal sobre a página ou como faixa que deixa a página utilizável, em nós do Figma.
> **Traduz:** o [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-consent-banners.md) do A11Y.md, fixado no commit `9fb9a02`. A versão modal também segue o [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-modals.md), e as ações seguem o [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-buttons.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

**Decida primeiro se ele bloqueia.** Essa bifurcação define todo o resto, e o padrão errado é a falha mais comum.

| Se o banner… | Ele é… | No canvas |
| :--- | :--- | :--- |
| impede usar a página até haver resposta | um **diálogo modal** | segue o [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-modals.md) |
| deixa a página utilizável, numa faixa | uma **região não modal** | sem camada escura (scrim) sobre a página, e a página guarda espaço para a faixa (Seção 3) |

O erro clássico é o híbrido, uma faixa que escurece a página e ignora cliques, mas não prende o foco. Um scrim sobre a página faz do banner um modal, e no Figma ele é um `FRAME` ou `RECTANGLE` com `fills` por cima da página. Então o desenho ou bloqueia de verdade ou não escurece.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Banner | `INSTANCE` do componente de banner da biblioteca, um `FRAME` com auto layout | mensagem e ações andam juntas num componente só |
| Título | `TEXT` | o nome visível do banner, quando ele tem um. Sem título, o nome vai na anotação |
| Mensagem | `TEXT` | linguagem simples (Seção 5 do [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-cognitive.md)). O texto do banner é o caso mais denso de jargão jurídico da interface |
| Ações: Aceitar tudo, Recusar tudo, Gerenciar preferências | `INSTANCE`s de botão, vizinhas no mesmo `FRAME` com auto layout | Aceitar tudo e Recusar tudo no mesmo nível e com o mesmo peso visual (Seção 5) |
| Fechar | uma `INSTANCE` de botão de ícone num `FRAME` próprio | um botão com alvo e nome próprios ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-buttons.md)) |

## 2. Estados que o componente precisa ter

- **O fluxo.** A tela com o banner aberto e a tela depois de cada resposta. Recusar tudo chega à tela respondida com uma ação só, igual a Aceitar tudo.
- **Nenhum estado em que o banner se fecha sozinho.** Banner que se fecha sozinho, ou que assume o consentimento depois de alguns segundos, falha no SC 2.2.1 e derruba a base legal junto.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Ações | as checagens da Seção 3 do [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-buttons.md), em cada `FRAME` de ação e no `FRAME` de fechar | as mesmas de qualquer controle, porque o banner não é exceção de densidade |
| Paridade | `mainComponent` e `variantProperties` de Aceitar tudo e Recusar tudo, e o pai delas | o mesmo peso visual (regra do A11Y.md†) e vizinhas no mesmo `FRAME` pai. O mesmo componente com a mesma variante passa. Variantes diferentes são uma dúvida para a pessoa resolver, nunca aprovação automática |
| Um clique para recusar | o banner e as `reactions` de Recusar tudo | Recusar tudo está no banner, no mesmo nível de Aceitar tudo. Uma reação que passa por Gerenciar preferências antes do estado respondido reprova |
| Foco não coberto (SC 2.4.11) | a `height` e a `absoluteBoundingBox` da faixa, o padding do conteúdo da página do lado da faixa, e a `absoluteBoundingBox` dos elementos interativos perto da faixa | o conteúdo reserva a `height` da faixa (`paddingBottom` para uma faixa no rodapé), e nenhuma caixa de elemento interativo fica inteira dentro da caixa da faixa |
| Sem limite de tempo | `reactions` com o gatilho `AFTER_TIMEOUT` no banner e na tela dele | nenhuma |

## 4. O que vira anotação

**Na anotação da instância do banner**, no formato curto da Seção 5 do DA11Y.md:

- **Padrão e nome.** Diálogo modal ou região não modal, e o nome dele (o título visível, ou um nome proposto).
- **Se for não modal.** Ele tem o lugar dele na anotação de ordem de leitura da tela. Se ele aparece depois que a página carrega, é anunciado como mensagem de status, com o texto exato.
- **O nome de cada ação**, dizendo o resultado, e o nome do botão de fechar.

**No relatório**, como requisito para o desenvolvimento:

- **Se for modal.** O foco entra nele, o `Tab` fica dentro, o `Esc` fecha e devolve o foco, e a página atrás fica fora de alcance ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-modals.md)).
- **Se for não modal.** Ele não pega o foco, nem quando é anunciado. A pessoa chega nele na ordem natural, e nada a prende ali.
- **Sem limite de tempo.** Ele nunca se fecha sozinho e nunca assume uma resposta.

Fixe `minWidth`, `minHeight` e `fills` em cada ação, `height` na faixa, e `padding` no conteúdo da página (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/pt-BR/references/figma-nodes.md)).

```markdown
1–4 · banner "Cookies neste site"
📢 "Usamos cookies. Escolha Aceitar tudo ou Recusar tudo."
1) 🔊 botão "Aceitar tudo"
2) 🔊 botão "Recusar tudo"
3) 🔊 botão "Gerenciar preferências"
4) 🔊 botão "Fechar aviso de cookies"
```

## 5. Paridade entre aceitar e recusar

**Regra do A11Y.md†.** Se Aceitar tudo é um botão de um clique, Recusar tudo também é um botão de um clique, no mesmo nível de navegação e com o mesmo peso visual. Isso quer dizer o mesmo componente com a mesma variante, vizinhas no mesmo `FRAME` e as duas visíveis quando o banner abre, como na linha Paridade da Seção 3. Recusar nunca fica atrás de Gerenciar preferências, de uma lista de fornecedores e de um Salvar. Esse labirinto pesa mais para quem tem limitação motora ou fadiga cognitiva. A WCAG não nomeia isso. A Lei Europeia de Acessibilidade (EAA) e o Regulamento Geral de Proteção de Dados (RGPD) nomeiam. O Princípio Zero também responde, porque se completar a tarefa exige um labirinto, a tarefa está quebrada.

Relaxar esta regra do A11Y.md é decisão de produto, registrada no [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/A11Y-DECISIONS.md).

## 6. Quando a tarefa cria ou muda o banner no design system

- **Descrição:** "Banner de consentimento. Use para pedir consentimento para cookies ou uso de dados. Use a versão modal só quando a página não pode ser usada antes da resposta. Não use para outras mensagens (use toast ou alerta). Apelidos: cookie banner, banner de cookies, aviso de cookies, aviso de consentimento, aviso de privacidade."
- **Propriedades:** `Modal` (BOOLEAN), `Title` e `Message` (TEXT), com as ações como instâncias de botão.

## 7. Antipadrões no canvas

- **O híbrido**, uma faixa que escurece a página mas não prende o foco.
- **Faixa desenhada por cima do conteúdo** sem espaço reservado, e o último elemento focado some embaixo dela.
- **Recusar tudo escondido** atrás de Gerenciar preferências, ou desenhado menor, como link ou numa variante mais fraca que Aceitar tudo.
- **Banner que se fecha sozinho**, ou um `AFTER_TIMEOUT` que assume o consentimento.
- **Alvos menores no banner** para economizar espaço.
- **Ações desenhadas como texto**, inclusive o X de fechar, em vez de instâncias de botão.
- **Jargão jurídico** na mensagem.

## 8. O que fica para o código

A semântica, o teclado e o leitor de tela são implementados seguindo o [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-consent-banners.md) do A11Y.md. Os cenários de verificação dele rodam no produto construído e entram no relatório como requisitos para o desenvolvimento. Uma plataforma de gestão de consentimento (CMP) não leva a obrigação junto. O relatório pede que o banner do fornecedor seja testado com teclado e leitor de tela antes de ser instalado, a reprovação que não pode ser trocada no ciclo vira entrada no [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/EXCEPTIONS.md), e as opções de acessibilidade que a CMP traz desligadas fazem parte da configuração dela, e não da fila de pendências.
