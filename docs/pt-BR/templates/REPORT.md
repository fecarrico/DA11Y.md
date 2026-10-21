# Relatório de Acessibilidade do Design — [tela ou componente]

> **DA11Y.md:** [versão] · **A11Y.md:** [versão], commit `[hash]` · **Perfil:** [Shield | Standard | Launchpad] · **Plataforma:** [web | app iOS | app Android], pela [evidência] · **Data:** [AAAA-MM-DD]
> **Arquivo e nó:** [nome do arquivo · id do nó ou link] · **Modos avaliados:** [claro, escuro]
> **Avaliado por:** [agente e modelo, ou pessoa] — **autorrelatado** · **Status:** [CONDICIONAL | REPROVADO] — APROVADO só depois que alguém que não desenhou confere

Este relatório sai do arquivo junto com o desenho e é lido por quem desenvolve. Nada aqui foi verificado no produto construído. Semântica, teclado e leitor de tela são requisitos para o desenvolvimento (Seção 7).

## 1. Pares medidos

Razões calculadas pela fórmula da WCAG sobre o valor resolvido do token, truncadas, nunca arredondadas.

| Elemento | Par (frente / fundo) | Modo | Tokens | Razão | Piso | Resultado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [Rótulo] | [#hex / #hex] | [claro] | [text/primary / surface/default] | [4.54:1] | [4.5:1] | [passa] |

## 2. Alvos e espaçamento

| Elemento | Caixa (l×a) | Distância dos vizinhos | Piso | Resultado ou exceção |
| :--- | :--- | :--- | :--- | :--- |
| [Mostrar senha] | [44×44] | [8] | [24×24 · regra do A11Y.md 44] | [passa] |

## 3. Estados

| Componente | Default | Focus | Error | Disabled | [outro] | Faltando |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [Campo de texto] | [✓] | [✓] | [✓] | [✓] | [—] | [nenhum] |

## 4. Intenção: o que saiu da estrutura e o que espera decisão (Seção 4 do DA11Y.md)

| Ordem | Nó | Leitura e intenção | Status |
| :--- | :--- | :--- | :--- |
| [2] | [Campo E-mail] | [🔊 campo "E-mail", obrigatório · preenchimento: email · teclado: e-mail] | [proposta] |

Marcas, como no card do handoff: `🔊` lido · `📢` anunciado · `❓` escolha de estrutura em aberto. Também entram aqui o nível de título, as regiões e o idioma. A ordem de foco do teclado vai na Seção 7.

Status: da estrutura (chega ao código como requisito) · proposta, no card do handoff ou na categoria `Proposta` (chega ao código como pergunta) · `✓ <nome>` (decidido).

Numa avaliação, a leitura entra aqui como rascunho, e não há handoff (Seção 4 do DA11Y.md). Pergunta de conteúdo ou de produto, como um valor que parece errado ou uma data que não bate, vai na Seção 5 como achado, nunca como `❓`.

### Não lidos

O que a leitura deixou de fora. Cada item é proposta até a pessoa confirmar, e o código o esconde do leitor de tela (`alt=""` na web, fora da árvore de acessibilidade no app).

| Nó | O que é | Por que não é lido | Status |
| :--- | :--- | :--- | :--- |
| [Ícone do card] | [ícone de categoria] | [redundante com o texto "Estacionamento"] | [proposta · `✓ <nome>`] |

## 5. Achados e decisões prévias

O número é o do achado na página de relatório e na anotação `Corrigir aqui` dele (`· achado 1`), para os três lugares nomearem o mesmo achado. Uma sequência só: `Corrigir aqui` primeiro, depois os erros do design system da Seção 6, depois as perguntas abertas.

| # | Achado | Origem | Medida | Piso | Severidade | Decisão |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [1] | [Borda do campo] | [token border/default] | [2.9:1] | [3:1, discutível com rótulo visível] | [🟡] | [esperando a pessoa · corrigido com autorização · EXCEPTIONS.md · A11Y-DECISIONS.md] |

## 6. Erros do design system, encaminhados

| # | Componente | Variante ou estado | Defeito | Encaminhado para |
| :--- | :--- | :--- | :--- | :--- |
| [2] | [Button / Primary] | [Focus] | [contorno em 1.8:1 contra a superfície] | [dono da biblioteca · link da issue] |

## 7. Para o desenvolvimento — requisitos, não verificados aqui

Implementar seguindo o A11Y.md. Os cenários de verificação de cada guia de componente rodam no produto construído.

- [Rótulo ligado ao campo. Ajuda e erro ligados por descrição. Erro anunciado quando aparece]
- [Preenchimento automático: email, current-password]
- [Ordem de foco do teclado: E-mail → Senha → Entrar]
- [Foco na abertura da tela: o título. Controles da plataforma com o foco do sistema]

## 8. Não medido

| O quê | Por quê | Quem confere |
| :--- | :--- | :--- |
| [Texto sobre a imagem de capa] | [preenchimento de imagem, sem cor de fundo única] | [designer, no pior quadro] |
