function v16RestoreWizardScroll(top,step){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const scroller=document.querySelector('.v14Wizard');
    if(scroller&&wizard&&wizard.step===step)scroller.scrollTop=top;
  }));
}
function v16WizardTop(){return document.querySelector('.v14Wizard')?.scrollTop||0}

function v14ToggleWork(locIndex,category){
  const top=v16WizardTop(),step=wizard?.step;
  const loc=wizard.locations[locIndex],i=loc.works.findIndex(w=>w.category===category);
  if(i>=0)loc.works.splice(i,1);else loc.works.push(v14WorkDefaults(category,loc.name));
  renderWizard();v16RestoreWizardScroll(top,step);
}
function v14SetLocation(locIndex,key,val){
  const top=v16WizardTop(),step=wizard?.step;
  wizard.locations[locIndex][key]=Number(String(val).replace(',','.'))||0;
  renderWizard();v16RestoreWizardScroll(top,step);
}
function v14SetWork(key,val,detail=false){
  const top=v16WizardTop(),step=wizard?.step,q=v14Current();if(!q)return;
  if(detail)q.work.details[key]=val;else q.work[key]=val;
  renderWizard();v16RestoreWizardScroll(top,step);
}
function v14UseSuggested(){
  const top=v16WizardTop(),step=wizard?.step,q=v14Current();if(!q)return;
  const s=v14SuggestedArea(q.loc,q.work);if(s>0)q.work.area=Math.round(s*10)/10;
  renderWizard();v16RestoreWizardScroll(top,step);
}
function v14ToggleRoom(name){
  const top=v16WizardTop(),step=wizard?.step,i=wizard.selectedRooms.indexOf(name);
  if(i>=0)wizard.selectedRooms.splice(i,1);else wizard.selectedRooms.push(name);
  renderWizard();v16RestoreWizardScroll(top,step);
}
function v14Set(key,val){
  const top=v16WizardTop(),step=wizard?.step;wizard[key]=val;renderWizard();v16RestoreWizardScroll(top,step);
}

function v16HomeProjects(){
  const list=(projects||[]).slice(0,3);
  const body=list.length?`<div class="v16ProjectStrip">${list.map(p=>{
    try{p=v14SyncProject(p)}catch(_){}
    const count=p.locations?.length||1,posts=p.locations?.flatMap(l=>l.works||[]).length||1;
    const prog=typeof v14ProjectProgress==='function'?v14ProjectProgress(p):progress(p);
    const estimate=typeof v14ProjectEstimate==='function'?v14ProjectEstimate(p):0;
    return `<button class="v16HomeProject" onclick="go('projects')"><div class="v16HomeProjectTop"><span>${count>1?'🏗️':'🔨'}</span><div><b>${esc(p.title||'Mon chantier')}</b><small>${count} lieu${count>1?'x':''} · ${posts} poste${posts>1?'s':''}</small></div><strong>${prog}%</strong></div><div class="progress"><span style="width:${prog}%"></span></div><div class="v16HomeProjectFoot"><span>${estimate?`≈ ${estimate.toLocaleString('fr-FR')} €`:'Projet enregistré'}</span><b>Ouvrir →</b></div></button>`;
  }).join('')}</div>`:`<div class="v16NoProjects"><div>📋</div><span><b>Aucun chantier enregistré</b><small>Crée ton premier projet, il apparaîtra ici automatiquement.</small></span><button class="btn primary" onclick="openWizard()">＋ Créer un chantier</button></div>`;
  return `<section class="v16MyProjects"><div class="v16SectionHead"><div><div class="eyebrow">MES CHANTIERS</div><h2>Mes projets en cours</h2></div><div class="v16SectionActions"><button class="btn soft" onclick="go('projects')">Voir tous</button><button class="btn primary" onclick="openWizard()">＋ Nouveau</button></div></div>${body}</section>`;
}

try{
  const v16BaseHome=home;
  home=function(){
    let html=v16BaseHome();
    const block=v16HomeProjects();
    const marker='<section class="sectionBlock">';
    return html.includes(marker)?html.replace(marker,block+marker):block+html;
  };
}catch(_){}

try{render()}catch(_){}
