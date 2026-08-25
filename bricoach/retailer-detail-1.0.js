/* BRICOACH 1.0.1 — détail cliquable du chiffrage par enseigne */
(function(){
  'use strict';

  function retailerStatusText(r,data){
    if(!r.count) return 'Aucun poste comparable';
    return r.verified
      ? 'Tous les postes ont un produit principal vérifié'
      : `${r.count}/${data.entries.length} poste(s) comparable(s)`;
  }

  window.v21RetailerTotals=function(data){
    return Object.values(data.retailers).map(r=>{
      const active=!!r.count;
      return `<div class="v21RetailerTotal ${r.verified?'verified':''} ${active?'bcRetailerClickable':'bcRetailerDisabled'}" ${active?`role="button" tabindex="0" aria-label="Voir le détail du chiffrage ${esc(r.name)}" onclick="bcOpenRetailerDetail('${r.key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();bcOpenRetailerDetail('${r.key}')}"`:''}>
        <div class="bcRetailerTotalMain">
          <b>${esc(r.name)}</b>
          <strong>${r.count?`≈ ${Math.round(r.total).toLocaleString('fr-FR')} €`:'Non disponible'}</strong>
          <small>${retailerStatusText(r,data)}</small>
        </div>
        ${active?'<span class="bcRetailerOpen">Voir le détail <b>→</b></span>':''}
      </div>`;
    }).join('');
  };

  function quoteBlock(entry,key,index){
    const q=entry.quotes.find(x=>x.key===key);
    const place=entry.l?.name||entry.pseudo?.room||`Zone ${index+1}`;
    const trade=entry.w?.category||entry.pseudo?.category||'Poste';
    const range=entry.w?.range||entry.pseudo?.range||'Standard';
    if(!q||q.unsupported){
      return `<section class="bcRetailerWork bcRetailerWorkUnsupported">
        <div class="bcRetailerWorkHead"><div><small>${esc(place)}</small><h3>${esc(trade)}</h3><span>Gamme ${esc(range)}</span></div><strong>Non disponible</strong></div>
        <p>Cette enseigne n'a pas encore de référence comparable pour ce poste.</p>
      </section>`;
    }
    return `<section class="bcRetailerWork">
      <div class="bcRetailerWorkHead">
        <div><small>${esc(place)}</small><h3>${esc(trade)}</h3><span>Gamme ${esc(range)}${q.band?` · ${esc(q.band)}`:''}</span></div>
        <strong>≈ ${formatEuro(q.total||0)}</strong>
      </div>
      <div class="bcRetailerLines">${(q.lines||[]).map(v21QuoteLine).join('')}</div>
      ${!q.verified?'<div class="bcRetailerWorkNote">⚠️ Une ou plusieurs références de ce poste restent à confirmer. Les lignes concernées sont signalées ci-dessus.</div>':''}
    </section>`;
  }

  window.bcOpenRetailerDetail=function(key){
    if(!v21QuoteData)return;
    const r=v21QuoteData.retailers?.[key];
    if(!r||!r.count)return;
    const project=projects.find(x=>x.id===v21QuoteProjectId);
    document.querySelector('#bcRetailerDetailModal')?.remove();
    const blocks=v21QuoteData.entries.map((entry,index)=>quoteBlock(entry,key,index)).join('');
    const verifiedCount=v21QuoteData.entries.filter(entry=>{
      const q=entry.quotes.find(x=>x.key===key);
      return q&&!q.unsupported&&q.verified;
    }).length;
    document.body.insertAdjacentHTML('beforeend',`<div class="modalBack bcRetailerDetailBack" id="bcRetailerDetailModal" onclick="if(event.target===this)this.remove()">
      <div class="modal bcRetailerDetailModal">
        <div class="wizardTop bcRetailerDetailTop">
          <div><div class="eyebrow">DÉTAIL DU CHIFFRAGE</div><h2>${esc(r.name)}</h2><small>${project?esc(project.title):'Chantier Bricoach'}</small></div>
          <button class="close" onclick="document.querySelector('#bcRetailerDetailModal').remove()">✕</button>
        </div>
        <div class="bcRetailerSummary">
          <div><small>Total matériaux dans cette enseigne</small><b>≈ ${Math.round(r.total).toLocaleString('fr-FR')} €</b></div>
          <div><small>Postes comparables</small><b>${r.count}/${v21QuoteData.entries.length}</b></div>
          <div><small>Produits principaux vérifiés</small><b>${verifiedCount}/${v21QuoteData.entries.length}</b></div>
        </div>
        <div class="bcRetailerInfo">Prix web de référence. Le tarif, la disponibilité et le stock peuvent varier selon le magasin ou le dépôt. Utilise les liens « Voir produit / tarif » pour consulter la source de chaque référence.</div>
        <div class="bcRetailerWorks">${blocks}</div>
        <div class="bcRetailerGrandTotal"><span>Total ${esc(r.name)}</span><strong>≈ ${Math.round(r.total).toLocaleString('fr-FR')} €</strong></div>
        <button class="btn soft full" onclick="document.querySelector('#bcRetailerDetailModal').remove()">← Retour au comparatif</button>
      </div>
    </div>`);
  };
})();
