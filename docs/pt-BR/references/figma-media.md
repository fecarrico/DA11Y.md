# Mídia no canvas — vídeo, áudio, vídeo de fundo e parallax

> **Escopo:** vídeo e áudio colocados no layout, o player e os controles dele, o vídeo de fundo de um destaque (hero), texto sobre mídia em movimento, parallax (camadas que andam em velocidades diferentes na rolagem) e outros movimentos que começam sozinhos, descritos em nós do Figma.
> **Traduz:** o [`guide-media.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-media.md) do A11Y.md, fixado no commit `9fb9a02`. A janela de Libras sobre um vídeo fica no [`figma-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-sign-language-br.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Onde a mídia aparece em nós

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Vídeo ou áudio | um nó `MEDIA`, ou uma forma cujo preenchimento é o poster | `MEDIA` é opaco e não aceita anotação, então a evidência vai no `FRAME` que o contém |
| Poster (o frame estático) | uma forma com preenchimento de imagem | é imagem ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-images.md)) e é o que aparece com movimento reduzido ou com a reprodução automática (autoplay) bloqueada. Escolhido com intenção, ele vira a imagem de destaque de verdade |
| Controles do player (tocar/pausar, avanço, volume, legendas) | cada um no próprio `FRAME` ou numa `INSTANCE` de botão | é um alvo com nome e estados próprios ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md)) |
| Camada de contraste (scrim) | um `RECTANGLE` ou `FRAME` com `fills`, entre a mídia e o texto nos `children` (de trás para a frente) | é a superfície contra a qual o contraste do texto é medido (Seção 5) |
| Controle de pausa do vídeo de fundo | uma `INSTANCE` de botão, visível, no fluxo do auto layout do destaque | nunca faz parte da mídia, que o leitor de tela pula |
| Link da transcrição | um `TEXT` com link ao lado do player | ao lado, e não a três cliques de distância |
| Camadas que se movem sozinhas ou com a rolagem | nós com `animations` ou `timelines`, ou alcançados por `AFTER_TIMEOUT` | cada uma tem uma variante de movimento reduzido |

## 2. As três perguntas antes de colocar a mídia

O agente não consegue perceber um arquivo de mídia. O `MEDIA` expõe pouco, e um frame colado não é o vídeo. As três perguntas da Seção 2.1 do DA11Y.md vão para a pessoa **no mesmo turno**, cada uma com o desdobramento dela:

1. **Informação, função ou só clima?** A classe é a resposta da pessoa, e não um palpite do agente.
2. **Tem faixa de áudio?** Se tem, o áudio precisa ser ouvido ou pode ir mudo?
3. **Já existem legendas, transcrição ou audiodescrição?** Se não, quem produz e até quando?

O teste de remoção do [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-images.md) vale sem mudança: *"Se eu tirar esta mídia, o que a pessoa perde?"*

| A pessoa perde | Classe | O que ela deve |
| :--- | :--- | :--- |
| informação | **informativa** | legendas (SC 1.2.2), transcrição, e audiodescrição quando a imagem mostra o que a trilha não diz (SC 1.2.5) |
| uma função (executa uma etapa, confirma uma ação) | **funcional** | um nome para o controle **e** um caminho para o mesmo resultado sem a mídia |
| só o clima | **decorativa** | nenhuma legenda, mas ainda deve pausa (SC 2.2.2), silêncio (SC 1.4.2) e comportamento com movimento reduzido |

- **Decorativa não é sinônimo de fundo.** Um vídeo de destaque mostrando o produto em uso é informativo e está no fundo.
- **Legendas e transcrições feitas por máquina são rascunhos** para revisão humana, e nunca a alternativa entregue.
- **Mídia sem decisão bloqueia a entrega:** funcional sem alternativa 🔴, informativa sem legendas 🟠, áudio que toca sozinho sem controle 🔴.

## 3. O que medir

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto sobre mídia | o `fills` do `TEXT` contra o scrim sobre o frame mais claro | o piso do perfil (Seção 3 do DA11Y.md), medido como na Seção 5 |
| Ícones dos controles sobre o vídeo | o `fills` dos vetores contra a barra ou o scrim atrás deles | 3:1 (SC 1.4.11) |
| Pausa | o frame do destaque | um controle visível quando o loop dura mais de 5 segundos (SC 2.2.2, Nível A, todos os perfis) |
| Movimento | `animations`, `timelines` e reações `AFTER_TIMEOUT` | existe uma variante de movimento reduzido |

