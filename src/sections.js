// Gera uma <section> de scroll por parada no roteiro.
const MONTHS_PT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const PUBLIC_BASE = import.meta.env.BASE_URL || '/';
const PHOTO_CACHE_KEY = '20260501';

function shortDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2,'0')} ${MONTHS_PT[m-1]} ${y}`;
}

export function renderSections(stops, segments) {
  const root = document.getElementById('scroll-root');
  const segByTo = Object.fromEntries(segments.map((s) => [s.to, s]));

  // Seção de abertura.
  root.insertAdjacentHTML('beforeend', `
    <section class="stop intro is-active" data-stop="intro">
      <div class="stop-inner intro-inner">
        <div class="stop-copy">
          <p class="eyebrow">2016 — 2026</p>
          <h1>Ásia → Europa</h1>
          <p class="lede">Quarenta e cinco dias, por ar, trilhos, estrada e mar.</p>
          <p class="hint">role para começar ↓</p>
        </div>
      </div>
    </section>
  `);

  stops.forEach((s) => {
    if (s.id === 'intro' || s.id === 'outro') return;
    const seg = segByTo[s.id];
    const modeLabel = seg ? labelFor(seg.mode) : '';
    const photosHtml = renderPhotos(s);
    root.insertAdjacentHTML('beforeend', `
      <section class="stop journey-stop ${photosHtml ? 'has-photos' : 'text-only'}" data-stop="${s.id}">
        ${photosHtml}
        <div class="stop-copy">
          <p class="eyebrow">${shortDate(s.date)} · ${s.country}</p>
          <h2>${s.name}</h2>
          ${seg ? `<p class="mode">${modeLabel}</p>` : ''}
        </div>
      </section>
    `);
  });

  // Seção final.
  root.insertAdjacentHTML('beforeend', `
    <section class="stop outro" data-stop="outro">
      <div class="stop-inner outro-inner">
        <div class="stop-copy">
          <p class="eyebrow">fim</p>
          <h2>·</h2>
        </div>
      </div>
    </section>
  `);
}

function labelFor(mode) {
  return ({
    flight: 'voo',
    rail: 'trem',
    road: 'estrada',
    bus: 'ônibus',
    boat: 'barco',
  })[mode] || mode;
}

function renderPhotos(stop) {
  if (!stop.photos?.length) return '';

  const figures = stop.photos.map((src) => {
    const photoSrc = withCacheKey(publicUrl(src), PHOTO_CACHE_KEY);
    return `
    <figure class="photo">
      <img src="${photoSrc}" loading="lazy" decoding="async" alt="${stop.name}" data-full="${photoSrc}" data-caption="${stop.name}" />
    </figure>
  `;
  }).join('');

  return `<div class="photos" aria-label="Fotos de ${stop.name}">${figures}</div>`;
}

function publicUrl(path) {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = PUBLIC_BASE.endsWith('/') ? PUBLIC_BASE : `${PUBLIC_BASE}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

function withCacheKey(url, cacheKey) {
  if (!cacheKey || url.startsWith('data:')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${cacheKey}`;
}
