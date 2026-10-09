# Controles de formulário no canvas — checkbox, radio, switch, slider, select e desabilitado

> **Escopo:** checkbox, grupo de radio, switch, slider e o select fechado, e o estado desabilitado que todos eles têm, descritos em nós do Figma. Rótulo, texto de ajuda e erro estão no [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md). O select com busca está no [`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-autocomplete.md).
> **Traduz:** o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) do A11Y.md, fixado no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

Escolha o controle pelo que ele faz, nunca pela forma (SC 1.3.1). Uma escolha entre várias é um grupo de radio. Opções de sim ou não independentes são checkboxes. Uma configuração que vale na hora é um switch. Um valor dentro de uma faixa é um slider com um campo numérico ao lado. Uma opção de uma lista é um select.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Controle | `COMPONENT_SET` com `State` e uma propriedade de valor (`Checked`, `Selected`, `On`), e cada uso é uma `INSTANCE` | controle que falta na biblioteca é aviso (Seção 2 do DA11Y.md), e só se desenha com autorização |
| Linha (checkbox, radio, switch) | `COMPONENT` com auto layout horizontal: Controle, Rótulo | **o rótulo faz parte do alvo**. Tocar no texto alterna o controle, então a caixa a medir é o frame da linha (SC 2.5.8) |
| Caixa, anel, trilha | `FRAME`, `RECTANGLE` ou `ELLIPSE` dentro da linha | a borda ou o preenchimento chega a 3:1 (Seção 3) |
| Marca (check, ponto, botão deslizante) | `VECTOR` ou `INSTANCE` de ícone, que aparece conforme a variante de valor | é o sinal que não depende de cor (SC 1.4.1) |
| Grupo de opções | `FRAME` com auto layout vertical e um `TEXT` com o nome do grupo em primeiro lugar | o nome do grupo é lido antes da primeira opção. Nunca um `GROUP` |
| Slider | `COMPONENT` com Rótulo, `TEXT` do valor, Trilha, `FRAME` do botão deslizante, e botões de passo ou um campo numérico | o valor atual aparece em texto |
| Select fechado | o campo da biblioteca: Rótulo, Caixa com o Valor e uma `INSTANCE` de ícone de seta | o rótulo fica fora da caixa, como no [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md). Só o estado fechado recebe estilo, porque a lista aberta é da plataforma |
| Motivo do desabilitado | `TEXT` ao lado do controle | texto visível, no piso de texto do perfil |

## 2. Estados que o componente precisa ter

| Controle | Propriedade de valor | `State` |
| :--- | :--- | :--- |
| Checkbox | `Checked`: False, True, e Indeterminate quando um pai resume os filhos | Default, Focus, Disabled, e Error quando a resposta é obrigatória |
| Radio | `Selected`: False, True | Default, Focus, Disabled. O grupo tem Error quando a resposta é obrigatória |
| Switch | `On`: False, True | Default, Focus, Disabled |
| Slider | o valor, mostrado em texto | Default, Focus no botão deslizante, Disabled |
| Select | o valor escolhido | os estados do campo de texto (Seção 2 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md)) |

Estado que falta na biblioteca é aviso (Seção 2 do DA11Y.md). Aponte a falta e desenhe o estado só com autorização.

- **Todo valor aparece sem depender de cor** (SC 1.4.1). Compare as variantes. Checked tem uma marca, e Indeterminate tem uma marca própria. O radio selecionado tem um ponto preenchido, um check ou um rótulo mais forte. Ligado e desligado mudam a posição do botão deslizante e têm um texto ou um ícone. Se só o preenchimento muda, o estado falha.
- **Foco.** Um contorno de pelo menos 2px com 3:1 contra a cor vizinha, feito com `strokes` e `strokeWeight`. Sombra em `effects` sozinha não conta, porque some no modo de alto contraste.
- **Desabilitado.** O controle desabilitado é isento de contraste (componente inativo, SC 1.4.3 e 1.4.11). O cinza sozinho não diz o porquê (SC 1.4.1), então um texto visível dá o motivo, e esse texto não é isento.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto do rótulo, do valor e do motivo | o `fills` do `TEXT` contra o preenchimento do ancestral mais próximo que tenha um. Em `State=Disabled`, só o texto do motivo | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| Caixa, anel, trilha e botão deslizante | `strokes` ou `fills` contra a cor vizinha, em cada variante de valor | 3:1 (SC 1.4.11). A trilha do switch chega lá ligada e desligada |
| Marca | o `fills` da marca contra a caixa onde ela fica | 3:1 (gráfico com significado) |
| Valor além da cor | as variantes de valor lado a lado | muda uma marca, uma forma ou uma posição, e nunca só o preenchimento |
| Foco | o `strokes` e o `strokeWeight` da variante Focus contra a cor vizinha | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7) |
| Alvo | `width`, `height`, `minWidth` e `minHeight` do frame da linha e do frame do botão deslizante | 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` entre as opções de um grupo | 8px entre alvos vizinhos (Regra da Casa†). Menos que isso é aviso, nunca falha |
| Texto que cresce | `textAutoResize` dos rótulos e `layoutSizingVertical` da linha | `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de uma linha `HUG`. `TRUNCATE`, `maxLines` ou altura `FIXED` cortam o rótulo no zoom de 200% |
| Tamanho da fonte | `fontSize` dos rótulos e dos valores | 12px no Standard, 14px no Shield |
| Slider sem arrastar | `reactions` da trilha, do botão deslizante e dos botões de passo | um `ON_CLICK` ou `ON_PRESS` na trilha ou nos botões de passo muda o valor. Valor que só muda por `ON_DRAG` falha no SC 2.5.7 |
| Select que age sozinho | `reactions` das opções | escolher uma opção nunca navega nem envia o formulário. Isso espera um botão (SC 3.2.2) |

## 4. O que vira anotação

Cada item é uma anotação na categoria **Accessibility**, na instância do controle ou no frame do grupo, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Nome.** O rótulo visível é o nome. O nome de um grupo é o texto com o nome do grupo, lido uma vez antes da primeira opção.
- **Papel, quando a aparência engana.** Switch ou checkbox (Seção 4 do DA11Y.md). Um liga e desliga que espera um botão Salvar é checkbox, seja qual for a forma.
- **Valor inicial.** Qual opção começa selecionada, ou nenhuma quando a resposta importa (Seção 5).
- **Indeterminado.** Quais filhos o checkbox pai resume.
- **Slider.** Mínimo, máximo, passo e passo maior, e o significado quando o número sozinho não diz nada: "Médio" numa escala de qualidade de 1 a 3, "14:30" num horário. Quando há um campo numérico ao lado, os dois estão ligados ao mesmo valor.
- **Select.** As opções, o nome de cada seção quando a lista tem seções, e um nome de verdade para a escolha em branco ("Sem preferência").
- **Qual desabilitado.** Fora da ordem de foco, quando o controle de fato não pode ser usado agora. Ou ainda alcançável, para a pessoa encontrar o controle e ouvir o motivo.

Fixe na anotação o valor medido (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)). No frame da linha e no botão deslizante, fixe `minWidth` e `minHeight`. Na caixa ou na trilha, fixe `strokes` ou `fills` com a razão medida. No rótulo, fixe `fills` e `fontSize`.

```markdown
**Sugestão do agente — confirmar**
Grupo de radio "Forma de pagamento" · nome lido antes da primeira opção
Opções: Cartão, Transferência, Dinheiro · nenhuma selecionada no início · obrigatório
Erro (State=Error): "Escolha uma forma de pagamento"
```

## 5. As regras de cada controle

- **Checkbox.** Só para opções independentes. Se escolher uma precisa desmarcar as outras, é um grupo de radio.
- **Grupo de radio.** Nenhuma opção vem marcada quando a resposta importa, como num consentimento ou numa forma de pagamento. A pessoa escolhe, e o formulário avisa quando ela não escolheu (SC 3.3.1).
- **Switch.** A mudança vale na hora, sem botão Salvar e sem confirmação. Se precisa de um dos dois, é checkbox. O rótulo dá nome à configuração, e nunca ao estado nem à ação. "Notificações" continua "Notificações" com o switch ligado ou desligado. Um rótulo que vira "Desligar" é anunciado como "Desligar, switch, ligado" (SC 4.1.2).
- **Slider.** Arrastar é atalho (SC 2.5.7). Quando o valor exato importa, como um preço, uma dose ou um intervalo de datas, um campo numérico fica ao lado do slider (Regra da Casa†).
- **Select.** Uma opção de placeholder ("Escolha um país") não é rótulo, porque ela some quando um valor é escolhido. Busca, multisseleção com chips ou opções com ícone fazem dele um combobox ([`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-autocomplete.md)), e a decisão de deixar o select nativo vai para o [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md).

