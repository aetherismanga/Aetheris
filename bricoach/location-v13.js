const STORE_ENDPOINTS=[
  'https://overpass.kumi.systems/api/interpreter?data=',
  'https://z.overpass-api.de/api/interpreter?data=',
  'https://overpass-api.de/api/interpreter?data='
];

async function fetchJsonTimeout(url,ms=8000,opts={}){
  const c=new AbortController();
  const t=setTimeout(()=>c.abort(),ms);
  try{
    const r=await fetch(url,{...opts,cache:'no-store',signal:c.signal,headers:{Accept:'application/json',...(opts.headers||{})}});
    if(!r.ok)throw new Error('HTTP '+r.status);
    return await r.json();
  }finally{clearTimeout(t)}
}

async function geoFromPostcode(cp){
  try{
    const u=`https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(cp)}&fields=nom,centre,codesPostaux&format=json&geometry=centre`;
    const d=await fetchJsonTimeout(u,6500);
    const x=d?.[0];
    if(x?.centre?.coordinates?.length===2)return {lat:Number(x.centre.coordinates[1]),lon:Number(x.centre.coordinates[0]),label:x.nom||cp};
  }catch(_){}
  try{
    const u=`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(cp)}&type=municipality&limit=1`;
    const d=await fetchJsonTimeout(u,6500);
    const f=d?.features?.[0];
    if(f?.geometry?.coordinates?.length===2)return {lat:Number(f.geometry.coordinates[1]),lon:Number(f.geometry.coordinates[0]),label:f.properties?.city||f.properties?.name||cp};
  }catch(_){}
  throw new Error('postcode');
}

function storeQuery(lat,lon){
  return `[out:json][timeout:12];(nwr["name"~"Leroy Merlin|Castorama|Brico Dépôt|Brico Depot",i](around:65000,${lat},${lon});nwr["brand"~"Leroy Merlin|Castorama|Brico Dépôt|Brico Depot",i](around:65000,${lat},${lon}););out center tags;`;
}

async function overpassStores(lat,lon){
  const q=encodeURIComponent(storeQuery(lat,lon));
  let last;
  for(const base of STORE_ENDPOINTS){
    try{
      const d=await fetchJsonTimeout(base+q,8000);
      if(Array.isArray(d?.elements))return d.elements;
    }catch(e){last=e}
  }
  throw last||new Error('overpass');
}

async function photonStores(lat,lon){
  const brands=['Leroy Merlin','Castorama','Brico Dépôt'];
  const all=[];
  for(const brand of brands){
    try{
      const u=`https://photon.komoot.io/api/?q=${encodeURIComponent(brand)}&lat=${lat}&lon=${lon}&limit=8`;
      const d=await fetchJsonTimeout(u,6500);
      for(const f of d?.features||[]){
        const c=f.geometry?.coordinates,p=f.properties||{};
        if(!c||c.length<2)continue;
        all.push({lat:Number(c[1]),lon:Number(c[0]),tags:{name:p.name||brand,brand,address:[p.housenumber,p.street,p.city].filter(Boolean).join(' ')}});
      }
    }catch(_){}
  }
  return all;
}

function normalizeStores(elements,lat,lon){
  return (elements||[]).map(e=>{
    const la=Number(e.lat??e.center?.lat),lo=Number(e.lon??e.center?.lon);
    if(!Number.isFinite(la)||!Number.isFinite(lo))return null;
    const t=e.tags||{},name=t.name||t.brand||'Magasin bricolage',key=retailerKeyFromName(name);
    if(!key)return null;
    const address=t.address||[t['addr:housenumber'],t['addr:street'],t['addr:postcode'],t['addr:city']].filter(Boolean).join(' ');
    return {key,name,address,lat:la,lon:lo,km:haversine(lat,lon,la,lo)};
  }).filter(Boolean).filter(s=>s.km<=80).sort((a,b)=>a.km-b.km);
}

async function findStoresReliable(lat,lon){
  let raw=[];
  try{raw=await overpassStores(lat,lon)}catch(_){}
  let stores=normalizeStores(raw,lat,lon);
  if(stores.length<2){
    try{stores=[...stores,...normalizeStores(await photonStores(lat,lon),lat,lon)]}catch(_){}
  }
  const seen=new Set();
  return stores.filter(s=>{const id=s.key+'|'+s.name+'|'+s.lat.toFixed(3)+'|'+s.lon.toFixed(3);if(seen.has(id))return false;seen.add(id);return true;});
}

