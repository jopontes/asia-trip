import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { EARTH_RADIUS, polylineOnSphere, flightArcPoints, greatCirclePoints } from './geo-utils.js';

const ORANGE = 0xe85a1f;
const COLORS = {
  rail:   ORANGE,
  road:   ORANGE,
  bus:    ORANGE,
  boat:   ORANGE,
  flight: ORANGE,
};

const materials = [];
export function updateLineResolutions(width, height) {
  materials.forEach((m) => m.resolution.set(width, height));
}

async function tryLoadGeoJSON(segmentId) {
  try {
    const res = await fetch(`/routes/${segmentId}.geojson`);
    if (!res.ok) return null;
    const json = await res.json();
    const feature = json.features ? json.features[0] : json;
    const geom = feature.geometry || feature;
    if (geom.type === 'LineString') return geom.coordinates;
    if (geom.type === 'MultiLineString') return geom.coordinates.flat();
    return null;
  } catch { return null; }
}

function buildPointsForSegment(seg, lonLatList) {
  const raised = EARTH_RADIUS * 1.003;
  if (seg.mode === 'flight') {
    const from = lonLatList[0];
    const to = lonLatList[lonLatList.length - 1];
    return flightArcPoints(from, to, 420, raised);
  }
  if (lonLatList && lonLatList.length >= 2) {
    // Slerp denso por par (no great-circle) — suave, sem artefatos de Catmull-Rom.
    return polylineOnSphere(lonLatList, 140, raised);
  }
  return greatCirclePoints(lonLatList[0], lonLatList[1], 320, raised);
}

export async function createRouteLine(seg, stopsById, overlay) {
  const from = stopsById[seg.from].coord;
  const to   = stopsById[seg.to].coord;

  let lonLatList = await tryLoadGeoJSON(seg.id);
  if (!lonLatList) lonLatList = seg.waypoints || [from, to];

  const points = buildPointsForSegment(seg, lonLatList);

  const positions = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    positions[i * 3]     = points[i].x;
    positions[i * 3 + 1] = points[i].y;
    positions[i * 3 + 2] = points[i].z;
  }

  const color = COLORS[seg.mode] ?? COLORS.rail;
  const isFlight = seg.mode === 'flight';

  const geometry = new LineGeometry();
  geometry.setPositions(positions);
  const material = new LineMaterial({
    color,
    linewidth: 1.6,
    transparent: isFlight,
    opacity: 1.0,
    dashed: isFlight,
    dashSize: 0.006,
    gapSize: 0.022,
    dashScale: 1,
    alphaToCoverage: false,
    worldUnits: false,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
  });
  if (isFlight) material.defines.USE_DASH = '';
  materials.push(material);

  const line = new Line2(geometry, material);
  line.computeLineDistances();
  line.renderOrder = 2;
  overlay.add(line);
  const glowLine = null;

  const totalSegments = points.length - 1;
  geometry.instanceCount = 0;

  return {
    line,
    glowLine,
    setProgress(t) {
      const count = Math.floor(Math.max(0, Math.min(1, t)) * totalSegments);
      geometry.instanceCount = count;
    },
  };
}
