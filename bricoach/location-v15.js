function v15StoreSearchLinks(lat,lon,label='ta zone'){
  const brands=[['leroymerlin','Leroy Merlin'],['castorama','Castorama'],['bricodepot','Brico Dépôt']];
  return `<div class="v15StoreFallback"><b>Ouvrir la recherche magasin</b><small>Si Bricoach ne peut pas lire automatiquement les points de vente, ces boutons ouvrent une recherche cartographique centrée sur ${esc(label)}.</small>${brands.map(([k,n])=>`<a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n+' '+lat+','+lon)}">📍 ${n} autour de ${esc(label)} ↗</a>`).join('')}</div>`;
}
function v15RenderStores(stores,lat,lon,label){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  const nearest=nearestByRetailer(stores||[]),found=Object.values(nearest);
  for(const key of ['leroymerlin','castorama','bricodepot']){
    const target=document.getElementById('distance-'+key),s=nearest[key];
    if(!target)continue;
    if(s){const q=encodeURIComponent(`${s.name} ${s.address||''}`.trim());target.innerHTML=`📍 ${s.km.toFixed(1)} km · ${esc(s.address||s.name)} <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q}">Itinéraire ↗</a>`}
    else target.innerHTML=`📍 Point de vente non identifié automatiquement`;
  }
  el.innerHTML=(found.length?`<div class="v15StoreFound"><b>${found.length} enseigne${found.length>1?'s':''} identifiée${found.length>1?'s':''}</b><span> autour de ${esc(label)}.</span></div>`:`<div class="v15StoreFound"><b>Détection automatique indisponible</b><span> autour de ${esc(label)}.</span></div>`)+v15StoreSearchLinks(lat,lon,label);
}
async function priceFindStores(lat,lon,label='ta position'){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  el.innerHTML='<div class="storeLoading">Recherche des magasins…</div>';
  try{const stores=await findStoresReliable(lat,lon);v15RenderStores(stores,lat,lon,label)}catch(_){el.innerHTML=v15StoreSearchLinks(lat,lon,label)}
}
async function priceUsePostcode(){
  const cp=(document.getElementById('quotePostcode')?.value||'').trim(),el=document.getElementById('priceStoreSummary');
  if(!/^\d{5}$/.test(cp)){if(el)el.textContent='Entre un code postal français à 5 chiffres.';return;}
  if(el)el.innerHTML='<div class="storeLoading">Localisation du code postal…</div>';
  try{const g=await geoFromPostcode(cp);await priceFindStores(g.lat,g.lon,`${g.label} (${cp})`)}catch(_){if(el)el.innerHTML=`<div class="diagnostic danger"><b>Code postal non localisé</b><p>Réessaie ou utilise « Autour de moi ».</p></div>`}
}
async function priceUseMyLocation(){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  if(!navigator.geolocation){el.textContent='Géolocalisation non disponible. Utilise le code postal.';return;}
  el.innerHTML='<div class="storeLoading">Demande de ta position…</div>';
  navigator.geolocation.getCurrentPosition(p=>priceFindStores(p.coords.latitude,p.coords.longitude,'ta position'),e=>{el.innerHTML=`<div class="diagnostic danger"><b>Localisation impossible</b><p>${esc(locationErrorText(e))}</p></div>`},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
}
