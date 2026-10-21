# DA11Y.md — Acessibilidade como premissa, no desenho de interfaces
> **Versão:** 0.1.0 | **Edição de design do:** A11Y.md 2.5.0, commit `9fb9a02` | **Padrão Alvo:** WCAG 2.2 AA | **Última Atualização:** 2026-10-21

Este arquivo é a **edição de design** do A11Y.md: a mesma lógica e os mesmos números, para quem desenha ou avalia telas e componentes no Figma — pessoas e agentes. As regras valeriam em qualquer ferramenta de design. Os guias são escritos nos nós e nas propriedades do Figma, e por isso esta é a edição Figma. O código continua regido pelo A11Y.md. Os blocos marcados como `compiled` vêm do A11Y.md fixado e **não são editados à mão**.

**Antes de desenhar ou avaliar, leia o [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md) (deste projeto):** o que cada tipo de nó do Figma pode carregar e onde a acessibilidade cabe — inclusive onde **não** cabe (grupo não aceita anotação).

Profundidade por componente: carregue **só** a linha do mapa da Seção 7 que corresponde ao que você está desenhando ou avaliando, e abra o link dela. Cada guia `figma-*.md` traduz para nós do Figma o guia do A11Y.md de mesmo nome, e por isso não é preciso abrir o do A11Y.md. A linha do perfil é a exceção e leva direto ao A11Y.md, porque escolher o perfil é a mesma decisão no design e no código.

**Desenhar e avaliar terminam do mesmo jeito: com a evidência gravada no arquivo** (Seção 5), as anotações nos frames avaliados e as páginas de relatório e de handoff. Vale para criar, editar, analisar e revisar. Anotar e desenhar essas páginas não altera o desenho, então não pede a autorização que a Seção 2 exige para corrigir.

## 0. Princípio Zero
<!-- compiled:principle-zero -->
- Acessibilidade não é uma funcionalidade ou uma melhoria incremental; é uma **pré-condição para o uso**. 
- Se um usuário não consegue completar uma tarefa devido a uma barreira de acessibilidade, a funcionalidade é considerada **tecnicamente quebrada**.
- O sucesso da **Task Completion** é a nossa métrica principal de qualidade.
<!-- /compiled:principle-zero -->
- Uma tela sozinha é avaliada pelo que mostra. Ligar as telas no protótipo é escolha de quem desenha, não requisito de acessibilidade. O que se exige é o controle desenhado, como o Fechar de um modal, e não a reação que o faz funcionar. Uma reação que existe pode mostrar uma barreira, como uma ação só por hover ou um toast que some sozinho, e a falta de reação nunca reprova.

## 0.1. Perfil de Conformidade
Se o perfil não estiver definido, pergunte antes do primeiro frame. Padrão: Standard (AA).

<!-- compiled:profiles -->
| Perfil | Alvo | Contraste (texto / UI) | Fonte Mín† | Target Mín | Caso de Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🛡️ Shield (AAA)** | WCAG AAA | 7:1 / 3:1 (SC 1.4.6, 1.4.11) | 14px† | 44×44px (SC 2.5.5) · 48×48px† recomendado | Indústrias reguladas, saúde, governo |
| **⚖️ Standard (AA)** | WCAG AA | 4.5:1 / 3:1 (SC 1.4.3, 1.4.11) | 12px† | 24×24px (SC 2.5.8) · 44×44px† recomendado | Padrão. Apps em produção, web pública |
| **🚀 Launchpad (A)** | WCAG A | 3:1† (piso da casa) | 10px† | 24×24px† | MVPs, ferramentas internas, protótipos |

*† = **regra do A11Y.md**, não-normativa: a política ergonômica deste padrão onde a WCAG exige menos — ou nada — naquele nível. A WCAG não define fonte mínima em nenhum nível; o Nível A não define critérios de contraste nem de tamanho de alvo; os alvos de 44–48px vêm da Apple HIG / Material Design. Pular um **SC da WCAG** no seu nível-alvo MUST ser registrado no `EXCEPTIONS.md`; flexibilizar uma **regra do A11Y.md** é decisão de produto — registre no `A11Y-DECISIONS.md`.*
<!-- /compiled:profiles -->

No canvas, a unidade do arquivo vale como a da plataforma: em tela de app, 1 unidade = 1 pt (iOS) ou 1 dp (Android), e em tela web, 1 unidade = 1 pixel de CSS. As metas de toque das plataformas, 44 pt no iOS e 48 dp no Android, atendem à regra do A11Y.md no Standard. No Shield, 44 pt cumpre o SC 2.5.5 e 48 é o recomendado.

**Plataforma.** Antes de avaliar, diga se a tela é web ou app (iOS ou Android) e qual evidência mostra isso: a barra de status ou de navegação do sistema, componentes de iOS ou de Material, o nome da página, do arquivo ou da biblioteca. A largura do frame não decide, porque uma tela de 375 pode ser web no celular. Sem evidência, pergunte, como no perfil. A plataforma decide a unidade e o alvo acima, o vocabulário da anotação (o nível do título só existe na web, Seção 4) e se o guia de app entra (Seção 7), e vai na última linha da anotação do frame, ao lado do perfil (Seção 5).

## 1. Severidade
<!-- compiled:severity -->
Avalie o impacto de qualquer decisão de design ou implementação seguindo estes níveis:

