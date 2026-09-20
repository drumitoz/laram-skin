const pageHeader=document.querySelector('header');
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
