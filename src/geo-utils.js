import * as THREE from 'three';

export const EARTH_RADIUS = 1;

// [lon, lat] em graus → Vector3 na superfície de uma esfera de raio dado.
export function lonLatToVector3(lon, lat, radius = EARTH_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Slerp entre dois pontos na esfera.
function slerp(a, b, t) {
  const angle = a.angleTo(b);
  const sinA = Math.sin(angle) || 1e-6;
  const s1 = Math.sin((1 - t) * angle) / sinA;
  const s2 = Math.sin(t * angle) / sinA;
  return new THREE.Vector3(
    a.x * s1 + b.x * s2,
    a.y * s1 + b.y * s2,
    a.z * s1 + b.z * s2,
  );
}

// Great-circle entre dois pontos.
export function greatCirclePoints(fromLonLat, toLonLat, samples = 96, radius = EARTH_RADIUS) {
  const a = lonLatToVector3(fromLonLat[0], fromLonLat[1], radius);
  const b = lonLatToVector3(toLonLat[0],   toLonLat[1],   radius);
  const out = [];
  for (let i = 0; i <= samples; i++) out.push(slerp(a, b, i / samples));
  return out;
}

// Polilinha seguindo uma sequência de waypoints [[lon,lat],...] — trecho a trecho
// por slerp, garantindo que os pontos "grudem" na esfera.
export function polylineOnSphere(waypoints, samplesPerLeg = 24, radius = EARTH_RADIUS) {
  const out = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = lonLatToVector3(waypoints[i][0],   waypoints[i][1],   radius);
    const b = lonLatToVector3(waypoints[i+1][0], waypoints[i+1][1], radius);
    const seg = i === 0 ? 0 : 1;
    for (let k = seg; k <= samplesPerLeg; k++) out.push(slerp(a, b, k / samplesPerLeg));
  }
  return out;
}

// Arco Bézier elevado para voos.
export function flightArcPoints(fromLonLat, toLonLat, samples = 128, radius = EARTH_RADIUS) {
  const a = lonLatToVector3(fromLonLat[0], fromLonLat[1], radius);
  const b = lonLatToVector3(toLonLat[0],   toLonLat[1],   radius);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const liftFactor = 1 + a.distanceTo(b) * 0.35;
  mid.setLength(radius * liftFactor);
  return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(samples);
}
