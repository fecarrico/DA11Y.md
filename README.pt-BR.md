> **Agente de IA lendo este repositório:** o núcleo normativo é [`docs/pt-BR/DA11Y.md`](docs/pt-BR/DA11Y.md) · [`docs/en/DA11Y.md`](docs/en/DA11Y.md). Leia primeiro, depois [`docs/pt-BR/references/figma-nodes.md`](docs/pt-BR/references/figma-nodes.md). Carregue um guia de componente só quando a linha dele na Seção 7 corresponder ao que você está desenhando ou avaliando. Desenhando ou avaliando, a tarefa só termina com a evidência gravada no arquivo, as anotações e as páginas de relatório e de handoff, como a Seção 5 descreve. O índice é o [`llms.txt`](llms.txt).

🇺🇸 Read in English: [README.md](README.md)

<div align="center">
  <img src="./da11ymd.png" alt="Logotipo dally.md entre dois elefantes de Dalí, numa paisagem desenhada em caracteres ASCII." width="100%" />
</div>

# DA11Y.md

*Acessibilidade antes do primeiro pixel*

**A edição de design do [A11Y.md](https://github.com/fecarrico/A11Y.md).** Ela leva as mesmas regras de acessibilidade para quem desenha interfaces em software de design, sejam pessoas ou agentes de IA.

> **Status: 0.1.0, em teste.** Nasceu de um piloto com o agente do Figma em outubro de 2026. Leia [O que já sabemos](#o-que-já-sabemos) antes de confiar nele.

## Por que existe

O A11Y.md faz o agente de código construir interfaces acessíveis. Só que muitas decisões de acessibilidade são tomadas antes de o código existir, no arquivo de design: contraste, tamanho da área de toque, estados de foco, mensagens de erro, ordem de leitura. Quando o desenho ignora essas decisões, o dev corrige no código, e o produto acaba diferente do que foi desenhado. O DA11Y.md leva essas regras para o momento em que a tela é desenhada, e assim design e código respondem aos mesmos números.

## A relação com o A11Y.md

- **Os mesmos números.** Os perfis de conformidade, os limites e o modelo de severidade são compilados de uma cópia fixada do A11Y.md. Um script confere que eles nunca se afastam, em inglês e em português.
- **Funções próprias.** Tudo o que é específico do canvas mora aqui: como ler um arquivo do Figma, como avaliar o que um design system já decidiu e onde fica a evidência.
- **O link vai de um lado só.** O DA11Y.md aponta para o A11Y.md. O núcleo do A11Y.md não aponta de volta, e assim quem desenvolve não gasta contexto com ele.
- **O código continua com o A11Y.md.** O relatório de design termina com a instrução de implementar seguindo o A11Y.md.

## O nome e o logotipo

DA11Y.md é a soma do D de design com o A11Y de acessibilidade. O nome pode ser lido como "dally", que soa como o nome do pintor Salvador Dalí. A referência à arte é de propósito, porque aproxima o projeto do design e da criatividade, que é o meio de quem vai usá-lo.

O "a" do logotipo carrega o relógio derretido do quadro *A Persistência da Memória*. A escolha mostra a pretensão do projeto, que é ser um contexto persistente na memória do agente. O agente deve usar o protocolo sempre que desenha uma interface.

Para caber nessa memória, o protocolo segue boas práticas de engenharia de prompt e carrega cada guia só quando a tarefa pede, o que poupa tokens. Mas o foco não é economia, é acessibilidade.

## O que ele pede ao agente

1. **O que já existe vem primeiro.** O agente procura os componentes, as variáveis e os estilos da biblioteca, e as regras já registradas, como um `DESIGN.md`. Ele aplica tudo como está e depois avalia o resultado. Ele avisa cada decisão prévia que afeta a acessibilidade, com a origem e a medida. E só corrige com autorização expressa.
2. **Calcular, nunca estimar.** O contraste é calculado a partir dos valores dos tokens, em todo estado e em todo modo. No agente do Figma, a conta sai do `tools/measure.js`, que ele lê por link e executa.
3. **A evidência fica no arquivo.** Cada frame avaliado recebe uma anotação nativa do Figma, curta, com o status e as contagens, na categoria Accessibility. O relatório completo é desenhado numa página do próprio arquivo, `DA11Y — relatórios`, com as telas avaliadas e cada achado numerado nelas, e a anotação do frame leva o link para ele. O agente repete o relatório no chat, para a pessoa salvar como `REPORT.md` e entregar a quem desenvolve. O chat sozinho não basta, porque não chega a quem constrói o produto.
4. **O canvas guarda só o que você corrige, em poucas palavras.** Fora a anotação do frame, o canvas recebe um `Corrigir aqui` para cada defeito que você corrige neste arquivo, com o número do achado. Os erros do design system e as perguntas de estrutura ficam numerados na página de relatório, ao lado da tela, para o canvas não se encher de anotações. Um erro cabe numa linha, com a gravidade em cor e em texto, como `🔴 CRITICAL · Biblioteca: sem estado Focus` ou `🟠 HIGH · Aqui: seta branca sobre branco`. Medidas, ressalvas e o que é só do código ficam no relatório. Quando você decide, acrescenta ao card uma linha com `✓` e o seu nome, e a rodada seguinte guarda essa linha.
5. **O handoff de acessibilidade é uma página.** Quando você pede o handoff, ou quando o agente entrega uma tela desenhada, ele desenha a página `DA11Y — handoff`. A ordem de leitura vem em cards numerados ao lado de uma cópia da tela, uma parada por linha, com o papel num vocabulário fechado. As áreas de toque vêm medidas contra o perfil, e cada controle aparece ao lado da variante de foco dele na biblioteca. O que não é lido não é desenhado e vai para o relatório. Numa avaliação não há handoff, e a leitura fica no relatório como rascunho.
6. **Construir um design system inclui contexto para agentes.** Quando a tarefa é criar componentes, o agente também escreve o que o próximo agente precisa ler: a descrição, os apelidos, o contrato de acessibilidade como dado e a anatomia na ordem de leitura.

## Para começar

**O jeito mais rápido é a skill publicada na Comunidade do Figma.** Abra a [página da skill `da11y`](https://www.figma.com/community/skill/136973/da11y), salve na sua conta e peça ao agente, por exemplo, `/da11y analise esta tela` ou `/da11y prepare o handoff de acessibilidade desta tela`. A skill só carrega a regra do passo 1 abaixo, e o protocolo continua um só, aqui no GitHub.

O DA11Y.md é Markdown portátil, e o agente do Figma lê o protocolo por link, do mesmo jeito que o agente de código lê o A11Y.md.

1. No pedido ao agente do Figma, ou nas regras do ambiente quando a ferramenta tiver esse campo, inclua esta regra:

   ```
   Ao desenhar ou avaliar jornadas, telas ou componentes, siga estritamente as regras de acessibilidade do arquivo https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/DA11Y.md
   ```

2. O agente abre o núcleo e, a partir dele, o `figma-nodes.md`. Os 27 guias de componente ele só abre quando a linha do guia na Seção 7 corresponde ao que está desenhando, do mesmo jeito que o A11Y.md carrega os guias dele.
3. Peça ao agente para desenhar ou revisar como sempre. Ele aplica a biblioteca primeiro e deixa no arquivo o que encontrou.
4. Quando ele apontar um par de contraste reprovado, confira o mesmo par na checagem de contraste do próprio Figma, no seletor de cor. Não use o botão de correção automática, porque ele troca a cor que veio da biblioteca.

**Para criar a skill à mão**, em **Add context › Skills › Manage skills**, crie uma skill com o nome `da11y`, a regra do passo 1 nas instruções e esta descrição, que é o que faz a skill disparar sem você digitar `/`:

```
Obrigatória para desenhar, editar, analisar ou revisar a acessibilidade de telas, fluxos ou componentes no Figma. Aplica o protocolo DA11Y.md, lido do GitHub, mede contraste, alvos e texto com código, e só termina com a evidência gravada no arquivo: as anotações e as páginas de relatório e de handoff.
```

A skill é só a regra. O protocolo continua um só, no GitHub, e ela não precisa mudar quando o protocolo muda. Num teste de 16/10/2026, a skill disparou sem `/`, mas não avisou que disparou.

**Outra opção, ainda não testada, são as guidelines da biblioteca.** Se você quer que a regra entre sozinha quando alguém pede ao agente um desenho com a sua biblioteca, baixe o [`guidelines/acessibilidade-da11y.md`](guidelines/acessibilidade-da11y.md) e envie como guideline da biblioteca, em **Library › Manage guidelines**. O arquivo traz só a regra do passo 1. As guidelines só aceitam arquivo enviado, não link ([Central de Ajuda do Figma](https://help.figma.com/hc/en-us/articles/43509372175511)), então o arquivo leva a regra, e a regra leva ao núcleo, que continua um só e sempre atualizado. O recurso está em beta e exige plano Professional, Organization ou Enterprise. Para avaliar uma tela pronta, ponha a regra no pedido, porque a Central de Ajuda só garante as guidelines quando o pedido é para criar um desenho com a biblioteca.

## O que já sabemos

- **Um piloto, uma tarefa.** O agente do Figma desenhou um login de banco sobre uma biblioteca corporativa real, uma vez sem e outra com o A11Y.md. Com o A11Y.md, ele subiu o contraste da borda do campo, desenhou o estado de foco e escreveu um relatório completo para o dev. Também trocou as cores da marca e a borda do campo sem dizer por quê. Essa falha deu origem à Seção 2.
- **O carregamento sob demanda funcionou dentro do Figma.** No piloto, o agente buscou por link o núcleo do A11Y.md, oito guias e dois templates. Foram exatamente as linhas que o mapa pede para um login mobile.
- **Um segundo teste, num fluxo de cadastro.** O agente avaliou sete frames sobre uma biblioteca corporativa real. Ele escreveu anotações nativas na categoria Accessibility e apontou os defeitos da biblioteca sem trocar nada. As anotações saíram longas demais, com o relatório inteiro e os mesmos achados repetidos em cada tela, e isso deu origem ao formato curto da anotação.
- **Um terceiro teste, numa tela de app, com a skill.** O agente do Figma executou o `measure.js` lido por link, depois de descobrirmos que, no código dele, a seleção vem vazia e os nós se buscam pelo id. Ele gravou 28 anotações, e 19 repetiam o mesmo texto com outro nome dentro: o card, o ícone e a seta de cada card em anotações separadas, com medidas e ressalvas em todas. Isso deu origem à anotação por elemento, com a ordem de leitura e no máximo duas linhas por erro.
- **Um quarto teste, numa tela de app, com a skill publicada.** O agente avaliou uma tela de detalhe de um app. A análise foi boa: cinco achados reais, contraste e origem certos, camadas ocultas de fora, nenhum falso positivo de contraste. A leitura acertou na maior parte, e a parte inventada parecia autoritativa: dois anexos viraram botões chamados "Abrir …" sem nenhum controle desenhado, o texto alternativo do mapa repetia o endereço da parada seguinte, e o frame dizia "Decisões suas — 14" quando quatro eram decisões e o resto era leitura a confirmar. Stark, axe for Designers, o toolkit de design da BrowserStack e o Annotation Toolkit do GitHub mantêm a checagem e a anotação de handoff como dois modos, e a IA deles só sugere até a pessoa aceitar; o protocolo dava a veredito e proposta o mesmo peso. Isso deu origem aos dois modos: a avaliação deixa no canvas os erros e as perguntas de estrutura, e a leitura é anotada quando alguém pede, com um vocabulário fechado de papéis e o relatório numa página do arquivo.
- **As páginas de relatório e de handoff, testadas fora do agente.** Em rodadas por um plugin, em telas reais de app sobre uma biblioteca real, as anotações, mesmo curtas, cobriam a tela quando eram muitas, e os cards numerados ao lado de uma cópia da tela já diziam o que é lido. Isso deu origem às páginas. O canvas guarda só o que se corrige no arquivo, e um script desenha o relatório e o handoff do mesmo jeito sempre, no design system da tela. O conteúdo é decisão do agente. Esses scripts ainda não rodaram dentro do próprio agente do Figma.

## Estrutura do repositório

| Caminho | O que guarda |
| :--- | :--- |
| `docs/en/`, `docs/pt-BR/` | as duas edições e seus guias de referência |
| `upstream/` | as cópias fixadas do A11Y.md, com a procedência: o núcleo de onde os blocos compartilhados são compilados e os guias que este projeto traduz, que dão lastro aos números dos guias daqui |
| `docs/<lang>/templates/REPORT.md` | o relatório de acessibilidade do design, que sai do arquivo junto com o desenho e chega a quem desenvolve |
| `guidelines/` | a guideline pronta para enviar à biblioteca do Figma, em português e em inglês, com a regra de ativação |
| `tools/measure.js` | lê telas do Figma pela Plugin API, pelos ids, e devolve pares de contraste, alvos, espaçamentos e crescimento do texto como dado. O agente do Figma lê por link e executa |
| `tools/annotate.js` | numera os achados e grava as anotações no formato curto. No canvas, são a do frame, tirada das contagens, e as de `Corrigir aqui`. Relê para conferir, preserva as anotações das pessoas e recusa a que foge do formato. O agente do Figma lê por link e executa |
| `tools/report.js`, `tools/handoff.js` | desenham a página de relatório e a de handoff no arquivo, no design system da tela, e guardam os cards que uma pessoa decidiu. O agente do Figma lê por link e executa |
| `tools/src/`, `tools/build.py`, `tools/tests/` | a fonte de onde os dois scripts de desenho são montados, e os testes, que rodam num documento do Figma em memória |
| `tools/compile.py` | recompila os blocos compartilhados e confere números, guias e paridade entre as línguas |

## Como contribuir

Veja o [CONTRIBUTING.md](CONTRIBUTING.md). A contribuição mais útil é um relato de campo: você usou o DA11Y.md num desenho real e algo aconteceu.

---

**Autor:** Felipe A. Carriço · [LinkedIn](https://linkedin.com/in/fecarrico) · [A11Y.md](https://github.com/fecarrico/A11Y.md)
