/* V23 workspace routing safety fix */
try{window.v20MatVisual=v23MatVisual}catch(_){}
window.v20WorkspaceBody=function(p,tab){
  if(tab==='materials')return v23MaterialsTab(p);
  if(tab==='expenses')return v23ExpensesTab(p);
  if(tab==='steps'&&typeof v20WorkspaceSteps==='function')return v20WorkspaceSteps(p);
  if(tab==='tools'&&typeof v20WorkspaceTools==='function')return v20WorkspaceTools(p);
  if(tab==='planning'&&typeof v20WorkspacePlanning==='function')return v20WorkspacePlanning(p);
  if(tab==='tutorials'&&typeof v20WorkspaceTutorials==='function')return v20WorkspaceTutorials(p);
  if(typeof v20WorkspaceInfo==='function')return v20WorkspaceInfo(p);
  return '';
};
window.v20RenderWorkspaceBody=function(id,tab){const p=projects.find(x=>x.id===id);if(!p)return;try{v14SyncProject(p)}catch(_){}const body=document.getElementById('v20WorkspaceBody');if(body)body.innerHTML=window.v20WorkspaceBody(p,tab);document.querySelectorAll('#v20WorkspaceModal .v20Tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));const m=document.getElementById('v20WorkspaceModal');if(m)m.dataset.tab=tab};
window.v20OpenWorkspace=function(id,tab='materials'){const p=projects.find(x=>x.id===id);if(!p)return;try{v14SyncProject(p)}catch(_){}document.querySelector('#v20WorkspaceModal')?.remove();const tabs=[['steps','Étapes'],['materials','Matériaux'],['tools','Outils'],['expenses','Dépenses'],['planning','Planning'],['tutorials','Tutoriels'],['info','Infos']];document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v20WorkspaceModal" data-tab="${tab}"><div class="modal v20WorkspaceModal"><div class="wizardTop"><div><div class="eyebrow">MON CHANTIER</div><h2>${esc(p.title)}</h2></div><button class="close" onclick="document.querySelector('#v20WorkspaceModal').remove()">✕</button></div><div class="v20Tabs">${tabs.map(([k,l])=>`<button data-tab="${k}" class="v20Tab ${tab===k?'active':''}" onclick="v20RenderWorkspaceBody(${p.id},'${k}')">${l}</button>`).join('')}</div><div id="v20WorkspaceBody" class="v20WorkspaceBody">${window.v20WorkspaceBody(p,tab)}</div><div class="v20WorkspaceFooter"><button class="btn soft" onclick="document.querySelector('#v20WorkspaceModal').remove();openWizard(null,${p.id})">✏️ Modifier le projet</button><button class="btn primary" onclick="document.querySelector('#v20WorkspaceModal').remove();openLocalQuote(${p.id})">🧾 Chiffrage</button></div></div></div>`)};
try{render()}catch(_){}