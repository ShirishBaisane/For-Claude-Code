# PolarGrid Container Office — 3D Prototype

Interactive, dimensionally-accurate 3D visualization of a 16 ft shipping-container
office for PolarGrid Technologies, built with Three.js and Vite.

## Layout

The container has exactly two functional zones, separated by a single partition
with an offset (not centered) lockable internal door:

- **Zone 1 — Multipurpose Area** (front / right, larger): shared team bench
  desk along the upper wall (2–3 seats, monitors), a service/storage nook near
  the entrance (racks, coffee machine, vending/storage, a reserved fridge
  footprint), and an open flexible floor area with two optional ghost/placeholder
  furniture concepts (lounge or storage) that can be toggled but are never
  permanent.
- **Zone 2 — Private Owner Room + IoT Lab** (rear / left, smaller): a compact
  owner workstation (desk, monitor, 1–2 seats, lockable hardware storage) and a
  narrow IoT/electronics engineering bench (telematics devices, BLE beacons,
  wiring/testing gear, component storage).

Visitor flow: main entrance (far right) → multipurpose area → offset internal
door → private owner room + IoT lab.

The exterior is a plain, unbranded industrial container. A
`POLARGRID_LOGO_PLACEHOLDER` sign is the only branding, and it is placed
inside Zone 1 only — swap it out once the real logo asset is supplied.

## Getting started

```bash
npm install
npm run dev       # starts the Vite dev server (http://localhost:5173)
npm run build     # production build
npm run preview   # preview the production build
```

## Controls

- **Camera views**: Top View, Main Entrance, Multipurpose Area, Private IoT
  Lab, and an animated Walkthrough (outside → team bench → flexible area →
  offset internal door → private room → owner desk → IoT bench). Doors swing
  open automatically as the walkthrough passes through them.
- **Orbit controls**: drag to orbit, scroll to zoom, right-drag to pan.
- **Scene options**: toggle the roof for interior inspection, toggle zone
  labels, and switch the flexible-area concept (open / lounge / storage).

## Project structure

All dimensions live in `src/config/dimensions.js` — the whole model (walls,
partition, door offset, furniture placement, camera framing) is derived from
that single parametric source, so resizing the container only requires
editing that file.

- `src/components/` — one module per building block (shell, partition, doors,
  team bench, service storage, flexible area, owner workstation, IoT bench,
  lighting, interior branding).
- `src/utils/` — shared helpers (wall-with-opening builder, hinged door
  factory, small furniture primitives).
- `src/cameras/CameraViews.js` — the five camera presets and the walkthrough
  keyframe path.
- `src/ui/UIControls.js` + `src/main.js` — HUD wiring and the render loop.

This is a first-pass layout prototype: materials and lighting are kept simple
and practical (light wood worktops, black chairs, LED panel lighting,
restrained navy/cyan accents) so the two-zone architecture can be verified
before adding photorealistic detail or additional animation.
