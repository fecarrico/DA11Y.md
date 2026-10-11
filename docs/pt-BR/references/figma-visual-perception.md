# Cor e contraste no canvas — preenchimentos, variáveis, modos e a matriz de pares

> **Escopo:** a cor nos nós do Figma. Isso inclui o `fills`, o `strokes` e o `effects` de textos, formas e frames, as variáveis ligadas a eles, os modos em que elas se resolvem (claro, escuro e qualquer outro que o arquivo use) e a paleta, quando a tarefa cria ou muda essa paleta.
> **Traduz:** o [`guide-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-visual-perception.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Onde a cor fica nos nós

| O quê | Nó e propriedade | Regra |
| :--- | :--- | :--- |
| Cor do texto | `fills` do `TEXT` | medida contra o que está atrás dele, nunca contra um branco presumido |
| O que está atrás | `fills` do ancestral mais próximo que tenha um, ou de uma forma embaixo do nó (`children` vai de trás para frente, então a forma de baixo vem antes) | quem decide o fundo é o empilhamento, não só a árvore de camadas |
| Borda, ícone, contorno de foco | `strokes` e `strokeWeight` do `FRAME` ou da forma, e `fills` das formas de um ícone | medidos contra a cor vizinha |
| Sombra | `effects` | nunca é o único limite nem o único foco, porque some no modo de alto contraste |
| Transparência | `opacity` do nó e de cada ancestral | misture a cor com o que está atrás antes de aplicar a fórmula |
| Token | `boundVariables` mostra qual variável está ligada ao preenchimento | preenchimento sem variável fica com o mesmo valor em todo modo. Meça contra o fundo de cada modo e relate a origem |
| Modo | `resolvedVariableModes` diz qual modo vale para o nó. A Plugin API devolve o valor nesse modo com `variable.resolveForConsumer(node)` | pela REST API só vem o id da variável (o endpoint de variáveis é só do plano Enterprise). Sem o valor, o par fica "não testado", nunca estimado |
| Texto sobre imagem | a camada de contraste (scrim) entre os dois, uma forma ou um frame com `fills` próprio | medida no pior caso da imagem, ver [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-images.md) e [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-media.md) |

## 2. Modos, estados e a matriz de pares

A unidade da evidência é o **par**, ou seja, uma cor que carrega significado e a cor sobre a qual ela fica.

- **Liste os pares** do frame avaliado: texto sobre fundo, borda sobre fundo, ícone sobre fundo, contorno de foco sobre a cor vizinha.
- **Todos os estados** que as variantes têm.
- **Todos os modos que o arquivo usa.** São os modos que aparecem no `resolvedVariableModes` dos frames avaliados e qualquer modo para o qual uma ação `SET_VARIABLE_MODE` troca. O modo que está na tela é só um deles.
- Par cujo valor não se resolve em algum modo entra na lista como "não testado" nesse modo.

## 3. O que medir

Os pares de texto, de parte da interface e de foco da Seção 2 são medidos nos pisos do perfil (Seção 3 do DA11Y.md). O que este guia acrescenta:

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Metadado secundário (badges) ou painel denso, em 10px | `fontSize` e o par | só com 7:1 e entrada no [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/EXCEPTIONS.md) (exceção de densidade da Regra da Casa†). Nunca texto corrido nem dado de tabela |
| Desabilitado | os pares da variante Disabled | medidos e relatados, sem piso, porque componente inativo está isento (SC 1.4.3, SC 1.4.11). A indisponibilidade não é mostrada só pela cor |
| Leitura em escala de cinza | a luminância relativa dos preenchimentos que separam estados, níveis ou séries | a hierarquia continua legível. Preenchimentos que só mudam de matiz se fundem no cinza, e isso entra no relato |
| Cores que precisam ser distinguidas (dois status, duas séries) | o Delta E entre os dois preenchimentos | ΔE > 20 é perceptível para a maioria das pessoas, e ΔE > 40 é seguro para pessoas daltônicas. O guia do A11Y.md não diz qual fórmula de ΔE usar, então a fórmula fica a confirmar. Um segundo canal continua obrigatório |
| Texto fino ou pequeno | o Lc do APCA para texto de peso leve ou `fontSize` pequeno | Lc 60 para corpo de texto é a dica do guia do A11Y.md. É só um complemento e nunca substitui a razão da WCAG |

O resultado de um simulador de protanopia, deuteranopia ou tritanopia nunca é afirmação do agente. No canvas, a escala de cinza e a luminância são os cálculos desta tabela, e uma pessoa pode rodar os simuladores.

## 4. O que vira anotação

Contraste medido não é sugestão (Seção 4 do DA11Y.md). A tabela de pares vai na anotação do relatório no frame avaliado, com par, variáveis e valores resolvidos, estado, modo, razão, piso e resultado. Par que reprova também ganha uma anotação no próprio nó, com `fills` ou `strokes` fixados. Fixe também `strokeWeight` no foco e `opacity` quando ela mudou o resultado. Assim a evidência acompanha o valor.

O que o canvas não mostra entra como sugestão:

- **Qual configuração escolhe cada modo**, que pode ser o tema do sistema, a preferência de contraste do sistema ou uma preferência do produto.
- **Necessidades em conflito.** Quando um modo serve um grupo e prejudica outro (alto contraste e sensibilidade ao brilho), nomeie os dois grupos e leve a escolha à pessoa.

```markdown
Contraste · State=Default · modo Escuro
"Vence hoje": text/secondary sobre surface/raised → N:1 · piso Shield 7:1 · reprova 🟠
Origem: variável text/secondary (biblioteca) · proposta: subir a luminância na fonte · corrijo? aguardando a pessoa
```

## 5. Quando a tarefa cria ou muda a paleta

Criar ou alterar variáveis, modos ou estilos de cor a pedido é a autorização da Seção 2.2 do DA11Y.md. É também o momento em que o contraste se decide, então a paleta é conferida enquanto nasce:

1. **Liste os pares intencionais** que as variáveis vão formar. São texto sobre fundo e parte da interface sobre fundo, com os estados e todos os modos.
2. **Calcule a razão WCAG de cada par** sobre os valores, em cada modo, no momento da definição.
3. **Ajuste a luminância, e não só o matiz,** até todo par passar do piso do perfil. Os pares de desabilitado não têm piso (Seção 3).
4. **Registre a matriz de pares** (par → razão medida, por modo) no [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md), como um item de contraste por par no contrato da Seção 2.2 e como anotação no frame que documenta a paleta. Os valores alimentam a tabela de pares do [`REPORT.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/REPORT.md) §1.

## 6. Antipadrões no canvas

- **Medir só o modo que está na tela** e declarar a paleta inteira.
- **O valor do modo errado**, lido da variável em vez de resolvido para o nó.
- **Corrigir par reprovado mudando só o matiz.**
- **Pontuação do APCA apresentada como conformidade com a WCAG.**

## 7. O que fica para o código

O contraste no produto construído, as preferências de tema e de contraste do sistema e o modo de alto contraste são implementados seguindo o [`guide-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-visual-perception.md) do A11Y.md. O protocolo de verificação desse guia roda no produto construído e entra no relatório como requisito para o desenvolvimento.
