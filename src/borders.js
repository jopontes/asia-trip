import * as THREE from 'three';
import { feature } from 'topojson-client';
import countriesTopo from 'world-atlas/countries-50m.json';
import { lonLatToVector3, EARTH_RADIUS } from './geo-utils.js';

// Constrói linhas finas das fronteiras de países na superfície do globo.
export function createBorders(parent) {
  const fc = feature(countriesTopo, countriesTopo.objects.countries);
  const radius = EARTH_RADIUS * 1.0015;

  const positions = [];
  const addRing = (ring) => {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = lonLatToVector3(ring[i][0],   ring[i][1],   radius);
      const b = lonLatToVector3(ring[i+1][0], ring[i+1][1], radius);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  };

  for (const f of fc.features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === 'Polygon') {
      g.coordinates.forEach(addRing);
    } else if (g.type === 'MultiPolygon') {
      g.coordinates.forEach((poly) => poly.forEach(addRing));
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: 0x202020,
    transparent: true,
    opacity: 0.9,
  });
  const lines = new THREE.LineSegments(geometry, material);
  parent.add(lines);
  return lines;
}
