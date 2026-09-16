import * as THREE from 'three';

// Restrained, cost-conscious industrial-IoT-startup palette.
// Exterior stays a discreet, unbranded industrial grey.
export function createMaterials() {
  return {
    exterior: new THREE.MeshStandardMaterial({ color: 0x8a9296, roughness: 0.75, metalness: 0.35 }),
    exteriorTrim: new THREE.MeshStandardMaterial({ color: 0x5f666a, roughness: 0.7, metalness: 0.4 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x767e82, roughness: 0.8, metalness: 0.3 }),
    interiorPanel: new THREE.MeshStandardMaterial({ color: 0xeef1ee, roughness: 0.9, metalness: 0.02 }),
    interiorPanelAccent: new THREE.MeshStandardMaterial({ color: 0xdfe6e6, roughness: 0.9, metalness: 0.02 }),
    floor: new THREE.MeshStandardMaterial({ color: 0xa9835a, roughness: 0.85, metalness: 0.0 }),
    floorZone2: new THREE.MeshStandardMaterial({ color: 0x968061, roughness: 0.85, metalness: 0.0 }),

    wood: new THREE.MeshStandardMaterial({ color: 0xcda36b, roughness: 0.55, metalness: 0.03 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0xa87e4d, roughness: 0.55, metalness: 0.03 }),

    steelFrame: new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.5, metalness: 0.6 }),
    chairBlack: new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.55, metalness: 0.15 }),

    navy: new THREE.MeshStandardMaterial({ color: 0x1b3a63, roughness: 0.5, metalness: 0.15 }),
    cyan: new THREE.MeshStandardMaterial({ color: 0x2ec4d6, roughness: 0.4, metalness: 0.1 }),
    cyanEmissive: new THREE.MeshStandardMaterial({ color: 0x2ec4d6, emissive: 0x1a7f8c, emissiveIntensity: 0.6, roughness: 0.4 }),

    monitor: new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.3, metalness: 0.4 }),
    monitorScreen: new THREE.MeshStandardMaterial({ color: 0x0d1f2b, emissive: 0x0d3a4a, emissiveIntensity: 0.8, roughness: 0.2 }),

    plastic: new THREE.MeshStandardMaterial({ color: 0xe4e4e0, roughness: 0.6, metalness: 0.05 }),
    plasticDark: new THREE.MeshStandardMaterial({ color: 0x3a3a3c, roughness: 0.5, metalness: 0.1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.4, metalness: 0.7 }),
    metalDark: new THREE.MeshStandardMaterial({ color: 0x53585c, roughness: 0.45, metalness: 0.65 }),

    glassDark: new THREE.MeshStandardMaterial({ color: 0x1a2226, roughness: 0.2, metalness: 0.2, transparent: true, opacity: 0.55 }),
    ceilingLight: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.2 }),

    door: new THREE.MeshStandardMaterial({ color: 0x4a5a63, roughness: 0.5, metalness: 0.3 }),
    doorFrame: new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.5, metalness: 0.4 }),
    lockBrass: new THREE.MeshStandardMaterial({ color: 0xb08d3f, roughness: 0.35, metalness: 0.8 }),

    fabricSofa: new THREE.MeshStandardMaterial({ color: 0x445a66, roughness: 0.9, metalness: 0.0 }),

    ghost: new THREE.MeshStandardMaterial({
      color: 0x2ec4d6,
      transparent: true,
      opacity: 0.22,
      roughness: 0.6,
      metalness: 0.0,
      depthWrite: false,
    }),
    ghostWire: new THREE.LineBasicMaterial({ color: 0x2ec4d6, transparent: true, opacity: 0.55 }),

    beacon: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x2ec4d6, emissiveIntensity: 0.5, roughness: 0.4 }),
  };
}
