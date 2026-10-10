/* HabHab Ta Bai! | main.js */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cfg = window.SITE_CONFIG || {};
  const peso = (n) => '₱' + Number(n).toLocaleString('en-PH');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (id) => '<svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg>';

  /* =========================================================
     Business details from config.js
     ========================================================= */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const svgIcon = (id) => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'ico'); svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(ns, 'use'); use.setAttribute('href', '#' + id);
    svg.appendChild(use); return svg;
  };
  const clean = (v) => (typeof v === 'string' ? v.trim() : '');
  const isHttps = (v) => /^https:\/\//i.test(v);

  const phone = clean(cfg.phone);
  const address = clean(cfg.address);
  const contacts = [];
  if (isHttps(clean(cfg.messenger))) contacts.push({ kind: 'messenger', label: 'Message us', icon: 'i-messenger', href: clean(cfg.messenger), external: true });
  if (phone) contacts.push({ kind: 'phone', label: 'Call ' + phone, icon: 'i-phone', href: 'tel:' + phone.replace(/[^\d+]/g, ''), external: false });

  const socials = [];
  if (isHttps(clean(cfg.facebook))) socials.push({ label: 'Facebook', icon: 'i-facebook', href: clean(cfg.facebook) });
  if (isHttps(clean(cfg.instagram))) socials.push({ label: 'Instagram', icon: 'i-instagram', href: clean(cfg.instagram) });
  if (isHttps(clean(cfg.tiktok))) socials.push({ label: 'TikTok', icon: 'i-tiktok', href: clean(cfg.tiktok) });

  const primary = contacts[0];
  $$('[data-order-link]').forEach(a => {
    if (!primary) return;
    a.href = primary.href;
    if (primary.external) { a.target = '_blank'; a.rel = 'noopener'; }
  });

  if (contacts.length) {
    const p = $('[data-step2-text]');
    if (p) p.textContent += ' Can\'t make it? Message or call us.';
  }

  const socialBox = $('[data-social]');
  if (socialBox) {
    socials.forEach(s => {
      const a = document.createElement('a');
      a.className = 'social'; a.href = s.href; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', s.label); a.appendChild(svgIcon(s.icon)); socialBox.appendChild(a);
    });
  }

  const hours = Array.isArray(cfg.hours) ? cfg.hours.filter(h => h && (h.days || h.time)) : [];
  const mapEmbed = clean(cfg.mapEmbed);
  const mapLink = clean(cfg.mapLink);
  if (address || hours.length || contacts.length || socials.length || isHttps(mapEmbed)) {
    const sec = $('#find'); const info = $('[data-find-info]'); const mapBox = $('[data-find-map]');
    sec.hidden = false;
    $$('[data-find-link]').forEach(a => { a.hidden = false; });
    const row = (ic, title, content) => {
      const r = document.createElement('div'); r.className = 'info-row';
      r.appendChild(svgIcon(ic));
      const d = document.createElement('div');
      const h = document.createElement('h3'); h.textContent = title;
      d.appendChild(h); d.appendChild(content); r.appendChild(d); return r;
    };
    if (address) {
      const p = document.createElement('p'); p.textContent = address;
      if (isHttps(mapLink)) {
        const a = document.createElement('a'); a.href = mapLink; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = 'Open in Maps'; a.style.cssText = 'display:inline-block;margin-top:6px;color:var(--mustard);font-weight:700';
        const wrap = document.createElement('div'); wrap.appendChild(p); wrap.appendChild(a);
        info.appendChild(row('i-pin', 'Where to find us', wrap));
      } else info.appendChild(row('i-pin', 'Where to find us', p));
    }
    if (hours.length) {
      const dl = document.createElement('dl'); dl.className = 'hours';
      hours.forEach(h => {
        const dt = document.createElement('dt'); dt.textContent = h.days || '';
        const dd = document.createElement('dd'); dd.textContent = h.time || '';
        dl.appendChild(dt); dl.appendChild(dd);
      });
      info.appendChild(row('i-clock', 'Opening hours', dl));
    }
    if (contacts.length) {
      const box = document.createElement('div'); box.className = 'contact-row';
      contacts.forEach((c, i) => {
        const a = document.createElement('a');
        a.className = 'btn ' + (i === 0 ? 'btn--solid' : 'btn--ghost'); a.href = c.href;
        if (c.external) { a.target = '_blank'; a.rel = 'noopener'; }
        a.appendChild(svgIcon(c.icon)); a.appendChild(document.createTextNode(c.label)); box.appendChild(a);
      });
      info.appendChild(box);
    }
    if (isHttps(mapEmbed)) {
      const f = document.createElement('iframe');
      f.src = mapEmbed; f.title = 'Map showing where to find HabHab Ta Bai!'; f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      mapBox.appendChild(f); mapBox.hidden = false;
    } else {
      $('.find__grid').style.gridTemplateColumns = '1fr'; $('.find__grid').style.maxWidth = '640px';
    }
  }

  // opening hours shown in the hero and footer
  if (hours.length) {
    const h0 = hours[0];
    const hoursLine = hours.length === 1
      ? (/open/i.test(h0.days || '') ? 'Open from ' + (h0.time || '') : (h0.days ? h0.days + ': ' : '') + (h0.time || ''))
      : 'See our opening hours below';
    const chip = $('[data-hours-chip]'); if (chip) { $('span', chip).textContent = hoursLine; chip.hidden = false; }
    const ft = $('[data-hours-text]'); if (ft) { ft.textContent = hoursLine; ft.hidden = false; }
  }

  /* =========================================================
     Header, drawer, back to top
     ========================================================= */
  const header = $('.site-header');
  const toTop = $('.to-top');
  // one scheduler for everything that reacts to scrolling: a single frame callback, no duplicate listeners
  const frameTasks = []; let frameQueued = false;
  const runFrame = () => { frameQueued = false; const y = window.scrollY; for (let i = 0; i < frameTasks.length; i++) frameTasks[i](y); };
  const queueFrame = () => { if (!frameQueued) { frameQueued = true; requestAnimationFrame(runFrame); } };
  const onFrame = (fn) => { frameTasks.push(fn); };
  window.addEventListener('scroll', queueFrame, { passive: true });
  window.addEventListener('resize', queueFrame);
  const listen = (mq, fn) => { if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn); };

  let headerOn = null, topOn = null;
  onFrame((y) => {
    const h = y > 24, t = y > 700;
    if (h !== headerOn) { headerOn = h; header.classList.toggle('is-scrolled', h); }
    if (t !== topOn) { topOn = t; toTop.classList.toggle('is-visible', t); }
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  const burger = $('.burger'); const drawer = $('#drawer');
  const setDrawer = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('is-open', open);
    root.classList.toggle('drawer-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', '');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  listen(window.matchMedia('(min-width: 901px)'), (e) => { if (e.matches) setDrawer(false); });

  /* scrollspy */
  const spyTargets = ['#menu', '#order', '#find'].map(s => $(s)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        $$('.nav a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyTargets.forEach(t => spy.observe(t));
  }

  /* =========================================================
     Headline word mask reveal
     ========================================================= */
  const heads = $$('.section-head h2');
  heads.forEach(h => {
    const text = h.textContent.trim(); const words = text.split(/\s+/);
    h.setAttribute('aria-label', text); h.textContent = '';
    words.forEach((w, i) => {
      const o = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true');
      const n = document.createElement('span'); n.textContent = w; n.style.setProperty('--wi', i);
      o.appendChild(n); h.appendChild(o);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
    h.classList.add('split');
  });
  if (reduce) heads.forEach(h => h.classList.add('in-view'));

  /* =========================================================
     Logo travels into the header on scroll
     ========================================================= */
  const flyLogo = $('.logo-fly'); const heroLogo = $('.hero__logo'); const heroFloat = $('.hero__float'); const brandImg = $('.brand img');
  if (!reduce && flyLogo && heroLogo && heroFloat && brandImg) {
    root.classList.add('travel');
    const ease = (p) => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    let base = null, target = null, tState = '';
    const measureTravel = (y) => {
      const r = heroFloat.getBoundingClientRect(); const t = brandImg.getBoundingClientRect();
      if (!r.width || !t.width) { base = null; return; }
      base = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 + y, w: r.width };   // where the logo sits at scroll 0
      target = { cx: t.left + t.width / 2, cy: t.top + t.height / 2, w: t.width };
      flyLogo.style.width = flyLogo.style.height = r.width + 'px';
    };
    window.addEventListener('resize', () => { base = null; tState = ''; });
    onFrame((y) => {
      if (y <= 1) {
        if (tState !== 'top') { tState = 'top'; root.classList.remove('traveling', 'arrived'); flyLogo.classList.remove('on'); }
        return;
      }
      if (!base || tState === 'top' || tState === '') { measureTravel(y); if (!base) return; }
      const dist = base.cy - target.cy;                 // scroll needed until the logo's centre reaches the header
      const p = dist <= 0 ? 1 : Math.min(1, y / dist);
      if (p >= 1) {
        if (tState !== 'arrived') { tState = 'arrived'; root.classList.add('traveling', 'arrived'); flyLogo.classList.remove('on'); }
        return;
      }
      if (tState !== 'moving') { tState = 'moving'; root.classList.add('traveling'); root.classList.remove('arrived'); flyLogo.classList.add('on'); }
      // the logo keeps scrolling with the page (never lands on the headline), shrinks, then settles into the header
      const e = ease(p); const natY = base.cy - y;
      const cx = base.cx + (target.cx - base.cx) * e;
      const cy = natY + (target.cy - natY) * Math.pow(p, 5);
      const size = base.w + (target.w - base.w) * e;
      flyLogo.style.transform = 'translate3d(' + (cx - size / 2).toFixed(1) + 'px,' + (cy - size / 2).toFixed(1) + 'px,0) scale(' + (size / base.w).toFixed(4) + ')';
    });
  }

  /* =========================================================
     Living background: embers, warm light, drifting spices
     ========================================================= */
  const conn = navigator.connection || {};
  const lite = reduce || !!conn.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  if (lite) root.classList.add('lite');
  const emberColors = ['#fff0c4', '#ffd074', '#ffb04a', '#ff8a3c', '#ff6a2c'];
  const spawnEmbers = (box, n, big) => {
    for (let i = 0; i < n; i++) {
      const e = document.createElement('i'); const t = 6 + Math.random() * 8;
      const size = (big ? 3 : 2) + Math.random() * (big ? 6 : 3.5);
      e.style.setProperty('--x', (2 + Math.random() * 96).toFixed(1) + '%');
      e.style.setProperty('--s', size.toFixed(1) + 'px');
      e.style.setProperty('--t', t.toFixed(1) + 's');
      e.style.setProperty('--dl', (-Math.random() * t).toFixed(1) + 's');
      e.style.setProperty('--dx', ((Math.random() - .5) * 150).toFixed(0) + 'px');
      e.style.setProperty('--sw', (1.6 + Math.random() * 2.2).toFixed(1) + 's');
      e.style.setProperty('--c', emberColors[Math.floor(Math.random() * emberColors.length)]);
      e.appendChild(document.createElement('b'));
      box.appendChild(e);
    }
  };
  if (!reduce) {
    const heroBox = $('.hero__embers'); const bgBox = $('.ambient__embers');
    if (heroBox) spawnEmbers(heroBox, lite ? 6 : 14, true);
    if (bgBox && !lite) spawnEmbers(bgBox, 5, false);
    const heroSec = $('.hero');
    document.addEventListener('visibilitychange', () => $$('.embers').forEach(b => b.classList.toggle('is-paused', document.hidden)));
    if (navigator.getBattery) {
      navigator.getBattery().then(b => { if (!b.charging && b.level <= 0.2) { root.classList.add('lite'); $$('.embers').forEach(x => { x.style.display = 'none'; }); } }).catch(() => {});
    }
  }
  if (!reduce) {
    const ambA = $('.ambient__a'); const ambB = $('.ambient__b');
    const drifts = $$('[data-drift]').map(el => ({ el, sp: parseFloat(el.dataset.drift) || 0, rot: parseFloat(el.dataset.rot) || 0, cy: 0 }));
    const driftBox = $('.drift');
    let maxScroll = 1;
    const measure = () => {
      drifts.forEach(d => { d.cy = (parseFloat(d.el.style.top) || 0) / 100 * driftBox.offsetHeight + (parseFloat(d.el.style.height) || 0) / 2; });
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    measure();
    window.addEventListener('resize', measure); window.addEventListener('load', measure);
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
    let lastPr = -1;
    onFrame((y) => {
      const vh = window.innerHeight; const pr = Math.min(1, y / maxScroll);
      if (Math.abs(pr - lastPr) > 0.0004) {
        lastPr = pr;
        if (ambA) ambA.style.transform = 'translate3d(' + (pr * 22).toFixed(1) + 'vmax,' + (pr * 58).toFixed(1) + 'vmax,0)';
        if (ambB) ambB.style.transform = 'translate3d(' + (-pr * 24).toFixed(1) + 'vmax,' + (-pr * 66).toFixed(1) + 'vmax,0)';
      }
      if (!lite) {
        for (let i = 0; i < drifts.length; i++) {
          const d = drifts[i]; const rel = y + vh / 2 - d.cy;
          if (rel > vh * 1.4 || rel < -vh * 1.4) continue;
          d.el.style.transform = 'translate3d(0,' + (rel * d.sp).toFixed(1) + 'px,0) rotate(' + (rel * d.rot).toFixed(1) + 'deg)';
        }
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const rest = (el) => new IntersectionObserver((en) => el.classList.toggle('is-off', !en[0].isIntersecting), { threshold: 0 }).observe(el);
    const heroEl = $('.hero'); const banner = $('.marquee');
    if (heroEl) rest(heroEl); if (banner) rest(banner);
  }

  /* hero spice parallax (only while the hero is near the top) */
  if (!reduce) {
    const spices = $$('[data-speed]').map(s => ({ s, sp: parseFloat(s.dataset.speed) || 0, rot: parseFloat(s.dataset.rot) || 0 }));
    onFrame((y) => {
      if (y > window.innerHeight * 1.3) return;
      for (let i = 0; i < spices.length; i++) {
        const o = spices[i];
        o.s.style.transform = 'translate3d(0,' + (-y * o.sp).toFixed(1) + 'px,0) rotate(' + (y * o.rot).toFixed(1) + 'deg)';
      }
    });
  }

  /* =========================================================
     Menu: reveal + filter
     ========================================================= */
  const grid = $('#menu-grid');
  const dishes = $$('.dish', grid);
  const chips = $$('.chip');
  const pill = $('.filter__pill');
  const filterBox = $('.filter');

  // Reveal on scroll. Items you scroll past quickly are shown at once (no animation),
  // so nothing is ever left hidden or missing its price.
  const pending = new Set(reduce ? [] : dishes);
  const pendingHeads = new Set(reduce ? [] : heads);
  if (reduce) dishes.forEach(d => d.classList.add('in'));
  const revealTask = (y) => {
    if (!pending.size && !pendingHeads.size) return;
    const vh = window.innerHeight; let n = 0;
    const doneD = [], doneH = [];
    pending.forEach(d => {
      if (d.hidden) return;
      const r = d.getBoundingClientRect();
      if (r.bottom < 0) doneD.push([d, true]);
      else if (r.top < vh * 0.94) doneD.push([d, false]);
    });
    pendingHeads.forEach(h => {
      const r = h.getBoundingClientRect();
      if (r.bottom < 0 || r.top < vh * 0.88) doneH.push(h);
    });
    doneD.forEach(([d, instant]) => {
      d.style.setProperty('--d', Math.min(n, 5)); d.style.setProperty('--sd', Math.min(n, 4)); n++;
      if (instant) d.classList.add('instant');
      d.classList.add('in'); pending.delete(d);
    });
    doneH.forEach(h => { h.classList.add('in-view'); pendingHeads.delete(h); });
  };
  onFrame(revealTask);

  const photos = $$('.dish__plate img');
  const mark = (im) => im.classList.add('loaded');
  photos.forEach(im => {
    if (im.complete && im.naturalWidth) mark(im);
    else { im.addEventListener('load', () => mark(im), { once: true }); im.addEventListener('error', () => mark(im), { once: true }); }
  });
  setTimeout(() => photos.forEach(mark), 5000);

  const movePill = (chip, instant) => {
    if (!chip) return;
    if (instant) pill.style.transition = 'none';
    pill.style.width = chip.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + chip.offsetLeft + 'px)';
    if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
  };
  const activeChip = () => chips.find(c => c.getAttribute('aria-pressed') === 'true');
  movePill(activeChip(), true);
  window.addEventListener('resize', () => movePill(activeChip(), true));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => movePill(activeChip(), true));

  let current = 'all', timer = 0;
  const applyFilter = (cat) => {
    clearTimeout(timer);
    const matches = (d) => cat === 'all' || d.dataset.cat === cat;
    const before = dishes.filter(d => !d.hidden);
    const firstRects = new Map(before.map(d => [d, d.getBoundingClientRect()]));
    const leaving = before.filter(d => !matches(d));
    pending.clear();
    leaving.forEach(d => d.classList.add('is-out'));
    timer = setTimeout(() => {
      let n = 0; const entering = [];
      dishes.forEach(d => {
        if (matches(d)) {
          if (d.hidden) { d.hidden = false; d.classList.remove('is-out', 'in', 'instant'); d.style.setProperty('--d', Math.min(n, 5)); d.style.setProperty('--sd', Math.min(n, 4)); n++; entering.push(d); }
          else { d.classList.remove('is-out'); d.classList.add('in', 'instant'); }
        } else { d.hidden = true; d.classList.remove('is-out', 'in', 'instant'); }
      });
      // the cards that stay glide from their old spot to the new one
      before.filter(matches).forEach(d => {
        const f = firstRects.get(d); const l = d.getBoundingClientRect();
        if (reduce || !d.animate || Math.abs(f.width - l.width) > 2) return;
        const dx = f.left - l.left, dy = f.top - l.top;
        if (dx || dy) d.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 640, easing: 'cubic-bezier(.22,.8,.24,1)' });
      });
      void grid.offsetWidth;
      entering.forEach(d => d.classList.add('in'));
    }, reduce ? 0 : 240);
  };
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.filter;
      if (cat === current) return;
      current = cat;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      movePill(chip, false);
      if (filterBox.scrollWidth > filterBox.clientWidth) {
        filterBox.scrollTo({ left: chip.offsetLeft - (filterBox.clientWidth - chip.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
      applyFilter(cat);
    });
  });

  /* =========================================================
     Layers (sheet, dish details, ticket): focus, scroll lock, Escape
     ========================================================= */
  const layers = [];
  const focusables = (c) => $$('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])', c)
    .filter(x => !x.disabled && !x.hidden && x.getClientRects().length);
  const lockScroll = () => { document.body.style.overflow = 'hidden'; };
  const unlockScroll = () => { if (!layers.length && drawer.getAttribute('aria-hidden') !== 'false') document.body.style.overflow = ''; };
  const showLayer = (el, onClose) => {
    layers.push({ el, onClose, opener: document.activeElement });
    el.removeAttribute('inert'); el.setAttribute('aria-hidden', 'false');
    lockScroll();
  };
  const hideLayerA11y = (el) => {
    el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true');
    const i = layers.findIndex(l => l.el === el);
    let opener = null;
    if (i > -1) { opener = layers[i].opener; layers.splice(i, 1); }
    unlockScroll();
    if (opener && document.contains(opener) && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer.classList.contains('is-open')) { setDrawer(false); return; }
      const top = layers[layers.length - 1]; if (top) top.onClose();
    } else if (e.key === 'Tab') {
      const top = layers[layers.length - 1]; if (!top) return;
      const f = focusables(top.el); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (!top.el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* toast */
  const toastEl = $('#toast'); let toastTimer = 0;
  const toast = (msg, ms = 3200) => {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  };

  /* =========================================================
     Order builder
     ========================================================= */
  const STORE = 'habhab-order-v1';
  const MAX = 20;
  const catalog = {};
  $$('[data-id]').forEach(el => {
    const holder = el.closest('[data-cat]');
    catalog[el.dataset.id] = { id: el.dataset.id, name: el.dataset.name, price: Number(el.dataset.price) || 0, cat: holder ? holder.dataset.cat : '' };
  });
  // keep coins and the drinks list in step with data-price
  $$('.dish[data-id]').forEach(li => {
    const c = $('.dish__price', li);
    if (c) c.innerHTML = '<span class="sr">Price </span>' + (Number(li.dataset.price) || 0) + '<span class="sr"> pesos</span>';
  });
  $$('.extras li[data-id]').forEach(li => { $('.extras__price', li).textContent = peso(Number(li.dataset.price) || 0); });

  let order = {};
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) || '{}');
    Object.keys(raw).forEach(k => { const q = parseInt(raw[k], 10); if (catalog[k] && q > 0) order[k] = Math.min(q, MAX); });
  } catch (e) { order = {}; }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(order)); } catch (e) { /* storage off: order still works this visit */ } };
  const count = () => Object.keys(order).reduce((a, k) => a + order[k], 0);
  const total = () => Object.keys(order).reduce((a, k) => a + order[k] * catalog[k].price, 0);

  const bar = $('#orderbar'); const barBag = $('.orderbar__bag', bar);
  const barCount = $('.orderbar__count', bar); const barTotal = $('.orderbar__total', bar);
  const sheet = $('#order-sheet'); const sheetBackdrop = $('#sheet-backdrop');
  const linesEl = $('#lines'); const sheetTotal = $('#sheet-total');

  const slotHTML = (id, scope, mini) => {
    const q = order[id] || 0; const name = esc(catalog[id].name);
    if (!q) {
      return '<button type="button" class="add-btn' + (mini ? ' add-btn--mini' : '') + '" data-act="add" data-id="' + id + '" data-key="' + scope + ':add:' + id + '" aria-label="Add ' + name + ' to order">' + icon('i-plus') + (mini ? '' : '<span>Add to order</span>') + '</button>';
    }
    return '<div class="qty' + (mini ? ' qty--mini' : '') + '" role="group" aria-label="' + name + ' quantity">' +
      '<button type="button" data-act="dec" data-id="' + id + '" data-key="' + scope + ':dec:' + id + '" aria-label="Remove one ' + name + '">' + icon('i-minus') + '</button>' +
      '<output>' + q + '</output>' +
      '<button type="button" data-act="inc" data-id="' + id + '" data-key="' + scope + ':inc:' + id + '" aria-label="Add one more ' + name + '">' + icon('i-plus') + '</button></div>';
  };
  const slotId = (slot) => slot.dataset.slotId || (slot.closest('[data-id]') && slot.closest('[data-id]').dataset.id);
  const renderSlots = (only) => {
    $$('[data-slot]').forEach(slot => {
      const id = slotId(slot);
      if (!id || !catalog[id] || (only && id !== only)) return;
      slot.innerHTML = slotHTML(id, slot.dataset.scope || 'card', slot.hasAttribute('data-mini'));
      const row = slot.closest('.extras li[data-id]'); if (row) row.classList.toggle('is-added', !!order[id]);
    });
  };

  const renderLines = () => {
    linesEl.innerHTML = Object.keys(order).map(id => {
      const it = catalog[id]; const q = order[id];
      return '<li class="line"><div class="line__name">' + esc(it.name) + '<small>' + peso(it.price) + ' each</small></div>' +
        '<span class="line__sum">' + peso(q * it.price) + '</span>' + slotHTML(id, 'sheet', false) + '</li>';
    }).join('');
    sheetTotal.textContent = peso(total());
    renderSuggest();
  };
  const suggestBox = $('#suggest');
  const renderSuggest = () => {
    const hasBowl = Object.keys(order).some(id => catalog[id] && catalog[id].cat !== 'extras');
    const need = ['extra-rice', 'extra-egg'].filter(id => catalog[id] && !order[id]);
    if (!hasBowl || !need.length) { suggestBox.hidden = true; return; }
    suggestBox.hidden = false;
    $('.suggest__chips', suggestBox).innerHTML = need.map(id =>
      '<button type="button" class="suggest__chip" data-act="add" data-id="' + id + '" data-key="sheet:add:' + id + '">' + icon('i-plus') +
      '<span>' + esc(catalog[id].name) + '</span><b>' + peso(catalog[id].price) + '</b></button>').join('');
  };

  const tween = (el, to, fmt) => {
    const from = Number(el.dataset.shown || el.dataset.v || 0); el.dataset.v = to;
    const token = (el._tw = (el._tw || 0) + 1);
    if (reduce || from === to) { el.dataset.shown = to; el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 600;
    const step = (t) => {
      if (el._tw !== token) return;
      const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3);
      const v = Math.round(from + (to - from) * e);
      el.dataset.shown = v; el.textContent = fmt(v);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const renderBar = (bump) => {
    tween(barTotal, total(), peso);
    barCount.textContent = count();
    if (bump && !reduce) { barBag.classList.remove('bump'); void barBag.offsetWidth; barBag.classList.add('bump'); }
  };
  const barVisibility = () => {
    const on = count() > 0;
    bar.classList.toggle('is-on', on);
    document.body.classList.toggle('has-order', on);
  };
  // set bar numbers without animation on load
  barTotal.dataset.v = total(); barTotal.textContent = peso(total()); barCount.textContent = count();
  barVisibility();
  renderSlots();

  const restoreFocus = (key) => {
    if (!key) return;
    const target = $('[data-key="' + key + '"]');
    if (target) target.focus({ preventScroll: true });
  };

  /* fly a small bowl from the dish to the order bag */
  let flying = 0;
  const flyToBag = (srcEl) => new Promise((resolve) => {
    if (reduce || !srcEl || !srcEl.animate || flying >= 3) { resolve(); return; }
    const s = srcEl.getBoundingClientRect(); const b = barBag.getBoundingClientRect();
    if (!s.width || !b.width) { resolve(); return; }
    const size = Math.max(46, Math.min(80, s.width * 0.45));
    const sx = s.left + s.width / 2 - size / 2, sy = s.top + s.height / 2 - size / 2;
    const ex = b.left + b.width / 2 - size / 2, ey = b.top + b.height / 2 - size / 2;
    const outer = document.createElement('div'); outer.className = 'fly';
    outer.style.width = outer.style.height = size + 'px';
    const inner = document.createElement('div'); inner.className = 'fly__in';
    const im = document.createElement('img'); im.alt = ''; im.src = srcEl.currentSrc || srcEl.src || '';
    inner.appendChild(im); outer.appendChild(inner); document.body.appendChild(outer);
    const dur = 780;
    outer.animate([{ transform: 'translateX(' + sx + 'px)' }, { transform: 'translateX(' + ex + 'px)' }],
      { duration: dur, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'forwards' });
    const a = inner.animate([
      { transform: 'translateY(' + sy + 'px) scale(1)', opacity: 1 },
      { transform: 'translateY(' + ey + 'px) scale(.38)', opacity: .15 }
    ], { duration: dur, easing: 'cubic-bezier(.55,-.45,.7,.55)', fill: 'forwards' });
    flying++;
    const done = () => { outer.remove(); flying = Math.max(0, flying - 1); resolve(); };
    a.onfinish = done; a.oncancel = done;
  });

  const sourceFor = (btn, id) => {
    const scope = (btn.dataset.key || '').split(':')[0];
    if (btn.closest('.extras')) return btn;
    if (scope === 'modal') return $('.dm__img img');
    if (scope === 'card') { const li = btn.closest('.dish'); return li && $('.dish__plate img', li); }
    return null;
  };

  const change = (btn) => {
    const id = btn.dataset.id; const act = btn.dataset.act; const key = btn.dataset.key || '';
    if (!catalog[id]) return;
    const prev = order[id] || 0; let q = prev;
    if (act === 'add' || act === 'inc') q = Math.min(prev + 1, MAX);
    else if (act === 'dec') q = Math.max(prev - 1, 0);
    if (q === prev) { if (prev >= MAX) toast('That is the most we can list per item. Tell us at the cart if you want more.'); return; }
    if (q) order[id] = q; else delete order[id];
    save();
    const adding = q > prev;
    if (adding && !reduce && navigator.vibrate) { try { navigator.vibrate(12); } catch (e) { /* not supported */ } }
    let nextKey = key;
    if (act === 'add') nextKey = key.replace(':add:', ':inc:');
    else if (act === 'dec' && q === 0) nextKey = key.replace(':dec:', ':add:');

    const src = adding ? sourceFor(btn, id) : null;
    renderSlots(id);
    if (sheet.classList.contains('is-open')) renderLines();
    barVisibility();
    restoreFocus(nextKey);
    if (adding && src) flyToBag(src).then(() => renderBar(true));
    else renderBar(adding);
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b) change(b);
  });

  /* ---- order sheet ---- */
  const openSheet = () => {
    if (sheet.classList.contains('is-open')) return;
    renderLines();
    msgBtnUpdate();
    sheet.classList.add('is-open'); sheetBackdrop.classList.add('is-open');
    showLayer(sheet, closeSheet);
    setTimeout(() => { const f = $('.sheet__head .icon-btn', sheet); if (f) f.focus({ preventScroll: true }); }, 60);
  };
  function closeSheet() {
    sheet.classList.remove('is-open'); sheetBackdrop.classList.remove('is-open');
    hideLayerA11y(sheet);
  }
  $('.orderbar__btn', bar).addEventListener('click', openSheet);
  sheetBackdrop.addEventListener('click', closeSheet);
  $('[data-close="sheet"]', sheet).addEventListener('click', closeSheet);

  /* swipe the order sheet down to close it (phones) */
  const sheetHead = $('.sheet__head', sheet);
  const phoneSheet = window.matchMedia('(max-width: 759px)');
  let drag = null;
  sheetHead.addEventListener('pointerdown', (e) => {
    if (!phoneSheet.matches || e.target.closest('button')) return;
    drag = { y: e.clientY, t: performance.now(), dy: 0 };
    try { sheetHead.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    sheet.style.transition = 'none';
  });
  sheetHead.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.dy = Math.max(0, e.clientY - drag.y);
    sheet.style.transform = 'translateY(' + drag.dy + 'px)';
    sheetBackdrop.style.opacity = String(1 - Math.min(1, drag.dy / Math.max(1, sheet.offsetHeight)));
  });
  const endDrag = () => {
    if (!drag) return;
    const d = drag; drag = null;
    sheet.style.transition = ''; sheetBackdrop.style.opacity = '';
    const v = d.dy / Math.max(1, performance.now() - d.t);
    const shouldClose = d.dy > 110 || (v > 0.6 && d.dy > 36);
    if (shouldClose) closeSheet();
    sheet.style.transform = '';
  };
  sheetHead.addEventListener('pointerup', endDrag);
  sheetHead.addEventListener('pointercancel', endDrag);

  const orderText = () => {
    const lines = Object.keys(order).map(id => order[id] + ' x ' + catalog[id].name + ' - ' + peso(order[id] * catalog[id].price));
    return ['HabHab Ta Bai! order', ...lines, 'Total: ' + peso(total()), address ? 'Pickup: ' + address : ''].filter(Boolean).join('\n');
  };
  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall back below */ }
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0'; document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    } catch (e) { return false; }
  };
  $('#copy-order').addEventListener('click', async () => {
    toast((await copyText(orderText())) ? 'Order copied. Paste it in a message to us.' : 'Could not copy. Tap Show at the cart instead.');
  });

  const msgBtn = $('#msg-order');
  function msgBtnUpdate() {
    const m = contacts.find(c => c.kind === 'messenger'); const ph = contacts.find(c => c.kind === 'phone');
    if (m) {
      msgBtn.hidden = false; msgBtn.textContent = ''; msgBtn.appendChild(svgIcon('i-messenger')); msgBtn.appendChild(document.createTextNode('Send on Messenger'));
      msgBtn.href = m.href; msgBtn.target = '_blank'; msgBtn.rel = 'noopener';
      msgBtn.onclick = () => { copyText(orderText()).then(ok => { if (ok) toast('Order copied. Paste it in the chat.'); }); };
    } else if (ph) {
      msgBtn.hidden = false; msgBtn.textContent = ''; msgBtn.appendChild(svgIcon('i-phone')); msgBtn.appendChild(document.createTextNode('Send by text'));
      msgBtn.href = 'sms:' + phone.replace(/[^\d+]/g, '') + '?&body=' + encodeURIComponent(orderText()); msgBtn.removeAttribute('target'); msgBtn.onclick = null;
    } else msgBtn.hidden = true;
  }

  $('#clear-order').addEventListener('click', () => {
    if (!count()) return;
    order = {}; save(); renderSlots(); renderLines(); barVisibility(); renderBar(false);
    toast('Order cleared.');
    closeSheet();
  });

  /* ---- show at the cart ---- */
  const tv = $('#ticketview');
  const openTicket = () => {
    if (!count()) { toast('Add a bowl to your order first.'); return; }
    $('#tv-lines').innerHTML = Object.keys(order).map(id =>
      '<li><span class="q">' + order[id] + '</span><span>' + esc(catalog[id].name) + '</span><span class="p">' + peso(order[id] * catalog[id].price) + '</span></li>').join('');
    $('#tv-total').textContent = peso(total());
    $('#tv-time').textContent = new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
    $('#tv-where').textContent = address ? 'Find us ' + address.charAt(0).toLowerCase() + address.slice(1) : '';
    tv.classList.add('is-open');
    showLayer(tv, closeTicket);
    setTimeout(() => $('#tv-close').focus({ preventScroll: true }), 60);
  };
  function closeTicket() { tv.classList.remove('is-open'); hideLayerA11y(tv); }
  $('#show-order').addEventListener('click', openTicket);
  $('#tv-close').addEventListener('click', closeTicket);

  /* ---- save or share the order as an image ---- */
  const loadImage = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  const wrapText = (ctx, text, maxW) => {
    const words = text.split(' '); const out = []; let line = '';
    words.forEach(w => {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    });
    if (line) out.push(line);
    return out;
  };
  const buildOrderImage = async () => {
    try {
      await Promise.all([document.fonts.load('800 40px Fraunces'), document.fonts.load('700 30px Figtree'), document.fonts.load('500 30px Figtree')]);
    } catch (e) { /* fonts fall back */ }
    const SERIF = '"Fraunces","Iowan Old Style",Georgia,serif', SANS = '"Figtree",system-ui,-apple-system,sans-serif';
    const logoEl = $('.tv__logo'); const logo = await loadImage(logoEl.currentSrc || logoEl.src);
    const W = 1080, PAD = 72, ROW = 108;
    const ids = Object.keys(order);
    const when = new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
    const where = address ? 'Find us ' + address.charAt(0).toLowerCase() + address.slice(1) : '';

    const render = (ctx, draw) => {
      let y = 0;
      if (draw) { ctx.fillStyle = '#fbf0dc'; ctx.fillRect(0, 0, W, ctx.canvas.height); ctx.fillStyle = '#7b1d15'; ctx.fillRect(0, 0, W, 26); }
      y = 26 + 56;
      if (draw && logo) ctx.drawImage(logo, (W - 230) / 2, y, 230, 230);
      y += 230 + 36;
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      if (draw) { ctx.fillStyle = '#7b1d15'; ctx.font = '800 68px ' + SERIF; ctx.fillText('My order', W / 2, y + 52); }
      y += 52 + 26;
      if (draw) { ctx.fillStyle = 'rgba(43,23,14,.66)'; ctx.font = '500 32px ' + SANS; ctx.fillText(when, W / 2, y + 28); }
      y += 28 + 40;
      const dash = () => { if (!draw) return; ctx.save(); ctx.setLineDash([16, 12]); ctx.strokeStyle = 'rgba(123,29,21,.38)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke(); ctx.restore(); };
      dash();
      ids.forEach(id => {
        const it = catalog[id]; const q = order[id];
        if (draw) {
          const base = y + 68;
          ctx.textAlign = 'left'; ctx.fillStyle = '#7b1d15'; ctx.font = '800 60px ' + SERIF; ctx.fillText(q, PAD, base);
          ctx.fillStyle = '#2b170e'; ctx.font = '700 42px ' + SANS;
          let name = it.name; const maxName = W - PAD * 2 - 130 - 230;
          while (ctx.measureText(name).width > maxName && name.length > 4) name = name.slice(0, -1);
          if (name !== it.name) name += '...';
          ctx.fillText(name, PAD + 130, base - 4);
          ctx.textAlign = 'right'; ctx.fillStyle = '#cf5f0a'; ctx.font = '800 46px ' + SERIF; ctx.fillText(peso(q * it.price), W - PAD, base - 2);
        }
        y += ROW; dash();
      });
      y += 30;
      if (draw) {
        ctx.textAlign = 'left'; ctx.fillStyle = '#2b170e'; ctx.font = '700 44px ' + SANS; ctx.fillText('Total', PAD, y + 82);
        ctx.textAlign = 'right'; ctx.fillStyle = '#7b1d15'; ctx.font = '800 116px ' + SERIF; ctx.fillText(peso(total()), W - PAD, y + 90);
      }
      y += 120 + 30;
      ctx.textAlign = 'center';
      ctx.font = '500 33px ' + SANS;
      if (where) {
        const lines = wrapText(ctx, where, W - PAD * 2);
        lines.forEach(l => { if (draw) { ctx.fillStyle = 'rgba(43,23,14,.74)'; ctx.fillText(l, W / 2, y + 34); } y += 48; });
        y += 14;
      }
      if (draw) { ctx.fillStyle = '#7b1d15'; ctx.font = '700 33px ' + SANS; ctx.fillText('Show this to our crew at the cart.', W / 2, y + 34); }
      y += 34 + 52;
      if (draw) { ctx.fillStyle = '#7b1d15'; ctx.fillRect(0, y, W, 26); }
      y += 26;
      return y;
    };
    const probe = document.createElement('canvas').getContext('2d');
    const H = render(probe, false);
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    render(canvas.getContext('2d'), true);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    return blob;
  };
  const orderFileName = () => {
    const d = new Date(); const z = (n) => String(n).padStart(2, '0');
    return 'HabHabTaBai-order-' + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + '-' + z(d.getHours()) + z(d.getMinutes()) + '.png';
  };
  const withBusy = async (btn, label, fn) => {
    const span = $('span', btn); const old = span.textContent;
    btn.disabled = true; span.textContent = label;
    try { await fn(); } finally { btn.disabled = false; span.textContent = old; }
  };
  $('#tv-save').addEventListener('click', (e) => {
    withBusy(e.currentTarget, 'Preparing...', async () => {
      const blob = await buildOrderImage();
      if (!blob) { toast('Could not make the image. Take a screenshot of this screen instead.', 4500); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = orderFileName();
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast('Saved as an image. Check your Downloads or Gallery.', 4200);
    });
  });
  const shareBtn = $('#tv-share');
  const canShareFiles = () => {
    try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File(['x'], 'a.png', { type: 'image/png' })] })); } catch (err) { return false; }
  };
  if (canShareFiles()) shareBtn.hidden = false;
  shareBtn.addEventListener('click', (e) => {
    withBusy(e.currentTarget, 'Preparing...', async () => {
      const blob = await buildOrderImage();
      if (!blob) { toast('Could not make the image. Try Save as image.', 4000); return; }
      const file = new File([blob], orderFileName(), { type: 'image/png' });
      try { await navigator.share({ files: [file], title: 'My HabHab Ta Bai! order', text: orderText() }); }
      catch (err) { if (!err || err.name !== 'AbortError') toast('Could not share. Try Save as image.', 4000); }
    });
  });

  /* =========================================================
     Dish details (tap a bowl)
     ========================================================= */
  const dm = $('#dish-modal'); const dmImg = $('.dm__img', dm); const dmImgEl = $('img', dmImg);
  const dmSlot = $('#dm-slot'); let dmPlate = null; let dmAnim = null; let dmBusy = false;
  const flip = (fromRect, toRect, el, dur, reverse) => {
    const dx = fromRect.left - toRect.left, dy = fromRect.top - toRect.top, s = fromRect.width / toRect.width;
    const a = { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }; const b = { transform: 'none' };
    return el.animate(reverse ? [b, a] : [a, b], { duration: dur, easing: 'cubic-bezier(.2,.85,.25,1)', fill: 'both' });
  };
  const openDish = (li) => {
    if (dmBusy || dm.classList.contains('is-open')) return;
    const id = li.dataset.id; const plate = $('.dish__plate', li); const img = $('img', plate);
    dmPlate = plate;
    dmImgEl.src = img.getAttribute('src') || img.src; dmImgEl.alt = li.dataset.name;
    $('#dm-name').textContent = li.dataset.name;
    $('#dm-desc').textContent = $('.dish__desc', li).textContent;
    $('#dm-price').innerHTML = '<span class="sr">Price </span>' + (Number(li.dataset.price) || 0) + '<span class="sr"> pesos</span>';
    dmSlot.dataset.slotId = id; renderSlots(id);
    const first = plate.getBoundingClientRect();
    dm.classList.remove('is-closing'); dm.classList.add('is-open');
    showLayer(dm, closeDish);
    const last = dmImg.getBoundingClientRect();
    if (dmAnim) dmAnim.cancel();
    if (!reduce && dmImg.animate && first.width && last.width) {
      dmAnim = flip(first, last, dmImg, 650, false);
      plate.style.visibility = 'hidden';
    }
    setTimeout(() => { const f = $('.dm__close', dm); if (f) f.focus({ preventScroll: true }); }, 80);
  };
  function closeDish() {
    if (!dm.classList.contains('is-open')) return;
    dmBusy = true;
    const plate = dmPlate;
    const finish = () => {
      dm.classList.remove('is-closing');
      if (dmAnim) { dmAnim.cancel(); dmAnim = null; }
      if (plate) { plate.style.visibility = ''; try { plate.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
      dmBusy = false;
    };
    dm.classList.remove('is-open'); dm.classList.add('is-closing');
    hideLayerA11y(dm);
    const from = dmImg.getBoundingClientRect(); const to = plate ? plate.getBoundingClientRect() : null;
    const onScreen = to && to.width && to.bottom > 0 && to.top < window.innerHeight;
    if (!reduce && onScreen && dmImg.animate) {
      if (dmAnim) dmAnim.cancel();
      // dmImg is currently at its natural spot, so animate from there to the plate
      const dx = to.left - from.left, dy = to.top - from.top, s = to.width / from.width;
      dmAnim = dmImg.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }],
        { duration: 520, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'both' });
      dmAnim.onfinish = finish;
    } else setTimeout(finish, reduce ? 0 : 420);
  }
  grid.addEventListener('click', (e) => {
    const plate = e.target.closest('.dish__plate');
    if (plate) openDish(plate.closest('.dish'));
  });
  $$('[data-close="dish"]', dm).forEach(b => b.addEventListener('click', closeDish));

  /* =========================================================
     PWA: service worker, install button, offline notice
     ========================================================= */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
  const installBtn = $('#install-btn'); let deferred = null;
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; if (installBtn) installBtn.hidden = false; });
  window.addEventListener('appinstalled', () => { deferred = null; if (installBtn) installBtn.hidden = true; toast('Installed. Find HabHab Ta Bai! on your home screen.'); });
  if (installBtn) {
    if (isIOS && !standalone) installBtn.hidden = false;
    installBtn.addEventListener('click', async () => {
      if (deferred) {
        deferred.prompt();
        try { await deferred.userChoice; } catch (e) { /* ignore */ }
        deferred = null; installBtn.hidden = true;
      } else if (isIOS) {
        toast('To install: tap the Share button in Safari, then Add to Home Screen.', 7000);
      }
    });
  }
  window.addEventListener('load', queueFrame);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFrame);
  runFrame();

  window.addEventListener('offline', () => toast('You are offline. The menu and your order still work.', 4200));
  window.addEventListener('online', () => toast('Back online.', 2200));
})();
