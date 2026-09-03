
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.querySelector('.nav-toggle'); const nav=document.querySelector('.site-header nav');
  if(btn&&nav){btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(o));}); nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}));}
  const y=document.getElementById('year'); if(y)y.textContent=new Date().getFullYear();
  const els=[...document.querySelectorAll('[data-reveal]')];
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08});els.forEach(el=>io.observe(el));}else els.forEach(el=>el.classList.add('is-visible'));
});
