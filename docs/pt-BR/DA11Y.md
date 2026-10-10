# DA11Y.md — Acessibilidade como premissa, no desenho de interfaces
> **Versão:** 0.1.0 (rascunho) | **Edição de design do:** A11Y.md 2.3.0, commit `57564be` | **Padrão Alvo:** WCAG 2.2 AA | **Última Atualização:** 2026-10-09

Este arquivo é a **edição de design** do A11Y.md: a mesma lógica e os mesmos números, para quem desenha telas e componentes no Figma — pessoas e agentes. As regras valeriam em qualquer ferramenta de design. Os guias são escritos nos nós e nas propriedades do Figma, e por isso esta é a edição Figma. O código continua regido pelo A11Y.md. Os blocos marcados como `compiled` vêm do A11Y.md fixado e **não são editados à mão**.

**Antes de desenhar, leia o [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md) (deste projeto):** o que cada tipo de nó do Figma pode carregar e onde a acessibilidade cabe — inclusive onde **não** cabe (grupo não aceita anotação).

Profundidade por componente: carregue **só** a linha do mapa da Seção 7 que corresponde ao que você está desenhando, e abra o link dela. Cada guia `figma-*.md` traduz para nós do Figma o guia do A11Y.md de mesmo nome, e por isso não é preciso abrir o do A11Y.md. A linha do perfil é a exceção e leva direto ao A11Y.md, porque escolher o perfil é a mesma decisão no design e no código.

## 0. Princípio Zero
<!-- compiled:principle-zero -->
- Acessibilidade não é uma funcionalidade ou uma melhoria incremental; é uma **pré-condição para o uso**. 
- Se um usuário não consegue completar uma tarefa devido a uma barreira de acessibilidade, a funcionalidade é considerada **tecnicamente quebrada**.
- O sucesso da **Task Completion** é a nossa métrica principal de qualidade.
<!-- /compiled:principle-zero -->
- No desenho, a unidade é o **fluxo**, não a tela solta: se a tarefa não fecha no protótipo, o desenho está quebrado.

## 0.1. Perfil de Conformidade
Se o perfil não estiver definido, pergunte antes do primeiro frame. Padrão: Standard (AA).

<!-- compiled:profiles -->
| Perfil | Alvo | Contraste (texto / UI) | Fonte Mín† | Target Mín | Caso de Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🛡️ Shield (AAA)** | WCAG AAA | 7:1 / 3:1 (SC 1.4.6, 1.4.11) | 14px† | 44×44px (SC 2.5.5) · 48×48px† recomendado | Indústrias reguladas, saúde, governo |
| **⚖️ Standard (AA)** | WCAG AA | 4.5:1 / 3:1 (SC 1.4.3, 1.4.11) | 12px† | 24×24px (SC 2.5.8) · 44×44px† recomendado | Padrão. Apps em produção, web pública |
| **🚀 Launchpad (A)** | WCAG A | 3:1† (piso da casa) | 10px† | 24×24px† | MVPs, ferramentas internas, protótipos |

*† = **Regra da Casa**, não-normativa: a política ergonômica deste padrão onde a WCAG exige menos — ou nada — naquele nível. A WCAG não define fonte mínima em nenhum nível; o Nível A não define critérios de contraste nem de tamanho de alvo; os alvos de 44–48px vêm da Apple HIG / Material Design. Pular um **SC da WCAG** no seu nível-alvo MUST ser registrado no `EXCEPTIONS.md`; flexibilizar uma **Regra da Casa** é decisão de produto — registre no `A11Y-DECISIONS.md`.*
<!-- /compiled:profiles -->

