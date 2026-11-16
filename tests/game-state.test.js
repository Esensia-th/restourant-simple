import { describe, it, expect } from 'vitest';
import { MENU_CATALOG } from '../src/game/menu-catalog.js';
import { ORDER_TIME_LIMIT_SECONDS, PROCESS_DURATION_SECONDS } from '../src/game/timer.js';
import {
  TOTAL_CUSTOMERS,
  createGameState,
  pickRandomMenuId,
  startGame,
  playAgain,
  tickGame,
  selectIngredient,
  beginProcess,
  serve,
  nextCustomer,
  pauseGame,
  resumeGame,
} from '../src/game/game-state.js';

const byId = (id) => MENU_CATALOG.find((menu) => menu.id === id);

/** Menyelesaikan satu menu persis sesuai resep, memakai aksi yang dipakai game. */
function cookExactly(state, menuId) {
  let next = state;
  for (const step of byId(menuId).steps) {
    if (step.type === 'ingredient') {
      next = selectIngredient(next, step.item);
    } else {
      next = beginProcess(next, { action: step.action, tool: step.tool });
      next = tickGame(next, PROCESS_DURATION_SECONDS);
    }
  }
  return next;
}

const started = (menuId = 'M01') => startGame(createGameState(), menuId);

describe('state awal dan Start (F1)', () => {
  it('state awal ada di layar awal tanpa pelanggan, uang, atau timer', () => {
    const state = createGameState();
    expect(state.screen).toBe('awal');
    expect(state.customerNumber).toBe(0);
    expect(state.totalMoneyIdr).toBe(0);
    expect(state.order).toBeNull();
    expect(state.result).toBeNull();
  });

  it('timer tidak berjalan sebelum Start', () => {
    const state = createGameState();
    expect(tickGame(state, 5)).toBe(state);
  });

  it('Start memulai pelanggan 1/10 dengan timer penuh', () => {
    const state = started('M06');
    expect(state.screen).toBe('main');
    expect(state.customerNumber).toBe(1);
    expect(state.totalMoneyIdr).toBe(0);
    expect(state.order.menuId).toBe('M06');
    expect(state.order.status).toBe('menunggu');
    expect(state.order.timeLeftSeconds).toBe(ORDER_TIME_LIMIT_SECONDS);
  });

  it('Start diabaikan di luar layar awal atau dengan menu tidak dikenal', () => {
    const playing = started();
    expect(startGame(playing, 'M02')).toBe(playing);
    const fresh = createGameState();
    expect(startGame(fresh, 'M99')).toBe(fresh);
  });

  it('aksi permainan diabaikan sebelum Start', () => {
    const fresh = createGameState();
    expect(selectIngredient(fresh, 'telur')).toBe(fresh);
    expect(beginProcess(fresh, { action: 'goreng', tool: 'kompor + penggorengan' })).toBe(fresh);
    expect(serve(fresh)).toBe(fresh);
    expect(pauseGame(fresh)).toBe(fresh);
  });

  it('batas pelanggan adalah 10', () => {
    expect(TOTAL_CUSTOMERS).toBe(10);
  });
});

describe('memilih menu acak', () => {
  it('memetakan angka acak ke menu pertama sampai terakhir', () => {
    expect(pickRandomMenuId(() => 0)).toBe(MENU_CATALOG[0].id);
    expect(pickRandomMenuId(() => 0.999)).toBe(MENU_CATALOG[MENU_CATALOG.length - 1].id);
    expect(pickRandomMenuId(() => 1)).toBe(MENU_CATALOG[MENU_CATALOG.length - 1].id);
  });
});

describe('Sajikan benar: pelanggan membayar (F2)', () => {
  it.each(MENU_CATALOG.map((menu) => [menu.id, menu.name]))(
    '%s %s dibayar sebesar harga menu',
    (id) => {
      const state = serve(cookExactly(started(id), id));
      expect(state.screen).toBe('main');
      expect(state.order.status).toBe('terlayani');
      expect(state.totalMoneyIdr).toBe(byId(id).price_idr);
    },
  );

  it('Sajikan tidak diproses dua kali', () => {
    const paid = serve(cookExactly(started('M01'), 'M01'));
    expect(serve(paid)).toBe(paid);
    expect(paid.totalMoneyIdr).toBe(byId('M01').price_idr);
  });

  it('pelanggan berikutnya hanya muncul setelah pelanggan sebelumnya terlayani', () => {
    const waiting = started('M01');
    expect(nextCustomer(waiting, 'M02')).toBe(waiting);

    const paid = serve(cookExactly(waiting, 'M01'));
    const next = nextCustomer(paid, 'M02');
    expect(next.customerNumber).toBe(2);
    expect(next.order.menuId).toBe('M02');
    expect(next.order.status).toBe('menunggu');
    expect(next.order.timeLeftSeconds).toBe(ORDER_TIME_LIMIT_SECONDS);
    expect(next.dish).toHaveLength(0);
    expect(next.totalMoneyIdr).toBe(byId('M01').price_idr);
  });
});

