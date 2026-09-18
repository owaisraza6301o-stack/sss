(function(){
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis smooth scroll ---------- */
try{
  if(window.Lenis && !reduceMotion){
    var lenis = new Lenis({ lerp:0.1, smoothWheel:true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if(window.ScrollTrigger){ lenis.on('scroll', ScrollTrigger.update); }
  }
}catch(e){}

if(window.gsap && window.ScrollTrigger){ gsap.registerPlugin(ScrollTrigger); }

/* ---------- tone placeholder generator ---------- */
function tone(i){
  var p = ['linear-gradient(135deg,#1c1e22,#08090b 70%)','linear-gradient(150deg,#191b1e,#050506 65%)',
    'linear-gradient(120deg,#20221f,#08090b 70%)','linear-gradient(160deg,#22201e,#08090b 65%)',
    'radial-gradient(circle at 30% 20%,#24262a,#08090b 70%)','linear-gradient(145deg,#1a1c20,#050506 70%)'];
  return p[i % p.length];
}

/* ---------- loader ---------- */
var pctEl = document.getElementById('loaderPct');
var fillEl = document.getElementById('loaderFill');
var steps = [0,18,42,67,89,100];
var si = 0;
function stepLoader(){
  if(si >= steps.length){
    var loader = document.getElementById('loader');
    loader.classList.add('split');
    setTimeout(function(){ loader.classList.add('hide'); }, 850);
    document.getElementById('heroTitle').classList.add('animate');
    document.getElementById('heroSub').classList.add('animate');
    document.getElementById('heroCtas').classList.add('animate');
    return;
  }
  var v = steps[si];
  pctEl.textContent = (v<10?'0':'')+v+'%';
  fillEl.style.width = v+'%';
  si++;
  setTimeout(stepLoader, 260);
}
setTimeout(stepLoader, 250);

/* ---------- custom cursor ---------- */
var cursor = document.getElementById('cursor');
window.addEventListener('mousemove', function(e){
  cursor.style.left = e.clientX+'px'; cursor.style.top = e.clientY+'px';
  movePeek(e.clientX, e.clientY);
});
document.addEventListener('mouseover', function(e){
  var t = e.target.closest('a,button,.frame-item,.peek-trigger,.reel-play');
  if(!t) return;
  var label = '';
  if(t.tagName==='A') label = t.hasAttribute('target') ? 'OPEN' : 'GO →';
  if(t.classList.contains('frame-item')) label = 'VIEW';
  if(t.classList.contains('reel-play')) label = 'PLAY';
  if(t.classList.contains('nav-cta')||t.classList.contains('btn-primary')||t.classList.contains('submit-btn')||t.classList.contains('footer-cta')) label = 'GO →';
  cursor.classList.toggle('grow', !!label);
  cursor.setAttribute('data-label', label);
});
document.addEventListener('mouseout', function(e){
  var t = e.target.closest('a,button,.frame-item,.peek-trigger,.reel-play');
  if(!t) return;
  cursor.classList.remove('grow'); cursor.setAttribute('data-label','');
});

/* ---------- cursor image peek for services ---------- */
var peek = document.getElementById('cursorPeek');
var peekVisual = document.getElementById('peekVisual');
var peekTag = document.getElementById('peekTag');
var peekTones = {photography:0, videography:1, reels:2, editing:3, concepts:4, website:5, digital:0, advertising:1};
var peekLabels = {photography:'Portrait reference', videography:'Filmmaking reference', reels:'Short-form reference', editing:'Post-production reference', concepts:'Moodboard reference', website:'Device mockup reference', digital:'Digital setup reference', advertising:'Campaign reference'};
var activePeek = null;
document.querySelectorAll('.service-row').forEach(function(row){
  row.addEventListener('mouseenter', function(){
    var key = row.getAttribute('data-peek');
    activePeek = key;
    peekVisual.style.background = tone(peekTones[key]||0);
    peekTag.textContent = peekLabels[key] || 'Visual reference';
    peek.classList.add('show');
    document.querySelectorAll('.service-row').forEach(function(r){ r.classList.remove('active'); });
    row.classList.add('active');
  });
  row.addEventListener('mouseleave', function(){ peek.classList.remove('show'); activePeek=null; });
});
function movePeek(x,y){ if(activePeek){ peek.style.left = x+'px'; peek.style.top = y+'px'; } }

/* ---------- magnetic buttons ---------- */
document.querySelectorAll('.magnetic').forEach(function(btn){
  btn.addEventListener('mousemove', function(e){
    var r = btn.getBoundingClientRect();
    var mx = e.clientX - (r.left + r.width/2);
    var my = e.clientY - (r.top + r.height/2);
    btn.style.transform = 'translate('+(mx*0.25)+'px,'+(my*0.3)+'px)';
  });
  btn.addEventListener('mouseleave', function(){ btn.style.transform = 'translate(0,0)'; btn.style.transition='transform .4s cubic-bezier(.16,.84,.24,1)'; });
  btn.addEventListener('mouseenter', function(){ btn.style.transition='transform .1s'; });
});

/* ---------- nav scroll state + mobile menu ---------- */
var nav = document.getElementById('nav');
window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 40); }, {passive:true});
var burger = document.getElementById('burger'); var mmenu = document.getElementById('mmenu');
burger.addEventListener('click', function(){ mmenu.classList.toggle('open'); });
mmenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mmenu.classList.remove('open'); }); });

