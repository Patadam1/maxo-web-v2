/* Maxó — fondo vivo del inicio: brasas que suben desde abajo y un resplandor de leña que late.
   El ratón aparta las brasas y, si se mueve rápido, levanta chispas. No depende de GSAP.
   Con movimiento reducido se pinta un único fotograma quieto; sin script, el fondo azul de siempre. */
(() => {
  const hero = document.querySelector('.hero');
  if (!hero || !HTMLCanvasElement.prototype.getContext) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const cv = document.createElement('canvas');
  cv.className = 'hero__fire';
  cv.setAttribute('aria-hidden', 'true');
  hero.prepend(cv);
  const ctx = cv.getContext('2d');

  let w = 0, h = 0, dpr = 1, stripY = 0, stripH = 0;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = hero.clientWidth; h = hero.clientHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const s = document.getElementById('strip');
    if (s) { const r = s.getBoundingClientRect(), hr = hero.getBoundingClientRect(); stripY = r.top - hr.top + r.height / 2; stripH = r.height; }
    else { stripY = h * 0.45; stripH = h * 0.36; }
  };

  // brasas: nacen abajo, suben ondulando, se enfrían de amarillo a rojo y se apagan
  const MAX = w => Math.round(Math.min(190, Math.max(60, w / 8)));
  const embers = [];
  const spawn = (x, y, burst) => {
    const life = burst ? 1.2 + Math.random() * 1.4 : 6 + Math.random() * 7;
    embers.push({
      x: x ?? Math.random() * w,
      y: y ?? h + 10 - Math.random() * h * 0.15,
      vx: burst ? (Math.random() - 0.5) * 90 : (Math.random() - 0.5) * 8,
      vy: burst ? -40 - Math.random() * 90 : -18 - Math.random() * 46,
      r: burst ? 0.8 + Math.random() * 1.4 : 0.7 + Math.random() * 2.3,
      t: 0, life, ph: Math.random() * 6.28, sw: 6 + Math.random() * 22,
    });
  };

  const mouse = { x: -9999, y: -9999, px: 0, py: 0 };
  if (fine && !reduce) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const sp = Math.hypot(x - mouse.x, y - mouse.y);
      mouse.x = x; mouse.y = y;
      if (sp > 18 && sp < 400 && embers.length < 220) for (let i = 0; i < Math.min(4, sp / 18); i++) spawn(x, y, true);
    });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  }

  // resplandor: dos fuentes que laten con ritmos que no coinciden, como una lumbre de verdad
  const flick = (t, a) => 0.78 + 0.12 * Math.sin(t * 1.7 + a) + 0.07 * Math.sin(t * 4.3 + a * 2) + 0.03 * Math.sin(t * 11.1);
  const glow = (x, y, rx, ry, rgb, a) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(0.45, `rgba(${rgb},${a * 0.35})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(-rx, -rx, rx * 2, rx * 2); ctx.restore();
  };

  const draw = (t, dt) => {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    // la lumbre bajo la tira de platos y el rescoldo del suelo
    glow(w * 0.5, stripY, w * 0.42, stripH * 0.95, '230,80,30', 0.34 * flick(t, 0));
    glow(w * 0.5 + Math.sin(t * 0.3) * w * 0.12, h + 40, w * 0.6, h * 0.42, '230,50,40', 0.42 * flick(t, 2.1));
    glow(w * 0.18, h * 0.95, w * 0.3, h * 0.3, '255,120,40', 0.16 * flick(t, 4.2));

    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.t += dt;
      const k = e.t / e.life;
      if (k >= 1 || e.y < -20) { embers.splice(i, 1); continue; }
      // el ratón aparta las brasas como un soplo
      const dx = e.x - mouse.x, dy = e.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 140 * 140) { const f = (1 - Math.sqrt(d2) / 140) * 260 * dt; const d = Math.sqrt(d2) || 1; e.vx += (dx / d) * f; e.vy += (dy / d) * f * 0.5; }
      e.vx *= 0.985; e.vy = e.vy * 0.995 - 4 * dt;
      e.x += (e.vx + Math.sin(t * 1.3 + e.ph) * e.sw * 0.3) * dt;
      e.y += e.vy * dt;
      // del amarillo caliente al rojo de la olla
      const cg = Math.round(200 - 150 * k), cb = Math.round(90 - 60 * k);
      const a = Math.min(1, k * 8) * (1 - k) * (0.65 + 0.35 * Math.sin(t * 9 + e.ph));
      ctx.fillStyle = `rgba(255,${cg},${cb},${a * 0.26})`;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 4, 0, 6.283); ctx.fill();
      ctx.fillStyle = `rgba(255,${cg + 40},${cb + 40},${a})`;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  size();
  new ResizeObserver(size).observe(hero);
  addEventListener('load', size);

  if (reduce) { draw(0, 0); return; }

  // arranca con brasas ya repartidas por la pantalla, no vacía
  for (let i = 0; i < MAX(w) * 0.6; i++) { spawn(); const e = embers[embers.length - 1]; e.t = Math.random() * e.life * 0.7; e.y = h * (0.2 + Math.random() * 0.85); }

  let visible = true, last = 0, raf = 0, acc = 0;
  const loop = (now) => {
    const t = now / 1000, dt = last ? Math.min(0.05, t - last) : 0.016; last = t;
    acc += dt * MAX(w) / 6;                         // ritmo de nacimiento para mantener la población
    while (acc >= 1) { acc -= 1; if (embers.length < MAX(w)) spawn(); }
    draw(t, dt);
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
  };
  const start = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(loop); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }).observe(hero);
  document.addEventListener('visibilitychange', start);
  start();
})();
