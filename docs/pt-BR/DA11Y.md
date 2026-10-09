# DA11Y.md — Acessibilidade como premissa, no desenho de interfaces
> **Versão:** 0.1.0 (rascunho) | **Edição de design do:** A11Y.md 2.3.0, commit `57564be` | **Padrão Alvo:** WCAG 2.2 AA | **Última Atualização:** 2026-10-09

Este arquivo é a **edição de design** do A11Y.md: a mesma lógica e os mesmos números, para quem desenha telas e componentes em software de design (Figma, Penpot, Sketch e equivalentes) — pessoas e agentes. O código continua regido pelo A11Y.md. Os blocos marcados como `compiled` vêm do A11Y.md fixado e **não são editados à mão**.

**Antes de desenhar, leia `references/figma-nodes.md` (deste projeto):** o que cada tipo de nó do Figma pode carregar e onde a acessibilidade cabe — inclusive onde **não** cabe (grupo não aceita anotação).

Profundidade por componente: os guias do A11Y.md, na base `https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/`. Carregue **só** a linha do mapa da Seção 7 que corresponde ao que você está desenhando, e leia o guia como **intenção a traduzir para o canvas**: ignore marcação, ARIA e código; aplique o que é visual e anote o que é intenção (Seção 4).

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

No canvas, a unidade do arquivo vale como a da plataforma: em tela de app, 1 unidade = 1 pt (iOS) ou 1 dp (Android). As metas de toque das plataformas já atendem à Regra da Casa.

## 1. Severidade
<!-- compiled:severity -->
Avalie o impacto de qualquer decisão de design ou implementação seguindo estes níveis:

- 🔴 **CRITICAL:** Falhas de **Operação**. Bloqueia a **Task Completion** ou torna a função inutilizável. **MUST FIX.**
- 🟠 **HIGH:** Falhas de **Percepção e Legibilidade**. Aumenta significativamente a **Taxa de Erro ou Abandono**. **MUST FIX.**
- 🟡 **MEDIUM:** Reduz a **Eficiência e Satisfação**. **SHOULD FIX.**
- 🔵 **LOW:** Impacto **Cosmético ou de Polimento**. **MAY FIX.**
<!-- /compiled:severity -->

Exemplos no canvas: 🔴 ação que só existe por hover ou por arrasto, sem caminho por toque ou clique; 🟠 contraste insuficiente, texto abaixo da fonte mínima do perfil, estado mostrado só por cor.

## 2. O que já existe vem primeiro
O design system da biblioteca ativa e as regras de design já registradas — o `DESIGN.md` do projeto, as guidelines da biblioteca, o `A11Y-DECISIONS.md` — são **decisões prévias**: a fonte da aparência e do comportamento. Este arquivo não as substitui; ele as **avalia**. A ordem é sempre esta:

1. **Buscar.** Antes de desenhar, procure na biblioteca o componente, a variável e o estilo que servem à tarefa, e leia as regras prévias (`DESIGN.md`, guidelines, decisões).
2. **Aplicar como está.** Use o que existe sem trocar token, sem sobrescrever instância e sem recriar componente — cor, tipografia, espaçamento, raio e superfícies (fundos) incluídos. A identidade visual não está em aberto.
3. **Avaliar.** Meça o resultado contra o perfil ativo (Seções 0.1 e 3): pares de contraste, alvos, estados presentes, tipografia.
4. **Avisar.** Para cada decisão prévia que afeta a acessibilidade, diga a **origem** (o componente, o token ou a regra do `DESIGN.md`), a **medida**, o **piso**, a **severidade** (Seção 1) e uma proposta de ajuste — luminância primeiro, na fonte (a biblioteca ou o `DESIGN.md`), nunca na instância. Quando a leitura do critério for discutível (por exemplo, a borda de um campo que também tem rótulo visível), diga a dúvida.
5. **Corrigir só com autorização expressa.** Se a pessoa decidir corrigir, consulte o que for preciso (o guia do componente, Seção 7) e corrija **o que foi avaliado** — nem mais, nem menos. Se ela decidir não corrigir uma falha de critério WCAG, isso vira entrada no `EXCEPTIONS.md` (dono, aprovador, prazo); flexibilizar uma Regra da Casa vai para o `A11Y-DECISIONS.md`.

