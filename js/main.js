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

  /* =========================================================
     Header, drawer, back to top
     ========================================================= */
  const header = $('.site-header');
  const toTop = $('.to-top');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    toTop.classList.toggle('is-visible', y > 700);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
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
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setDrawer(false); });

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
  if ('IntersectionObserver' in window && !reduce) {
    const hio = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in-view'); hio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    heads.forEach(h => hio.observe(h));
  } else heads.forEach(h => h.classList.add('in-view'));

  /* =========================================================
     Logo travels into the header on scroll
     ========================================================= */
  const flyLogo = $('.logo-fly'); const heroLogo = $('.hero__logo'); const brandImg = $('.brand img');
  if (!reduce && flyLogo && heroLogo && brandImg) {
    root.classList.add('travel');
    const ease = (p) => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    let ticking = false;
    const travel = () => {
      ticking = false;
      const y = window.scrollY; const vh = window.innerHeight;
      const span = Math.max(240, vh * 0.5);
      const p = Math.min(1, Math.max(0, y / span));
      if (y <= 1) { root.classList.remove('traveling', 'arrived'); flyLogo.classList.remove('on'); return; }
      root.classList.add('traveling');
      if (p >= 1) { root.classList.add('arrived'); flyLogo.classList.remove('on'); return; }
      root.classList.remove('arrived');
      const r = heroLogo.getBoundingClientRect(); const t = brandImg.getBoundingClientRect();
      const w0 = r.width; if (!w0) return;
      const left0 = r.left; const top0 = r.top + y; // where the logo sits at scroll 0
      const e = ease(p);
      const x = left0 + (t.left - left0) * e;
      const ty = top0 + (t.top - top0) * e;
      const size = w0 + (t.width - w0) * e;
      flyLogo.style.width = w0 + 'px'; flyLogo.style.height = w0 + 'px';
      flyLogo.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0) scale(' + (size / w0).toFixed(4) + ')';
      flyLogo.classList.add('on');
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(travel); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    window.addEventListener('load', req);
    travel();
  }

  /* hero spice parallax */
  if (!reduce) {
    const spices = $$('[data-speed]');
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.3) {
        spices.forEach(s => {
          const sp = parseFloat(s.dataset.speed) || 0; const rot = parseFloat(s.dataset.rot) || 0;
          s.style.transform = 'translate3d(0,' + (-y * sp).toFixed(1) + 'px,0) rotate(' + (y * rot).toFixed(1) + 'deg)';
        });
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  }

  /* =========================================================
     Menu: reveal + filter
     ========================================================= */
  const grid = $('#menu-grid');
  const dishes = $$('.dish', grid);
  const chips = $$('.chip');
  const pill = $('.filter__pill');
  const filterBox = $('.filter');

  let io = null;
  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.style.setProperty('--d', n++);
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    dishes.forEach(d => io.observe(d));
  } else dishes.forEach(d => d.classList.add('in'));

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
    dishes.forEach(d => { if (io) io.unobserve(d); d.classList.add('is-out'); });
    timer = setTimeout(() => {
      let i = 0;
      dishes.forEach(d => {
        const match = cat === 'all' || d.dataset.cat === cat;
        d.hidden = !match;
        d.classList.remove('is-out', 'in');
        d.style.setProperty('--d', match ? i++ : 0);
      });
      void grid.offsetWidth;
      dishes.forEach(d => { if (!d.hidden) d.classList.add('in'); });
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
    catalog[el.dataset.id] = { id: el.dataset.id, name: el.dataset.name, price: Number(el.dataset.price) || 0 };
  });
  // keep coins and the drinks list in step with data-price
  $$('.dish[data-id]').forEach(li => {
    const c = $('.dish__price', li);
    if (c) c.innerHTML = '<span class="sr">Price </span><small>₱</small>' + (Number(li.dataset.price) || 0);
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
    });
  };

  const renderLines = () => {
    linesEl.innerHTML = Object.keys(order).map(id => {
      const it = catalog[id]; const q = order[id];
      return '<li class="line"><div class="line__name">' + esc(it.name) + '<small>' + peso(it.price) + ' each</small></div>' +
        '<span class="line__sum">' + peso(q * it.price) + '</span>' + slotHTML(id, 'sheet', false) + '</li>';
    }).join('');
    sheetTotal.textContent = peso(total());
  };

  const tween = (el, to, fmt) => {
    const from = Number(el.dataset.v || 0); el.dataset.v = to;
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 600;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(from + (to - from) * e));
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
  const flyToBag = (srcEl) => new Promise((resolve) => {
    if (reduce || !srcEl || !srcEl.animate) { resolve(); return; }
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
    const done = () => { outer.remove(); resolve(); };
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
    dmImgEl.src = img.currentSrc || img.src; dmImgEl.alt = li.dataset.name;
    $('#dm-name').textContent = li.dataset.name;
    $('#dm-desc').textContent = $('.dish__desc', li).textContent;
    $('#dm-price').innerHTML = '<span class="sr">Price </span><small>₱</small>' + (Number(li.dataset.price) || 0);
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
      if (plate) plate.style.visibility = '';
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
  window.addEventListener('offline', () => toast('You are offline. The menu and your order still work.', 4200));
  window.addEventListener('online', () => toast('Back online.', 2200));
})();
