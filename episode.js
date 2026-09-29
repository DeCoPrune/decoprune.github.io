'use strict';
(() => {
 const $=id=>document.getElementById(id), section=$('episode');
 if(!section)return;
 const context=$('ep-context'),mask=$('ep-mask'),result=$('ep-result'),pair=[context,mask];
 const play=$('ep-play'),progress=$('ep-progress'),status=$('ep-status');
 const chapters=[...section.querySelectorAll('[data-ep-seek]')];
 const link=document.createElement('a');link.href='#episode';link.textContent='Episode';
 document.querySelector('#nav-links a[href="#method"]').before(link);
 link.addEventListener('click',()=>{$('nav-links').classList.remove('open');$('menu-button').setAttribute('aria-expanded','false');});
 let ready,playing=false,visible=false,frame=0,operation=0;
 const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 function draw(){const t=Math.min(60,context.currentTime);progress.value=t;$('ep-time').textContent=`${clock(t)} / 1:00`;chapters.forEach((b,i)=>b.setAttribute('aria-pressed',Math.min(5,Math.floor(t/10))===i));}
 function pause(){operation++;playing=false;pair.forEach(v=>v.pause());cancelAnimationFrame(frame);play.textContent='Play episode';play.setAttribute('aria-pressed','false');}
 async function load(){
  if(ready)return ready;
  play.disabled=true;status.textContent='Preparing the synchronized episode…';
  // Native relative video sources work for both file:// and HTTP pages.
  ready=Promise.all(pair.map(v=>new Promise((resolve,reject)=>{
   if(v.readyState>=2){resolve();return;}
   let timer;
   const cleanup=()=>{clearTimeout(timer);v.removeEventListener('loadeddata',loaded);v.removeEventListener('error',failed);};
   const loaded=()=>{cleanup();resolve();};
   const failed=()=>{cleanup();reject(Error('Video unavailable'));};
   v.addEventListener('loadeddata',loaded,{once:true});
   v.addEventListener('error',failed,{once:true});
   timer=setTimeout(failed,30000);
   v.load();
  }))).then(()=>{status.textContent='Synchronized · original context and recorded mask';}).catch(error=>{ready=null;throw error;}).finally(()=>{play.disabled=false;});
  return ready;
 }
 function fail(){pause();status.textContent='Could not load the episode. Please retry, or open the video files directly.';}
 function tick(){if(!playing)return;draw();if(context.currentTime>=59.94||context.ended){pause();status.textContent='Context complete. Watch the continuation below to see what is recalled.';return;}
  if(!context.seeking&&!mask.seeking&&Math.abs(mask.currentTime-context.currentTime)>.12)mask.currentTime=context.currentTime;
  frame=requestAnimationFrame(tick);
 }
 async function start(){const op=++operation;try{await load();if(op!==operation||!visible||document.hidden)return;
  result.pause();if(context.currentTime>=59.9)pair.forEach(v=>v.currentTime=0);
  mask.currentTime=context.currentTime;pair.forEach(v=>v.playbackRate=Number($('ep-speed').value));
  await Promise.all(pair.map(v=>v.play()));if(op!==operation){pair.forEach(v=>v.pause());return;}
  playing=true;play.textContent='Pause episode';play.setAttribute('aria-pressed','true');tick();
 }catch{fail();}}
 async function seek(t){pause();const op=operation;try{await load();if(op!==operation)return;
  await Promise.all(pair.map(v=>new Promise(resolve=>{if(Math.abs(v.currentTime-t)<.01){resolve();return;}v.addEventListener('seeked',resolve,{once:true});v.currentTime=t;})));draw();
 }catch{fail();}}
 play.addEventListener('click',()=>playing?pause():start());
 $('ep-restart').addEventListener('click',()=>seek(0));
 progress.addEventListener('input',()=>seek(Math.min(59.9,Number(progress.value))));
 chapters.forEach(b=>b.addEventListener('click',()=>seek(Number(b.dataset.epSeek))));
 $('ep-speed').addEventListener('change',()=>pair.forEach(v=>v.playbackRate=Number($('ep-speed').value)));
 pair.forEach(v=>v.addEventListener('error',()=>{if(v.getAttribute('src'))fail();}));
 result.addEventListener('play',pause);
 $('ep-result-play').addEventListener('click',async()=>{pause();result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});result.currentTime=0;try{await result.play();}catch{status.textContent='Use the continuation player’s play button.';}});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){pause();result.pause();}},{threshold:0}).observe(section);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();result.pause();}});
 // The prompt and provenance are embedded in HTML for offline viewing.
 window.addEventListener('pagehide',pause);
})();