describe('Sajikan salah atau waktu habis: pelanggan pergi (F2, F4)', () => {
  it('hidangan salah membuat pelanggan pergi dan game kalah tanpa uang', () => {
    let state = started('M01');
    state = selectIngredient(state, 'susu');
    const lost = serve(state);
    expect(lost.screen).toBe('hasil');
    expect(lost.result).toBe('kalah');
    expect(lost.order.status).toBe('pergi');
    expect(lost.totalMoneyIdr).toBe(0);
  });

  it('hidangan setengah jadi yang disajikan dinilai salah', () => {
    const lost = serve(started('M01'));
    expect(lost.result).toBe('kalah');
  });

  it('urutan salah dinilai salah (Es Kopi Susu: susu sebelum es batu)', () => {
    let state = started('M09');
    for (const item of ['biji kopi', 'air']) state = selectIngredient(state, item);
    state = beginProcess(state, { action: 'seduh', tool: 'alat pembuat kopi' });
    state = tickGame(state, PROCESS_DURATION_SECONDS);
    state = selectIngredient(state, 'susu');
    state = selectIngredient(state, 'es batu');
    expect(serve(state).result).toBe('kalah');
  });

  it('waktu 30 detik habis membuat pelanggan pergi dan game kalah', () => {
    const almost = tickGame(started(), ORDER_TIME_LIMIT_SECONDS - 0.1);
    expect(almost.screen).toBe('main');
    const lost = tickGame(almost, 0.1);
    expect(lost.screen).toBe('hasil');
    expect(lost.result).toBe('kalah');
    expect(lost.order.status).toBe('pergi');
  });

  it('timer habis di tengah proses membatalkan proses dan tidak mencatatnya', () => {
    let state = tickGame(started('M01'), 28);
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    const lost = tickGame(state, 2);
    expect(lost.result).toBe('kalah');
    expect(lost.order.activeProcess).toBeNull();
    expect(lost.dish).toHaveLength(0);
  });

  it('setelah kalah, aksi lain diabaikan', () => {
    const lost = serve(started('M01'));
    expect(serve(lost)).toBe(lost);
    expect(tickGame(lost, 5)).toBe(lost);
    expect(nextCustomer(lost, 'M02')).toBe(lost);
    expect(selectIngredient(lost, 'telur')).toBe(lost);
  });
});

describe('Pause dan Resume (F4)', () => {
  it('Pause menghentikan timer dan Resume melanjutkan dari sisa waktu', () => {
    let state = tickGame(started(), 10);
    state = pauseGame(state);
    expect(state.paused).toBe(true);
    expect(tickGame(state, 5)).toBe(state);
    state = resumeGame(state);
    expect(state.paused).toBe(false);
    state = tickGame(state, 5);
    expect(state.order.timeLeftSeconds).toBe(15);
  });

  it('Pause menghentikan proses 3 detik', () => {
    let state = started('M01');
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    state = tickGame(state, 2);
    state = pauseGame(state);
    expect(tickGame(state, 10)).toBe(state);
    state = resumeGame(state);
    state = tickGame(state, 1);
    expect(state.order.activeProcess).toBeNull();
    expect(state.dish).toHaveLength(1);
  });

  it('interaksi alat, bahan, dan Sajikan dinonaktifkan saat Pause', () => {
    const paused = pauseGame(started('M01'));
    expect(selectIngredient(paused, 'telur')).toBe(paused);
    expect(beginProcess(paused, { action: 'goreng', tool: 'kompor + penggorengan' })).toBe(paused);
    expect(serve(paused)).toBe(paused);
  });

  it('Pause dan Resume ganda tidak mengubah state', () => {
    const paused = pauseGame(started());
    expect(pauseGame(paused)).toBe(paused);
    const playing = started();
    expect(resumeGame(playing)).toBe(playing);
  });
});

