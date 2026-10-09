# Formulários no canvas — campo de texto, rótulo, ajuda, erro e grupos

> **Escopo:** o campo de texto e o que fica em volta dele (rótulo, texto de ajuda, mensagem de erro, ações no fim do campo), os grupos de campos e o formulário de login, descritos em nós do Figma.
> **Traduz:** o `references/guide-forms.md` do A11Y.md, com o `references/guide-cognitive.md` §1 e §6 (login e microcopy) e o `references/guide-form-controls.md` §6 (desabilitado), fixados no commit `57564be`. Checkbox, radio, switch e select ainda se leem no `references/guide-form-controls.md`. O select com busca, no `references/guide-autocomplete.md`.
> **Antes deste guia:** `figma-nodes.md`. Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

O campo inteiro é **um componente só**. Rótulo, caixa, ajuda e erro andam juntos, e assim reusar o campo nunca perde o rótulo.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Campo | `COMPONENT_SET` com a propriedade de variante `State`, e cada uso é uma `INSTANCE` | se o campo da biblioteca não tem rótulo, isso é um aviso da Seção 2, nunca motivo para criar outro campo |
| Contêiner do campo | `COMPONENT` com auto layout vertical: Rótulo, Caixa, Ajuda ou Erro | a ordem do auto layout é a ordem de leitura, então o rótulo vem primeiro. Rótulo depois da caixa, ou tirado do fluxo com `layoutPositioning: ABSOLUTE`, é lido depois do campo |
| Rótulo | `TEXT`, fora da caixa e antes dela | sempre visível, exposto como propriedade de componente `TEXT` chamada "Label" |
| Marca de obrigatório | a palavra "obrigatório" no rótulo, ou um asterisco explicado no topo do formulário | asterisco sem explicação não diz nada, e a cor sozinha diz menos ainda |
| Caixa | `FRAME` com auto layout horizontal. A borda é `strokes` e o fundo é `fills` | o que precisa chegar a 3:1 está na Seção 3 |
| Valor e placeholder | `TEXT` dentro da caixa | o placeholder é um exemplo, nunca o rótulo e nunca o único lugar do formato |
| Texto de ajuda | `TEXT` abaixo da caixa | o formato ("DD/MM/AAAA") e as regras ("pelo menos 8 caracteres") ficam aqui, visíveis antes de digitar |
| Mensagem de erro | `TEXT` e uma `INSTANCE` de ícone abaixo da caixa, visíveis só em `State=Error` | ícone, texto e cor juntos, e o texto diz a saída |
| Ação no fim do campo (limpar, mostrar senha) | uma `INSTANCE` de ícone dentro de um `FRAME` próprio | é outro alvo, com caixa própria no alvo mínimo do perfil e nome acessível próprio (Seção 4) |
| Grupo de campos (partes de uma data, endereço, conjunto de radios) | `FRAME` com auto layout e um `TEXT` visível com o nome do grupo em primeiro lugar | nunca um `GROUP`, que não tem caixa e não aceita anotação |

## 2. Estados que o componente precisa ter

A propriedade `State` tem pelo menos **Default, Hover, Focus, Filled, Error e Disabled**, e também Read-only quando o produto usa. Estado que falta na biblioteca é aviso da Seção 2: aponte e desenhe só com autorização.

- **Foco.** Um contorno de pelo menos 2px com 3:1 contra a cor vizinha, feito com `strokes` e `strokeWeight`. Sombra em `effects` sozinha não conta, porque some no modo de alto contraste.
- **Foco num campo com erro.** A pessoa volta ao campo para corrigir, então erro e foco acontecem juntos. Ou o conjunto tem essa combinação, ou o indicador de foco continua chegando a 3:1 por cima da aparência de erro.
- **Erro.** Compare as variantes Default e Error. Se só a cor da borda muda, o estado falha no SC 1.4.1. O ícone e o texto da mensagem precisam aparecer.
- **Desabilitado.** O campo desabilitado é isento de contraste (componente inativo, SC 1.4.3 e 1.4.11). O texto que explica por que ele está desabilitado não é isento e segue o piso de texto do perfil. Campo desabilitado sem motivo visível é aviso.

## 3. O que medir, a partir das propriedades

Toda razão é calculada pela fórmula da WCAG sobre o valor resolvido do token, em cada modo que o arquivo usa (`resolvedVariableModes`), e nunca estimada.

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Texto do rótulo, do valor, da ajuda e do erro | o `fills` do `TEXT` contra o preenchimento do ancestral mais próximo que tenha um | o piso de texto do perfil: 4.5:1 no Standard, 7:1 no Shield |
| O que mostra que existe um campo ali | o `strokes` da caixa (borda inteira ou só a de baixo) ou o `fills` da caixa, contra a cor em volta dela | 3:1 quando esse é o único sinal visual do campo (SC 1.4.11) |
| O mesmo, com rótulo visível logo acima da caixa | o mesmo par | a W3C não exige a borda nesse caso. Borda abaixo de 3:1 é **aviso**, e não falha, porque delimitar todo controle é boa prática para pessoas com deficiência cognitiva. Relate, e nunca troque o token da biblioteca por conta própria |
| Foco | o `strokes` e o `strokeWeight` da variante Focus contra a cor vizinha | pelo menos 2px e 3:1 (Regra da Casa†, acima do SC 2.4.7) |
| Erro além da cor | as variantes Default e Error lado a lado | uma `INSTANCE` de ícone e um `TEXT` de erro passam a aparecer |
| Altura da caixa e das ações | `height` e `minHeight` do `FRAME` da caixa e de cada `FRAME` de ação | o alvo mínimo do perfil: 24×24 no Standard (44×44 recomendado), 44×44 no Shield (48×48 recomendado) |
| Espaçamento | `itemSpacing` entre campos, e entre uma ação no fim do campo e os vizinhos dela | 8px entre alvos vizinhos (Regra da Casa†) |
| Texto que cresce | `textAutoResize` do rótulo, da ajuda e do erro, e `layoutSizingVertical` do contêiner deles | texto em `HEIGHT` ou `WIDTH_AND_HEIGHT` dentro de um contêiner `HUG`. `TRUNCATE`, `maxLines` ou altura `FIXED` no rótulo, na ajuda ou no erro cortam o texto no zoom de 200% |
| Tamanho da fonte | `fontSize` do rótulo, do valor, da ajuda e do erro | a fonte mínima do perfil: 12px no Standard, 14px no Shield |

