import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { EARTH_RADIUS, lonLatToVector3 } from './geo-utils.js';
import { createTerrainTexture } from './terrain-texture.js';

export function createGlobe(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.01, 100);
  camera.position.set(0, 0, 4.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Renderer de rótulos DOM (CSS2D) em overlay.
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  const labelEl = labelRenderer.domElement;
  labelEl.style.position = 'fixed';
  labelEl.style.top = '0';
  labelEl.style.left = '0';
  labelEl.style.width = '100%';
  labelEl.style.height = '100%';
  labelEl.style.pointerEvents = 'none';
  labelEl.style.zIndex = '1';
  document.body.appendChild(labelEl);

  const sphereGeo = new THREE.SphereGeometry(EARTH_RADIUS, 192, 192);
  const terrainTex = createTerrainTexture(renderer.capabilities.getMaxAnisotropy());

  const sphereMat = new THREE.MeshBasicMaterial({
    map: terrainTex,
  });
  const earth = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(earth);

  const overlay = new THREE.Group();
  earth.add(overlay);

  // Markers agora são criados em labels.js como CSS2DObject (dot+label juntos).
  // Esta função vira no-op mas mantém a API para não quebrar callers.
  function addMarker() { return null; }
  function finalizeMarkers() {}

  // Callbacks disparados no resize — módulos que precisem da resolução (ex: Line2).
  const resizeCallbacks = [];
  function onResize(cb) { resizeCallbacks.push(cb); cb(window.innerWidth, window.innerHeight); }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    labelRenderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    resizeCallbacks.forEach((cb) => cb(w, h));
  }
  window.addEventListener('resize', resize);

  // Oculta objetos no hemisfério oposto (atrás do globo) — labels CSS2D e linhas
  // de rota. Sem isso a Terra parece transparente: rótulos e traços do outro
  // lado aparecem por cima como se atravessassem a esfera.
  const _camDir = new THREE.Vector3();
  const _objPos = new THREE.Vector3();
  const _tmp = new THREE.Vector3();
  function cullBackside() {
    camera.getWorldPosition(_camDir);
    const camLen = _camDir.length();
    // Threshold depende da distância — quanto mais perto, mais agressivo o corte.
    const horizon = Math.sqrt(Math.max(0, 1 - (EARTH_RADIUS / camLen) ** 2));
    _camDir.normalize();

    overlay.traverse((obj) => {
      if (!obj.position) return;
      if (obj.isLine2 || obj.isCSS2DObject) {
        obj.getWorldPosition(_objPos);
        const d = _objPos.clone().normalize().dot(_camDir);
        // d > horizon → lado visível; d <= horizon → atrás do globo.
        if (obj.isCSS2DObject) {
          // Labels: fade suave via CSS class pra não piscar.
          const el = obj.element;
          if (el) el.style.opacity = d > horizon + 0.02 ? '' : '0';
        } else if (obj.isLine2) {
          // Line2: nunca esconde — arcos de voo passam pelo lado oposto e
          // ainda assim a parte voltada pra câmera precisa ser visível.
          obj.visible = true;
        }
      }
    });
  }

  let rafId = 0;
  function tick() {
    cullBackside();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  return { scene, camera, renderer, earth, overlay, addMarker, finalizeMarkers, onResize, dispose() { cancelAnimationFrame(rafId); } };
}