describe('alat dan bahan (F3)', () => {
  it('bahan atau proses tidak dikenal diabaikan tanpa error', () => {
    const state = started();
    expect(selectIngredient(state, 'durian')).toBe(state);
    expect(beginProcess(state, { action: 'goreng', tool: 'blender buah' })).toBe(state);
    expect(beginProcess(state, undefined)).toBe(state);
  });

  it('proses yang selesai dicatat ke hidangan dalam urutan yang benar', () => {
    let state = started('M03');
    state = selectIngredient(state, 'sayur');
    state = selectIngredient(state, 'garam');
    state = beginProcess(state, { action: 'goreng', tool: 'kompor + penggorengan' });
    expect(state.dish).toHaveLength(2);
    state = tickGame(state, PROCESS_DURATION_SECONDS);
    expect(state.dish).toHaveLength(3);
    expect(state.dish[2]).toEqual({ type: 'process', action: 'goreng', tool: 'kompor + penggorengan' });
  });

  it('proses baru diabaikan saat masih ada proses yang berjalan', () => {
    let state = beginProcess(started('M01'), { action: 'goreng', tool: 'kompor + penggorengan' });
    const running = state;
    state = beginProcess(state, { action: 'aduk', tool: 'spatula' });
    expect(state).toBe(running);
  });
});

describe('10 pelanggan: menang dan kalah (F2)', () => {
  it('menang bila ke-10 pelanggan terlayani benar, dengan total uang semua menu', () => {
    let state = started(MENU_CATALOG[0].id);
    MENU_CATALOG.forEach((menu, index) => {
      expect(state.customerNumber).toBe(index + 1);
      expect(state.screen).toBe('main');
      state = serve(cookExactly(state, menu.id));
      if (index < MENU_CATALOG.length - 1) {
        state = nextCustomer(state, MENU_CATALOG[index + 1].id);
      }
    });
    const total = MENU_CATALOG.reduce((sum, menu) => sum + menu.price_idr, 0);
    expect(state.screen).toBe('hasil');
    expect(state.result).toBe('menang');
    expect(state.customerNumber).toBe(TOTAL_CUSTOMERS);
    expect(state.totalMoneyIdr).toBe(total);
    expect(serve(state)).toBe(state);
  });

  it('satu pelanggan pergi di tengah permainan langsung membuat kalah', () => {
    let state = started('M01');
    state = serve(cookExactly(state, 'M01'));
    state = nextCustomer(state, 'M02');
    state = tickGame(state, ORDER_TIME_LIMIT_SECONDS);
    expect(state.screen).toBe('hasil');
    expect(state.result).toBe('kalah');
    expect(state.customerNumber).toBe(2);
    expect(state.totalMoneyIdr).toBe(byId('M01').price_idr);
  });
});

describe('Main lagi (F2)', () => {
  it('mengembalikan uang 0 dan pelanggan 1/10 setelah menang atau kalah', () => {
    let state = serve(cookExactly(started('M01'), 'M01'));
    state = nextCustomer(state, 'M02');
    state = serve(state);
    expect(state.result).toBe('kalah');

    const again = playAgain(state, 'M05');
    expect(again.screen).toBe('main');
    expect(again.customerNumber).toBe(1);
    expect(again.totalMoneyIdr).toBe(0);
    expect(again.result).toBeNull();
    expect(again.paused).toBe(false);
    expect(again.order.menuId).toBe('M05');
    expect(again.order.timeLeftSeconds).toBe(ORDER_TIME_LIMIT_SECONDS);
    expect(again.dish).toHaveLength(0);
  });

  it('diabaikan bila permainan belum berakhir', () => {
    const playing = started();
    expect(playAgain(playing, 'M02')).toBe(playing);
    const fresh = createGameState();
    expect(playAgain(fresh, 'M02')).toBe(fresh);
  });
});

describe('state bersifat murni', () => {
  it('aksi tidak mengubah state asal', () => {
    const state = started('M01');
    const snapshot = JSON.stringify(state);
    selectIngredient(state, 'telur');
    tickGame(state, 5);
    pauseGame(state);
    serve(state);
    expect(JSON.stringify(state)).toBe(snapshot);
  });
});
