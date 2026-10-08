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