- 🔴 **CRITICAL:** Falhas de **Operação**. Bloqueia a **Task Completion** ou torna a função inutilizável. **MUST FIX.**
- 🟠 **HIGH:** Falhas de **Percepção e Legibilidade**. Aumenta significativamente a **Taxa de Erro ou Abandono**. **MUST FIX.**
- 🟡 **MEDIUM:** Reduz a **Eficiência e Satisfação**. **SHOULD FIX.**
- 🔵 **LOW:** Impacto **Cosmético ou de Polimento**. **MAY FIX.**
<!-- /compiled:severity -->

No canvas, os mesmos níveis se leem assim:

| Nível | Como aparece no arquivo |
| :--- | :--- |
| 🔴 CRITICAL | ação que só existe por hover ou por arrasto, sem caminho por toque ou clique · modal sem saída desenhada · elemento interativo no caminho principal do fluxo sem estado Focus (na web; no app, só o controle desenhado do zero, Seção 3) |
| 🟠 HIGH | contraste abaixo do piso do perfil · texto abaixo da fonte mínima do perfil · estado mostrado só por cor · alvo abaixo do mínimo do perfil sem exceção que se aplique · rótulo que só existe como placeholder |
| 🟡 MEDIUM | abaixo de uma regra do A11Y.md (alvo de 44 ou 48, 8px entre alvos, ritmo do texto) · estado que falta fora do caminho principal · conflito entre necessidades deixado sem decisão |
| 🔵 LOW | nome de camada, ordem das camadas decorativas, higiene das anotações |

## 2. O que já existe vem primeiro
O design system da biblioteca ativa, as regras de design já registradas — o `DESIGN.md` do projeto, as guidelines da biblioteca, a descrição de cada componente e do seu conjunto de variantes, o `A11Y-DECISIONS.md` — e os ativos de marca que a pessoa indicar são **decisões prévias**: a fonte da aparência e do comportamento. Este arquivo não as substitui; ele as **avalia**. A ordem é sempre esta:

