# 🛠 Ficha de Desenvolvimento — Receitas Verdemar

Documento técnico de referência para quem for dar manutenção ou evoluir o projeto. Não é a documentação de uso (isso está no `README.md`) — aqui o foco é **como o projeto foi construído, por que certas decisões foram tomadas e como estender com segurança**.

---

## 1. Visão geral técnica

| Item | Detalhe |
|---|---|
| Tipo | App web estático, instalável e offline (PWA, sem build, sem framework) |
| Stack | HTML5 + CSS3 + JavaScript (Vanilla ES6+) + Service Worker |
| Dependências externas | Google Fonts (`Space Grotesk`, `Inter`, `IBM Plex Mono`) via `@import` no CSS (cacheadas localmente para uso offline) |
| Persistência de dados | Local para favoritos via `localStorage`. Receitas vivem em memória, hardcoded em `script.js` |
| Compatibilidade | Navegadores modernos (usa `flexbox`, `backdrop-filter`, `toLocaleString`, arrow functions, `<dialog>` HTML5) |
| Responsividade | Mobile-first, com breakpoints em `720px` e `960px` |

Não há back-end, banco de dados remoto ou API. Toda a "base de dados" das receitas é o array `RECIPES` dentro de `script.js`.

---

## 2. Estrutura de arquivos

```
receitas-verdemar/
├── index.html     # Esqueleto da página (hero, busca, filtros, container de receitas e tag <dialog> do modal)
├── style.css      # Design tokens (:root) + estilos de todos os componentes e layouts responsivos
├── script.js      # Dados das receitas (RECIPES) + lógica da SPA, busca, favoritos e calculadora de escala
├── manifest.json  # Manifesto PWA com metadados do aplicativo instalável (ícones, cores de tema, etc.)
├── sw.js          # Service Worker que gerencia estratégias de cache (stale-while-revalidate) para suporte offline
├── icon.svg       # Ícone vetorizado para o PWA
├── icon.png       # Ícone rasterizado de alta resolução (512x512) para dispositivos móveis
├── bg.png         # Fundo de tela com caligrafia kanji minimalista
└── README.md      # Documentação de uso/instalação (para o usuário final do repositório).
```

`index.html` contém apenas os containers vazios (`#filters`, `#recipeList`, `#recipeDialog`, etc.). Tudo que é dinâmico é injetado via JavaScript em `script.js`. Isso foi uma escolha deliberada para manter os dados (as receitas) centralizados em um único lugar, fáceis de editar sem tocar em marcação.

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
{ id: 'base', label: 'Molhos de Acompanhamento', color: 'var(--wasabi)' }
```

Cada categoria tem uma cor própria (usada na barra lateral do card/ticket e na tag do modal). As 4 cores atuais já estão nos design tokens do CSS — para criar uma categoria nova, adicione uma variável de cor em `:root` (style.css) e referencie aqui.

> **Nota:** O Molho Tarê pertence à categoria `base` (Molhos de Acompanhamento), não a `arroz`.

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
- **Modal**: Implementado nativamente usando a tag HTML5 `<dialog>` e manipulado via `.showModal()`. No mobile é exibido como bottom sheet (`transform: translateY`), e a partir de `720px` é centralizado como card flutuante. O `<dialog>` nativo fornece foco retido automaticamente por padrão.

Se for adicionar novas seções/páginas, manter esses tokens (`:root` em `style.css`) em vez de introduzir cores/fontes soltas no meio do CSS.

---

## 6. Limitações conhecidas / débito técnico

- **Sem persistência centralizada**: qualquer alteração de receitas exige editar `script.js` e publicar de novo. Não há CMS nem edição pela interface (embora haja `localStorage` para a lista de favoritos).
- **Sem testes automatizados**: projeto pequeno o suficiente para ser testado manualmente, mas se crescer vale considerar testes de unidade para `scaledIngredient()`.
- **Alguns dados são inferidos**: receitas com o campo `nota` preenchido têm valores assumidos (não vinham explícitos no documento original). Ver seção 3 e os próprios cards no app.
- **DOM totalmente reconstruído a cada `renderList()`**: `listEl.innerHTML = ''` destruói e recria todos os cards. Aceitável no volume atual de receitas, mas se o catálogo crescer muito, vale migrar para atualização incremental (diff de DOM ou Virtual DOM mínimo).

---

## 7. Ideias para próximas versões

Próximas melhorias para priorizar conforme a necessidade real da cozinha:

- [x] Campo de busca por nome de receita/ingrediente.
- [x] Otimização de performance da busca (debounce + índice pré-computado).
- [x] Botão "favoritar" receitas mais usadas (persistido via `localStorage`).
- [x] Modo "check-list" no preparo (marcar etapas conluídas - estendido também para ingredientes).
- [x] Deep link por receita (`#gari`, por exemplo) para compartilhar direto pelo WhatsApp.
- [x] Modo claro/escuro com botão no topbar e persistência em `localStorage`.
- [ ] Exportar/imprimir a receita já calculada (útil para colar na estação de trabalho).
- [ ] Editor simples (formulário) para adicionar/editar receitas sem mexer no código — só faz sentido se o time crescer ou a lista ficar grande.

