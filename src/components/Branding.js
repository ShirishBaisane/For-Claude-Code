import * as THREE from 'three';
import { CONTAINER, PARTITION } from '../config/dimensions.js';

// Interior-only branding placeholder. The exterior of the container must
// stay completely unbranded; this sign lives inside Zone 1, on the
// partition's entrance-facing side, so a visitor sees it on arrival.
// Replace the canvas texture below once the real PolarGrid logo is supplied.
function createPlaceholderTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#eef1ee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#1b3a63';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  ctx.fillStyle = '#1b3a63';
  ctx.font = 'bold 34px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POLARGRID_LOGO', canvas.width / 2, canvas.height / 2 - 24);
  ctx.fillText('_PLACEHOLDER', canvas.width / 2, canvas.height / 2 + 20);

  ctx.fillStyle = '#2ec4d6';
  ctx.font = '18px monospace';
  ctx.fillText('replace with supplied logo asset', canvas.width / 2, canvas.height - 34);

  return new THREE.CanvasTexture(canvas);
}

export function createBranding() {
  const group = new THREE.Group();
  group.name = 'InteriorBranding';

  const texture = createPlaceholderTexture();
  const signWidth = 0.9;
  const signHeight = 0.45;

  const signGeo = new THREE.PlaneGeometry(signWidth, signHeight);
  const signMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
  const sign = new THREE.Mesh(signGeo, signMat);

  const signX = PARTITION.centerX + PARTITION.thickness / 2 + 0.006;
  const stubStart = PARTITION.doorCenterZ + PARTITION.doorWidth / 2;
  const signZ = (stubStart + CONTAINER.width) / 2;

  sign.position.set(signX, 1.55, signZ);
  sign.rotation.y = Math.PI / 2;
  group.add(sign);

  return { group };
}