## 4. O que vira anotação

O canvas não mostra se a mídia toca sozinha, se tem som ou se tem legenda. O `MEDIA` não aceita anotação, então a anotação vai no `FRAME` que contém a mídia.

**Na anotação do `FRAME`**, no formato curto da Seção 5 do DA11Y.md:

- **Classe**, com as respostas da pessoa às três perguntas.
- **Controle de pausa do vídeo de fundo:** um nome para cada estado ("Pausar vídeo de fundo", "Reproduzir vídeo de fundo"). O vídeo decorativo fica fora da anotação.
- **Player:** o nome e o estado de cada controle.
- **Player de terceiros embutido:** ele tem um título que diz o que contém.

**No relatório**, como requisito para o desenvolvimento:

- **Áudio:** vai mudo, ou como a pessoa para o som. Áudio que toca sozinho por mais de 3 segundos tem controle próprio (SC 1.4.2).
- **Autoplay e loop**, e o aviso de que com movimento reduzido nada toca e o poster fica.
- **Legendas** com os sons que importam ("[porta bate]", troca de quem fala), quem revisa e onde fica a transcrição.
- **Vídeo de fundo decorativo:** escondido do leitor de tela e do `Tab`. Ele entra no relatório como não lido.
- **Player de terceiros embutido:** embutir não transfere a obrigação. As legendas são conferidas no vídeo hospedado.

No scrim, fixe `fills` e `opacity`. No texto, fixe `fills` e `fontSize`. Em cada controle, fixe `minWidth` e `minHeight`.

```markdown
1 · controle do vídeo de fundo
🔊 botão "Pausar vídeo de fundo" / "Reproduzir vídeo de fundo", fora do vídeo
```

## 5. Vídeo de fundo, texto sobre mídia e parallax

**Vídeo de fundo.** Um loop decorativo e mudo ainda deve três coisas: silêncio, um controle de pausa visível e nada de autoplay com movimento reduzido. Os dois nomes do controle são duas variantes dele. "É só um fundo" não é isenção no texto do SC 2.2.2.

**Texto sobre mídia.** O contraste sobre vídeo muda a cada frame, e todo verificador automático aprova.

- Meça contra o **pior caso composto**, que é o frame mais claro visto através do scrim.
- Se não dá para ler os frames, a razão não está medida, e o relatório diz isso. Uma faixa opaca atrás do texto se mede só pelo `fills` dela e continua valendo quando o vídeo muda. Proponha essa faixa, e mude o scrim só com autorização.
- Um gradiente ajustado ao corte atual quebra no próximo vídeo. Uma sombra no `effects` do texto muda a aparência, mas não muda a razão.
- Registre o valor de scrim aceito no [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/A11Y-DECISIONS.md), porque o próximo destaque vai precisar dele.

**Parallax.** Movimento puxado pela rolagem pode causar enjoo e tontura em quem tem distúrbio vestibular, que afeta o equilíbrio. O controle de pausa não cobre esse caso, porque a pessoa nunca pediu esse movimento. A composição estática, com as camadas paradas e a seção legível, é uma variante desenhada e é a padrão. O movimento entra por cima dela. Texto que rola sozinho por mais de 5 segundos precisa de um controle para parar. Como o arquivo representa o movimento ligado à rolagem está a confirmar, porque o [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md) lista só `animations`, `timelines` e `animationStyles`.

## 6. Quando a tarefa cria ou muda o player no design system

- **Descrição:** "Player de vídeo. Use para vídeo com som ou com informação. Ele traz os controles, as legendas e o link da transcrição. Apelidos: vídeo, media player, player."
- **Propriedades:** `State` (VARIANT) em cada controle (Default, Hover, Focus, Disabled), tocar e pausar como variantes de um só controle, `Captions` (BOOLEAN), `Transcript link` (TEXT).

## 7. Antipadrões no canvas

- **Classificar a mídia como decorativa por conta própria**, ou porque ela está no fundo.
- **Legenda de máquina tratada como entregue.**
- **Loop de fundo sem controle de pausa visível**, ou com o controle dentro do vídeo.
- **Texto sobre vídeo sem scrim medido:** "o vídeo é escuro o suficiente", gradiente ajustado a um corte, sombra no texto como única correção.
- **Movimento sem variante de movimento reduzido**, inclusive parallax sem composição estática.

## 8. O que fica para o código

Semântica, teclado e leitor de tela são implementados seguindo o [`guide-media.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-media.md) do A11Y.md. Os cenários de verificação desse guia rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
