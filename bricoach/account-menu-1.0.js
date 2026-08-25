/* BRICOACH 1.0 — compte : déconnexion dans le menu burger */
(() => {
  'use strict';

  function addLogoutButton(){
    const menu=document.querySelector('#v21Menu .v21DrawerLinks');
    if(!menu || menu.querySelector('.bcLogoutMenu')) return;
    const button=document.createElement('button');
    button.type='button';
    button.className='bcLogoutMenu';
    button.innerHTML='<span>🚪</span><b>Se déconnecter</b><em>›</em>';
    button.addEventListener('click', async()=>{
      document.querySelector('#v21Menu')?.remove();
      try{
        if(typeof window.bcLogout==='function') await window.bcLogout();
      }catch(e){
        console.error('[BRICOACH] déconnexion impossible',e);
      }
    });
    menu.appendChild(button);
  }

  const baseOpenMenu=window.v21OpenMenu;
  if(typeof baseOpenMenu==='function'){
    window.v21OpenMenu=function(){
      baseOpenMenu();
      requestAnimationFrame(addLogoutButton);
    };
  }
})();
