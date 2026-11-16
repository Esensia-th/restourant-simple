import { describe, it, expect } from 'vitest';
import { MENU_CATALOG } from '../src/game/menu-catalog.js';
import {
  createDish,
  addIngredient,
  addProcess,
  evaluateDish,
} from '../src/game/evaluate-dish.js';

/** Menyusun hidangan dari daftar langkah memakai fungsi yang dipakai game. */
function cook(steps) {
  let dish = createDish();
  for (const step of steps) {
    dish =
      step.type === 'ingredient'
        ? addIngredient(dish, step.item)
        : addProcess(dish, { action: step.action, tool: step.tool });
  }
  return dish;
}

const byId = (id) => MENU_CATALOG.find((menu) => menu.id === id);
const sameKind = (a, b) =>
  a.type === b.type && a.item === b.item && a.action === b.action && a.tool === b.tool;
const menuCases = MENU_CATALOG.map((menu) => [menu.id, menu.name]);

describe('hidangan yang benar (F2)', () => {
  it.each(menuCases)('%s %s dinilai benar saat persis sesuai resep', (id) => {
    const menu = byId(id);
    expect(evaluateDish(cook(menu.steps), id)).toEqual({
      correct: true,
      reason: 'sesuai',
      index: null,
    });
  });
});

describe('hidangan yang salah (F2)', () => {
  it.each(menuCases)('%s %s salah bila langkah terakhir belum dilakukan', (id) => {
    const menu = byId(id);
    const result = evaluateDish(cook(menu.steps.slice(0, -1)), id);
    expect(result.correct).toBe(false);
    expect(result.reason).toBe('langkah-kurang');
  });

  it.each(menuCases)('%s %s salah bila ada bahan berlebih di akhir', (id) => {
    const menu = byId(id);
    const result = evaluateDish(addIngredient(cook(menu.steps), 'garam'), id);
    expect(result.correct).toBe(false);
    expect(result.reason).toBe('langkah-berlebih');
  });

  it.each(menuCases)('%s %s salah bila dua langkah berurutan ditukar', (id) => {
    const menu = byId(id);
    const i = menu.steps.findIndex(
      (step, n) => n < menu.steps.length - 1 && !sameKind(step, menu.steps[n + 1]),
    );
    const swapped = [...menu.steps];
    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
    const result = evaluateDish(cook(swapped), id);
    expect(result.correct).toBe(false);
    expect(result.reason).toBe('langkah-berbeda');
    expect(result.index).toBe(i);
  });

  it.each(menuCases)('%s %s salah bila bahan pertama diganti bahan lain', (id) => {
    const menu = byId(id);
    const first = menu.steps[0];
    const other = menu.steps.find((step) => step.type === 'ingredient' && step.item !== first.item);
    const item = other ? other.item : 'garam';
    const replaced = [{ type: 'ingredient', item }, ...menu.steps.slice(1)];
    const result = evaluateDish(cook(replaced), id);
    expect(result.correct).toBe(false);
    expect(result.index).toBe(0);
  });

  it('Es Kopi Susu salah bila susu dimasukkan sebelum es batu (urutan dinilai)', () => {
    const menu = byId('M09');
    const steps = [...menu.steps];
    const iceIndex = steps.findIndex((step) => step.item === 'es batu');
    const milkIndex = steps.findIndex((step) => step.item === 'susu');
    [steps[iceIndex], steps[milkIndex]] = [steps[milkIndex], steps[iceIndex]];
    expect(evaluateDish(cook(steps), 'M09').correct).toBe(false);
  });

  it('proses dengan alat yang salah dinilai salah', () => {
    const menu = byId('M01');
    const wrong = menu.steps.map((step) =>
      step.type === 'process' ? { type: 'process', action: 'seduh', tool: 'alat pembuat kopi' } : step,
    );
    expect(evaluateDish(cook(wrong), 'M01').correct).toBe(false);
  });

  it('hidangan kosong dinilai salah', () => {
    const result = evaluateDish(createDish(), 'M01');
    expect(result.correct).toBe(false);
    expect(result.reason).toBe('langkah-kurang');
  });
});

describe('kombinasi di luar resep tidak menimbulkan error (F3)', () => {
  it('bahan yang valid tetapi bukan untuk menu itu tercatat dan dinilai salah', () => {
    const dish = addIngredient(cook(byId('M01').steps.slice(0, 1)), 'susu');
    expect(dish).toHaveLength(2);
    expect(() => evaluateDish(dish, 'M01')).not.toThrow();
    expect(evaluateDish(dish, 'M01').correct).toBe(false);
  });

  it('bahan yang tidak dikenal diabaikan tanpa error', () => {
    const dish = createDish();
    expect(addIngredient(dish, 'durian')).toBe(dish);
  });

  it('pasangan proses dan alat yang tidak dikenal diabaikan tanpa error', () => {
    const dish = createDish();
    expect(addProcess(dish, { action: 'goreng', tool: 'blender buah' })).toBe(dish);
    expect(addProcess(dish, undefined)).toBe(dish);
  });

  it('menu atau hidangan yang tidak valid tidak membuat error', () => {
    expect(evaluateDish(createDish(), 'M99')).toEqual({
      correct: false,
      reason: 'menu-tidak-dikenal',
      index: null,
    });
    expect(() => evaluateDish(null, 'M01')).not.toThrow();
    expect(evaluateDish(null, 'M01').correct).toBe(false);
  });

  it('menambah bahan tidak mengubah hidangan asal (murni)', () => {
    const dish = createDish();
    addIngredient(dish, 'telur');
    expect(dish).toHaveLength(0);
  });
});
