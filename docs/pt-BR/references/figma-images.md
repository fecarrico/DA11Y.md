# Imagens no canvas — imagem, ícone, ilustração e avatar

> **Escopo:** toda figura da tela (formas com preenchimento de imagem, ícones, ilustrações, avatares), a classe dela pelo teste de remoção e o texto alternativo, descritos em nós do Figma.
> **Traduz:** o [`guide-images.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-images.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Onde as imagens aparecem em nós

A Plugin API não tem campo de texto alternativo. A classe e o texto de cada imagem ficam numa anotação (Seção 4), então toda imagem precisa de um nó que aceite anotação.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Foto ou figura | um `RECTANGLE`, `ELLIPSE` ou outra forma cujo `fills` tem uma imagem | forma com preenchimento de imagem é imagem |
| Ícone | uma `INSTANCE` de um componente de ícone, com `VECTOR` ou `BOOLEAN_OPERATION` dentro | `BOOLEAN_OPERATION` não aceita anotação, então anote a instância do ícone |
| Ícone dentro de botão ou link | a `INSTANCE` do ícone dentro do `FRAME` interativo | é imagem funcional. O nome dela é a ação e fica no controle (Seção 5 do [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md)) |
| Ilustração | um `FRAME` ou uma `INSTANCE` com os vetores | uma anotação no contêiner, e não uma por vetor. Feita de `GROUP`, ela não tem lugar para a anotação, e isso é aviso |
| Avatar | uma forma com a foto no preenchimento, ou uma `INSTANCE` com as iniciais num `TEXT` | o teste de remoção decide, no contexto de cada uso |
| Gráfico ou diagrama | um `FRAME` com o desenho | é imagem complexa, tratada no [`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-charts.md) |

A ordem de leitura vem da ordem do auto layout do contêiner. Uma imagem com `layoutPositioning: ABSOLUTE` sai do fluxo. Os `children` vêm de trás para a frente, então o empilhamento não é a ordem de leitura.

## 2. O teste de remoção e as três classes

Pergunte, para cada uso: *"Se eu tirar esta imagem, o que a pessoa perde?"* O conteúdo vem da imagem e o propósito vem do contexto, então a mesma foto pode ser decorativa numa tela e informativa em outra. A classe é de cada uso, e não do componente.

| A pessoa perde | Classe | Rascunho do texto alternativo |
| :--- | :--- | :--- |
| informação | **informativa** | a conclusão: "Gráfico de barras mostrando crescimento de 20% nas vendas no primeiro trimestre", e não "Gráfico de vendas" |
| uma função (link ou botão) | **funcional** | a ação: "Imprimir documento", e não "Ícone de impressora" |
| nada | **candidata a decorativa** | vazio, só depois que a pessoa confirma |

- **Decorativa é decisão humana.** O agente pode suspeitar, nunca concluir. Um texto alternativo vazio aplicado sem confirmação esconde uma imagem que pode ser informativa, e nenhum verificador automático percebe.
- **Direto ao ponto:** nada de "Imagem de…" ou "Foto de…". O leitor de tela já diz que é uma imagem.
- **Casos no limite**, como uma imagem de destaque que pode ou não ser decorativa, são decisões de padrão. Registre no [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md) e reutilize.
- **Imagem sem decisão bloqueia a entrega:** funcional 🔴, informativa 🟠.

## 3. O que medir

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Ícone ou gráfico que carrega significado | o `fills` ou o `strokes` dos vetores contra o preenchimento do ancestral mais próximo | 3:1 (SC 1.4.11) |
| Estado mostrado por um ícone | as variantes do estado lado a lado | o ícone muda de forma ou vem com texto, e não só de cor |
| Alvo da imagem funcional | `width`, `height`, `minWidth`, `minHeight` do `FRAME` interativo, nunca do ícone | 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Iniciais do avatar | o `fills` do `TEXT` contra o preenchimento do avatar | 4.5:1 no Standard, 7:1 no Shield |
| Texto sobre imagem | o `fills` do `TEXT` contra a camada de contraste (scrim), no pior caso | o piso de texto do perfil, medido como na Seção 5 do [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-media.md) |

## 4. O que vira anotação

Uma anotação por imagem, na categoria **Accessibility**, no nó que mostra a imagem, começando com o status `Sugestão do agente — confirmar`. Na imagem funcional, ela vai no `FRAME` ou na `INSTANCE` interativa, porque a ação é do controle.

- **Classe**, com a resposta ao teste de remoção.
- **Rascunho do texto alternativo**, ou "vazio, aguardando confirmação" para a candidata a decorativa.
- **Imagem complexa:** a conclusão no texto alternativo e os dados numa tabela equivalente ([`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-charts.md)).
- **Esconder do leitor de tela** só a imagem decorativa confirmada, nunca a informativa.

No ícone, fixe `fills` ou `strokes` com a razão medida. No frame interativo, fixe `minWidth` e `minHeight`.

```markdown
**Sugestão do agente — confirmar**
Ilustração "Divisor em onda" · classe: candidata a decorativa (teste de remoção: nada se perde)
Texto alternativo: vazio, só depois da confirmação
```

## 5. Quando a imagem vem da pessoa

Um print colado, um arquivo enviado ou um arquivo citado recebe o texto alternativo antes de entrar no desenho.

1. **Veja o que você consegue perceber.** Se você consegue ver a imagem (entrada multimodal ou uma ferramenta que lê imagens), descreva a imagem. Se não consegue, peça a descrição à pessoa no mesmo turno. Um texto alternativo tirado do nome da camada ou do arquivo é evidência inventada.
2. **Classifique pelo teste de remoção** (Seção 2).
3. **Proponha, e a pessoa decide.** A leitura que o agente faz de uma imagem é hipótese, e não evidência. Por isso a confirmação é explícita.

## 6. Quando a tarefa cria ou muda um componente de ícone ou de imagem no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada às imagens:

- **Descrição:** o que é, quando usar, os apelidos ("Ícone. Apelidos: glifo, símbolo, pictograma.") e a frase "classe e texto alternativo são decididos em cada uso, numa anotação na instância".
- **Propriedades:** o ícone como `INSTANCE_SWAP`, para que cada uso troque o ícone em vez de redesenhá-lo.
- **Camadas com o nome do que mostram ou fazem** ("Foto do produto", "Ícone de imprimir"), nunca "Rectangle 12" ou o nome de um arquivo. O nome da camada é evidência para o próximo agente, e não o texto alternativo.
- **Contrato de acessibilidade como dado:** os 3:1 do ícone em cada estado e modo, e o SC 1.1.1 marcado como decidido em cada uso.

## 7. Antipadrões no canvas

- **Texto alternativo tirado do nome da camada ou do arquivo.**
- **"Decorativa" sem a confirmação da pessoa.**
- **Texto alternativo vago**, que começa com "Imagem de…", ou ícone funcional descrito pela aparência.
- **Imagem feita de `GROUP`**, sem lugar para a evidência.
- **Texto sobre imagem sem scrim medido.**

## 8. O que fica para o código

O `alt` em toda imagem, o valor vazio só onde a pessoa confirmou que é decorativa, o nome da imagem funcional e a marcação do SVG são implementados seguindo o [`guide-images.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-images.md) do A11Y.md. Se o leitor de tela lê cada texto alternativo confirmado e pula cada imagem decorativa confirmada, isso é conferido no produto construído, nunca no canvas, e entra no relatório de design como requisito para o desenvolvimento.
