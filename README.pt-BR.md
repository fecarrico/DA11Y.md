> **Agente de IA lendo este repositório:** o núcleo normativo é [`docs/pt-BR/DA11Y.md`](docs/pt-BR/DA11Y.md) · [`docs/en/DA11Y.md`](docs/en/DA11Y.md). Leia primeiro, depois [`docs/pt-BR/references/figma-nodes.md`](docs/pt-BR/references/figma-nodes.md). Carregue um guia do A11Y.md só quando a linha dele na Seção 7 corresponder ao que você está desenhando. O índice é o [`llms.txt`](llms.txt).

🇺🇸 Read in English: [README.md](README.md)

# DA11Y.md

*Acessibilidade antes do primeiro pixel*

**A edição de design do [A11Y.md](https://github.com/fecarrico/A11Y.md).** Ela leva as mesmas regras de acessibilidade para quem desenha interfaces em software de design, sejam pessoas ou agentes de IA.

> **Status: rascunho 0.1.0, privado, em teste.** Nasceu de um piloto com o agente do Figma em outubro de 2026. Leia [O que já sabemos](#o-que-já-sabemos) antes de confiar nele.

## Por que existe

O A11Y.md faz o agente de código construir interfaces acessíveis. Só que muitas decisões de acessibilidade são tomadas antes de o código existir, no arquivo de design: contraste, tamanho da área de toque, estados de foco, mensagens de erro, ordem de leitura. Quando o desenho ignora essas decisões, o dev corrige no código, e o produto acaba diferente do que foi desenhado. O DA11Y.md leva essas regras para o momento em que a tela é desenhada, e assim design e código respondem aos mesmos números.

## A relação com o A11Y.md

- **Os mesmos números.** Os perfis de conformidade, os limites e o modelo de severidade são compilados de uma cópia fixada do A11Y.md. Um script confere que eles nunca se afastam, em inglês e em português.
- **Funções próprias.** Tudo o que é específico do canvas mora aqui: como ler um arquivo do Figma, como avaliar o que um design system já decidiu e onde fica a evidência.
- **O link vai de um lado só.** O DA11Y.md aponta para o A11Y.md. O núcleo do A11Y.md não aponta de volta, e assim quem desenvolve não gasta contexto com ele.
- **O código continua com o A11Y.md.** O relatório de design termina com a instrução de implementar seguindo o A11Y.md.

## O que ele pede ao agente

1. **O que já existe vem primeiro.** O agente procura os componentes, as variáveis e os estilos da biblioteca, e as regras já registradas, como um `DESIGN.md`. Ele aplica tudo como está e depois avalia o resultado. Ele avisa cada decisão prévia que afeta a acessibilidade, com a origem e a medida. E só corrige com autorização expressa.
2. **Calcular, nunca estimar.** O contraste é calculado a partir dos valores dos tokens, em todo estado e em todo modo.
3. **A evidência fica no arquivo.** Cada relatório vira uma anotação nativa do Figma, na categoria Accessibility. O chat não conta como evidência, porque não chega a quem constrói o produto.
4. **O agente sugere e a pessoa confirma.** Ordem de leitura, títulos, nomes acessíveis e textos alternativos entram como anotações marcadas "Sugestão do agente — confirmar". Quem desenvolve implementa o que foi confirmado.
5. **Construir um design system inclui contexto para agentes.** Quando a tarefa é criar componentes, o agente também escreve o que o próximo agente precisa ler: a descrição, os apelidos, o contrato de acessibilidade como dado e a anatomia na ordem de leitura.

## Para começar

O DA11Y.md é Markdown portátil. Com o agente do Figma:

1. Anexe `docs/pt-BR/DA11Y.md` e `docs/pt-BR/references/figma-nodes.md` à sua biblioteca de design como **guidelines da biblioteca**. O agente lê esses arquivos sempre que um pedido usa a biblioteca. As guidelines estão em beta e exigem plano Professional, Organization ou Enterprise.
2. Peça ao agente para desenhar ou revisar como sempre. Ele aplica a biblioteca primeiro e anota o que encontrou.

Enquanto este repositório for privado, os agentes não conseguem ler as URLs diretas. Use os arquivos.

## O que já sabemos

- **Um piloto, uma tarefa.** O agente do Figma desenhou um login de banco sobre uma biblioteca corporativa real, uma vez sem e outra com o A11Y.md. Com o A11Y.md, ele subiu o contraste da borda do campo, desenhou o estado de foco e escreveu um relatório completo para o dev. Também trocou as cores da marca e a borda do campo sem dizer por quê. Essa falha deu origem à Seção 2.
- **O carregamento sob demanda funcionou dentro do Figma.** No piloto, o agente buscou por link o núcleo do A11Y.md, oito guias e dois templates. Foram exatamente as linhas que o mapa pede para um login mobile.
- **Ainda não testado.** Se o agente do Figma consegue escrever anotações nativas e se o fluxo "avisar antes de corrigir" se sustenta. A rodada 2 do piloto testa os dois.

## Estrutura do repositório

| Caminho | O que guarda |
| :--- | :--- |
| `docs/en/`, `docs/pt-BR/` | as duas edições e seus guias de referência |
| `upstream/` | as cópias fixadas do A11Y.md de onde os blocos compartilhados são compilados, com a procedência |
| `tools/compile.py` | recompila os blocos compartilhados e confere números, guias e paridade entre as línguas |

## Como contribuir

Veja o [CONTRIBUTING.md](CONTRIBUTING.md). A contribuição mais útil é um relato de campo: você usou o DA11Y.md num desenho real e algo aconteceu.

---

**Autor:** Felipe A. Carriço · [LinkedIn](https://linkedin.com/in/fecarrico) · [A11Y.md](https://github.com/fecarrico/A11Y.md)