## 6. Quando a tarefa cria ou muda um controle no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada a cada controle:

- **Descrição**, com quando usar, quando não usar e os apelidos. Para o switch: "Switch. Use para uma configuração que vale na hora. Não use quando a mudança precisa de Salvar ou de confirmação (use Checkbox). Apelidos: switch, toggle, liga/desliga."
- **Propriedades:** `State` (VARIANT), o valor como VARIANT (`Checked`, `Selected`, `On`), `Label` e `Help` (TEXT).
- **Camadas com o nome do que são, na ordem de leitura.** Numa linha, Control e Label. Num grupo, Group label e depois as opções. Num slider, Label, Value, Track e Thumb.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, com o resultado medido de cada valor e de cada estado em cada modo.

## 7. Antipadrões no canvas

- **Controle escolhido pela forma**, como um switch que espera Salvar ou checkboxes que desmarcam umas às outras.
- **Marcado, selecionado ou ligado mostrado só pela cor do preenchimento.**
- **Alvo que é só a caixa**, com o rótulo fora do frame da linha.
- **Rótulo de switch que muda com o estado.**
- **Opção pré-marcada** quando a resposta importa.
- **Slider que só muda arrastando**, ou sem o valor em texto.
- **Opção de placeholder como rótulo do select**, ou opção que navega ou envia sozinha.

## 8. O que fica para o código

Os controles nativos, os papéis e os estados deles, o nome do grupo, as teclas, os valores do slider e o estado desabilitado são implementados seguindo o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) do A11Y.md. Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