1. **Buscar.** Antes de desenhar ou de avaliar, procure na biblioteca o componente, a variável e o estilo que servem à tarefa, e leia as regras prévias (`DESIGN.md`, guidelines, decisões) e a descrição de cada componente usado e do seu conjunto de variantes. O que a descrição diz sobre comportamento, como a área de toque, é decisão prévia. Quando o desenho contradiz a descrição, como num card descrito como área de toque com um botão dentro, a dúvida vira uma pergunta de estrutura (❓, Seção 4), e o agente não escolhe um lado. No agente do Figma, o `measure.js` devolve essas descrições junto com as medidas. Dos ativos de marca indicados, leia os valores nos próprios nós: a família e o estilo da fonte, as cores e os pesos.
2. **Aplicar como está.** Use o que existe sem trocar token, sem sobrescrever instância e sem recriar componente — cor, tipografia, espaçamento, raio e superfícies (fundos) incluídos. A identidade visual não está em aberto. Valor de marca entra exato, nunca por aproximação.
3. **Avaliar.** Meça o resultado contra o perfil ativo (Seções 0.1 e 3): pares de contraste, alvos, estados presentes, tipografia.
4. **Avisar.** Para cada decisão prévia que afeta a acessibilidade, diga a **origem** (o componente, o token ou a regra do `DESIGN.md`), a **medida**, o **piso**, a **severidade** (Seção 1) e uma proposta de ajuste — luminância primeiro, na fonte (a biblioteca ou o `DESIGN.md`), nunca na instância. Quando a leitura do critério for discutível (por exemplo, a borda de um campo que também tem rótulo visível), diga a dúvida. O aviso vai para o chat e para o arquivo, como achado do tipo dele (Seção 5): `Corrigir aqui` no nó afetado, quando o defeito é de uso, e `Erro do design system` no componente avaliado, quando o defeito é da biblioteca, uma vez por variante com defeito no conjunto avaliado, na primeira instância em que ela aparece, porque variantes do mesmo componente passam e reprovam separadas. Gravar no arquivo faz parte de avisar e não pede autorização.
5. **Corrigir só com autorização expressa, e só onde o defeito mora.** Defeito de **uso** — variante errada, override, composição que quebra a ordem de leitura — se corrige no arquivo, depois da autorização, com o guia do componente (Seção 7), e só **o que foi avaliado**. Defeito do **próprio componente** — um botão da biblioteca cuja variante Focus reprova em 3:1 — nunca se corrige no arquivo que o usa, porque isso é override disfarçado. Componente da biblioteca é o que vem de fora do arquivo avaliado (`remote`, no [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). Avaliando um arquivo que usa a biblioteca, o agente nunca anota nem edita o arquivo da biblioteca. O defeito entra no relatório como *encaminhado à biblioteca* e é corrigido lá, por quem é dono dela. Componente local, cujo principal mora no arquivo avaliado, recebe `Corrigir aqui` no principal e se corrige no principal, nunca na instância. Quando o arquivo avaliado é a própria biblioteca, o `Erro do design system` vai no componente principal, e a correção autorizada é feita ali. Se a pessoa decidir não corrigir uma falha de critério WCAG, isso vira entrada no `EXCEPTIONS.md` (dono, aprovador, prazo). Flexibilizar uma regra do A11Y.md vai para o `A11Y-DECISIONS.md`.

Sem biblioteca, sem regras registradas e sem marca indicada, não há o que preservar: as regras deste arquivo orientam o desenho desde o primeiro frame. Com a marca e sem biblioteca, os valores da marca são a decisão prévia, e o resto nasce sob as regras deste arquivo.

Uma razão que passa nunca justifica sair do sistema, e uma razão que reprova não autoriza sair dele sozinho: acessibilidade e consistência são requisitos distintos, e quem arbitra entre os dois é a pessoa.

## 2.1. Contrato de comportamento no canvas
Todo agente que desenha ou avalia sob este arquivo **MUST**:

- **Não recriar o que existe.** Componente "acessível" paralelo, token novo ou estilo local no lugar do da biblioteca é violação, mesmo com boa intenção — o caminho é avisar (Seção 2).
- **Calcular, nunca estimar.** Contraste pela fórmula de luminância relativa da WCAG, sobre os valores dos tokens, para cada par que carrega significado — texto, borda de controle, ícone, anel de foco — em cada estado (padrão, hover, foco, erro, desabilitado) e em cada modo (claro, escuro). "Parece suficiente" é evidência fabricada. A razão é truncada, nunca arredondada. No agente do Figma, a conta sai do [`measure.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/measure.js), lido por link e executado sobre os ids das telas ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md), Seção 6). Os números dele valem e não se recalculam à mão. Quando um par reprovar, peça à pessoa que confira o mesmo par na checagem de contraste do próprio Figma, no seletor de cor. Nenhuma API expõe essa checagem ao agente, e o botão de correção automática dela troca a cor, que é a violação da Seção 2. Ferramenta que oferece corrigir uma cor serve para medir, nunca para corrigir.
- **Avaliar só o que está visível.** Camada oculta, no próprio nó ou num ancestral, fica fora da medida, da leitura e das anotações, inclusive dentro de instâncias. Um estado que só existe como camada escondida se confere pelas propriedades do componente, a variante ou a booleana que liga a camada.
- **Conferir os estados que o código vai exigir.** Foco, erro, desabilitado (com o motivo em texto), selecionado e marcado precisam existir como variante ou frame. Se o componente da biblioteca não tem o estado, isso é um aviso da Seção 2: aponte e desenhe o estado só com autorização — ou quando não houver biblioteca. A exceção é o foco de um controle da plataforma em tela de app, que vai para o relatório (Seção 3). Estado que ninguém desenhou é estado que o dev inventa, e o produto diverge do desenho.
- **Imagem: classificar e rascunhar, e a pessoa confirma.** Pelo teste de remoção ("se eu tirar esta imagem, o que se perde?"), classifique como informativa, funcional ou decorativa e proponha o texto alternativo como rascunho. Declarar uma imagem decorativa é decisão humana, nunca padrão.
- **Mídia: perguntar.** Vídeo ou áudio no layout dispara três perguntas na mesma hora: informa ou só ambienta? tem áudio? legenda e transcrição existem?
- **Conflito entre necessidades: nomear e perguntar.** Quando atender uma necessidade cria barreira para outra (movimento, contraste, densidade), nomeie as duas populações e leve a escolha à pessoa.
- **Deixar a evidência no arquivo, em anotação nativa.** Cada frame avaliado (a tela ou o componente) recebe **uma anotação** curta da ferramenta de anotações, na categoria **Accessibility**, no formato da Seção 5. Fora ela, **só há anotação quando há algo que a pessoa precisa corrigir neste arquivo**: um `Corrigir aqui` por achado, no formato curto da Seção 5. Os erros do design system, as perguntas abertas e a leitura vão para as páginas de relatório e de handoff, numerados sobre uma cópia da tela (Seção 5). A ferramenta que não desenha essas páginas anota também esses, um por elemento, na categoria do tipo. O que passou e o que é só do código vão para o relatório. Anotação é sinal para quem desenha, não relatório: hex e nome de token só entram quando o problema é estrutural, como o token de um componente da biblioteca. O chat não é evidência: ele não chega a quem desenvolve. Se a ferramenta de anotações não estiver disponível (plano ou assento), diga isso. Para componente, o lugar reserva é o campo de descrição. Para tela, é a página de relatórios da Seção 5. Nunca só o chat.
- **Não declarar o que é do código.** Semântica, leitor de tela, teclado real e testes automatizados não acontecem no canvas: entram no relatório como **requisito para o desenvolvimento**, nunca como verificados.
- **Não se aprovar.** Quem desenhou declara a verificação como autorrelatada, e o status fica no máximo CONDICIONAL até alguém que não desenhou conferir.
- **Registrar decisões e exceções** nos formatos dos templates do A11Y.md ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/EXCEPTIONS.md)). Decisão tomada pelo agente é registrada como do agente — nunca atribuída à pessoa.

## 2.2. Quando a tarefa é criar ou mudar o design system
Criar ou alterar componente, variável ou estilo da biblioteca **a pedido** é a orientação expressa da Seção 2: aqui o agente aplica as regras deste arquivo desde o primeiro frame e entrega, junto com o componente, a **camada de contexto para agentes** — o que outro agente precisa ler para usar o componente certo, do jeito certo, sem recriá-lo:

1. **Descrição do componente** (o campo de descrição do componente): o que é, quando usar, quando **não** usar, e os **apelidos** pelos quais alguém pediria por ele ("switch", "toggle", "liga/desliga").
2. **Contrato de acessibilidade como dado**, um item por requisito: nome, categoria (Contraste, Teclado, Semântica, Conteúdo), critério WCAG, requisito (por exemplo, "4.5:1"), estados cobertos e uma descrição que permita a outra pessoa ou agente reproduzir a conferência — com o resultado medido de cada estado em cada modo (passa, reprova, não testado).
3. **Anatomia na ordem de leitura:** camadas nomeadas pelo que são ("Rótulo", "Controle", "Texto de ajuda"), na ordem em que o teclado e o leitor de tela vão percorrer. Nome de camada é evidência para o próximo agente — ele não pode mentir.
4. **Propriedades com nomes que o código reconhece:** a propriedade de estado com valores como Default, Hover, Focus, Disabled e Error, e o rótulo como propriedade de texto. Nada de "Variant 2".
5. **Ligação com o código**, quando existir: o link de documentação do componente e, se houver, o Code Connect.
6. **Mapa de apelidos da biblioteca**, como arquivo JSON para as guidelines da biblioteca: componente → apelidos → papel → estados obrigatórios. O agente escreve o arquivo e uma pessoa anexa, porque as guidelines são anexadas nas configurações da biblioteca. É o que faz o próximo agente achar o componente que existe em vez de criar outro.

Tudo curto: o agente que lê paga por cada palavra, e contexto que ninguém consegue ler inteiro não é contexto.

## 3. O que o desenho precisa cumprir

### Perceptível
- **Contraste** pelos pisos do perfil (Seção 0.1). Componentes de interface e gráficos com significado: 3:1 contra o vizinho.
- **Cor nunca sozinha.** Compare as variantes de um estado: se só a cor muda entre "padrão" e "erro", o estado falha. Ícone, texto ou forma acompanham a cor.
- **Gráficos:** cada série tem um segundo canal além da cor (tracejado, marcador, rótulo direto), e séries vizinhas têm 3:1 entre si.
- **Texto sobre imagem ou vídeo** fica sobre uma camada de contraste (scrim) medida no pior caso.
- **Texto que cresce:** texto que a pessoa precisa ler não tem altura fixa nem truncamento — ele precisa sobreviver a 200% e ao espaçamento escolhido pelo usuário.
- **Movimento:** o que anima tem uma variante de movimento reduzido. Movimento automático com mais de 5 segundos tem pausa visível, e nada pisca mais de 3 vezes por segundo.

### Operável
- **Alvo de toque:** o mínimo do perfil, 24×24 no Standard (SC 2.5.8) e 44×44 no Shield (SC 2.5.5). Abaixo disso, só pelas exceções do critério. No Standard, vale quando um círculo de 24 centrado no alvo não toca outro alvo nem o círculo de outro alvo pequeno. Nos dois perfis, vale quando a mesma ação existe num alvo equivalente que atinge o piso. Regra do A11Y.md: desenhar com 44×44 (48×48 no Shield). Quando um de dois alvos vizinhos fica abaixo desse tamanho, os dois ficam a 8px um do outro, como o A11Y.md pede em interface densa. Alvos desse tamanho podem se encostar, como as linhas de uma lista. Ficar abaixo da regra do A11Y.md é um achado para relatar, nunca uma falha de WCAG. Meça a caixa do frame interativo, nunca o ícone dentro dele.
- **Foco desenhado** em todo elemento interativo: contorno de pelo menos 2px com 3:1 contra o fundo — contorno, não só sombra, que some no modo de alto contraste — e nunca coberto por cabeçalho ou rodapé fixo. No Shield, vale também o SC 2.4.13 (AAA). O indicador cobre um perímetro de pelo menos 2px, com 3:1 entre o estado com foco e o sem foco, então compare as variantes Focus e Default. Foco mostrado só por mudança de preenchimento não cumpre o contorno pedido acima, e isso entra no relatório. Em tela de app, a instância da biblioteca que representa um controle da plataforma herda o foco do sistema ([`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-platform-native.md), Seção 1): a variante Focus que falta vai para o relatório, como requisito de usar o foco do sistema ou desenhar o estado, e não é erro. No app, o 🔴 CRITICAL da Seção 1 por falta de Focus vale para o controle desenhado do zero.
- **Nada só por hover ou por arrasto:** toda ação tem caminho por toque ou clique e um controle visível. Gesto do aparelho (sacudir, inclinar) tem controle na tela.

