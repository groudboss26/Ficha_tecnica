# 🛠 Ficha de Desenvolvimento — Receitas Verdemar

Documento técnico de referência para quem for dar manutenção ou evoluir o projeto. Não é a documentação de uso (isso está no `README.md`) — aqui o foco é **como o projeto foi construído, por que certas decisões foram tomadas e como estender com segurança**.

---

## 1. Visão geral técnica

| Item | Detalhe |
|---|---|
| Tipo | App web estático (sem build, sem framework) |
| Stack | HTML5 + CSS3 + JavaScript (Vanilla ES6+) |
| Dependências externas | Google Fonts (`Space Grotesk`, `Inter`, `IBM Plex Mono`) via `@import` no CSS |
| Persistência de dados | Nenhuma — dados vivem em memória, hardcoded em `script.js` |
| Compatibilidade | Navegadores modernos (usa `flexbox`, `backdrop-filter`, `toLocaleString`, arrow functions) |
| Responsividade | Mobile-first, com breakpoints em `720px` e `960px` |

Não há back-end, banco de dados ou API. Toda a "base de dados" das receitas é o array `RECIPES` dentro de `script.js`.

---

## 2. Estrutura de arquivos

```
receitas-verdemar/
├── index.html     # Esqueleto da página. Praticamente não deve mudar — quase tudo é gerado via JS.
├── style.css      # Design tokens (:root) + estilos de todos os componentes.
├── script.js      # Dados das receitas (RECIPES) + toda a lógica (render, filtro, modal, cálculo).
└── README.md      # Documentação de uso/instalação (para o usuário final do repositório).
```

`index.html` contém apenas os containers vazios (`#filters`, `#recipeList`, `#modal`, etc.). Tudo que é dinâmico é injetado via `innerHTML` em `script.js`. Isso foi uma escolha deliberada para manter os dados (as receitas) centralizados em um único lugar, fáceis de editar sem tocar em marcação.

---

## 3. Modelo de dados (`RECIPES`)

Cada receita é um objeto neste formato:

```js
{
  id: 'slug-unico',                 // usado internamente, deve ser único
  categoria: 'base',                // precisa bater com um id em CATEGORIES
  nome: 'Nome exibido',
  medidasPadrao: ['string', ...],   // texto(s) fiel(is) ao documento original — exibidos como está, sem cálculo
  scale: {
    type: 'weight' | 'multiplier',
    label: 'Rótulo do campo de input',
    unit: 'kg' | 'g' | 'L' | 'ml' | 'x',
    reference: Number,              // valor "padrão" — ver seção 4
  },
  ingredientes: [
    {
      nome: 'Nome do ingrediente',
      base: Number,                 // quantidade correspondente a scale.reference
      unit: 'g' | 'ml' | 'L' | 'kg' | 'unid.' | 'colher(es) de sopa' | ...,
      decimals: Number,             // casas decimais na exibição (ignorado se discrete:true)
      discrete: true,                // opcional — marca itens contáveis (ovos, limões, pacotes)
    },
  ],
  modoPreparo: 'Texto corrido do preparo.',
  observacao: 'Opcional — observação do documento original (ex.: taxa de uso).',
  nota: 'Opcional — sinaliza suposição/assunção feita na transcrição.',
}
```

### Categorias (`CATEGORIES`)

```js
{ id: 'base', label: 'Molhos Base', color: 'var(--wasabi)' }
```

Cada categoria tem uma cor própria (usada na barra lateral do card/ticket e na tag do modal). As 4 cores atuais já estão nos design tokens do CSS — para criar uma categoria nova, adicione uma variável de cor em `:root` (style.css) e referencie aqui.

---

## 4. Como funciona o cálculo de escala

Ver também a tabela resumida no `README.md`. Detalhamento da lógica (`scaledIngredient` e `wireScaleInput` em `script.js`):

- **`type: 'weight'`**: o usuário digita uma quantidade do ingrediente principal (ex.: kg de gengibre). O fator de escala é:
  ```
  fator = valorDigitado / scale.reference
  ```
  Cada ingrediente é multiplicado por esse fator: `valorFinal = ingrediente.base * fator`.

- **`type: 'multiplier'`**: usado quando não há um ingrediente "principal" óbvio para basear o cálculo (ex.: Molho Tarê, Arroz Integral). Aqui `scale.reference` é sempre `1`, e o valor digitado **é** o próprio fator.

