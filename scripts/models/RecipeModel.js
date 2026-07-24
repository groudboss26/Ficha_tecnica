/* =========================================================
   MODELO DE DADOS DE RECEITAS & FAVORITOS (MODEL)
   ========================================================= */

import { fmt, normalizeText } from '../utils/helpers.js';

export const CATEGORIES = [
  { id: 'base',      label: 'Molhos de Acompanhamento', color: 'var(--wasabi)' },
  { id: 'arroz',     label: 'Molhos para Arroz',   color: 'var(--amber)' },
  { id: 'diversos',  label: 'Molhos Diversos',     color: 'var(--sea)' },
  { id: 'recheios',  label: 'Recheios & Massas',   color: 'var(--coral)' },
];

export const RECIPES = [
  {
    id: 'gari',
    categoria: 'base',
    nome: 'Molho Gari (Gengibre)',
    medidasPadrao: [
      'Receita padrão: 2 garrafas de vinagre branco (750 ml cada) + 1 kg e 200 g de açúcar refinado',
      'Receita de produção (1 caixa de gengibre): 10 garrafas de vinagre branco (750 ml cada) + 6 kg de açúcar refinado',
    ],
    scale: {
      type: 'weight', label: 'Gengibre', unit: 'kg', reference: 18,
    },
    ingredientes: [
      { nome: 'Vinagre branco', base: 7500, unit: 'ml', decimals: 0 },
      { nome: 'Açúcar refinado', base: 6000, unit: 'g', decimals: 0 },
      { nome: 'Sal (para desidratar)', base: 3600, unit: 'g', decimals: 0 },
    ],
    modoPreparo: 'Raspar a casca do gengibre e fatiar o mais fino possível. Desidratar com sal (200 g de sal para cada 1 kg de gengibre) por cerca de 30 minutos. Lavar bem para retirar o sal. Cozinhar em um caldeirão com água até ficar macio, escorrer bem e misturar ao molho até dissolver o açúcar. Levar ao fogo até ferver.',
    nota: 'O peso da caixa de gengibre não consta no documento original. Usamos 18 kg como referência de cálculo, mesma proporção informada para a caixa de pepino (a receita padrão e de produção são idênticas às do molho sunomono).',
  },
  {
    id: 'sunomono',
    categoria: 'base',
    nome: 'Molho Sunomono (Pepino)',
    medidasPadrao: [
      'Receita padrão: 2 garrafas de vinagre branco (750 ml cada) + 1 kg e 200 g de açúcar refinado',
      'Receita de produção (1 caixa de pepino nacional, ~18 kg): 10 garrafas de vinagre branco (750 ml cada) + 6 kg de açúcar refinado',
    ],
    scale: {
      type: 'weight', label: 'Pepino', unit: 'kg', reference: 18,
    },
    ingredientes: [
      { nome: 'Vinagre branco', base: 7500, unit: 'ml', decimals: 0 },
      { nome: 'Açúcar refinado', base: 6000, unit: 'g', decimals: 0 },
      { nome: 'Sal (para desidratar)', base: 3600, unit: 'g', decimals: 0 },
    ],
    modoPreparo: 'Cortar o pepino ao meio e retirar a polpa, fatiar bem fino e desidratar com sal (200 g de sal para cada 1 kg de pepino fatiado) por 20 minutos. Lavar bem para retirar o sal e espremer para tirar o excesso de líquido. Misturar os ingredientes do molho até dissolver o máximo o açúcar e acrescentar o pepino fatiado.',
  },
  {
    id: 'arroz-integral',
    categoria: 'arroz',
    nome: 'Molho de Arroz Integral',
    medidasPadrao: [
      'Receita: 750 ml de vinagre Castelo (cereal arroz) + 10 g de sal + 40 (sucralon) + 60 g de saquê Azuma Mirim Licoroso',
    ],
    scale: {
      type: 'multiplier', label: 'Multiplicador da receita', unit: 'x', reference: 1,
    },
    ingredientes: [
      { nome: 'Vinagre Castelo (cereal arroz)', base: 750, unit: 'ml', decimals: 0 },
      { nome: 'Sal', base: 10, unit: 'g', decimals: 1 },
      { nome: 'Sucralon', base: 40, unit: 'g', decimals: 0 },
      { nome: 'Saquê Azuma Mirim Licoroso', base: 60, unit: 'g', decimals: 0 },
    ],
    modoPreparo: 'Misturar bem todos os ingredientes.',
    observacao: 'Observação do documento original: para cada 1 kg de arroz integral cozido, usar 200 g deste molho.',
    nota: 'A unidade do item "Sucralon — 40" não foi especificada no documento original; mantivemos o valor em gramas.',
  },
  {
    id: 'tozan',
    categoria: 'arroz',
    nome: 'Molho Tozan (Tempero p/ Arroz)',
    medidasPadrao: [
      'Receita: 20 litros de Molho Tozan + 15 kg de açúcar refinado + 1 kg de sal',
    ],
    scale: {
      type: 'weight', label: 'Molho Tozan', unit: 'L', reference: 20,
    },
    ingredientes: [
      { nome: 'Molho Tozan', base: 20, unit: 'L', decimals: 2 },
      { nome: 'Açúcar refinado', base: 15, unit: 'kg', decimals: 2 },
      { nome: 'Sal', base: 1, unit: 'kg', decimals: 2 },
    ],
    modoPreparo: 'Misturar todos os ingredientes em um caldeirão e levar ao fogo até dissolver o açúcar.',
  },
  {
    id: 'tare',
    categoria: 'base',
    nome: 'Molho Tarê',
    medidasPadrao: [
      'Receita: 1,5 L de saquê + 4 L de shoyo + 10 L de água + 15 pacotes de açúcar refinado + 1 abacaxi cortado em rodelas',
    ],
    scale: {
      type: 'multiplier', label: 'Multiplicador da receita', unit: 'x', reference: 1,
    },
    ingredientes: [
      { nome: 'Saquê', base: 1.5, unit: 'L', decimals: 2 },
      { nome: 'Shoyo', base: 4, unit: 'L', decimals: 2 },
      { nome: 'Água', base: 10, unit: 'L', decimals: 2 },
      { nome: 'Açúcar refinado', base: 15, unit: 'pacote(s)', discrete: true },
      { nome: 'Abacaxi (cortado em rodelas)', base: 1, unit: 'unid.', discrete: true },
    ],
    modoPreparo: 'Misturar os ingredientes em um caldeirão e levar em fogo baixo por aproximadamente 6 horas, até reduzir e ganhar aspecto de mel.',
  },
  {
    id: 'sugo',
    categoria: 'diversos',
    nome: 'Molho Sugo',
    medidasPadrao: [
      'Receita: 1 passata tradicional (680 g) + 100 ml de azeite + 12 g de pimenta tailandesa + 12 g de sal + 8 g de alho frito',
    ],
    scale: {
      type: 'weight', label: 'Passata (molho de tomate)', unit: 'g', reference: 680,
    },
    ingredientes: [
      { nome: 'Passata tradicional', base: 680, unit: 'g', decimals: 0 },
      { nome: 'Azeite', base: 100, unit: 'ml', decimals: 0 },
      { nome: 'Pimenta tailandesa', base: 12, unit: 'g', decimals: 1 },
      { nome: 'Sal', base: 12, unit: 'g', decimals: 1 },
      { nome: 'Alho frito', base: 8, unit: 'g', decimals: 1 },
    ],
    modoPreparo: 'Misturar todos os ingredientes até obter um molho uniforme.',
  },
  {
    id: 'amendoas',
    categoria: 'diversos',
    nome: 'Molho de Amêndoas',
    medidasPadrao: [
      'Receita: 250 g de amêndoas + 350 ml de azeite + meia colher de sopa de tempero limão pepper',
    ],
    scale: {
      type: 'weight', label: 'Amêndoas', unit: 'g', reference: 250,
    },
    ingredientes: [
      { nome: 'Amêndoas', base: 250, unit: 'g', decimals: 0 },
      { nome: 'Azeite', base: 350, unit: 'ml', decimals: 0 },
      { nome: 'Tempero limão pepper', base: 0.5, unit: 'colher(es) de sopa', decimals: 2 },
    ],
    modoPreparo: 'Misturar todos os ingredientes.',
  },
  {
    id: 'mel-limao',
    categoria: 'diversos',
    nome: 'Molho de Mel com Limão',
    medidasPadrao: [
      'Receita: raspas da casca de 4 limões sicilianos + 1 litro de mel',
    ],
    scale: {
      type: 'weight', label: 'Mel', unit: 'L', reference: 1,
    },
    ingredientes: [
      { nome: 'Mel', base: 1, unit: 'L', decimals: 2 },
      { nome: 'Limão siciliano (raspas)', base: 4, unit: 'unid.', discrete: true },
    ],
    modoPreparo: 'Misturar os ingredientes.',
  },
  {
    id: 'mel-maracuja',
    categoria: 'diversos',
    nome: 'Molho de Mel com Maracujá',
    medidasPadrao: [
      'Receita: polpa de 5 maracujás + 500 ml de mel',
    ],
    scale: {
      type: 'weight', label: 'Mel', unit: 'ml', reference: 500,
    },
    ingredientes: [
      { nome: 'Mel', base: 500, unit: 'ml', decimals: 0 },
      { nome: 'Polpa de maracujá', base: 5, unit: 'unid.', discrete: true },
    ],
    modoPreparo: 'Misturar a polpa de maracujá ao mel até incorporar bem.',
    nota: 'O modo de preparo não estava detalhado no documento original; a etapa de mistura segue o mesmo padrão do molho de mel com limão.',
  },
  {
    id: 'tartare-salmao',
    categoria: 'recheios',
    nome: 'Tartare de Salmão (Recheio Jow Sushi)',
    medidasPadrao: [
      'Receita: 200 g de salmão picado + 8 g de cebolinha picada + 30 g de requeijão + 2 g de hondashi',
    ],
    scale: {
      type: 'weight', label: 'Salmão picado', unit: 'g', reference: 200,
    },
    ingredientes: [
      { nome: 'Salmão picado', base: 200, unit: 'g', decimals: 0 },
      { nome: 'Cebolinha picada', base: 8, unit: 'g', decimals: 1 },
      { nome: 'Requeijão', base: 30, unit: 'g', decimals: 0 },
      { nome: 'Hondashi', base: 2, unit: 'g', decimals: 1 },
    ],
    modoPreparo: 'Misturar todos os ingredientes até formar o recheio.',
    nota: 'O modo de preparo não estava detalhado no documento original — a etapa de mistura foi inferida a partir do padrão dos demais recheios.',
  },
  {
    id: 'massa-hot',
    categoria: 'recheios',
    nome: 'Massa Hot',
    medidasPadrao: [
      'Receita: 500 g de farinha de trigo + 2 ovos',
    ],
    scale: {
      type: 'weight', label: 'Farinha de trigo', unit: 'g', reference: 500,
    },
    ingredientes: [
      { nome: 'Farinha de trigo', base: 500, unit: 'g', decimals: 0 },
      { nome: 'Ovos', base: 2, unit: 'unid.', discrete: true },
    ],
    modoPreparo: 'Modo de preparo não detalhado no documento original — receita transcrita apenas com a lista de ingredientes.',
  },
];

