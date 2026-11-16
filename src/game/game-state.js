/**
 * @file State game Restoran Simple: alur 10 pelanggan, uang, dan hasil (F1, F2, F4).
 * Semua fungsi murni: menerima state lama dan mengembalikan state baru.
 * Tanpa Three.js, tanpa DOM, tanpa setInterval/setTimeout. Pilihan acak
 * (menu pelanggan) dan waktu (deltaSeconds) selalu dimasukkan dari luar
 * agar mudah diuji. Aksi yang tidak valid mengembalikan state yang sama.
 */

import { MENU_CATALOG } from './menu-catalog.js';
import { createOrder, startProcess, tick } from './timer.js';
import {
  createDish,
  addIngredient,
  addProcess,
  evaluateDish,
} from './evaluate-dish.js';

export const TOTAL_CUSTOMERS = 10;

/**
 * @typedef {Object} GameState
 * @property {'awal' | 'main' | 'hasil'} screen
 * @property {number} customerNumber  0 sebelum Start, lalu 1 sampai 10
 * @property {number} totalMoneyIdr
 * @property {boolean} paused
 * @property {'menang' | 'kalah' | null} result
 * @property {ReturnType<typeof createOrder> | null} order
 * @property {ReturnType<typeof createDish>} dish
 */

const menuExists = (menuId) => MENU_CATALOG.some((menu) => menu.id === menuId);

/**
 * State awal: layar halaman awal, belum ada pelanggan atau timer.
 * @returns {GameState}
 */
export function createGameState() {
  return {
    screen: 'awal',
    customerNumber: 0,
    totalMoneyIdr: 0,
    paused: false,
    result: null,
    order: null,
    dish: createDish(),
  };
}

/**
 * Memilih id menu secara acak. Fungsi acak dimasukkan dari luar.
 * @param {() => number} [random] mengembalikan angka 0 sampai kurang dari 1
 * @returns {string}
 */
export function pickRandomMenuId(random = Math.random) {
  const index = Math.floor(random() * MENU_CATALOG.length);
  return MENU_CATALOG[Math.min(MENU_CATALOG.length - 1, Math.max(0, index))].id;
}

/** Aksi permainan hanya valid saat layar main, tidak di-Pause, dan pesanan menunggu. */
function canAct(state) {
  return (
    state.screen === 'main' &&
    !state.paused &&
    state.order !== null &&
    state.order.status === 'menunggu'
  );
}

/** Satu pelanggan pergi berarti game langsung kalah. */
function lose(state) {
  return { ...state, screen: 'hasil', result: 'kalah', paused: false };
}

/**
 * Start (F1): hanya dari layar awal. Menu pelanggan pertama dipilih dari luar.
 * @param {GameState} state
 * @param {string} menuId
 * @returns {GameState}
 */
export function startGame(state, menuId) {
  if (state.screen !== 'awal' || !menuExists(menuId)) return state;
  return {
    screen: 'main',
    customerNumber: 1,
    totalMoneyIdr: 0,
    paused: false,
    result: null,
    order: createOrder({ customerNumber: 1, menuId }),
    dish: createDish(),
  };
}

/**
 * Main lagi (F2): hanya dari layar hasil. Langsung memulai permainan baru
 * dengan uang 0 dan pelanggan 1/10.
 * @param {GameState} state
 * @param {string} menuId
 * @returns {GameState}
 */
export function playAgain(state, menuId) {
  if (state.screen !== 'hasil') return state;
  return startGame(createGameState(), menuId);
}

/**
 * Memajukan waktu (F4). Panggil hanya setelah pelanggan selesai menyebut
 * pesanan. Proses yang selesai dicatat ke hidangan; timer habis membuat
 * pelanggan pergi dan game kalah.
 * @param {GameState} state
 * @param {number} deltaSeconds
 * @returns {GameState}
 */
export function tickGame(state, deltaSeconds) {
  if (!canAct(state)) return state;
  const before = state.order;
  const after = tick(before, deltaSeconds, state.paused);
  if (after === before) return state;

  let dish = state.dish;
  for (const process of after.completedProcesses.slice(before.completedProcesses.length)) {
    dish = addProcess(dish, process);
  }
  const next = { ...state, order: after, dish };
  return after.status === 'pergi' ? lose(next) : next;
}

/**
 * Memasukkan bahan ke hidangan (F3). Bahan tidak dikenal diabaikan.
 * @param {GameState} state
 * @param {string} item
 * @returns {GameState}
 */
export function selectIngredient(state, item) {
  if (!canAct(state)) return state;
  const dish = addIngredient(state.dish, item);
  return dish === state.dish ? state : { ...state, dish };
}

/**
 * Memulai proses 3 detik dengan alat (F3). Proses atau alat tidak dikenal
 * diabaikan, begitu juga bila masih ada proses yang berjalan.
 * @param {GameState} state
 * @param {{ action: string, tool: string }} process
 * @returns {GameState}
 */
export function beginProcess(state, process) {
  if (!canAct(state)) return state;
  if (addProcess(createDish(), process).length === 0) return state;
  const order = startProcess(state.order, process);
  return order === state.order ? state : { ...state, order };
}

/**
 * Sajikan (F2): menilai hidangan. Benar: pelanggan membayar sebesar harga
 * menu (pelanggan ke-10 langsung berakhir menang). Salah: pelanggan pergi
 * dan game kalah. Hanya diproses sekali per pesanan.
 * @param {GameState} state
 * @returns {GameState}
 */
export function serve(state) {
  if (!canAct(state)) return state;
  const { order, dish } = state;

  if (!evaluateDish(dish, order.menuId).correct) {
    return lose({ ...state, order: { ...order, status: 'pergi', activeProcess: null } });
  }

  const menu = MENU_CATALOG.find((item) => item.id === order.menuId);
  const served = {
    ...state,
    order: { ...order, status: 'terlayani', activeProcess: null },
    totalMoneyIdr: state.totalMoneyIdr + menu.price_idr,
  };
  return state.customerNumber >= TOTAL_CUSTOMERS
    ? { ...served, screen: 'hasil', result: 'menang' }
    : served;
}

/**
 * Pelanggan berikutnya muncul setelah pelanggan sebelumnya terlayani.
 * @param {GameState} state
 * @param {string} menuId
 * @returns {GameState}
 */
export function nextCustomer(state, menuId) {
  if (
    state.screen !== 'main' ||
    state.paused ||
    state.order === null ||
    state.order.status !== 'terlayani' ||
    !menuExists(menuId)
  ) {
    return state;
  }
  const customerNumber = state.customerNumber + 1;
  return {
    ...state,
    customerNumber,
    order: createOrder({ customerNumber, menuId }),
    dish: createDish(),
  };
}

/**
 * Pause (F4): menghentikan timer dan proses 3 detik.
 * @param {GameState} state
 * @returns {GameState}
 */
export function pauseGame(state) {
  if (state.screen !== 'main' || state.paused) return state;
  return { ...state, paused: true };
}

/**
 * Resume (F4): melanjutkan dari sisa waktu terakhir.
 * @param {GameState} state
 * @returns {GameState}
 */
export function resumeGame(state) {
  if (state.screen !== 'main' || !state.paused) return state;
  return { ...state, paused: false };
}
