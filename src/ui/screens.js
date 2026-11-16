/**
 * @file screens.js — Komponen layar Halaman Awal dan Layar Hasil (F1, F2).
 * Memakai HTML/CSS murni dan token desain.
 * Semua teks dinamis diatur menggunakan textContent.
 */

/**
 * Format angka ke mata uang Rupiah sederhana (mis. Rp12.000 atau Rp0).
 * @param {number} amount
 * @returns {string}
 */
export function formatRupiah(amount) {
  const safeAmount = typeof amount === 'number' && !Number.isNaN(amount) ? Math.max(0, Math.floor(amount)) : 0;
  return `Rp${safeAmount.toLocaleString('id-ID')}`;
}

/**
 * Merender Halaman Awal (F1).
 * @param {Object} options
 * @param {() => void} options.onStart Callback saat tombol Start ditekan.
 * @returns {HTMLElement} Elemen container layar awal.
 */
export function renderStartScreen({ onStart }) {
  const container = document.createElement('div');
  container.className = 'screen screen-start';
  container.setAttribute('data-testid', 'start-screen');

  const card = document.createElement('div');
  card.className = 'card screen-card';

  const title = document.createElement('h1');
  title.className = 'screen-title';
  title.textContent = 'Restoran Simple';

  const subtitle = document.createElement('p');
  subtitle.className = 'screen-subtitle';
  subtitle.textContent = 'Game Simulasi Coffee Shop';

  const desc = document.createElement('p');
  desc.className = 'screen-desc';
  desc.textContent = 'Layani 10 pelanggan, racik pesanan sesuai petunjuk resep, dan kumpulkan uang sebanyak-banyaknya!';

  const startBtn = document.createElement('button');
  startBtn.type = 'button';
  startBtn.className = 'btn btn-primary btn-large';
  startBtn.setAttribute('data-testid', 'btn-start');
  startBtn.textContent = 'Start';
  startBtn.addEventListener('click', () => {
    if (typeof onStart === 'function') {
      onStart();
    }
  });

  card.appendChild(title);
  card.appendChild(subtitle);
  card.appendChild(desc);
  card.appendChild(startBtn);

  container.appendChild(card);
  return container;
}

/**
 * Merender Layar Hasil (F2) — Menang atau Kalah.
 * @param {Object} options
 * @param {'menang' | 'kalah'} options.result Status hasil permainan.
 * @param {number} options.totalMoneyIdr Total uang yang didapat (IDR).
 * @param {() => void} options.onPlayAgain Callback saat tombol Main lagi ditekan.
 * @returns {HTMLElement} Elemen container layar hasil.
 */
export function renderResultScreen({ result, totalMoneyIdr = 0, onPlayAgain }) {
  const isWin = result === 'menang';

  const container = document.createElement('div');
  container.className = `screen screen-result ${isWin ? 'screen-win' : 'screen-lose'}`;
  container.setAttribute('data-testid', 'result-screen');

  const card = document.createElement('div');
  card.className = 'card screen-card';

  const title = document.createElement('h1');
  title.className = `screen-title ${isWin ? 'text-success' : 'text-danger'}`;
  title.setAttribute('data-testid', 'result-title');
  title.textContent = isWin ? 'Selamat! Anda Menang!' : 'Permainan Berakhir';

  const message = document.createElement('p');
  message.className = 'screen-desc';
  message.setAttribute('data-testid', 'result-message');
  message.textContent = isWin
    ? 'Hebat! Anda berhasil melayani seluruh 10 pelanggan dengan sempurna.'
    : 'Sayang sekali, pelanggan pergi sebelum pesanan selesai dengan benar.';

  const moneyContainer = document.createElement('div');
  moneyContainer.className = 'result-money-box';

  const moneyLabel = document.createElement('span');
  moneyLabel.className = 'result-money-label';
  moneyLabel.textContent = 'Total Uang: ';

  const moneyValue = document.createElement('span');
  moneyValue.className = 'result-money-value';
  moneyValue.setAttribute('data-testid', 'result-money');
  moneyValue.textContent = formatRupiah(totalMoneyIdr);

  moneyContainer.appendChild(moneyLabel);
  moneyContainer.appendChild(moneyValue);

  const playAgainBtn = document.createElement('button');
  playAgainBtn.type = 'button';
  playAgainBtn.className = 'btn btn-primary btn-large';
  playAgainBtn.setAttribute('data-testid', 'btn-play-again');
  playAgainBtn.textContent = 'Main lagi';
  playAgainBtn.addEventListener('click', () => {
    if (typeof onPlayAgain === 'function') {
      onPlayAgain();
    }
  });

  card.appendChild(title);
  card.appendChild(message);
  card.appendChild(moneyContainer);
  card.appendChild(playAgainBtn);

  container.appendChild(card);
  return container;
}
