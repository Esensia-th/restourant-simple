/**
 * @file customer-dialog.test.js — Pengujian unit untuk komponen Pelanggan 2D dan Dialog Pesanan (F2).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDocument } from './helpers/mock-dom.js';
import {
  renderCustomerDialog,
  getCustomerAvatarUrl,
  getCustomerDialogText,
  DIALOG_TEMPLATES,
} from '../src/ui/customer-dialog.js';

describe('Customer Dialog Component (F2)', () => {
  let cleanup;

  beforeEach(() => {
    cleanup = setupMockDocument();
  });

  afterEach(() => {
    if (cleanup) cleanup();
  });

  describe('getCustomerAvatarUrl', () => {
    it('mengembalikan URL avatar berputar 1, 2, 3 sesuai nomor pelanggan', () => {
      expect(getCustomerAvatarUrl(1)).toBe('/customer-1.svg');
      expect(getCustomerAvatarUrl(2)).toBe('/customer-2.svg');
      expect(getCustomerAvatarUrl(3)).toBe('/customer-3.svg');
      expect(getCustomerAvatarUrl(4)).toBe('/customer-1.svg');
      expect(getCustomerAvatarUrl(10)).toBe('/customer-1.svg');
    });
  });

  describe('getCustomerDialogText', () => {
    it('menghasilkan dialog santai yang memuat nama menu', () => {
      const text = getCustomerDialogText('Kopi Tubruk', 1);
      expect(text).toContain('Kopi Tubruk');
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    it('memakai template yang berotasi berdasarkan nomor pelanggan', () => {
      for (let i = 1; i <= DIALOG_TEMPLATES.length; i++) {
        const text = getCustomerDialogText('Es Teh Manis', i);
        expect(text).toContain('Es Teh Manis');
      }
    });
  });

  describe('renderCustomerDialog', () => {
    it('merender avatar pelanggan dengan alt text aksesibel dan kotak dialog', () => {
      const element = renderCustomerDialog({ customerNumber: 1, menuId: 'M01' });

      expect(element.getAttribute('data-testid')).toBe('customer-section');

      // Avatar
      const avatar = element.querySelector('[data-testid="customer-avatar"]');
      expect(avatar).not.toBeNull();
      expect(avatar.getAttribute('src')).toBe('/customer-1.svg');
      expect(avatar.getAttribute('alt')).toBe('Pelanggan 1 memesan Telur Goreng');

      // Speaker Name
      const speakerName = element.querySelector('[data-testid="customer-speaker-name"]');
      expect(speakerName).not.toBeNull();
      expect(speakerName.textContent).toBe('Pelanggan #1');

      // Speech Text
      const speech = element.querySelector('[data-testid="customer-speech-text"]');
      expect(speech).not.toBeNull();
      expect(speech.textContent).toContain('Telur Goreng');
    });

    it('menangani menuId minuman yang valid (mis. M06 Kopi Hitam)', () => {
      const element = renderCustomerDialog({ customerNumber: 2, menuId: 'M06' });

      const avatar = element.querySelector('[data-testid="customer-avatar"]');
      expect(avatar.getAttribute('src')).toBe('/customer-2.svg');
      expect(avatar.getAttribute('alt')).toBe('Pelanggan 2 memesan Kopi Hitam');

      const speech = element.querySelector('[data-testid="customer-speech-text"]');
      expect(speech.textContent).toContain('Kopi Hitam');
    });
  });
});
