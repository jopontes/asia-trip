import * as THREE from 'three';
import { feature } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-50m.json';

// Corpos d'água interiores (polígonos simplificados) — recortados sobre terra.
const INLAND_WATER = [
  {
    name: 'Baikal',
    polygon: [
      [103.70, 51.50], [104.80, 52.30], [106.50, 53.00], [107.50, 53.70],
      [108.50, 54.30], [109.70, 55.20], [110.00, 55.75], [109.40, 55.85],
      [108.30, 55.10], [107.00, 54.20], [105.70, 53.40], [104.60, 52.70],
      [103.90, 52.00], [103.55, 51.60],
    ],
  },
  {
    name: 'Aral',
    polygon: [
      [58.2, 44.4], [60.5, 45.2], [61.8, 46.2], [60.9, 46.8],
      [59.3, 46.4], [58.3, 45.6], [58.0, 44.9],
    ],
  },
];

// Ilhas pequenas que o land-50m não captura — adicionadas como terra manual.
const MANUAL_LAND = [
  {
    name: 'Lesvos',
    polygon: [
      [25.85, 39.10], [26.00, 39.40], [26.20, 39.40], [26.35, 39.45],
      [26.45, 39.42], [26.55, 39.30], [26.60, 39.25], [26.55, 39.18],
      [26.30, 39.08], [26.00, 39.00], [25.85, 39.00],
    ],
  },
  {
    name: 'Chios',
    polygon: [
      [25.95, 38.35], [26.10, 38.55], [26.15, 38.50], [26.12, 38.25],
      [26.00, 38.20], [25.95, 38.30],
    ],
  },
];

const WATER = '#1f1f1f';
const LAND  = '#2c2c2c';

export function createTerrainTexture(anisotropy = 8) {
  const W = 8192;
  const H = 4096;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;

  // Base totalmente opaca.
  ctx.fillStyle = WATER;
  ctx.fillRect(0, 0, W, H);

  // Preenchimento a partir do mesmo dataset das borders, para costa e fronteiras
  // não parecerem desenhadas em resoluções diferentes.
  const land = feature(countriesTopo, countriesTopo.objects.countries);
  ctx.fillStyle = LAND;
  if (land.type === 'FeatureCollection') {
    for (const f of land.features) drawGeometry(ctx, f.geometry, W, H);
  } else {
    drawGeometry(ctx, land.geometry, W, H);
  }

  // Ilhas adicionais manuais.
  ctx.fillStyle = LAND;
  for (const isle of MANUAL_LAND) fillPolygon(ctx, isle.polygon, W, H);

  // Recorta lagos interiores de volta para água.
  ctx.fillStyle = WATER;
  for (const lake of INLAND_WATER) fillPolygon(ctx, lake.polygon, W, H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.offset.x = 0.5;
  tex.anisotropy = anisotropy;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function project(lon, lat, W, H) {
  const x = ((lon + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return [x, y];
}

function fillPolygon(ctx, ring, W, H) {
  if (!ring.length) return;
  ctx.beginPath();
  const parts = splitAtAntimeridian(ring);
  for (const part of parts) {
    const [x0, y0] = project(part[0][0], part[0][1], W, H);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < part.length; i++) {
      const [x, y] = project(part[i][0], part[i][1], W, H);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  ctx.fill();
}

function drawGeometry(ctx, geom, W, H) {
  if (!geom) return;
  if (geom.type === 'Polygon') {
    ctx.beginPath();
    for (const ring of geom.coordinates) tracePath(ctx, ring, W, H);
    ctx.fill('evenodd');
  } else if (geom.type === 'MultiPolygon') {
    ctx.beginPath();
    for (const poly of geom.coordinates) {
      for (const ring of poly) tracePath(ctx, ring, W, H);
    }
    ctx.fill('evenodd');
  }
}

function tracePath(ctx, ring, W, H) {
  const parts = splitAtAntimeridian(ring);
  for (const part of parts) {
    if (!part.length) continue;
    const [x0, y0] = project(part[0][0], part[0][1], W, H);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < part.length; i++) {
      const [x, y] = project(part[i][0], part[i][1], W, H);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
}

function splitAtAntimeridian(ring) {
  const parts = [];
  let current = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    const prev = ring[i - 1];
    const curr = ring[i];
    if (Math.abs(curr[0] - prev[0]) > 180) {
      parts.push(current);
      current = [];
    }
    current.push(curr);
  }
  if (current.length) parts.push(current);
  return parts;
}
