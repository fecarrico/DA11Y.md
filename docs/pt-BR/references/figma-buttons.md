# Botões no canvas — botão com texto, botão só com ícone e ações

> **Escopo:** o botão em todas as formas (primário, secundário, de texto, só com ícone), com rótulo, estados e alvo, e o que parece botão sem ser, descritos em nós do Figma.
> **Traduz:** o [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-buttons.md) do A11Y.md, com o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) §6 (desabilitado), fixados no commit `57564be`. As ações no fim de um campo estão no [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Tudo o que parece e funciona como botão é uma **instância do botão da biblioteca**. Desenhado à mão, ele é a versão no canvas da div clicável (§6 do núcleo do A11Y.md). Fica sem estados, sem alvo definido e sem nada que o código possa mapear.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Botão | `COMPONENT_SET` com a propriedade de variante `State`, e cada uso é uma `INSTANCE` | se a biblioteca não tem botão para o caso, isso é um aviso (Seção 2 do DA11Y.md), e só se desenha um com autorização |
| Frame interativo | `COMPONENT` com auto layout horizontal e padding em volta do conteúdo | a caixa dele é o **alvo**. Meça o frame, nunca o ícone nem o texto de dentro |
| Rótulo | `TEXT` dentro do frame, exposto como propriedade de componente `TEXT` chamada "Label" | diz o que o botão faz: "Baixar relatório", nunca "Clique aqui" |
| Ícone | uma `INSTANCE` de ícone dentro do frame, trocável por `INSTANCE_SWAP` | no botão só com ícone, ele é o único sinal visível. Precisa de 3:1 (Seção 3) e de um nome em anotação (Seções 4 e 5) |
| Motivo do desabilitado | `TEXT` ao lado do botão, na tela | texto visível, no piso de texto do perfil |
| Grupo de botões (rodapé de diálogo, barra de ferramentas) | `FRAME` com auto layout | a ordem do auto layout é a ordem de leitura e de foco. O filho com `layoutPositioning: ABSOLUTE` sai do fluxo. Nunca um `GROUP` |

## 2. Estados que o componente precisa ter

A propriedade `State` tem pelo menos **Default, Focus e Disabled**, e também todo outro estado que o produto mostra, como Hover e Pressed, medido como os demais. Cada tipo de botão do conjunto (primário, secundário, de texto, só com ícone) tem todos eles. Estado que falta na biblioteca é aviso (Seção 2 do DA11Y.md). Aponte a falta e desenhe o estado só com autorização.

- **Foco.** Um contorno de pelo menos 2px com 3:1 contra a cor vizinha, feito com `strokes` e `strokeWeight`. Sombra em `effects` sozinha não conta, porque some no modo de alto contraste. Meça em cada tipo de botão, porque um contorno que passa num botão claro pode reprovar num escuro.
- **Hover.** Quando o único lugar que dá nome à ação é um tooltip que aparece no hover, o botão continua precisando da anotação de nome ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-tooltips-popovers.md)).
- **Desabilitado.** O botão desabilitado é isento de contraste (componente inativo, SC 1.4.3 e 1.4.11). O cinza sozinho não diz o porquê (SC 1.4.1), então um texto visível dá o motivo, e esse texto não é isento. Botão desabilitado sem motivo visível é aviso.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Rótulo | o `fills` do `TEXT` do rótulo contra o `fills` do frame, em todo estado menos Disabled | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| Ícone do botão só com ícone | o `fills` ou o `strokes` do ícone contra o `fills` do frame | 3:1 (gráfico com significado, SC 1.4.11) |
| O que mostra que existe um botão ali | o `fills` ou o `strokes` do frame contra a cor em volta do botão | 3:1 quando esse é o único sinal (SC 1.4.11). Quando o rótulo sozinho já mostra que é uma ação, a leitura é discutível. Diga a dúvida (Seção 2 do DA11Y.md) e nunca troque o token da biblioteca por conta própria |
| Foco | o `strokes` e o `strokeWeight` da variante Focus contra a cor vizinha | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7) |
| Alvo | `width`, `height`, `minWidth` e `minHeight` do frame do botão | 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` entre botões vizinhos | 8px entre alvos vizinhos (Regra da Casa†) |
| Rótulo que cresce | `textAutoResize` do rótulo e `layoutSizingHorizontal` do frame | `WIDTH_AND_HEIGHT` ou `HEIGHT` dentro de um frame `HUG`. `TRUNCATE`, `maxLines` ou largura `FIXED` cortam o rótulo no zoom de 200% |
| Tamanho da fonte | `fontSize` do rótulo | 12px no Standard, 14px no Shield |
| Como a ação dispara | `reactions` da instância | a ação tem `ON_CLICK` ou `ON_PRESS`. Ação que só acontece por `ON_HOVER`, `MOUSE_ENTER` ou `ON_DRAG` não tem caminho por toque (🔴, Seção 1 do DA11Y.md) |

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, na instância do botão, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Nome.** Quando o rótulo visível diz tudo, ele é o nome. Quando o nome precisa de mais ("Editar" repetido numa lista), o nome contém o texto visível, na mesma ordem: "Editar fatura 482" (SC 2.5.3).
- **Papel, quando a aparência engana.** Botão que leva a outra tela ou abre uma `URL` é um link com cara de botão. Link em forma de texto que executa uma ação é um botão. Card inteiro clicável também precisa dizer o que é.
- **Qual desabilitado.** Fora da ordem de foco, quando o botão de fato não pode ser usado agora. Ou ainda alcançável, para a pessoa encontrar o botão e ouvir o motivo, como um botão de enviar esperando campos obrigatórios.
- **Anúncio**, com o texto exato, quando apertar o botão muda a tela sem levar a pessoa a outro lugar: "Adicionado ao carrinho".

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). No frame do botão, fixe `minWidth`, `minHeight` e `fills`. No rótulo, fixe `fills` e `fontSize`. Na variante Focus, fixe `strokes` e `strokeWeight`.

```markdown
**Sugestão do agente — confirmar**
Botão só com ícone · nome: Fechar modal · papel: botão
Alvo: frame 44×44 (minWidth/minHeight fixados), ícone com 3:1 contra o frame
```

## 5. Nomes que funcionam fora de contexto, e botões só com ícone

- **Quem usa leitor de tela costuma listar todos os botões da tela para se mover**, então cada nome precisa funcionar sozinho. "Clique aqui" e "Saiba mais" não dizem nada. "Baixar relatório" e "Leia sobre nossa história" dizem.
- **O nome do botão só com ícone diz o que ele faz** ("Fechar modal", "Buscar"), nunca o ícone ("X", "lupa") nem um nome de arquivo ou de componente ("ic_close_24").
- **Dê à camada da instância o nome da ação.** O próximo agente lê o nome da camada como pista (Seção 1 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)), e uma camada chamada "Icon 3" engana esse agente. O nome acessível continua morando na anotação.

## 6. Quando a tarefa cria ou muda o botão no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada ao botão:

- **Descrição:** "Botão. Use para executar uma ação nesta tela, como enviar, salvar ou abrir um diálogo. Não use para ir a outra página (use Link). Apelidos: button, botão, CTA, ação, botão de ícone."
- **Propriedades:** `State` (VARIANT), `Variant` (VARIANT: Primary, Secondary, Text), `Label` (TEXT), `Icon only` (BOOLEAN), `Icon` (INSTANCE_SWAP).
- **Camadas com o nome do que são, na ordem de leitura:** Button, Icon, Label.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, com o resultado medido de cada estado em cada modo, e também a anotação de nome que todo uso do botão só com ícone precisa ter.

## 7. Antipadrões no canvas

- **Botão desenhado à mão**, com um `RECTANGLE` e um `TEXT` ou com um `GROUP`, imitando o botão da biblioteca.
- **Botão só com ícone sem nome**, ou com o nome do ícone.
- **"Clique aqui" ou "Saiba mais"** como rótulo inteiro.
- **Foco desenhado só com sombra** em `effects`.
- **Rótulo cortado com reticências** num botão de largura fixa.
- **Botão desabilitado sem motivo visível.**
- **Ação que só existe no hover.**

## 8. O que fica para o código

O botão nativo, o papel dele, `Enter` e `Espaço`, o nome acessível e o estado desabilitado são implementados seguindo o [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-buttons.md) e o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) §6 do A11Y.md. Os cenários de verificação desses guias (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
