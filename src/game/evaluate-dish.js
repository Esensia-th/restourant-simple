/**
 * @file Penilaian hidangan Restoran Simple (F2, F3).
 * Hidangan adalah urutan langkah yang dilakukan pemain: bahan yang
 * dimasukkan dan proses yang SUDAH SELESAI. Hidangan dinilai benar bila
 * bahan, proses, dan urutannya persis sama dengan resep menu.
 * Modul murni: tanpa Three.js, tanpa DOM, dan tidak mengubah data masukan.
 */

import { MENU_CATALOG } from './menu-catalog.js';

/** Bahan yang dikenal game, diambil dari katalog menu. */
const KNOWN_INGREDIENTS = new Set(
  MENU_CATALOG.flatMap((menu) =>
    menu.steps.filter((step) => step.type === 'ingredient').map((step) => step.item),
  ),
);

const processKey = (action, tool) => `${action}|${tool}`;

/** Pasangan proses dan alat yang dikenal game, diambil dari katalog menu. */
const KNOWN_PROCESSES = new Set(
  MENU_CATALOG.flatMap((menu) =>
    menu.steps
      .filter((step) => step.type === 'process')
      .map((step) => processKey(step.action, step.tool)),
  ),
);

/**
 * @typedef {{ type: 'ingredient', item: string }} DishIngredient
 * @typedef {{ type: 'process', action: string, tool: string }} DishProcess
 * @typedef {DishIngredient | DishProcess} DishStep
 */

/**
 * Hidangan kosong.
 * @returns {DishStep[]}
 */
export function createDish() {
  return [];
}

/**
 * Menambahkan bahan ke hidangan. Bahan yang tidak dikenal diabaikan
 * tanpa error (hidangan dikembalikan apa adanya).
 * @param {DishStep[]} dish
 * @param {string} item
 * @returns {DishStep[]}
 */
export function addIngredient(dish, item) {
  if (!KNOWN_INGREDIENTS.has(item)) return dish;
  return [...dish, { type: 'ingredient', item }];
}

/**
 * Menambahkan proses yang sudah selesai ke hidangan. Pasangan proses
 * dan alat yang tidak dikenal diabaikan tanpa error.
 * @param {DishStep[]} dish
 * @param {{ action: string, tool: string }} process
 * @returns {DishStep[]}
 */
export function addProcess(dish, process) {
  if (!process || !KNOWN_PROCESSES.has(processKey(process.action, process.tool))) {
    return dish;
  }
  return [...dish, { type: 'process', action: process.action, tool: process.tool }];
}

/** Membandingkan satu langkah hidangan dengan satu langkah resep. */
function sameStep(served, recipe) {
  if (!served || served.type !== recipe.type) return false;
  if (recipe.type === 'ingredient') return served.item === recipe.item;
  return served.action === recipe.action && served.tool === recipe.tool;
}

/**
 * Menilai hidangan terhadap resep menu.
 * - 'sesuai': benar.
 * - 'langkah-berbeda': ada langkah yang berbeda isi atau urutannya (index = langkah pertama yang berbeda).
 * - 'langkah-kurang': awal sudah benar tetapi belum lengkap.
 * - 'langkah-berlebih': resep sudah lengkap tetapi masih ada langkah tambahan.
 * - 'menu-tidak-dikenal': menuId tidak ada di katalog.
 * @param {DishStep[]} dish
 * @param {string} menuId
 * @returns {{ correct: boolean, reason: string, index: number | null }}
 */
export function evaluateDish(dish, menuId) {
  const menu = MENU_CATALOG.find((item) => item.id === menuId);
  if (!menu) return { correct: false, reason: 'menu-tidak-dikenal', index: null };

  const served = Array.isArray(dish) ? dish : [];
  const recipe = menu.steps;
  const common = Math.min(served.length, recipe.length);

  for (let i = 0; i < common; i += 1) {
    if (!sameStep(served[i], recipe[i])) {
      return { correct: false, reason: 'langkah-berbeda', index: i };
    }
  }
  if (served.length < recipe.length) {
    return { correct: false, reason: 'langkah-kurang', index: served.length };
  }
  if (served.length > recipe.length) {
    return { correct: false, reason: 'langkah-berlebih', index: recipe.length };
  }
  return { correct: true, reason: 'sesuai', index: null };
}
