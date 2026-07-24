/* =========================================================
   VIEW: RENDERIZAÇÃO DOS FILTROS (CATEGORIAS)
   ========================================================= */

import { CATEGORIES, getFavorites } from '../models/RecipeModel.js';

export class FilterView {
  constructor(filtersContainerId) {
    this.container = document.getElementById(filtersContainerId);
  }

  render(activeCategory, onCategoryChange) {
    const chips = [
      { id: 'all', label: 'Todas' },
      { id: 'favoritos', label: '⭐ Favoritas' },
      ...CATEGORIES
    ];

    this.container.innerHTML = '';

    chips.forEach(chip => {
      // Exibe a categoria de Favoritas apenas se houver favoritos salvos ou se ela for a atual selecionada
      if (chip.id === 'favoritos' && getFavorites().length === 0 && activeCategory !== 'favoritos') {
        return;
      }

      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.type = 'button';
      btn.textContent = chip.label;
      btn.setAttribute('aria-pressed', String(chip.id === activeCategory));
      btn.addEventListener('click', () => {
        onCategoryChange(chip.id);
      });
      this.container.appendChild(btn);
    });
  }
}