/* ---------- hero parallax + HUD timecode ---------- */
var heroLines = document.getElementById('heroLines');
window.addEventListener('scroll', function(){
  var y = window.scrollY;
  if(y < window.innerHeight){ heroLines.style.transform = 'translateY('+(y*0.15)+'px)'; }
},{passive:true});
var frame = 0;
setInterval(function(){
  frame++;
  var h = String(Math.floor(frame/216000)%24).padStart(2,'0');
  var m = String(Math.floor(frame/3600)%60).padStart(2,'0');
  var s = String(Math.floor(frame/60)%60).padStart(2,'0');
  var f = String(frame%60).padStart(2,'0');
  document.getElementById('hudTc').textContent = h+':'+m+':'+s+':'+f;
}, 500);

/* ---------- reveal + split-text on scroll ---------- */
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(en){ if(en.isIntersecting) en.target.classList.add('in'); });
},{threshold:0.2});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

/* ---------- services: hover already toggles active via mouseenter above ---------- */

/* ---------- horizontal pinned concept scroll (GSAP) ---------- */
if(window.gsap && window.ScrollTrigger){
  var stages = gsap.utils.toArray('.concept-stage');
  var stagesWrap = document.getElementById('conceptStages');
  gsap.to(stagesWrap, {
    x: () => -(stagesWrap.scrollWidth - window.innerWidth),
    ease:'none',
    scrollTrigger:{
      trigger: '.concept-track',
      start:'top top',
      pin:true,
      scrub:1,
      end: () => '+=' + (stagesWrap.scrollWidth - window.innerWidth)
    }
  });
} else {
  document.getElementById('conceptTrack').style.height = 'auto';
  document.getElementById('conceptStages').style.flexDirection = 'column';
  document.getElementById('conceptStages').style.width = '100%';
}

/* build stage cycling text */
var buildStages = ['WIREFRAME','DESIGN','CODE','LAUNCH'];
var bi = 0;
setInterval(function(){
  bi = (bi+1)%buildStages.length;
  var el = document.getElementById('browserStage');
  if(el){ el.style.opacity = 0; setTimeout(function(){ el.textContent = buildStages[bi]; el.style.opacity = 1; },300); }
}, 1600);

/* ---------- portfolio ---------- */
var projects = [
  {title:'Nightframe', cat:'film', catLabel:'FILM', year:'2026', size:'wide tall', desc:'A brand film shot across three nights in the old city.'},
  {title:'Marigold', cat:'photography', catLabel:'PHOTOGRAPHY', year:'2025', size:'', desc:'Editorial portraits for a Hyderabad fashion label.'},
  {title:'Loopwork', cat:'reels', catLabel:'REELS', year:'2026', size:'narrow', desc:'A six-part reel series built around a single product drop.'},
  {title:'Afterglow', cat:'editing', catLabel:'EDITING', year:'2025', size:'', desc:'Color and pacing work on a wedding feature film.'},
  {title:'Signal', cat:'brand', catLabel:'BRAND', year:'2026', size:'wide short', desc:'Visual identity and launch content for a D2C studio.'},
  {title:'Paperplane', cat:'digital', catLabel:'DIGITAL', year:'2025', size:'narrow', desc:'Website and digital rollout for a travel content brand.'},
  {title:'Groundwork', cat:'photography', catLabel:'PHOTOGRAPHY', year:'2026', size:'tall', desc:'Product photography for a home goods launch.'},
  {title:'Slipstream', cat:'film', catLabel:'FILM', year:'2025', size:'short', desc:'Promotional film for a motorcycle touring brand.'},
];
var grid = document.getElementById('frameGrid');
projects.forEach(function(p,i){
  var el = document.createElement('div');
  el.className = 'frame-item '+p.size;
  el.setAttribute('data-cat', p.cat);
  el.setAttribute('tabindex','0');
  el.setAttribute('role','button');
  el.setAttribute('aria-label', 'View project: '+p.title);
  el.innerHTML = '<div class="frame-visual" style="background:'+tone(i)+'"></div>'+
    '<div class="frame-cat-tag">'+p.catLabel+'</div>'+
    '<div class="frame-meta"><div class="fm-left"><h4>'+p.title+'</h4><span>'+p.catLabel+' — '+p.year+'</span></div><div class="fm-right">VIEW PROJECT →</div></div>';
  el.addEventListener('click', function(){ openViewer(p,i); });
  el.addEventListener('keydown', function(e){ if(e.key==='Enter') openViewer(p,i); });
  grid.appendChild(el);
});
document.querySelectorAll('.filter-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    var f = btn.getAttribute('data-filter');
    document.querySelectorAll('.frame-item').forEach(function(item){
      item.setAttribute('data-hidden', (f==='all' || item.getAttribute('data-cat')===f) ? 'false' : 'true');
    });
  });
});
var viewer = document.getElementById('viewer');
function openViewer(p,i){
  document.getElementById('viewerVisual').style.background = tone(i);
  document.getElementById('viewerTitle').textContent = p.title;
  document.getElementById('viewerSub').textContent = p.catLabel+' — '+p.year;
  document.getElementById('viewerDesc').textContent = p.desc;
  viewer.classList.add('open');
}
document.getElementById('viewerClose').addEventListener('click', function(){ viewer.classList.remove('open'); });
viewer.addEventListener('click', function(e){ if(e.target===viewer) viewer.classList.remove('open'); });