### Compreensível
- **Rótulo visível, fora e antes do campo.** Placeholder nunca é rótulo. Formato esperado (por exemplo, DD/MM/AAAA) visível antes de digitar.
- **Erro** em texto, com ícone e cor, perto do campo, dizendo a saída — "Senha incorreta. Tente novamente ou redefina sua senha", não só "Senha incorreta".
- **Linguagem simples:** voz ativa, frase curta, palavra comum, sigla expandida. Link diz para onde leva, e "clique aqui" e "saiba mais" soltos não servem.
- **Consistência:** ajuda e navegação na mesma posição relativa em todas as telas do fluxo, e a mesma função tem o mesmo nome em todo lugar.
- **Fluxo:** nada que a pessoa precise lembrar de uma tela para outra, nada que precise digitar de novo, nenhum CAPTCHA de transcrição, nenhum "digite o 3º e o 7º caractere da senha".

### Tipografia (regra do A11Y.md†)
- Fonte mínima do perfil. Densidade: 10px só com 7:1 e entrada no `EXCEPTIONS.md`.
- Texto corrido: entrelinha de pelo menos 1,5, espaço depois do parágrafo de pelo menos 2× o tamanho da fonte, cerca de 80 caracteres por linha, alinhado ao início — nunca justificado.

## 4. A intenção que o desenho não mostra: o agente propõe, a pessoa decide
O canvas não tem campo para semântica, e é aqui que a intenção morre entre o desenho e o código: ninguém escreve. Ao entregar uma tela, o agente resolve essa camada de dois jeitos. O que vale para a tela inteira e sai da estrutura (as regiões pelos nomes das camadas, o preenchimento automático pelo tipo do campo) vai para o relatório, como requisito para o desenvolvimento. A leitura de cada elemento vai para a página de handoff, num card numerado ao lado de uma cópia da tela (Seção 5). É o que quem desenha confere e quem desenvolve implementa. O handoff é desenhado quando o pedido é entregar a tela desenhada ou preparar o handoff ("prepare o handoff", "anote a leitura"). Quando o pedido é avaliar, analisar ou revisar, não há handoff: a avaliação entrega a medida, os erros, as linhas `❓` e a anotação do frame, e o relatório traz a leitura como rascunho, para a pessoa pedir o handoff quando o desenho fechar. Veredito e proposta não têm o mesmo peso. O erro é fato medido ou regra, e a leitura é proposta, que só vira especificação com o `✓`. Recebem esse card os elementos em que o leitor de tela para: títulos, controles, componentes e contêineres com uma ação. O componente leva a leitura dele e a dos filhos numa lista fechada: o que está dentro dele e não aparece na lista não é lido, como o ícone e a seta de um card. Um componente com uma ação dentro, como um cartão com o botão Editar, é um item só, mesmo quando o cartão não é tocável. A primeira linha leva o intervalo (`5–6 · pagamento`), e cada parada vem numerada. A camada inclui:

