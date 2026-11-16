/**
 * @file kitchen-scene.test.js — Pengujian unit untuk scene 3D (F3).
 */

import { describe, it, expect } from 'vitest';
import { TOOLS, INGREDIENTS, createKitchenObject } from '../src/scene/kitchen-scene.js';

describe('Kitchen Scene 3D Data & Objects (F3)', () => {
  it('memiliki tepat 7 alat resmi', () => {
    expect(TOOLS).toHaveLength(7);
    const expectedTools = [
      'kompor',
      'penggorengan',
      'spatula',
      'alat pembuat kopi',
      'wadah es batu',
      'galon air',
      'blender buah',
    ];
    expect(TOOLS.map((t) => t.id)).toEqual(expectedTools);
  });

  it('memiliki tepat 9 bahan resmi', () => {
    expect(INGREDIENTS).toHaveLength(9);
    const expectedIngredients = [
      'susu',
      'buah',
      'roti',
      'telur',
      'sayur',
      'garam',
      'gula',
      'biji kopi',
      'air',
    ];
    expect(INGREDIENTS.map((i) => i.id)).toEqual(expectedIngredients);
  });

  it('membuat mesh Three.js yang valid untuk alat', () => {
    const mesh = createKitchenObject(TOOLS[0], 'tool');
    expect(mesh).toBeDefined();
    expect(mesh.userData.id).toBe('kompor');
    expect(mesh.userData.name).toBe('Kompor');
    expect(mesh.userData.type).toBe('tool');
    expect(mesh.geometry).toBeDefined();
    expect(mesh.material).toBeDefined();
  });

  it('membuat mesh Three.js yang valid untuk bahan', () => {
    const mesh = createKitchenObject(INGREDIENTS[0], 'ingredient');
    expect(mesh).toBeDefined();
    expect(mesh.userData.id).toBe('susu');
    expect(mesh.userData.name).toBe('Susu');
    expect(mesh.userData.type).toBe('ingredient');
    expect(mesh.geometry).toBeDefined();
    expect(mesh.material).toBeDefined();
  });
});
