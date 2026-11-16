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
  selectIngredient,
  beginProcess,
  TOTAL_CUSTOMERS,
} from './game/game-state.js';
import { getProcessProgress } from './game/timer.js';
import {
  renderStartScreen,
  renderResultScreen,
  formatRupiah,
} from './ui/screens.js';
import { renderHUD } from './ui/hud.js';
import { renderCustomerDialog } from './ui/customer-dialog.js';
import { initKitchenScene } from './scene/kitchen-scene.js';

/**
 * State aplikasi lokal di memori.
 */
let state = createGameState();

/**
 * Layar aktif saat ini ('awal' | 'main' | 'hasil').
 */
let currentScreen = null;

/**
 * Kontroler Three.js scene aktif.
 */
let kitchenSceneController = null;

/**
 * ID requestAnimationFrame untuk game loop.
 */
let animationFrameId = null;
let lastTimestamp = 0;

/**
 * Referensi elemen DOM yang diperbarui secara in-place selama layar 'main'.
 */
let gameContainerEl = null;
let hudEl = null;
let hudCustomerValueEl = null;
let hudTimerValueEl = null;
let hudTimerBoxEl = null;
let hudTimerLabelEl = null;
let hudMoneyValueEl = null;
let hudActionBoxEl = null;
let pausedBannerEl = null;
let customerSectionEl = null;
let currentCustomerNumber = null;
let currentCustomerMenuId = null;
let statusItemEl = null;
let processBarEl = null;
let processBarFillEl = null;
let processLabelEl = null;

/**
 * Pemetaan alat 3D ke action proses (dari SPEC.json).
 */
const TOOL_ACTION_MAP = {
  'kompor': 'goreng',
  'penggorengan': 'goreng',
  'spatula': 'aduk',
  'alat pembuat kopi': 'seduh',
  'wadah es batu': null,
  'galon air': null,
  'blender buah': 'blender',
};

/**
 * Alat yang menambah bahan, bukan menjalankan proses.
 */
const TOOL_INGREDIENT_MAP = {
  'wadah es batu': 'es batu',
  'galon air': 'air',
};

/**
 * Menangani klik pada objek 3D dapur — disambungkan ke selectIngredient / beginProcess.
 * @param {{ id: string, name: string, type: 'tool' | 'ingredient' }} item
 */
function handleSceneSelect(item) {
  if (!item || state.paused || state.screen !== 'main') return;

  if (item.type === 'ingredient') {
    const next = selectIngredient(state, item.id);
    if (next !== state) {
      state = next;
      if (kitchenSceneController) kitchenSceneController.markIngredientUsed(item.id);
      updateMainUI(state);
    }
    return;
  }

  if (item.type === 'tool') {
    // Cek apakah alat ini menambah bahan
    const ingredientId = TOOL_INGREDIENT_MAP[item.id];
    if (ingredientId) {
      const next = selectIngredient(state, ingredientId);
      if (next !== state) {
        state = next;
        if (kitchenSceneController) kitchenSceneController.markIngredientUsed(ingredientId);
        updateMainUI(state);
      }
      return;
    }

    // Jalankan proses
    const action = TOOL_ACTION_MAP[item.id];
    if (action) {
      let toolKey = item.id;
      if (item.id === 'kompor' || item.id === 'penggorengan') {
        toolKey = 'kompor + penggorengan';
      }
      const next = beginProcess(state, { action, tool: toolKey });
      if (next !== state) {
        state = next;
        updateMainUI(state);
      }
    }
  }
}

/**
 * Memperbarui tampilan UI layar main secara in-place tanpa menghapus canvas 3D.
 * @param {typeof state} currentState
 */
