/* HabHab Ta Bai! | main.js */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cfg = window.SITE_CONFIG || {};

  /* ---------- year ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- business details from config.js ---------- */
  const svgIcon = (id) => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'ico');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  };
  const clean = (v) => (typeof v === 'string' ? v.trim() : '');
  const isHttps = (v) => /^https:\/\//i.test(v);

  const phone = clean(cfg.phone);
  const contacts = [];
  if (isHttps(clean(cfg.messenger))) contacts.push({ label: 'Message us', icon: 'i-messenger', href: clean(cfg.messenger), external: true });
  if (phone) contacts.push({ label: 'Call ' + phone, icon: 'i-phone', href: 'tel:' + phone.replace(/[^\d+]/g, ''), external: false });

  const socials = [];
  if (isHttps(clean(cfg.facebook))) socials.push({ label: 'Facebook', icon: 'i-facebook', href: clean(cfg.facebook) });
  if (isHttps(clean(cfg.instagram))) socials.push({ label: 'Instagram', icon: 'i-instagram', href: clean(cfg.instagram) });
  if (isHttps(clean(cfg.tiktok))) socials.push({ label: 'TikTok', icon: 'i-tiktok', href: clean(cfg.tiktok) });

  // "Order now" buttons go straight to Messenger or the phone when available
  const primary = contacts[0];
  $$('[data-order-link]').forEach(a => {
    if (!primary) return;
    a.href = primary.href;
    if (primary.external) { a.target = '_blank'; a.rel = 'noopener'; }
  });

  // Step 2 of "How to order": visit the cart first; messaging is the backup
  if (contacts.length) {
    const p = $('[data-step2-text]');
    if (p) p.textContent += ' Can\'t make it? Message or call us.';
  }

  // Footer socials
  const socialBox = $('[data-social]');
  if (socialBox) {
    socials.forEach(s => {
      const a = document.createElement('a');
      a.className = 'social'; a.href = s.href; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', s.label);
      a.appendChild(svgIcon(s.icon));
      socialBox.appendChild(a);
    });
  }

  // Find us section
  const address = clean(cfg.address);
  const hours = Array.isArray(cfg.hours) ? cfg.hours.filter(h => h && (h.days || h.time)) : [];
  const mapEmbed = clean(cfg.mapEmbed);
  const mapLink = clean(cfg.mapLink);
  const hasFind = !!(address || hours.length || contacts.length || socials.length || isHttps(mapEmbed));
  if (hasFind) {
    const sec = $('#find'); const info = $('[data-find-info]'); const mapBox = $('[data-find-map]');
    sec.hidden = false;
    $$('[data-find-link]').forEach(a => { a.hidden = false; });

    const row = (icon, title, content) => {
      const r = document.createElement('div'); r.className = 'info-row';
      r.appendChild(svgIcon(icon));
      const d = document.createElement('div');
      const h = document.createElement('h3'); h.textContent = title;
      d.appendChild(h); d.appendChild(content); r.appendChild(d); return r;
    };
    if (address) {
      const p = document.createElement('p'); p.textContent = address;
      if (isHttps(mapLink)) {
        const a = document.createElement('a'); a.href = mapLink; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = 'Open in Maps'; a.style.display = 'inline-block'; a.style.marginTop = '6px'; a.style.color = 'var(--mustard)'; a.style.fontWeight = '700';
        const wrap = document.createElement('div'); wrap.appendChild(p); wrap.appendChild(a); info.appendChild(row('i-pin', 'Where to find us', wrap));
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

  /* ---------- header: scrolled state, mobile drawer ---------- */
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
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', '');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setDrawer(burger.getAttribute('aria-expanded') !== 'true'));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setDrawer(false); });

  /* ---------- scrollspy ---------- */
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

  /* ---------- menu: reveal + filter ---------- */
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
        const el = en.target;
        el.style.setProperty('--d', n++);
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    dishes.forEach(d => io.observe(d));
  } else {
    dishes.forEach(d => d.classList.add('in'));
  }

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
      void grid.offsetWidth; // restart the entrance transition
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

  /* ---------- hero spice parallax ---------- */
  if (!reduce) {
    const spices = $$('[data-speed]');
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.3) {
        spices.forEach(s => {
          const sp = parseFloat(s.dataset.speed) || 0;
          const rot = parseFloat(s.dataset.rot) || 0;
          s.style.transform = 'translate3d(0,' + (-y * sp).toFixed(1) + 'px,0) rotate(' + (y * rot).toFixed(1) + 'deg)';
        });
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  }
})();
