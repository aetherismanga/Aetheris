/* BRICOACH V37 — logo officiel */
(() => {
  const LOGO='./bricoach-app-icon.svg?v=37';
  function applyLogo(){
    document.querySelectorAll('.v29LogoMark').forEach(old=>{
      if(old.tagName.toLowerCase()==='img'){ old.src=LOGO; return; }
      const img=document.createElement('img');
      img.src=LOGO; img.alt='Bricoach'; img.className='v29LogoMark v37OfficialLogo';
      old.replaceWith(img);
    });
    document.querySelectorAll('.bcAuthBrand img').forEach(img=>img.src=LOGO);
    document.querySelectorAll('img[src$="icon.svg"]').forEach(img=>img.src=LOGO);
  }
  try{
    const previousRender=render;
    render=function(){ previousRender(); requestAnimationFrame(()=>requestAnimationFrame(applyLogo)); };
  }catch(_){}
  const observer=new MutationObserver(()=>requestAnimationFrame(applyLogo));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  applyLogo();
})();