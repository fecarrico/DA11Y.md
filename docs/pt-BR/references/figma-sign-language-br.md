# Língua de sinais no canvas — Libras, tradutores automáticos e a janela de intérprete

> **Escopo:** telas para público brasileiro ou para qualquer população que usa língua de sinais. Cobre o texto que os tradutores automáticos de Libras alcançam, o texto que sobrevive à tradução, a janela de intérprete de Libras sobre um vídeo e o ponto em que o avatar deixa de bastar, descritos em nós do Figma.
> **Traduz:** o [`guide-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-sign-language-br.md) do A11Y.md, fixado no commit `9fb9a02`. A linguagem simples do microcopy fica no [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-cognitive.md). O vídeo em si fica no [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-media.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

Para a maioria das pessoas que usam língua de sinais, a Libras é a primeira língua e o português escrito é a **segunda**. Os tradutores automáticos (widgets com avatar) são uma ajuda de melhor esforço, sem garantia. Eles leem o texto da página quando a pessoa clica ou seleciona, e traduzem o que o código expõe, na qualidade que o texto oferece. O desenho decide as duas metades: o texto que vira texto de verdade e o texto que sobrevive à tradução.

## 1. Onde aparece em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Texto | `TEXT` | toda palavra que a pessoa lê é um nó `TEXT`. Palavra dentro de um preenchimento de imagem, ou desenhada com formas `VECTOR`, não chega a nenhum tradutor |
| Parágrafo | um nó `TEXT` por parágrafo | nunca um paredão de texto num nó só, porque o tradutor corta o que passa do limite dele |
| Frase com estilos misturados | um nó `TEXT` com trechos de estilo (`getStyledTextSegments`) | nunca uma frase quebrada em vários nós `TEXT` por causa do estilo, nem um nó por linha. A captura é por elemento, e pedaços de frase são traduzidos sem contexto |
| Imagem informativa | a forma, com a anotação dela ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-images.md)) | para pelo menos um tradutor, o texto alternativo é o conteúdo traduzível (SC 1.1.1) |
| Janela de Libras | um `FRAME` dentro do frame do vídeo | Seção 5 |

## 2. Texto que sobrevive à tradução

- **Linguagem simples** ([`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-cognitive.md)) serve a quem lê na segunda língua e melhora de forma mensurável a tradução automática.
- **Siglas por extenso na primeira vez** que aparecem no texto visível (SC 3.1.4). Palavra que não está no dicionário de sinais é soletrada letra a letra (datilologia), e essa é a frustração que quem usa Libras mais relata com avatares.
- **Blocos curtos:** um parágrafo por nó, abaixo de algo entre 500 e 1000 caracteres.

## 3. O que medir

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto é texto | os nós que mostram palavras: `TEXT`, preenchimentos de imagem, formas `VECTOR` | toda palavra está num nó `TEXT` |
| Tamanho do bloco | o texto de cada nó `TEXT` | um parágrafo, abaixo de algo entre 500 e 1000 caracteres |
| Frase quebrada | nós `TEXT` vizinhos no mesmo auto layout | nenhuma frase continua de um nó para o outro |
| Siglas | a primeira vez que cada sigla aparece na ordem de leitura | por extenso no texto visível |
| Posição da janela de Libras | `absoluteBoundingBox` da janela e dos nós em volta dela | ela não cobre conteúdo visual essencial. O que o próprio vídeo mostra não se lê no canvas, então pergunte |

## 4. O que vira anotação

Cada item é uma anotação no nó que ele nomeia:

- **Idioma** da tela, no frame da tela, e de cada trecho em outro idioma, no `TEXT` dele (SC 3.1.1, 3.1.2). Os tradutores assumem o idioma da página.
- **Sigla**, no `TEXT`: o nome por extenso, e o aviso de que o código marca a sigla como abreviação.
- **Janela de Libras**, no frame de cada vídeo pré-gravado com áudio: ela existe, quem produz e até quando.
- **Conteúdo crítico** (saúde, jurídico, financeiro, avaliações): vídeo com intérprete humano. Quem decide se o conteúdo é crítico é a pessoa.
- **Widget de tradução:** é uma ajuda de melhor esforço, e a página de acessibilidade declara isso.

No frame da janela de Libras, fixe `width` e `height`.

```markdown
2 · vídeo "Como se inscrever"
❓ janela de Libras: existe? Quem produz, até quando?
```

## 5. A janela de Libras, e onde o avatar para

- **Vídeo pré-gravado com áudio deveria oferecer janela de interpretação em Libras.** É o SC 1.2.6 (AAA), a recomendação 5.14.6 da ABNT NBR 17225 e uma exigência dura que se repete em compras públicas no Brasil. No Shield, o SC 1.2.6 vale, e deixar a janela de fora vira uma entrada no [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/EXCEPTIONS.md) (Seção 0.1 do DA11Y.md). No Standard, a janela é recomendação.
- **Legenda não substitui a janela**, porque a legenda é em português, a segunda língua.
- **A janela segue as convenções de TV (NBR 15290):** intérprete visível da cintura para cima, contraste com o fundo e nada de cobrir conteúdo visual essencial.
- **O avatar não reproduz a gramática facial da Libras.** Negação, pergunta e intensidade são feitas com o rosto na língua, e a comunidade de intérpretes rejeita formalmente o avatar como substituto. Em conteúdo crítico, o widget é complemento, e nunca a resposta.
- **O widget nunca é o que torna o site "acessível em Libras".** Um ícone ou uma barra oferecidos como essa resposta são o antipadrão do "modo acessível" da Seção 6 do DA11Y.md.

## 6. Quando a tarefa cria ou muda o player no design system

- **Descrição** do player diz quando a janela fica ligada (vídeo pré-gravado com áudio) e que a legenda não a substitui. Apelidos: "janela de Libras", "janela de língua de sinais", "janela de intérprete".
- **Propriedades:** `Libras window` (BOOLEAN), para que cada vídeo ligue a janela por uma propriedade.

## 7. Antipadrões no canvas

- **Texto dentro de imagem ou desenhado com vetores.**
- **Frase quebrada em vários nós `TEXT`**, ou um nó por linha.
- **Paredão de texto num nó só.**
- **Sigla que nunca aparece por extenso.**
- **Legenda oferecida no lugar da janela de Libras.**
- **Widget de tradução como a resposta em Libras**, ou avatar como único caminho para conteúdo crítico.
- **Janela de Libras cobrindo conteúdo essencial.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-sign-language-br.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