- **Ordem de leitura** — o número de cada parada, na ordem em que o leitor de tela passa, textos inclusive. Ele abre o card e, quando o card tem mais de uma parada, cada linha `🔊`. Ela sai da estrutura (a ordem do auto layout), conferida contra a leitura visual. Onde as duas divergem, o número segue a leitura visual e uma linha `❓` diz que a estrutura está em outra ordem. A ordem de foco do teclado, só com os controles, vai para o relatório.
- **Títulos** e o **título da tela**. Na web, o título vai com o nível, de H1 a H6 (`🔊 título H2 "Pedidos"`). No app, vai só "título", porque iOS e Android não têm nível.
- **Nome acessível** de todo controle sem texto visível (botão só com ícone). Quando há texto visível, o nome o contém.
- **Papel** quando a aparência engana: card clicável, link que parece botão, abas, switch × checkbox.
- **Vocabulário dos papéis**, fechado: botão, link, título, campo, combobox, caixa de seleção, opção, interruptor, controle deslizante, aba, menu, diálogo, diálogo modal, lista, tabela, árvore, grupo, navegação, imagem e mapa. Texto sem papel vai só entre aspas (`🔊 "Número do protocolo, 48213"`). "Texto", "cabeçalho" e "imagem informativa" não são papéis, e o `annotate.js` recusa qualquer palavra fora da lista.
- **Texto alternativo** de cada imagem, com a classificação (informativa, funcional, decorativa). Decorativa é decisão humana: o agente pode suspeitar, nunca concluir. A informativa e a funcional entram na leitura, com o texto alternativo. A que o agente suspeita ser decorativa fica fora da leitura e vai para o relatório como não lida. Texto alternativo que só repetiria o texto ao lado, como o endereço escrito embaixo do mapa, faz da imagem candidata a decorativa.
- **Regiões** da tela: cabeçalho, navegação, conteúdo principal, rodapé.
- **Texto dos anúncios** dinâmicos ("12 resultados carregados", "Senha incorreta. Tente novamente ou redefina sua senha").
- **Idioma** de trechos em outra língua.

Regras da proposta:
- **A proposta é proposta até o `✓`.** Sem `✓`, quem desenvolve pergunta. Quando a pessoa decide, ela acrescenta a linha `✓ <nome>` ao card, ou à anotação da categoria `Proposta`, cujo nome diz o que ela é, não o que ela vira. Quem desenvolve implementa o que tem `✓`, e o que ainda é proposta, pergunta. O agente nunca escreve o `✓`, e uma nova rodada guarda todo card e toda anotação que uma pessoa decidiu.
- **Não sobrescrever anotação humana.** Se o agente discorda do que a pessoa já anotou, ele acrescenta a divergência e não apaga.
- **Não propor o que a regra já decide.** Foco visível ou contraste não são propostas — são as Seções 2 e 3.
- **`❓` só para estrutura e papel.** A pergunta é sobre o que as marcas não dizem: abas ou navegação, se o card é um controle, se o painel recolhe. Pergunta de conteúdo ou de produto (um valor que parece errado, uma data que não bate) e pergunta de comportamento vão para o relatório. A `❓` nunca repete um erro, porque o defeito já está no achado dele.
- **Erro é certeza.** O achado `Aqui:` ou `Biblioteca:` nunca depende de uma resposta ("se for recolhível…"). O que depende de resposta é `❓`, e o erro só entra depois dela.
- **Um item por elemento, no próprio elemento:** um card na página de handoff, ou uma anotação no canvas. Cada tela recebe só o que ela tem: o que vale para o fluxo inteiro, como o preenchimento automático de um formulário, aparece uma vez, na primeira tela em que aparece.
- Enquanto houver proposta sem decisão, o relatório fica no máximo CONDICIONAL.

