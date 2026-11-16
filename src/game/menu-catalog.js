/**
 * @file Katalog menu dan data petunjuk langkah pembuatan Restoran Simple.
 * Sumber data: SPEC.json (data.menu_catalog).
 * Catatan: Modul logika murni, tanpa dependensi Three.js maupun DOM.
 */

/**
 * @typedef {'makanan' | 'minuman'} MenuCategory
 *
 * @typedef {Object} IngredientStep
 * @property {'ingredient'} type
 * @property {string} item
 *
 * @typedef {Object} ProcessStep
 * @property {'process'} type
 * @property {string} action
 * @property {string} tool
 * @property {number} duration_seconds
 *
 * @typedef {IngredientStep | ProcessStep} RecipeStep
 *
 * @typedef {Object} MenuItem
 * @property {string} id - Pengenal menu (M01-M10)
 * @property {string} name - Nama menu
 * @property {MenuCategory} category - Kategori hidangan (makanan/minuman)
 * @property {number} price_idr - Harga dalam satuan Rupiah
 * @property {RecipeStep[]} steps - Urutan langkah resep
 */

/**
 * Daftar 10 menu resmi Restoran Simple.
 * @type {readonly MenuItem[]}
 */
export const MENU_CATALOG = Object.freeze([
  {
    id: 'M01',
    name: 'Telur Goreng',
    category: 'makanan',
    price_idr: 7000,
    steps: [
      {
        type: 'ingredient',
        item: 'telur',
      },
      {
        type: 'ingredient',
        item: 'garam',
      },
      {
        type: 'process',
        action: 'goreng',
        tool: 'kompor + penggorengan',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M02',
    name: 'Roti Panggang',
    category: 'makanan',
    price_idr: 9000,
    steps: [
      {
        type: 'ingredient',
        item: 'roti',
      },
      {
        type: 'process',
        action: 'panggang',
        tool: 'kompor + penggorengan',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M03',
    name: 'Tumis Sayur',
    category: 'makanan',
    price_idr: 11000,
    steps: [
      {
        type: 'ingredient',
        item: 'sayur',
      },
      {
        type: 'ingredient',
        item: 'garam',
      },
      {
        type: 'process',
        action: 'goreng',
        tool: 'kompor + penggorengan',
        duration_seconds: 3,
      },
      {
        type: 'process',
        action: 'aduk',
        tool: 'spatula',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M04',
    name: 'Omelet Sayur',
    category: 'makanan',
    price_idr: 14000,
    steps: [
      {
        type: 'ingredient',
        item: 'telur',
      },
      {
        type: 'ingredient',
        item: 'sayur',
      },
      {
        type: 'ingredient',
        item: 'garam',
      },
      {
        type: 'process',
        action: 'goreng',
        tool: 'kompor + penggorengan',
        duration_seconds: 3,
      },
      {
        type: 'process',
        action: 'balik',
        tool: 'spatula',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M05',
    name: 'Roti Goreng Telur',
    category: 'makanan',
    price_idr: 17000,
    steps: [
      {
        type: 'ingredient',
        item: 'roti',
      },
      {
        type: 'ingredient',
        item: 'telur',
      },
      {
        type: 'ingredient',
        item: 'susu',
      },
      {
        type: 'ingredient',
        item: 'gula',
      },
      {
        type: 'process',
        action: 'goreng',
        tool: 'kompor + penggorengan',
        duration_seconds: 3,
      },
      {
        type: 'process',
        action: 'balik',
        tool: 'spatula',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M06',
    name: 'Kopi Hitam',
    category: 'minuman',
    price_idr: 8000,
    steps: [
      {
        type: 'ingredient',
        item: 'biji kopi',
      },
      {
        type: 'ingredient',
        item: 'air',
      },
      {
        type: 'process',
        action: 'seduh',
        tool: 'alat pembuat kopi',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M07',
    name: 'Jus Buah',
    category: 'minuman',
    price_idr: 10000,
    steps: [
      {
        type: 'ingredient',
        item: 'buah',
      },
      {
        type: 'ingredient',
        item: 'air',
      },
      {
        type: 'process',
        action: 'blender',
        tool: 'blender buah',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M08',
    name: 'Kopi Susu',
    category: 'minuman',
    price_idr: 12000,
    steps: [
      {
        type: 'ingredient',
        item: 'biji kopi',
      },
      {
        type: 'ingredient',
        item: 'air',
      },
      {
        type: 'ingredient',
        item: 'susu',
      },
      {
        type: 'ingredient',
        item: 'gula',
      },
      {
        type: 'process',
        action: 'seduh',
        tool: 'alat pembuat kopi',
        duration_seconds: 3,
      },
    ],
  },
  {
    id: 'M09',
    name: 'Es Kopi Susu',
    category: 'minuman',
    price_idr: 15000,
    steps: [
      {
        type: 'ingredient',
        item: 'biji kopi',
      },
      {
        type: 'ingredient',
        item: 'air',
      },
      {
        type: 'process',
        action: 'seduh',
        tool: 'alat pembuat kopi',
        duration_seconds: 3,
      },
      {
        type: 'ingredient',
        item: 'es batu',
      },
      {
        type: 'ingredient',
        item: 'susu',
      },
    ],
  },
  {
    id: 'M10',
    name: 'Smoothie Buah Susu',
    category: 'minuman',
    price_idr: 18000,
    steps: [
      {
        type: 'ingredient',
        item: 'buah',
      },
      {
        type: 'ingredient',
        item: 'susu',
      },
      {
        type: 'ingredient',
        item: 'es batu',
      },
      {
        type: 'process',
        action: 'blender',
        tool: 'blender buah',
        duration_seconds: 3,
      },
    ],
  },
]);

/** Alias konvensi camelCase untuk MENU_CATALOG */
export const menuCatalog = MENU_CATALOG;

/**
 * Mencari item menu berdasarkan ID (misal: 'M01').
 * @param {string} id - ID menu yang dicari
 * @returns {MenuItem | undefined} Menu yang cocok atau undefined jika tidak ditemukan
 */
export function getMenuById(id) {
  return MENU_CATALOG.find((menu) => menu.id === id);
}

/**
 * Mengambil daftar nama bahan yang dibutuhkan oleh suatu menu secara berurutan.
 * @param {MenuItem} menu - Objek menu
 * @returns {string[]} Daftar nama bahan
 */
export function getIngredients(menu) {
  if (!menu || !Array.isArray(menu.steps)) return [];
  return menu.steps
    .filter((step) => step.type === 'ingredient')
    .map((step) => step.item);
}

/**
 * Mengambil daftar langkah proses (beserta alat & durasi) dari suatu menu.
 * @param {MenuItem} menu - Objek menu
 * @returns {ProcessStep[]} Daftar langkah proses
 */
export function getProcessSteps(menu) {
  if (!menu || !Array.isArray(menu.steps)) return [];
  return menu.steps.filter((step) => step.type === 'process');
}

/**
 * Menghitung total durasi proses memasak/meracik (dalam detik) untuk suatu menu.
 * @param {MenuItem} menu - Objek menu
 * @returns {number} Total durasi proses dalam detik
 */
export function getTotalProcessDurationSeconds(menu) {
  if (!menu || !Array.isArray(menu.steps)) return 0;
  return menu.steps
    .filter((step) => step.type === 'process')
    .reduce((total, step) => total + (step.duration_seconds || 0), 0);
}
