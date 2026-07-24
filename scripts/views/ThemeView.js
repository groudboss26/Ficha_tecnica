/* =========================================================
   VIEW: GERENCIAMENTO DE TEMA (CLARO / ESCURO)
   ========================================================= */

export class ThemeView {
  constructor(toggleBtnId) {
    this.themeToggle = document.getElementById(toggleBtnId);
  }

  static applyEarlyTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  init() {
    this.applyTheme(this.getTheme());
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.applyTheme(this.getTheme() === 'dark' ? 'light' : 'dark');
      });
    }
  }

  getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (this.themeToggle) {
        this.themeToggle.textContent = '☀️';
        this.themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (this.themeToggle) {
        this.themeToggle.textContent = '🌙';
        this.themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
      }
    }
    localStorage.setItem('theme', theme);
  }
}
