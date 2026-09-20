const galleryCards=[...document.querySelectorAll('.result-card')];
const galleryDialog=document.querySelector('.gallery-lightbox');
const galleryImage=galleryDialog.querySelector('figure img');
const galleryCaption=galleryDialog.querySelector('figcaption');
const galleryClose=galleryDialog.querySelector('.lightbox-close');
const galleryPrev=galleryDialog.querySelector('.lightbox-prev');
const galleryNext=galleryDialog.querySelector('.lightbox-next');
let galleryIndex=0;

const renderGalleryImage=()=>{
  const card=galleryCards[galleryIndex];
  const thumbnail=card.querySelector('img');
  galleryImage.src=card.dataset.full;
  galleryImage.alt=thumbnail.alt;
  galleryCaption.textContent=`تصویر ${galleryIndex+1} از ${galleryCards.length}`;
};
const openGalleryImage=index=>{
  galleryIndex=index;
  renderGalleryImage();
  galleryDialog.showModal();
  document.body.classList.add('lightbox-open');
};
const closeGalleryImage=()=>galleryDialog.close();
const moveGalleryImage=direction=>{
  galleryIndex=(galleryIndex+direction+galleryCards.length)%galleryCards.length;
  renderGalleryImage();
};

galleryCards.forEach((card,index)=>card.addEventListener('click',()=>openGalleryImage(index)));
galleryClose.addEventListener('click',closeGalleryImage);
galleryPrev.addEventListener('click',()=>moveGalleryImage(-1));
galleryNext.addEventListener('click',()=>moveGalleryImage(1));
galleryDialog.addEventListener('click',event=>{if(event.target===galleryDialog)closeGalleryImage();});
galleryDialog.addEventListener('close',()=>{document.body.classList.remove('lightbox-open');galleryCards[galleryIndex]?.focus();});
galleryDialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'){event.preventDefault();moveGalleryImage(-1);}
  if(event.key==='ArrowLeft'){event.preventDefault();moveGalleryImage(1);}
});
