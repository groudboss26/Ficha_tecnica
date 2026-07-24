/* =========================================================
   CONTROLLER: CONTROLADOR PRINCIPAL DE RECEITAS
   ========================================================= */

import { getFilteredRecipes, toggleFavorite, getRecipeById } from '../models/RecipeModel.js';
import { FilterView } from '../views/FilterView.js';
import { RecipeListView } from '../views/RecipeListView.js';
import { ModalView } from '../views/ModalView.js';
import { debounce, normalizeText } from '../utils/helpers.js';

export class RecipeController {
  constructor() {
    this.activeCategory = 'all';
    this.searchQuery = '';

    this.filterView = new FilterView('filters');
    this.recipeListView = new RecipeListView('recipeList');
    this.modalView = new ModalView('recipeDialog', 'modalContent', 'modalClose');

    this.searchInput = document.getElementById('searchInput');
    this.searchClear = document.getElementById('searchClear');
  }

  init() {
    this.bindSearchEvents();
    this.bindHashEvents();
    this.render();
    this.handleHash();
  }

  render() {
    const filtered = getFilteredRecipes(this.activeCategory, this.searchQuery);

    this.filterView.render(this.activeCategory, (newCategory) => {
      this.activeCategory = newCategory;
      this.render();
    });

    this.recipeListView.render(
      filtered,
      this.searchQuery,
      (recipe) => this.openRecipeModal(recipe),
      (recipeId) => this.handleToggleFavorite(recipeId)
    );
  }

  handleToggleFavorite(recipeId) {
    toggleFavorite(recipeId);
    this.render();
  }

  openRecipeModal(recipe) {
    this.modalView.open(recipe, (id) => this.handleToggleFavorite(id));
  }

  bindSearchEvents() {
    if (!this.searchInput) return;

    const handleSearchInput = debounce((e) => {
      this.searchQuery = normalizeText(e.target.value.trim());
      if (this.searchClear) {
        this.searchClear.style.display = this.searchQuery ? 'block' : 'none';
      }
      this.render();
    }, 150);

    this.searchInput.addEventListener('input', handleSearchInput);

    if (this.searchClear) {
      this.searchClear.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.searchClear.style.display = 'none';
        this.searchInput.focus();
        this.render();
      });
    }
  }

  bindHashEvents() {
    window.addEventListener('hashchange', () => this.handleHash());
  }

  handleHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const recipe = getRecipeById(hash);
      if (recipe) {
        this.openRecipeModal(recipe);
        return;
      }
    }
    this.modalView.close();
  }
}
