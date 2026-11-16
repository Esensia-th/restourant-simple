import { describe, it, expect } from 'vitest';

describe('setup', () => {
  it('Vitest berjalan dengan benar', () => {
    expect(1 + 1).toBe(2);
  });

  it('ES modules berfungsi', () => {
    const pesan = 'Restoran Simple';
    expect(pesan).toContain('Restoran');
  });
});
