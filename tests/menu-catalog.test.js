import { describe, it, expect } from 'vitest';
import {
  MENU_CATALOG,
  menuCatalog,
  getMenuById,
  getIngredients,
  getProcessSteps,
  getTotalProcessDurationSeconds,
} from '../src/game/menu-catalog.js';

describe('Katalog Menu (T-002, F2, F5)', () => {
  it('berisi tepat 10 menu', () => {
    expect(MENU_CATALOG).toBeDefined();
    expect(Array.isArray(MENU_CATALOG)).toBe(true);
    expect(MENU_CATALOG).toHaveLength(10);
    expect(menuCatalog).toBe(MENU_CATALOG);
  });

  it('terdiri dari tepat 5 makanan dan 5 minuman', () => {
    const makanan = MENU_CATALOG.filter((item) => item.category === 'makanan');
    const minuman = MENU_CATALOG.filter((item) => item.category === 'minuman');

    expect(makanan).toHaveLength(5);
    expect(minuman).toHaveLength(5);
    expect(makanan.length + minuman.length).toBe(10);
  });

  it('memiliki 10 harga yang semuanya berbeda', () => {
    const prices = MENU_CATALOG.map((item) => item.price_idr);
    const uniquePrices = new Set(prices);

    expect(prices).toHaveLength(10);
    expect(uniquePrices.size).toBe(10);

    // Semua harga adalah angka positif
    prices.forEach((price) => {
      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThan(0);
    });
  });

  it('setiap menu memiliki ID valid (M01-M10) dan nama yang tidak kosong', () => {
    const expectedIds = [
      'M01', 'M02', 'M03', 'M04', 'M05',
      'M06', 'M07', 'M08', 'M09', 'M10',
    ];

    const actualIds = MENU_CATALOG.map((item) => item.id);
    expect(actualIds).toEqual(expectedIds);

    MENU_CATALOG.forEach((item) => {
      expect(item.name).toBeDefined();
      expect(typeof item.name).toBe('string');
      expect(item.name.trim().length).toBeGreaterThan(0);
    });
  });

  it('setiap menu memiliki daftar bahan dan urutan langkah yang jelas', () => {
    MENU_CATALOG.forEach((menu) => {
      expect(Array.isArray(menu.steps)).toBe(true);
      expect(menu.steps.length).toBeGreaterThan(0);

      const ingredients = getIngredients(menu);
      expect(ingredients.length).toBeGreaterThan(0);
      ingredients.forEach((ing) => {
        expect(typeof ing).toBe('string');
        expect(ing.trim().length).toBeGreaterThan(0);
      });

      const processes = getProcessSteps(menu);
      expect(processes.length).toBeGreaterThan(0);
      processes.forEach((proc) => {
        expect(proc.type).toBe('process');
        expect(typeof proc.action).toBe('string');
        expect(typeof proc.tool).toBe('string');
        expect(proc.duration_seconds).toBe(3);
      });

      // Setiap langkah di steps harus bertipe ingredient atau process
      menu.steps.forEach((step) => {
        expect(['ingredient', 'process']).toContain(step.type);
        if (step.type === 'ingredient') {
          expect(step.item).toBeDefined();
        } else if (step.type === 'process') {
          expect(step.action).toBeDefined();
          expect(step.tool).toBeDefined();
          expect(step.duration_seconds).toBe(3);
        }
      });
    });
  });

  it('total waktu proses tiap menu paling lama 20 detik (≤ 20 detik)', () => {
    MENU_CATALOG.forEach((menu) => {
      const totalDuration = getTotalProcessDurationSeconds(menu);
      expect(totalDuration).toBeGreaterThan(0);
      expect(totalDuration).toBeLessThanOrEqual(20);
    });
  });

  it('helper getMenuById menemukan menu yang sesuai atau undefined jika tidak ada', () => {
    const menu01 = getMenuById('M01');
    expect(menu01).toBeDefined();
    expect(menu01?.name).toBe('Telur Goreng');

    const notFound = getMenuById('M99');
    expect(notFound).toBeUndefined();
  });

  it('data menu sesuai dengan urutan dan nama persis di SPEC', () => {
    const expectedNames = [
      'Telur Goreng',
      'Roti Panggang',
      'Tumis Sayur',
      'Omelet Sayur',
      'Roti Goreng Telur',
      'Kopi Hitam',
      'Jus Buah',
      'Kopi Susu',
      'Es Kopi Susu',
      'Smoothie Buah Susu',
    ];

    expect(MENU_CATALOG.map((m) => m.name)).toEqual(expectedNames);
  });
});