/* ---------- featured parallax ---------- */
var featuredBg = document.getElementById('featuredBg');
var featuredSection = document.querySelector('.featured');
window.addEventListener('scroll', function(){
  var rect = featuredSection.getBoundingClientRect();
  if(rect.top < window.innerHeight && rect.bottom > 0){
    var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    featuredBg.style.transform = 'translateX('+((progress-0.5)*40)+'px) translateY('+((progress-0.5)*20)+'px)';
  }
},{passive:true});

/* ---------- showreel play/pause ---------- */
var reelStrip = document.getElementById('reelStrip');
var reelPlay = document.getElementById('reelPlay');
var playing = true;
reelPlay.addEventListener('click', function(){
  playing = !playing;
  reelStrip.classList.toggle('paused', !playing);
  reelPlay.textContent = playing ? 'PLAY REEL →' : 'PAUSED — RESUME →';
  reelPlay.setAttribute('aria-pressed', playing);
});

/* ---------- before/after slider ---------- */
var baFrame = document.getElementById('baFrame');
var baFinal = baFrame.querySelector('.ba-final');
var baHandle = document.getElementById('baHandle');
var dragging = false;
function setBA(clientX){
  var r = baFrame.getBoundingClientRect();
  var pct = Math.min(Math.max((clientX - r.left) / r.width, 0), 1) * 100;
  baFinal.style.clipPath = 'inset(0 0 0 '+pct+'%)';
  baHandle.style.left = pct+'%';
}
baFrame.addEventListener('pointerdown', function(e){ dragging = true; setBA(e.clientX); });
window.addEventListener('pointermove', function(e){ if(dragging) setBA(e.clientX); });
window.addEventListener('pointerup', function(){ dragging = false; });

/* ---------- moodboard: chaos -> direction (GSAP scrub) ---------- */
if(window.gsap && window.ScrollTrigger){
  document.querySelectorAll('.mood-item').forEach(function(item, idx){
    var x1 = 10 + (idx%4)*22 + '%';
    var y1 = 15 + Math.floor(idx/4)*38 + '%';
    gsap.set(item, {left:item.dataset.x0, top:item.dataset.y0, rotation: idx%2===0 ? -6:5});
    gsap.to(item, {
      left:x1, top:y1, rotation:0, ease:'none',
      scrollTrigger:{ trigger:'.mood', start:'top bottom', end:'bottom top', scrub:1 }
    });
  });
}

/* ---------- social + hyd strips ---------- */
var socialStrip = document.getElementById('socialStrip');
['Photography','Behind the Scenes','Reels','Creative Work','Photography','Reels','Behind the Scenes','Creative Work'].forEach(function(tag,i){
  var t = document.createElement('div'); t.className='social-tile';
  t.innerHTML = '<div class="tile-visual" style="position:absolute;inset:0;background:'+tone(i+2)+'"></div><div class="tile-grain"></div><div class="stag">'+tag+'</div>';
  socialStrip.appendChild(t);
});

/* ---------- contact chips + submit ---------- */
document.querySelectorAll('#needChips .chip').forEach(function(chip){ chip.addEventListener('click', function(){ chip.classList.toggle('on'); }); });
document.getElementById('briefForm').addEventListener('submit', function(e){
  e.preventDefault();
  var note = document.getElementById('formNote');
  note.textContent = 'BRIEF RECEIVED. LET\'S BUILD THE FRAME.';
  note.classList.add('received');
});

})();