Sem biblioteca, sem `DESIGN.md` e sem decisões prévias, não há o que preservar: as regras deste arquivo orientam o desenho desde o primeiro frame.

Uma razão que passa nunca justifica sair do sistema, e uma razão que reprova não autoriza sair dele sozinho: acessibilidade e consistência são requisitos distintos, e quem arbitra entre os dois é a pessoa.

## 2.1. Contrato de comportamento no canvas
Todo agente que desenha sob este arquivo **MUST**:

- **Não recriar o que existe.** Componente "acessível" paralelo, token novo ou estilo local no lugar do da biblioteca é violação, mesmo com boa intenção — o caminho é avisar (Seção 2).
- **Calcular, nunca estimar.** Contraste pela fórmula de luminância relativa da WCAG, sobre os valores dos tokens, para cada par que carrega significado — texto, borda de controle, ícone, anel de foco — em cada estado (padrão, hover, foco, erro, desabilitado) e em cada modo (claro, escuro). "Parece suficiente" é evidência fabricada.
- **Conferir os estados que o código vai exigir.** Foco, erro, desabilitado (com o motivo em texto), selecionado e marcado precisam existir como variante ou frame. Se o componente da biblioteca não tem o estado, isso é um aviso da Seção 2: aponte e desenhe o estado só com autorização — ou quando não houver biblioteca. Estado que ninguém desenhou é estado que o dev inventa, e o produto diverge do desenho.
- **Imagem: classificar e rascunhar; a pessoa confirma.** Pelo teste de remoção ("se eu tirar esta imagem, o que se perde?"), classifique como informativa, funcional ou decorativa e proponha o texto alternativo como rascunho. Declarar uma imagem decorativa é decisão humana, nunca padrão.
- **Mídia: perguntar.** Vídeo ou áudio no layout dispara três perguntas na mesma hora: informa ou só ambienta? tem áudio? legenda e transcrição existem?
- **Conflito entre necessidades: nomear e perguntar.** Quando atender uma necessidade cria barreira para outra (movimento, contraste, densidade), nomeie as duas populações e leve a escolha à pessoa.
- **Deixar a evidência no arquivo, em anotação nativa.** Cada relatório vira **uma anotação** da ferramenta de anotações, na categoria **Accessibility**, presa ao frame avaliado (a tela ou o componente). Achados pontuais e a intenção que o desenho não mostra (Seção 4) vão em anotações nos nós afetados. O chat não é evidência: ele não chega a quem desenvolve. Se a ferramenta de anotações não estiver disponível (plano ou assento), diga isso e use a descrição do componente — nunca só o chat.
- **Não declarar o que é do código.** Semântica, leitor de tela, teclado real e testes automatizados não acontecem no canvas: entram no relatório como **requisito para o desenvolvimento**, nunca como verificados.
- **Não se aprovar.** Quem desenhou declara a verificação como autorrelatada, e o status fica no máximo CONDICIONAL até alguém que não desenhou conferir.
- **Registrar decisões e exceções** nos formatos dos templates do A11Y.md (`templates/A11Y-DECISIONS.md`, `templates/EXCEPTIONS.md`, na base acima). Decisão tomada pelo agente é registrada como do agente — nunca atribuída à pessoa.

## 2.2. Quando a tarefa é criar ou mudar o design system
Criar ou alterar componente, variável ou estilo da biblioteca **a pedido** é a orientação expressa da Seção 2: aqui o agente aplica as regras deste arquivo desde o primeiro frame e entrega, junto com o componente, a **camada de contexto para agentes** — o que outro agente precisa ler para usar o componente certo, do jeito certo, sem recriá-lo:

