import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { lonLatToVector3, EARTH_RADIUS } from './geo-utils.js';
import { waterLabels, regionLabels, referenceCities } from './data/labels.js';

export function createLabels(overlay, stops) {
  const objects = [];

  // Tier 1 — cidades visitadas: label + dot juntos num mesmo elemento (ancorado
  // no ponto 3D). O dot tem destaque: preenchimento + ring.
  stops.forEach((s) => {
    if (!s.coord || !s.name) return;
    objects.push(addCityMarker(overlay, s.coord, s.name, s.id));
  });

  waterLabels.forEach((w) => {
    objects.push(addLabel(overlay, w.coord, w.name, 'tier-2 water'));
  });

  regionLabels.forEach((r) => {
    objects.push(addLabel(overlay, r.coord, r.name, 'tier-2 region'));
  });

  referenceCities.forEach((c) => {
    objects.push(addLabel(overlay, c.coord, c.name, 'tier-3'));
  });

  return objects;
}

function addCityMarker(parent, lonLat, text, id) {
  const wrap = document.createElement('div');
  wrap.className = 'city-marker';
  wrap.dataset.stopId = id;
  wrap.innerHTML = `
    <div class="city-name">${text}</div>
    <div class="city-dot"></div>
  `;
  const obj = new CSS2DObject(wrap);
  // Mesma altitude da linha de trajeto (1.003) — o ponto fica exatamente
  // sobre a linha em vez de flutuando acima.
  const v = lonLatToVector3(lonLat[0], lonLat[1], EARTH_RADIUS * 1.003);
  obj.position.copy(v);
  parent.add(obj);
  return obj;
}

function addLabel(parent, lonLat, text, cls) {
  const el = document.createElement('div');
  el.className = `map-label ${cls}`;
  el.textContent = text;
  const obj = new CSS2DObject(el);
  const v = lonLatToVector3(lonLat[0], lonLat[1], EARTH_RADIUS * 1.008);
  obj.position.copy(v);
  parent.add(obj);
  return obj;
}
