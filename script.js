/* ===========================
   SIDE SPRINT — SCRIPT.JS
   =========================== */

// ── NAV SCROLL EFFECT ──────────────────────────────────────────
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('nav-mobile');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ── MOBILE NAV ─────────────────────────────────────────────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMobile.classList.toggle('open');
  document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── COUNTER ANIMATION ──────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  const isText = isNaN(parseInt(target));
  if (isText) return;

  const start = 0;
  const end = parseInt(target);
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end;
  }

  requestAnimationFrame(update);
}

// Trigger counters when hero stats are visible
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNums.forEach(el => {
        const target = el.getAttribute('data-target');
        setTimeout(() => animateCounter(el, target), 200);
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── SCROLL REVEAL ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -60px 0px'
});

// Auto-add reveal class to key elements
const revealSelectors = [
  '.step',
  '.service-card',
  '.proof-card',
  '.testimonial',
  '.pricing-card',
  '.section-label',
  '.section-title',
  '.section-sub',
  '.compare-table',
  '.ai-left',
  '.cta-block',
  '.pricing-note',
  '.footer-col',
  '.footer-brand'
];

revealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (i < 3) el.classList.add(`reveal-delay-${i + 1}`);
    revealObserver.observe(el);
  });
});

// ── SMOOTH ANCHOR SCROLLING ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── CURSOR GLOW (DESKTOP ONLY) ─────────────────────────────────
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 998;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.06;
    glowY += (mouseY - glowY) * 0.06;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

// ── STAGGER CARD ANIMATIONS ────────────────────────────────────
function staggerObserve(selector, delay = 80) {
  const cards = document.querySelectorAll(selector);
  const parent = cards[0]?.parentElement;
  if (!parent) return;

  const parentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, i * delay);
        });
        parentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  parentObserver.observe(parent);
}

// Apply staggered animation groups
document.querySelectorAll('.step').forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.service-card').forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.proof-card').forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.pricing-card').forEach(el => el.classList.add('reveal'));

staggerObserve('.step', 100);
staggerObserve('.service-card', 80);
staggerObserve('.proof-card', 80);
staggerObserve('.pricing-card', 100);
staggerObserve('.testimonial', 100);

// ── ACTIVE NAV LINK HIGHLIGHTING ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--white)'
          : 'var(--muted)';
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── TICKER PAUSE ON HOVER ──────────────────────────────────────
const ticker = document.querySelector('.ticker');
if (ticker) {
  const tickerWrap = ticker.parentElement;
  tickerWrap.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });
  tickerWrap.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}

// ── INIT ───────────────────────────────────────────────────────
console.log('%cSide Sprint', 'font-size:24px;font-weight:700;color:#fff;background:#000;padding:8px 16px;border-radius:6px;');
console.log('%cAI-powered execution. Built fast. Delivered faster.', 'color:#71717A;font-size:12px;font-family:monospace;');
