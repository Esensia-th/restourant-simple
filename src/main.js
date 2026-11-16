/**
 * main.js — Titik masuk aplikasi Restoran Simple.
 * Merangkai logika game, scene 3D, dan UI.
 */

import {
  createGameState,
  pickRandomMenuId,
  startGame,
  playAgain,
} from './game/game-state.js';
import {
  renderStartScreen,
  renderResultScreen,
  formatRupiah,
} from './ui/screens.js';

/**
 * State aplikasi lokal di memori.
 */
let state = createGameState();

/**
 * Merender layar sesuai dengan state saat ini (awal, main, atau hasil).
 * @param {HTMLElement} root
 */
function renderApp(root) {
  root.textContent = '';

  if (state.screen === 'awal') {
    const startScreen = renderStartScreen({
      onStart: () => {
        const firstMenuId = pickRandomMenuId();
        state = startGame(state, firstMenuId);
        renderApp(root);
      },
    });
    root.appendChild(startScreen);
    return;
  }

  if (state.screen === 'hasil') {
    const resultScreen = renderResultScreen({
      result: state.result,
      totalMoneyIdr: state.totalMoneyIdr,
      onPlayAgain: () => {
        const nextMenuId = pickRandomMenuId();
        state = playAgain(state, nextMenuId);
        renderApp(root);
      },
    });
    root.appendChild(resultScreen);
    return;
  }

  if (state.screen === 'main') {
    // Area permainan aktif (kerangka dasar untuk F1/F2; dilengkapi di T-007 sampai T-012)
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    gameContainer.setAttribute('data-testid', 'game-container');

    const hud = document.createElement('div');
    hud.className = 'game-hud-placeholder';
    hud.setAttribute('data-testid', 'game-hud');
    hud.textContent = `Pelanggan: ${state.customerNumber}/10 | Uang: ${formatRupiah(state.totalMoneyIdr)}`;

    const info = document.createElement('p');
    info.className = 'screen-desc';
    info.setAttribute('data-testid', 'game-info');
    info.textContent = state.order
      ? `Pesanan aktif: ${state.order.menuId} (menunggu racikan)`
      : 'Menunggu pesanan...';

    gameContainer.appendChild(hud);
    gameContainer.appendChild(info);
    root.appendChild(gameContainer);
  }
}

/**
 * Inisialisasi aplikasi.
 */
function init() {
  const app = document.getElementById('app');
  if (!app) return;

  renderApp(app);
}

init();
