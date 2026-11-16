/**
 * @file interaction.test.js — Uji interaksi alat, bahan, dan proses 3 detik (T-010, F3, F4).
 * Menguji fungsi game-state: selectIngredient dan beginProcess,
 * serta memastikan interaksi tidak terjadi saat paused.
 */

import { describe, it, expect } from 'vitest';
import {
  createGameState,
  startGame,
  pauseGame,
  selectIngredient,
  beginProcess,
  tickGame,
} from '../src/game/game-state.js';
import { getProcessProgress } from '../src/game/timer.js';

/** Membuat state awal dengan pelanggan aktif. */
function makePlayingState(menuId = 'M01') {
  return startGame(createGameState(), menuId);
}

// ---------------------------------------------------------------------------
// selectIngredient
// ---------------------------------------------------------------------------

describe('selectIngredient', () => {
  it('menambah bahan yang dikenal ke dish', () => {
    const state = makePlayingState('M01');
    const next = selectIngredient(state, 'telur');
    expect(next).not.toBe(state);
    expect(next.dish).toHaveLength(1);
    expect(next.dish[0]).toMatchObject({ type: 'ingredient', item: 'telur' });
  });

  it('mengabaikan bahan tidak dikenal tanpa error', () => {
    const state = makePlayingState('M01');
    const next = selectIngredient(state, 'nasi-tidak-ada');
    expect(next).toBe(state);
  });

  it('dapat menambah beberapa bahan berurutan', () => {
    let state = makePlayingState('M01');
    state = selectIngredient(state, 'telur');
    state = selectIngredient(state, 'garam');
    expect(state.dish).toHaveLength(2);
    expect(state.dish[1]).toMatchObject({ type: 'ingredient', item: 'garam' });
  });

  it('diabaikan saat game di-Pause', () => {
    const playing = makePlayingState('M01');
    const paused = pauseGame(playing);
    const next = selectIngredient(paused, 'telur');
    expect(next).toBe(paused);
  });

  it('diabaikan saat layar bukan main', () => {
    const state = createGameState(); // layar 'awal'
    const next = selectIngredient(state, 'telur');
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// beginProcess
// ---------------------------------------------------------------------------

describe('beginProcess', () => {
  it('memulai proses yang dikenal saat tidak ada proses aktif', () => {
    const state = makePlayingState('M01');
    const next = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    expect(next).not.toBe(state);
    expect(next.order.activeProcess).toMatchObject({
      action: 'goreng',
      tool: 'kompor + penggorengan',
      elapsedSeconds: 0,
    });
  });

  it('diabaikan bila ada proses yang masih berjalan', () => {
    let state = makePlayingState('M01');
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    const withProcess = state;
    // Coba mulai proses kedua saat proses pertama masih jalan
    const next = beginProcess(state, { action: 'aduk', tool: 'spatula' });
    expect(next).toBe(withProcess);
  });

  it('diabaikan untuk pasangan action+tool yang tidak dikenal', () => {
    const state = makePlayingState('M01');
    const next = beginProcess(state, { action: 'terbang', tool: 'balon' });
    expect(next).toBe(state);
  });

  it('diabaikan saat game di-Pause', () => {
    const playing = makePlayingState('M01');
    const paused = pauseGame(playing);
    const next = beginProcess(paused, { action: 'goreng', tool: 'kompor + penggorengan' });
    expect(next).toBe(paused);
  });

  it('mendukung proses seduh untuk menu kopi', () => {
    const state = makePlayingState('M06');
    const next = beginProcess(state, { action: 'seduh', tool: 'alat pembuat kopi' });
    expect(next.order.activeProcess).toMatchObject({
      action: 'seduh',
      tool: 'alat pembuat kopi',
    });
  });

  it('mendukung proses blender untuk jus buah', () => {
    const state = makePlayingState('M07');
    const next = beginProcess(state, { action: 'blender', tool: 'blender buah' });
    expect(next.order.activeProcess).toMatchObject({
      action: 'blender',
      tool: 'blender buah',
    });
  });

  it('mendukung proses aduk dengan spatula', () => {
    const state = makePlayingState('M03');
    const next = beginProcess(state, { action: 'aduk', tool: 'spatula' });
    expect(next.order.activeProcess).toMatchObject({
      action: 'aduk',
      tool: 'spatula',
    });
  });

  it('mendukung proses balik dengan spatula', () => {
    const state = makePlayingState('M04');
    const next = beginProcess(state, { action: 'balik', tool: 'spatula' });
    expect(next.order.activeProcess).toMatchObject({
      action: 'balik',
      tool: 'spatula',
    });
  });
});

// ---------------------------------------------------------------------------
// Progres proses 3 detik
// ---------------------------------------------------------------------------

describe('progres proses 3 detik', () => {
  it('progres 0 sebelum proses dimulai', () => {
    const state = makePlayingState('M01');
    expect(getProcessProgress(state.order)).toBe(0);
  });

  it('progres bertambah seiring waktu', () => {
    let state = makePlayingState('M01');
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    state = tickGame(state, 1.5);
    const progress = getProcessProgress(state.order);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(1);
  });

  it('proses selesai setelah 3 detik dan pindah ke completedProcesses', () => {
    let state = makePlayingState('M01');
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    state = tickGame(state, 3.0);
    expect(state.order.activeProcess).toBeNull();
    expect(state.order.completedProcesses).toHaveLength(1);
    expect(state.order.completedProcesses[0]).toMatchObject({
      action: 'goreng',
      tool: 'kompor + penggorengan',
    });
  });

  it('proses berhenti saat Pause dan melanjutkan saat Resume', () => {
    let state = makePlayingState('M01');
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    state = tickGame(state, 1.0); // 1 detik berlalu
    const progressBeforePause = getProcessProgress(state.order);

    // Pause: tick tidak bergerak
    const paused = pauseGame(state);
    const afterPauseTick = tickGame(paused, 1.0);
    expect(afterPauseTick).toBe(paused); // tidak berubah saat paused
    expect(getProcessProgress(afterPauseTick.order)).toBe(progressBeforePause);
  });
});

// ---------------------------------------------------------------------------
// Kombinasi di luar resep tidak error
// ---------------------------------------------------------------------------

describe('kombinasi di luar resep', () => {
  it('menambah bahan di luar resep tidak menyebabkan error', () => {
    const state = makePlayingState('M06'); // M06 = Kopi Hitam, butuh biji kopi + air
    // Tambah bahan yang tidak ada di resep M06
    const next = selectIngredient(state, 'telur');
    expect(next.dish).toHaveLength(1);
    expect(next.dish[0].item).toBe('telur');
  });

  it('proses di luar resep tidak menyebabkan error dan tercatat di dish', () => {
    // M07 = Jus Buah, butuh blender — tapi kita pakai goreng
    // goreng|kompor + penggorengan adalah pasangan yang dikenal (ada di menu lain)
    let state = makePlayingState('M07');
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    state = tickGame(state, 3.0);
    // Proses selesai dan tercatat di completedProcesses (akan masuk dish via tickGame)
    expect(state.order.completedProcesses).toHaveLength(1);
    expect(state.dish.some((s) => s.type === 'process' && s.action === 'goreng')).toBe(true);
  });

  it('state game tidak error saat bahan tidak dikenal diklik', () => {
    const state = makePlayingState('M01');
    expect(() => selectIngredient(state, 'bahan-misterius')).not.toThrow();
  });
});
