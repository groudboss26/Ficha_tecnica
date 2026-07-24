/* =========================================================
   VIEW: RENDERIZAÇÃO DA LISTA DE RECEITAS
   ========================================================= */

import { CATEGORIES, isFavorite } from '../models/RecipeModel.js';
import { fmt } from '../utils/helpers.js';

export class RecipeListView {
  constructor(listContainerId) {
    this.container = document.getElementById(listContainerId);
  }

  render(filteredRecipes, searchQuery, onRecipeClick, onToggleFav) {
    this.container.innerHTML = '';

    if (filteredRecipes.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'footer__note';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.padding = '40px 20px';
      emptyMsg.textContent = searchQuery
        ? 'Nenhuma receita encontrada para a busca.'
        : 'Nenhuma receita favoritada ainda.';
      this.container.appendChild(emptyMsg);
      return;
    }

    // Agrupar receitas por categoria
    const groupMap = new Map(CATEGORIES.map(c => [c.id, []]));
    filteredRecipes.forEach(r => groupMap.get(r.categoria)?.push(r));
    const catsToShow = CATEGORIES.filter(cat => (groupMap.get(cat.id) ?? []).length > 0);

    catsToShow.forEach(cat => {
      const items = groupMap.get(cat.id);
      if (!items.length) return;

      const group = document.createElement('div');
      group.className = 'recipe-group';

      const title = document.createElement('h2');
      title.className = 'recipe-group__title';
      title.textContent = cat.label;
      group.appendChild(title);

      items.forEach(recipe => {
        const ticketContainer = document.createElement('div');
        ticketContainer.className = 'ticket-container';

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

        // Botão de Favorito no Ticket
        const isFav = isFavorite(recipe.id);
        const favBtn = document.createElement('button');
        favBtn.type = 'button';
        favBtn.className = 'ticket__fav' + (isFav ? ' is-active' : '');
        favBtn.innerHTML = isFav ? '★' : '☆';
        favBtn.setAttribute('aria-label', isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onToggleFav(recipe.id);
        });
        ticketContainer.appendChild(favBtn);

        const chevron = document.createElement('span');
        chevron.className = 'ticket__chevron';
        chevron.textContent = '›';
        btn.appendChild(chevron);

        btn.addEventListener('click', () => onRecipeClick(recipe));
        ticketContainer.appendChild(btn);
        group.appendChild(ticketContainer);
      });

      this.container.appendChild(group);
    });
  }
}
