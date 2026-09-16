import * as THREE from 'three';
import { CONTAINER, ZONES } from '../config/dimensions.js';

// Clean LED ceiling lighting for both zones, plus soft ambient/hemisphere
// fill so the interior reads clearly without RGB or futuristic effects.
export function createLighting() {
  const group = new THREE.Group();
  group.name = 'Lighting';

  // Three.js uses physically-based light units, which need considerably
  // higher intensity values than the pre-r155 "classic" lighting model.
  const ambient = new THREE.AmbientLight(0xffffff, 1.3);
  group.add(ambient);

  const hemi = new THREE.HemisphereLight(0xf3f6f8, 0x5c5f4e, 1.1);
  group.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff3e0, 2.4);
  sun.position.set(6, 8, 4);
  sun.target.position.set(CONTAINER.length / 2, 0, CONTAINER.width / 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 20;
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -6;
  group.add(sun);
  group.add(sun.target);

  const ceilingY = CONTAINER.interiorHeight - 0.05;

  function addPanelLight(x, z, w = 0.9, d = 0.28) {
    const panelGeo = new THREE.BoxGeometry(w, 0.03, d);
    const panel = new THREE.Mesh(panelGeo, new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.1,
    }));
    panel.position.set(x, ceilingY, z);
    group.add(panel);

    const light = new THREE.PointLight(0xfff6e8, 8, 4.5, 2);
    light.position.set(x, ceilingY - 0.08, z);
    light.castShadow = false;
    group.add(light);
  }

  // Zone 1 (multipurpose) — two rows of panel lights along its length.
  const z1 = ZONES.zone1;
  const z1Length = z1.xMax - z1.xMin;
  const z1Positions = [0.28, 0.72];
  z1Positions.forEach((t) => addPanelLight(z1.xMin + t * z1Length, CONTAINER.width / 2));

  // Zone 2 (private + IoT) — one centered panel light.
  const z2 = ZONES.zone2;
  addPanelLight((z2.xMin + z2.xMax) / 2, CONTAINER.width / 2, 0.7, 0.24);

  return group;
}
