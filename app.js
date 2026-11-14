(() => {
  const C = window.CARTA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const phone = () => matchMedia('(max-width: 760px)').matches;
  document.documentElement.classList.add('js');
  const img = id => `assets/platos/${id}.webp`;
  const eur = n => (Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')) + ' €';

  /* ---------- LA CARTA ---------- */
  const list = $('#dishes');
  const picA = $('#cartaImg'), picB = $('#cartaImgB');
  let front = picA, current = -1;

  list.innerHTML = C.menu.platos.map((p, i) => `
    <li class="dish" data-i="${i}">
      <button type="button" aria-expanded="false" aria-controls="dd${i}">
        <span>${p.n}</span>${p.extra ? `<span class="tag">${p.extra}</span>` : p.lena ? '<span class="tag">a la leña</span>' : ''}
      </button>
      <div class="dish__d" id="dd${i}"><p>${p.d}</p></div>
    </li>`).join('');
  const rows = $$('.dish', list);

  // vídeo del plato (cuando el cliente mande los vídeos 3D): se pone en carta.js como  video: "p01"
  const dishVid = document.createElement('video');
  dishVid.className = 'carta__vid is-off';
  dishVid.poster = picA.getAttribute('src');
  dishVid.muted = true; dishVid.loop = true; dishVid.playsInline = true; dishVid.setAttribute('playsinline', ''); dishVid.preload = 'none';
  picA.parentNode.appendChild(dishVid);
  function hideVid() { dishVid.pause(); dishVid.classList.add('is-off'); }
  function showVid(name, poster) {
    const src = `assets/video/${name}.mp4`;
    if (dishVid.getAttribute('src') !== src) { dishVid.poster = poster; dishVid.src = src; }
    dishVid.classList.remove('is-off');
    if (!reduce) dishVid.play().catch(() => {});
  }

  let picToken = 0;
  function showPic(src) {
    hideVid();
    if (front.getAttribute('src') === src && !front.classList.contains('is-off')) return;
    const back = front === picA ? picB : picA;
    const token = ++picToken;
    back.src = src;
    // solo la última petición cambia la foto: si el usuario pasa rápido por la lista no se cruzan
    const swap = () => {
      if (token !== picToken) return;
      back.classList.remove('is-off');
      (back === picA ? picB : picA).classList.add('is-off');
      front = back;
    };
    if (back.complete && back.naturalWidth) swap();
    else { back.onload = swap; back.onerror = swap; }
  }
  function activate(i) {
    if (i === current) return;
    current = i;
    rows.forEach((r, k) => {
      const on = k === i;
      r.classList.toggle('is-on', on);
      $('button', r).setAttribute('aria-expanded', on);
    });
    const p = C.menu.platos[i];
    showPic(img(p.img));
    if (p.video) showVid(p.video, img(p.img));
  }
  activate(0);
  rows.forEach((r, i) => {
    const b = $('button', r);
    b.addEventListener('click', () => activate(i));
    b.addEventListener('focus', () => activate(i));
    if (fine) b.addEventListener('mouseenter', () => activate(i));
  });

  // al hacer scroll en escritorio, la fila del centro se ilumina
  let scrollTick = false;
  addEventListener('scroll', () => {
    if (scrollTick || phone() || $('#panel-menu').hidden) return;
    scrollTick = true;
    requestAnimationFrame(() => {
      scrollTick = false;
      const mid = innerHeight * 0.5;
      const box = list.getBoundingClientRect();
      if (box.top > mid || box.bottom < mid) return;
      let best = 0, d = Infinity;
      rows.forEach((r, i) => { const b = $('button', r).getBoundingClientRect(); const dd = Math.abs(b.top + b.height / 2 - mid); if (dd < d) { d = dd; best = i; } });
      activate(best);
    });
  }, { passive: true });

  /* pestañas */
  const tabs = $$('.tabs [role="tab"]');
  function selectTab(t) {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
    if (t.id === 'tab-vinos') showPic('assets/platos/portada-vinos.webp');
    else { const i = current; current = -1; activate(i < 0 ? 0 : i); }
  }
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(k + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); selectTab(n);
    });
  });

  /* vinos */
  const wines = $('#wines');
  function renderWines(f) {
    const groups = C.vinos.map(g => {
      let items = g.items;
      if (f === 'copa') items = items.filter(w => w[3] != null);
      else if (f === 'tinto' || f === 'blanco') items = g.tipo === f ? items : [];
      else if (f === 'otros') items = ['rosado', 'burbuja'].includes(g.tipo) ? items : [];
      return items.length ? `<div class="wine-group"><h3>${g.grupo}</h3><ul>${items.map(([n, u, b, c]) => `
        <li class="wine"><span class="wine__n">${n}</span>${u ? `<span class="wine__u">${u}</span>` : ''}
          <span class="wine__p">${b != null ? `${eur(b)}<span>botella</span>` : ''}${c != null ? `${b != null ? '' : ''}${eur(c)}<span>copa</span>` : ''}</span></li>`).join('')}</ul></div>` : '';
    }).join('');
    wines.innerHTML = groups || '<p class="empty">No hay vinos con ese filtro.</p>';
  }
  renderWines('todos');
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    renderWines(b.dataset.f);
  }));

  /* ---------- TIRA DEL INICIO (fila arrastrable) ---------- */
  const strip = $('#strip');
  strip.insertAdjacentHTML('beforeend', C.menu.platos.map((p, i) => `
    <button class="frame" type="button" data-i="${i}" aria-label="${p.n}. Ver en la carta">
      <img src="${img(p.img)}" width="533" height="960" alt="" ${i > 8 ? 'loading="lazy"' : ''} draggable="false"><span class="frame__n">${p.n}</span>
    </button>`).join(''));
  const frames = $$('.frame', strip);
  let lit = -1;
  // posición de scroll que centra un plato (offsetLeft no sirve: se mide desde el inicio, no desde la tira)
  const leftFor = f => strip.scrollLeft + f.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - f.offsetWidth) / 2;
  function lightNearest() {
    const mid = strip.getBoundingClientRect().left + strip.clientWidth / 2;
    let best = 0, d = Infinity;
    frames.forEach((f, i) => { const b = f.getBoundingClientRect(); const dd = Math.abs(b.left + b.width / 2 - mid); if (dd < d) { d = dd; best = i; } });
    if (best === lit) return;
    lit = best;
    frames.forEach((f, i) => f.classList.toggle('is-lit', i === best));
  }
  let st = false;
  strip.addEventListener('scroll', () => { if (!st) { st = true; requestAnimationFrame(() => { st = false; lightNearest(); }); } }, { passive: true });
  // arranca con un plato del medio centrado para que haya vecinos a ambos lados
  const startStrip = () => { strip.scrollLeft = leftFor(frames[Math.min(5, frames.length - 1)]); lit = -1; lightNearest(); };
  startStrip();
  addEventListener('load', startStrip, { once: true });

  // arrastrar con el ratón (en táctil ya es scroll nativo)
  let down = null, moved = false;
  strip.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, s: strip.scrollLeft }; moved = false; });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (Math.abs(dx) > 4) { moved = true; strip.classList.add('is-drag'); }
    strip.scrollLeft = down.s - dx;
  });
  addEventListener('pointerup', () => {
    if (!down) return; down = null;
    if (moved) { strip.classList.remove('is-drag'); const f = frames[lit]; strip.scrollTo({ left: leftFor(f), behavior: reduce ? 'auto' : 'smooth' }); }
  });
  frames.forEach((f, i) => f.addEventListener('click', e => {
    if (moved) { e.preventDefault(); return; }
    if (i !== lit) { strip.scrollTo({ left: leftFor(f), behavior: reduce ? 'auto' : 'smooth' }); return; }
    selectTab(tabs[0]); activate(i);
    $('#carta').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));
  strip.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = Math.max(0, Math.min(frames.length - 1, lit + (e.key === 'ArrowRight' ? 1 : -1)));
    const f = frames[n]; strip.scrollTo({ left: leftFor(f), behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- RESEÑAS: una frase iluminada cada vez ---------- */
  const ph = $$('.ph'); let pk = 0;
  if (ph.length) {
    ph[0].classList.add('is-lit');
    if (!reduce) setInterval(() => { ph[pk].classList.remove('is-lit'); pk = (pk + 1) % ph.length; ph[pk].classList.add('is-lit'); }, 2000);
  }

  /* ---------- ENTRADAS ---------- */
  const stagger = (sel, parts) => $$(sel).forEach(sec => $$(parts, sec).forEach((el, i) => { el.setAttribute('data-rv', ''); el.style.setProperty('--i', i); }));
  stagger('.carta', '.tabs, .carta__note');
  stagger('.proof', '.proof__say p, .proof__of');
  stagger('.visit', '.visit__card');
  stagger('.foot', '.foot__cols > div');
  $$('.hero__act > *').forEach((el, i) => { el.setAttribute('data-rv', ''); el.style.setProperty('--i', i); });
  
  // Todo es visible por defecto: la animación solo se reproduce al entrar, así nada queda oculto
  // si el aviso no llega (sin script, pestaña en segundo plano, lectores, buscadores).
  const play = el => {
    el.classList.add('is-in');
    if (reduce || !el.hasAttribute('data-rv') || !el.animate) return;
    el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
      { duration: 700, delay: (+el.style.getPropertyValue('--i') || 0) * 80, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { play(e.target); io.unobserve(e.target); }
  }), { threshold: 0 });
  // el inicio entra solo, al cargar: el botón de reservar no puede esperar al scroll
  const heroParts = $$('.hero [data-rv]');
  heroParts.forEach(play);
  $$('[data-rv], .visit').forEach(el => { if (!el.closest('.hero')) io.observe(el); });

  // barra de acciones en el móvil: aparece al volver hacia arriba (como las barras del navegador),
  // nunca encima del inicio ni de la ficha de visita, que ya tienen sus botones.
  const dock = $('.dock');
  if (dock) {
    let lastY = scrollY, blocked = true;
    const guards = [$('.hero'), $('.visit'), $('.foot')];
    const vis = new Map();
    const gio = new IntersectionObserver(es => { es.forEach(e => vis.set(e.target, e.isIntersecting)); blocked = [...vis.values()].some(Boolean); if (blocked) dock.classList.remove('is-shown'); }, { threshold: 0.15 });
    guards.forEach(g => g && gio.observe(g));
    addEventListener('scroll', () => {
      const y = scrollY, up = y < lastY - 6, down = y > lastY + 6;
      if (up && !blocked) dock.classList.add('is-shown');
      if (down) dock.classList.remove('is-shown');
      if (up || down) lastY = y;
    }, { passive: true });
  }

  // vídeo del local: solo se reproduce cuando está a la vista
  const vid = $('.shot video');
  if (vid) {
    if (reduce) vid.removeAttribute('loop');
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !reduce) vid.play().catch(() => {}); else vid.pause(); }, { threshold: 0.3 }).observe(vid);
  }
})();
