const menuButton=document.querySelector('.menu-btn');
const mobileMenu=document.querySelector('#mobile-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'باز کردن منو':'بستن منو');mobileMenu.hidden=open;});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','باز کردن منو');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.focus();}});

// Direction is deliberately physical left-to-right, independent of the Persian page.
document.querySelectorAll('.paths > a').forEach((link,index)=>{
  const destination=link.getAttribute('href');
  const title=link.querySelector('h2').textContent;
  const description=link.querySelector('p').textContent;
  const card=document.createElement('div');
  card.className='slide-card';
  card.innerHTML=`<div class="slide-heading"><span class="number">${['۰۱','۰۲','۰۳'][index]}</span><div><h2>${title}</h2><p>${description}</p></div></div><div class="portrait-stage" aria-hidden="true"><div class="skin-portrait portrait-happy"></div><div class="skin-portrait portrait-sad"></div></div><div class="skin-slide" dir="ltr"><div class="slide-instruction" dir="rtl">آهسته به راست بکشید</div><button class="slide-handle" type="button" role="slider" aria-label="ورود به ${title}؛ به راست بکشید یا کلید پایان را بزنید" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="برای ورود به راست بکشید" aria-orientation="horizontal"><svg viewBox="0 0 44 32" aria-hidden="true"><path d="M3 10h21V3l17 13-17 13v-7H3z"/></svg></button></div>`;
  link.replaceWith(card);
  const track=card.querySelector('.skin-slide');
  const handle=card.querySelector('.slide-handle');
  const rotating=index===0;
  let frameSurface=null,framesReady=false;
  const frameSheets=['skin-turn-hq-01.webp','skin-turn-hq-02.webp','skin-turn-hq-03.webp','skin-turn-hq-04.webp'];
  const frameImages=[];
  if(rotating){
    card.classList.add('video-demo');
    const stage=card.querySelector('.portrait-stage');
    stage.innerHTML='<div class="skin-video-frames"><img class="skin-frame-poster" src="skin-turn-poster-hq.jpg" alt="" draggable="false"></div>';
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
  let progress=0,pointer=null,origin=0,initial=0,completed=false,timer,returnTimer;
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
  const reset=()=>{completed=false;clearTimeout(returnTimer);track.classList.remove('is-complete','is-dragging','is-returning');paint(0);};
  const returnToStart=()=>{
    track.classList.remove('is-dragging');
    track.classList.add('is-returning');
    paint(0);
    clearTimeout(returnTimer);
    returnTimer=setTimeout(()=>track.classList.remove('is-returning'),520);
  };
  const finish=()=>{
    if(completed)return;
    completed=true;paint(1);track.classList.remove('is-dragging');track.classList.add('is-complete');
    handle.setAttribute('aria-valuetext','تکمیل شد؛ ورود');
    timer=setTimeout(()=>{const target=document.querySelector(destination);if(target){history.replaceState(null,'',destination);target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});target.setAttribute('tabindex','-1');target.classList.add('slider-arrival-focus');target.addEventListener('blur',()=>target.classList.remove('slider-arrival-focus'),{once:true});target.focus({preventScroll:true});}timer=setTimeout(reset,1200);},550);
  };
  handle.addEventListener('pointerdown',event=>{
    if(completed||pointer!==null||event.button!==0)return;
    pointer=event.pointerId;origin=event.clientX;initial=progress;
    clearTimeout(returnTimer);track.classList.remove('is-returning');
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
  handle.addEventListener('pointerup',event=>{if(event.pointerId!==pointer)return;pointer=null;returnToStart();});
  const cancel=event=>{if(event.pointerId!==pointer)return;pointer=null;returnToStart();};
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
  new ResizeObserver(()=>paint(progress)).observe(track);
  window.addEventListener('pagehide',()=>clearTimeout(timer));
});