---

## 8. Convenções ao editar o código

- Receitas novas: sempre em português, seguindo o mesmo tom das existentes (nome do ingrediente como na ficha original).
- Nunca "arrumar" ou arredondar um valor do documento original sem deixar isso registrado no campo `nota`.
- Ao adicionar uma unidade de medida nova, conferir se `decimals` faz sentido (ex.: litros geralmente `2` casas, gramas grandes `0` casas).
- Manter `RECIPES` ordenado por categoria só por organização visual do arquivo — a ordem de exibição real é controlada por `CATEGORIES`, não pela ordem do array.

---

## 9. Arquitetura de busca

A busca foi otimizada em 3 camadas independentes:

### 9.1 Índice pré-computado (`SEARCH_INDEX_MAP`)

Na inicialização do script, cada receita gera uma string única normalizada (sem acentos, em lowercase) com nome + todos os ingredientes:

```js
const SEARCH_INDEX = RECIPES.map(r => ({
  id: r.id,
  text: normalizeText([r.nome, ...r.ingredientes.map(i => i.nome)].join(' ')),
}));
const SEARCH_INDEX_MAP = new Map(SEARCH_INDEX.map(e => [e.id, e.text]));
```

Durante a busca, o filtro usa `SEARCH_INDEX_MAP.get(r.id)` — lookup O(1), sem nenhum processamento de string em runtime.

### 9.2 Debounce no evento `input`

O evento `input` da barra de busca é envolto em `debounce(fn, 150ms)` — `renderList()` só é chamado 150 ms depois da última tecla, evitando renders desnecessários enquanto o usuário ainda está digitando.

### 9.3 Agrupamento por categoria com `Map` (passagem única)

Ao invés de filtrar o array duas vezes (uma para descobrir quais categorias exibir, outra para buscar os itens de cada categoria), usa-se um `Map` populado em uma única iteração:

```js
const groupMap = new Map(CATEGORIES.map(c => [c.id, []]));
filtered.forEach(r => groupMap.get(r.categoria)?.push(r));
```

Isso reduz de O(n × k) para O(n + k), onde `n` = receitas e `k` = categorias.

### 9.4 Normalização de acentos (`normalizeText`)

Toda a normalização de texto passa por uma única função:

```js
function normalizeText(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
```

- `normalize('NFD')` decomposta caracteres acentuados em base + diacítico (`ç` → `c` + `,`)
- A regex `/[\u0300-\u036f]/g` remove todos os diacíticos resultantes

| Usuário digita | Encontra |
|---|---|
| `acucar` | `açúcar` ✅ |
| `salmao` | `salmão` ✅ |
| `salmão` | `salmão` ✅ |
| `açúcar` | `açúcar` ✅ |
| `gengibre` | `gengibre` ✅ |

A mesma função é aplicada ao query do usuário antes de comparar com o índice, garantindo consistência em ambos os lados.

---

## 10. Fluxo de atualização PWA

Quando uma nova versão dos arquivos é publicada, o Service Worker (`sw.js`) detecta a mudança e entra em estado **waiting**. A página exibe um toast para o usuário confirmar — ao clicar em **Atualizar**, o novo SW assume o controle e a aba recarrega com a versão mais recente.

### Diagrama de estados

```
Novo deploy publicado
      │
      ▼
SW instalado → estado: installing
      │
      ▼
SW pronto    → estado: waiting  ──► toast exibido para o usuário
      │                                       │
      │           usuário clica "Atualizar"   │
      │◄──────────────────────────────────────┘
      ▼
página envia  { type: 'SKIP_WAITING' }
      │
      ▼
SW ativo     → estado: activated
      │
      ▼
controllerchange event → window.location.reload()
```

### Arquivos envolvidos

| Arquivo | Papel |
|---|---|
| `sw.js` | Remove `skipWaiting()` automático do `install`; responde a `{ type: 'SKIP_WAITING' }` |
| `script.js` | Detecta `reg.waiting` e `updatefound`; exibe toast; manda mensagem; recarrega no `controllerchange` |
| `index.html` | Elemento `#updateToast` com botões `#updateBtn` e `#updateDismiss` |
| `style.css` | Estilos do toast: slide-up animado com `cubic-bezier`, borda em `--wasabi` |

### Regra ao publicar nova versão

**Sempre que os arquivos forem atualizados, incremente o `CACHE_NAME` em `sw.js`:**

```js
// Antes
const CACHE_NAME = 'receitas-verdemar-v2';
// Depois
const CACHE_NAME = 'receitas-verdemar-v3';
```

Isso garante que o browser reconheça o arquivo como diferente e instale o novo SW, disparando o fluxo de notificação para o usuário.
