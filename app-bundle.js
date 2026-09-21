const root=document.getElementById('laram-circle-preview');
const menuButton=root.querySelector('.menu-btn');
const mobileMenu=root.querySelector('#mobile-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'باز کردن منو':'بستن منو');mobileMenu.hidden=open;});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','باز کردن منو');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.focus();}});

// Direction is deliberately physical left-to-right, independent of the Persian page.
root.querySelectorAll('.paths > .slide-card').forEach((card,index)=>{
  const destination=card.dataset.destination;
  const title=card.querySelector('h2').textContent;
  card.style.setProperty('--portrait-x',destination==='#care'?'50%':destination==='#academy'?'0%':'100%');
  const track=card.querySelector('.skin-slide');
  const handle=card.querySelector('.slide-handle');
  const rotating=destination==='#academy';
  let frameSurface=null,framesReady=false;
  const frameSheets=['assets/skin-turn-sheet-01.webp','assets/skin-turn-sheet-02.webp','assets/skin-turn-sheet-03.webp','assets/skin-turn-sheet-04.webp'];
  const frameImages=[];
  if(rotating){
    card.classList.add('video-demo');
    const stage=card.querySelector('.portrait-stage');
    stage.innerHTML='<div class="skin-video-frames"><img class="skin-frame-poster" src="assets/skin-turn-poster.webp" alt="" draggable="false"></div>';
    frameSurface=stage.querySelector('.skin-video-frames');
    let loaded=0;
    frameSheets.forEach(src=>{
      const frames=new Image();
      frameImages.push(frames);
      frames.onload=()=>{
        if(++loaded!==frameSheets.length)return;
        framesReady=true;
        syncFrames();
        frameSurface.classList.add('frames-ready');
      };
      frames.src=src;
    });
  }
  const syncFrames=()=>{
    if(!frameSurface||!framesReady)return;
    const frame=Math.round(progress*96);
    const sheet=Math.floor(frame/25),tile=frame%25;
    frameSurface.style.backgroundImage=`url("${frameSheets[sheet]}")`;
    frameSurface.style.backgroundPosition=`${(tile%5)*25}% ${Math.floor(tile/5)*25}%`;
  };
  let progress=0,pointer=null,origin=0,initial=0,completed=false,timer;
  const activationGap=14;
  const travel=()=>Math.max(1,track.clientWidth-handle.offsetWidth-16);
  const paint=value=>{
    progress=Math.max(0,Math.min(1,value));
    track.style.setProperty('--progress',progress);
    card.style.setProperty('--progress',progress);
    syncFrames();
    handle.style.transform=`translateX(${progress*travel()}px)`;
    handle.setAttribute('aria-valuenow',String(Math.round(progress*100)));
    handle.setAttribute('aria-valuetext',progress>=.94?'برای ورود رها کنید':`${Math.round(progress*100)} درصد؛ به راست بکشید`);
    track.classList.toggle('is-ready',progress>=.94);
  };
  const reset=()=>{completed=false;track.classList.remove('is-complete','is-dragging');paint(0);};
  const finish=()=>{
    if(completed)return;
    completed=true;paint(1);track.classList.remove('is-dragging');track.classList.add('is-complete');
    handle.setAttribute('aria-valuetext','تکمیل شد؛ ورود');
    timer=setTimeout(()=>{const target=root.querySelector(destination);if(target){try{history.replaceState(null,'',destination);}catch(_error){}target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}timer=setTimeout(reset,1200);},550);
  };
  handle.addEventListener('pointerdown',event=>{
    if(completed||pointer!==null||event.button!==0)return;
    pointer=event.pointerId;origin=event.clientX;initial=progress;
    track.classList.add('is-dragging');handle.setPointerCapture(pointer);
  });
  handle.addEventListener('pointermove',event=>{
    if(event.pointerId!==pointer||completed)return;
    paint(initial+(event.clientX-origin)/travel());
    if((1-progress)*travel()<=activationGap){
      const activePointer=pointer;
      pointer=null;
      if(handle.hasPointerCapture(activePointer))handle.releasePointerCapture(activePointer);
      finish();
    }
  });
  handle.addEventListener('pointerup',event=>{if(event.pointerId!==pointer)return;pointer=null;track.classList.remove('is-dragging');if(progress>=.94)finish();});
  const cancel=event=>{if(event.pointerId!==pointer)return;pointer=null;track.classList.remove('is-dragging');};
  handle.addEventListener('pointercancel',cancel);
  handle.addEventListener('lostpointercapture',cancel);
  handle.addEventListener('keydown',event=>{
    if(completed)return;
    if(!['ArrowRight','ArrowLeft','Home','End','Enter',' '].includes(event.key))return;
    event.preventDefault();
    if(event.key==='ArrowRight')paint(progress+.1);
    else if(event.key==='ArrowLeft')paint(progress-.1);
    else if(event.key==='Home')paint(0);
    else if(event.key==='End')finish();
    else finish();
  });
  if('ResizeObserver' in window)new ResizeObserver(()=>paint(progress)).observe(track);
  else window.addEventListener('resize',()=>paint(progress),{passive:true});
  window.addEventListener('pagehide',()=>clearTimeout(timer));
});

// Keep the navigation available while the hero portrait settles into a compact identity chip.
const pageHeader=root.querySelector('header');
if(pageHeader){
  let compact=false;
  let queued=false;
  const syncCompactHeader=()=>{
    queued=false;
    const scrollTop=window.scrollY||document.scrollingElement?.scrollTop||document.documentElement.scrollTop||0;
    const next=scrollTop>56;
    if(next===compact)return;
    compact=next;
    pageHeader.classList.toggle('is-compact',compact);
  };
  const queueCompactHeader=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(syncCompactHeader);
  };
  syncCompactHeader();
  window.addEventListener('scroll',queueCompactHeader,{passive:true});
  document.addEventListener('scroll',queueCompactHeader,{passive:true,capture:true});
}

// Draw the eye to each registration action twice, then leave hover/focus in control.
if(typeof lucide!=="undefined")lucide.createIcons();
