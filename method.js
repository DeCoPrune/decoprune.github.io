'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const player = $('#method-player');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const NS = 'http://www.w3.org/2000/svg';
  // Display-space block means from discrepancy.png (12 × 12), sampled offline.
  // Brightness threshold is illustrative, NOT the model's latent-space gamma.
  const heatColors = [[251,249,188],[236,196,161],[197,111,129],[212,143,140],[237,220,178],[250,241,184],[251,252,191],[248,241,186],[226,168,152],[106,31,118],[170,110,141],[171,80,124],[251,252,191],[248,224,173],[219,148,144],[183,87,118],[214,146,142],[241,188,158],[251,247,186],[249,226,175],[230,208,174],[175,82,124],[81,23,112],[106,30,121],[251,252,191],[241,213,175],[226,137,126],[167,64,118],[157,69,131],[245,211,168],[251,246,185],[248,217,169],[162,65,116],[168,52,118],[137,39,122],[117,34,120],[251,252,191],[251,252,191],[251,230,172],[248,229,177],[231,191,167],[251,250,189],[251,252,191],[251,248,189],[144,51,115],[90,22,122],[129,36,125],[91,27,109],[251,252,191],[251,240,180],[247,185,147],[233,125,117],[223,140,133],[251,244,184],[244,229,179],[235,198,160],[175,84,123],[85,23,115],[110,30,126],[108,31,119],[251,252,191],[251,252,191],[251,248,188],[251,209,156],[220,185,169],[238,173,147],[191,90,121],[192,112,135],[68,20,109],[45,17,92],[51,17,96],[79,20,119],[251,252,191],[251,252,191],[249,206,157],[223,89,104],[188,79,124],[139,51,127],[156,78,131],[187,98,128],[136,41,118],[62,19,100],[49,17,93],[90,25,117],[251,252,191],[251,242,182],[249,196,144],[179,62,119],[201,100,122],[213,94,114],[211,110,126],[232,137,124],[166,80,128],[87,23,120],[77,20,118],[62,18,104],[252,239,178],[252,235,176],[250,199,146],[173,54,117],[137,40,124],[91,25,117],[195,83,119],[217,130,124],[172,85,138],[105,27,125],[102,26,125],[85,24,111],[251,231,174],[251,252,191],[249,218,166],[195,67,113],[179,78,129],[167,86,141],[212,143,150],[220,125,132],[199,101,124],[110,33,115],[168,51,120],[172,53,119],[251,252,191],[251,244,183],[250,226,171],[228,101,109],[249,224,170],[249,223,172],[251,217,161],[225,132,131],[206,83,108],[208,125,135],[223,160,153],[155,47,121],[251,252,191],[250,225,172],[250,227,172],[240,188,159],[251,252,191],[250,249,190],[237,217,175],[240,190,156],[252,206,152],[251,250,190],[249,231,175],[197,124,140]];
  const mask = heatColors.map(([r,g,b]) => (.2126*r+.7152*g+.0722*b)/255 > .60 ? 1 : 0);
  const lower={heatX:710,maskX:980,y:360,size:136};
  const side=12, total=mask.length, step=lower.size/side;
  const colors = {history:'#589bd6',current:'#eaa16e',keep:'#2b9d85',drop:'#faeeeb',idle:'#e2e8f1'};
  function rect(parent,x,y,size,fill,token) {
    const n=document.createElementNS(NS,'rect');
    Object.entries({x,y,width:size,height:size,rx:2,fill,...(token==null?{}:{'data-token':token})}).forEach(([k,v])=>n.setAttribute(k,v));
    $(parent).append(n);return n;
  }
  // The top strip shows representative tokens, all at one size and baseline.
  // IDs refer to actual cells of the full illustrative mask below, not extra tokens.
  const shownIds=[0,9,24,10,36,48,11,60],shownKept=shownIds.filter(i=>mask[i]);
  const tokenSize=16,tokenPitch=18,tokenY=121;
  function cacheToken(parent,x,fill,id){const n=rect(parent,x,tokenY,tokenSize,fill,id);n.setAttribute('stroke','#738195');n.setAttribute('stroke-width','.6');return n;}
  function ellipsis(parent,x){const n=document.createElementNS(NS,'text');n.setAttribute('x',x);n.setAttribute('y',tokenY+13);n.setAttribute('fill','#8390a0');n.setAttribute('font-size','16');n.textContent='…';$(parent).append(n);}
  for(let i=0;i<8;i++){
    cacheToken('#fm-history',48+i*tokenPitch+(i>=4?19:0),colors.history);
    cacheToken('#fm-chunk',260+i*tokenPitch,'#aeb1b7');
  }
  ellipsis('#fm-history',121);
  for(let i=0;i<6;i++)cacheToken('#fm-updated-history',954+i*tokenPitch+(i>=4?19:0),colors.history);
  ellipsis('#fm-updated-history',1027);
  const current=shownIds.map((id,i)=>cacheToken('#fm-current',440+i*tokenPitch,colors.current,id));
  const source=shownIds.map((id,i)=>cacheToken('#fm-gather-source',617+i*tokenPitch,colors.current,id));
  const sourceCrosses=shownIds.map((id,i)=>{const n=document.createElementNS(NS,'path');const x=617+i*tokenPitch+5,y=tokenY+5;n.setAttribute('d',`M${x} ${y}l6 6m0-6l-6 6`);n.setAttribute('stroke','#c57d73');n.setAttribute('stroke-width','1.3');n.setAttribute('stroke-linecap','round');$('#fm-gather-source').append(n);return n;});
  const output=shownKept.map((id,j)=>cacheToken('#fm-gather-output',797+j*tokenPitch,colors.keep,id));
  const updated=shownKept.map((id,j)=>cacheToken('#fm-updated-retained',1083+j*tokenPitch,colors.keep,id));
  const cells=mask.map((_,i)=>{
    const x=lower.maskX+(i%side)*step,y=lower.y+Math.floor(i/side)*step;
    const n=rect('#fm-mask-grid',x,y,step-1.2,colors.idle,i);
    const cross=document.createElementNS(NS,'path');cross.setAttribute('d',`M${x+4} ${y+4}l4.5 4.5m0-4.5l-4.5 4.5`);cross.setAttribute('stroke','#c57d73');cross.setAttribute('stroke-width','1');cross.setAttribute('stroke-linecap','round');$('#fm-mask-grid').append(cross);return {n,cross};
  });
  const phases = [
    [0,'Read historical context','The retained history conditions generation of the current chunk.'],
    [1.5,'Predict the current chunk','The gray current-chunk tokens feed the context-conditioned denoising trajectory through Predict.'],
    [4,'Cache the current KV','Probe and final clean predictions come from the same trajectory. Cache KV returns the corresponding keys and values to the orange current-KV tokens.'],
    [5.5,'Measure token-wise discrepancy','Compare the probe with the final prediction. The complete map fades in together; brighter regions indicate larger discrepancy.'],
    [8,'Build the retention mask','Follow the same spatial cells: bright regions turn green, while dark regions are pruned.'],
    [10,'Return the mask to the cache','The green connection carries mᵢ back to the matching KV rows in the online update.'],
    [11.5,'Gather the selected KV rows','After the recent-window delay, use the stored mask to gather the same rows from K and V.'],
    [13.5,'Update history for the next chunk','Append the retained KV to history. This smaller cache conditions the next chunk.']
  ];
  let time=motion.matches?15.99:0, playing=!motion.matches, visible=false, last=0, lastPhase=-1;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const rise=(start,duration=.5)=>ease((time-start)/duration);
  const windowed=(start,end,edge=.4)=>rise(start,edge)*(1-rise(end-edge,edge));
  const mix=(a,b,q)=>`rgb(${a.map((v,k)=>Math.round(v+(b[k]-v)*q)).join(',')})`;
  function opacity(selector,v){$(selector).setAttribute('opacity',v);}
  function packet(id,path,start,end){const progress=ease((time-start)/(end-start));const point=$(path).getPointAtLength($(path).getTotalLength()*progress);$(id).setAttribute('cx',point.x);$(id).setAttribute('cy',point.y);opacity(id,windowed(start,end,Math.min(.18,(end-start)/3)));}
  function render(){
    const phase=phases.findLastIndex(p=>time>=p[0]);
    player.dataset.phase=phase;
    const stage=phase<=2?0:phase===3?1:phase<=5?2:3;
    player.dataset.stage=stage;
    if(phase!==lastPhase){$('#method-phase-number').textContent=`${String(phase+1).padStart(2,'0')} / 08`;$('#method-phase-title').textContent=phases[phase][1];$('#method-phase-detail').textContent=phases[phase][2];lastPhase=phase;}
    $$('.fm-tabs button').forEach((b,i)=>b.setAttribute('aria-pressed',i===stage));
    const focusWeights={history:1-rise(1.3,.5),chunk:rise(1.3,.5)*(1-rise(3.8,.5)),current:rise(3.8,.5)*(1-rise(9.8,.5)),gather:rise(9.8,.5)*(1-rise(13.3,.5)),updated:rise(13.3,.5)};
    Object.entries(focusWeights).forEach(([name,weight])=>{$('#fm-focus-'+name).classList.remove('active');$('#fm-focus-'+name).style.opacity=weight;});
    opacity('#fm-history-flow',1-.7*rise(3.5));
    opacity('#fm-current-flow',.22+.78*rise(10));
    opacity('#fm-update-flow',.22+.78*rise(13.5));
    opacity('#fm-prediction-path',.18+.47*rise(1.5)+.35*windowed(1.5,4));
    opacity('#fm-kv-path',.18+.47*rise(4)+.35*windowed(4,5.5));
    opacity('#fm-mask-path',.18+.52*rise(10)+.3*windowed(10,11.5));
    packet('#fm-prediction-packet','#fm-prediction-path',1.5,2);
    packet('#fm-kv-packet','#fm-kv-path',4,5.5);
    packet('#fm-mask-packet','#fm-mask-path',10,11.5);
    const probe=rise(2,.85),final=rise(3,.85);
    opacity('#fm-noise-card',1-.35*rise(3.7,.8));
    opacity('#fm-probe-card',.22+.78*probe);opacity('#fm-final-card',.22+.78*final);
    $('#fm-probe-card').setAttribute('transform',`translate(0 ${3*(1-probe)})`);
    $('#fm-final-card').setAttribute('transform',`translate(0 ${3*(1-final)})`);
    const compare=windowed(4.8,7.8,.65);
    ['#fm-probe-card rect','#fm-final-card rect'].forEach(selector=>{
      $(selector).style.stroke=mix([197,210,230],[53,101,188],compare);
      $(selector).style.strokeWidth=1+1.1*compare;
    });
    opacity('#fm-denoise-a',.25+.75*rise(1.5));opacity('#fm-denoise-b',.25+.75*rise(2.5));
    $('#fm-denoise-a').setAttribute('stroke-dashoffset',-Math.min(1.5,Math.max(0,time-1.5))*9);
    $('#fm-denoise-b').setAttribute('stroke-dashoffset',-Math.min(1.5,Math.max(0,time-2.5))*9);
    opacity('#fm-compare-flow',.2+.8*rise(5.1,.6));opacity('#fm-threshold-flow',.2+.8*rise(7.6,.6));
    // One full-map reveal, softly eased. The clip geometry never changes.
    const heat=rise(5.5,1.05),scale=.985+.015*heat;
    opacity('#fm-heatmap',heat);
    const heatCx=lower.heatX+lower.size/2,heatCy=lower.y+lower.size/2;
    $('#fm-heatmap').setAttribute('transform',`translate(${heatCx} ${heatCy}) scale(${scale}) translate(${-heatCx} ${-heatCy})`);
    current.forEach((n,i)=>{const q=rise(4+(i/current.length)*.8,.55);n.setAttribute('opacity',.12+.88*q);n.setAttribute('transform',`translate(0 ${2.5*(1-q)})`);});
    $('#fm-generation-label').textContent=time<2?'Denoising trajectory':time<3?'Probe at τ*':'Probe + final available';
    cells.forEach(({n,cross},i)=>{
      const q=ease((time-8-i/total*1.3)/.28),target=mask[i]?[43,157,133]:[250,238,235];
      const mixed=heatColors[i].map((v,k)=>Math.round(v+(target[k]-v)*q));
      const seed=rise(7.15,.65);
      n.setAttribute('fill',seed===0?colors.idle:seed<1?mix([226,232,241],heatColors[i],seed):q===1?(mask[i]?colors.keep:colors.drop):`rgb(${mixed.join(',')})`);
      n.setAttribute('stroke','#e6bcb5');n.setAttribute('stroke-opacity',mask[i]?0:q);cross.setAttribute('opacity',mask[i]?0:q);
    });
    const focus=Math.min(total-1,Math.floor(clamp((time-8)/1.3)*total));
    $('#fm-heat-cell-focus').setAttribute('x',lower.heatX+(focus%side)*step);
    $('#fm-heat-cell-focus').setAttribute('y',lower.y+Math.floor(focus/side)*step);
    opacity('#fm-heat-cell-focus',windowed(8,9.3,.16));
    const gather=rise(11.6,1.65),selection=rise(11.25,.55);
    source.forEach((n,i)=>{const retain=mask[shownIds[i]];n.setAttribute('fill',mix([234,161,110],retain?[43,157,133]:[250,238,235],selection));n.setAttribute('stroke',retain?'#738195':'#cf9b93');n.setAttribute('opacity',(.24+.76*selection)*(retain?1-gather*.75:1));sourceCrosses[i].setAttribute('opacity',retain?0:selection);});
    output.forEach((n,j)=>{const i=shownIds.indexOf(shownKept[j]),q=rise(11.6+j/shownKept.length*.18,1.45),x0=617+i*tokenPitch,x1=797+j*tokenPitch;n.setAttribute('x',x0+(x1-x0)*q);n.setAttribute('y',tokenY-5*Math.sin(q*Math.PI));n.setAttribute('opacity',rise(11.6,.25));});
    updated.forEach((n,j)=>{const arrive=rise(13.5+j/shownKept.length*.35,.95);n.setAttribute('opacity',arrive);n.setAttribute('transform',`translate(${-14*(1-arrive)} 0)`);});
    opacity('#fm-updated-history',.3+.7*rise(13.5,.6));
    $('#method-progress').value=Math.round(time*100);$('#method-time').textContent=`${time.toFixed(1)} / 16 s`;
    $('#method-play').textContent=playing?'Pause':'Play';$('#method-play').setAttribute('aria-pressed',playing);
  }
  function frame(now){const dt=last?Math.min((now-last)/1000,.1):0;last=now;if(playing&&visible&&!document.hidden){time=(time+dt*Number($('#speed').value))%16;render();}requestAnimationFrame(frame);}
  new IntersectionObserver(entries=>visible=entries[0].isIntersecting,{threshold:.1}).observe(player);
  $('#method-play').onclick=()=>{playing=!playing;render();};
  $('#method-restart').onclick=()=>{time=0;render();};
  $$('.fm-tabs button').forEach((b,i)=>b.onclick=()=>{time=[3.8,7.8,10.7,15.5][i];playing=false;render();});
  $('#method-progress').oninput=e=>{time=Math.min(15.999,Number(e.target.value)/100);playing=false;render();};
  motion.addEventListener('change',e=>{if(e.matches){playing=false;time=15.99;render();}});
  render();requestAnimationFrame(frame);
})();
