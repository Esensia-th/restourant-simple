/**
 * @file customer-dialog.js — Komponen Pelanggan 2D dan Dialog Pesanan (F2).
 * Menampilkan ilustrasi pelanggan 2D gaya visual novel dan kotak dialog
 * dengan kalimat santai menyebut nama menu yang dipesan.
 * Semua teks dinamis diatur dengan textContent.
 */

import { MENU_CATALOG } from '../game/menu-catalog.js';

/**
 * Daftar template kalimat santai dialog pelanggan (F2, DESIGN_SYSTEM).
 */
export const DIALOG_TEMPLATES = [
  (menuName) => `Halo! Tolong buatkan satu ${menuName}, ya!`,
  (menuName) => `Permisi, saya pesan satu ${menuName} ya!`,
  (menuName) => `Hai! Boleh minta satu ${menuName}? Terima kasih!`,
  (menuName) => `Satu ${menuName}, ya! Saya tunggu dengan sabar.`,
];

/**
 * Mendapatkan URL avatar pelanggan statis berdasarkan nomor urut pelanggan.
 * @param {number} customerNumber
 * @returns {string}
 */
export function getCustomerAvatarUrl(customerNumber = 1) {
  const avatarIndex = ((customerNumber - 1) % 3) + 1;
  return `/customer-${avatarIndex}.svg`;
}

/**
 * Menghasilkan teks dialog santai untuk menu yang dipesan.
 * @param {string} menuName
 * @param {number} [customerNumber=1]
 * @returns {string}
 */
export function getCustomerDialogText(menuName, customerNumber = 1) {
  const templateIndex = (customerNumber - 1) % DIALOG_TEMPLATES.length;
  return DIALOG_TEMPLATES[templateIndex](menuName);
}

/**
 * Merender elemen Pelanggan 2D dan kotak dialog pesanan.
 * @param {Object} options
 * @param {number} options.customerNumber Nomor pelanggan (1 sampai 10).
 * @param {string} options.menuId ID menu yang dipesan (mis. M01-M10).
 * @returns {HTMLElement} Elemen root komponen pelanggan & dialog.
 */
export function renderCustomerDialog({ customerNumber = 1, menuId }) {
  const container = document.createElement('section');
  container.className = 'customer-section';
  container.setAttribute('data-testid', 'customer-section');

  const menuItem = MENU_CATALOG.find((m) => m.id === menuId);
  const menuName = menuItem ? menuItem.name : menuId;

  // 1. Gambar Pelanggan 2D Gaya Visual Novel
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'customer-avatar-box';

  const avatarImg = document.createElement('img');
  avatarImg.className = 'customer-avatar-img';
  avatarImg.setAttribute('data-testid', 'customer-avatar');
  avatarImg.src = getCustomerAvatarUrl(customerNumber);
  avatarImg.alt = `Pelanggan ${customerNumber} memesan ${menuName}`;
  avatarImg.width = 180;
  avatarImg.height = 216;

  avatarContainer.appendChild(avatarImg);

  // 2. Kotak Dialog Pesanan
  const dialogBox = document.createElement('div');
  dialogBox.className = 'customer-dialog-bubble';
  dialogBox.setAttribute('data-testid', 'customer-dialog-bubble');

  const speakerName = document.createElement('div');
  speakerName.className = 'customer-speaker-name';
  speakerName.setAttribute('data-testid', 'customer-speaker-name');
  speakerName.textContent = `Pelanggan #${customerNumber}`;

  const speechText = document.createElement('p');
  speechText.className = 'customer-speech-text';
  speechText.setAttribute('data-testid', 'customer-speech-text');
  speechText.textContent = getCustomerDialogText(menuName, customerNumber);

  dialogBox.appendChild(speakerName);
  dialogBox.appendChild(speechText);

  container.appendChild(avatarContainer);
  container.appendChild(dialogBox);

  return container;
}
