/* =========================================================
   VIEW: MODAL DE RECEITA & CALCULADORA DINÂMICA
   ========================================================= */

import { categoryMeta, isFavorite, scaledIngredient, getIncrement } from '../models/RecipeModel.js';

export class ModalView {
  constructor(dialogId, contentId, closeBtnId) {
    this.dialog = document.getElementById(dialogId);
    this.modalContent = document.getElementById(contentId);
    this.modalClose = document.getElementById(closeBtnId);
    this.lastFocused = null;

    this.initEvents();
  }

  initEvents() {
    this.modalClose.addEventListener('click', () => this.close());

    // Evento nativo de fechamento (ex: tecla Esc)
    this.dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
      if (window.location.hash) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    });

    // Fechar ao clicar no backdrop nativo
    this.dialog.addEventListener('click', (e) => {
      const rect = this.dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        this.close();
      }
    });
  }

  open(recipe, onToggleFav) {
    this.lastFocused = document.activeElement;
    this.modalContent.innerHTML = this.buildModalHTML(recipe);
    this.wireScaleInput(recipe);
    this.wireChecklists();
    this.wireFavoriteModalBtn(recipe, onToggleFav);

    // Abrir modal nativo
    this.dialog.showModal();
    document.body.style.overflow = 'hidden';

    // Setar hash de link direto
    window.location.hash = recipe.id;

    const input = this.modalContent.querySelector('.scale-panel__input');
    if (input) setTimeout(() => input.focus({ preventScroll: true }), 100);
  }

  close() {
    if (this.dialog.open) {
      this.dialog.close();
    }
    document.body.style.overflow = '';

    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    if (this.lastFocused) {
      this.lastFocused.focus({ preventScroll: true });
    }
  }

  buildModalHTML(recipe) {
    const cat = categoryMeta(recipe.categoria);
    const defaultValue = recipe.scale.reference;
    const isFav = isFavorite(recipe.id);

    const standardList = recipe.medidasPadrao.map(t => `<li>${t}</li>`).join('');

    const steps = recipe.modoPreparo
      .split(/\.\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map((s) => {
        const text = s.endsWith('.') ? s : s + '.';
        return `
          <li class="prep-step">
            <span class="prep-step__cb">✓</span>
            <span class="prep-step__text">${text}</span>
          </li>
        `;
      })
      .join('');

    const inc = getIncrement(recipe);
    const incLabel = recipe.scale.type === 'weight' ? `${inc} ${recipe.scale.unit}` : `${inc}x`;

    return `
      <div class="mheader">
        <span class="mtag" style="border-color:${cat.color}; color:${cat.color}">${cat.label}</span>
        <button class="mfav-btn ${isFav ? 'is-active' : ''}" type="button" data-modal-fav="${recipe.id}" aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          ${isFav ? '★' : '☆'}
        </button>
      </div>
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
            step="${inc}"
            min="0"
            value="${defaultValue}"
            data-scale-input
            aria-label="${recipe.scale.label} (${recipe.scale.unit})"
          />
          <span class="scale-panel__unit">${recipe.scale.unit} · ${recipe.scale.label}</span>
        </div>
        
        <div class="scale-panel__steps-label">Ajuste Fino</div>
        <div class="scale-panel__steps">
          <button type="button" class="step-btn" data-step-delta="-${inc}">−${incLabel}</button>
          <button type="button" class="step-btn" data-step-reset>padrão</button>
          <button type="button" class="step-btn" data-step-delta="${inc}">+${incLabel}</button>
        </div>

        <div class="scale-panel__steps-label">Multiplicadores rápidos</div>
        <div class="scale-panel__multipliers">
          <button type="button" class="step-btn" data-scale-mult="0.5">0.5x</button>
          <button type="button" class="step-btn" data-scale-mult="1">1x</button>
          <button type="button" class="step-btn" data-scale-mult="2">2x</button>
          <button type="button" class="step-btn" data-scale-mult="3">3x</button>
          <button type="button" class="step-btn" data-scale-mult="5">5x</button>
        </div>
      </div>

      <h3 class="msection-title">Ingredientes calculados <span style="font-size:0.65rem; color:var(--text-faint); font-weight:normal; text-transform:none;">(toque para riscar)</span></h3>
      <ul class="ingredients" data-ingredients>
        ${recipe.ingredientes.map((ing, i) => `
          <li class="ing-item">
            <span class="ing__name">${ing.nome}</span>
            <span class="ing__amount" data-ing-index="${i}">—</span>
          </li>
        `).join('')}
      </ul>

      <h3 class="msection-title">Modo de preparo <span style="font-size:0.65rem; color:var(--text-faint); font-weight:normal; text-transform:none;">(toque para marcar passos)</span></h3>
      <ul class="prep-list">
        ${steps}
      </ul>

      ${recipe.observacao ? `<div class="mnote"><strong>Observação: </strong>${recipe.observacao}</div>` : ''}
      ${recipe.nota ? `<div class="mnote"><strong>Nota de transcrição: </strong>${recipe.nota}</div>` : ''}
    `;
  }

  wireScaleInput(recipe) {
    const input = this.modalContent.querySelector('[data-scale-input]');
    const amountEls = this.modalContent.querySelectorAll('[data-ing-index]');
    const multBtns = this.modalContent.querySelectorAll('[data-scale-mult]');

    const update = () => {
      let value = parseFloat(input.value);
      if (isNaN(value) || value < 0) value = 0;

      const factor = recipe.scale.type === 'weight'
        ? value / recipe.scale.reference
        : value;

      recipe.ingredientes.forEach((ing, i) => {
        const result = scaledIngredient(ing, factor);
        amountEls[i].textContent = `${result.text} ${ing.unit}`;
      });

      const currentMult = recipe.scale.type === 'weight'
        ? value / recipe.scale.reference
        : value;

      multBtns.forEach(btn => {
        const multVal = parseFloat(btn.getAttribute('data-scale-mult'));
        if (Math.abs(currentMult - multVal) < 0.001) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });
    };

    input.addEventListener('input', update);

    this.modalContent.querySelectorAll('.step-btn[data-step-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.getAttribute('data-step-delta'));
        const current = parseFloat(input.value) || 0;
        input.value = Math.max(0, current + delta);
        update();
      });
    });

    const resetBtn = this.modalContent.querySelector('.step-btn[data-step-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        input.value = recipe.scale.reference;
        update();
      });
    }

    multBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mult = parseFloat(btn.getAttribute('data-scale-mult'));
        input.value = recipe.scale.type === 'weight'
          ? recipe.scale.reference * mult
          : mult;
        update();
      });
    });

    update();
  }

  wireChecklists() {
    this.modalContent.querySelectorAll('.ing-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('is-checked');
      });
    });

    this.modalContent.querySelectorAll('.prep-step').forEach(step => {
      step.addEventListener('click', () => {
        step.classList.toggle('is-checked');
      });
    });
  }

  wireFavoriteModalBtn(recipe, onToggleFav) {
    const favBtn = this.modalContent.querySelector('[data-modal-fav]');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        onToggleFav(recipe.id);
        const isFav = isFavorite(recipe.id);
        favBtn.classList.toggle('is-active', isFav);
        favBtn.innerHTML = isFav ? '★' : '☆';
        favBtn.setAttribute('aria-label', isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
      });
    }
  }
}
