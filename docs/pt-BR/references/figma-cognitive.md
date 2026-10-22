# Acessibilidade cognitiva no canvas — fluxos, limites de tempo, microcopy, ajuda consistente e necessidades conflitantes

> **Escopo:** o que um fluxo pede da memória, da atenção, do tempo e da linguagem, em nós do Figma. Isso inclui as telas de um fluxo e o protótipo entre elas, a ajuda, os limites de tempo, o texto que precisa sobreviver ao espaçamento escolhido pela pessoa, o texto da interface e os conflitos entre duas necessidades de acesso. Login e autenticação estão na Seção 5 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md).
> **Traduz:** o [`guide-cognitive.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-cognitive.md) do A11Y.md, fixado no commit `9fb9a02`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Onde isso aparece nos nós

Quase tudo neste guia se lê ao longo das telas de um fluxo, quando o fluxo está desenhado. Uma tela sozinha é avaliada pelo que mostra.

| Tema | Nó | Regra |
| :--- | :--- | :--- |
| Fluxo (cadastro, checkout, formulário em etapas) | cada etapa é um `FRAME` de tela, filho direto da página. O protótipo, quando existe, liga as etapas | a volta para a etapa anterior tem uma tela desenhada que mostra o que a pessoa já preencheu |
| Dado informado antes no fluxo | a `INSTANCE` do campo na tela seguinte, em `State=Filled`, ou uma opção para escolher o valor anterior | nunca um campo vazio pedindo o dado de novo (SC 3.3.7) |
| Ajuda (contato humano, telefone, chat, formulário de contato, ajuda automatizada) | uma `INSTANCE` de um componente só, dentro do cabeçalho ou do rodapé compartilhado | a mesma ordem relativa entre os vizinhos dela em todas as telas onde ela aparece (SC 3.2.6). O critério não exige que a ajuda exista |
| Limite de tempo (sessão, carrinho com reserva de estoque, prova cronometrada) | uma reação `AFTER_TIMEOUT`, um `TEXT` de contagem regressiva ou de expiração, e o aviso | a pessoa consegue desligar, ajustar ou estender o limite (Seção 2) |
| Login e autenticação | os campos e qualquer desafio | Seção 5 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md). CAPTCHA que não dá para evitar oferece pelo menos duas modalidades (visual e áudio) ou reconhecimento de objeto, e nunca transcrição de texto distorcido. No Shield, o SC 3.3.9 (AAA) vale e remove também as exceções de reconhecimento de objeto e de conteúdo pessoal. No Standard, ele é recomendação |

## 2. O que o fluxo precisa ter

- **Dado que sobrevive às etapas.** A etapa seguinte mostra o dado anterior preenchido ou oferece para escolher ("Mesmo endereço da entrega"). As exceções do próprio critério são estas: reinserir é essencial (confirmação de senha), é requisito de segurança, ou o dado deixou de ser válido.
- **Uma saída para todo limite de tempo** (SC 2.2.1). A pessoa consegue desligar o limite, ajustar para pelo menos 10× o padrão ou estender. Para estender, um aviso aparece pelo menos 20 segundos antes do fim, com uma ação simples, disponível pelo menos 10 vezes. Sessão que expira sem aviso é falha de Nível A.
- **Instrução visível enquanto a pessoa decide.** Instrução crítica é um `TEXT` visível, e nunca só um placeholder ou um tooltip.

Conteúdo em movimento (carrossel, autoplay) é o SC 2.2.2, no [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-media.md).

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Posição da ajuda | em cada tela, a `INSTANCE` de ajuda (`mainComponent`) e o lugar dela entre os vizinhos na ordem do auto layout | o mesmo componente, na mesma ordem relativa, e não na mesma coordenada. O layout pode mudar com a largura da tela desde que a ordem se mantenha |
| Limites de tempo | `reactions` com o gatilho `AFTER_TIMEOUT` (`timeout` em ms), e qualquer texto de contagem regressiva ou de expiração | todo limite tem uma das saídas da Seção 2. Limite que termina numa tela de sessão expirada, sem aviso e sem como desligar, reprova. Toast que some sozinho está no [`figma-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-toasts-notifications.md) |
| Texto que sobrevive ao espaçamento da pessoa | `textAutoResize` do `TEXT`, e `layoutSizingVertical` e `height` do contêiner | `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de um contêiner `HUG`, com `minHeight` onde precisa de piso. Altura `FIXED`, `TRUNCATE` ou `maxLines` cortam o texto quando a pessoa aplica entrelinha de 1,5×, espaço depois do parágrafo de 2×, espaçamento entre letras de 0,12× e entre palavras de 0,16× (SC 1.4.12) |
| Instrução além dos sentidos | o texto de cada instrução | ela nomeia o controle pelo rótulo visível ("clique em **Enviar**, no fim do formulário"), e nunca só por forma, posição, cor ou som (SC 1.3.3) |

## 4. O que vira anotação

- **Na primeira tela do fluxo.** Qual dado de qual etapa aparece de novo, e onde, e que ele sobrevive ao botão Voltar.
- **Na instância de ajuda.** A ajuda mora no cabeçalho ou no rodapé compartilhado, e nunca é posicionada tela a tela. Fixe `mainComponent`.
- **Na tela com limite de tempo.** A duração padrão, qual saída vale, quando o aviso aparece, a ação de estender e o texto exato do aviso, anunciado quando aparece.
- **No texto corrido.** Fixe `lineHeight` e `fontSize`. O `paragraphSpacing` não pode ser fixado, então escreva o valor medido no texto.
- **Num nó com conflito entre necessidades**, as duas populações e a preferência ou a decisão que resolve o conflito (Seção 6).

```markdown
1 · aviso de fim de sessão
📢 "Sua sessão termina em 1 minuto. Quer mais tempo?"
🔊 botão "Estender sessão"
❓ limite de 15 min, com aviso 1 min antes? Proposta: sim, num diálogo
```

## 5. Microcopy

O microcopy é o texto curto da interface. Quando o agente escreve esse texto, ele já nasce sob estas regras. A WCAG só exige nível de leitura no AAA (SC 3.1.5), e por isso o microcopy simples é regra do A11Y.md†. No Shield, o SC 3.1.5 vale.

- **Sem dupla negação** e sem condicional empilhada. "Não deixe de confirmar" vira "Confirme".
- **Literal, e não figurado.** Metáfora, ironia e expressão idiomática são barreiras para parte do público autista e para quem lê em segunda língua.
- **O rótulo diz o resultado**, e não o mecanismo. "Salvar rascunho", e não "Submeter".
- **O erro é instrução, e não diagnóstico.** "CPF inválido" é diagnóstico. "O CPF tem 11 dígitos — verifique se faltou algum" é instrução.

## 6. Necessidades conflitantes

Alguns conflitos são acessibilidade contra acessibilidade. O agente nunca escolhe uma população em silêncio para depois chamar o resultado de conformidade.

| Eixo | Uma necessidade | A necessidade oposta |
| :--- | :--- | :--- |
| Movimento | a transição mantém a continuidade para quem tem dificuldade de acompanhar a mudança de contexto | translação e parallax causam náusea em quem tem distúrbio vestibular |
| Linguagem | simplificar reduz a carga cognitiva | simplificar tira a precisão de que o especialista depende |
| Contraste | contraste máximo serve a baixa visão | contraste máximo agride quem tem sensibilidade a brilho, como na enxaqueca |
| Tempo | limite curto protege uma sessão sensível | limite curto exclui quem lê ou digita devagar |
| Densidade | mais coisa por tela é menos navegação para dor crônica ou limitação motora | mais coisa por tela é mais carga para déficit de atenção |

1. **Prefira o mecanismo.** Quando a pessoa pode escolher (movimento reduzido, contraste, preferência da conta, zoom do sistema), o desenho mostra cada lado como variante ou como modo de variável, e a anotação diz qual preferência faz a troca. O que anima tem uma variante de movimento reduzido ([`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-media.md)).
2. **Sem mecanismo, leve à pessoa** as duas populações e as opções, e **registre a decisão** no formato do [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/A11Y-DECISIONS.md), com as duas necessidades nomeadas e o motivo.
3. **Maioria não é critério.** "A maioria dos usuários prefere" é argumento de usabilidade, e não de acessibilidade.

## 7. Antipadrões no canvas

- **Etapa que pede de novo** um dado já informado, ou Voltar que leva a campos vazios.
- **Ajuda que muda de lugar** entre cabeçalho e rodapé, ou desenhada tela a tela em vez de vir do componente compartilhado.
- **Sessão que termina sem aviso**, ou contagem regressiva sem como estender.
- **Instrução crítica só no placeholder ou num tooltip.**
- **"Clique no botão redondo à direita"**, ou qualquer instrução só por forma, posição ou som.
- **Escolher um lado do conflito em silêncio**, ou pela maioria.

## 8. O que fica para o código

A semântica, o teclado e o leitor de tela são implementados seguindo o [`guide-cognitive.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-cognitive.md) do A11Y.md. Os cenários de verificação dele e as checagens de carga cognitiva da §6 do [`REPORT.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/REPORT.md) rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
