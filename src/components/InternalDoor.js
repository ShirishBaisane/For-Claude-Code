import { PARTITION } from '../config/dimensions.js';
import { createHingedDoorAlongZ } from '../utils/hingedDoor.js';

// The single internal door between Zone 1 (multipurpose) and Zone 2
// (private owner room + IoT lab). OFFSET toward the lower side (low Z) of
// the plan — never centered. Hinged, and fitted with a visible lock plate.
export function createInternalDoor(materials) {
  const doorStart = PARTITION.doorCenterZ - PARTITION.doorWidth / 2;
  const doorEnd = PARTITION.doorCenterZ + PARTITION.doorWidth / 2;

  const { group, setOpenFraction } = createHingedDoorAlongZ({
    x: PARTITION.centerX,
    z0: doorStart,
    z1: doorEnd,
    height: PARTITION.doorHeight,
    hingeSide: 'end',
    openSign: 1, // swings toward Zone 2 (rear) as a visitor pushes in
    material: materials.door,
    handleMaterial: materials.lockBrass,
    lockMaterial: materials.lockBrass,
    withLock: true,
  });
  group.name = 'InternalDoor';

  return { group, setOpenFraction, doorStart, doorEnd };
}
