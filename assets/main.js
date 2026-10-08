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
const desktop = window.matchMedia('(min-width: 821px)');
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
