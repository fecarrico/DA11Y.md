# Chat e resposta gerada no canvas — conversa, mensagem, geração em andamento e compositor

> **Escopo:** a tela de chat e as partes dela em nós do Figma. Isso inclui a conversa, cada mensagem e quem fala, a resposta enquanto é gerada, interrompida ou com erro, as ações de cada mensagem, o compositor (o campo onde a pessoa escreve) e a interface que um modelo monta em tempo de execução.
> **Traduz:** o [`guide-generative-ui.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-generative-ui.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Conversa | `FRAME` com auto layout vertical, com as mensagens na ordem em que foram enviadas | a ordem do auto layout é a ordem de leitura. Mensagem tirada do fluxo com `layoutPositioning: ABSOLUTE` é lida fora do lugar |
| Mensagem | `INSTANCE` de um componente de mensagem, nunca um `GROUP` | uma por turno, com caixa para medir e lugar para a evidência |
| Quem fala | `TEXT` com "Você" ou "Assistente" | quem fala é dito em texto. Cor do avatar, alinhamento e formato do balão não dizem nada ao leitor de tela e ficam ambíguos no modo de alto contraste. Se o desenho esconde o texto, a anotação traz esse texto |
| Horário | `TEXT` | horário relativo ("há 2 minutos") precisa da data e da hora completas na anotação |
| Conteúdo da resposta | `TEXT` com estilo de título para os títulos e listas declaradas como lista (`getRangeListOptions`) | Seção 5 |
| Bloco de código | `FRAME` com um `TEXT` que diz a linguagem e um botão Copiar | a linguagem aparece em texto |
| Ações de cada mensagem (Copiar, Tentar de novo, avaliação) | `INSTANCE` de botão, cada uma num `FRAME` próprio | cada uma é um alvo com caixa própria e nome distinto (Seção 4) |
| Parar geração | `INSTANCE` de botão, visível enquanto a resposta é gerada | o mesmo controle para todo mundo |
| Ir para a última resposta | `INSTANCE` de botão | o caminho explícito até a resposta mais nova. Nada mais leva o foco até ela |
| Compositor | o campo de texto da biblioteca ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md)) e o botão Enviar | rótulo visível e nenhum limite de tempo |
| O que o assistente é | `TEXT` na interface | diz que do outro lado está um assistente |

## 2. Estados que o componente precisa ter

- **Compositor.** Default, Focus, Streaming e, quando o produto usa, Disabled com o motivo em texto. O estado Streaming é o da resposta sendo gerada. Nele aparece um Parar geração visível, com alvo próprio, porque resposta que não pode ser interrompida é conteúdo em movimento do qual a pessoa não consegue sair (SC 2.2.2).
- **Resposta.** Streaming, Complete, Stopped e Error.
- **Stopped ao lado de Complete.** Copiar, Tentar de novo e as citações aparecem nos dois, porque nada pode depender de a geração ter terminado.
- **Erro.** Um texto que diz o caminho de saída, porque uma geração que só para não deixa sinal nenhum.

Estado que falta na biblioteca é aviso da Seção 2. Aponte e desenhe só com autorização.

## 3. O que medir

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto da mensagem | o `fills` do `TEXT` contra o `fills` do balão, e não da página, em cada modo | o piso de texto do perfil (Seção 3 do DA11Y.md) |
| Limite de tempo | reações `AFTER_TIMEOUT` no compositor ou na tela do chat | nenhuma no compositor. Sessão que expira no meio do raciocínio falha no SC 2.2.1 |
| Estrutura da resposta | os estilos de texto e as opções de lista do `TEXT` da resposta | título usa estilo de título, e não texto comum em negrito. Lista é declarada, e não digitada com "•" |

## 4. O que vira anotação

Cada item é uma anotação no frame da conversa ou no nó (Seção 4 do DA11Y.md):

- **Conversa.** Mensagens novas são anunciadas uma vez, as que já estão lá nunca são lidas de novo, e nenhuma mensagem interrompe a pessoa.
- **Geração em andamento.** O texto não é anunciado enquanto cresce. Os anúncios têm texto exato: "Gerando resposta" quando começa e "Resposta pronta, 240 palavras" quando termina (SC 4.1.3).
- **Foco.** O foco fica no compositor quando uma resposta começa. "Ir para a última resposta" leva o foco até a resposta mais nova (SC 2.4.3).
- **Quem fala.** O prefixo lido antes de cada mensagem ("Você:", "Assistente:") quando ele não está visível, e um título por turno, com o nível dele.
- **Horário.** A data e a hora completas por trás do horário relativo.
- **Nomes das ações de cada mensagem.** São distintos e contêm o texto visível, como "Copiar resposta 3" num botão escrito "Copiar" (SC 2.5.3). O botão Copiar de um bloco de código também ganha nome único.
- **Erro.** O texto exato, anunciado quando aparece.

Fixe `minWidth` e `minHeight` em cada ação, e `fills` e `fontSize` no texto da mensagem.

```markdown
3 · conversa
📢 "Gerando resposta" → "Resposta pronta, 240 palavras" · cada mensagem nova, uma vez
🔊 botões "Copiar resposta 3", "Tentar de novo a resposta 3"
```

## 5. Conteúdo gerado e interface montada em tempo de execução

- **O que o modelo renderiza é estrutura.** O exemplo de resposta desenhado no canvas mostra títulos no nível certo da página, listas declaradas, tabelas com cabeçalho ([`figma-tables.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-tables.md)) e blocos de código com a linguagem em texto (SC 1.3.1). Negrito no lugar de título ensina o código a renderizar negrito.
- **Imagens e gráficos que o modelo gera** têm a mesma obrigação de qualquer imagem. O agente classifica e rascunha o texto alternativo, e a pessoa confirma (SC 1.1.1). Ver [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-images.md) e [`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-charts.md).
- **Interface montada em tempo de execução** usa só componentes da biblioteca. Assim a acessibilidade fica na biblioteca, verificada uma vez, e não em cada geração. Desenho de interface gerada feito com formas avulsas é aviso.
- **O que o gerador não consegue garantir** (o texto alternativo de uma imagem, a legenda de uma mídia, os dados de um gráfico) é anotado como pedido à pessoa que acompanha o processo.
- **O texto do próprio produto** (rótulos, estados vazios, mensagens de erro) usa linguagem simples, e o assistente nunca pede de novo o que já foi informado (SC 3.3.7). Ver [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-cognitive.md).

## 6. Quando a tarefa cria ou muda os componentes de chat no design system

- **Descrição:** "Mensagem de chat. Use para um turno de uma conversa entre uma pessoa e um assistente. Não use para avisos do sistema (use Toast). Apelidos: balão de chat, mensagem, turno, resposta do assistente, chat bubble."
- **Propriedades:** `State` (VARIANT, com Streaming, Complete, Stopped e Error), `Speaker` e `Time` (TEXT). No compositor, `State` (VARIANT, com Default, Focus, Streaming e Disabled).

## 7. Antipadrões no canvas

- **Quem fala mostrado só** pela cor do avatar, pelo alinhamento ou pelo formato do balão.
- **Estado Streaming sem Parar geração.**
- **Copiar e Tentar de novo só na resposta completa.**
- **Vinte botões "Copiar" iguais**, sem nome distinto na anotação.
- **Pseudotítulos** em texto comum com negrito, e marcadores de lista digitados como caracteres.
- **Erro que é só a geração parando**, sem mensagem.
- **Cronômetro no compositor.**
- **Foco anotado como pulando para a resposta nova.**

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-generative-ui.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-generative-ui.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
