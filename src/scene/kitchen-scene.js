/**
 * @file kitchen-scene.js — Scene Three.js untuk 7 alat dan 9 bahan 3D (F3).
 * Menampilkan geometri 3D prosedural bersih, pencahayaan, raycaster untuk
 * hover dan seleksi/klik dengan umpan balik visual jelas.
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
 * Membuat mesh 3D untuk masing-masing alat/bahan dengan geometri sederhana.
 * @param {Object} item
 * @param {'tool' | 'ingredient'} type
 * @returns {THREE.Mesh}
 */
export function createKitchenObject(item, type) {
  let geometry;

  if (type === 'tool') {
    switch (item.id) {
      case 'kompor':
        geometry = new THREE.BoxGeometry(1.4, 0.4, 1.4);
        break;
      case 'penggorengan':
        geometry = new THREE.CylinderGeometry(0.7, 0.6, 0.25, 24);
        break;
      case 'spatula':
        geometry = new THREE.BoxGeometry(0.18, 0.08, 1.2);
        break;
      case 'alat pembuat kopi':
        geometry = new THREE.CylinderGeometry(0.5, 0.6, 1.2, 20);
        break;
      case 'wadah es batu':
        geometry = new THREE.BoxGeometry(1.0, 0.5, 0.8);
        break;
      case 'galon air':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.3, 20);
        break;
      case 'blender buah':
        geometry = new THREE.ConeGeometry(0.55, 1.3, 16);
        break;
      default:
        geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    }
  } else {
    // Bahan
    switch (item.id) {
      case 'telur':
      case 'buah':
        geometry = new THREE.SphereGeometry(0.4, 16, 16);
        break;
      case 'roti':
        geometry = new THREE.BoxGeometry(0.7, 0.4, 0.7);
        break;
      case 'susu':
      case 'air':
        geometry = new THREE.CylinderGeometry(0.3, 0.35, 0.8, 16);
        break;
      default:
        geometry = new THREE.DodecahedronGeometry(0.35);
    }
  }

  const material = new THREE.MeshStandardMaterial({
    color: item.color,
    roughness: 0.4,
    metalness: type === 'tool' ? 0.3 : 0.1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {
    id: item.id,
    name: item.name,
    type,
    baseColor: item.color,
    baseY: 0,
    selected: false,
    hovered: false,
  };

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
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
  const height = canvas.clientHeight || 400;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 7.5, 9.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;

  // Pencahayaan
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  dirLight.position.set(5, 12, 7);
  dirLight.castShadow = true;
  scene.add(dirLight);

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

  function updateHoverVisual(mesh, isHover) {
    if (!mesh) return;
    if (isHover) {
      mesh.material.emissive.setHex(0x3B82F6);
      mesh.material.emissiveIntensity = 0.35;
      mesh.position.y = mesh.userData.baseY + 0.15;
    } else if (!mesh.userData.selected) {
      if (mesh.userData.used) {
        mesh.material.emissive.setHex(0x10B981);
        mesh.material.emissiveIntensity = 0.4;
      } else {
        mesh.material.emissive.setHex(0x000000);
        mesh.material.emissiveIntensity = 0;
      }
      mesh.position.y = mesh.userData.baseY;
    }
  }

  function updateSelectedVisual(mesh, isSelected) {
    if (!mesh) return;
    mesh.userData.selected = isSelected;
    if (isSelected) {
      mesh.material.emissive.setHex(0x10B981);
      mesh.material.emissiveIntensity = 0.55;
      mesh.position.y = mesh.userData.baseY + 0.3;
    } else {
      if (mesh.userData.used) {
        mesh.material.emissive.setHex(0x10B981);
        mesh.material.emissiveIntensity = 0.4;
      } else {
        mesh.material.emissive.setHex(0x000000);
        mesh.material.emissiveIntensity = 0;
      }
      mesh.position.y = mesh.userData.baseY;
    }
  }

  function onPointerMove(event) {
    if (isPaused) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, false);

    if (intersects.length > 0) {
      const topObj = intersects[0].object;
      if (hoveredObject !== topObj) {
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

  function onPointerDown(event) {
    if (isPaused) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, false);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
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
  canvas.addEventListener('pointerdown', onPointerDown);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w > 0 && h > 0) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
  }

  window.addEventListener('resize', resize);

  let animId = null;
  function render() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      resize();
    }
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
        obj.material.emissive.setHex(0xF59E0B);
        obj.material.emissiveIntensity = 0.3 + progress * 0.4;
        obj.position.y = obj.userData.baseY + 0.08 * progress;
      } else {
        // Kembalikan ke normal jika bukan alat aktif atau proses selesai
        if (!obj.userData.selected && obj !== hoveredObject) {
          obj.material.emissive.setHex(0x000000);
          obj.material.emissiveIntensity = 0;
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
        obj.material.emissive.setHex(0x10B981);
        obj.material.emissiveIntensity = 0.4;
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
        obj.material.emissive.setHex(0x000000);
        obj.material.emissiveIntensity = 0;
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
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
      for (const obj of interactiveObjects) {
        obj.geometry.dispose();
        obj.material.dispose();
      }
      tableGeo.dispose();
      tableMat.dispose();
    },
  };
}