1. **Descrição do componente** (o campo de descrição do componente): o que é, quando usar, quando **não** usar, e os **apelidos** pelos quais alguém pediria por ele ("switch", "toggle", "liga/desliga").
2. **Contrato de acessibilidade como dado**, um item por requisito: nome, categoria (Contraste, Teclado, Semântica, Conteúdo), critério WCAG, requisito (por exemplo, "4.5:1"), estados cobertos e uma descrição que permita a outra pessoa ou agente reproduzir a conferência — com o resultado medido de cada estado em cada modo (passa, reprova, não testado).
3. **Anatomia na ordem de leitura:** camadas nomeadas pelo que são ("Rótulo", "Controle", "Texto de ajuda"), na ordem em que o teclado e o leitor de tela vão percorrer. Nome de camada é evidência para o próximo agente — ele não pode mentir.
4. **Propriedades com nomes que o código reconhece:** a propriedade de estado com valores como Default, Hover, Focus, Disabled e Error; o rótulo como propriedade de texto; nada de "Variant 2".
5. **Ligação com o código**, quando existir: o link de documentação do componente e, se houver, o Code Connect.
6. **Mapa de apelidos da biblioteca**, nas guidelines da biblioteca (JSON): componente → apelidos → papel → estados obrigatórios. É o que faz o próximo agente achar o componente que existe em vez de criar outro.

Tudo curto: o agente que lê paga por cada palavra, e contexto que ninguém consegue ler inteiro não é contexto.

## 3. O que o desenho precisa cumprir

### Perceptível
- **Contraste** pelos pisos do perfil (Seção 0.1). Componentes de interface e gráficos com significado: 3:1 contra o vizinho.
- **Cor nunca sozinha.** Compare as variantes de um estado: se só a cor muda entre "padrão" e "erro", o estado falha. Ícone, texto ou forma acompanham a cor.
- **Gráficos:** cada série tem um segundo canal além da cor (tracejado, marcador, rótulo direto); séries vizinhas com 3:1 entre si.
- **Texto sobre imagem ou vídeo** fica sobre uma camada de contraste (scrim) medida no pior caso.
- **Texto que cresce:** texto que a pessoa precisa ler não tem altura fixa nem truncamento — ele precisa sobreviver a 200% e ao espaçamento escolhido pelo usuário.
- **Movimento:** o que anima tem uma variante de movimento reduzido; movimento automático com mais de 5 segundos tem pausa visível; nada pisca mais de 3 vezes por segundo.

### Operável
- **Alvo de toque:** 24×24 no mínimo (WCAG AA). Abaixo disso, só se um círculo de 24 centrado no alvo não tocar outro alvo nem o círculo de outro alvo pequeno. Regra da Casa: desenhar com 44×44 (48×48 no Shield) e 8px entre alvos vizinhos. Meça a caixa do frame interativo, nunca o ícone dentro dele.
- **Foco desenhado** em todo elemento interativo: contorno de pelo menos 2px com 3:1 contra o fundo — contorno, não só sombra, que some no modo de alto contraste — e nunca coberto por cabeçalho ou rodapé fixo.
- **Nada só por hover ou por arrasto:** toda ação tem caminho por toque ou clique e um controle visível. Gesto do aparelho (sacudir, inclinar) tem controle na tela.

### Compreensível
- **Rótulo visível, fora e antes do campo.** Placeholder nunca é rótulo. Formato esperado (por exemplo, DD/MM/AAAA) visível antes de digitar.
- **Erro** em texto, com ícone e cor, perto do campo, dizendo a saída — "Senha incorreta. Tente novamente ou redefina sua senha", não só "Senha incorreta".
- **Linguagem simples:** voz ativa, frase curta, palavra comum, sigla expandida. Link diz para onde leva; "clique aqui" e "saiba mais" soltos não servem.
- **Consistência:** ajuda e navegação na mesma posição relativa em todas as telas do fluxo; a mesma função tem o mesmo nome em todo lugar.
- **Fluxo:** nada que a pessoa precise lembrar de uma tela para outra, nada que precise digitar de novo, nenhum CAPTCHA de transcrição, nenhum "digite o 3º e o 7º caractere da senha".

