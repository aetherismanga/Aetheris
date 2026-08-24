// Bricoach V17 — preserve scroll position on in-place UI updates.
(function(){
  const raf2 = fn => requestAnimationFrame(()=>requestAnimationFrame(fn));

  function snapshot(selector){
    const el=document.querySelector(selector);
    return {exists:!!el,top:el?.scrollTop||0,left:el?.scrollLeft||0,windowY:window.scrollY||0};
  }
  function restore(selector,state){
    if(!state?.exists)return;
    raf2(()=>{
      const el=document.querySelector(selector);
      if(el){el.scrollTop=state.top;el.scrollLeft=state.left;}
      // Keep the document itself stable too. On some Android browsers the
      // body moves when a modal subtree is replaced.
      if(Math.abs((window.scrollY||0)-state.windowY)>2)window.scrollTo({top:state.windowY,left:0,behavior:'auto'});
    });
  }

  // Profile settings: selecting a level or an interest rebuilds the modal.
  // Preserve its exact scroll position whenever it already exists.
  try{
    const baseProfileRender=v15RenderProfileModal;
    v15RenderProfileModal=function(){
      const s=snapshot('#v15ProfileModal .v15ProfileModal');
      baseProfileRender();
      restore('#v15ProfileModal .v15ProfileModal',s);
    };
  }catch(_){}

  // Project configurator: preserve scroll only when staying on the SAME step.
  // A deliberate navigation to the next/previous step may start at the top.
  try{
    const baseWizardRender=renderWizard;
    renderWizard=function(){
      const s=snapshot('#wizardModal .v14Wizard');
      const oldStep=document.querySelectorAll('#wizardModal .v14MainProgress > div.active').length;
      const newStep=wizard?.step||0;
      baseWizardRender();
      if(s.exists && oldStep===newStep)restore('#wizardModal .v14Wizard',s);
    };
  }catch(_){}

  // Older profile handlers call the renderer directly; keep the modal stable
  // even if another script replaces those handlers later.
  try{
    const baseToggleInterest=v15ToggleInterest;
    v15ToggleInterest=function(cat){
      const s=snapshot('#v15ProfileModal .v15ProfileModal');
      baseToggleInterest(cat);
      restore('#v15ProfileModal .v15ProfileModal',s);
    };
  }catch(_){}
  try{
    const baseSetLevel=v15SetProfileLevel;
    v15SetProfileLevel=function(level){
      const s=snapshot('#v15ProfileModal .v15ProfileModal');
      baseSetLevel(level);
      restore('#v15ProfileModal .v15ProfileModal',s);
    };
  }catch(_){}

  // In-page checklist/material changes redraw the main view. Keep the page
  // at the same place instead of jumping to the top.
  function wrapWindow(fnName){
    try{
      const base=window[fnName];
      if(typeof base!=='function')return;
      window[fnName]=function(...args){
        const y=window.scrollY||0;
        const out=base.apply(this,args);
        raf2(()=>{
          if(Math.abs((window.scrollY||0)-y)>2)window.scrollTo({top:y,left:0,behavior:'auto'});
        });
        return out;
      };
    }catch(_){}
  }
  ['toggleWorkStep','toggleStep','toggleMat'].forEach(wrapWindow);

  // Prevent the browser from trying to anchor to a removed focused button
  // after a same-view redraw.
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest('button');
    if(!b)return;
    if(b.closest('#wizardModal,#v15ProfileModal')){
      try{b.blur()}catch(_){}
    }
  },true);
})();