## 5. Entrega
- **Para quem desenha — um resumo curto** em três blocos: o que passou; o que reprova e **de onde vem** (componente, token ou regra do `DESIGN.md`; medida; piso; severidade); o que precisa de decisão humana — incluindo a pergunta "corrijo?" para cada aviso e o número de decisões que esperam a pessoa.
- **Para quem desenvolve — o relatório, duas vezes.** **No arquivo,** cada frame avaliado recebe a anotação da Seção 2.1 com as contagens dele, neste formato, com uma linha em branco entre os blocos:

  ```
  **CONDICIONAL**

  Perguntas abertas — <n>
  Leituras a confirmar — <n>
  Corrigir aqui — <n>
  Erros do design system — <n>
  Não lidos — <n>

  Relatório completo na página DA11Y — relatórios

  <perfil> · <plataforma> · DA11Y.md <versão> · A11Y.md <versão>
  ```

  Perguntas abertas conta as `❓` ainda sem `✓`, e Leituras a confirmar as anotações de leitura sem `✓`. Um item com os dois conta nos dois. Quando a leitura não está no canvas, numa avaliação e quando ela está na página de handoff, cujos cards levam o próprio `✓`, a linha diz `Leituras — não anotadas` no lugar da contagem, porque zero diria que não há nada pendente. Os não lidos são o que a leitura deixou de fora, listado no relatório com o motivo, para a pessoa confirmar. Com as cinco contagens em zero, a anotação diz `Nada a fazer nesta tela` no lugar delas, para quem desenvolve saber que a tela foi avaliada. O status vem primeiro, e a última linha traz o perfil, a plataforma e as versões, como `Standard (AA) · app · DA11Y.md 0.1.0 · A11Y.md 2.5.0`, porque uma razão que passa no Standard reprova no Shield. Sem data, sem hex, sem nome de token, sem recomendação e sem ressalva: o detalhe é do relatório.

  Cada achado e cada leitura são curtos, no formato do tipo, e o começo diz o tipo. Medida, ressalva, recomendação e como conferir vão para o texto do relatório, nunca para o achado ou para o card:

  | Tipo | Quando | Formato | O que a pessoa faz |
  | :--- | :--- | :--- | :--- |
  | `Proposta` | a leitura de um elemento (Seção 4) e as escolhas que o desenho não resolve | a ordem e o elemento na primeira linha (`4 · card`, `2–3 · abas`). Depois, uma linha por marca: `🔊` uma parada do leitor de tela, com o papel do vocabulário da Seção 4 e o que ele lê entre aspas, uma linha por parada · `📢` o que ele anuncia quando acontece · `❓` uma escolha de estrutura ou de papel que as marcas não dizem, como abas ou navegação, com a proposta — nunca conteúdo, comportamento nem um erro repetido (Seção 4). A lista é fechada: o que está dentro do elemento e não aparece num `🔊` não é lido, e o `✓` confirma a lista inteira, inclusive o que ficou de fora. Imagem informativa entra como `🔊 imagem "texto alternativo"`. Texto longo entra pelo começo, com reticências dentro das aspas (`🔊 "No dia 27 parei neste…"`), nunca descrito. Com mais de uma parada, cada linha `🔊` começa com o número dela (`2) 🔊 aba "Itens"`). Itens repetidos que seguem um molde, como cada linha de uma tabela, cabem numa linha só (`🔊 cada linha: "…"`) | confere e acrescenta `✓ <nome>` |
  | `Corrigir aqui` | defeito de uso neste arquivo: variante errada, override, composição que quebra a ordem | um achado por anotação, numa linha, no máximo duas quando a frase não cabe, e a segunda nunca começa outra gravidade: a gravidade, com a cor e o nome da Seção 1, e `Aqui:` | corrige, ou autoriza o agente a corrigir |
  | `Erro do design system` | defeito do componente, do token ou do estilo da biblioteca | um achado por anotação, numa linha, no máximo duas, do mesmo jeito: a gravidade, com a cor e o nome, e `Biblioteca:` | encaminha a quem mantém a biblioteca, sem corrigir nesta instância |

  ```
  4 · card
  🔊 botão "Seguro residencial, Ativo"
  ```

  ```
  5–7 · status da solicitação
  5) 🔊 título "Status da solicitação"
  6) 🔊 "Número do protocolo, 48213"
  7) 🔊 "Situação, Em análise"
  ```

  `🔴 CRITICAL · Biblioteca: sem estado Focus` · `🟠 HIGH · Aqui: seta branca sobre branco`

  A gravidade nunca vem só pela cor. O círculo vem com o nome dele na Seção 1: 🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM ou 🔵 LOW.

  O §4 de cada guia lista o que o agente resolve para o componente. No handoff vai só a leitura, no formato acima: onde o guia diz a anotação do elemento, é o card do elemento na página de handoff. Teclado, foco e comportamento vão para o relatório, como requisito para o desenvolvimento.

  **Onde cada coisa vai.** O canvas guarda só o que a pessoa corrige neste arquivo: a anotação do frame e as anotações `Corrigir aqui`, cada uma terminando com o número do achado (`· achado 2`). O resto vai para duas páginas do arquivo, ao lado de uma cópia da tela, para o canvas não se encher de anotações:

  - **`DA11Y — relatórios`**, numa avaliação: o relatório completo (abaixo), com cada tela avaliada em tamanho real e cada achado numerado na borda, ao lado do card dele. `Corrigir aqui` vem primeiro, por gravidade, depois `Erro do design system` por componente, depois as `❓`. Os números são os do canvas, e a linha do relatório na anotação do frame leva o link para ele.
  - **`DA11Y — handoff`**, ao entregar a tela desenhada ou preparar o handoff (Seção 4): um bloco por tela ou componente. A ordem de leitura, numa cópia com cada parada contornada e numerada ao lado do card dela. Os controles e as áreas de toque, medidos contra o mínimo do perfil e a regra do A11Y.md (Seção 3), numerados pela leitura no app e pela ordem do Tab na web. Os estados de foco, cada controle ao lado da variante de foco dele na biblioteca, ou o aviso de que a biblioteca não tem. O que não é lido não é desenhado.

  A pessoa decide na página: o `✓ <nome>`, ou a resposta a uma `❓`, vai no card. Uma nova rodada do mesmo conjunto troca o bloco no lugar e guarda todo card que uma pessoa decidiu. As duas páginas seguem o design system da tela, os estilos de texto e as variáveis de cor dela, quando o par passa de 4.5:1, e são os únicos nós que o agente cria sem pedir. No agente do Figma, o [`report.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/report.js) e o [`handoff.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/handoff.js), lidos por link, desenham as duas do mesmo jeito sempre: o agente decide o conteúdo, e o script o posiciona e mede no arquivo. A ferramenta que não desenha as páginas grava cada achado e a leitura como anotações nos nós, nas categorias abaixo (o `annotate.js` com `onPage: false`).

  **Cada tipo tem a sua categoria de anotação**, e é ela que deixa filtrar as anotações pelo que cada pessoa precisa fazer: quem mantém a biblioteca, por exemplo, filtra os erros do design system. Antes de anotar, o agente lê as categorias do arquivo (`figma.annotations.getAnnotationCategoriesAsync()`) e cria as que faltam (`figma.annotations.addAnnotationCategoryAsync({ label, color })`), com estes nomes e cores:

  | Categoria | Cor | O que leva |
  | :--- | :--- | :--- |
  | `Accessibility` | `pink` | a anotação do frame; é a categoria pronta dos arquivos de design |
  | `Proposta` | `blue` | a leitura de cada elemento e as escolhas em aberto, e depois o `✓ <nome>` |
  | `Corrigir aqui` | `orange` | `Aqui:` |
  | `Erro do design system` | `violet` | `Biblioteca:` |

  No canvas do agente do Figma, só `Accessibility` e `Corrigir aqui` são usadas. `Proposta` e `Erro do design system` levam o que anota a ferramenta que não desenha as páginas. Se a ferramenta do agente não deixar criar categoria, a anotação de ação vai para `Accessibility`, e o agente avisa no chat que as categorias faltam. O começo de cada anotação continua dizendo o tipo.

  **A avaliação termina no arquivo.** Uma avaliação, uma análise ou uma revisão só termina quando as anotações estão gravadas e relidas: o agente lê de volta cada frame avaliado e confere que as contagens da anotação do frame batem com os achados, os que estão no frame e os da página de relatório. Sem anotação gravada, a entrega não aconteceu. O agente diz isso no chat, em vez de oferecer anotar depois. No agente do Figma, o [`annotate.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/annotate.js), lido por link, faz as duas coisas. Ele grava as anotações, e a do frame com as contagens tiradas delas. Numa execução separada, ele relê e confere. Ele recusa a anotação que foge do formato, e numera os achados que a página de relatório desenha.

  **Fora do arquivo,** como `REPORT.md` a partir do [template](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/templates/REPORT.md) deste projeto, com as entradas de `A11Y-DECISIONS.md` e `EXCEPTIONS.md` nos formatos do A11Y.md ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/templates/EXCEPTIONS.md)), entregues junto com o desenho, no ticket, no hand-off ou no repositório. Um agente que não cria arquivo, como o do Figma, desenha o relatório completo no próprio arquivo do Figma, na página `DA11Y — relatórios`, um bloco por conjunto avaliado, nomeado pelo conjunto, e o repete no chat em Markdown para a pessoa salvar como `REPORT.md`. No agente do Figma, o `reportPage()` do [`report.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/report.js) desenha o Markdown em títulos, tabelas e listas, com as telas avaliadas e os achados numerados, e guarda o Markdown no bloco, para o `REPORT.md` poder ser lido de volta exatamente. Esses arquivos são o que o agente de código lê sob a *Decision Memory* do A11Y.md. As decisões do desenho chegam ao código como decisões prévias, e uma proposta da Seção 4 ainda sem decisão chega como pergunta, nunca como requisito. O relatório termina com a instrução: **implementar seguindo o A11Y.md**. Um relatório por conjunto avaliado (a tela, o fluxo ou a seção pedida), e cada frame recebe a anotação com as próprias contagens. Uma nova avaliação atualiza os dois em vez de empilhar outro. Nela, o agente mede de novo e troca as anotações e os cards dele pelos novos: os de leitura, os de `Aqui:` e os de `Biblioteca:` sem `✓`, e a anotação do frame. Uma anotação ou um card com `✓ <nome>`, ou uma anotação fora desse formato, é de pessoa, e o agente não toca. O card decidido cujo achado saiu da nova análise fica listado à parte. Se um item com `✓` ficar com o número de ordem antigo, o agente avisa no relatório.
