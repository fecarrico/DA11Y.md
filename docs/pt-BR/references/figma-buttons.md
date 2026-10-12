# Botões no canvas — botão com texto, botão só com ícone e ações

> **Escopo:** o botão em todas as formas (primário, secundário, de texto, só com ícone), com rótulo, estados e alvo, e o que parece botão sem ser, descritos em nós do Figma.
> **Traduz:** o [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-buttons.md) do A11Y.md, com o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) §6 (desabilitado), fixados no commit `57564be`. As ações no fim de um campo estão no [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Tudo o que parece e funciona como botão é uma **instância do botão da biblioteca**. Desenhado à mão, ele é a versão no canvas da div clicável (§6 do núcleo do A11Y.md). Fica sem estados, sem alvo e sem nada que o código possa mapear.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Botão | `COMPONENT_SET` com a propriedade de variante `State`, e cada uso é uma `INSTANCE` | botão que falta na biblioteca para o caso é aviso (Seção 2 do DA11Y.md), e só se desenha um com autorização |
| Frame interativo | `COMPONENT` com auto layout horizontal e padding | a caixa dele é o **alvo**. Meça o frame, nunca o ícone nem o texto de dentro |
| Rótulo | `TEXT` dentro do frame, exposto como propriedade de componente `TEXT` chamada "Label" | diz o que o botão faz: "Baixar relatório", nunca "Clique aqui" |
| Ícone | uma `INSTANCE` de ícone, trocável por `INSTANCE_SWAP` | no botão só com ícone, ele é o único sinal visível. Precisa de 3:1 (Seção 3) e de um nome em anotação (Seções 4 e 5) |
| Grupo de botões (rodapé de diálogo, barra de ferramentas) | `FRAME` com auto layout, nunca um `GROUP` | a ordem do auto layout é a ordem de foco. O filho com `layoutPositioning: ABSOLUTE` sai dela |

## 2. Estados que o componente precisa ter

A propriedade `State` tem pelo menos **Default, Focus e Disabled**, e também todo outro estado que o produto mostra, como Hover e Pressed, em cada tipo de botão do conjunto.

- **Foco.** Meça em cada tipo de botão, porque um contorno que passa num botão claro pode reprovar num escuro.
- **Hover.** Quando só um tooltip que aparece no hover dá nome à ação, o botão continua precisando da anotação de nome ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-tooltips-popovers.md)).
- **Desabilitado.** É isento de contraste por ser componente inativo (SC 1.4.3 e 1.4.11), mas o cinza sozinho não diz o porquê (SC 1.4.1). Um `TEXT` visível ao lado do botão dá o motivo, no piso de texto do perfil. Sem motivo visível, é aviso.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Ícone do botão só com ícone | o `fills` ou o `strokes` do ícone contra o `fills` do frame | 3:1 (gráfico com significado, SC 1.4.11) |
| O que mostra que existe um botão ali | o `fills` ou o `strokes` do frame contra a cor em volta do botão | 3:1 quando esse é o único sinal (SC 1.4.11). Quando o rótulo sozinho já mostra que é uma ação, a leitura é discutível. Diga a dúvida (Seção 2 do DA11Y.md) e nunca troque o token |
| Como a ação dispara | `reactions` da instância | um `ON_CLICK` ou `ON_PRESS`. Ação que só acontece por `ON_HOVER`, `MOUSE_ENTER` ou `ON_DRAG` não tem caminho por toque (🔴, Seção 1 do DA11Y.md) |

## 4. O que vira anotação

Na instância do botão:

- **Nome.** O rótulo visível. Quando o nome precisa de mais ("Editar" repetido numa lista), ele contém o rótulo na mesma ordem: "Editar fatura 482" (SC 2.5.3).
- **Papel, quando a aparência engana.** Botão cuja reação leva a outra tela ou abre uma `URL` é link. Link em forma de texto que executa uma ação é botão. Card inteiro clicável diz o que é.
- **Qual desabilitado.** Fora da ordem de foco, ou ainda alcançável para a pessoa ouvir o motivo, como um botão de enviar esperando campos obrigatórios.
- **Anúncio**, com o texto exato, quando o botão muda a tela sem levar a pessoa a outro lugar: "Adicionado ao carrinho".

Fixe `minWidth`, `minHeight` e `fills` no frame do botão, `fills` e `fontSize` no rótulo, e `strokes` e `strokeWeight` na variante Focus (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)).

```markdown
**Decisão sua · proposta do agente**
Botão só com ícone · nome: Fechar modal · papel: botão
Alvo: frame 44×44 (minWidth/minHeight fixados), ícone com 3:1 contra o frame
```

## 5. Nomes que funcionam fora de contexto, e botões só com ícone

- **Cada nome funciona sozinho**, porque quem usa leitor de tela lista todos os botões da tela para se mover: "Baixar relatório", nunca "Clique aqui" nem "Saiba mais".
- **O nome do botão só com ícone diz o que ele faz** ("Fechar modal", "Buscar"), nunca o ícone ("X", "lupa") nem um nome de arquivo ou de componente ("ic_close_24").
- **Dê à camada da instância o nome da ação.** O próximo agente lê o nome da camada como pista (Seção 1 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)), e "Icon 3" engana esse agente. O nome acessível continua morando na anotação.

## 6. Quando a tarefa cria ou muda o botão no design system

- **Descrição:** "Botão. Use para executar uma ação nesta tela, como enviar, salvar ou abrir um diálogo. Não use para ir a outra página (use Link). Apelidos: button, botão, CTA, ação, botão de ícone."
- **Propriedades:** `State` (VARIANT), `Variant` (VARIANT: Primary, Secondary, Text), `Label` (TEXT), `Icon only` (BOOLEAN), `Icon` (INSTANCE_SWAP).

## 7. Antipadrões no canvas

- **Botão desenhado à mão**, com um `RECTANGLE` e um `TEXT` ou com um `GROUP`, imitando o botão da biblioteca.
- **Botão só com ícone sem nome**, ou com o nome do ícone.
- **Rótulo cortado com reticências** num botão de largura fixa.
- **Botão desabilitado sem motivo visível.**
- **Ação que só existe no hover.**

## 8. O que fica para o código

A semântica, o teclado e o leitor de tela são implementados seguindo o [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-buttons.md) do A11Y.md. Os cenários de verificação dele rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
