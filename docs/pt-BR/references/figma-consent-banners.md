# Banners de consentimento no canvas — bloquear ou não, espaço para o foco e escolhas iguais

> **Escopo:** avisos de consentimento, banners de cookies e sobreposições de privacidade, como modal sobre a página ou como faixa que deixa a página utilizável, em nós do Figma.
> **Traduz:** o [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-consent-banners.md) do A11Y.md, fixado no commit `57564be`. A versão modal também segue o [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-modals.md), e as ações seguem o [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

**Decida primeiro se ele bloqueia.** Essa bifurcação define todo o resto, e o padrão errado é a falha mais comum.

| Se o banner… | Ele é… | No canvas |
| :--- | :--- | :--- |
| impede usar a página até haver resposta | um **diálogo modal** | segue o [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-modals.md) |
| deixa a página utilizável, numa faixa | uma **região não modal** | sem camada escura (scrim) sobre a página, e a página guarda espaço para a faixa (Seção 3) |

O erro clássico é o híbrido, uma faixa que escurece a página e ignora cliques, mas não prende o foco. Ela parece modal e não significa nada para o leitor de tela. Um scrim sobre a página faz do banner um modal, e no Figma ele é um `FRAME` ou `RECTANGLE` com `fills` por cima da página. Então o desenho ou bloqueia de verdade ou não escurece.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Banner | `INSTANCE` do componente de banner da biblioteca, um `FRAME` com auto layout | mensagem e ações andam juntas num componente só |
| Título | `TEXT` | o nome visível do banner, quando ele tem um. Sem título, o nome vai na anotação |
| Mensagem | `TEXT` | linguagem simples (Seção 5 do [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-cognitive.md)). O texto do banner é o caso mais denso de jargão jurídico da interface |
| Ações: Aceitar tudo, Recusar tudo, Gerenciar preferências | `INSTANCE`s de botão, vizinhas no mesmo `FRAME` com auto layout | Aceitar tudo e Recusar tudo no mesmo nível e com o mesmo peso visual (Seção 5) |
| Fechar | uma `INSTANCE` de botão de ícone num `FRAME` próprio | um botão com alvo e nome próprios ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md)) |

## 2. Estados que o componente precisa ter

Estado ou tela que falta na biblioteca ou no fluxo é aviso (Seção 2 do DA11Y.md). Aponte a falta e desenhe só com autorização.

