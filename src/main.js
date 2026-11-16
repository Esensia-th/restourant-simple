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
} from './ui/screens.js';
import { renderHUD } from './ui/hud.js';
import { renderCustomerDialog } from './ui/customer-dialog.js';
import { initKitchenScene } from './scene/kitchen-scene.js';

/**
 * State aplikasi lokal di memori.
 */
let state = createGameState();

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
 * Elemen DOM indikator progres proses (diperbarui setiap frame tanpa re-render).
 */
let processBarEl = null;
let processBarFillEl = null;
let processLabelEl = null;

/**
 * Pemetaan alat 3D ke action proses (dari SPEC.json).
 * Alat dengan beberapa kemungkinan aksi dipilih aksi utamanya.
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
  if (!item) return;

  if (item.type === 'ingredient') {
    const next = selectIngredient(state, item.id);
    if (next !== state) {
      state = next;
      if (kitchenSceneController) kitchenSceneController.markIngredientUsed(item.id);
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
      }
      return;
    }

    // Jalankan proses
    const action = TOOL_ACTION_MAP[item.id];
    if (action) {
      // Kompor dan penggorengan pakai tool key gabungan sesuai resep
      let toolKey = item.id;
      if (item.id === 'kompor' || item.id === 'penggorengan') {
        toolKey = 'kompor + penggorengan';
      }
      state = beginProcess(state, { action, tool: toolKey });
    }
  }
}

/**
 * Loop waktu permainan (F4): memajukan jam game secara halus dengan requestAnimationFrame.
 * Juga memperbarui indikator progres proses tanpa re-render penuh.
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

    // Perbarui indikator progres proses setiap frame (tanpa full re-render)
    if (state.order && kitchenSceneController) {
      const progress = getProcessProgress(state.order);
      const activeTool = state.order.activeProcess ? state.order.activeProcess.tool : null;
      // Dapatkan id alat dari tool key (misalnya "kompor + penggorengan" → "kompor")
      let toolId = null;
      if (activeTool) {
        toolId = activeTool === 'kompor + penggorengan' ? 'kompor' : activeTool;
      }
      kitchenSceneController.showProcessProgress(toolId, progress);

      // Perbarui process bar HTML jika ada
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
  processBarEl = null;
  processBarFillEl = null;
  processLabelEl = null;
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

    // Pelanggan 2D dan Dialog Pesanan (F2)
    if (state.order) {
      const customerDialog = renderCustomerDialog({
        customerNumber: state.customerNumber,
        menuId: state.order.menuId,
      });
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

    // Simpan referensi elemen progres untuk diperbarui di game loop
    processBarEl = processBar;
    processBarFillEl = processBarFill;
    processLabelEl = processLabel;

    // Inisialisasi Scene Three.js
    if (!kitchenSceneController) {
      kitchenSceneController = initKitchenScene(canvas, {
        onHover: (item) => {
          if (item) {
            statusItem.textContent = `${item.name} (${item.type === 'tool' ? 'Alat' : 'Bahan'})`;
          } else {
            statusItem.textContent = '';
          }
        },
        onSelect: (item) => {
          statusItem.textContent = `Dipilih: ${item.name}`;
          handleSceneSelect(item);
        },
      });
    }

    if (kitchenSceneController) {
      kitchenSceneController.setPaused(state.paused);
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