### Tipografia (Regra da Casa†)
- Fonte mínima do perfil. Densidade: 10px só com 7:1 e entrada no `EXCEPTIONS.md`.
- Texto corrido: entrelinha de pelo menos 1,5, espaço depois do parágrafo de pelo menos 2× o tamanho da fonte, cerca de 80 caracteres por linha, alinhado ao início — nunca justificado.

## 4. A intenção que o desenho não mostra: o agente sugere, a pessoa confirma
O canvas não tem campo para semântica, e é aqui que a intenção morre entre o desenho e o código: ninguém escreve. Ao entregar uma tela, o agente **sugere** essa camada como **anotações** na categoria Accessibility, presas aos nós:

- **Ordem de leitura e de foco** — uma anotação no frame da tela com a lista numerada. A ordem proposta sai da estrutura (a ordem do auto layout) conferida contra a leitura visual; onde as duas divergem, uma anotação no nó diz isso.
- **Títulos e níveis** (H1 a H6) e o **título da tela**.
- **Nome acessível** de todo controle sem texto visível (botão só com ícone); quando há texto visível, o nome o contém.
- **Papel** quando a aparência engana: card clicável, link que parece botão, abas, switch × checkbox.
- **Texto alternativo** de cada imagem, com a classificação (informativa, funcional, decorativa). Decorativa é decisão humana: o agente pode suspeitar, nunca concluir.
- **Regiões** da tela: cabeçalho, navegação, conteúdo principal, rodapé.
- **Texto dos anúncios** dinâmicos ("12 resultados carregados", "Senha incorreta. Tente novamente ou redefina sua senha").
- **Idioma** de trechos em outra língua.

Regras da sugestão:
- **Toda anotação sugerida começa com o status** `Sugestão do agente — confirmar`. Quando a pessoa confirma ou corrige, o status vira `Confirmado por <nome>, <data>`. Quem desenvolve implementa o que está confirmado; o que ainda é sugestão, pergunta.
- **Não sobrescrever anotação humana.** Se o agente discorda do que a pessoa já anotou, ele acrescenta a divergência; não apaga.
- **Não sugerir o que a regra já decide.** Foco visível ou contraste não são sugestões — são as Seções 2 e 3.
- Enquanto houver sugestão sem confirmação, o relatório fica no máximo CONDICIONAL.

## 5. Entrega
- **Para quem desenha — um resumo curto** em três blocos: o que passou; o que reprova e **de onde vem** (componente, token ou regra do `DESIGN.md`; medida; piso; severidade); o que precisa de decisão humana — incluindo a pergunta "corrijo?" para cada aviso e o número de sugestões da Seção 4 esperando confirmação.
- **Para quem desenvolve — o relatório como anotação** (categoria Accessibility, em markdown) no frame avaliado, a partir de `templates/REPORT.md`: status (no máximo CONDICIONAL), versão deste arquivo e do A11Y.md, tabela de pares medidos, alvos, estados desenhados, intenção anotada, defeitos de componente encaminhados à biblioteca e o que fica para o código, com a instrução: **implementar seguindo o A11Y.md**. Um relatório por frame avaliado; uma nova avaliação atualiza a anotação existente em vez de empilhar outra.
- **Quando a tarefa criou ou mudou o design system** — além do relatório, a camada de contexto para agentes da Seção 2.2, no próprio componente e nas guidelines da biblioteca.

