# Telas de app no canvas — iOS, Android e a camada mobile do Brasil

> **Escopo:** telas de app iOS e Android em nós do Figma. Isso inclui a unidade, os alvos, o texto que acompanha a escala de fonte do sistema, os gestos e as ações personalizadas deles, a intenção anotada em palavras de plataforma e o que a ABNT NBR 17060 decide no canvas para o público brasileiro. Fica aqui só o que se decide no canvas, porque as APIs das plataformas ficam com o código.
> **Traduz:** o [`guide-platform-native.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-platform-native.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Onde isso aparece nos nós

| O quê | Nó e propriedade | Regra |
| :--- | :--- | :--- |
| Tela de app | `FRAME` filho direto da página | 1 unidade = 1 pt no iOS e 1 dp no Android (Seção 0.1 do DA11Y.md) |
| Barra de status do sistema (hora, bateria) | o `FRAME` ou a `INSTANCE` no topo da tela, acima da barra de navegação | fora da leitura, da medida e das anotações: é do sistema, não da tela |
| Barra de navegação | o `FRAME` ou a `INSTANCE` com Voltar, o título e as ações da tela | lida nesta ordem: Voltar, o título como `título`, as ações da direita. O título grande do conteúdo, quando existe, é outro `título`, logo depois |
| Controle da plataforma (botão, switch, alerta) | `INSTANCE` do componente da biblioteca que representa esse controle | o controle nativo já traz semântica, foco e alvo. Controle desenhado do zero precisa cumprir o contrato inteiro |
| Alvo | a caixa do `FRAME` ou da `INSTANCE` interativa | nunca o ícone dentro dela |
| Texto | `TEXT` com `textAutoResize`, `maxLines` e `textStyleId` | cresce com o tamanho de fonte do sistema |
| Ação atrás de um gesto | uma variante que revela a ação (linha deslizada, menu aberto) ou uma reação `ON_DRAG` | precisa de ação personalizada e, quando é essencial, de um caminho visível (Seção 5) |
| Movimento | `animations` e `timelines` | uma variante de movimento reduzido, para a opção de movimento reduzido do sistema |
| Cronômetro | uma reação `AFTER_TIMEOUT` | dá para desligar, ajustar ou estender (SC 2.2.1), ver [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-cognitive.md) |

## 2. Estados que a tela precisa ter

- **Foco** em todo elemento interativo, porque o teclado externo e o controle por acionador (switch) percorrem a mesma ordem.
- **O estado revelado de cada gesto** (linha deslizada, menu de toque longo aberto), para cada ação ter um nome visível que possa ser anotado.

Estado que falta na biblioteca é aviso da Seção 2. Aponte e desenhe só com autorização.

## 3. O que medir

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Alvo | `width`, `height`, `minWidth` e `minHeight` da caixa interativa | a meta da plataforma, 44×44 no iOS e 48×48 no Android, que atende à Regra da Casa†. Controle desenhado do zero abaixo disso ainda cumpre o piso do perfil (Seção 3 do DA11Y.md) |
| Texto no maior tamanho do sistema | `textAutoResize`, `maxLines`, `textTruncation` e o `layoutSizingVertical` do contêiner | o texto cresce em altura dentro de contêineres `HUG`. `TRUNCATE`, `maxLines` ou altura `FIXED` cortam o texto ou fazem o texto se sobrepor |
| Contraste | os pares de cada modo, inclusive o de contraste elevado quando o arquivo tem esse modo | [`figma-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-visual-perception.md) |
| Ação só por gesto | reações `ON_DRAG` e as variantes que um gesto revela | cada ação também tem uma ação personalizada e, quando é essencial, um caminho visível (Seção 5, SC 2.5.1 e 2.5.7) |

## 4. O que vira anotação

Numa tela de app, a anotação diz a intenção em palavras simples, como "título", "anunciado" e "lido junto". Ela nunca traz ARIA nem pixel de CSS, porque o código copiaria um recurso da web que a plataforma não tem, e isso é 🔴 CRITICAL.

**Na anotação do elemento**, com a leitura da Seção 4 do DA11Y.md no formato curto da Seção 5:

- **Títulos** e o título da tela, como `título`, sem nível. O título da barra de navegação é um deles, e a barra de status fica fora da lista (Seção 1).
- **O nome** de todo controle sem texto visível. O nome contém o texto visível (SC 2.5.3), e um verbo que a tela não mostra ("Abrir …") não entra no nome.
- **Lido junto.** Um rótulo e o valor dele que são lidos de uma vez ("Saldo, 120 reais").
- **Os anúncios** (toasts, resultados que chegam depois, erros de validação), com o texto exato.
- **Ações personalizadas** de cada elemento (Seção 5).

