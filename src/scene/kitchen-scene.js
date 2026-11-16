/**
 * @file kitchen-scene.js — Scene Three.js untuk 7 alat dan 9 bahan 3D (F3).
 * Menampilkan model 3D prosedural komposit detail, area masak tengah,
 * sistem Drag & Drop 3D interaktif agar objek dan alat bisa digerakkan,
 * animasi memasak (goreng, aduk, balik, blender, seduh), dan label 3D.
 */

import * as THREE from 'three';

/**
 * Daftar 7 alat resmi dan 9 bahan resmi (SPEC.json & PRD F3).
 */
export const TOOLS = [
  { id: 'kompor', name: 'Kompor', color: 0x334155 },
  { id: 'penggorengan', name: 'Penggorengan', color: 0x1E293B },
  { id: 'spatula', name: 'Spatula', color: 0x94A3B8 },
  { id: 'alat pembuat kopi', name: 'Alat Pembuat Kopi', color: 0x78350F },
  { id: 'wadah es batu', name: 'Wadah Es Batu', color: 0x38BDF8 },
  { id: 'galon air', name: 'Galon Air', color: 0x0EA5E9 },
  { id: 'blender buah', name: 'Blender Buah', color: 0x10B981 },
];

export const INGREDIENTS = [
  { id: 'susu', name: 'Susu', color: 0xF8FAFC },
  { id: 'buah', name: 'Buah', color: 0xEF4444 },
  { id: 'roti', name: 'Roti', color: 0xD97706 },
  { id: 'telur', name: 'Telur', color: 0xFDE047 },
  { id: 'sayur', name: 'Sayur', color: 0x22C55E },
  { id: 'garam', name: 'Garam', color: 0xE2E8F0 },
  { id: 'gula', name: 'Gula', color: 0xF1F5F9 },
  { id: 'biji kopi', name: 'Biji Kopi', color: 0x451A03 },
  { id: 'air', name: 'Air', color: 0x60A5FA },
];

/**
 * Membuat sprite label teks 3D untuk objek.
 * @param {string} text
 * @returns {THREE.Sprite | null}
 */
export function createLabelSprite(text) {
  if (typeof document === 'undefined' || !document.createElement) return null;
  const canvas = document.createElement('canvas');
  if (!canvas.getContext) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = 256;
  canvas.height = 64;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  if (ctx.roundRect) {
    ctx.roundRect(4, 4, 248, 56, 12);
    ctx.fill();
  } else {
    ctx.fillRect(4, 4, 248, 56);
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.1, 0.28, 1);
  return sprite;
}

/**
 * Membuat mesh 3D komposit untuk masing-masing alat/bahan dengan detail kaya.
 * @param {Object} item
 * @param {'tool' | 'ingredient'} type
 * @returns {THREE.Mesh}
 */
