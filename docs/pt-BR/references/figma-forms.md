# Formulários no canvas — campo de texto, rótulo, ajuda, erro e grupos

> **Escopo:** o campo de texto e o que fica em volta dele (rótulo, texto de ajuda, mensagem de erro, ações no fim do campo), os grupos de campos e o formulário de login, descritos em nós do Figma.
> **Traduz:** o [`guide-forms.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-forms.md) do A11Y.md, com o [`guide-cognitive.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-cognitive.md) §1 e §6 (login e microcopy) e o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) §6 (desabilitado), fixados no commit `57564be`. Checkbox, radio, switch e select estão no [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-form-controls.md). O select com busca, no [`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-autocomplete.md).
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

O campo inteiro é **um componente só**. Rótulo, caixa, ajuda e erro andam juntos, e assim reusar o campo nunca perde o rótulo.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Campo | `COMPONENT_SET` com a propriedade de variante `State`, e cada uso é uma `INSTANCE` | campo da biblioteca sem rótulo é aviso (Seção 2 do DA11Y.md), nunca motivo para criar outro campo |
| Contêiner do campo | `COMPONENT` com auto layout vertical: Rótulo, Caixa, Ajuda ou Erro | a ordem do auto layout é a ordem de leitura. Rótulo depois da caixa, ou fora do fluxo com `layoutPositioning: ABSOLUTE`, é lido depois do campo |
| Rótulo | `TEXT`, fora da caixa e antes dela | sempre visível, exposto como propriedade de componente `TEXT` chamada "Label" |
| Marca de obrigatório | a palavra "obrigatório" no rótulo, ou um asterisco explicado no topo do formulário | asterisco sem explicação não diz nada, e a cor sozinha diz menos ainda |
| Caixa | `FRAME` com auto layout horizontal. A borda é `strokes` e o fundo é `fills` | medida na Seção 3 |
| Valor e placeholder | `TEXT` dentro da caixa | o placeholder é um exemplo, nunca o rótulo e nunca o único lugar do formato |
| Texto de ajuda | `TEXT` abaixo da caixa | o formato ("DD/MM/AAAA") e as regras ("pelo menos 8 caracteres") ficam aqui, visíveis antes de digitar |
| Mensagem de erro | `TEXT` e uma `INSTANCE` de ícone abaixo da caixa, visíveis só em `State=Error` | ícone, texto e cor juntos, e o texto diz a saída |
| Ação no fim do campo (limpar, mostrar senha) | uma `INSTANCE` de ícone dentro de um `FRAME` próprio | é outro alvo, com nome acessível próprio (Seção 4) |
| Grupo de campos (partes de uma data, endereço, conjunto de radios) | `FRAME` com auto layout e um `TEXT` visível com o nome do grupo em primeiro lugar | nunca um `GROUP`, que não tem caixa e não aceita anotação |

## 2. Estados que o componente precisa ter

A propriedade `State` tem pelo menos **Default, Focus, Filled, Error e Disabled**, e também Read-only quando o produto usa. Hover, quando a biblioteca tem, é medido como os demais.

- **Foco num campo com erro.** A pessoa volta ao campo para corrigir, então erro e foco acontecem juntos. Ou o conjunto tem essa combinação, ou o indicador de foco continua chegando a 3:1 por cima da aparência de erro.
- **Erro.** Compare as variantes Default e Error. Se só a cor da borda muda, o estado falha no SC 1.4.1. O ícone e o texto da mensagem precisam aparecer.
- **Desabilitado.** É isento de contraste por ser componente inativo (SC 1.4.3 e 1.4.11). O texto que explica o porquê não é isento, e campo desabilitado sem motivo visível é aviso.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| O que mostra que existe um campo ali | o `strokes` da caixa (borda inteira ou só a de baixo) ou o `fills` da caixa, contra a cor em volta dela | 3:1 quando esse é o único sinal visual do campo (SC 1.4.11) |
| O mesmo, com rótulo visível logo acima da caixa | o mesmo par | a W3C não exige a borda nesse caso ([Understanding SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). Borda abaixo de 3:1 é **aviso**, e não falha, porque delimitar todo controle é boa prática para pessoas com deficiência cognitiva. Relate, e nunca troque o token da biblioteca por conta própria |
| Altura da caixa e das ações | `height` e `minHeight` do `FRAME` da caixa e de cada `FRAME` de ação | o piso do perfil (Seção 3 do DA11Y.md) |

## 4. O que vira anotação

Na instância do campo:

- **Nome**, que contém o rótulo visível na mesma ordem (SC 2.5.3).
- **Finalidade para o preenchimento automático** (SC 1.3.5 para dados da própria pessoa, SC 3.3.8 no login, Seção 5): `name`, `email`, `tel`, `street-address`, `postal-code`, `username`, `current-password`, `new-password`, `one-time-code` ou outro valor da lista do HTML.
- **Obrigatório**, e como o desenho mostra isso.
- **Texto de ajuda ligado ao campo**, para ser lido junto com o rótulo.
- **Mensagem de erro**, com o texto exato, anunciada quando aparece.
- **Teclado no celular**: e-mail, numérico ou telefone.
- **Ações no fim do campo**: o nome acessível de cada uma ("Mostrar senha", "Limpar busca").

Fixe `minHeight` e `strokes` com a razão medida na caixa, e `fills` e `fontSize` no rótulo (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-nodes.md)).

```markdown
**Sugestão do agente — confirmar**
Campo "E-mail" · nome: E-mail · preenchimento: email · teclado: e-mail · obrigatório
Ajuda: "Nós nunca compartilharemos seu e-mail." (lida junto com o rótulo)
Erro (State=Error): "Digite um e-mail como nome@exemplo.com" (anunciado quando aparece)
```

## 5. Login e autenticação

- **Nada que teste a memória** (SC 3.3.8). Nada de "digite o 3º e o 7º caractere da senha" nem CAPTCHA para transcrever. A anotação diz que colar é permitido no campo de senha e dá a finalidade do preenchimento automático, porque é isso que deixa o gerenciador de senhas lembrar no lugar da pessoa.
- **CAPTCHA e o perfil Shield.** As alternativas a um CAPTCHA que não dá para evitar e o SC 3.3.9 no Shield estão na Seção 1 do [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/pt-BR/references/figma-cognitive.md).
- **Nada digitado duas vezes** (SC 3.3.7). O dado que a pessoa já deu no mesmo fluxo aparece preenchido ou como opção para escolher. A confirmação de senha é a exceção do próprio critério.
- **O erro diz a saída:** "Senha incorreta. Tente novamente ou redefina sua senha", e nunca só "Senha incorreta".

## 6. Quando a tarefa cria ou muda o campo no design system

- **Descrição:** "Campo de texto. Use para uma linha de texto livre. Não use para escolher de uma lista (use Select) nem para texto longo (use Text area). Apelidos: input, text input, campo, form field."
- **Propriedades:** `State` (VARIANT), `Label`, `Help`, `Error message` (TEXT), `Required` (BOOLEAN), `Leading icon` (INSTANCE_SWAP).

## 7. Antipadrões no canvas

- **Placeholder como rótulo**, inclusive o rótulo "flutuante" que encolhe abaixo da fonte mínima do perfil quando o campo tem valor.
- **O formato só no placeholder**, que some assim que a pessoa digita.
- **Mensagem de erro longe do campo**, num toast ou só no topo da página.
- **Trocar o token de borda da biblioteca** porque ele mediu abaixo de 3:1 com um rótulo visível logo acima. Isso é aviso, e quem decide é a pessoa.

## 8. O que fica para o código

A semântica, o teclado e o leitor de tela são implementados seguindo o [`guide-forms.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-forms.md) do A11Y.md. Os cenários de verificação dele rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