- **Pronto para desenvolvimento é um portão.** Uma seção ou frame só é marcado como pronto para desenvolvimento (`devStatus`) com relatório em CONDICIONAL ou melhor, nenhuma proposta da Seção 4 sem decisão e nenhuma falha WCAG fora do `EXCEPTIONS.md`.
- **Quando a tarefa criou ou mudou o design system** — além do relatório, a camada de contexto para agentes da Seção 2.2, no próprio componente e nas guidelines da biblioteca.

## 6. Antipadrões no canvas
- **Trocar token, sobrescrever instância ou recriar componente da biblioteca** sem autorização — inclusive para "corrigir" acessibilidade.
- **Corrigir antes de avisar**, ou corrigir além do que foi avaliado.
- **Apresentar proposta como decisão tomada** — o `✓` escrito pelo agente, ou a leitura de um elemento fora do card dele ou da categoria `Proposta`.
- **O mesmo elemento em vários cards ou anotações** — o card, o ícone e a seta lidos em separado.
- **Desenhar ou anotar o que não é lido** — o handoff mostra só a leitura, e o que ela deixa de fora vai para o relatório.
- **Anotação sem ação** — o que passou, o que é só do código ou o que ninguém precisa fazer, anotado no canvas.
- **`❓` sobre conteúdo ou comportamento**, ou que repete um erro — isso é do relatório.
- **Erro condicional** — `Aqui:` ou `Biblioteca:` com "se…"; o que depende de resposta é `❓`.
- **Dois achados numa anotação** — a contagem do frame perde um.
- **Handoff quando o pedido era avaliar** — a leitura entra quando a pessoa a pede ou quando o agente entrega a tela desenhada.
- **Todo achado no canvas quando as páginas podem ser desenhadas** — o canvas guarda a anotação do frame e o `Corrigir aqui`, só.
- **Erro do design system corrigido no arquivo que o usa** — override disfarçado.
- **Anotar ou editar o arquivo da biblioteca** em vez do componente avaliado.
- **Anotação que vira relatório** — medida, ressalva, recomendação ou como conferir no canvas, mais de duas linhas por erro, ou o mesmo achado repetido em cada tela.
- **`GROUP` em qualquer coisa interativa ou que precise de evidência.**
- **Marcar como pronto para desenvolvimento** sem relatório, com proposta sem decisão ou com falha WCAG não registrada.
- **Barra ou ícone de "modo acessível"** como solução — acessibilidade se resolve no desenho, não numa camada por cima.
- **Deixar a evidência só no chat**, também quando o pedido era só avaliar.
- **Dar o próprio desenho por aprovado.**

