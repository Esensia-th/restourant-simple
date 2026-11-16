/**
 * main.js — Titik masuk aplikasi Restoran Simple.
 * Merangkai logika game, scene 3D, dan UI.
 */

import {
  createGameState,
  pickRandomMenuId,
  startGame,
  playAgain,
  pauseGame,
  resumeGame,
  tickGame,
  TOTAL_CUSTOMERS,
} from './game/game-state.js';
import {
  renderStartScreen,
  renderResultScreen,
} from './ui/screens.js';
import { renderHUD } from './ui/hud.js';

/**
 * State aplikasi lokal di memori.
 */
let state = createGameState();

/**
 * ID requestAnimationFrame untuk game loop.
 */
let animationFrameId = null;
let lastTimestamp = 0;

/**
 * Loop waktu permainan (F4): memajukan jam game secara halus dengan requestAnimationFrame.
 * @param {number} timestamp
 * @param {HTMLElement} root
 */
function gameLoop(timestamp, root) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaSeconds = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (state.screen === 'main') {
    // Majukan waktu state hanya bila tidak dijeda dan delta valid
    if (!state.paused && deltaSeconds > 0 && deltaSeconds < 1) {
      const nextState = tickGame(state, deltaSeconds);
      if (nextState !== state) {
        state = nextState;
        renderApp(root);
      }
    }
    animationFrameId = requestAnimationFrame((ts) => gameLoop(ts, root));
  } else {
    stopGameLoop();
  }
}

function startGameLoop(root) {
  stopGameLoop();
  lastTimestamp = 0;
  animationFrameId = requestAnimationFrame((ts) => gameLoop(ts, root));
}

function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/**
 * Merender layar sesuai dengan state saat ini (awal, main, atau hasil).
 * @param {HTMLElement} root
 */
function renderApp(root) {
  root.textContent = '';

  if (state.screen === 'awal') {
    stopGameLoop();
    const startScreen = renderStartScreen({
      onStart: () => {
        const firstMenuId = pickRandomMenuId();
        state = startGame(state, firstMenuId);
        renderApp(root);
        startGameLoop(root);
      },
    });
    root.appendChild(startScreen);
    return;
  }

  if (state.screen === 'hasil') {
    stopGameLoop();
    const resultScreen = renderResultScreen({
      result: state.result,
      totalMoneyIdr: state.totalMoneyIdr,
      onPlayAgain: () => {
        const nextMenuId = pickRandomMenuId();
        state = playAgain(state, nextMenuId);
        renderApp(root);
        startGameLoop(root);
      },
    });
    root.appendChild(resultScreen);
    return;
  }

  if (state.screen === 'main') {
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    gameContainer.setAttribute('data-testid', 'game-container');

    // Komponen HUD (F4, F2)
    const hud = renderHUD({
      customerNumber: state.customerNumber,
      totalCustomers: TOTAL_CUSTOMERS,
      timeLeftSeconds: state.order ? state.order.timeLeftSeconds : 30,
      totalMoneyIdr: state.totalMoneyIdr,
      paused: state.paused,
      onPause: () => {
        state = pauseGame(state);
        renderApp(root);
      },
      onResume: () => {
        state = resumeGame(state);
        renderApp(root);
      },
    });
    gameContainer.appendChild(hud);

    // Banner saat dijeda
    if (state.paused) {
      const pausedBanner = document.createElement('div');
      pausedBanner.className = 'paused-banner';
      pausedBanner.setAttribute('data-testid', 'paused-banner');
      pausedBanner.textContent = 'Permainan Dijeda. Tekan Resume untuk melanjutkan.';
      gameContainer.appendChild(pausedBanner);
    }

    // Area konten permainan (dialog pelanggan & scene 3D, dilengkapi di T-008 & T-009)
    const info = document.createElement('p');
    info.className = 'screen-desc';
    info.setAttribute('data-testid', 'game-info');
    info.textContent = state.order
      ? `Pesanan aktif: ${state.order.menuId} (menunggu racikan)`
      : 'Menunggu pesanan...';
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
