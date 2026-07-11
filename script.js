/* =========================================================
   RECEITAS VERDEMAR — dados transcritos das fichas técnicas
   ========================================================= */

const CATEGORIES = [
  { id: 'base',      label: 'Molhos Base',        color: 'var(--wasabi)' },
  { id: 'arroz',     label: 'Molhos para Arroz',   color: 'var(--amber)' },
  { id: 'diversos',  label: 'Molhos Diversos',     color: 'var(--sea)' },
  { id: 'recheios',  label: 'Recheios & Massas',   color: 'var(--coral)' },
];

/*
  scale.type:
   - "weight": o usuário informa o peso/volume do ingrediente principal
     (ex.: kg de gengibre). fator = valorInformado / scale.reference
   - "multiplier": o usuário informa quantas vezes quer multiplicar o lote.
     fator = valorInformado (reference = 1)

  ingrediente.discrete: itens contáveis (unidades), arredondados de 0.5 em 0.5
*/

const RECIPES = [
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
    categoria: 'arroz',
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

/* =========================================================
   Helpers
   ========================================================= */

function fmt(n, decimals){
  if (!isFinite(n)) return '0';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

function scaledIngredient(ing, factor){
  const raw = ing.base * factor;
  if (ing.discrete){
    const rounded = Math.round(raw * 2) / 2; // arredonda de 0.5 em 0.5
    const decimals = (rounded % 1 === 0) ? 0 : 1;
    return { value: rounded, text: fmt(rounded, decimals) };
  }
  const decimals = ing.decimals ?? 0;
  return { value: raw, text: fmt(raw, decimals) };
}

function categoryMeta(id){
  return CATEGORIES.find(c => c.id === id);
}

/* =========================================================
   Rendering — recipe list
   ========================================================= */

const listEl = document.getElementById('recipeList');
const filtersEl = document.getElementById('filters');

let activeCategory = 'all';

function renderFilters(){
  const chips = [{ id: 'all', label: 'Todas' }, ...CATEGORIES];
  filtersEl.innerHTML = '';
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.type = 'button';
    btn.textContent = chip.label;
    btn.setAttribute('aria-pressed', String(chip.id === activeCategory));
    btn.addEventListener('click', () => {
      activeCategory = chip.id;
      renderFilters();
      renderList();
    });
    filtersEl.appendChild(btn);
  });
}

function renderList(){
  listEl.innerHTML = '';
  const cats = activeCategory === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === activeCategory);

  cats.forEach(cat => {
    const items = RECIPES.filter(r => r.categoria === cat.id);
    if (!items.length) return;

    const group = document.createElement('div');
    group.className = 'recipe-group';

    const title = document.createElement('h2');
    title.className = 'recipe-group__title';
    title.textContent = cat.label;
    group.appendChild(title);

    items.forEach(recipe => {
      const btn = document.createElement('button');
      btn.className = 'ticket';
      btn.type = 'button';
      btn.setAttribute('aria-haspopup', 'dialog');

      const bar = document.createElement('span');
      bar.className = 'ticket__bar';
      bar.style.background = cat.color;
      btn.appendChild(bar);

      const body = document.createElement('span');
      body.className = 'ticket__body';

      const name = document.createElement('span');
      name.className = 'ticket__name';
      name.textContent = recipe.nome;
      body.appendChild(name);

      const ref = document.createElement('span');
      ref.className = 'ticket__ref';
      ref.textContent = recipe.scale.type === 'weight'
        ? `Referência: ${fmt(recipe.scale.reference, 2)} ${recipe.scale.unit} de ${recipe.scale.label.toLowerCase()}`
        : 'Escala por multiplicador de lote';
      body.appendChild(ref);

      btn.appendChild(body);

      const chevron = document.createElement('span');
      chevron.className = 'ticket__chevron';
      chevron.textContent = '›';
      btn.appendChild(chevron);

      btn.addEventListener('click', () => openModal(recipe));
      group.appendChild(btn);
    });

    listEl.appendChild(group);
  });
}

