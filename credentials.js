const dialog=document.querySelector('.cert-dialog');
const fullImage=dialog.querySelector('img');
const heading=dialog.querySelector('h2');
let trigger=null;
document.querySelectorAll('.cert-open').forEach(button=>button.addEventListener('click',()=>{trigger=button;fullImage.src=button.dataset.src;fullImage.alt=button.dataset.title+' به نام مارال قاسمی';heading.textContent=button.dataset.title;dialog.showModal();}));
dialog.querySelector('.cert-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>trigger?.focus());
