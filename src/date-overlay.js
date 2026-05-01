// Overlay fixo que mostra a data corrente da viagem, interpolada pelo scroll.
// Entre duas paradas, os dias "passam" suavemente.

const MONTHS_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function parseDate(s) {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  // Usa UTC para evitar deslocamento de fuso.
  return Date.UTC(y, m - 1, d);
}

function formatDate(ms) {
  const d = new Date(ms);
  const day = d.getUTCDate();
  const month = MONTHS_PT[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return { day, month, year };
}

export function createDateOverlay(stops) {
  const el = document.createElement('aside');
  el.id = 'date-overlay';
  el.innerHTML = `
    <div class="date-day"></div>
    <div class="date-month"></div>
    <div class="date-year"></div>
  `;
  document.body.appendChild(el);

  const dayEl   = el.querySelector('.date-day');
  const monthEl = el.querySelector('.date-month');
  const yearEl  = el.querySelector('.date-year');

  // Pré-computa os timestamps das paradas na ordem do roteiro.
  const timeline = stops.map((s) => parseDate(s.date));
  // Garante monotonicidade: se faltar data, herda da anterior.
  for (let i = 1; i < timeline.length; i++) {
    if (!timeline[i]) timeline[i] = timeline[i - 1];
  }

  function update(progress) {
    const n = stops.length - 1;
    const scaled = Math.max(0, Math.min(1, progress)) * n;
    const i = Math.min(Math.floor(scaled), n - 1);
    const t = scaled - i;
    const a = timeline[i];
    const b = timeline[i + 1];
    const ms = a + (b - a) * t;
    const { day, month, year } = formatDate(ms);
    dayEl.textContent = String(day).padStart(2, '0');
    monthEl.textContent = month;
    yearEl.textContent = year;
  }

  update(0);
  return { update, el };
}
