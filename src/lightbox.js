export function setupLightbox() {
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Fechar">×</button>
    <figure class="lightbox-card">
      <img alt="" />
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('img');
  const capEl = overlay.querySelector('figcaption');

  function open(src, caption) {
    imgEl.src = src;
    imgEl.alt = caption || '';
    capEl.textContent = caption || '';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }
  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  document.addEventListener('click', (e) => {
    const img = e.target.closest('.photos img');
    if (img) {
      open(img.dataset.full || img.src, img.dataset.caption || img.alt);
      return;
    }
    if (e.target.closest('.lightbox-close') || e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