**No relatório**, como requisito para o desenvolvimento:

- **Foco ou anúncio na abertura.** Onde o foco cai, ou o que é anunciado, quando a tela abre. Por padrão, o título da tela.
- **Foco de cada controle.** O controle da plataforma usa o foco do sistema. O controle desenhado do zero precisa do estado Focus desenhado (Seção 3 do DA11Y.md).
- **Modal.** O que ele bloqueia na tela de trás.

Fixe `minWidth` e `minHeight` em cada alvo, e `fontSize` e `textStyleId` nos textos.

```markdown
4 · linha "Fatura de março"
🔊 "Fatura de março, 120 reais, vence dia 10" · ações "Arquivar", "Excluir"
📢 depois de Arquivar: "Fatura arquivada"
```

## 5. Gestos e ações personalizadas

Uma ação que só existe como gesto (deslizar, toque longo, arrastar) não existe para quem usa leitor de tela, controle por acionador ou controle por voz.

1. **Liste toda ação que só se alcança por gesto** como ação personalizada (custom action), na anotação do elemento. O toque na linha continua sendo um toque. O que entra na lista são as consequências do deslize, como arquivar, excluir e fixar.
2. **Cada rótulo** é curto, começa pelo verbo e repete o texto que a interface mostra para a mesma ação em outro lugar (SC 2.5.3).
3. **Sem duplicar.** Se os botões da linha recebem foco cada um, diga se eles viram ações personalizadas no lugar disso. As duas coisas juntas fazem toda ação ser anunciada duas vezes.
4. **Complemento, nunca esconderijo.** Uma ação essencial à tarefa também tem um caminho visível para todo mundo, como um menu ou uma tela de detalhes. Confira se esse caminho está desenhado. Se não está, isso é aviso.

## 6. Brasil — ABNT NBR 17060 no canvas

Quando o produto chega ao público brasileiro num celular ou tablet, a ABNT NBR 17060:2022 fica ao lado da WCAG. Isso vale para app nativo, híbrido ou web app, e também para site aberto no celular. Um desenho que cumpre este padrão no perfil dele já cumpre quase todos os itens. O canvas decide isto:

- **Rótulo visível antes do campo** (5.1.1.11). O rótulo fica acima ou à esquerda do campo, e placeholder nunca é rótulo. Ver [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md).
- **Etapas em sequência** (5.1.1.16). Um fluxo em etapas mostra o total e a posição atual ("Etapa 2 de 4"). Uma lista paginada mostra o intervalo e o total ("11–20 de 57 itens"). A etapa atual se diferencia por mais do que a cor.
- **Configurações de acessibilidade** (5.1.2.1). Texto que cresce e variante de movimento reduzido, porque a fonte, o contraste e o movimento escolhidos no sistema são respeitados.
- **Limites de tempo** (5.1.2.6). Todo cronômetro que não é essencial, inclusive em janela de chat, segue o SC 2.2.1.
- **Conteúdo que pisca** (5.1.1.25). Nada pisca mais de três vezes por segundo, e conteúdo que pode piscar tem um aviso desenhado antes de tocar. Ver [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-media.md).
- **Alvo** (5.1.2.13, recomendação). A norma recomenda 44×44, e as metas das plataformas já passam disso.
- **Sem travar na navegação sequencial** (5.1.2.14). A anotação da ordem de foco alcança todo controle. O teste em si é humano.
- **Mapeamento.** No Standard, vale todo requisito da norma. No Shield, valem todos os requisitos e todas as recomendações, e cada recomendação não atendida tem justificativa no [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/EXCEPTIONS.md). A anotação do relatório cita a NBR 17060 ao lado do perfil. O agente nunca declara conformidade com a norma. Quem declara é o validador humano, a partir do relatório.

## 7. Antipadrões no canvas

- **ARIA ou pixel de CSS** nas anotações de uma tela de app.
- **Ação que só existe como deslize, toque longo ou arraste.**
- **A mesma ação anotada como botão e como ação personalizada.**
- **Controle desenhado do zero** quando a biblioteca tem o da própria plataforma.
- **Texto numa caixa `FIXED`** que não cresce com o tamanho de fonte do sistema.
- **Uma fileira de pontos como único indicador de etapa**, sem posição e sem total em texto.
- **Declarar conformidade com a NBR 17060** no relatório.

## 8. O que fica para o código

As APIs das plataformas são implementadas seguindo o [`guide-platform-native.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-platform-native.md) do A11Y.md. A verificação desse guia roda no app construído, feita por uma pessoa, e entra no relatório como requisito para o desenvolvimento.
