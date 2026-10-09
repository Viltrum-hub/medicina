'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
if (menu && nav) {
  nav.addEventListener('click', event => { if (event.target.closest('a')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); } });
  const mobileMenu = matchMedia('(max-width: 760px)');
  mobileMenu.addEventListener('change', () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); });
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.focus(); } });
}
const filter = document.querySelector('#result-filter');
if (filter) filter.addEventListener('change', () => {
  const cards = [...document.querySelectorAll('[data-metric]')];
  cards.forEach(card => { card.hidden = filter.value !== 'all' && card.dataset.group !== filter.value; });
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = `${count === 1 ? 'Se muestra 1 herramienta' : 'Se muestran ' + count + ' herramientas'}${filter.value === 'all' ? '' : ': ' + filter.options[filter.selectedIndex].text.toLowerCase()}.`;
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
  let width = 0, height = 0, frame = 0, previous = 0, grains = [], bokeh = [];
  const ribbons = [
    [[-.12,.55],[.2,.49],[.35,.9],[.73,.71]],
    [[.48,.82],[.73,.73],[.85,.58],[1.14,.43]],
    [[.26,.07],[.53,.3],[.77,.3],[1.14,.12]],
    [[.04,.9],[.39,.94],[.71,.76],[1.12,.94]]
  ];
  function curve(path,u){
    const v=1-u;
    return {x:(v*v*v*path[0][0]+3*v*v*u*path[1][0]+3*v*u*u*path[2][0]+u*u*u*path[3][0])*width,
      y:(v*v*v*path[0][1]+3*v*v*u*path[1][1]+3*v*u*u*path[2][1]+u*u*u*path[3][1])*height};
  }
  function position(grain,t){
    const p=curve(ribbons[grain.ribbon],grain.u);
    const next=curve(ribbons[grain.ribbon],Math.min(1,grain.u+.003));
    const angle=Math.atan2(next.y-p.y,next.x-p.x);
    const drift=Math.sin(grain.u*7+grain.phase+t)*9;
    return {x:p.x-Math.sin(angle)*(grain.spread+drift),y:p.y+Math.cos(angle)*(grain.spread+drift)};
  }
  function resize(){
    width=innerWidth;height=innerHeight;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=width<760?650:2350;
    grains=Array.from({length:count},()=>({ribbon:Math.floor(Math.random()*ribbons.length),u:Math.random(),
      spread:(Math.random()+Math.random()+Math.random()-1.5)*(width<760?42:66),
      r:Math.random()<.08?1.2+Math.random()*.65:.4+Math.random()*.85,
      alpha:.25+Math.random()*.68,phase:Math.random()*6.28,spark:Math.random()<.025}));
    bokeh=Array.from({length:width<760?24:68},()=>({x:Math.random()*width,y:Math.random()*height,
      r:2+Math.random()*5,alpha:.06+Math.random()*.16,phase:Math.random()*6.28}));
    render(performance.now());
  }
  function render(now){
    const t=reduced.matches?0:now*.000085;
    ctx.clearRect(0,0,width,height);
    // Fine luminous strands follow the dust ribbons.
    ribbons.forEach((path,index)=>{
      for(let strand=0;strand<2;strand++){
        ctx.beginPath();
        for(let i=0;i<=90;i++){
          const u=i/90,p=curve(path,u),offset=Math.sin(u*7+t+index)*6+strand*5;
          if(i===0)ctx.moveTo(p.x,p.y+offset);else ctx.lineTo(p.x,p.y+offset);
        }
        ctx.strokeStyle=`rgba(243,132,164,${strand===0?.18:.065})`;ctx.lineWidth=strand===0?.7:.45;ctx.stroke();
      }
    });
    bokeh.forEach(dot=>{
      const x=dot.x+Math.sin(t+dot.phase)*6,y=dot.y+Math.cos(t*.7+dot.phase)*5;
      const glow=ctx.createRadialGradient(x,y,0,x,y,dot.r*2);
      glow.addColorStop(0,`rgba(227,93,132,${dot.alpha})`);glow.addColorStop(.42,`rgba(238,114,154,${dot.alpha*.8})`);glow.addColorStop(1,'rgba(238,114,154,0)');
      ctx.fillStyle=glow;ctx.fillRect(x-dot.r*2,y-dot.r*2,dot.r*4,dot.r*4);
    });
    grains.forEach(grain=>{
      const p=position(grain,t),alpha=grain.alpha*(.75+.25*Math.sin(t+grain.phase));
      ctx.fillStyle=`rgba(${grain.spark?'255,200,210':'236,113,148'},${alpha})`;
      ctx.beginPath();ctx.arc(p.x,p.y,grain.r,0,Math.PI*2);ctx.fill();
      if(grain.spark){
        const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,6);
        glow.addColorStop(0,`rgba(255,188,206,${alpha*.45})`);glow.addColorStop(1,'rgba(255,150,187,0)');
        ctx.fillStyle=glow;ctx.fillRect(p.x-6,p.y-6,12,12);
        ctx.strokeStyle=`rgba(255,202,216,${alpha*.28})`;ctx.lineWidth=.5;
        ctx.beginPath();ctx.moveTo(p.x-3,p.y);ctx.lineTo(p.x+3,p.y);ctx.moveTo(p.x,p.y-3);ctx.lineTo(p.x,p.y+3);ctx.stroke();
      }
    });
  }
  function draw(now){
    if(document.hidden||reduced.matches){frame=0;return;}
    if(now-previous>40){render(now);previous=now;}
    frame=requestAnimationFrame(draw);
  }
  function resume(){if(!document.hidden&&!reduced.matches&&!frame){previous=performance.now();frame=requestAnimationFrame(draw);}}
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else resume();});
  window.addEventListener('resize',resize);
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;render(performance.now());resume();});
  resize();resume();
}
