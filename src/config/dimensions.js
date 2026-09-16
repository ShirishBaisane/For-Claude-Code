// Parametric dimensions for the PolarGrid container office.
// All spatial values are in meters. X = length axis (rear/left -> front/right).
// Z = width axis. Y = height axis. Change values here to re-derive the whole model.

const FT = 0.3048;

export const CONTAINER = {
  lengthFt: 16,
  widthFt: 8,
  length: 16 * FT, // 4.8768 m
  width: 8 * FT, // 2.4384 m
  exteriorHeight: 2.9, // standard container-like external height
  interiorHeight: 2.7, // clear interior height under ceiling
  wallThickness: 0.06,
  linerThickness: 0.02,
  linerGap: 0.015,
  roofThickness: 0.09,
  roofOverhang: 0.04,
  floorThickness: 0.06,
};

// Internal partition, offset toward the LOWER side of the plan (low Z).
export const PARTITION = {
  thickness: 0.09,
  // Zone 2 (rear/private) is the smaller zone -> partition sits ~38% along length.
  centerX: CONTAINER.length * 0.385,
  doorWidth: 0.84,
  doorHeight: 2.02,
  // Door center Z is well below width/2 (1.22 m) -> clearly offset, not centered.
  doorCenterZ: CONTAINER.width * 0.27,
};

export const ZONES = {
  // Zone 2 — Private Owner Room + IoT Lab (rear / LEFT, smaller)
  zone2: {
    name: 'Private Owner Room + IoT Lab',
    xMin: 0,
    xMax: PARTITION.centerX - PARTITION.thickness / 2,
  },
  // Zone 1 — Multipurpose Team Area (front / RIGHT, larger)
  zone1: {
    name: 'Multipurpose Area',
    xMin: PARTITION.centerX + PARTITION.thickness / 2,
    xMax: CONTAINER.length,
  },
};

// Main entrance sits in the far-RIGHT end wall (x = length), roughly centered.
export const ENTRANCE = {
  width: 0.95,
  height: 2.05,
  centerZ: CONTAINER.width / 2,
};

// Long shared team bench along the UPPER long wall (high Z) of Zone 1.
export const TEAM_BENCH = {
  depth: 0.62,
  height: 0.75,
  topThickness: 0.04,
  seats: 3,
  seatPitch: 0.68,
  marginFromPartition: 0.35,
  marginFromService: 0.25,
};

// Service / storage nook near the entrance-side end of Zone 1.
export const SERVICE_AREA = {
  depth: 0.55,
  width: 1.05, // footprint along X, against the lower wall near the entrance
};

// Flexible open floor area — kept clear, ghost furniture only.
export const FLEXIBLE_AREA = {
  marginFromWalls: 0.25,
};

// Compact owner workstation in Zone 2.
export const OWNER_DESK = {
  width: 1.3,
  depth: 0.6,
  height: 0.74,
  topThickness: 0.04,
};

// Narrow IoT / electronics engineering bench in Zone 2.
export const IOT_BENCH = {
  width: 1.5,
  depth: 0.45,
  height: 0.82,
  topThickness: 0.035,
};

export const CAMERA = {
  eyeHeight: 1.6,
  fov: 55,
};
