'use strict';
(() => {
  const data = window.SUPP_DATA;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dino = v => v == null ? '—' : (v / 100).toFixed(4);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const nav = $('#navigation');
  const updateNav = () => nav.classList.toggle('scrolled', scrollY > 70);
  addEventListener('scroll', updateNav, {passive:true}); updateNav();
  $('#menu-button').addEventListener('click', () => {
    const expanded = $('#menu-button').getAttribute('aria-expanded') !== 'true';
    $('#menu-button').setAttribute('aria-expanded', expanded); $('#nav-links').classList.toggle('open', expanded);
  });
  $$('#nav-links a').forEach(a => a.addEventListener('click', () => {$('#nav-links').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');}));
  const sectionObserver = new IntersectionObserver(entries => { entries.forEach(e => {if(e.isIntersecting) $$('#nav-links a').forEach(a => a.classList.toggle('active',a.hash === `#${e.target.id}`));}); }, {rootMargin:'-15% 0px -60% 0px'});
  $$('main>section[id]').forEach(s => sectionObserver.observe(s));

  // Muted background videos load only when visible; reduced motion defaults to still posters.
  const heroVideos = $$('.hero-mosaic video');
  let heroPlaying = !motion.matches, heroVisible = true;
  function heroPlayback() {
    heroVideos.forEach(v => {
      if(heroPlaying && heroVisible && !document.hidden) {if(!v.getAttribute('src'))v.src=v.dataset.src;v.play().catch(()=>{});} else v.pause();
    });
    $('#hero-motion').textContent = heroPlaying ? 'Pause background' : 'Play background';
    $('#hero-motion').setAttribute('aria-pressed',heroPlaying);
  }
  new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;heroPlayback();},{threshold:.08}).observe($('#top'));
  $('#hero-motion').onclick=()=>{heroPlaying=!heroPlaying;heroPlayback();};

  motion.addEventListener('change',e=>{if(e.matches){heroPlaying=false;heroPlayback();}});

  // Manuscript main table; preserve original package values, convert DINO only for display.
  const results=data.mainTable.filter(r=>r.method!=='Random');
  const color=r=>r.method.includes('DeCoPrune–HS')?'#208f7c':r.method.includes('DeCoPrune')?'#2b5ccb':r.method==='FullKV'?'#172c43':'#98a3b3';
  $('#results-table tbody').innerHTML=results.map((r,i)=>`<tr data-result-row="${i}" class="${r.method.includes('DeCoPrune')?'ours-row':''}"><td><button class="method-select" data-result="${i}">${escape(r.method)}</button></td><td>${dino(r.dino)}</td><td>${r.pr.toFixed(2)}%</td><td>${r.fps.toFixed(3)}</td><td>${r.speedup}</td><td>${r.flicker.toFixed(4)}</td><td>${r.smooth.toFixed(4)}</td><td>${r.aesthetic.toFixed(4)}</td><td>${r.image.toFixed(4)}</td></tr>`).join('');
  const svg=$('#results-chart'),NS='http://www.w3.org/2000/svg';
  function el(name,attrs,text){const node=document.createElementNS(NS,name);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));if(text)node.textContent=text;svg.append(node);return node;}
  const sx=v=>70+(v-1)/5.5*630,sy=v=>330-(v-.42)/.29*270;
  [.45,.5,.55,.6,.65,.7].forEach(v=>{el('line',{x1:70,x2:710,y1:sy(v),y2:sy(v),class:'gridline'});el('text',{x:55,y:sy(v)+4,'text-anchor':'end',class:'chart-axis'},v.toFixed(2));});
  [1,2,3,4,5,6].forEach(v=>el('text',{x:sx(v),y:356,'text-anchor':'middle',class:'chart-axis'},v+'×'));
  el('text',{x:70,y:29,class:'chart-label'},'DINO consistency ↑');el('text',{x:710,y:389,'text-anchor':'end',class:'chart-label'},'Speedup over FullKV →');
  const offsets=[[14,-12],[-12,-13],[12,23],[12,-12],[12,21],[15,-1],[15,-24]];
  results.forEach((r,i)=>{
    const x=sx(parseFloat(r.speedup)),y=sy(r.dino/100),group=el('g',{class:'chart-dot','data-result':i,tabindex:0,role:'button','aria-label':`${r.method}: DINO ${dino(r.dino)}, ${r.speedup} speedup`});
    const circle=document.createElementNS(NS,'circle');Object.entries({cx:x,cy:y,r:6,fill:color(r),stroke:color(r)+'30','stroke-width':10}).forEach(([k,v])=>circle.setAttribute(k,v));group.append(circle);
    const label=document.createElementNS(NS,'text');Object.entries({x:x+offsets[i][0],y:y+offsets[i][1],'text-anchor':i===1?'end':'start'}).forEach(([k,v])=>label.setAttribute(k,v));label.textContent=r.method.replace(' (ours)','');group.append(label);
  });
  function selectResult(index){const r=results[index];$('#result-name').textContent=r.method.replace(' (ours)','');$('#result-values').innerHTML=[['DINO',dino(r.dino)],['Pruning ratio',r.pr.toFixed(2)+'%'],['Throughput',r.fps.toFixed(3)+' FPS'],['Speedup',r.speedup]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');$('#result-note').textContent=r.method==='FullKV'?'Uncompressed reference. FullKV retains the complete attention context.':r.method.includes('DeCoPrune–HS')?'Head-specialized variant. A 0.0020 DINO gap to FullKV at 86.19% pruning.':r.method.includes('DeCoPrune')?'The denoising-consistency policy: near-FullKV recall with a smaller historical cache.':['Streaming','DummyForcing'].includes(r.method)?'Discards intermediate history; this is a different compression budget, not a matched-budget comparison.':'Historical-cache compression baseline from the manuscript’s main comparison.';$$('.chart-dot').forEach(n=>{n.classList.toggle('selected',Number(n.dataset.result)===index);n.setAttribute('aria-pressed',Number(n.dataset.result)===index);});$$('[data-result-row]').forEach(n=>n.classList.toggle('selected-row',Number(n.dataset.resultRow)===index));}
  $$('[data-result]').forEach(n=>{n.addEventListener('click',()=>selectResult(Number(n.dataset.result)));n.addEventListener('focus',()=>selectResult(Number(n.dataset.result)));if(n.tagName.toLowerCase()==='g')n.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();selectResult(Number(n.dataset.result));}});});selectResult(results.findIndex(r=>r.method==='DeCoPrune (ours)'));

  const byId=Object.fromEntries(data.cases.map(c=>[c.caseId,c]));
  const gallery=[...data.featured.map(id=>byId[id]),...data.appendix];
  const titles=['Rooftop ice flower','Volcano terrace','Lakeside shelter','Planetarium','Bar table'];
  const methodNames={gt:'Original · 10s',ours:'DeCoPrune',consistency_prune:'DeCoPrune',streaming:'Streaming',patchify:'TempDiff',patchification:'TempDiff',fullkv:'FullKV',forcingkv:'ForcingKV',dummy_forcing:'DummyForcing'};
  let caseIndex=0,videosPlaying=false,galleryVisible=false,playGeneration=0;
  const videos=()=>$$('#video-gallery video[data-comparison="true"]');
  const shortest=()=>Math.min(...videos().map(v=>v.duration).filter(d=>Number.isFinite(d)&&d>0));
  const clock=t=>`${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,'0')}`;
  function pauseVideos(){videosPlaying=false;playGeneration++;videos().forEach(v=>v.pause());$('#videos-play').textContent='Play comparisons';}
  function seekVideos(t){const duration=shortest();if(!Number.isFinite(duration))return;videos().forEach(v=>{if(v.readyState>0)v.currentTime=Math.min(t,duration-.02);});}
  async function playVideos(){const active=videos(),generation=++playGeneration;$('#gallery-status').textContent='Loading synchronized comparison…';const ready=await Promise.all(active.map(v=>new Promise(resolve=>{if(v.readyState>=2)return resolve(true);let timer;const done=ok=>{clearTimeout(timer);v.removeEventListener('loadeddata',loaded);v.removeEventListener('error',failed);resolve(ok);};const loaded=()=>done(true),failed=()=>done(false);v.addEventListener('loadeddata',loaded,{once:true});v.addEventListener('error',failed,{once:true});timer=setTimeout(()=>done(false),12000);v.preload='auto';v.load();})));if(generation!==playGeneration)return;if(ready.some(ok=>!ok)){$('#gallery-status').textContent='A comparison video could not load. Use its individual controls or retry playback.';return;}const duration=shortest();let start=active[0].currentTime;if(start>=duration-.12)start=0;seekVideos(start);const played=await Promise.all(active.map(v=>v.play().then(()=>true).catch(()=>false)));if(generation!==playGeneration){active.forEach(v=>v.pause());return;}if(played.some(ok=>!ok)){pauseVideos();$('#gallery-status').textContent='Your browser blocked group playback. Use the individual video controls.';return;}videosPlaying=true;$('#videos-play').textContent='Pause comparisons';$('#gallery-status').textContent='Synchronized by elapsed time; playback stops at the shortest clip. Case-level DINO is shown on a 0–1 scale.';}
  function renderGallery(index){
    pauseVideos();
    $$('#video-gallery video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});
    caseIndex=(index+gallery.length)%gallery.length;
    const c=gallery[caseIndex];
    $('#gallery-tabs').innerHTML=titles.map((title,i)=>`<button data-case="${i}" aria-pressed="${i===caseIndex}">${title}</button>`).join('');
    $$('[data-case]').forEach(b=>b.onclick=()=>renderGallery(Number(b.dataset.case)));
    $('#gallery-name').textContent=titles[caseIndex];$('#gallery-task').textContent=c.task;
    $('#gallery-target').textContent=c.galleryTarget||(c.target==='Real-scene evaluation'?'Real-scene continuation · original supplementary evaluation':c.target);
    $('#case-position').textContent=`${caseIndex+1} / ${gallery.length}`;
    const methods=['gt','fullkv',c.assets.ours?'ours':'consistency_prune','streaming',c.assets.patchify?'patchify':'patchification','forcingkv','dummy_forcing'];
    $('#video-gallery').innerHTML=methods.map(m=>{
      const original=m==='gt',src=c.assets[m],ours=['ours','consistency_prune'].includes(m),score=c.scores[m];
      const media=src?`<video data-method="${m}" data-comparison="${!original}" controls muted playsinline preload="metadata" poster="${src.replace('assets/','assets/posters/').replace('.mp4','.jpg')}" src="${src}" aria-label="${escape(titles[caseIndex]+' — '+methodNames[m])}"></video>`:`<div class="video-unavailable" role="note"><span>Video unavailable</span><p>This comparison asset could not be resolved.</p></div>`;
      const detail=original?'10 s · independent':!src?'Not available':score==null?'Score not reported':`DINO ${dino(score)}`;
      return `<article class="video-tile ${ours?'ours':''} ${original?'original':''} ${src?'':'missing'}" data-method-card="${m}">${media}<div class="video-label"><strong>${methodNames[m]}</strong><span>${detail}</span></div></article>`;
    }).join('');
    $('#video-progress').value=0;$('#video-time').textContent='0:00';
    $('#gallery-status').textContent='The 10-second original plays independently. All six method outputs synchronize by elapsed time. Scores are case-level, not three-seed averages.';
    $$('#video-gallery video').forEach(v=>v.addEventListener('error',()=>{$('#gallery-status').textContent='A local video is unavailable or unsupported by this browser.';}));
  }
  $('#case-prev').onclick=()=>renderGallery(caseIndex-1);$('#case-next').onclick=()=>renderGallery(caseIndex+1);$('#videos-play').onclick=()=>videosPlaying?pauseVideos():playVideos();$('#videos-reset').onclick=()=>{pauseVideos();seekVideos(0);$('#video-progress').value=0;$('#video-time').textContent='0:00';};$('#video-progress').addEventListener('input',e=>{pauseVideos();const d=shortest();if(Number.isFinite(d)){const t=Number(e.target.value)/1000*d;seekVideos(t);$('#video-time').textContent=clock(t);}});
  new IntersectionObserver(entries=>{galleryVisible=entries[0].isIntersecting;if(!galleryVisible){pauseVideos();$$('#video-gallery video').forEach(v=>v.pause());}},{threshold:.02}).observe($('#video-gallery'));
  setInterval(()=>{const all=videos(),master=all[0];if(!master||!galleryVisible)return;const duration=shortest();if(Number.isFinite(duration)){$('#video-progress').value=Math.min(1000,master.currentTime/duration*1000);$('#video-time').textContent=clock(master.currentTime);}if(videosPlaying){if(master.currentTime>=duration-.12||all.some(v=>v.ended)){pauseVideos();return;}all.slice(1).forEach(v=>{if(Math.abs(v.currentTime-master.currentTime)>.18)v.currentTime=master.currentTime;});}},180);
  addEventListener('visibilitychange',()=>{heroPlayback();if(document.hidden){pauseVideos();$$('#video-gallery video').forEach(v=>v.pause());}});
  $('#video-gallery').addEventListener('pause',event=>{if(videosPlaying&&event.target.dataset.comparison==='true')pauseVideos();},true);
  renderGallery(0);

})();
