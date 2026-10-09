'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
if (menu && nav) {
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.focus(); } });
}
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
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, frame = 0, previous = 0, points = [], dust = [];
  const waves = [{left:-.06,span:.56,y:.63,amplitude:.15,phase:0},{left:.61,span:.48,y:.26,amplitude:.12,phase:2.4},{left:.2,span:.79,y:.9,amplitude:.12,phase:4.7}];
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1,2);
    canvas.width = width*dpr; canvas.height = height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    points = [];
    const count = width < 760 ? 150 : 420;
    waves.forEach((wave,index) => { for (let i=0;i<count;i++) points.push({wave:index,u:Math.random(),spread:(Math.random()-.5)*.085,r:Math.random()<.035?Math.random()*2+1.6:Math.random()*1+.25,alpha:Math.random()*.58+.17,phase:Math.random()*6.28}); });
    points.sort((a,b)=>a.wave-b.wave||a.u-b.u);
    dust = Array.from({length:width<760?20:55},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.7+.5,a:Math.random()*.23+.05}));
    render(performance.now());
  }
  function render(now) {
    const t = reduced.matches ? 0 : now*.00014;
    ctx.clearRect(0,0,width,height);
    let last = null;
    points.forEach(point => {
      const wave = waves[point.wave];
      const x=(wave.left+point.u*wave.span)*width;
      const y=(wave.y+Math.sin(point.u*6.2+wave.phase+t)*wave.amplitude+point.spread*Math.sin(point.u*3.14))*height;
      if(last && last.wave===point.wave && Math.abs(y-last.y)<34 && x-last.x<26) {ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(x,y);ctx.strokeStyle='rgba(223,94,146,.23)';ctx.lineWidth=.55;ctx.stroke();}
      const alpha=point.alpha*(.78+.22*Math.sin(t*2+point.phase));
      ctx.beginPath();ctx.arc(x,y,point.r,0,Math.PI*2);ctx.fillStyle=`rgba(236,114,160,${alpha})`;ctx.fill();
      if(point.r>1.6){const glow=ctx.createRadialGradient(x,y,0,x,y,point.r*5);glow.addColorStop(0,`rgba(243,132,178,${alpha*.35})`);glow.addColorStop(1,'rgba(243,132,178,0)');ctx.fillStyle=glow;ctx.fillRect(x-point.r*5,y-point.r*5,point.r*10,point.r*10);}
      last={x,y,wave:point.wave};
    });
    dust.forEach(dot=>{ctx.beginPath();ctx.arc(dot.x,dot.y,dot.r,0,Math.PI*2);ctx.fillStyle=`rgba(244,146,182,${dot.a})`;ctx.fill();});
  }
  function draw(now) {
    if (document.hidden || reduced.matches) {frame=0;return;}
    if(now-previous>40){render(now);previous=now;}
    frame=requestAnimationFrame(draw);
  }
  function resume(){if(!document.hidden&&!reduced.matches&&!frame){previous=performance.now();frame=requestAnimationFrame(draw);}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();});
  window.addEventListener('resize',resize);
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;render(performance.now());resume();});
  resize();resume();
}