No canvas, a unidade do arquivo vale como a da plataforma: em tela de app, 1 unidade = 1 pt (iOS) ou 1 dp (Android), e em tela web, 1 unidade = 1 pixel de CSS. As metas de toque das plataformas, 44 pt no iOS e 48 dp no Android, atendem à Regra da Casa no Standard. No Shield, 44 pt cumpre o SC 2.5.5 e 48 é o recomendado.

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
| 🔴 CRITICAL | ação que só existe por hover ou por arrasto, sem caminho por toque ou clique · fluxo que não fecha no protótipo · modal sem saída desenhada · elemento interativo no caminho principal do fluxo sem estado Focus |
| 🟠 HIGH | contraste abaixo do piso do perfil · texto abaixo da fonte mínima do perfil · estado mostrado só por cor · alvo abaixo do mínimo do perfil sem exceção que se aplique · rótulo que só existe como placeholder |
| 🟡 MEDIUM | abaixo de uma Regra da Casa (alvo de 44 ou 48, 8px entre alvos, ritmo do texto) · estado que falta fora do caminho principal · conflito entre necessidades deixado sem decisão |
| 🔵 LOW | nome de camada, ordem das camadas decorativas, higiene das anotações |

## 2. O que já existe vem primeiro
O design system da biblioteca ativa e as regras de design já registradas — o `DESIGN.md` do projeto, as guidelines da biblioteca, o `A11Y-DECISIONS.md` — são **decisões prévias**: a fonte da aparência e do comportamento. Este arquivo não as substitui; ele as **avalia**. A ordem é sempre esta:

1. **Buscar.** Antes de desenhar, procure na biblioteca o componente, a variável e o estilo que servem à tarefa, e leia as regras prévias (`DESIGN.md`, guidelines, decisões).
2. **Aplicar como está.** Use o que existe sem trocar token, sem sobrescrever instância e sem recriar componente — cor, tipografia, espaçamento, raio e superfícies (fundos) incluídos. A identidade visual não está em aberto.
3. **Avaliar.** Meça o resultado contra o perfil ativo (Seções 0.1 e 3): pares de contraste, alvos, estados presentes, tipografia.
4. **Avisar.** Para cada decisão prévia que afeta a acessibilidade, diga a **origem** (o componente, o token ou a regra do `DESIGN.md`), a **medida**, o **piso**, a **severidade** (Seção 1) e uma proposta de ajuste — luminância primeiro, na fonte (a biblioteca ou o `DESIGN.md`), nunca na instância. Quando a leitura do critério for discutível (por exemplo, a borda de um campo que também tem rótulo visível), diga a dúvida.
5. **Corrigir só com autorização expressa, e só onde o defeito mora.** Defeito de **uso** — variante errada, override, composição que quebra a ordem de leitura — se corrige no arquivo, depois da autorização, com o guia do componente (Seção 7), e só **o que foi avaliado**. Defeito do **próprio componente** — um botão da biblioteca cuja variante Focus reprova em 3:1 — nunca se corrige no arquivo que o usa, porque isso é override disfarçado. Ele recebe a anotação `Defeito de biblioteca` na instância, entra no relatório como *encaminhado à biblioteca* e é corrigido na biblioteca, por quem é dono dela. Se a pessoa decidir não corrigir uma falha de critério WCAG, isso vira entrada no `EXCEPTIONS.md` (dono, aprovador, prazo). Flexibilizar uma Regra da Casa vai para o `A11Y-DECISIONS.md`.

Sem biblioteca, sem `DESIGN.md` e sem decisões prévias, não há o que preservar: as regras deste arquivo orientam o desenho desde o primeiro frame.

Uma razão que passa nunca justifica sair do sistema, e uma razão que reprova não autoriza sair dele sozinho: acessibilidade e consistência são requisitos distintos, e quem arbitra entre os dois é a pessoa.

## 2.1. Contrato de comportamento no canvas
Todo agente que desenha sob este arquivo **MUST**:

- **Não recriar o que existe.** Componente "acessível" paralelo, token novo ou estilo local no lugar do da biblioteca é violação, mesmo com boa intenção — o caminho é avisar (Seção 2).
- **Calcular, nunca estimar.** Contraste pela fórmula de luminância relativa da WCAG, sobre os valores dos tokens, para cada par que carrega significado — texto, borda de controle, ícone, anel de foco — em cada estado (padrão, hover, foco, erro, desabilitado) e em cada modo (claro, escuro). "Parece suficiente" é evidência fabricada. Onde código da Plugin API puder rodar, rode o [`measure.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/measure.js) sobre a seleção. Ele devolve os pares, os alvos, os espaçamentos e o crescimento do texto como dado, com a razão truncada, nunca arredondada. A checagem de contraste do próprio Figma, no seletor de cor e no Check designs, serve à pessoa, não ao agente. Nenhuma API a expõe, ela não diz qual fundo compara, e o botão de correção automática troca a cor, que é a violação da Seção 2. Ferramenta que oferece corrigir uma cor serve para medir, nunca para corrigir.
- **Conferir os estados que o código vai exigir.** Foco, erro, desabilitado (com o motivo em texto), selecionado e marcado precisam existir como variante ou frame. Se o componente da biblioteca não tem o estado, isso é um aviso da Seção 2: aponte e desenhe o estado só com autorização — ou quando não houver biblioteca. Estado que ninguém desenhou é estado que o dev inventa, e o produto diverge do desenho.
- **Imagem: classificar e rascunhar, e a pessoa confirma.** Pelo teste de remoção ("se eu tirar esta imagem, o que se perde?"), classifique como informativa, funcional ou decorativa e proponha o texto alternativo como rascunho. Declarar uma imagem decorativa é decisão humana, nunca padrão.
- **Mídia: perguntar.** Vídeo ou áudio no layout dispara três perguntas na mesma hora: informa ou só ambienta? tem áudio? legenda e transcrição existem?
- **Conflito entre necessidades: nomear e perguntar.** Quando atender uma necessidade cria barreira para outra (movimento, contraste, densidade), nomeie as duas populações e leve a escolha à pessoa.
- **Deixar a evidência no arquivo, em anotação nativa.** Cada relatório vira **uma anotação** da ferramenta de anotações, na categoria **Accessibility**, presa ao frame avaliado (a tela ou o componente). Achados pontuais e a intenção que o desenho não mostra (Seção 4) vão em anotações nos nós afetados. O chat não é evidência: ele não chega a quem desenvolve. Se a ferramenta de anotações não estiver disponível (plano ou assento), diga isso. Para componente, o lugar reserva é o campo de descrição. Para tela, é um `TEXT` chamado `Relatório A11Y` dentro de um `FRAME` de mesmo nome, ao lado da tela na mesma página e nunca dentro dela. Nunca só o chat.
- **Não declarar o que é do código.** Semântica, leitor de tela, teclado real e testes automatizados não acontecem no canvas: entram no relatório como **requisito para o desenvolvimento**, nunca como verificados.
- **Não se aprovar.** Quem desenhou declara a verificação como autorrelatada, e o status fica no máximo CONDICIONAL até alguém que não desenhou conferir.
- **Registrar decisões e exceções** nos formatos dos templates do A11Y.md ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/EXCEPTIONS.md)). Decisão tomada pelo agente é registrada como do agente — nunca atribuída à pessoa.

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
- **Alvo de toque:** o mínimo do perfil, 24×24 no Standard (SC 2.5.8) e 44×44 no Shield (SC 2.5.5). Abaixo disso, só pelas exceções do critério. No Standard, vale quando um círculo de 24 centrado no alvo não toca outro alvo nem o círculo de outro alvo pequeno. Nos dois perfis, vale quando a mesma ação existe num alvo equivalente que atinge o piso. Regra da Casa: desenhar com 44×44 (48×48 no Shield) e 8px entre alvos vizinhos. Ficar abaixo da Regra da Casa é um achado para relatar, nunca uma falha de WCAG. Meça a caixa do frame interativo, nunca o ícone dentro dele.
- **Foco desenhado** em todo elemento interativo: contorno de pelo menos 2px com 3:1 contra o fundo — contorno, não só sombra, que some no modo de alto contraste — e nunca coberto por cabeçalho ou rodapé fixo. No Shield, vale também o SC 2.4.13 (AAA). O indicador cobre um perímetro de pelo menos 2px, com 3:1 entre o estado com foco e o sem foco, então compare as variantes Focus e Default. Foco mostrado só por mudança de preenchimento não cumpre o contorno pedido acima, e isso entra no relatório.
- **Nada só por hover ou por arrasto:** toda ação tem caminho por toque ou clique e um controle visível. Gesto do aparelho (sacudir, inclinar) tem controle na tela.

### Compreensível
- **Rótulo visível, fora e antes do campo.** Placeholder nunca é rótulo. Formato esperado (por exemplo, DD/MM/AAAA) visível antes de digitar.
- **Erro** em texto, com ícone e cor, perto do campo, dizendo a saída — "Senha incorreta. Tente novamente ou redefina sua senha", não só "Senha incorreta".
- **Linguagem simples:** voz ativa, frase curta, palavra comum, sigla expandida. Link diz para onde leva, e "clique aqui" e "saiba mais" soltos não servem.
- **Consistência:** ajuda e navegação na mesma posição relativa em todas as telas do fluxo, e a mesma função tem o mesmo nome em todo lugar.
- **Fluxo:** nada que a pessoa precise lembrar de uma tela para outra, nada que precise digitar de novo, nenhum CAPTCHA de transcrição, nenhum "digite o 3º e o 7º caractere da senha".

### Tipografia (Regra da Casa†)
- Fonte mínima do perfil. Densidade: 10px só com 7:1 e entrada no `EXCEPTIONS.md`.
- Texto corrido: entrelinha de pelo menos 1,5, espaço depois do parágrafo de pelo menos 2× o tamanho da fonte, cerca de 80 caracteres por linha, alinhado ao início — nunca justificado.

## 4. A intenção que o desenho não mostra: o agente sugere, a pessoa confirma
O canvas não tem campo para semântica, e é aqui que a intenção morre entre o desenho e o código: ninguém escreve. Ao entregar uma tela, o agente **sugere** essa camada como **anotações** na categoria Accessibility, presas aos nós:

- **Ordem de leitura e de foco** — uma anotação no frame da tela com a lista numerada. A ordem proposta sai da estrutura (a ordem do auto layout) conferida contra a leitura visual. Onde as duas divergem, uma anotação no nó diz isso.
- **Títulos e níveis** (H1 a H6) e o **título da tela**.
- **Nome acessível** de todo controle sem texto visível (botão só com ícone). Quando há texto visível, o nome o contém.
- **Papel** quando a aparência engana: card clicável, link que parece botão, abas, switch × checkbox.
- **Texto alternativo** de cada imagem, com a classificação (informativa, funcional, decorativa). Decorativa é decisão humana: o agente pode suspeitar, nunca concluir.
- **Regiões** da tela: cabeçalho, navegação, conteúdo principal, rodapé.
- **Texto dos anúncios** dinâmicos ("12 resultados carregados", "Senha incorreta. Tente novamente ou redefina sua senha").
- **Idioma** de trechos em outra língua.

Regras da sugestão:
- **Toda anotação sugerida começa com o status** `Sugestão do agente — confirmar`. Quando a pessoa confirma ou corrige, o status vira `Confirmado por <nome>, <data>`. Quem desenvolve implementa o que está confirmado; o que ainda é sugestão, pergunta.
- **Não sobrescrever anotação humana.** Se o agente discorda do que a pessoa já anotou, ele acrescenta a divergência e não apaga.
- **Não sugerir o que a regra já decide.** Foco visível ou contraste não são sugestões — são as Seções 2 e 3.
- Enquanto houver sugestão sem confirmação, o relatório fica no máximo CONDICIONAL.

## 5. Entrega
- **Para quem desenha — um resumo curto** em três blocos: o que passou; o que reprova e **de onde vem** (componente, token ou regra do `DESIGN.md`; medida; piso; severidade); o que precisa de decisão humana — incluindo a pergunta "corrijo?" para cada aviso e o número de sugestões da Seção 4 esperando confirmação.
- **Para quem desenvolve — o relatório, duas vezes.** **No arquivo,** como a anotação da Seção 2.1 no frame avaliado, curta: status (no máximo CONDICIONAL), data, versão deste arquivo e do A11Y.md, as contagens (pares medidos e reprovados, alvos, estados que faltam, sugestões esperando confirmação, defeitos de biblioteca) e onde está o relatório completo. **Fora do arquivo,** como `REPORT.md` a partir do [template](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/templates/REPORT.md) deste projeto, com as entradas de `A11Y-DECISIONS.md` e `EXCEPTIONS.md` nos formatos do A11Y.md ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/EXCEPTIONS.md)), entregues junto com o desenho, no ticket, no hand-off ou no repositório. Esses arquivos são o que o agente de código lê sob a *Decision Memory* do A11Y.md. As decisões do desenho chegam ao código como decisões prévias, e uma sugestão da Seção 4 ainda sem confirmação chega como pergunta, nunca como requisito. O relatório termina com a instrução: **implementar seguindo o A11Y.md**. Um relatório por frame avaliado. Uma nova avaliação atualiza os dois em vez de empilhar outro.
- **Pronto para desenvolvimento é um portão.** Uma seção ou frame só é marcado como pronto para desenvolvimento (`devStatus`) com relatório em CONDICIONAL ou melhor, nenhuma sugestão da Seção 4 sem confirmação e nenhuma falha WCAG fora do `EXCEPTIONS.md`.
- **Quando a tarefa criou ou mudou o design system** — além do relatório, a camada de contexto para agentes da Seção 2.2, no próprio componente e nas guidelines da biblioteca.

## 6. Antipadrões no canvas
- **Trocar token, sobrescrever instância ou recriar componente da biblioteca** sem autorização — inclusive para "corrigir" acessibilidade.
- **Corrigir antes de avisar**, ou corrigir além do que foi avaliado.
- **Apresentar sugestão como decisão** — anotação de intenção sem o status `Sugestão do agente — confirmar`.
- **Defeito de biblioteca corrigido no arquivo que a usa** — override disfarçado.
- **`GROUP` em qualquer coisa interativa ou que precise de evidência.**
- **Marcar como pronto para desenvolvimento** sem relatório, com sugestão sem confirmação ou com falha WCAG não registrada.
- **Barra ou ícone de "modo acessível"** como solução — acessibilidade se resolve no desenho, não numa camada por cima.
- **Deixar a evidência só no chat.**
- **Dar o próprio desenho por aprovado.**

## 7. Mapa de guias (carregue só a linha da vez)

| Você está desenhando… | Guia |
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
| escolha ou troca de perfil | [`guide-compliance-profiles.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-compliance-profiles.md) |

## 8. Fontes adicionais (não normativas)
Material de apoio que este arquivo recomenda, mas **não incorpora**. As regras continuam sendo as deste arquivo e do A11Y.md.

- **[Magoo](https://magoo.cc)**, de Marcelo Sales — biblioteca de comportamentos de interação, com perguntas de design por componente e por modo de uso (sem interação, mouse, gestos, teclado, leitor de tela), em português. Boa fonte para quem desenha refletir sobre as decisões que nenhuma regra fecha. Também pode ser consultado por agentes, pelo site ou pelo MCP do projeto ([`@acessibilidade/magoo-mcp`](https://www.npmjs.com/package/@acessibilidade/magoo-mcp)). O próprio Magoo se declara material educativo, não normativo.
- **[Astryx](https://github.com/facebook/astryx)**, da Meta — referência da camada de contexto para agentes da Seção 2.2: documentação de componente como dado tipado, requisitos de acessibilidade por componente (critério, requisito, estados), anatomia na ordem de leitura, apelidos para o agente achar o componente certo e testes de geração julgados por um agente separado.