function updateMainUI(currentState) {
  // 1. Perbarui HUD
  if (hudCustomerValueEl) {
    hudCustomerValueEl.textContent = `${currentState.customerNumber}/${TOTAL_CUSTOMERS}`;
  }

  if (hudTimerValueEl) {
    const timeLeft = currentState.order ? currentState.order.timeLeftSeconds : 30;
    hudTimerValueEl.textContent = `${Math.max(0, Math.ceil(timeLeft))}s`;
  }

  if (hudTimerBoxEl) {
    if (currentState.paused) {
      hudTimerBoxEl.className = 'hud-item hud-timer hud-timer-paused';
      if (hudTimerLabelEl) hudTimerLabelEl.textContent = 'Timer (Dijeda)';
    } else {
      hudTimerBoxEl.className = 'hud-item hud-timer';
      if (hudTimerLabelEl) hudTimerLabelEl.textContent = 'Sisa Waktu';
    }
  }

  if (hudMoneyValueEl) {
    hudMoneyValueEl.textContent = formatRupiah(currentState.totalMoneyIdr);
  }

  if (hudActionBoxEl) {
    hudActionBoxEl.textContent = '';
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    if (currentState.paused) {
      toggleBtn.className = 'btn btn-secondary';
      toggleBtn.setAttribute('data-testid', 'btn-resume');
      toggleBtn.textContent = 'Resume';
      toggleBtn.addEventListener('click', () => {
        state = resumeGame(state);
        updateMainUI(state);
      });
    } else {
      toggleBtn.className = 'btn btn-neutral';
      toggleBtn.setAttribute('data-testid', 'btn-pause');
      toggleBtn.textContent = 'Pause';
      toggleBtn.addEventListener('click', () => {
        state = pauseGame(state);
        updateMainUI(state);
      });
    }
    hudActionBoxEl.appendChild(toggleBtn);
  }

  // 2. Banner dijeda
  if (pausedBannerEl && gameContainerEl) {
    if (currentState.paused) {
      if (!gameContainerEl.contains(pausedBannerEl)) {
        if (hudEl && hudEl.nextSibling) {
          gameContainerEl.insertBefore(pausedBannerEl, hudEl.nextSibling);
        } else {
          gameContainerEl.appendChild(pausedBannerEl);
        }
      }
    } else {
      if (gameContainerEl.contains(pausedBannerEl)) {
        pausedBannerEl.remove();
      }
    }
  }

  // 3. Pelanggan 2D & Dialog Pesanan
  if (customerSectionEl && currentState.order) {
    if (
      currentCustomerNumber !== currentState.customerNumber ||
      currentCustomerMenuId !== currentState.order.menuId
    ) {
      currentCustomerNumber = currentState.customerNumber;
      currentCustomerMenuId = currentState.order.menuId;
      const newDialog = renderCustomerDialog({
        customerNumber: currentState.customerNumber,
        menuId: currentState.order.menuId,
      });
      customerSectionEl.replaceWith(newDialog);
      customerSectionEl = newDialog;
      if (kitchenSceneController) {
        kitchenSceneController.resetIngredientMarks();
      }
    }
  }

  // 4. Scene 3D & Indikator Progres Proses
  if (kitchenSceneController) {
    kitchenSceneController.setPaused(currentState.paused);

    if (currentState.order) {
      const progress = getProcessProgress(currentState.order);
      const activeTool = currentState.order.activeProcess
        ? currentState.order.activeProcess.tool
        : null;
      kitchenSceneController.showProcessProgress(activeTool, progress);

      if (processBarEl && processBarFillEl && processLabelEl) {
        if (activeTool && progress > 0 && progress < 1) {
          processBarEl.style.display = 'flex';
          processBarFillEl.style.width = `${Math.round(progress * 100)}%`;
          processLabelEl.textContent = `Memproses… ${Math.ceil((1 - progress) * 3)} detik`;
        } else {
          processBarEl.style.display = 'none';
        }
      }
    }
  }
}

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
    if (!state.paused && deltaSeconds > 0 && deltaSeconds < 1) {
      const nextState = tickGame(state, deltaSeconds);
      if (nextState !== state) {
        state = nextState;
        if (state.screen !== 'main') {
          renderApp(root);
          return;
        }
      }
    }

    updateMainUI(state);
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
  if (kitchenSceneController) {
    kitchenSceneController.destroy();
    kitchenSceneController = null;
  }
  gameContainerEl = null;
  hudEl = null;
  hudCustomerValueEl = null;
  hudTimerValueEl = null;
  hudTimerBoxEl = null;
  hudTimerLabelEl = null;
  hudMoneyValueEl = null;
  hudActionBoxEl = null;
  pausedBannerEl = null;
  customerSectionEl = null;
  currentCustomerNumber = null;
  currentCustomerMenuId = null;
  statusItemEl = null;
  processBarEl = null;
  processBarFillEl = null;
  processLabelEl = null;
}

/**
 * Memasang elemen DOM untuk layar main dan menginisialisasi Three.js scene sekali saja.
 * @param {HTMLElement} root
 */
