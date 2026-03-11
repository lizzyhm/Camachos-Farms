/* ============================================
   La Alpaca Farm — Interactive JS
   ============================================ */

// ── Theme Toggle ─────────────────────────────
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let dark = matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;

  if (toggle) {
    toggle.innerHTML = dark ? sunSvg : moonSvg;
    toggle.addEventListener('click', () => {
      dark = !dark;
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      toggle.innerHTML = dark ? sunSvg : moonSvg;
      toggle.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' mode');
    });
  }
})();

// ── Nav Scroll Behavior ───────────────────────
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastY = y;
  }, { passive: true });
})();

// ── Hero Parallax ─────────────────────────────
(function () {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  heroBg.style.transform = 'scale(1.05)';
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const offset = y * 0.3;
    heroBg.style.transform = `scale(1.05) translateY(${offset}px)`;
  }, { passive: true });
})();

// ── Mobile Nav ────────────────────────────────
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose && mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

// ── Interactive Event Calendar ────────────────
(function () {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Sample upcoming events
  const EVENTS = [
    { month: 2, day: 15, year: 2026, title: 'Peruvian Heritage Fiesta', time: '4:00 PM – 10:00 PM', type: 'Cultural Event', ticket: 'https://www.eventbrite.com', price: '$25' },
    { month: 2, day: 22, year: 2026, title: 'Spring Farm Open Day', time: '10:00 AM – 4:00 PM', type: 'Farm Visit', ticket: 'https://www.eventbrite.com', price: 'Free' },
    { month: 3, day: 5, year: 2026, title: 'Latin Music & Dance Night', time: '6:00 PM – 11:00 PM', type: 'Cultural Event', ticket: 'https://www.eventbrite.com', price: '$35' },
    { month: 3, day: 19, year: 2026, title: 'Alpaca Encounter Experience', time: '11:00 AM – 2:00 PM', type: 'Farm Event', ticket: 'https://www.eventbrite.com', price: '$20' },
    { month: 4, day: 12, year: 2026, title: 'Chilean Independence Celebration', time: '5:00 PM – 10:00 PM', type: 'Cultural Event', ticket: 'https://www.eventbrite.com', price: '$30' },
    { month: 4, day: 26, year: 2026, title: 'Spring Wedding Showcase', time: '2:00 PM – 6:00 PM', type: 'Wedding', ticket: 'https://www.eventbrite.com', price: 'Free' },
    { month: 5, day: 10, year: 2026, title: 'Mother\'s Day Farm Brunch', time: '11:00 AM – 3:00 PM', type: 'Special Event', ticket: 'https://www.eventbrite.com', price: '$45' },
  ];

  const grid = document.getElementById('calGrid');
  const monthYear = document.getElementById('calMonthYear');
  const prevBtn = document.getElementById('calPrev');
  const nextBtn = document.getElementById('calNext');
  const eventsList = document.getElementById('eventsList');

  if (!grid || !monthYear) return;

  const today = new Date();
  let viewMonth = today.getMonth(); // 0-indexed
  let viewYear = today.getFullYear();

  function getEventsForMonthYear(month, year) {
    return EVENTS.filter(e => e.month === month && e.year === year);
  }

  function renderCalendar(month, year) {
    monthYear.textContent = `${MONTHS[month]} ${year}`;
    grid.innerHTML = '';

    // Day name headers
    DAY_NAMES.forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal__day-name';
      el.textContent = d;
      grid.appendChild(el);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthEvents = getEventsForMonthYear(month, year);
    const eventDays = monthEvents.map(e => e.day);

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal__day cal__day--empty';
      el.setAttribute('aria-hidden', 'true');
      grid.appendChild(el);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'cal__day';
      el.textContent = d;
      el.setAttribute('role', 'gridcell');

      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvent = eventDays.includes(d);

      if (isToday) { el.classList.add('cal__day--today'); el.setAttribute('aria-current', 'date'); }
      if (hasEvent) {
        el.classList.add('cal__day--event');
        const evt = monthEvents.find(e => e.day === d);
        el.setAttribute('aria-label', `${d} ${MONTHS[month]} - ${evt.title}`);
        el.setAttribute('tabindex', '0');
        el.addEventListener('click', () => showEventDetail(evt));
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showEventDetail(evt); }});
      } else {
        el.setAttribute('aria-label', `${d} ${MONTHS[month]}`);
      }

      grid.appendChild(el);
    }

    renderUpcomingEvents();
  }

  function renderUpcomingEvents() {
    if (!eventsList) return;
    const now = new Date();
    const futureEvents = EVENTS
      .filter(e => new Date(e.year, e.month, e.day) >= now)
      .sort((a, b) => new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day))
      .slice(0, 4);

    if (futureEvents.length === 0) {
      eventsList.innerHTML = '<p style="color:var(--color-text-muted);font-size:var(--text-sm);">No upcoming public events at this time. Check back soon or contact us!</p>';
      return;
    }

    eventsList.innerHTML = futureEvents.map(evt => `
      <article class="upcoming-event">
        <div class="upcoming-event__date">
          <span class="upcoming-event__day">${evt.day}</span>
          <span class="upcoming-event__month">${MONTHS[evt.month].substring(0,3)}</span>
        </div>
        <div class="upcoming-event__info">
          <h4 class="upcoming-event__title">${evt.title}</h4>
          <div class="upcoming-event__meta">
            <span>🕐 ${evt.time}</span>
            <span>🎟 ${evt.type} · ${evt.price}</span>
          </div>
          <a href="${evt.ticket}" target="_blank" rel="noopener noreferrer" class="upcoming-event__link">
            Get Tickets
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </article>
    `).join('');
  }

  function showEventDetail(evt) {
    // Scroll to sidebar and highlight
    const sidebar = document.querySelector('.cal__events-sidebar');
    if (sidebar) {
      sidebar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  prevBtn.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar(viewMonth, viewYear);
  });

  nextBtn.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar(viewMonth, viewYear);
  });

  renderCalendar(viewMonth, viewYear);
})();

// ── Contact Form ──────────────────────────────
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Validate required fields
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--color-primary)';
        field.focus();
        valid = false;
      }
    });
    if (!valid) return;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setTimeout(() => {
      form.querySelectorAll('.form-input').forEach(el => el.value = '');
      success.style.display = 'block';
      submitBtn.style.display = 'none';
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });
})();

// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
