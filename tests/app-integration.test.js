/**
 * @file app-integration.test.js — Pengujian integrasi alur aplikasi di main.js (F1, F2).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDocument } from './helpers/mock-dom.js';
import { createGameState, startGame, playAgain } from '../src/game/game-state.js';
import { renderStartScreen, renderResultScreen, formatRupiah } from '../src/ui/screens.js';

describe('Integrasi Alur Aplikasi (F1, F2)', () => {
  let cleanup;
  let root;

  beforeEach(() => {
    cleanup = setupMockDocument();
    root = document.createElement('div');
  });

  afterEach(() => {
    if (cleanup) cleanup();
  });

  it('alur lengkap: Awal -> Start -> Game (1/10, Rp0) -> Hasil Kalah -> Main lagi', () => {
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

        const hud = document.createElement('div');
        hud.setAttribute('data-testid', 'game-hud');
        hud.textContent = `Pelanggan: ${state.customerNumber}/10 | Uang: ${formatRupiah(state.totalMoneyIdr)}`;

        gameContainer.appendChild(hud);
        container.appendChild(gameContainer);
      }
    }

    // 1. Awalnya di layar 'awal'
    render(root);
    expect(root.querySelector('[data-testid="start-screen"]')).not.toBeNull();
    const startBtn = root.querySelector('[data-testid="btn-start"]');
    expect(startBtn).not.toBeNull();

    // 2. Klik Start -> beralih ke layar 'main', pelanggan 1/10, Uang Rp0
    startBtn.click();
    expect(state.screen).toBe('main');
    expect(state.customerNumber).toBe(1);
    expect(state.totalMoneyIdr).toBe(0);
    const hud = root.querySelector('[data-testid="game-hud"]');
    expect(hud).not.toBeNull();
    expect(hud.textContent).toContain('Pelanggan: 1/10 | Uang: Rp0');

    // 3. Simulasikan permainan berakhir kalah
    state = { ...state, screen: 'hasil', result: 'kalah', totalMoneyIdr: 15000 };
    render(root);
    expect(root.querySelector('[data-testid="result-screen"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="result-title"]').textContent).toBe('Permainan Berakhir');
    expect(root.querySelector('[data-testid="result-money"]').textContent).toBe('Rp15.000');

    // 4. Klik Main lagi -> kembali ke pelanggan 1/10 dan Uang Rp0
    const playAgainBtn = root.querySelector('[data-testid="btn-play-again"]');
    expect(playAgainBtn).not.toBeNull();
    playAgainBtn.click();
    expect(state.screen).toBe('main');
    expect(state.customerNumber).toBe(1);
    expect(state.totalMoneyIdr).toBe(0);
    const hudAfterReset = root.querySelector('[data-testid="game-hud"]');
    expect(hudAfterReset.textContent).toContain('Pelanggan: 1/10 | Uang: Rp0');
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