function mountMainScreen(root) {
  root.textContent = '';

  const gameContainer = document.createElement('div');
  gameContainer.className = 'game-container';
  gameContainer.setAttribute('data-testid', 'game-container');
  gameContainerEl = gameContainer;

  // Komponen HUD (F4, F2)
  const hud = renderHUD({
    customerNumber: state.customerNumber,
    totalCustomers: TOTAL_CUSTOMERS,
    timeLeftSeconds: state.order ? state.order.timeLeftSeconds : 30,
    totalMoneyIdr: state.totalMoneyIdr,
    paused: state.paused,
    onPause: () => {
      state = pauseGame(state);
      updateMainUI(state);
    },
    onResume: () => {
      state = resumeGame(state);
      updateMainUI(state);
    },
  });
  hudEl = hud;
  hudCustomerValueEl = hud.querySelector('[data-testid="hud-customer-value"]');
  hudTimerValueEl = hud.querySelector('[data-testid="hud-timer-value"]');
  hudTimerBoxEl = hud.querySelector('.hud-timer');
  hudTimerLabelEl = hudTimerBoxEl ? hudTimerBoxEl.querySelector('.hud-label') : null;
  hudMoneyValueEl = hud.querySelector('[data-testid="hud-money-value"]');
  hudActionBoxEl = hud.querySelector('.hud-actions');
  gameContainer.appendChild(hud);

  // Banner dijeda
  const pausedBanner = document.createElement('div');
  pausedBanner.className = 'paused-banner';
  pausedBanner.setAttribute('data-testid', 'paused-banner');
  pausedBanner.textContent = 'Permainan Dijeda. Tekan Resume untuk melanjutkan.';
  pausedBannerEl = pausedBanner;
  if (state.paused) {
    gameContainer.appendChild(pausedBanner);
  }

  // Pelanggan 2D dan Dialog Pesanan (F2)
  if (state.order) {
    currentCustomerNumber = state.customerNumber;
    currentCustomerMenuId = state.order.menuId;
    const customerDialog = renderCustomerDialog({
      customerNumber: state.customerNumber,
      menuId: state.order.menuId,
    });
    customerSectionEl = customerDialog;
    gameContainer.appendChild(customerDialog);
  }

  // Scene 3D Alat dan Bahan (F3)
  const sceneContainer = document.createElement('div');
  sceneContainer.className = 'scene-container';
  sceneContainer.setAttribute('data-testid', 'scene-container');

  const canvas = document.createElement('canvas');
  canvas.className = 'scene-canvas';
  canvas.setAttribute('data-testid', 'scene-canvas');
  canvas.setAttribute('aria-label', 'Area Dapur 3D: Alat dan Bahan');
  sceneContainer.appendChild(canvas);

  // Indikator progres proses 3 detik (F3, F4)
  const processBar = document.createElement('div');
  processBar.className = 'process-bar';
  processBar.setAttribute('data-testid', 'process-bar');
  processBar.style.display = 'none';
  const processBarFill = document.createElement('div');
  processBarFill.className = 'process-bar-fill';
  processBar.appendChild(processBarFill);
  const processLabel = document.createElement('span');
  processLabel.className = 'process-bar-label';
  processBar.appendChild(processLabel);
  sceneContainer.appendChild(processBar);

  const statusBar = document.createElement('div');
  statusBar.className = 'scene-status-bar';
  const statusHint = document.createElement('span');
  statusHint.textContent = 'Arahkan kursor atau sentuh alat & bahan 3D';
  const statusItem = document.createElement('span');
  statusItem.className = 'scene-status-item';
  statusItem.setAttribute('data-testid', 'scene-status-item');
  statusBar.appendChild(statusHint);
  statusBar.appendChild(statusItem);
  sceneContainer.appendChild(statusBar);

  gameContainer.appendChild(sceneContainer);
  root.appendChild(gameContainer);

  processBarEl = processBar;
  processBarFillEl = processBarFill;
  processLabelEl = processLabel;
  statusItemEl = statusItem;

  // Inisialisasi Three.js Scene ke canvas
  kitchenSceneController = initKitchenScene(canvas, {
    onHover: (item) => {
      if (statusItemEl) {
        statusItemEl.textContent = item
          ? `${item.name} (${item.type === 'tool' ? 'Alat' : 'Bahan'})`
          : '';
      }
    },
    onSelect: (item) => {
      if (statusItemEl) {
        statusItemEl.textContent = `Dipilih: ${item.name}`;
      }
      handleSceneSelect(item);
    },
  });

  if (kitchenSceneController) {
    kitchenSceneController.setPaused(state.paused);
  }

  startGameLoop(root);
}

/**
 * Merender layar sesuai dengan state saat ini (awal, main, atau hasil).
 * @param {HTMLElement} root
 */
function renderApp(root) {
  if (state.screen === 'awal') {
    if (currentScreen !== 'awal') {
      stopGameLoop();
      currentScreen = 'awal';
      root.textContent = '';
      const startScreen = renderStartScreen({
        onStart: () => {
          const firstMenuId = pickRandomMenuId();
          state = startGame(state, firstMenuId);
          renderApp(root);
        },
      });
      root.appendChild(startScreen);
    }
    return;
  }

  if (state.screen === 'hasil') {
    if (currentScreen !== 'hasil') {
      stopGameLoop();
      currentScreen = 'hasil';
      root.textContent = '';
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
    }
    return;
  }

  if (state.screen === 'main') {
    if (currentScreen !== 'main') {
      currentScreen = 'main';
      mountMainScreen(root);
    } else {
      updateMainUI(state);
    }
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
