/* =========================================================
   FUNÇÕES AUXILIARES / HELPERS
   ========================================================= */

/**
 * Normaliza string convertendo para minúsculas e removendo acentos/diacríticos.
 * Permite buscar 'acucar' e encontrar 'açúcar', etc.
 */
export function normalizeText(str) {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Utilitário de debounce para adiar execuções repetidas de funções em eventos (ex.: digitação).
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Formata números com a pontuação brasileira.
 */
export function fmt(n, decimals) {
  if (!isFinite(n)) return '0';
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
