/**
 * @file hud.test.js — Pengujian unit untuk komponen HUD, Pause, dan Resume (F4, F2).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMockDocument } from './helpers/mock-dom.js';
import { renderHUD } from '../src/ui/hud.js';

describe('HUD Component', () => {
  let cleanup;

  beforeEach(() => {
    cleanup = setupMockDocument();
  });

  afterEach(() => {
    if (cleanup) cleanup();
  });

  it('merender nomor pelanggan, timer 30s, total uang, dan tombol Pause pada kondisi normal', () => {
    const onPause = vi.fn();
    const onResume = vi.fn();

    const hud = renderHUD({
      customerNumber: 3,
      totalCustomers: 10,
      timeLeftSeconds: 27.4,
      totalMoneyIdr: 35000,
      paused: false,
      onPause,
      onResume,
    });

    expect(hud.getAttribute('data-testid')).toBe('hud');

    // Customer
    const customerEl = hud.querySelector('[data-testid="hud-customer-value"]');
    expect(customerEl).not.toBeNull();
    expect(customerEl.textContent).toBe('3/10');

    // Timer (dibulatkan ke atas: Math.ceil(27.4) = 28)
    const timerEl = hud.querySelector('[data-testid="hud-timer-value"]');
    expect(timerEl).not.toBeNull();
    expect(timerEl.textContent).toBe('28s');

    // Money
    const moneyEl = hud.querySelector('[data-testid="hud-money-value"]');
    expect(moneyEl).not.toBeNull();
    expect(moneyEl.textContent).toBe('Rp35.000');

    // Button Pause
    const pauseBtn = hud.querySelector('[data-testid="btn-pause"]');
    expect(pauseBtn).not.toBeNull();
    expect(pauseBtn.textContent).toBe('Pause');
    expect(hud.querySelector('[data-testid="btn-resume"]')).toBeNull();

    pauseBtn.click();
    expect(onPause).toHaveBeenCalledTimes(1);
    expect(onResume).not.toHaveBeenCalled();
  });

  it('merender indikator dijeda dan tombol Resume saat paused bernilai true', () => {
    const onPause = vi.fn();
    const onResume = vi.fn();

    const hud = renderHUD({
      customerNumber: 5,
      totalCustomers: 10,
      timeLeftSeconds: 15.0,
      totalMoneyIdr: 60000,
      paused: true,
      onPause,
      onResume,
    });

    const timerBox = hud.querySelector('.hud-timer');
    expect(timerBox.classList.contains('hud-timer-paused')).toBe(true);

    const timerEl = hud.querySelector('[data-testid="hud-timer-value"]');
    expect(timerEl.textContent).toBe('15s');

    // Button Resume
    const resumeBtn = hud.querySelector('[data-testid="btn-resume"]');
    expect(resumeBtn).not.toBeNull();
    expect(resumeBtn.textContent).toBe('Resume');
    expect(hud.querySelector('[data-testid="btn-pause"]')).toBeNull();

    resumeBtn.click();
    expect(onResume).toHaveBeenCalledTimes(1);
    expect(onPause).not.toHaveBeenCalled();
  });
});
