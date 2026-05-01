import * as THREE from 'three';

// Controla a câmera em coordenadas esféricas (lon, lat, distance).
// Atualizada por progresso contínuo [0,1] através de keyframes.
export function createCameraRig(camera, keyframesByStop, stopOrder) {
  const frames = stopOrder.map((id) => ({ id, ...keyframesByStop[id] }));

  function lerpAngle(a, b, t) {
    // Interpolação angular curta em longitude (wrap 360).
    let diff = ((b - a + 540) % 360) - 180;
    return a + diff * t;
  }

  function apply(kf) {
    const phi = THREE.MathUtils.degToRad(90 - kf.lat);
    const theta = THREE.MathUtils.degToRad(kf.lon);
    const r = kf.distance;
    camera.position.set(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta),
    );
    camera.lookAt(0, 0, 0);
  }

  function update(progress) {
    const p = Math.min(Math.max(progress, 0), 1);
    const n = frames.length - 1;
    const scaled = p * n;
    const i = Math.min(Math.floor(scaled), n - 1);
    const t = scaled - i;
    // Easing mais macio (smootherstep).
    const e = t * t * t * (t * (t * 6 - 15) + 10);
    const a = frames[i];
    const b = frames[i + 1];

    // Distância angular entre os dois keyframes (grau).
    const dLon = Math.abs(((b.lon - a.lon + 540) % 360) - 180);
    const dLat = Math.abs(b.lat - a.lat);
    const arc = Math.sqrt(dLon * dLon + dLat * dLat);

    // Em saltos longos (voos transcontinentais), a câmera arqueia: recua e sobe
    // em direção ao polo norte no meio do trecho, como vista de satélite do arco.
    // Bell-curve 0→1→0 centrada em e=0.5.
    const bell = Math.sin(e * Math.PI);
    const isLongHop = arc > 50;
    const distBoost = isLongHop ? bell * Math.min(1.8, arc / 120) * 0.9 : 0;
    const latLift  = isLongHop ? bell * Math.min(40, arc * 0.22) : 0;

    apply({
      lon: lerpAngle(a.lon, b.lon, e),
      lat: a.lat + (b.lat - a.lat) * e + latLift,
      distance: a.distance + (b.distance - a.distance) * e + distBoost,
    });
  }

  function currentDistance() {
    return camera.position.length();
  }

  return { update, apply, currentDistance };
}