// Índice de busca pré-computado
const SEARCH_INDEX = RECIPES.map(r => ({
  id: r.id,
  text: normalizeText([r.nome, ...r.ingredientes.map(i => i.nome)].join(' ')),
}));
const SEARCH_INDEX_MAP = new Map(SEARCH_INDEX.map(e => [e.id, e.text]));

/* =========================================================
   Favoritos
   ========================================================= */

const FAV_KEY = 'receitas-verdemar-favoritos';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs;
}

/* =========================================================
   Cálculo e Metadados
   ========================================================= */

export function categoryMeta(id) {
  return CATEGORIES.find(c => c.id === id);
}

export function scaledIngredient(ing, factor) {
  const raw = ing.base * factor;
  if (ing.discrete) {
    const rounded = Math.round(raw * 2) / 2;
    const decimals = (rounded % 1 === 0) ? 0 : 1;
    return { value: rounded, text: fmt(rounded, decimals) };
  }
  const decimals = ing.decimals ?? 0;
  return { value: raw, text: fmt(raw, decimals) };
}

export function getIncrement(recipe) {
  if (recipe.scale.type === 'multiplier') {
    return 0.5;
  }
  const unit = recipe.scale.unit;
  const ref = recipe.scale.reference;

  if (unit === 'g' || unit === 'ml') {
    if (ref >= 500) return 100;
    if (ref >= 100) return 50;
    return 10;
  }
  if (ref >= 10) return 1;
  return 0.5;
}

export function getRecipeById(id) {
  return RECIPES.find(r => r.id === id);
}

export function getFilteredRecipes(activeCategory, searchQuery) {
  let filtered = RECIPES;

  if (activeCategory === 'favoritos') {
    filtered = RECIPES.filter(r => isFavorite(r.id));
  } else if (activeCategory !== 'all') {
    filtered = RECIPES.filter(r => r.categoria === activeCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(r => SEARCH_INDEX_MAP.get(r.id)?.includes(searchQuery));
  }

  return filtered;
}
