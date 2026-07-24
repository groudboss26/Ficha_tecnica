# 🍣 Receitas Verdemar

Ficha técnica digital das receitas e molhos de sushi da **Peixaria Verdemar** — mobile-first, sem dependências de build, com calculadora de produção em tempo real.

> Transcrição fiel dos documentos operacionais originais (fichas técnicas em papel/PDF), organizada em um app web simples para consulta na cozinha.

## ✨ Funcionalidades

- **Menu por categoria** — Molhos de Acompanhamento, Molhos para Arroz, Molhos Diversos e Recheios & Massas, com filtros em chips.
- **Medidas padrão originais** — cada receita mostra, sem alterações, os valores exatamente como estavam no documento fonte (receita padrão / receita de produção).
- **Calculadora de produção inteligente** — além de digitar o valor, use os atalhos de multiplicadores rápidos (`0.5x`, `1x`, `2x`, `3x`, `5x`) e botões de ajuste fino com passos inteligentes adaptados à unidade (ex: `±100g` ou `±1kg`).
- **Barra de busca** — encontre receitas rapidamente por nome ou ingredientes em tempo real.
- **Sistema de favoritos** — favorite receitas com estrela para fixá-las no topo ou filtrar pelo chip de filtro rápido "⭐ Favoritas".
- **Modo Cozinha (Checklist)** — toque em ingredientes ou passos do preparo para riscá-los, facilitando o acompanhamento durante o preparo.
- **Instalável e 100% Offline (PWA)** — pode ser adicionado à tela inicial do celular e roda sem internet na peixaria usando cache local.
- **Deep links (Hash router)** — acesse receitas diretamente pela URL (ex: `index.html#tare`).
- **Notas de transcrição** — notas detalhando suposições feitas na ficha original.
- **Acessibilidade nativa** — modal migrado para a tag HTML5 `<dialog>`, garantindo retenção de foco nativa.

## 🗂 Estrutura do projeto

```
receitas-verdemar/
├── app.js             # ponto de entrada principal da aplicação (init de theme, controllers e PWA)
├── index.html          # esqueleto da página (hero, busca, filtros, modal)
├── style.css           # design tokens, tema nori e layouts responsivos
├── manifest.json       # manifesto de configuração do PWA
├── sw.js               # service worker para cache e suporte offline
├── icon.svg            # ícone vetorizado do aplicativo PWA
├── bg.png              # pano de fundo com caligrafia kanji minimalista
└── scripts/            # arquitetura modular MVC (ES6 Modules)
    ├── models/
    │   └── RecipeModel.js     # banco de dados das receitas (RECIPES), categorias e cálculo
    ├── views/
    │   ├── FilterView.js      # renderização dos chips de filtros
    │   ├── RecipeListView.js  # renderização da lista e tickets de receitas
    │   ├── ModalView.js       # modal <dialog> e calculadora de produção
    │   └── ThemeView.js       # gerenciamento do tema claro/escuro
    ├── controllers/
    │   ├── RecipeController.js# orquestrador da lógica de busca, filtros e modais
    │   └── PWAController.js   # registro de SW e atualizações do PWA
    └── utils/
        └── helpers.js         # utilitários (debounce, normalizeText, fmt)
```

Projeto **estático**, sem framework e sem build step — apenas HTML, CSS e JavaScript ES6 puro.

## ▶️ Como rodar

Basta abrir o `index.html` diretamente no navegador, ou servir a pasta com qualquer servidor estático:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## 🧮 Como funciona o cálculo de produção

Cada receita tem um tipo de escala definido em `scripts/models/RecipeModel.js`:

| Tipo | Como funciona | Exemplo |
|---|---|---|
| `weight` | O usuário informa o peso/volume do ingrediente principal. O fator de escala é `valor informado ÷ valor de referência`. | Kg de gengibre, kg de pepino, g de salmão |
| `multiplier` | O usuário informa quantas vezes quer multiplicar o lote da receita (referência = 1). | Molho Tarê, Molho de Arroz Integral |

Ingredientes marcados como `discrete` (itens contáveis, como ovos ou limões) são arredondados de 0,5 em 0,5 unidade.

## ➕ Adicionando uma nova receita

Edite o array `RECIPES` em `scripts/models/RecipeModel.js` e adicione um novo objeto seguindo o mesmo formato:

```js
{
  id: 'nova-receita',
  categoria: 'diversos', // base | arroz | diversos | recheios
  nome: 'Nome da receita',
  medidasPadrao: ['Texto exatamente como está no documento original'],
  scale: { type: 'weight', label: 'Ingrediente principal', unit: 'kg', reference: 10 },
  ingredientes: [
    { nome: 'Ingrediente', base: 100, unit: 'g', decimals: 0 },
  ],
  modoPreparo: 'Descrição do preparo.',
  nota: 'Opcional — use para sinalizar qualquer suposição feita na transcrição.',
}
```

A lista e os filtros são renderizados automaticamente a partir desse array — não é necessário mexer no HTML.

## 📄 Fonte dos dados

Receitas transcritas a partir das fichas técnicas originais da Peixaria Verdemar (documentos em PDF). Alguns valores de referência para o cálculo de produção — como o peso padrão de caixas de insumos — foram assumidos com base em receitas equivalentes do mesmo documento, e estão sinalizados individualmente em cada receita.

## 📌 Uso

Uso interno da Peixaria Verdemar — fichas técnicas de cozinha.
