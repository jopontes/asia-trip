export function createTimelineUI(stops) {
  const root = document.getElementById('timeline-ui');
  const progressEl = root.querySelector('.timeline-progress');
  const markersEl = root.querySelector('.timeline-markers');
  const labelEl = root.querySelector('.timeline-label');

  const visible = stops.filter((s) => s.coord);
  visible.forEach((s, i) => {
    const li = document.createElement('li');
    const pct = visible.length === 1 ? 50 : (i / (visible.length - 1)) * 100;
    li.style.top = `${pct}%`;
    li.dataset.id = s.id;
    markersEl.appendChild(li);
  });

  function update(progress, activeStop) {
    progressEl.style.height = `${Math.min(100, Math.max(0, progress * 100))}%`;
    const items = markersEl.querySelectorAll('li');
    let activeEl = null;
    items.forEach((el) => {
      const on = el.dataset.id === activeStop?.id;
      el.classList.toggle('active', on);
      if (on) activeEl = el;
    });
    if (activeEl && activeStop?.name) {
      const [y,m,d] = (activeStop.date || '').split('-');
      const short = d ? `${d}/${m}` : '';
      labelEl.textContent = short || activeStop.name;
      labelEl.style.top = activeEl.style.top;
      labelEl.style.transform = 'translateY(-50%)';
      labelEl.classList.add('visible');
    } else {
      labelEl.classList.remove('visible');
    }
  }

  return { update };
}