## 4. O que vira anotação

O canvas não tem campo para nada disto. Cada item é uma anotação na categoria **Accessibility**, na instância do campo, começando com o status `Sugestão do agente — confirmar` (Seção 4 do DA11Y.md):

- **Nome.** O nome que o campo vai ter. Quando o rótulo visível é mais curto do que o nome precisa ser, o nome contém o texto visível, na mesma ordem (SC 2.5.3).
- **Finalidade para o preenchimento automático** (SC 1.3.5): `name`, `email`, `tel`, `street-address`, `postal-code`, `username`, `current-password`, `new-password`, `one-time-code` ou outro valor da lista do HTML.
- **Obrigatório**, e como o desenho mostra isso.
- **Texto de ajuda ligado ao campo**, para ser lido junto com o rótulo.
- **Mensagem de erro**, com o texto exato e a instrução de que ela é anunciada quando aparece.
- **Teclado no celular**: e-mail, numérico ou telefone.
- **Ações no fim do campo**: o nome acessível de cada uma ("Mostrar senha", "Limpar busca").

Fixe na anotação o valor medido (Seção 4 do `figma-nodes.md`). Na caixa, fixe `minHeight` e `strokes` com a razão medida. No rótulo, fixe `fills` e `fontSize`. Se alguém mudar o valor depois, a anotação mostra o novo.

```markdown
**Sugestão do agente — confirmar**
Campo "E-mail" · nome: E-mail · preenchimento: email · teclado: e-mail · obrigatório
Ajuda: "Nós nunca compartilharemos seu e-mail." (lida junto com o rótulo)
Erro (State=Error): "Digite um e-mail como nome@exemplo.com" (anunciado quando aparece)
```

## 5. Login e autenticação

- **Nada que teste a memória** (SC 3.3.8). Nada de "digite o 3º e o 7º caractere da senha" nem CAPTCHA para transcrever. A anotação diz que colar é permitido no campo de senha e dá a finalidade do preenchimento automático, porque é isso que deixa o gerenciador de senhas lembrar no lugar da pessoa.
- **Mostrar senha** é uma ação no fim do campo, com alvo e nome próprios.
- **Nada digitado duas vezes** (SC 3.3.7). O dado que a pessoa já deu no mesmo fluxo aparece preenchido ou como opção para escolher. A confirmação de senha é a exceção do próprio critério.
- **O erro diz a saída:** "Senha incorreta. Tente novamente ou redefina sua senha", e nunca só "Senha incorreta".

## 6. Quando a tarefa cria ou muda o campo no design system

A camada de contexto para agentes da Seção 2.2 do DA11Y.md, aplicada ao campo:

- **Descrição:** "Campo de texto. Use para uma linha de texto livre. Não use para escolher de uma lista (use Select) nem para texto longo (use Text area). Apelidos: input, text input, campo, form field."
- **Propriedades:** `State` (VARIANT), `Label`, `Help`, `Error message` (TEXT), `Required` (BOOLEAN), `Leading icon` (INSTANCE_SWAP).
- **Camadas com o nome do que são, na ordem de leitura:** Label, Box, Value, Help text, Error message.
- **Contrato de acessibilidade como dado:** um item por checagem da Seção 3, com o resultado medido de cada estado em cada modo.

## 7. Antipadrões no canvas

- **Placeholder como rótulo**, inclusive o rótulo "flutuante" que encolhe abaixo da fonte mínima do perfil quando o campo tem valor.
- **O formato só no placeholder**, que some assim que a pessoa digita.
- **Erro mostrado só pela borda vermelha.**
- **Mensagem de erro longe do campo**, num toast ou só no topo da página.
- **Campo feito de um `GROUP`** com um retângulo e um texto, sem caixa para medir e sem lugar para a evidência.
- **Botão de enviar desabilitado sem motivo visível.**
- **Trocar o token de borda da biblioteca** porque ele mediu abaixo de 3:1 com um rótulo visível logo acima. Isso é aviso, e quem decide é a pessoa.

## 8. O que fica para o código

O rótulo ligado ao campo, a ajuda e a mensagem de erro ligadas a ele, o estado inválido, o anúncio do erro, o atributo de preenchimento automático e o nome do grupo são implementados seguindo o `references/guide-forms.md` do A11Y.md. Os cenários de verificação desse guia (teclado e leitores de tela no desktop e no celular) rodam no produto construído, nunca no canvas, e entram no relatório de design como requisitos para o desenvolvimento.