/* =========================================================
   Modal + live scale calculator
   ========================================================= */

const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

let lastFocused = null;

function openModal(recipe){
  lastFocused = document.activeElement;
  modalContent.innerHTML = buildModalHTML(recipe);
  wireScaleInput(recipe);

  modal.classList.add('is-open');
  modalBackdrop.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const input = modalContent.querySelector('.scale-panel__input');
  if (input) setTimeout(() => input.focus({ preventScroll: true }), 260);
}

function closeModal(){
  modal.classList.remove('is-open');
  modalBackdrop.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus({ preventScroll: true });
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

function buildModalHTML(recipe){
  const cat = categoryMeta(recipe.categoria);
  const defaultValue = recipe.scale.reference;

  const standardList = recipe.medidasPadrao.map(t => `<li>${t}</li>`).join('');

  return `
    <span class="mtag" style="border-color:${cat.color}; color:${cat.color}">${cat.label}</span>
    <h2 class="mtitle" id="modalTitle">${recipe.nome}</h2>

    <div class="mstandard">
      <div class="mstandard__label">Medidas padrão (documento original)</div>
      <ul>${standardList}</ul>
    </div>

    <div class="scale-panel">
      <div class="scale-panel__label">Calcular produção</div>
      <div class="scale-panel__row">
        <input
          class="scale-panel__input"
          type="number"
          inputmode="decimal"
          step="0.1"
          min="0"
          value="${defaultValue}"
          data-scale-input
          aria-label="${recipe.scale.label} (${recipe.scale.unit})"
        />
        <span class="scale-panel__unit">${recipe.scale.unit} · ${recipe.scale.label}</span>
      </div>
      <div class="scale-panel__steps">
        <button type="button" class="step-btn" data-step="-1">−1</button>
        <button type="button" class="step-btn" data-step="0">padrão</button>
        <button type="button" class="step-btn" data-step="1">+1</button>
      </div>
    </div>

    <h3 class="msection-title">Ingredientes calculados</h3>
    <ul class="ingredients" data-ingredients>
      ${recipe.ingredientes.map((ing, i) => `
        <li>
          <span class="ing__name">${ing.nome}</span>
          <span class="ing__amount" data-ing-index="${i}">—</span>
        </li>
      `).join('')}
    </ul>

    <h3 class="msection-title">Modo de preparo</h3>
    <p class="mprep">${recipe.modoPreparo}</p>

    ${recipe.observacao ? `<div class="mnote"><strong>Observação: </strong>${recipe.observacao}</div>` : ''}
    ${recipe.nota ? `<div class="mnote"><strong>Nota de transcrição: </strong>${recipe.nota}</div>` : ''}
  `;
}

function wireScaleInput(recipe){
  const input = modalContent.querySelector('[data-scale-input]');
  const amountEls = modalContent.querySelectorAll('[data-ing-index]');

  function update(){
    let value = parseFloat(input.value);
    if (isNaN(value) || value < 0) value = 0;

    const factor = recipe.scale.type === 'weight'
      ? value / recipe.scale.reference
      : value; // multiplier: reference é 1

    recipe.ingredientes.forEach((ing, i) => {
      const result = scaledIngredient(ing, factor);
      amountEls[i].textContent = `${result.text} ${ing.unit}`;
    });
  }

  input.addEventListener('input', update);

  modalContent.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      if (step === '0'){
        input.value = recipe.scale.reference;
      } else {
        const delta = recipe.scale.type === 'weight' ? Number(step) : Number(step) * 0.5;
        const current = parseFloat(input.value) || 0;
        input.value = Math.max(0, current + delta);
      }
      update();
    });
  });

  update();
}

/* =========================================================
   Init
   ========================================================= */

renderFilters();
renderList();