- **Ações e botão de fechar.** Os estados de botão da Seção 2 do [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md), sempre com Focus.
- **O fluxo.** A tela com o banner aberto e a tela depois de cada resposta. No protótipo, Recusar tudo chega à tela respondida com um `ON_CLICK`, igual a Aceitar tudo.
- **Nenhum estado em que o banner se fecha sozinho.** Banner que se fecha sozinho, ou que assume o consentimento depois de alguns segundos, falha no SC 2.2.1 e derruba a base legal junto.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto do título, da mensagem e das ações | o `fills` do `TEXT` contra o preenchimento do ancestral mais próximo que tenha um | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| Ações | as checagens da Seção 3 do [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md) | as mesmas de qualquer controle, porque o banner não é exceção de densidade |
| Alvos | `width`, `height`, `minWidth` e `minHeight` de cada `FRAME` de ação e do `FRAME` de fechar | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` entre as ações e o botão de fechar | 8px entre alvos vizinhos (Regra da Casa†) |
| Paridade | `mainComponent` e `variantProperties` de Aceitar tudo e Recusar tudo, e o pai delas | o mesmo peso visual (Regra da Casa†) e vizinhas no mesmo `FRAME` pai. O mesmo componente com a mesma variante passa. Variantes diferentes são uma dúvida para a pessoa resolver, nunca aprovação automática |
| Um clique para recusar | as `reactions` de Recusar tudo | um `ON_CLICK` até o estado respondido, e nunca passando por Gerenciar preferências |
| Foco não coberto (SC 2.4.11) | a `height` e a `absoluteBoundingBox` da faixa, o padding do conteúdo da página do lado da faixa, e a `absoluteBoundingBox` dos elementos interativos perto da faixa | o conteúdo reserva a `height` da faixa (`paddingBottom` para uma faixa no rodapé), e nenhuma caixa de elemento interativo fica inteira dentro da caixa da faixa |
| Sem limite de tempo | `reactions` com o gatilho `AFTER_TIMEOUT` no banner e na tela dele | nenhuma |
| Texto que cresce | `textAutoResize` da mensagem, e `layoutSizingVertical` do banner | `HEIGHT` dentro de um banner `HUG`. Altura `FIXED` corta a mensagem no zoom de 200% |
| Tamanho da fonte | `fontSize` do título, da mensagem e das ações | a fonte mínima do perfil: 12px no Standard, 14px no Shield |

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, na instância do banner, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Padrão e nome.** Diálogo modal ou região não modal, e o nome dele (o título visível, ou um nome proposto).
- **Se for modal.** O foco entra nele quando ele aparece, o `Tab` fica dentro dele, o `Esc` fecha e devolve o foco para onde estava, e a página atrás fica fora de alcance ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-modals.md)).
- **Se for não modal.** Ele não pega o foco. A pessoa chega nele na ordem natural, no lugar dele na anotação de ordem de leitura da tela, e nada a prende ali. Se ele aparece depois que a página carrega, é anunciado como mensagem de status com o texto exato, sem mover o foco.
- **O nome de cada ação**, dizendo o resultado, e o nome do botão de fechar.
- **Sem limite de tempo.** Ele nunca se fecha sozinho e nunca assume uma resposta.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). Em cada ação, fixe `minWidth`, `minHeight` e `fills`. Na faixa, fixe `height`. No conteúdo da página, fixe `padding`.

```markdown
**Sugestão do agente — confirmar**
Banner de consentimento · região não modal · nome: "Cookies neste site" (título visível) · não pega o foco
Depois do carregamento, anunciado como status: "Usamos cookies. Escolha Aceitar tudo ou Recusar tudo."
Ações: "Aceitar tudo", "Recusar tudo", "Gerenciar preferências" · fechar: "Fechar aviso de cookies" · nunca se fecha sozinho
```

## 5. Paridade entre aceitar e recusar

**Regra da Casa†.** Se Aceitar tudo é um botão de um clique, Recusar tudo também é um botão de um clique, no mesmo nível de navegação e com o mesmo peso visual. No canvas, a paridade se lê assim:

- **O mesmo peso visual.** O mesmo componente com a mesma variante (`mainComponent`, `variantProperties`) resolve. Aceitar tudo como botão principal ao lado de Recusar tudo desenhado como link, ou numa variante mais fraca, quebra a paridade.
- **Vizinhas no mesmo `FRAME`**, as duas visíveis quando o banner abre.
- **Recusar nunca fica atrás de Gerenciar preferências**, de uma lista de fornecedores e de um Salvar. Esse labirinto pesa mais para quem tem limitação motora ou fadiga cognitiva. A WCAG não nomeia isso. A Lei Europeia de Acessibilidade (EAA) e o Regulamento Geral de Proteção de Dados (RGPD) nomeiam. O Princípio Zero também responde, porque se completar a tarefa exige um labirinto, a tarefa está quebrada.

Relaxar esta Regra da Casa é decisão de produto, registrada no [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md).

## 6. Quando a tarefa cria ou muda o banner no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada ao banner de consentimento:

- **Descrição:** "Banner de consentimento. Use para pedir consentimento para cookies ou uso de dados. Use a versão modal só quando a página não pode ser usada antes da resposta. Não use para outras mensagens (use toast ou alerta). Apelidos: cookie banner, banner de cookies, aviso de cookies, aviso de consentimento, aviso de privacidade."
- **Propriedades:** `Modal` (BOOLEAN), `Title` e `Message` (TEXT), com as ações como instâncias de botão.
- **Camadas com o nome do que são, na ordem de leitura**, por exemplo: Title, Message, Accept all, Reject all, Manage preferences, Close.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, com a paridade incluída e o resultado medido de cada estado em cada modo.

## 7. Antipadrões no canvas

- **O híbrido**, uma faixa que escurece a página mas não prende o foco.
- **Faixa desenhada por cima do conteúdo** sem espaço reservado, e o último elemento focado some embaixo dela.
- **Recusar tudo escondido** atrás de Gerenciar preferências, ou desenhado menor, como link ou numa variante mais fraca que Aceitar tudo.
- **Banner que se fecha sozinho**, ou um `AFTER_TIMEOUT` que assume o consentimento.
- **Alvos menores no banner** para economizar espaço.
- **Ações desenhadas como texto ou como `GROUP`**, inclusive o X de fechar, em vez de instâncias de botão.
- **Jargão jurídico** na mensagem.

## 8. O que fica para o código

A semântica de diálogo ou de região, o foco movido e contido ou deixado no lugar, o `Esc`, o anúncio de status do banner que chega depois, os botões nativos e o espaço reservado no layout são implementados seguindo o [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-consent-banners.md) do A11Y.md. Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.

Quando o banner vem de uma plataforma de gestão de consentimento (CMP), a obrigação não passa junto com o script. O relatório pede que o banner do fornecedor seja testado com teclado e leitor de tela antes de ser instalado. Se ele reprova e não pode ser trocado no ciclo atual, isso vira uma entrada no [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/EXCEPTIONS.md), com dono do risco, tarefa de acompanhamento e prazo de expiração. As opções de acessibilidade que a CMP traz desligadas fazem parte da configuração dela, e não da fila de pendências.