function nearestByRetailer(stores){
  const nearest={};
  for(const s of stores)if(!nearest[s.key]||s.km<nearest[s.key].km)nearest[s.key]=s;
  return nearest;
}

function renderNearestIntoQuote(stores,label){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  const nearest=nearestByRetailer(stores);
  for(const key of ['leroymerlin','castorama','bricodepot']){
    const target=document.getElementById('distance-'+key),s=nearest[key];
    if(!target)continue;
    if(!s){target.innerHTML='📍 Aucun magasin trouvé à proximité';continue;}
    const q=encodeURIComponent(`${s.name} ${s.address||''}`.trim());
    target.innerHTML=`📍 ${s.km.toFixed(1)} km · ${esc(s.address||s.name)} <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q}">Itinéraire ↗</a>`;
  }
  const found=Object.values(nearest);
  el.innerHTML=found.length?`<b>${found.length} enseigne${found.length>1?'s':''} trouvée${found.length>1?'s':''}</b> autour de ${esc(label)}. Distances à vol d’oiseau.`:'Aucune des trois enseignes trouvée dans un rayon d’environ 80 km.';
}

async function priceFindStores(lat,lon,label='ta position'){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  el.innerHTML='<div class="storeLoading">Recherche des magasins…</div>';
  try{renderNearestIntoQuote(await findStoresReliable(lat,lon),label)}catch(_){el.innerHTML='La recherche n’a pas répondu. Réessaie ou utilise le code postal.'}
}

async function priceUsePostcode(){
  const cp=(document.getElementById('quotePostcode')?.value||'').trim(),el=document.getElementById('priceStoreSummary');
  if(!/^\d{5}$/.test(cp)){if(el)el.textContent='Entre un code postal français à 5 chiffres.';return;}
  if(el)el.innerHTML='<div class="storeLoading">Localisation du code postal…</div>';
  try{const g=await geoFromPostcode(cp);await priceFindStores(g.lat,g.lon,`${g.label} (${cp})`)}catch(_){if(el)el.textContent='Impossible de localiser ce code postal. Réessaie dans quelques instants.'}
}

function locationErrorText(err){
  if(err?.code===1)return 'Localisation refusée par le navigateur. Autorise la position pour ce site ou utilise le code postal.';
  if(err?.code===2)return 'Position indisponible sur ce téléphone. Utilise le code postal.';
  if(err?.code===3)return 'La localisation a pris trop de temps. Réessaie ou utilise le code postal.';
  return 'Impossible d’obtenir la position. Utilise le code postal.';
}

async function priceUseMyLocation(){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  if(!navigator.geolocation){el.textContent='Géolocalisation non disponible. Utilise le code postal.';return;}
  el.innerHTML='<div class="storeLoading">Demande de ta position…</div>';
  navigator.geolocation.getCurrentPosition(
    p=>priceFindStores(p.coords.latitude,p.coords.longitude,'ta position'),
    e=>{el.textContent=locationErrorText(e)},
    {enableHighAccuracy:true,timeout:15000,maximumAge:60000}
  );
}

async function renderWizardStores(targetId,lat,lon,label='ta position'){
  const el=document.getElementById(targetId);if(!el)return;
  el.innerHTML='<div class="storeLoading">Recherche des magasins…</div>';
  try{
    const nearest=nearestByRetailer(await findStoresReliable(lat,lon));
    const a=Object.values(nearest).sort((x,y)=>x.km-y.km);
    el.innerHTML=a.length?a.map(s=>`<div class="storeRow"><span>📍 ${esc(s.name)}${s.address?`<small>${esc(s.address)}</small>`:''}</span><b>${s.km.toFixed(1)} km</b></div>`).join(''):`Aucun magasin ciblé trouvé autour de ${esc(label)}.`;
  }catch(_){el.innerHTML='La recherche n’a pas répondu. Tu pourras utiliser le code postal après avoir enregistré le chantier.'}
}

function detectNearbyStores(targetId){
  const el=document.getElementById(targetId);if(!el)return;
  if(!navigator.geolocation){el.textContent='Géolocalisation non disponible. Enregistre le chantier puis utilise le code postal dans Chiffrage.';return;}
  el.innerHTML='<div class="storeLoading">Demande de ta position…</div>';
  navigator.geolocation.getCurrentPosition(
    p=>renderWizardStores(targetId,p.coords.latitude,p.coords.longitude),
    e=>{el.textContent=locationErrorText(e)+' Tu pourras aussi saisir ton code postal dans Chiffrage.'},
    {enableHighAccuracy:true,timeout:15000,maximumAge:60000}
  );
}