## 6. Antipadrões no canvas
- **Trocar token, sobrescrever instância ou recriar componente da biblioteca** sem autorização — inclusive para "corrigir" acessibilidade.
- **Corrigir antes de avisar**, ou corrigir além do que foi avaliado.
- **Apresentar sugestão como decisão** — anotação de intenção sem o status `Sugestão do agente — confirmar`.
- **Placeholder como rótulo.**
- **Estado só por cor.**
- **Texto sobre imagem ou vídeo sem scrim medido.**
- **Barra ou ícone de "modo acessível"** como solução — acessibilidade se resolve no desenho, não numa camada por cima.
- **Deixar a evidência só no chat.**
- **Dar o próprio desenho por aprovado.**

## 7. Mapa de guias (carregue só a linha da vez)

| Você está desenhando… | Guia (na base do topo) |
| :--- | :--- |
| qualquer coisa no canvas — tipos de nó, auto layout, anotações, medidas | `references/figma-nodes.md` (deste projeto, não da base do topo) |
| botão, CTA, botão só com ícone | `references/guide-buttons.md` |
| formulário, campo, mensagem de erro | `references/guide-forms.md` |
| checkbox, radio, switch, slider, select, controle desabilitado | `references/guide-form-controls.md` |
| login, cadastro, fluxo em etapas, limite de tempo, checkout, microcopy | `references/guide-cognitive.md` |
| modal, diálogo, gaveta, confirmação | `references/guide-modals.md` |
| banner de cookies ou consentimento | `references/guide-consent-banners.md` |
| menu, cabeçalho, navegação, títulos da página | `references/guide-navigation.md` |
| tooltip, popover | `references/guide-tooltips-popovers.md` |
| toast, snackbar, alerta | `references/guide-toasts-notifications.md` |
| skeleton, carregamento, animação de entrada | `references/guide-loading-skeleton.md` |
| carrossel, banner rotativo | `references/guide-carousels-sliders.md` |
| arrastar e soltar, reordenar, kanban | `references/guide-drag-drop.md` |
| feed, scroll infinito, "carregar mais" | `references/guide-infinite-scroll.md` |
| imagem, ícone, ilustração, avatar | `references/guide-images.md` |
| vídeo, áudio, vídeo de fundo, parallax | `references/guide-media.md` |
| gráfico, dashboard, KPI | `references/guide-charts.md` |
| campo de data, calendário | `references/guide-datepicker.md` |
| mapa, localizador | `references/guide-maps.md` |
| chat, assistente, resposta gerada | `references/guide-generative-ui.md` |
| cor, paleta, tokens, tema | `references/guide-visual-perception.md` |
| breakpoint, zoom, layout responsivo, alvo de toque | `references/guide-responsive-mobile.md` |
| tela de app iOS ou Android, ou app para público brasileiro | `references/guide-platform-native.md` |
| público brasileiro, Libras | `references/guide-sign-language-br.md` |
| escolha ou troca de perfil | `references/guide-compliance-profiles.md` |

## 8. Fontes adicionais (não normativas)
Material de apoio que este arquivo recomenda, mas **não incorpora**. As regras continuam sendo as deste arquivo e do A11Y.md.

- **[Magoo](https://magoo.cc)**, de Marcelo Sales — biblioteca de comportamentos de interação, com perguntas de design por componente e por modo de uso (sem interação, mouse, gestos, teclado, leitor de tela), em português. Boa fonte para quem desenha refletir sobre as decisões que nenhuma regra fecha. Também pode ser consultado por agentes, pelo site ou pelo MCP do projeto ([`@acessibilidade/magoo-mcp`](https://www.npmjs.com/package/@acessibilidade/magoo-mcp)). O próprio Magoo se declara material educativo, não normativo.
- **[Astryx](https://github.com/facebook/astryx)**, da Meta — referência da camada de contexto para agentes da Seção 2.2: documentação de componente como dado tipado, requisitos de acessibilidade por componente (critério, requisito, estados), anatomia na ordem de leitura, apelidos para o agente achar o componente certo e testes de geração julgados por um agente separado.
