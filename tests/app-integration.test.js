/**
 * @file app-integration.test.js — Pengujian integrasi alur aplikasi di main.js (F1, F2, F4).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDocument } from './helpers/mock-dom.js';
import {
  createGameState,
  startGame,
  playAgain,
  pauseGame,
  resumeGame,
  TOTAL_CUSTOMERS,
} from '../src/game/game-state.js';
import { renderStartScreen, renderResultScreen } from '../src/ui/screens.js';
import { renderHUD } from '../src/ui/hud.js';

describe('Integrasi Alur Aplikasi (F1, F2, F4)', () => {
  let cleanup;
  let root;

  beforeEach(() => {
    cleanup = setupMockDocument();
    root = document.createElement('div');
  });

  afterEach(() => {
    if (cleanup) cleanup();
  });

  it('alur lengkap: Awal -> Start -> Game (HUD: 1/10, 30s, Rp0, Pause) -> Pause -> Resume -> Kalah -> Main lagi', () => {
    let state = createGameState();

    function render(container) {
      container.children = []; // bersihkan root

      if (state.screen === 'awal') {
        const startScreen = renderStartScreen({
          onStart: () => {
            state = startGame(state, 'M01');
            render(container);
          },
        });
        container.appendChild(startScreen);
        return;
      }

      if (state.screen === 'hasil') {
        const resultScreen = renderResultScreen({
          result: state.result,
          totalMoneyIdr: state.totalMoneyIdr,
          onPlayAgain: () => {
            state = playAgain(state, 'M02');
            render(container);
          },
        });
        container.appendChild(resultScreen);
        return;
      }

      if (state.screen === 'main') {
        const gameContainer = document.createElement('div');
        gameContainer.setAttribute('data-testid', 'game-container');

        const hud = renderHUD({
          customerNumber: state.customerNumber,
          totalCustomers: TOTAL_CUSTOMERS,
          timeLeftSeconds: state.order ? state.order.timeLeftSeconds : 30,
          totalMoneyIdr: state.totalMoneyIdr,
          paused: state.paused,
          onPause: () => {
            state = pauseGame(state);
            render(container);
          },
          onResume: () => {
            state = resumeGame(state);
            render(container);
          },
        });

        gameContainer.appendChild(hud);

        if (state.paused) {
          const pausedBanner = document.createElement('div');
          pausedBanner.setAttribute('data-testid', 'paused-banner');
          pausedBanner.textContent = 'Permainan Dijeda';
          gameContainer.appendChild(pausedBanner);
        }

        container.appendChild(gameContainer);
      }
    }

    // 1. Awalnya di layar 'awal'
    render(root);
    expect(root.querySelector('[data-testid="start-screen"]')).not.toBeNull();
    const startBtn = root.querySelector('[data-testid="btn-start"]');
    expect(startBtn).not.toBeNull();

    // 2. Klik Start -> beralih ke layar 'main' dengan HUD
    startBtn.click();
    expect(state.screen).toBe('main');
    expect(state.customerNumber).toBe(1);
    expect(state.totalMoneyIdr).toBe(0);
    expect(state.paused).toBe(false);

    expect(root.querySelector('[data-testid="hud-customer-value"]').textContent).toBe('1/10');
    expect(root.querySelector('[data-testid="hud-timer-value"]').textContent).toBe('30s');
    expect(root.querySelector('[data-testid="hud-money-value"]').textContent).toBe('Rp0');

    // 3. Uji tombol Pause di HUD
    const pauseBtn = root.querySelector('[data-testid="btn-pause"]');
    expect(pauseBtn).not.toBeNull();
    pauseBtn.click();

    expect(state.paused).toBe(true);
    expect(root.querySelector('[data-testid="paused-banner"]')).not.toBeNull();
    const resumeBtn = root.querySelector('[data-testid="btn-resume"]');
    expect(resumeBtn).not.toBeNull();
    expect(root.querySelector('[data-testid="btn-pause"]')).toBeNull();

    // 4. Uji tombol Resume di HUD
    resumeBtn.click();
    expect(state.paused).toBe(false);
    expect(root.querySelector('[data-testid="paused-banner"]')).toBeNull();
    expect(root.querySelector('[data-testid="btn-pause"]')).not.toBeNull();

    // 5. Simulasikan permainan berakhir kalah
    state = { ...state, screen: 'hasil', result: 'kalah', totalMoneyIdr: 15000 };
    render(root);
    expect(root.querySelector('[data-testid="result-screen"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="result-title"]').textContent).toBe('Permainan Berakhir');
    expect(root.querySelector('[data-testid="result-money"]').textContent).toBe('Rp15.000');

    // 6. Klik Main lagi -> kembali ke pelanggan 1/10 dan Uang Rp0
    const playAgainBtn = root.querySelector('[data-testid="btn-play-again"]');
    expect(playAgainBtn).not.toBeNull();
    playAgainBtn.click();
    expect(state.screen).toBe('main');
    expect(state.customerNumber).toBe(1);
    expect(state.totalMoneyIdr).toBe(0);
    expect(root.querySelector('[data-testid="hud-customer-value"]').textContent).toBe('1/10');
    expect(root.querySelector('[data-testid="hud-money-value"]').textContent).toBe('Rp0');
  });

  it('alur hasil menang: menampilkan judul menang, total uang dan tombol Main lagi', () => {
    const state = {
      ...createGameState(),
      screen: 'hasil',
      result: 'menang',
      totalMoneyIdr: 185000,
    };

    const resultScreen = renderResultScreen({
      result: state.result,
      totalMoneyIdr: state.totalMoneyIdr,
      onPlayAgain: () => {},
    });
    root.appendChild(resultScreen);

    expect(root.querySelector('[data-testid="result-title"]').textContent).toBe('Selamat! Anda Menang!');
    expect(root.querySelector('[data-testid="result-money"]').textContent).toBe('Rp185.000');
    expect(root.querySelector('[data-testid="btn-play-again"]')).not.toBeNull();
  });
});
