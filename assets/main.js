'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
if (menu && nav) {
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.focus(); } });
}
const panels = [...document.querySelectorAll('.gallery-panel')];
function activatePanel(index) {
  panels.forEach((panel, i) => {
    const active = i === index;
    panel.classList.toggle('is-active', active);
    panel.querySelector('.panel-trigger').setAttribute('aria-expanded', String(active));
  });
}
panels.forEach((panel, i) => {
  const trigger = panel.querySelector('.panel-trigger');
  trigger.addEventListener('click', () => activatePanel(i));
  trigger.addEventListener('keydown', event => {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      let next = event.key === 'Home' ? 0 : event.key === 'End' ? panels.length - 1 : (i + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + panels.length) % panels.length;
      activatePanel(next); panels[next].querySelector('.panel-trigger').focus();
    }
  });
});
const filter = document.querySelector('#result-filter');
if (filter) filter.addEventListener('change', () => {
  const cards = [...document.querySelectorAll('[data-metric]')];
  cards.forEach(card => { card.hidden = filter.value !== 'all' && card.dataset.metric !== filter.value; });
  document.querySelector('#filter-status').textContent = filter.value === 'all' ? 'Se muestran los tres indicadores.' : `Se muestra: ${filter.options[filter.selectedIndex].text}.`;
});
const progress = document.querySelector('.reading-progress');
let scrollPending = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${total > 0 ? Math.min(100, window.scrollY / total * 100) : 0}%`;
  scrollPending = false;
}
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); } }, {passive:true});
window.addEventListener('resize', updateProgress); updateProgress();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.querySelector('#particles');
if (canvas && !reduced.matches && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  let dots = [], width = 0, height = 0, frame = 0, previous = 0;
  const resize = () => {
    width = innerWidth; height = innerHeight; const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    dots = Array.from({length:width < 760 ? 18 : 42}, () => ({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.2+.4,v:Math.random()*.18+.06,a:Math.random()*.24+.08}));
  };
  const draw = now => {
    if (document.hidden || reduced.matches) { frame = 0; return; }
    if (now - previous > 32) {
      const dt = Math.min((now - previous) / 16.67, 3); previous = now; ctx.clearRect(0,0,width,height);
      dots.forEach(dot => { dot.y -= dot.v * dt; if (dot.y < -3) dot.y = height + 3; ctx.beginPath();ctx.arc(dot.x,dot.y,dot.r,0,Math.PI*2);ctx.fillStyle=`rgba(213,191,149,${dot.a})`;ctx.fill(); });
    }
    frame = requestAnimationFrame(draw);
  };
  const resume = () => { if (!document.hidden && !reduced.matches && !frame) { previous = performance.now(); frame = requestAnimationFrame(draw); } };
  window.addEventListener('resize', resize); document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', () => { if (reduced.matches) { cancelAnimationFrame(frame);frame=0;ctx.clearRect(0,0,width,height); } else resume(); });
  resize();resume();
}
