/* Maxó — capa de movimiento. Se apoya en assets/scenes/stage.js (GSAP + ScrollTrigger + Lenis).
   Si GSAP no carga o el visitante pide menos movimiento, todo queda en su composición final. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const S = window.Stage;
  const live = !!(S && S.live) && !reduce;

  /* ---------- ESCENA · FUEGO LENTO ----------
     Cuatro tiempos. La olla gira mientras bajas, el reloj cuenta las siete horas del cocido
     y el fondo cambia al tono de cada guiso. */
  window.Scenes = window.Scenes || {};
  Scenes.fuego = (root) => S.scene(root, {
    hold: 4,
    scrub: S.lenis ? true : 0.5,
    build(tl, { q, stage }) {
      const beats = q('.beat');
      const objs = q('.beat__obj');
      const clockN = q('.fire__h')[0];
      const clock = q('.fire__clock')[0];
      const n = beats.length, slot = 1 / n;
      gsap.set(beats, { autoAlpha: 0 });
      gsap.set(beats[0], { autoAlpha: 1 });
      const hours = { h: 0 };
      tl.to(hours, { h: 7, duration: slot * 0.9, ease: 'none', onUpdate: () => { clockN.textContent = Math.max(1, Math.round(hours.h)); } }, 0);
      beats.forEach((b, i) => {
        const at = i * slot;
        const obj = objs[i];
        const text = b.querySelectorAll('.beat__t, .beat__say, .beat__go');
        const isPhoto = b.classList.contains('beat--photo');
        tl.to(stage, { backgroundColor: getComputedStyle(b).getPropertyValue('--field').trim(), duration: slot * 0.25 }, at);
        if (i > 0) {
          tl.to(beats[i - 1], { autoAlpha: 0, duration: slot * 0.18 }, at - slot * 0.06);
          tl.fromTo(b, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, at + slot * 0.08);
          tl.fromTo(text, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: slot * 0.22, stagger: slot * 0.04, ease: 'power3.out' }, at + slot * 0.1);
        }
        // la olla entra pequeña y girando, crece, y sigue girando mientras se lee
        if (isPhoto) {
          tl.fromTo(obj, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: slot * 0.45, ease: 'power3.out' }, at + slot * 0.05);
        } else {
          tl.fromTo(obj, { rotate: -50, scale: 0.78, autoAlpha: i ? 0 : 1 }, { rotate: 0, scale: 1, autoAlpha: 1, duration: slot * 0.45, ease: 'power3.out' }, at + (i ? slot * 0.05 : 0));
          tl.to(obj, { rotate: 40, duration: slot * 0.6, ease: 'none' }, at + slot * 0.5);
        }
      });
      tl.to(clock, { autoAlpha: 0, y: -20, duration: slot * 0.15 }, slot * 0.92);
    },
  });

  /* ---------- ESCENA · CALLE PALOMA ----------
     La fachada es una ventana a la derecha del texto; al bajar se abre a toda la pantalla,
     y por encima suben la terraza y luego la cocina, como cortinas. */
  Scenes.ventana = (root) => S.scene(root, {
    hold: 3,
    scrub: S.lenis ? true : 0.5,
    build(tl, { q, phone }) {
      const [s1, s2, s3] = q('.shot');
      const intro = q('.casa__intro')[0];
      const cap = (s) => s.querySelector('figcaption');
      // el texto se lee primero; se aparta antes de que la foto lo alcance
      tl.to({}, { duration: 0.12 }, 0);
      tl.to(intro, { autoAlpha: 0, x: phone ? 0 : -60, y: phone ? -40 : 0, duration: 0.1, ease: 'power2.in' }, 0.12);
      tl.fromTo(s1, { clipPath: phone ? 'inset(62% 4% 8% 4%)' : 'inset(22% 4% 22% 52%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.22, ease: 'power2.inOut' }, 0.16);
      tl.fromTo(s1.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, 0.16);
      tl.to(cap(s1), { autoAlpha: 1, duration: 0.05 }, 0.38);
      tl.fromTo(s2, { yPercent: 100 }, { yPercent: 0, duration: 0.2, ease: 'power2.inOut' }, 0.5);
      tl.fromTo(s2.querySelector('img'), { scale: 1.2, yPercent: -10 }, { scale: 1, yPercent: 0, duration: 0.25, ease: 'none' }, 0.5);
      tl.to(cap(s2), { autoAlpha: 1, duration: 0.05 }, 0.7);
      tl.fromTo(s3, { yPercent: 100 }, { yPercent: 0, duration: 0.18, ease: 'power2.inOut' }, 0.78);
    },
  });

  if (S) { S.smooth(); S.init(); }

  /* ---------- TÍTULOS QUE SUBEN DESDE SU LÍNEA ---------- */
  if (live) {
    const h1 = $('.hero__bottom h1');
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .from('.hero__logo', { autoAlpha: 0, y: -16, duration: 0.6 }, 0)
      .from('.hero__nav a', { autoAlpha: 0, y: -12, duration: 0.5, stagger: 0.06 }, 0.1)
      .from('.frame', { autoAlpha: 0, yPercent: 18, duration: 0.9, stagger: { each: 0.045, from: 'center' } }, 0.15);
    const fontsIn = document.fonts ? document.fonts.ready : Promise.resolve();
    if (h1) { h1.style.visibility = 'hidden'; fontsIn.then(() => { h1.style.visibility = ''; gsap.from(S.split(h1, 'lines'), { yPercent: 105, duration: 1, ease: 'power3.out', stagger: 0.09 }); }); }

    fontsIn.then(() => $$('.carta__head h2, .proof__say h2, .visit__card h2, .fire:not(.is-live) .fire__head, .casa:not(.is-live) .casa__intro h2').forEach((el) => {
      const lines = S.split(el, 'lines');
      gsap.from(lines, { yPercent: 105, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    }));

    // filas de la carta: entran escalonadas la primera vez
    gsap.from('.dish', { autoAlpha: 0, y: 24, duration: 0.6, ease: 'power3.out', stagger: 0.035, scrollTrigger: { trigger: '#dishes', start: 'top 80%', once: true } });
    gsap.from('.carta__pic', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.carta__pic', start: 'top 85%', once: true } });

    // la foto de la visita se desplaza más despacio que la página
    gsap.fromTo('.visit__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---------- 4,6 QUE CUENTA DESDE CERO ---------- */
  const num = $('.proof__num');
  if (num && !reduce) {
    const target = 4.6;
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      num.textContent = '0,0';
      const t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), v = target * (1 - Math.pow(1 - k, 4));
        num.textContent = v.toFixed(1).replace('.', ',');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 }).observe(num);
  }

  /* ---------- MAXÓ DEL PIE ---------- */
  const mark = $('.foot__mark[data-mark]');
  if (mark && !reduce && mark.animate) new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    mark.animate([{ clipPath: 'inset(100% 0 0 0)', transform: 'translateY(12%)' }, { clipPath: 'inset(-20% 0 0 0)', transform: 'none' }],
      { duration: 1100, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
  }, { threshold: 0 }).observe(mark);

  /* ---------- CARTA EN 3D: la foto se inclina hacia el ratón ---------- */
  const pic = $('.carta__pic');
  if (pic) {
    const tilt = document.createElement('div'); tilt.className = 'carta__tilt';
    const breathe = document.createElement('div'); breathe.className = 'carta__breathe';
    [...pic.children].forEach((c) => breathe.appendChild(c));
    tilt.appendChild(breathe); pic.appendChild(tilt);
    if (fine && !reduce) {
      let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
      const loop = () => {
        x += (tx - x) * 0.12; y += (ty - y) * 0.12;   // muelle suave: sigue al ratón con algo de peso
        tilt.style.transform = `rotateY(${x.toFixed(2)}deg) rotateX(${y.toFixed(2)}deg)`;
        raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.01 ? requestAnimationFrame(loop) : 0;
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
      const area = $('.carta__grid');
      area.addEventListener('pointermove', (e) => {
        const r = pic.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width))) * 9;
        ty = Math.max(-1, Math.min(1, -(e.clientY - (r.top + r.height / 2)) / (r.height))) * 7;
        kick();
      });
      area.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
    }
  }

  /* ---------- TIRA DEL INICIO: avanza sola hasta que la tocas ---------- */
  const strip = $('#strip');
  if (strip && !reduce) {
    let on = true, paused = false, resumeT = 0, last = 0, acc = 0, visible = true;
    const speed = 28; // px por segundo: se nota que se mueve, no distrae
    const pause = () => { paused = true; strip.classList.remove('is-drift'); clearTimeout(resumeT); };
    const resume = () => { clearTimeout(resumeT); resumeT = setTimeout(() => { paused = false; }, 3500); };
    ['pointerdown', 'wheel', 'touchstart', 'focusin', 'keydown'].forEach((ev) => strip.addEventListener(ev, () => { pause(); resume(); }, { passive: true }));
    if (fine) { strip.addEventListener('pointerenter', pause); strip.addEventListener('pointerleave', resume); }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.2 }).observe(strip);
    const tick = (t) => {
      const dt = last ? Math.min(64, t - last) : 16; last = t;
      if (on && !paused && visible && !document.hidden) {
        strip.classList.add('is-drift');
        acc += (speed * dt) / 1000;
        if (acc >= 1) { const px = Math.floor(acc); acc -= px; strip.scrollLeft += px; }
        // al llegar al final vuelve al principio sin salto brusco
        if (strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2) { strip.scrollTo({ left: 0, behavior: 'smooth' }); }
      }
      requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), 1800);
  }

  /* ---------- el vídeo de la cocina solo juega cuando se ve ---------- */
  if (live) addEventListener('load', () => ScrollTrigger.refresh());
})();
