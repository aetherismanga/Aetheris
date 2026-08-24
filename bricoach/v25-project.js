/* V25 — vidéos dans les tutoriels liés aux chantiers */
try{
  const v25ProjectBaseTutorBody=v21TutorBody;
  v21TutorBody=function(){
    let html=v25ProjectBaseTutorBody();
    const s=v21TutorState,p=projects.find(x=>x.id===s?.projectId),l=p?.locations?.find(x=>x.id===s?.locId),w=l?.works?.find(x=>x.id===s?.workId);
    if(!w||w.category==='Carrelage'||!V25_CHANNELS[w.category])return html;
    const step=w.steps?.[s.active||0]?.[0]||'',videos=v25RelatedVideos(w.category,step),ch=V25_CHANNELS[w.category];
    const block=`<section class="v25Related v25ProjectRelated"><div class="v24RelatedHead"><div><h4>🎥 Voir la démonstration</h4><small>Vidéos ${esc(ch.name)} liées à cette étape.</small></div><button class="v24AllVideos" onclick='v25OpenVideoLibrary(${JSON.stringify(w.category)})'>Toutes les vidéos →</button></div><div class="v24RelatedGrid">${videos.map(v=>v25VideoCard(w.category,v)).join('')}</div></section>`;
    const marker='<button class="btn ';
    const i=html.lastIndexOf(marker);
    if(i>=0)html=html.slice(0,i)+block+html.slice(i);else html+=block;
    return html;
  };
}catch(e){console.error('V25 project tutorials',e)}
