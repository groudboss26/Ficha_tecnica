/* =========================================================
   RECEITAS VERDEMAR — PONTO DE ENTRADA PRINCIPAL (APP.JS)
   ========================================================= */

import { ThemeView } from './scripts/views/ThemeView.js';
import { RecipeController } from './scripts/controllers/RecipeController.js';
import { PWAController } from './scripts/controllers/PWAController.js';

// Aplica o tema salvo IMEDIATAMENTE (antes da renderização) para evitar flash de cor errada
ThemeView.applyEarlyTheme();

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização das Views e Controllers
  const themeView = new ThemeView('themeToggle');
  themeView.init();

  const recipeController = new RecipeController();
  recipeController.init();

  PWAController.init();
});
