# Imagens no canvas — imagem, ícone, ilustração e avatar

> **Escopo:** toda figura da tela (formas com preenchimento de imagem, ícones, ilustrações, avatares), a classe dela pelo teste de remoção e o texto alternativo, descritos em nós do Figma.
> **Traduz:** o [`guide-images.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-images.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Onde as imagens aparecem em nós

A Plugin API não tem campo de texto alternativo. A classe e o texto de cada imagem ficam numa anotação (Seção 4), então toda imagem precisa de um nó que aceite anotação.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Foto ou figura | um `RECTANGLE`, `ELLIPSE` ou outra forma cujo `fills` tem uma imagem | forma com preenchimento de imagem é imagem |
| Ícone | uma `INSTANCE` de um componente de ícone, com `VECTOR` ou `BOOLEAN_OPERATION` dentro | `BOOLEAN_OPERATION` não aceita anotação, então anote a instância do ícone |
| Ícone dentro de botão ou link | a `INSTANCE` do ícone dentro do `FRAME` interativo | é imagem funcional. O nome dela é a ação e fica no controle (Seção 5 do [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md)) |
| Ilustração | um `FRAME` ou uma `INSTANCE` com os vetores | uma anotação no contêiner, e não uma por vetor. Feita de `GROUP`, ela não tem lugar para a anotação, e isso é aviso |
| Avatar | uma forma com a foto no preenchimento, ou uma `INSTANCE` com as iniciais num `TEXT` | o teste de remoção decide, no contexto de cada uso |
| Gráfico ou diagrama | um `FRAME` com o desenho | é imagem complexa, tratada no [`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-charts.md) |

## 2. O teste de remoção e as três classes

O teste de remoção (Seção 2.1 do DA11Y.md) roda em cada uso. O conteúdo vem da imagem e o propósito vem do contexto, então a mesma foto pode ser decorativa numa tela e informativa em outra. A classe é de cada uso, e não do componente.

| A pessoa perde | Classe | Rascunho do texto alternativo |
| :--- | :--- | :--- |
| informação | **informativa** | a conclusão: "Gráfico de barras mostrando crescimento de 20% nas vendas no primeiro trimestre", e não "Gráfico de vendas" |
| uma função (link ou botão) | **funcional** | a ação: "Imprimir documento", e não "Ícone de impressora" |
| nada | **candidata a decorativa** | vazio, só depois que a pessoa confirma |

- **Decorativa é decisão humana** (Seção 2.1 do DA11Y.md). Um texto alternativo vazio aplicado sem confirmação esconde uma imagem que pode ser informativa, e nenhum verificador automático percebe.
- **Direto ao ponto:** nada de "Imagem de…" ou "Foto de…". O leitor de tela já diz que é uma imagem.
- **Casos no limite**, como uma imagem de destaque que pode ou não ser decorativa, são decisões de padrão. Registre no [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md) e reutilize.
- **Imagem sem decisão bloqueia a entrega:** funcional 🔴, informativa 🟠.

## 3. O que medir

Além do piso do perfil (Seção 3 do DA11Y.md), o que é específico das imagens:

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Ícone ou gráfico que carrega significado | o `fills` ou o `strokes` dos vetores contra o preenchimento do ancestral mais próximo | o piso do perfil (Seção 3 do DA11Y.md) |
| Iniciais do avatar | o `fills` do `TEXT` contra o preenchimento do avatar | o piso do perfil (Seção 3 do DA11Y.md) |
| Texto sobre imagem | o `fills` do `TEXT` contra a camada de contraste (scrim), no pior caso | o piso do perfil, medido como na Seção 5 do [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-media.md) |

## 4. O que vira anotação

A imagem lida entra na anotação do elemento que a contém, ou numa anotação própria, no nó que mostra a imagem. Na imagem funcional, ela vai no `FRAME` ou na `INSTANCE` interativa, porque a ação é do controle.

- **Imagem informativa ou funcional:** uma linha `🔊`, com o rascunho do texto alternativo.
- **Candidata a decorativa:** fica fora da anotação. Ela vai para o relatório como não lida, com a resposta ao teste de remoção, para a pessoa confirmar.
- **Imagem complexa:** a conclusão no texto alternativo e os dados numa tabela equivalente ([`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-charts.md)).
- **Esconder do leitor de tela** só a imagem decorativa confirmada, nunca a informativa.

No ícone, fixe `fills` ou `strokes` com a razão medida. No frame interativo, fixe `minWidth` e `minHeight`.

```markdown
4 · imagem do produto
🔊 imagem "Tênis de corrida azul, vista lateral"
```

## 5. Quando a imagem vem da pessoa

Um print colado, um arquivo enviado ou um arquivo citado recebe o texto alternativo antes de entrar no desenho.

1. **Veja o que você consegue perceber.** Se você consegue ver a imagem (entrada multimodal ou uma ferramenta que lê imagens), descreva a imagem. Se não consegue, peça a descrição à pessoa no mesmo turno. Um texto alternativo tirado do nome da camada ou do arquivo é evidência inventada.
2. **Classifique pelo teste de remoção** (Seção 2).
3. **Proponha, e a pessoa decide.** A leitura que o agente faz de uma imagem é hipótese, e não evidência. Por isso a confirmação é explícita.

## 6. Quando a tarefa cria ou muda um componente de ícone ou de imagem no design system

- **Descrição:** o que é, quando usar, os apelidos ("Ícone. Apelidos: glifo, símbolo, pictograma.") e a frase "classe e texto alternativo são decididos em cada uso, numa anotação na instância".
- **Propriedades:** o ícone como `INSTANCE_SWAP`, para que cada uso troque o ícone em vez de redesenhá-lo.

## 7. Antipadrões no canvas

- **Texto alternativo tirado do nome da camada ou do arquivo.**
- **"Decorativa" sem a confirmação da pessoa.**
- **Texto alternativo vago**, que começa com "Imagem de…", ou ícone funcional descrito pela aparência.
- **Imagem feita de `GROUP`**, sem lugar para a evidência.
- **Texto sobre imagem sem scrim medido.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-images.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-images.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
