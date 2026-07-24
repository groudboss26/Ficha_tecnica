/* =========================================================
   CONTROLLER: REGISTRO DO SERVICE WORKER & ATUALIZAÇÕES PWA
   ========================================================= */

export class PWAController {
  static init() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      const updateToast   = document.getElementById('updateToast');
      const updateBtn     = document.getElementById('updateBtn');
      const updateDismiss = document.getElementById('updateDismiss');
      let pendingSW = null;

      function showUpdateToast(sw) {
        if (pendingSW) return;
        pendingSW = sw;
        updateToast.hidden = false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            updateToast.classList.add('update-toast--visible');
          });
        });
      }

      function hideUpdateToast() {
        updateToast.classList.remove('update-toast--visible');
        updateToast.addEventListener('transitionend', () => {
          updateToast.hidden = true;
          pendingSW = null;
        }, { once: true });
      }

      if (updateBtn) {
        updateBtn.addEventListener('click', () => {
          if (!pendingSW) return;
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          }, { once: true });
          pendingSW.postMessage({ type: 'SKIP_WAITING' });
          hideUpdateToast();
        });
      }

      if (updateDismiss) {
        updateDismiss.addEventListener('click', hideUpdateToast);
      }

      function trackInstalling(sw) {
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateToast(sw);
          }
        });
      }

      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
        .then(reg => {
          if (reg.waiting) {
            showUpdateToast(reg.waiting);
            return;
          }
          if (reg.installing) {
            trackInstalling(reg.installing);
          }
          reg.addEventListener('updatefound', () => {
            trackInstalling(reg.installing);
          });
        })
        .catch(err => console.error('Erro ao registrar Service Worker:', err));
    });
  }
}
