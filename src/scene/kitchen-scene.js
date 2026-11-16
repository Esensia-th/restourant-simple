/**
 * @file kitchen-scene.js — Scene Three.js untuk 7 alat dan 9 bahan 3D (F3).
 * Menampilkan model 3D prosedural komposit detail, pencahayaan realistis,
 * label 3D, serta raycaster pointer & click yang responsif.
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
        // Base badan kompor
        rootGeometry = new THREE.BoxGeometry(1.6, 0.35, 1.6);
        rootMaterial = stdMat(0x334155, 0.4, 0.4);

        // Tungku kiri & kanan
        const burnerGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.08, 24);
        const burnerMat = stdMat(0x1E293B, 0.3, 0.8);
        const b1 = new THREE.Mesh(burnerGeo, burnerMat);
        b1.position.set(-0.38, 0.2, 0);
        childParts.push(b1);
        const b2 = new THREE.Mesh(burnerGeo, burnerMat);
        b2.position.set(0.38, 0.2, 0);
        childParts.push(b2);

        // Spiral pemanas merah
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

        // Kenop putar depan
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
        // Wajan cekung
        rootGeometry = new THREE.CylinderGeometry(0.8, 0.65, 0.28, 24);
        rootMaterial = stdMat(0x1E293B, 0.3, 0.7);

        // Dasar dalam wajan
        const innerGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.04, 24);
        const innerMat = stdMat(0x0F172A, 0.2, 0.8);
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.set(0, 0.05, 0);
        childParts.push(inner);

        // Gagang wajan panjang
        const handleGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.95, 16);
        const handleMat = stdMat(0x78350F, 0.6, 0.1);
        const handle = new THREE.Mesh(handleGeo, handleMat);
        handle.rotation.x = Math.PI / 2.2;
        handle.position.set(0, 0.08, 1.05);
        childParts.push(handle);
        break;
      }

      case 'spatula': {
        // Kepala spatula ceper
        rootGeometry = new THREE.BoxGeometry(0.38, 0.04, 0.5);
        rootMaterial = stdMat(0x94A3B8, 0.2, 0.9);

        // Batang logam
        const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.8, 16);
        const shaftMat = stdMat(0x64748B, 0.2, 0.9);
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.rotation.x = Math.PI / 3;
        shaft.position.set(0, 0.18, 0.55);
        childParts.push(shaft);

        // Pegangan kayu
        const gripGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.45, 16);
        const gripMat = stdMat(0x78350F, 0.5, 0.1);
        const grip = new THREE.Mesh(gripGeo, gripMat);
        grip.rotation.x = Math.PI / 3;
        grip.position.set(0, 0.38, 0.92);
        childParts.push(grip);
        break;
      }

      case 'alat pembuat kopi': {
        // Menara mesin kopi
        rootGeometry = new THREE.BoxGeometry(0.85, 1.35, 0.85);
        rootMaterial = stdMat(0x1E293B, 0.3, 0.5);

        // Filter basket atas
        const basketGeo = new THREE.CylinderGeometry(0.3, 0.24, 0.3, 20);
        const basketMat = stdMat(0x334155, 0.3, 0.6);
        const basket = new THREE.Mesh(basketGeo, basketMat);
        basket.position.set(0, 0.28, 0.28);
        childParts.push(basket);

        // Teko kaca kopi
        const potGeo = new THREE.CylinderGeometry(0.26, 0.3, 0.55, 20);
        const potMat = stdMat(0x451A03, 0.1, 0.2, { transparent: true, opacity: 0.85 });
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.position.set(0, -0.22, 0.28);
        childParts.push(pot);
        break;
      }

      case 'wadah es batu': {
        // Wadah es transparan
        rootGeometry = new THREE.BoxGeometry(1.2, 0.45, 0.85);
        rootMaterial = stdMat(0x38BDF8, 0.2, 0.1, { transparent: true, opacity: 0.8 });

        // Es batu di dalam
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
        // Dudukan dispenser putih
        rootGeometry = new THREE.BoxGeometry(0.8, 0.55, 0.8);
        rootMaterial = stdMat(0xF1F5F9, 0.3, 0.1);

        // Botol galon biru terbalik di atas
        const jugGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.05, 24);
        const jugMat = stdMat(0x0284C7, 0.1, 0.2, { transparent: true, opacity: 0.85 });
        const jug = new THREE.Mesh(jugGeo, jugMat);
        jug.position.set(0, 0.75, 0);
        childParts.push(jug);

        // Tutup galon
        const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
        const capMat = stdMat(0x1E40AF, 0.3, 0.2);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(0, 1.32, 0);
        childParts.push(cap);

        // Keran dispenser merah
        const tapGeo = new THREE.BoxGeometry(0.1, 0.14, 0.18);
        const tapMat = stdMat(0xEF4444, 0.3, 0.3);
        const tap = new THREE.Mesh(tapGeo, tapMat);
        tap.position.set(0, 0.08, 0.45);
        childParts.push(tap);
        break;
      }

      case 'blender buah': {
        // Dudukan mesin blender
        rootGeometry = new THREE.CylinderGeometry(0.45, 0.52, 0.5, 24);
        rootMaterial = stdMat(0x10B981, 0.3, 0.4);

        // Tombol putar
        const dialGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16);
        const dialMat = stdMat(0x1E293B, 0.3, 0.6);
        const dial = new THREE.Mesh(dialGeo, dialMat);
        dial.rotation.x = Math.PI / 2;
        dial.position.set(0, 0.04, 0.48);
        childParts.push(dial);

        // Jar blender kaca hijau bening
        const jarGeo = new THREE.CylinderGeometry(0.42, 0.28, 0.9, 24);
        const jarMat = stdMat(0x6EE7B7, 0.1, 0.1, { transparent: true, opacity: 0.75 });
        const jar = new THREE.Mesh(jarGeo, jarMat);
        jar.position.set(0, 0.65, 0);
        childParts.push(jar);

        // Tutup blender hitam
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
        // Kotak susu
        rootGeometry = new THREE.BoxGeometry(0.5, 0.75, 0.5);
        rootMaterial = stdMat(0xF8FAFC, 0.4, 0.1);

        // Pita biru khas susu
        const bandGeo = new THREE.BoxGeometry(0.51, 0.22, 0.51);
        const bandMat = stdMat(0x3B82F6, 0.4, 0.1);
        const band = new THREE.Mesh(bandGeo, bandMat);
        band.position.set(0, -0.05, 0);
        childParts.push(band);

        // Atap kotak susu
        const roofGeo = new THREE.ConeGeometry(0.38, 0.25, 4);
        const roofMat = stdMat(0x3B82F6, 0.4, 0.1);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 0.48, 0);
        childParts.push(roof);
        break;
      }

      case 'buah': {
        // Apel merah
        rootGeometry = new THREE.SphereGeometry(0.44, 24, 24);
        rootMaterial = stdMat(0xEF4444, 0.3, 0.1);

        // Tangkai apel
        const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 12);
        const stemMat = stdMat(0x78350F, 0.6, 0.1);
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.set(0, 0.46, 0);
        childParts.push(stem);

        // Daun hijau kecil
        const leafGeo = new THREE.SphereGeometry(0.1, 10, 10);
        const leafMat = stdMat(0x22C55E, 0.4, 0.1);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.scale.set(1.6, 0.4, 0.8);
        leaf.position.set(0.12, 0.46, 0);
        childParts.push(leaf);
        break;
      }

      case 'roti': {
        // Irisan roti tawar
        rootGeometry = new THREE.BoxGeometry(0.7, 0.55, 0.22);
        rootMaterial = stdMat(0xF59E0B, 0.6, 0.1);

        // Pinggiran kulit roti cokelat
        const crustGeo = new THREE.BoxGeometry(0.74, 0.59, 0.2);
        const crustMat = stdMat(0xB45309, 0.6, 0.1);
        const crust = new THREE.Mesh(crustGeo, crustMat);
        crust.position.set(0, 0, -0.02);
        childParts.push(crust);
        break;
      }

      case 'telur': {
        // Telur ayam lonjong
        rootGeometry = new THREE.SphereGeometry(0.38, 24, 24);
        rootMaterial = stdMat(0xFDE047, 0.3, 0.1);

        // Cangkir telur kecil
        const cupGeo = new THREE.CylinderGeometry(0.32, 0.2, 0.2, 20);
        const cupMat = stdMat(0xE2E8F0, 0.4, 0.3);
        const cup = new THREE.Mesh(cupGeo, cupMat);
        cup.position.set(0, -0.22, 0);
        childParts.push(cup);
        break;
      }

      case 'sayur': {
        // Kumpulan daun selada segar
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
        // Botol garam
        rootGeometry = new THREE.CylinderGeometry(0.28, 0.32, 0.62, 20);
        rootMaterial = stdMat(0xE2E8F0, 0.3, 0.2);

        // Tutup garam berlubang logam
        const capGeo = new THREE.CylinderGeometry(0.26, 0.28, 0.14, 20);
        const capMat = stdMat(0x94A3B8, 0.2, 0.9);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(0, 0.36, 0);
        childParts.push(cap);
        break;
      }

      case 'gula': {
        // Mangkuk gula merah muda
        rootGeometry = new THREE.CylinderGeometry(0.38, 0.25, 0.38, 20);
        rootMaterial = stdMat(0xF472B6, 0.3, 0.2);

        // Gula pasir putih di dalam
        const sugarGeo = new THREE.SphereGeometry(0.32, 16, 16);
        const sugarMat = stdMat(0xFFFFFF, 0.4, 0.1);
        const sugar = new THREE.Mesh(sugarGeo, sugarMat);
        sugar.scale.set(1, 0.45, 1);
        sugar.position.set(0, 0.1, 0);
        childParts.push(sugar);
        break;
      }

      case 'biji kopi': {
        // Mangkuk kayu biji kopi
        rootGeometry = new THREE.CylinderGeometry(0.38, 0.25, 0.36, 20);
        rootMaterial = stdMat(0x78350F, 0.6, 0.1);

        // Biji kopi gelap di dalam
        const beansGeo = new THREE.SphereGeometry(0.32, 16, 16);
        const beansMat = stdMat(0x271406, 0.4, 0.1);
        const beans = new THREE.Mesh(beansGeo, beansMat);
        beans.scale.set(1, 0.45, 1);
        beans.position.set(0, 0.1, 0);
        childParts.push(beans);
        break;
      }

      case 'air': {
        // Gelas air bening
        rootGeometry = new THREE.CylinderGeometry(0.3, 0.24, 0.72, 20);
        rootMaterial = stdMat(0xE0F2FE, 0.1, 0.1, { transparent: true, opacity: 0.45 });

        // Air biru segar di dalam
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
    selected: false,
    hovered: false,
    used: false,
  };

  rootMesh.castShadow = true;
  rootMesh.receiveShadow = true;

  // Sambungkan semua child mesh dan sinkronkan userData
  for (const part of childParts) {
    part.userData = rootMesh.userData;
    part.castShadow = true;
    part.receiveShadow = true;
    rootMesh.add(part);
  }

  // Label nama 3D mengambang di atas objek
  const labelSprite = createLabelSprite(item.name);
  if (labelSprite) {
    labelSprite.position.set(0, type === 'tool' ? 1.05 : 0.7, 0);
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

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 6.8, 8.8);
  camera.lookAt(0, 0.1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2));
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;

  // Pencahayaan
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.3);
  dirLight.position.set(5, 12, 7);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Lampu aksen lembut dari depan
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

  const interactiveObjects = [];

  // Letakkan 7 Alat di baris belakang (Z = -1.6)
  const toolSpacing = 2.1;
  const toolStartX = -((TOOLS.length - 1) * toolSpacing) / 2;
  TOOLS.forEach((tool, i) => {
    const mesh = createKitchenObject(tool, 'tool');
    const x = toolStartX + i * toolSpacing;
    const y = 0.4;
    const z = -1.6;
    mesh.position.set(x, y, z);
    mesh.userData.baseY = y;
    scene.add(mesh);
    interactiveObjects.push(mesh);
  });

  // Letakkan 9 Bahan di baris depan (Z = 1.4)
  const ingSpacing = 1.55;
  const ingStartX = -((INGREDIENTS.length - 1) * ingSpacing) / 2;
  INGREDIENTS.forEach((ing, i) => {
    const mesh = createKitchenObject(ing, 'ingredient');
    const x = ingStartX + i * ingSpacing;
    const y = 0.35;
    const z = 1.4;
    mesh.position.set(x, y, z);
    mesh.userData.baseY = y;
    scene.add(mesh);
    interactiveObjects.push(mesh);
  });

  // Raycaster untuk interaksi pointer (Hover & Click)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  let hoveredObject = null;
  let isPaused = false;
  let lastSelectTime = 0;

  function updateHoverVisual(mesh, isHover) {
    if (!mesh) return;
    if (isHover) {
      applyEmissive(mesh, 0x3B82F6, 0.4);
      mesh.position.y = mesh.userData.baseY + 0.15;
    } else if (!mesh.userData.selected) {
      if (mesh.userData.used) {
        applyEmissive(mesh, 0x10B981, 0.4);
      } else {
        applyEmissive(mesh, 0x000000, 0);
      }
      mesh.position.y = mesh.userData.baseY;
    }
  }

  function updateSelectedVisual(mesh, isSelected) {
    if (!mesh) return;
    mesh.userData.selected = isSelected;
    if (isSelected) {
      applyEmissive(mesh, 0x10B981, 0.6);
      mesh.position.y = mesh.userData.baseY + 0.3;
    } else {
      if (mesh.userData.used) {
        applyEmissive(mesh, 0x10B981, 0.4);
      } else {
        applyEmissive(mesh, 0x000000, 0);
      }
      mesh.position.y = mesh.userData.baseY;
    }
  }

  function findInteractiveRoot(obj) {
    let curr = obj;
    while (curr && !curr.userData?.id && curr.parent) {
      curr = curr.parent;
    }
    return curr?.userData?.id ? curr : null;
  }

  function onPointerMove(event) {
    if (isPaused) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      const topObj = findInteractiveRoot(intersects[0].object);
      if (topObj && hoveredObject !== topObj) {
        if (hoveredObject) updateHoverVisual(hoveredObject, false);
        hoveredObject = topObj;
        updateHoverVisual(hoveredObject, true);
        canvas.style.cursor = 'pointer';
        if (typeof onHover === 'function') {
          onHover({
            id: hoveredObject.userData.id,
            name: hoveredObject.userData.name,
            type: hoveredObject.userData.type,
          });
        }
      }
    } else {
      if (hoveredObject) {
        updateHoverVisual(hoveredObject, false);
        hoveredObject = null;
        canvas.style.cursor = 'default';
        if (typeof onHover === 'function') onHover(null);
      }
    }
  }

  function handleInteraction(event) {
    if (isPaused) return;
    const now = Date.now();
    if (now - lastSelectTime < 150) return; // Debounce sentuhan ganda
    lastSelectTime = now;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      const clicked = findInteractiveRoot(intersects[0].object);
      if (!clicked) return;

      // Berikan visual terpilih sejenak
      updateSelectedVisual(clicked, true);
      setTimeout(() => {
        updateSelectedVisual(clicked, false);
        if (hoveredObject === clicked) updateHoverVisual(clicked, true);
      }, 250);

      if (typeof onSelect === 'function') {
        onSelect({
          id: clicked.userData.id,
          name: clicked.userData.name,
          type: clicked.userData.type,
        });
      }
    }
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', handleInteraction);
  canvas.addEventListener('click', handleInteraction);

  let lastWidth = 0;
  let lastHeight = 0;
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w > 0 && h > 0 && (w !== lastWidth || h !== lastHeight)) {
      lastWidth = w;
      lastHeight = h;
      camera.aspect = w / h;
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
    renderer.render(scene, camera);
    animId = requestAnimationFrame(render);
  }
  render();

  /**
   * Memperbarui indikator progres proses pada alat yang sedang dipakai.
   * progress: 0 (belum mulai) sampai 1 (selesai).
   * @param {string | null} toolId — id alat yang sedang memproses, null jika tidak ada
   * @param {number} progress — 0 sampai 1
   */
  function showProcessProgress(toolId, progress) {
    for (const obj of interactiveObjects) {
      if (obj.userData.type !== 'tool') continue;
      const isMatch = toolId && (
        obj.userData.id === toolId ||
        (toolId === 'kompor + penggorengan' && (obj.userData.id === 'kompor' || obj.userData.id === 'penggorengan'))
      );
      if (isMatch && progress > 0 && progress < 1) {
        // Warna kuning-oranye saat proses berjalan; intensitas naik seiring progres
        applyEmissive(obj, 0xF59E0B, 0.4 + progress * 0.4);
        obj.position.y = obj.userData.baseY + 0.08 * Math.sin(progress * Math.PI * 4);
      } else {
        // Kembalikan ke normal jika bukan alat aktif atau proses selesai
        if (!obj.userData.selected && obj !== hoveredObject) {
          applyEmissive(obj, 0x000000, 0);
          obj.position.y = obj.userData.baseY;
        }
      }
    }
  }

  /**
   * Menandai bahan sebagai sudah dipakai dengan perubahan warna visual.
   * @param {string} ingredientId
   */
  function markIngredientUsed(ingredientId) {
    for (const obj of interactiveObjects) {
      if (obj.userData.type === 'ingredient' && obj.userData.id === ingredientId) {
        obj.userData.used = true;
        applyEmissive(obj, 0x10B981, 0.4);
      }
    }
  }

  /**
   * Mereset semua tanda visual bahan (misalnya saat pelanggan baru datang).
   */
  function resetIngredientMarks() {
    for (const obj of interactiveObjects) {
      if (obj.userData.type === 'ingredient') {
        obj.userData.used = false;
        applyEmissive(obj, 0x000000, 0);
        obj.position.y = obj.userData.baseY;
      }
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
      canvas.removeEventListener('pointerdown', handleInteraction);
      canvas.removeEventListener('click', handleInteraction);
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
    },
  };
}