- **Itens `discrete: true`**: arredondados para o múltiplo de `0.5` mais próximo (`Math.round(raw * 2) / 2`), pensado para itens como ovos, limões, pacotes — não faz sentido pedir "2,37 ovos".

- **Botões de atalho no modal** (`−1` / `padrão` / `+1`): o botão "padrão" restaura `scale.reference`. Os botões `±1` incrementam em `1` unidade para `weight` e `0.5` para `multiplier` (lotes fracionários fazem mais sentido em múltiplos pequenos).

### ⚠️ Ponto de atenção ao adicionar receitas

O campo `scale.reference` **precisa corresponder exatamente** à quantidade que gerou os valores em `ingredientes[].base`. Ou seja: se `scale.reference = 18` (kg), os valores em `base` devem ser os totais necessários para 18 kg — não para a "receita padrão" pequena do documento. Isso é o que garante que o cálculo proporcional saia correto.

---

## 5. Decisões de design (resumo)

Guia completo de estilo já foi seguido durante a criação (paleta, tipografia, layout) — resumo do que já está definido em `style.css`:

- **Paleta**: fundo escuro (`--bg`, tom "nori") + 4 cores de categoria (`--wasabi`, `--amber`, `--sea`, `--coral`), representando a identidade de peixaria/sushi.
- **Tipografia**: `Space Grotesk` (títulos), `Inter` (corpo), `IBM Plex Mono` (números — usado nos valores calculados, imitando o visor de uma balança digital).
- **Elemento de assinatura**: o `.scale-panel` no modal, estilizado como o visor de uma balança de cozinha (números grandes em monoespaçada, fundo escuro).
- **Modal**: bottom sheet no mobile (`transform: translateY`), centralizado como card flutuante a partir de `720px`.

Se for adicionar novas seções/páginas, manter esses tokens (`:root` em `style.css`) em vez de introduzir cores/fontes soltas no meio do CSS.

---

## 6. Limitações conhecidas / débito técnico

- **Sem persistência**: qualquer alteração de dados exige editar `script.js` e publicar de novo. Não há CMS nem edição pela interface.
- **Fontes via CDN**: o `@import` do Google Fonts em `style.css` exige internet. Sem conexão, o app cai para as fontes de sistema definidas no fallback (`sans-serif` / `monospace`) — funciona, mas perde a identidade visual.
- **Sem testes automatizados**: projeto pequeno o suficiente para ser testado manualmente, mas se crescer vale considerar testes de unidade para `scaledIngredient()`.
- **Acessibilidade parcial**: modal tem `aria-modal`, fecha com `Esc`, e devolve foco ao elemento anterior — mas não há *focus trap* completo (dá para tabular para fora do modal enquanto aberto).
- **Sem roteamento**: é uma página só (SPA sem rotas). Um link direto para uma receita específica (deep link) não existe hoje.
- **Alguns dados são inferidos**: receitas com o campo `nota` preenchido têm valores assumidos (não vinham explícitos no documento original). Ver seção 3 e os próprios cards no app.

---

## 7. Ideias para próximas versões

Nenhuma dessas está implementada — são sugestões para priorizar conforme a necessidade real da cozinha:

- [ ] Campo de busca por nome de receita/ingrediente.
- [ ] Botão "favoritar" receitas mais usadas (persistido via `localStorage` — hoje não é usado no projeto).
- [ ] Modo "check-list" no preparo (marcar etapas concluídas).
- [ ] Exportar/imprimir a receita já calculada (útil para colar na estação de trabalho).
- [ ] Deep link por receita (`#gari`, por exemplo) para compartilhar direto pelo WhatsApp.
- [ ] Editor simples (formulário) para adicionar/editar receitas sem mexer no código — só faz sentido se o time crescer ou a lista ficar grande.
- [ ] Modo claro/escuro (hoje só existe o tema escuro).

---

## 8. Convenções ao editar o código

- Receitas novas: sempre em português, seguindo o mesmo tom das existentes (nome do ingrediente como na ficha original).
- Nunca "arrumar" ou arredondar um valor do documento original sem deixar isso registrado no campo `nota`.
- Ao adicionar uma unidade de medida nova, conferir se `decimals` faz sentido (ex.: litros geralmente `2` casas, gramas grandes `0` casas).
- Manter `RECIPES` ordenado por categoria só por organização visual do arquivo — a ordem de exibição real é controlada por `CATEGORIES`, não pela ordem do array.
