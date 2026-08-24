let BRICOACH_PRICE_CATALOG=null;
const BRICOACH_PRICE_FILE='./price-catalog-v11.json';

async function loadPriceCatalog(){
  if(BRICOACH_PRICE_CATALOG)return BRICOACH_PRICE_CATALOG;
  const r=await fetch(BRICOACH_PRICE_FILE+'?t='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw new Error('catalogue indisponible');
  BRICOACH_PRICE_CATALOG=await r.json();
  return BRICOACH_PRICE_CATALOG;
}

function formatEuro(v){return Number(v||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'}
function retailerKeyFromName(name=''){
  const n=name.toLowerCase();
  if(n.includes('leroy'))return 'leroymerlin';
  if(n.includes('castorama'))return 'castorama';
  if(n.includes('brico dépôt')||n.includes('brico depot'))return 'bricodepot';
  return null;
}
function quoteQuantities(p){
  const area=Number(p.area)||1,d=ensureWizardDetails({...p.details});
  if(p.category!=='Carrelage')return {area};
  const tileM2=area*(1+tileLoss(d));
  let kgm2=4.5;if(['60 × 120','80 × 80'].includes(d.tileFormat))kgm2=5.5;if(d.tileFormat==='120 × 120')kgm2=6.5;
  const glueBags=Math.max(1,Math.ceil(area*kgm2/25));
  const jointKg=Math.max(2,Math.ceil(area*(d.tileFormat==='30 × 60'?.4:.25)));
  const jointPacks=Math.max(1,Math.ceil(jointKg/5));
  const clips100=Math.max(1,Math.ceil(area*(d.tileFormat==='30 × 60'?20:14)/100));
  return {area,tileM2,glueBags,jointKg,jointPacks,clips100,d};
}
function estimatedAccessories(p,q){
  const range=referenceUnitPrices[p.range]||referenceUnitPrices.Standard;
  let value=q.clips100*range.clips100+range.primer;
  if(q.d?.wetArea)value+=range.waterproofKit;
  return Math.round(value*100)/100;
}
function selectGlue(retailer,q){
  const g=retailer.glue||{};
  const large=['60 × 120','80 × 80','120 × 120'].includes(q.d?.tileFormat);
  if(retailer.name==='Brico Dépôt'&&large)return null;
  return large&&g.large?g.large:g.default||null;
}
function basketForRetailer(p,key,retailer){
  if(p.category!=='Carrelage')return {unsupported:true};
  const q=quoteQuantities(p),range=p.range||'Standard',tile=retailer.tile?.[range]||retailer.tile?.Standard;
  const glue=selectGlue(retailer,q),joint=retailer.joint||null;
  const lines=[];let total=0,missing=0;
  if(tile){const v=q.tileM2*tile.pricePerM2;total+=v;lines.push({label:'Carrelage',qty:`${q.tileM2.toFixed(1)} m²`,product:tile.name,unit:`${tile.pricePerM2.toFixed(2)} €/m²`,value:v,url:tile.url,referenceFormat:tile.format,formatMatch:tile.format===q.d.tileFormat});}else missing++;
  if(glue){const v=q.glueBags*glue.unitPrice;total+=v;lines.push({label:'Colle',qty:`${q.glueBags} × ${glue.unit}`,product:glue.name,unit:formatEuro(glue.unitPrice),value:v,url:glue.url,formatMatch:true});}else missing++;
  if(joint){const v=q.jointPacks*joint.unitPrice;total+=v;lines.push({label:'Joint',qty:`${q.jointPacks} × ${joint.unit}`,product:joint.name,unit:formatEuro(joint.unitPrice),value:v,url:joint.url,formatMatch:true});}else missing++;
  const accessories=estimatedAccessories(p,q);total+=accessories;lines.push({label:'Accessoires',qty:'primaire + nivelants'+(q.d.wetArea?' + étanchéité':''),product:'Estimation Bricoach à remplacer par références magasin',unit:'estimé',value:accessories,estimated:true});
  return {retailerKey:key,total,missing,lines,q,partial:missing>0};
}
function freshnessLabel(catalog){
  const t=new Date(catalog.updatedAt),age=(Date.now()-t.getTime())/86400000;
  if(age<=2)return {text:'Relevé récent',cls:'fresh'};
  if(age<=7)return {text:'À vérifier',cls:'warn'};
  return {text:'Relevé ancien',cls:'stale'};
}
function quoteRetailerCard(b,retailer,catalog){
  const f=freshnessLabel(catalog),rankable=!b.partial;
  return `<div class="retailerQuote ${b.partial?'partial':''}" data-retailer="${b.retailerKey}"><div class="retailerHead"><div><span class="retailerName">${esc(retailer.name)}</span><span class="freshness ${f.cls}">${f.text}</span></div><div class="retailerTotal">${rankable?'≈ ':''}${formatEuro(b.total)}</div></div><div class="retailerDistance" id="distance-${b.retailerKey}">📍 Magasin non localisé</div><div class="retailerLines">${b.lines.map(l=>`<div class="retailerLine"><div><b>${esc(l.label)}</b><small>${esc(l.qty)} · ${esc(l.product)}</small>${l.referenceFormat&&!l.formatMatch?`<em>Format repère ${esc(l.referenceFormat)} — ton projet est en ${esc(b.q.d.tileFormat)}</em>`:''}${l.estimated?'<em>Montant estimatif, pas un prix magasin live.</em>':''}</div><div class="linePrice">${formatEuro(l.value)}${l.url?`<a href="${l.url}" target="_blank" rel="noopener">Source ↗</a>`:''}</div></div>`).join('')}</div>${b.partial?'<div class="partialNote">⚠️ Panier incomplet : une référence techniquement compatible n’a pas encore de prix vérifié pour cette enseigne.</div>':''}</div>`;
}

async function openLocalQuote(id){
  const p=projects.find(x=>x.id===id);if(!p)return;
  document.querySelector('#quoteModal')?.remove();
  const base=`<div class="modalBack" id="quoteModal"><div class="modal quoteModal quoteModalV11"><div class="wizardTop"><div><div class="eyebrow">CHIFFRAGE PRODUITS</div><h2>${esc(p.title)}</h2></div><button class="close" onclick="document.querySelector('#quoteModal').remove()">✕</button></div><div id="quoteLiveBody"><div class="storeLoading">Chargement du catalogue de prix…</div></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',base);
  const body=document.getElementById('quoteLiveBody');
  try{
    const catalog=await loadPriceCatalog();
    if(p.category!=='Carrelage'){
      body.innerHTML=`<div class="estimateBox"><small>Estimation Bricoach</small><b>≈ ${technicalEstimate(p).toLocaleString('fr-FR')} €</b><span>Le comparateur magasin détaillé est activé en premier sur les projets Carrelage. Les autres métiers suivront avec leurs produits référents.</span></div>`;
      return;
    }
    const baskets=Object.entries(catalog.retailers).map(([k,r])=>basketForRetailer(p,k,r));
    const complete=baskets.filter(x=>!x.partial).sort((a,b)=>a.total-b.total);const best=complete[0]?.retailerKey;
    body.innerHTML=`<div class="priceHeader"><div><b>Comparatif automatique du panier</b><small>Relevé : ${new Date(catalog.updatedAt).toLocaleString('fr-FR')} · hors livraison</small></div><span class="priceStatus">Prix web de référence</span></div><div class="quoteWarning">Les prix peuvent varier selon le magasin ou le dépôt. Bricoach affiche la source, la date du relevé et distingue les lignes estimées des lignes tarifées.</div><div class="locationControls"><button class="btn primary" onclick="priceUseMyLocation()">📍 Autour de moi</button><div class="postcodeBox"><input id="quotePostcode" inputmode="numeric" maxlength="5" placeholder="Code postal"><button class="btn soft" onclick="priceUsePostcode()">Rechercher</button></div></div><div id="priceStoreSummary" class="storeSummary">Choisis ta position pour associer le comparatif aux magasins les plus proches.</div><div class="retailerQuotes">${baskets.map(b=>`<div class="retailerWrap ${b.retailerKey===best?'best':''}">${b.retailerKey===best?'<span class="bestBadge">Meilleur panier comparable</span>':''}${quoteRetailerCard(b,catalog.retailers[b.retailerKey],catalog)}</div>`).join('')}</div><div class="livePriceNote"><b>Comment lire ce chiffrage ?</b><p>Le carrelage, la colle et le joint utilisent des produits repères relevés chez les enseignes. Les accessoires encore sans référence vérifiée restent marqués « estimé ». Le total devient réellement magasin-par-magasin à mesure que chaque ligne dispose d’un flux tarifaire local.</p></div>`;
  }catch(e){body.innerHTML='<div class="diagnostic danger"><b>Catalogue de prix indisponible</b><p>Réessaie dans quelques instants. L’estimation technique du chantier reste disponible.</p></div>';}
}

async function priceUseMyLocation(){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  if(!navigator.geolocation){el.textContent='Géolocalisation non disponible.';return;}
  el.innerHTML='<div class="storeLoading">Recherche des enseignes proches…</div>';
  navigator.geolocation.getCurrentPosition(pos=>priceFindStores(pos.coords.latitude,pos.coords.longitude),()=>{el.textContent='Localisation refusée. Entre ton code postal à la place.';},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
}
async function priceUsePostcode(){
  const cp=(document.getElementById('quotePostcode')?.value||'').trim(),el=document.getElementById('priceStoreSummary');if(!/^\d{5}$/.test(cp)){if(el)el.textContent='Entre un code postal français à 5 chiffres.';return;}
  if(el)el.innerHTML='<div class="storeLoading">Recherche de la zone…</div>';
  try{const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=fr&postalcode=${encodeURIComponent(cp)}&limit=1`,{headers:{'Accept':'application/json'}});const d=await r.json();if(!d[0])throw new Error();await priceFindStores(Number(d[0].lat),Number(d[0].lon),cp);}catch(_){if(el)el.textContent='Impossible de localiser ce code postal pour le moment.';}
}
async function priceFindStores(lat,lon,label='ta position'){
  const el=document.getElementById('priceStoreSummary');if(!el)return;
  try{
    const q=`[out:json][timeout:25];(nwr[\"name\"~\"Leroy Merlin|Castorama|Brico Dépôt|Brico Depot\",i](around:60000,${lat},${lon}););out center tags;`;
    const r=await fetch('https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q));const d=await r.json();
    let stores=(d.elements||[]).map(e=>{const la=e.lat||e.center?.lat,lo=e.lon||e.center?.lon;if(!la||!lo)return null;const name=e.tags?.name||e.tags?.brand||'',key=retailerKeyFromName(name);if(!key)return null;const address=[e.tags?.['addr:housenumber'],e.tags?.['addr:street'],e.tags?.['addr:city']].filter(Boolean).join(' ');return {key,name,address,lat:la,lon:lo,km:haversine(lat,lon,la,lo)};}).filter(Boolean).sort((a,b)=>a.km-b.km);
    const nearest={};for(const s of stores)if(!nearest[s.key])nearest[s.key]=s;
    Object.entries(nearest).forEach(([key,s])=>{const target=document.getElementById('distance-'+key);if(target)target.innerHTML=`📍 ${s.km.toFixed(1)} km · ${esc(s.address||s.name)} <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}">Itinéraire ↗</a>`;});
    const found=Object.values(nearest);el.innerHTML=found.length?`<b>${found.length} enseigne${found.length>1?'s':''} associée${found.length>1?'s':''}</b> autour de ${esc(label)}. Les distances sont calculées à vol d’oiseau.`:'Aucune des trois enseignes trouvée dans un rayon de 60 km.';
  }catch(_){el.textContent='La recherche des magasins ne répond pas. Tu peux quand même consulter les prix de référence et leurs sources.';}
}