## 7. Mapa de guias (carregue só a linha da vez)

| Você está desenhando ou avaliando… | Guia |
| :--- | :--- |
| qualquer coisa no canvas — tipos de nó, auto layout, anotações, medidas | [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md) (deste projeto) |
| botão, CTA, botão só com ícone | [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-buttons.md) |
| formulário, campo de texto, rótulo, mensagem de erro, formulário de login | [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md) |
| checkbox, radio, switch, slider, select, controle desabilitado | [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-form-controls.md) |
| autocomplete, combobox, select com busca | [`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-autocomplete.md) |
| login, cadastro, fluxo em etapas, limite de tempo, checkout, microcopy | [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-cognitive.md) |
| modal, diálogo, gaveta, confirmação | [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-modals.md) |
| banner de cookies ou consentimento | [`figma-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-consent-banners.md) |
| menu, cabeçalho, navegação, títulos da página | [`figma-navigation.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-navigation.md) |
| abas, accordion, painel colapsável | [`figma-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-tabs-accordion.md) |
| tooltip, popover | [`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-tooltips-popovers.md) |
| toast, snackbar, alerta | [`figma-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-toasts-notifications.md) |
| skeleton, carregamento, animação de entrada | [`figma-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-loading-skeleton.md) |
| carrossel, banner rotativo | [`figma-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-carousels-sliders.md) |
| arrastar e soltar, reordenar, kanban | [`figma-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-drag-drop.md) |
| feed, scroll infinito, "carregar mais" | [`figma-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-infinite-scroll.md) |
| imagem, ícone, ilustração, avatar | [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-images.md) |
| vídeo, áudio, vídeo de fundo, parallax | [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-media.md) |
| gráfico, dashboard, KPI | [`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-charts.md) |
| tabela, grid de dados | [`figma-tables.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-tables.md) |
| campo de data, calendário | [`figma-datepicker.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-datepicker.md) |
| tree view, explorador de arquivos, seletor de hierarquia | [`figma-treeview.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-treeview.md) |
| mapa, localizador | [`figma-maps.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-maps.md) |
| chat, assistente, resposta gerada | [`figma-generative-ui.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-generative-ui.md) |
| cor, paleta, tokens, tema | [`figma-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-visual-perception.md) |
| breakpoint, zoom, layout responsivo, alvo de toque | [`figma-responsive-mobile.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-responsive-mobile.md) |
| tela de app iOS ou Android, ou app para público brasileiro | [`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-platform-native.md) |
| público brasileiro, Libras | [`figma-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-sign-language-br.md) |
| escolha ou troca de perfil | [`guide-compliance-profiles.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/pt-BR/references/guide-compliance-profiles.md) |

## 8. Fontes adicionais (não normativas)
Material de apoio que este arquivo recomenda, mas **não incorpora**. As regras continuam sendo as deste arquivo e do A11Y.md.

- **[Magoo](https://magoo.cc)**, de Marcelo Sales — biblioteca de comportamentos de interação, com perguntas de design por componente e por modo de uso (sem interação, mouse, gestos, teclado, leitor de tela), em português. Boa fonte para quem desenha refletir sobre as decisões que nenhuma regra fecha. Também pode ser consultado por agentes, pelo site ou pelo MCP do projeto ([`@acessibilidade/magoo-mcp`](https://www.npmjs.com/package/@acessibilidade/magoo-mcp)). O próprio Magoo se declara material educativo, não normativo.
- **[Astryx](https://github.com/facebook/astryx)**, da Meta — referência da camada de contexto para agentes da Seção 2.2: documentação de componente como dado tipado, requisitos de acessibilidade por componente (critério, requisito, estados), anatomia na ordem de leitura, apelidos para o agente achar o componente certo e testes de geração julgados por um agente separado.
