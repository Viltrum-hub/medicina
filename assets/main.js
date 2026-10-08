'use strict';
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
const desktop = window.matchMedia('(min-width: 851px)');
desktop.addEventListener('change', closeMenu);
const filter = document.querySelector('#metric-filter');
if (filter) {
  filter.addEventListener('change', () => {
    document.querySelectorAll('[data-metric]').forEach((item) => {
      item.hidden = filter.value !== 'all' && item.dataset.metric !== filter.value;
    });
    const label = filter.options[filter.selectedIndex].text;
    document.querySelector('#filter-status').textContent = filter.value === 'all'
      ? 'Se muestran los tres criterios disponibles.'
      : `Se muestra el criterio: ${label}.`;
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const progress = document.querySelector('.reading-progress');
let progressPending = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${range > 0 ? Math.min(100, window.scrollY / range * 100) : 0}%`;
  progressPending = false;
}
window.addEventListener('scroll', () => {
  if (!progressPending) {
    progressPending = true;
    window.requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  for (const item of document.querySelectorAll('.content > .section, .route .row, .next-page')) {
    item.classList.add('reveal');
    if (item.getBoundingClientRect().top > window.innerHeight) item.classList.add('reveal-pending');
    observer.observe(item);
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      observer.disconnect();
      document.querySelectorAll('.reveal-pending').forEach((item) => item.classList.remove('reveal-pending'));
    }
  });
}


const particleCanvas = document.querySelector('.particle-field');
if (particleCanvas) {
  const context = particleCanvas.getContext('2d');
  if (context) {
    let particles = [];
    let frame = 0;
    let lastPaint = 0;
    let fieldWidth = 0;
    let fieldHeight = 0;
    function resizeField() {
      fieldWidth = window.innerWidth;
      fieldHeight = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      particleCanvas.width = Math.round(fieldWidth * ratio);
      particleCanvas.height = Math.round(fieldHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = fieldWidth < 600 ? 24 : Math.min(65, Math.round(fieldWidth / 22));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * fieldWidth,
        y: Math.random() * fieldHeight,
        size: 0.7 + Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.3,
        speed: 0.04 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2
      }));
    }
    function paintField(time) {
      if (document.hidden || reducedMotion.matches) {
        frame = 0;
        context.clearRect(0, 0, fieldWidth, fieldHeight);
        return;
      }
      if (time - lastPaint > 32) {
        context.clearRect(0, 0, fieldWidth, fieldHeight);
        for (const particle of particles) {
          particle.y -= particle.speed;
          particle.x += Math.sin(time / 6500 + particle.phase) * 0.06;
          if (particle.y < -5) particle.y = fieldHeight + 5;
          if (particle.x < -5) particle.x = fieldWidth + 5;
          if (particle.x > fieldWidth + 5) particle.x = -5;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          context.fillStyle = `rgba(39, 106, 66, ${particle.opacity})`;
          context.fill();
        }
        lastPaint = time;
      }
      frame = window.requestAnimationFrame(paintField);
    }
    function syncField() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (!document.hidden && !reducedMotion.matches) frame = window.requestAnimationFrame(paintField);
      else context.clearRect(0, 0, fieldWidth, fieldHeight);
    }
    window.addEventListener('resize', resizeField, { passive: true });
    document.addEventListener('visibilitychange', syncField);
    reducedMotion.addEventListener('change', syncField);
    resizeField();
    syncField();
  }
}