export function createKitchenObject(item, type) {
  let rootGeometry;
  let rootMaterial;
  const childParts = [];

  const stdMat = (color, roughness = 0.4, metalness = 0.2, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...opts });

  if (type === 'tool') {
    switch (item.id) {
      case 'kompor': {
        rootGeometry = new THREE.BoxGeometry(1.6, 0.35, 1.6);
        rootMaterial = stdMat(0x334155, 0.4, 0.4);

        const burnerGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.08, 24);
        const burnerMat = stdMat(0x1E293B, 0.3, 0.8);
        const b1 = new THREE.Mesh(burnerGeo, burnerMat);
        b1.position.set(-0.38, 0.2, 0);
        childParts.push(b1);
        const b2 = new THREE.Mesh(burnerGeo, burnerMat);
        b2.position.set(0.38, 0.2, 0);
        childParts.push(b2);

        const coilGeo = new THREE.TorusGeometry(0.22, 0.04, 8, 20);
        const coilMat = stdMat(0xDC2626, 0.3, 0.5);
        const c1 = new THREE.Mesh(coilGeo, coilMat);
        c1.rotation.x = Math.PI / 2;
        c1.position.set(-0.38, 0.25, 0);
        childParts.push(c1);
        const c2 = new THREE.Mesh(coilGeo, coilMat);
        c2.rotation.x = Math.PI / 2;
        c2.position.set(0.38, 0.25, 0);
        childParts.push(c2);

        const knobGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16);
        const knobMat = stdMat(0x94A3B8, 0.2, 0.9);
        const k1 = new THREE.Mesh(knobGeo, knobMat);
        k1.rotation.x = Math.PI / 2;
        k1.position.set(-0.38, 0.05, 0.8);
        childParts.push(k1);
        const k2 = new THREE.Mesh(knobGeo, knobMat);
        k2.rotation.x = Math.PI / 2;
        k2.position.set(0.38, 0.05, 0.8);
        childParts.push(k2);
        break;
      }

      case 'penggorengan': {
        rootGeometry = new THREE.CylinderGeometry(0.8, 0.65, 0.28, 24);
        rootMaterial = stdMat(0x1E293B, 0.3, 0.7);

        const innerGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.04, 24);
        const innerMat = stdMat(0x0F172A, 0.2, 0.8);
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.set(0, 0.05, 0);
        childParts.push(inner);

        const handleGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.95, 16);
        const handleMat = stdMat(0x78350F, 0.6, 0.1);
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.rotation.x = Math.PI / 2.2;
        handle.position.set(0, 0.08, 1.05);
        childParts.push(handle);
        break;
      }

      case 'spatula': {
        rootGeometry = new THREE.BoxGeometry(0.38, 0.04, 0.5);
        rootMaterial = stdMat(0x94A3B8, 0.2, 0.9);

        const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.8, 16);
        const shaftMat = stdMat(0x64748B, 0.2, 0.9);
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.rotation.x = Math.PI / 3;
        shaft.position.set(0, 0.18, 0.55);
        childParts.push(shaft);

        const gripGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.45, 16);
        const gripMat = stdMat(0x78350F, 0.5, 0.1);
        const grip = new THREE.Mesh(gripGeo, gripMat);
        grip.rotation.x = Math.PI / 3;
        grip.position.set(0, 0.38, 0.92);
        childParts.push(grip);
        break;
      }

      case 'alat pembuat kopi': {
        rootGeometry = new THREE.BoxGeometry(0.85, 1.35, 0.85);
        rootMaterial = stdMat(0x1E293B, 0.3, 0.5);

        const basketGeo = new THREE.CylinderGeometry(0.3, 0.24, 0.3, 20);
        const basketMat = stdMat(0x334155, 0.3, 0.6);
        const basket = new THREE.Mesh(basketGeo, basketMat);
        basket.position.set(0, 0.28, 0.28);
        childParts.push(basket);

        const potGeo = new THREE.CylinderGeometry(0.26, 0.3, 0.55, 20);
        const potMat = stdMat(0x451A03, 0.1, 0.2, { transparent: true, opacity: 0.85 });
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.position.set(0, -0.22, 0.28);
        childParts.push(pot);
        break;
      }

      case 'wadah es batu': {
        rootGeometry = new THREE.BoxGeometry(1.2, 0.45, 0.85);
        rootMaterial = stdMat(0x38BDF8, 0.2, 0.1, { transparent: true, opacity: 0.8 });

        const iceGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
        const iceMat = stdMat(0xF0F9FF, 0.1, 0.1, { transparent: true, opacity: 0.9 });
        for (let ix = -0.32; ix <= 0.32; ix += 0.32) {
          for (let iz = -0.18; iz <= 0.18; iz += 0.36) {
            const cube = new THREE.Mesh(iceGeo, iceMat);
            cube.position.set(ix, 0.08, iz);
            cube.rotation.y = (ix + iz) * 2;
            childParts.push(cube);
          }
        }
        break;
      }

      case 'galon air': {
        rootGeometry = new THREE.BoxGeometry(0.8, 0.55, 0.8);
        rootMaterial = stdMat(0xF1F5F9, 0.3, 0.1);

        const jugGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.05, 24);
        const jugMat = stdMat(0x0284C7, 0.1, 0.2, { transparent: true, opacity: 0.85 });
        const jug = new THREE.Mesh(jugGeo, jugMat);
        jug.position.set(0, 0.75, 0);
        childParts.push(jug);

        const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
        const capMat = stdMat(0x1E40AF, 0.3, 0.2);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(0, 1.32, 0);
        childParts.push(cap);

        const tapGeo = new THREE.BoxGeometry(0.1, 0.14, 0.18);
        const tapMat = stdMat(0xEF4444, 0.3, 0.3);
        const tap = new THREE.Mesh(tapGeo, tapMat);
        tap.position.set(0, 0.08, 0.45);
        childParts.push(tap);
        break;
      }

      case 'blender buah': {
        rootGeometry = new THREE.CylinderGeometry(0.45, 0.52, 0.5, 24);
        rootMaterial = stdMat(0x10B981, 0.3, 0.4);

        const dialGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16);
        const dialMat = stdMat(0x1E293B, 0.3, 0.6);
        const dial = new THREE.Mesh(dialGeo, dialMat);
        dial.rotation.x = Math.PI / 2;
        dial.position.set(0, 0.04, 0.48);
        childParts.push(dial);

        const jarGeo = new THREE.CylinderGeometry(0.42, 0.28, 0.9, 24);
        const jarMat = stdMat(0x6EE7B7, 0.1, 0.1, { transparent: true, opacity: 0.75 });
        const jar = new THREE.Mesh(jarGeo, jarMat);
        jar.position.set(0, 0.65, 0);
        childParts.push(jar);

        const lidGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.1, 24);
        const lidMat = stdMat(0x064E3B, 0.4, 0.3);
        const lid = new THREE.Mesh(lidGeo, lidMat);
        lid.position.set(0, 1.12, 0);
        childParts.push(lid);
        break;
      }

      default:
        rootGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        rootMaterial = stdMat(item.color);
    }
  } else {
    // Bahan
    switch (item.id) {
      case 'susu': {
        rootGeometry = new THREE.BoxGeometry(0.5, 0.75, 0.5);
        rootMaterial = stdMat(0xF8FAFC, 0.4, 0.1);

        const bandGeo = new THREE.BoxGeometry(0.51, 0.22, 0.51);
        const bandMat = stdMat(0x3B82F6, 0.4, 0.1);
        const band = new THREE.Mesh(bandGeo, bandMat);
        band.position.set(0, -0.05, 0);
        childParts.push(band);

        const roofGeo = new THREE.ConeGeometry(0.38, 0.25, 4);
        const roofMat = stdMat(0x3B82F6, 0.4, 0.1);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 0.48, 0);
        childParts.push(roof);
        break;
      }

      case 'buah': {
        rootGeometry = new THREE.SphereGeometry(0.44, 24, 24);
        rootMaterial = stdMat(0xEF4444, 0.3, 0.1);

        const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 12);
        const stemMat = stdMat(0x78350F, 0.6, 0.1);
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.set(0, 0.46, 0);
        childParts.push(stem);

        const leafGeo = new THREE.SphereGeometry(0.1, 10, 10);
        const leafMat = stdMat(0x22C55E, 0.4, 0.1);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.scale.set(1.6, 0.4, 0.8);
        leaf.position.set(0.12, 0.46, 0);
        childParts.push(leaf);
        break;
      }

      case 'roti': {
        rootGeometry = new THREE.BoxGeometry(0.7, 0.55, 0.22);
        rootMaterial = stdMat(0xF59E0B, 0.6, 0.1);

        const crustGeo = new THREE.BoxGeometry(0.74, 0.59, 0.2);
        const crustMat = stdMat(0xB45309, 0.6, 0.1);
        const crust = new THREE.Mesh(crustGeo, crustMat);
        crust.position.set(0, 0, -0.02);
        childParts.push(crust);
        break;
      }

      case 'telur': {
        rootGeometry = new THREE.SphereGeometry(0.38, 24, 24);
        rootMaterial = stdMat(0xFDE047, 0.3, 0.1);

        const cupGeo = new THREE.CylinderGeometry(0.32, 0.2, 0.2, 20);
        const cupMat = stdMat(0xE2E8F0, 0.4, 0.3);
        const cup = new THREE.Mesh(cupGeo, cupMat);
        cup.position.set(0, -0.22, 0);
        childParts.push(cup);
        break;
      }

      case 'sayur': {
        rootGeometry = new THREE.SphereGeometry(0.36, 16, 16);
        rootMaterial = stdMat(0x22C55E, 0.5, 0.1);

        const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), stdMat(0x16A34A, 0.5, 0.1));
        leaf1.position.set(-0.16, 0.08, 0.12);
        childParts.push(leaf1);
        const leaf2 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), stdMat(0x4ADE80, 0.5, 0.1));
        leaf2.position.set(0.16, 0.08, -0.1);
        childParts.push(leaf2);
        break;
      }

      case 'garam': {
        rootGeometry = new THREE.CylinderGeometry(0.28, 0.32, 0.62, 20);
        rootMaterial = stdMat(0xE2E8F0, 0.3, 0.2);

        const capGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.14, 20);
        const capMat = stdMat(0x94A3B8, 0.2, 0.9);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(0, 0.36, 0);
        childParts.push(cap);
        break;
      }

      case 'gula': {
        rootGeometry = new THREE.CylinderGeometry(0.38, 0.25, 0.38, 20);
        rootMaterial = stdMat(0xF472B6, 0.3, 0.2);

        const sugarGeo = new THREE.SphereGeometry(0.32, 16, 16);
        const sugarMat = stdMat(0xFFFFFF, 0.4, 0.1);
        const sugar = new THREE.Mesh(sugarGeo, sugarMat);
        sugar.scale.set(1, 0.45, 1);
        sugar.position.set(0, 0.1, 0);
        childParts.push(sugar);
        break;
      }

      case 'biji kopi': {
        rootGeometry = new THREE.CylinderGeometry(0.38, 0.25, 0.36, 20);
        rootMaterial = stdMat(0x78350F, 0.6, 0.1);

        const beansGeo = new THREE.SphereGeometry(0.32, 16, 16);
        const beansMat = stdMat(0x271406, 0.4, 0.1);
        const beans = new THREE.Mesh(beansGeo, beansMat);
        beans.scale.set(1, 0.45, 1);
        beans.position.set(0, 0.1, 0);
        childParts.push(beans);
        break;
      }

      case 'air': {
        rootGeometry = new THREE.CylinderGeometry(0.3, 0.24, 0.72, 20);
        rootMaterial = stdMat(0xE0F2FE, 0.1, 0.1, { transparent: true, opacity: 0.45 });

        const waterGeo = new THREE.CylinderGeometry(0.27, 0.22, 0.58, 20);
        const waterMat = stdMat(0x38BDF8, 0.1, 0.2, { transparent: true, opacity: 0.85 });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.set(0, -0.04, 0);
        childParts.push(water);
        break;
      }

      default:
        rootGeometry = new THREE.DodecahedronGeometry(0.35);
        rootMaterial = stdMat(item.color);
    }
  }

  const rootMesh = new THREE.Mesh(rootGeometry, rootMaterial);
  rootMesh.userData = {
    id: item.id,
    name: item.name,
    type,
    baseColor: item.color,
    baseY: 0,
    homeX: 0,
    homeY: 0,
    homeZ: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    selected: false,
    hovered: false,
    used: false,
    animating: false,
  };

  rootMesh.castShadow = true;
  rootMesh.receiveShadow = true;

  for (const part of childParts) {
    part.userData = rootMesh.userData;
    part.castShadow = true;
    part.receiveShadow = true;
    rootMesh.add(part);
  }

  const labelSprite = createLabelSprite(item.name);
  if (labelSprite) {
    labelSprite.position.set(0, type === 'tool' ? 1.15 : 0.75, 0);
    rootMesh.add(labelSprite);
  }

  return rootMesh;
}

