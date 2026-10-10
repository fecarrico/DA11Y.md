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
| Marca (check, ponto, botão deslizante) | `VECTOR` ou `INSTANCE` de ícone, que aparece conforme a variante de valor | é o sinal que não depende de cor (SC 1.4.1) |
| Grupo de opções | `FRAME` com auto layout vertical e um `TEXT` com o nome do grupo em primeiro lugar, nunca um `GROUP` | o nome do grupo é lido antes da primeira opção |
| Slider | `COMPONENT` com Rótulo, `TEXT` do valor, Trilha, `FRAME` do botão deslizante, e botões de passo ou um campo numérico | o valor atual aparece em texto |
| Select fechado | o campo da biblioteca: Rótulo, Caixa com o Valor e uma `INSTANCE` de ícone de seta | o rótulo fica fora da caixa ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md)). Só o estado fechado recebe estilo, porque a lista aberta é da plataforma |

## 2. Estados que o componente precisa ter

| Controle | Propriedade de valor | `State` |
| :--- | :--- | :--- |
| Checkbox | `Checked`: False, True, e Indeterminate quando um pai resume os filhos | Default, Focus, Disabled, e Error quando a resposta é obrigatória |
| Radio | `Selected`: False, True | Default, Focus, Disabled. O grupo tem Error quando a resposta é obrigatória |
| Switch | `On`: False, True | Default, Focus, Disabled |
| Slider | o valor, mostrado em texto | Default, Focus no botão deslizante, Disabled |
| Select | o valor escolhido | os estados do campo de texto (Seção 2 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-forms.md)) |

- **Todo valor aparece sem depender de cor** (SC 1.4.1). Compare as variantes de valor. Checked tem uma marca, e Indeterminate tem uma marca própria. O radio selecionado tem um ponto preenchido, um check ou um rótulo mais forte. Ligado e desligado mudam a posição do botão deslizante e têm um texto ou um ícone. Se só o preenchimento muda, o estado falha.
- **Desabilitado.** É isento de contraste por ser componente inativo (SC 1.4.3 e 1.4.11), mas o cinza sozinho não diz o porquê (SC 1.4.1). Um `TEXT` visível ao lado do controle dá o motivo, e esse texto não é isento.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Caixa, anel, trilha e botão deslizante | `strokes` ou `fills` contra a cor vizinha, em cada variante de valor | 3:1 (SC 1.4.11). A trilha do switch chega lá ligada e desligada |
| Marca | o `fills` da marca contra a caixa onde ela fica | 3:1 (gráfico com significado) |
| Alvo | `minWidth` e `minHeight` do frame da linha, com o rótulo dentro, e do frame do botão deslizante | o piso do perfil (Seção 3 do DA11Y.md) |
| Slider sem arrastar | `reactions` da trilha, do botão deslizante e dos botões de passo | um `ON_CLICK` ou `ON_PRESS` na trilha ou nos botões de passo muda o valor. Valor que só muda por `ON_DRAG` falha no SC 2.5.7 |
| Select que age sozinho | `reactions` das opções | escolher uma opção nunca navega nem envia o formulário. Isso espera um botão (SC 3.2.2) |

## 4. O que vira anotação

Na instância do controle ou no frame do grupo:

- **Nome.** O rótulo visível. O nome de um grupo é o texto com o nome do grupo, lido uma vez antes da primeira opção.
- **Papel, quando a aparência engana.** Um liga e desliga que espera um botão Salvar é checkbox, seja qual for a forma.
- **Valor inicial.** Qual opção começa selecionada, ou nenhuma quando a resposta importa (Seção 5).
- **Indeterminado.** Quais filhos o checkbox pai resume.
- **Slider.** Mínimo, máximo, passo e passo maior, e o significado quando o número sozinho não diz nada: "Médio" numa escala de qualidade de 1 a 3, "14:30" num horário. O campo numérico ao lado está ligado ao mesmo valor.
- **Select.** As opções, o nome de cada seção quando a lista tem seções, e um nome de verdade para a escolha em branco ("Sem preferência").
- **Qual desabilitado.** Fora da ordem de foco, ou ainda alcançável para a pessoa ouvir o motivo.

Fixe `minWidth` e `minHeight` no frame da linha e no botão deslizante, `strokes` ou `fills` com a razão medida na caixa ou na trilha, e `fills` e `fontSize` no rótulo (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)).

```markdown
**Sugestão do agente — confirmar**
Grupo de radio "Forma de pagamento" · nome lido antes da primeira opção
Opções: Cartão, Transferência, Dinheiro · nenhuma selecionada no início · obrigatório
Erro (State=Error): "Escolha uma forma de pagamento"
```

## 5. As regras de cada controle

- **Checkbox.** Só para opções independentes. Se escolher uma precisa desmarcar as outras, é um grupo de radio.
- **Grupo de radio.** Nenhuma opção vem marcada quando a resposta importa, como num consentimento ou numa forma de pagamento. A pessoa escolhe, e o formulário avisa quando ela não escolheu (SC 3.3.1).
- **Switch.** A mudança vale na hora, sem Salvar e sem confirmação. Se precisa de um dos dois, é checkbox. O rótulo dá nome à configuração, e nunca ao estado nem à ação. "Notificações" continua "Notificações" com o switch ligado ou desligado. Um rótulo que vira "Desligar" é anunciado como "Desligar, switch, ligado" (SC 4.1.2).
- **Slider.** Arrastar é atalho (SC 2.5.7). Quando o valor exato importa, como um preço, uma dose ou um intervalo de datas, um campo numérico fica ao lado do slider (Regra da Casa†).
- **Select.** Uma opção de placeholder ("Escolha um país") não é rótulo, porque ela some quando um valor é escolhido. Busca, multisseleção com chips ou opções com ícone fazem dele um combobox ([`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-autocomplete.md)), e a decisão de deixar o select nativo vai para o [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md).

## 6. Quando a tarefa cria ou muda um controle no design system

- **Descrição**, com quando usar, quando não usar e os apelidos. Para o switch: "Switch. Use para uma configuração que vale na hora. Não use quando a mudança precisa de Salvar ou de confirmação (use Checkbox). Apelidos: switch, toggle, liga/desliga."
- **Propriedades:** `State` (VARIANT), o valor como VARIANT (`Checked`, `Selected`, `On`), `Label` e `Help` (TEXT).

## 7. Antipadrões no canvas

- **Controle escolhido pela forma**, como um switch que espera Salvar ou checkboxes que desmarcam umas às outras.
- **Alvo que é só a caixa**, com o rótulo fora do frame da linha.
- **Rótulo de switch que muda com o estado.**
- **Opção pré-marcada** quando a resposta importa.
- **Slider que só muda arrastando**, ou sem o valor em texto.
- **Opção de placeholder como rótulo do select**, ou opção que navega ou envia sozinha.

## 8. O que fica para o código

A semântica, o teclado e o leitor de tela são implementados seguindo o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) do A11Y.md. Os cenários de verificação dele rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
