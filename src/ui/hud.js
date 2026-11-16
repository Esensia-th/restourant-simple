/**
 * @file hud.js — Komponen HUD (Heads-Up Display), Pause, dan Resume (F4, F2).
 * Menampilkan hitung mundur timer, nomor pelanggan (mis. 3/10), total uang,
 * serta tombol kontrol Pause / Resume.
 * Semua pembaruan teks menggunakan textContent.
 */

import { formatRupiah } from './screens.js';

/**
 * Merender elemen HUD lengkap.
 * @param {Object} options
 * @param {number} options.customerNumber Nomor pelanggan (mis. 1 sampai 10).
 * @param {number} options.totalCustomers Total jumlah pelanggan (mis. 10).
 * @param {number} options.timeLeftSeconds Sisa detik pesanan (dari 30).
 * @param {number} options.totalMoneyIdr Total uang saat ini (IDR).
 * @param {boolean} options.paused Apakah game dalam kondisi dijeda (Pause).
 * @param {() => void} options.onPause Callback saat tombol Pause ditekan.
 * @param {() => void} options.onResume Callback saat tombol Resume ditekan.
 * @returns {HTMLElement} Elemen root HUD.
 */
export function renderHUD({
  customerNumber = 1,
  totalCustomers = 10,
  timeLeftSeconds = 30,
  totalMoneyIdr = 0,
  paused = false,
  onPause,
  onResume,
}) {
  const container = document.createElement('header');
  container.className = 'hud-container';
  container.setAttribute('data-testid', 'hud');

  // 1. Nomor Pelanggan
  const customerBox = document.createElement('div');
  customerBox.className = 'hud-item hud-customer';

  const customerLabel = document.createElement('span');
  customerLabel.className = 'hud-label';
  customerLabel.textContent = 'Pelanggan';

  const customerValue = document.createElement('span');
  customerValue.className = 'hud-value';
  customerValue.setAttribute('data-testid', 'hud-customer-value');
  customerValue.textContent = `${customerNumber}/${totalCustomers}`;

  customerBox.appendChild(customerLabel);
  customerBox.appendChild(customerValue);

  // 2. Timer
  const timerBox = document.createElement('div');
  timerBox.className = `hud-item hud-timer ${paused ? 'hud-timer-paused' : ''}`;

  const timerLabel = document.createElement('span');
  timerLabel.className = 'hud-label';
  timerLabel.textContent = paused ? 'Timer (Dijeda)' : 'Sisa Waktu';

  const timerValue = document.createElement('span');
  timerValue.className = 'hud-value';
  timerValue.setAttribute('data-testid', 'hud-timer-value');
  const displaySeconds = Math.max(0, Math.ceil(timeLeftSeconds));
  timerValue.textContent = `${displaySeconds}s`;

  timerBox.appendChild(timerLabel);
  timerBox.appendChild(timerValue);

  // 3. Total Uang
  const moneyBox = document.createElement('div');
  moneyBox.className = 'hud-item hud-money';

  const moneyLabel = document.createElement('span');
  moneyLabel.className = 'hud-label';
  moneyLabel.textContent = 'Total Uang';

  const moneyValue = document.createElement('span');
  moneyValue.className = 'hud-value hud-money-value';
  moneyValue.setAttribute('data-testid', 'hud-money-value');
  moneyValue.textContent = formatRupiah(totalMoneyIdr);

  moneyBox.appendChild(moneyLabel);
  moneyBox.appendChild(moneyValue);

  // 4. Tombol Aksi Pause / Resume
  const actionBox = document.createElement('div');
  actionBox.className = 'hud-item hud-actions';

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.setAttribute('data-testid', paused ? 'btn-resume' : 'btn-pause');

  if (paused) {
    toggleBtn.className = 'btn btn-secondary';
    toggleBtn.textContent = 'Resume';
    toggleBtn.addEventListener('click', () => {
      if (typeof onResume === 'function') onResume();
    });
  } else {
    toggleBtn.className = 'btn btn-neutral';
    toggleBtn.textContent = 'Pause';
    toggleBtn.addEventListener('click', () => {
      if (typeof onPause === 'function') onPause();
    });
  }

  actionBox.appendChild(toggleBtn);

  // Pasang semua elemen ke container
  container.appendChild(customerBox);
  container.appendChild(timerBox);
  container.appendChild(moneyBox);
  container.appendChild(actionBox);

  return container;
}