/**
 * Menerapkan warna dan intensitas emisi ke seluruh mesh dan bagian-bagiannya.
 * @param {THREE.Object3D} obj
 * @param {number} hex
 * @param {number} intensity
 */
function applyEmissive(obj, hex, intensity) {
  obj.traverse((child) => {
    if (child.isMesh && child.material && child.material.emissive) {
      child.material.emissive.setHex(hex);
      child.material.emissiveIntensity = intensity;
    }
  });
}

/**
 * Menginisialisasi dan mengatur scene Three.js dapur Restoran Simple.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} [options]
 * @param {(item: { id: string, name: string, type: 'tool' | 'ingredient' }) => void} [options.onSelect]
 * @param {(item: { id: string, name: string, type: 'tool' | 'ingredient' } | null) => void} [options.onHover]
 * @returns {Object} Kontroler scene.
 */
export function initKitchenScene(canvas, { onSelect, onHover } = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xF8FAFC);

  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 380;

  const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
  camera.position.set(0, 7.5, 9.6);
  camera.lookAt(0, 0.2, 0.1);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2));
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;

  // Pencahayaan
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.95);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.4);
  dirLight.position.set(5, 12, 7);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const frontLight = new THREE.PointLight(0xFFFFFF, 0.6, 20);
  frontLight.position.set(0, 4, 6);
  scene.add(frontLight);

  // Meja Dapur (Countertop)
  const tableGeo = new THREE.BoxGeometry(16, 0.5, 7.5);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.8 });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.set(0, -0.25, 0);
  table.receiveShadow = true;
  scene.add(table);

  // Area Olahan Tengah (Cooking & Prep Station Plate) di Z = 0
  const prepGroup = new THREE.Group();
  prepGroup.position.set(0, 0.02, 0);

  const prepPlateGeo = new THREE.CylinderGeometry(1.5, 1.55, 0.08, 36);
  const prepPlateMat = new THREE.MeshStandardMaterial({
    color: 0xCBD5E1,
    roughness: 0.4,
    metalness: 0.5,
    emissive: 0x000000,
    emissiveIntensity: 0,
  });
  const prepPlate = new THREE.Mesh(prepPlateGeo, prepPlateMat);
  prepPlate.receiveShadow = true;
  prepGroup.add(prepPlate);

  // Cincin pijar api / pemanas kompor tengah
  const flameRingGeo = new THREE.TorusGeometry(1.2, 0.06, 12, 36);
  const flameRingMat = new THREE.MeshStandardMaterial({
    color: 0xDC2626,
    emissive: 0xDC2626,
    emissiveIntensity: 0,
    roughness: 0.2,
  });
  const flameRing = new THREE.Mesh(flameRingGeo, flameRingMat);
  flameRing.rotation.x = Math.PI / 2;
  flameRing.position.set(0, 0.06, 0);
  prepGroup.add(flameRing);

  // Wadah visual sajian olahan di piring tengah
  const dishItemsGroup = new THREE.Group();
  dishItemsGroup.position.set(0, 0.1, 0);
  prepGroup.add(dishItemsGroup);

  scene.add(prepGroup);

  const interactiveObjects = [];

  // Letakkan 7 Alat di baris belakang (Z = -1.6)
  const toolSpacing = 1.7;
  const toolStartX = -((TOOLS.length - 1) * toolSpacing) / 2;
  TOOLS.forEach((tool, i) => {
    const mesh = createKitchenObject(tool, 'tool');
    const x = toolStartX + i * toolSpacing;
    const y = 0.4;
    const z = -1.6;
    mesh.position.set(x, y, z);
    mesh.userData.baseY = y;
    mesh.userData.homeX = x;
    mesh.userData.homeY = y;
    mesh.userData.homeZ = z;
    mesh.userData.targetX = x;
    mesh.userData.targetY = y;
    mesh.userData.targetZ = z;
    scene.add(mesh);
    interactiveObjects.push(mesh);
  });

  // Letakkan 9 Bahan di baris depan (Z = 1.4)
  const ingSpacing = 1.28;
  const ingStartX = -((INGREDIENTS.length - 1) * ingSpacing) / 2;
  INGREDIENTS.forEach((ing, i) => {
    const mesh = createKitchenObject(ing, 'ingredient');
    const x = ingStartX + i * ingSpacing;
    const y = 0.35;
    const z = 1.4;
    mesh.position.set(x, y, z);
    mesh.userData.baseY = y;
    mesh.userData.homeX = x;
    mesh.userData.homeY = y;
    mesh.userData.homeZ = z;
    mesh.userData.targetX = x;
    mesh.userData.targetY = y;
    mesh.userData.targetZ = z;
    scene.add(mesh);
    interactiveObjects.push(mesh);
  });

  // Raycaster dan bidang geser horizontal (Drag Plane)
  // dragPlane diletakkan di Y = 0.4 agar sejajar permukaan meja tempat objek berdiri
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.4);
  const planeIntersection = new THREE.Vector3();
  const dragOffset = new THREE.Vector3();

  let hoveredObject = null;
  let dragTarget = null;
  let isDragging = false;
  let isPointerDown = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let isPaused = false;
  let activeProcessingTool = null;
  let currentProcessProgress = 0;

  function updateHoverVisual(mesh, isHover) {
    if (!mesh) return;
    if (isHover) {
      applyEmissive(mesh, 0x3B82F6, 0.45);
      if (mesh !== dragTarget) {
        mesh.userData.targetY = mesh.userData.homeY + 0.18;
      }
    } else if (!mesh.userData.selected && mesh !== dragTarget) {
      if (mesh.userData.used) {
        applyEmissive(mesh, 0x10B981, 0.4);
      } else {
        applyEmissive(mesh, 0x000000, 0);
      }
      mesh.userData.targetY = mesh.userData.homeY;
    }
  }

  function updateSelectedVisual(mesh, isSelected) {
    if (!mesh) return;
    mesh.userData.selected = isSelected;
    if (isSelected) {
      applyEmissive(mesh, 0x10B981, 0.65);
      mesh.userData.targetY = mesh.userData.homeY + 0.35;
    } else {
      if (mesh.userData.used) {
        applyEmissive(mesh, 0x10B981, 0.4);
      } else {
        applyEmissive(mesh, 0x000000, 0);
      }
      mesh.userData.targetY = mesh.userData.homeY;
    }
  }

  function findInteractiveRoot(obj) {
    let curr = obj;
    while (curr && !curr.userData?.id && curr.parent) {
      curr = curr.parent;
    }
    return curr?.userData?.id ? curr : null;
  }

  /**
   * Menjalankan animasi penerbangan otomatis menuju wajan tengah lalu kembali.
   * @param {THREE.Mesh} obj
   */
  function animateFlyToCenter(obj) {
    if (!obj) return;
    obj.userData.animating = true;
    obj.userData.targetX = 0;
    obj.userData.targetY = 1.1;
    obj.userData.targetZ = 0;

    setTimeout(() => {
      // Menukik ke dalam wajan
      obj.userData.targetY = 0.45;
      setTimeout(() => {
        // Meluncur kembali ke tempat semula
        obj.userData.targetX = obj.userData.homeX;
        obj.userData.targetY = obj.userData.homeY;
        obj.userData.targetZ = obj.userData.homeZ;
        setTimeout(() => {
          obj.userData.animating = false;
        }, 300);
      }, 180);
    }, 220);
  }

  function onPointerMove(event) {
    if (isPaused) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Jika sedang dalam proses dragging (pemain menggerakkan objek)
    if (isPointerDown && dragTarget) {
      const dist = Math.hypot(event.clientX - startPointerX, event.clientY - startPointerY);
      if (dist > 4) {
        isDragging = true;
        canvas.style.cursor = 'grabbing';
      }

      if (isDragging && raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
        dragTarget.position.x = planeIntersection.x + dragOffset.x;
        dragTarget.position.z = planeIntersection.z + dragOffset.z;
        dragTarget.position.y = dragTarget.userData.homeY + 0.85; // Mengangkat objek di atas meja
        dragTarget.rotation.z = -((dragTarget.position.x - dragTarget.userData.homeX) * 0.08);

        // Periksa apakah objek diarahkan ke piring olahan tengah (Cooking Plate di X=0, Z=0)
        const distToCenter = Math.hypot(dragTarget.position.x, dragTarget.position.z);
        if (distToCenter < 2.2) {
          prepPlateMat.emissive.setHex(0x10B981);
          prepPlateMat.emissiveIntensity = 0.55;
          if (typeof onHover === 'function') {
            onHover({
              id: dragTarget.userData.id,
              name: `Lepaskan ${dragTarget.userData.name} ke Piring Olahan`,
              type: dragTarget.userData.type,
            });
          }
        } else {
          prepPlateMat.emissive.setHex(0x000000);
          prepPlateMat.emissiveIntensity = 0;
          if (typeof onHover === 'function') {
            onHover({
              id: dragTarget.userData.id,
              name: `Menggerakkan ${dragTarget.userData.name}...`,
              type: dragTarget.userData.type,
            });
          }
        }
        return;
      }
    }

    // Hover biasa saat tidak dragging
    const intersects = raycaster.intersectObjects(interactiveObjects, true);
    if (intersects.length > 0) {
      const topObj = findInteractiveRoot(intersects[0].object);
      if (topObj && hoveredObject !== topObj) {
        if (hoveredObject) updateHoverVisual(hoveredObject, false);
        hoveredObject = topObj;
        updateHoverVisual(hoveredObject, true);
        canvas.style.cursor = 'grab';
        if (typeof onHover === 'function') {
          onHover({
            id: hoveredObject.userData.id,
            name: hoveredObject.userData.name,
            type: hoveredObject.userData.type,
          });
        }
      }
    } else {
      if (hoveredObject && !isDragging) {
        updateHoverVisual(hoveredObject, false);
        hoveredObject = null;
        canvas.style.cursor = 'default';
        if (typeof onHover === 'function') onHover(null);
      }
    }
  }

  function onPointerDown(event) {
    if (isPaused) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    startPointerX = event.clientX;
    startPointerY = event.clientY;
    isPointerDown = true;
    isDragging = false;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      const clicked = findInteractiveRoot(intersects[0].object);
      if (clicked) {
        dragTarget = clicked;
        // Pointer capture agar pointermove/pointerup tetap dikirim
        // ke canvas meski kursor keluar area canvas saat drag
        if (canvas.setPointerCapture && event.pointerId !== undefined) {
          try {
            canvas.setPointerCapture(event.pointerId);
          } catch {
            // Abaikan jika tidak didukung
          }
        }

        if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
          dragOffset.copy(clicked.position).sub(planeIntersection);
        }
      }
    }
  }

  function onPointerUp(event) {
    const wasPaused = isPaused;
    isPointerDown = false;

    if (canvas.releasePointerCapture && event.pointerId !== undefined) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Abaikan
      }
    }

    prepPlateMat.emissive.setHex(0x000000);
    prepPlateMat.emissiveIntensity = 0;

    if (wasPaused || !dragTarget) {
      dragTarget = null;
      isDragging = false;
      return;
    }

    const target = dragTarget;
    dragTarget = null;
    canvas.style.cursor = 'default';

    if (isDragging) {
      isDragging = false;
      updateSelectedVisual(target, true);

      // Animasi menukik ke piring tengah lalu kembali ke stand
      target.userData.targetX = 0;
      target.userData.targetY = 0.35;
      target.userData.targetZ = 0;

      setTimeout(() => {
        updateSelectedVisual(target, false);
        target.userData.targetX = target.userData.homeX;
        target.userData.targetY = target.userData.homeY;
        target.userData.targetZ = target.userData.homeZ;
      }, 250);

      if (typeof onSelect === 'function') {
        onSelect({
          id: target.userData.id,
          name: target.userData.name,
          type: target.userData.type,
        });
      }
    } else {
      // Klik instan (Tap tanpa drag) -> animasi terbang ke tengah piring
      animateFlyToCenter(target);
      updateSelectedVisual(target, true);
      setTimeout(() => updateSelectedVisual(target, false), 400);

      if (typeof onSelect === 'function') {
        onSelect({
          id: target.userData.id,
          name: target.userData.name,
          type: target.userData.type,
        });
      }
    }
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);

  let lastWidth = 0;
  let lastHeight = 0;
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w > 0 && h > 0 && (w !== lastWidth || h !== lastHeight)) {
      lastWidth = w;
      lastHeight = h;
      camera.aspect = w / h;
      if (camera.aspect < 1.6) {
        const factor = 1.6 / Math.max(camera.aspect, 0.9);
        camera.position.z = 9.6 * factor;
        camera.position.y = 7.5 * factor;
      } else {
        camera.position.z = 9.6;
        camera.position.y = 7.5;
      }
      camera.lookAt(0, 0.2, 0.1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', resize);
  }

  let animId = null;
  function render() {
    resize();

    // 1. Interpolasi pegas lembut untuk pergerakan semua objek 3D
    for (const obj of interactiveObjects) {
      if (obj !== dragTarget) {
        obj.position.x += (obj.userData.targetX - obj.position.x) * 0.18;
        obj.position.y += (obj.userData.targetY - obj.position.y) * 0.18;
        obj.position.z += (obj.userData.targetZ - obj.position.z) * 0.18;
        obj.rotation.z += (0 - obj.rotation.z) * 0.18;
      }
    }

    // 2. Animasi proses memasak aktif
    if (activeProcessingTool && currentProcessProgress > 0 && currentProcessProgress < 1) {
      // Pijar api kompor tengah berdenyut
      flameRingMat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.015) * 0.5;

      // Animasi gerak alat khusus saat proses berlangsung
      for (const obj of interactiveObjects) {
        if (obj.userData.type !== 'tool') continue;
        const id = obj.userData.id;
        const isMatch = activeProcessingTool === id ||
          (activeProcessingTool === 'kompor + penggorengan' && (id === 'kompor' || id === 'penggorengan'));

        if (isMatch) {
          if (id === 'spatula') {
            // Gerakan mengaduk / membalik melingkar
            obj.userData.targetX = 0 + Math.sin(Date.now() * 0.008) * 0.4;
            obj.userData.targetZ = 0 + Math.cos(Date.now() * 0.008) * 0.4;
            obj.userData.targetY = 0.7 + Math.sin(Date.now() * 0.016) * 0.15;
            obj.rotation.z = Math.sin(Date.now() * 0.01) * 0.5;
          } else if (id === 'blender buah') {
            // Getaran blender berputar kencang
            obj.position.x = obj.userData.homeX + (Math.random() - 0.5) * 0.05;
          } else {
            // Getaran memasak wajan / kompor
            obj.position.y = obj.userData.homeY + Math.sin(Date.now() * 0.02) * 0.04;
          }
        }
      }
    } else {
      flameRingMat.emissiveIntensity = 0;
    }

    renderer.render(scene, camera);
    animId = requestAnimationFrame(render);
  }
  render();

  /**
   * Menampilkan progres dan animasi visual proses pada alat dan area masak tengah.
   * @param {string | null} toolId
   * @param {number} progress
   */
  function showProcessProgress(toolId, progress) {
    activeProcessingTool = toolId;
    currentProcessProgress = progress;

    for (const obj of interactiveObjects) {
      if (obj.userData.type !== 'tool') continue;
      const isMatch = toolId && (
        obj.userData.id === toolId ||
        (toolId === 'kompor + penggorengan' && (obj.userData.id === 'kompor' || obj.userData.id === 'penggorengan'))
      );

      if (isMatch && progress > 0 && progress < 1) {
        applyEmissive(obj, 0xF59E0B, 0.4 + progress * 0.4);
      } else {
        if (!obj.userData.selected && obj !== hoveredObject && obj !== dragTarget) {
          applyEmissive(obj, 0x000000, 0);
          obj.userData.targetX = obj.userData.homeX;
          obj.userData.targetY = obj.userData.homeY;
          obj.userData.targetZ = obj.userData.homeZ;
        }
      }
    }
  }

  /**
   * Menandai bahan yang sudah dimasukkan dan memunculkan representasi 3D di piring tengah.
   * @param {string} ingredientId
   */
  function markIngredientUsed(ingredientId) {
    for (const obj of interactiveObjects) {
      if (obj.userData.type === 'ingredient' && obj.userData.id === ingredientId) {
        obj.userData.used = true;
        applyEmissive(obj, 0x10B981, 0.45);
      }
    }

    // Tambahkan miniatur bahan 3D ke piring masak tengah
    const count = dishItemsGroup.children.length;
    const miniMat = new THREE.MeshStandardMaterial({
      color: ingredientId === 'telur' ? 0xFDE047 :
             ingredientId === 'buah' ? 0xEF4444 :
             ingredientId === 'roti' ? 0xD97706 :
             ingredientId === 'sayur' ? 0x22C55E :
             ingredientId === 'susu' ? 0xFFFFFF : 0x60A5FA,
      roughness: 0.3,
    });
    const mini = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2), miniMat);
    const angle = (count * Math.PI) / 3;
    const radius = 0.5 + Math.random() * 0.3;
    mini.position.set(Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius);
    mini.castShadow = true;
    dishItemsGroup.add(mini);
  }

  /**
   * Mereset tanda visual bahan dan membersihkan piring masak tengah.
   */
  function resetIngredientMarks() {
    for (const obj of interactiveObjects) {
      if (obj.userData.type === 'ingredient') {
        obj.userData.used = false;
        applyEmissive(obj, 0x000000, 0);
        obj.userData.targetY = obj.userData.homeY;
      }
    }

    while (dishItemsGroup.children.length > 0) {
      const child = dishItemsGroup.children[0];
      dishItemsGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }
  }

  return {
    scene,
    camera,
    renderer,
    interactiveObjects,
    showProcessProgress,
    markIngredientUsed,
    resetIngredientMarks,
    setPaused(paused) {
      isPaused = Boolean(paused);
      if (isPaused) {
        canvas.style.cursor = 'not-allowed';
        if (dragTarget) {
          dragTarget.userData.targetX = dragTarget.userData.homeX;
          dragTarget.userData.targetY = dragTarget.userData.homeY;
          dragTarget.userData.targetZ = dragTarget.userData.homeZ;
          dragTarget = null;
        }
        isDragging = false;
        isPointerDown = false;
        if (hoveredObject) {
          updateHoverVisual(hoveredObject, false);
          hoveredObject = null;
        }
      } else {
        canvas.style.cursor = 'default';
      }
    },
    resize,
    destroy() {
      if (animId !== null) cancelAnimationFrame(animId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resize);
      }
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      renderer.dispose();
      for (const obj of interactiveObjects) {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
      }
      tableGeo.dispose();
      tableMat.dispose();
      prepPlateGeo.dispose();
      prepPlateMat.dispose();
      flameRingGeo.dispose();
      flameRingMat.dispose();
    },
  };
}
