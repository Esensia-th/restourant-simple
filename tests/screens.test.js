/**
 * @file screens.test.js — Tes untuk modul UI screens (Halaman awal & Layar hasil).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMockDocument } from './helpers/mock-dom.js';
import { formatRupiah, renderStartScreen, renderResultScreen } from '../src/ui/screens.js';

describe('formatRupiah', () => {
  it('memformat angka rupiah dengan benar', () => {
    expect(formatRupiah(0)).toBe('Rp0');
    expect(formatRupiah(12000)).toBe('Rp12.000');
    expect(formatRupiah(150000)).toBe('Rp150.000');
  });

  it('menangani input non-number atau negatif dengan aman', () => {
    expect(formatRupiah(-500)).toBe('Rp0');
    expect(formatRupiah(null)).toBe('Rp0');
    expect(formatRupiah(undefined)).toBe('Rp0');
    expect(formatRupiah(NaN)).toBe('Rp0');
  });
});

describe('UI screens', () => {
  let cleanup;

  beforeEach(() => {
    cleanup = setupMockDocument();
  });

  afterEach(() => {
    if (cleanup) cleanup();
  });

  describe('renderStartScreen', () => {
    it('merender judul, deskripsi, dan tombol Start', () => {
      const onStart = vi.fn();
      const element = renderStartScreen({ onStart });

      expect(element.getAttribute('data-testid')).toBe('start-screen');
      const title = element.querySelector('.screen-title');
      expect(title).not.toBeNull();
      expect(title.textContent).toBe('Restoran Simple');

      const startBtn = element.querySelector('[data-testid="btn-start"]');
      expect(startBtn).not.toBeNull();
      expect(startBtn.textContent).toBe('Start');

      startBtn.click();
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('renderResultScreen', () => {
    it('merender hasil menang dengan pesan dan total uang yang benar', () => {
      const onPlayAgain = vi.fn();
      const element = renderResultScreen({
        result: 'menang',
        totalMoneyIdr: 125000,
        onPlayAgain,
      });

      expect(element.getAttribute('data-testid')).toBe('result-screen');
      expect(element.classList.contains('screen-win')).toBe(true);

      const title = element.querySelector('[data-testid="result-title"]');
      expect(title.textContent).toBe('Selamat! Anda Menang!');

      const money = element.querySelector('[data-testid="result-money"]');
      expect(money.textContent).toBe('Rp125.000');

      const playAgainBtn = element.querySelector('[data-testid="btn-play-again"]');
      expect(playAgainBtn).not.toBeNull();
      expect(playAgainBtn.textContent).toBe('Main lagi');

      playAgainBtn.click();
      expect(onPlayAgain).toHaveBeenCalledTimes(1);
    });

    it('merender hasil kalah dengan pesan dan total uang yang benar', () => {
      const onPlayAgain = vi.fn();
      const element = renderResultScreen({
        result: 'kalah',
        totalMoneyIdr: 25000,
        onPlayAgain,
      });

      expect(element.getAttribute('data-testid')).toBe('result-screen');
      expect(element.classList.contains('screen-lose')).toBe(true);

      const title = element.querySelector('[data-testid="result-title"]');
      expect(title.textContent).toBe('Permainan Berakhir');

      const money = element.querySelector('[data-testid="result-money"]');
      expect(money.textContent).toBe('Rp25.000');

      const playAgainBtn = element.querySelector('[data-testid="btn-play-again"]');
      expect(playAgainBtn).not.toBeNull();
      expect(playAgainBtn.textContent).toBe('Main lagi');

      playAgainBtn.click();
      expect(onPlayAgain).toHaveBeenCalledTimes(1);
    });
  });
});
