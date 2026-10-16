# Autocomplete no canvas — combobox, lista de opções e contagem de resultados

> **Escopo:** o campo que sugere opções enquanto a pessoa digita (autocomplete, combobox, select com busca), a lista de opções e a contagem de resultados, descritos em nós do Figma. O campo em si segue o [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md).
> **Traduz:** o [`guide-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-autocomplete.md) do A11Y.md, com o [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-form-controls.md) §5 (quando um select vira combobox), fixados no commit `57564be`.
> **Antes deste guia:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md). Os pisos vêm da tabela de perfis da Seção 0.1 do DA11Y.md.

## 1. Anatomia em nós

O campo e a lista são **um componente só**. A lista pertence ao campo, e o cursor fica no campo enquanto a pessoa percorre as opções.

| Parte | Nó | Regra |
| :--- | :--- | :--- |
| Combobox | `COMPONENT_SET` com `State` e a propriedade de variante `Expanded`, e cada uso é uma `INSTANCE` | combobox que falta na biblioteca é aviso (Seção 2 do DA11Y.md), e só se desenha um com autorização |
| Campo | uma `INSTANCE` do campo de texto da biblioteca (Rótulo, Caixa, Valor, Ajuda, Erro) | o rótulo fica fora da caixa e antes dela. "Buscar…" dentro da caixa é placeholder, nunca o rótulo |
| Botão que abre a lista, quando existe | uma `INSTANCE` de ícone dentro de um `FRAME` próprio, no fim da caixa | é uma ação no fim do campo (Seção 1 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md)), com alvo e nome próprios |
| Lista de opções | `FRAME` com auto layout vertical, logo abaixo do campo | a ordem do auto layout é a ordem das opções. A lista posta com `layoutPositioning: ABSOLUTE` sai do fluxo (Seção 4) |
| Opção | `INSTANCE` de um `COMPONENT` de opção com `State`, e um `TEXT` dentro | o texto da opção é o que a pessoa ouve ("Brasil, 1 de 5") |
| Contagem de resultados | `TEXT` na lista, quando o desenho mostra a contagem | quando ela não aparece, a contagem continua existindo como anúncio (Seção 4) |

## 2. Estados que o componente precisa ter

- **`Expanded`: False e True.** Desenhe a lista aberta com resultados e sem nenhum, porque a contagem existe também para o zero.
- **O campo** tem os estados do campo de texto (Seção 2 do [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-forms.md)) e **continua com a aparência de foco enquanto a lista está aberta**. O cursor fica no campo enquanto o destaque anda pelas opções, então a variante aberta mostra o campo em Focus e uma opção em Highlighted ao mesmo tempo.
- **A opção** tem Default e Highlighted, e também Selected quando a lista marca o valor escolhido. Highlighted é o foco que a pessoa vê dentro da lista, então passa pela mesma checagem do Focus. Selected mostra um ícone ou uma forma, e nunca só a cor.

## 3. O que medir, a partir das propriedades

| Checagem | O que ler | Passa quando |
| :--- | :--- | :--- |
| Opção em destaque | o `strokes` e o `strokeWeight` da variante Highlighted contra a cor vizinha | o piso de foco do perfil (Seção 3 do DA11Y.md). Destaque feito só de `fills` não tem contorno para medir, então diga a dúvida (Seção 2 do DA11Y.md) |
| Alvo da opção | `height` e `minHeight` do frame da opção | o piso do perfil (Seção 3 do DA11Y.md) |

## 4. O que vira anotação

**Na anotação da instância do combobox**, no formato curto da Seção 5 do DA11Y.md:

- **Papel.** Um campo com uma lista de opções que filtra enquanto a pessoa digita. Ele parece um campo de texto ou um select, então o papel fica escrito.
- **Nome.** O rótulo visível do campo.
- **Contagem de resultados**, com o texto exato, anunciada quando os resultados aparecem: "5 resultados disponíveis". Para o zero: "Nenhum resultado" (SC 4.1.3).

**No relatório**, como requisito para o desenvolvimento:

- **Teclas que o canvas não mostra.** `↓` e `↑` movem o destaque enquanto o cursor fica no campo. `Enter` preenche o campo com a opção em destaque e fecha a lista. `Tab` fecha a lista e vai para o próximo controle.
- **Lista fora do fluxo** (`ABSOLUTE`) pertence a este campo.

Fixe `minHeight` no frame da opção, `fills` e `fontSize` no texto da opção, e `strokes` e `strokeWeight`, ou `fills`, na variante Highlighted (Seção 4 do [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-nodes.md)).

```markdown
3 · campo "País"
🔊 combobox "País", com lista de opções
📢 "5 resultados disponíveis" · sem resultado: "Nenhum resultado"
```

## 5. Select ou combobox

- **Uma lista curta, sem nada para buscar, é um select** ([`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-form-controls.md)). Busca, multisseleção com chips ou opções com ícone fazem dela um combobox, e a decisão de deixar o select nativo vai para o [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/templates/A11Y-DECISIONS.md).
- **A ação de remover de cada chip é um botão só com ícone**, com alvo próprio e um nome que diz o que ele remove: "Remover Brasil" ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/pt-BR/references/figma-buttons.md)).

## 6. Quando a tarefa cria ou muda o combobox no design system

- **Descrição:** "Combobox. Use para escolher um valor de uma lista longa, digitando para filtrar. Não use para uma lista curta sem nada para buscar (use Select) nem para texto livre (use Text field). Apelidos: autocomplete, combobox, select com busca, typeahead, busca com sugestões."
- **Propriedades:** `State` e `Expanded` (VARIANT), `Label`, `Help` e `Error message` (TEXT). Na opção, `State` (VARIANT: Default, Highlighted, Selected).

## 7. Antipadrões no canvas

- **"Buscar…" dentro da caixa como único rótulo.**
- **Lista desenhada longe do campo**, como um frame solto ou um `GROUP`.
- **Variante aberta em que o campo perde a aparência de foco**, como se o foco tivesse ido para a lista.
- **Nenhum texto para a contagem de resultados**, inclusive o zero.

## 8. O que fica para o código

A semântica, o teclado e o leitor de tela são implementados seguindo o [`guide-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/pt-BR/references/guide-autocomplete.md) do A11Y.md. Os cenários de verificação dele rodam no produto construído e entram no relatório como requisitos para o desenvolvimento.
