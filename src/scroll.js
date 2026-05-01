import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Liga o scroll global ao rig de câmera, rotas e timeline UI — com
// progresso alisado via lerp em RAF (movimento macio e preguiçoso).
export function setupScroll({ rig, routes, timeline, dateOverlay, stops, segments }) {
  const sections = Array.from(document.querySelectorAll('.stop'));
  const cityMarkers = Array.from(document.querySelectorAll('.city-marker'));

  sections[0]?.classList.add('is-active');

  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter:    () => sec.classList.add('is-active'),
      onEnterBack:() => sec.classList.add('is-active'),
      onLeave:    () => sec.classList.remove('is-active'),
      onLeaveBack:() => sec.classList.remove('is-active'),
    });
  });

  // Progresso bruto 0..1 direto do ScrollTrigger.
  let rawProgress = 0;
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { rawProgress = self.progress; },
  });

  // Progresso alisado via lerp em RAF.
  // Quanto menor o fator, mais macio (e mais lento a alcançar).
  const SMOOTHING = 0.065;
  let smoothProgress = 0;

  function applyProgress(p) {
    rig.update(p);

    // Controla densidade dos labels baseado no zoom atual.
    // Far: esconde cidades visitadas e cidades de referência — só regiões/águas.
    const d = rig.currentDistance ? rig.currentDistance() : 2;
    document.body.classList.toggle('far-view', d > 1.70);
    document.body.classList.toggle('close-view', d < 1.30);

    const n = stops.length - 1;
    const idx = Math.min(Math.floor(p * n + 0.5), n);
    const active = stops[idx];
    document.body.classList.toggle('has-active-photo', Boolean(active?.photos?.length));

    cityMarkers.forEach((el) => {
      el.classList.toggle('is-current', el.dataset.stopId === active?.id);
    });

    segments.forEach((seg, i) => {
      const fromIdx = stops.findIndex((s) => s.id === seg.from);
      const toIdx = stops.findIndex((s) => s.id === seg.to);
      if (fromIdx < 0 || toIdx < 0) return;
      const segStart = fromIdx / n;
      const segEnd = toIdx / n;
      // Suavização adicional por segmento (easeInOut).
      let t = (p - segStart) / (segEnd - segStart);
      t = Math.max(0, Math.min(1, t));
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      routes[i].setProgress(eased);
    });

    timeline.update(p, active);
    dateOverlay?.update(p);
  }

  function tick() {
    const delta = rawProgress - smoothProgress;
    if (Math.abs(delta) > 1e-5) {
      smoothProgress += delta * SMOOTHING;
      applyProgress(smoothProgress);
    }
    requestAnimationFrame(tick);
  }
  tick();
}
