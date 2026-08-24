let BRICOACH_V12_CATALOG=null;
const BRICOACH_V12_PRICE_FILE='./price-catalog-v12.json';

async function loadPriceCatalogV12(){
  if(BRICOACH_V12_CATALOG)return BRICOACH_V12_CATALOG;
  const r=await fetch(BRICOACH_V12_PRICE_FILE+'?t='+Date.now(),{cache:'no-store'});
  if(!r.ok)throw new Error('catalogue V12 indisponible');
  BRICOACH_V12_CATALOG=await r.json();
  return BRICOACH_V12_CATALOG;
}

try{
  ranges[0][1]='Entrée de gamme';
  ranges[1][1]='Bon rapport qualité / prix';
  ranges[2][1]='Haut de gamme';
}catch(_){}

function v12BandText(cat,range,catalog){return catalog?.bands?.[cat]?.[range]?.label||''}
function v12Round(v){return Math.round(Number(v||0)*100)/100}
function v12Waste(p){
  const d=p.details||{};
  if(p.category==='Carrelage')return 1+tileLoss(ensureWizardDetails({...d}));
  if(p.category==='Sol / parquet')return d.floorInstall==='Collée'?1.10:1.08;
  if(p.category==='Placo / isolation')return 1.08;
  return 1;
}
function v12CoreQuantity(p){
  const area=Math.max(1,Number(p.area)||1),d=p.details||{};
  if(p.category==='Carrelage')return {qty:area*v12Waste(p),label:'m²'};
  if(p.category==='Peinture'){
    const coats=2,coverage=10,litres=area*coats/coverage,pots=Math.max(1,Math.ceil(litres/10));
    return {qty:pots,label:'pot(s) 10 L',detail:`${litres.toFixed(1)} L calculés pour ${coats} couches`};
  }
  if(p.category==='Sol / parquet')return {qty:area*v12Waste(p),label:'m²'};
  return {qty:area*v12Waste(p),label:'m² de plaque'};
}
function v12AccessoryLines(p,core,oldRetailer){
  const area=Math.max(1,Number(p.area)||1),d=ensureWizardDetails({...p.details});
  const lines=[];
  if(p.category==='Carrelage'){
    let kgm2=4.5;if(['60 × 120','80 × 80'].includes(d.tileFormat))kgm2=5.5;if(d.tileFormat==='120 × 120')kgm2=6.5;
    const bags=Math.max(1,Math.ceil(area*kgm2/25));
    const jointKg=Math.max(2,Math.ceil(area*(d.tileFormat==='30 × 60'?.4:.25))),jointPacks=Math.max(1,Math.ceil(jointKg/5));
    const glue=oldRetailer?selectGlue(oldRetailer,{d}):null,joint=oldRetailer?.joint||null;
    if(glue)lines.push({name:'Colle carrelage',product:glue.name,qty:`${bags} × ${glue.unit}`,price:v12Round(bags*glue.unitPrice),url:glue.url,verified:true});
    else lines.push({name:'Colle carrelage',product:'Référence adaptée au format à sélectionner',qty:`${bags} sacs estimés`,price:v12Round(bags*19.9),verified:false});
    if(joint)lines.push({name:'Joint',product:joint.name,qty:`${jointPacks} × ${joint.unit}`,price:v12Round(jointPacks*joint.unitPrice),url:joint.url,verified:true});
    else lines.push({name:'Joint',product:'Référence hydrofuge à sélectionner',qty:`≈ ${jointKg} kg`,price:v12Round(jointKg*3.5),verified:false});
    lines.push({name:'Primaire + nivelants'+(d.wetArea?' + étanchéité':''),product:'Panier accessoires calculé par Bricoach',qty:'selon chantier',price:v12Round((area/10*24)+(area*14/100*11.9)+(d.wetArea?69:0)),verified:false});
  }else if(p.category==='Peinture'){
    const undercoat=Math.max(1,Math.ceil(area/100));
    if(d.paintState!=='Bon état')lines.push({name:'Sous-couche',product:'Sous-couche adaptée au support',qty:`${undercoat} pot(s) indicatif(s)`,price:v12Round(undercoat*39.9),verified:false});
    lines.push({name:'Protection / consommables',product:'Bâches, ruban, rouleaux et manchons',qty:'1 lot',price:35,verified:false});
  }else if(p.category==='Sol / parquet'){
    lines.push({name:'Sous-couche',product:'Sous-couche adaptée au support',qty:`${Math.ceil(area*1.05)} m²`,price:v12Round(area*1.05*2.5),verified:false});
    lines.push({name:'Plinthes / finitions',product:'Estimation Bricoach',qty:'selon périmètre',price:v12Round(Math.max(25,area*2.2)),verified:false});
  }else{
    lines.push({name:'Ossature',product:'Rails + montants',qty:'selon entraxe et dimensions',price:v12Round(area*5.5),verified:false});
    if(d.insulation&&d.insulation!=='Sans isolant')lines.push({name:'Isolation',product:d.insulation,qty:`≈ ${Math.ceil(area)} m²`,price:v12Round(area*8.5),verified:false});
    lines.push({name:'Vis + bandes + enduit',product:'Lot de finition',qty:'1 lot',price:v12Round(Math.max(35,area*2.5)),verified:false});
  }
  return lines;
}
function v12QuoteForRetailer(p,key,retailer,catalog,oldCatalog){
  const range=p.range||'Standard',product=retailer.products?.[p.category]?.[range],core=v12CoreQuantity(p);
  if(!product)return {key,retailer,unsupported:true,lines:[],total:0,verified:false};
  let corePrice=0;
  if(p.category==='Peinture')corePrice=core.qty*product.price; else corePrice=core.qty*product.price;
  const coreLine={name:p.category==='Peinture'?'Peinture de finition':p.category==='Placo / isolation'?'Plaques':p.category==='Sol / parquet'?'Revêtement':'Carrelage',product:product.name,qty:`${core.qty.toFixed(p.category==='Peinture'?0:1)} ${core.label}${core.detail?' · '+core.detail:''}`,price:v12Round(corePrice),unit:`${product.price.toFixed(2)} ${product.unit}`,url:product.url,verified:!!product.verified};
  const oldRetailer=oldCatalog?.retailers?.[key]||null;
  const lines=[coreLine,...v12AccessoryLines(p,core,oldRetailer)],total=v12Round(lines.reduce((s,l)=>s+l.price,0));
  return {key,retailer,product,core,lines,total,verified:!!product.verified,band:v12BandText(p.category,range,catalog)};
}
function v12SourceBadge(line){return line.verified?'<span class="verifyBadge ok">Prix relevé</span>':'<span class="verifyBadge warn">À confirmer</span>'}
function v12QuoteCard(q,p){
  if(q.unsupported)return '';
  return `<div class="retailerWrapV12 ${q.verified?'verified':'unverified'}"><div class="retailerQuoteV12"><div class="retailerHeadV12"><div><b>${esc(q.retailer.name)}</b><small>${esc(q.band)}</small></div><strong>≈ ${formatEuro(q.total)}</strong></div><div class="retailerDistance" id="distance-${q.key}">📍 Magasin non localisé</div><div class="v12Lines">${q.lines.map(l=>`<div class="v12Line"><div><b>${esc(l.name)}</b><small>${esc(l.qty)}</small><span>${esc(l.product)}</span>${v12SourceBadge(l)}</div><div class="v12Money"><strong>${formatEuro(l.price)}</strong>${l.unit?`<small>${esc(l.unit)}</small>`:''}${l.url?`<a href="${l.url}" target="_blank" rel="noopener">Voir le tarif ↗</a>`:''}</div></div>`).join('')}</div>${!q.verified?'<div class="quoteUnverified">⚠️ Le produit principal de cette enseigne est une référence de gamme à vérifier dans le magasin/dépôt choisi. Il n’entre pas dans le classement du meilleur panier.</div>':''}</div></div>`;
}

async function openLocalQuote(id){
  const p=projects.find(x=>x.id===id);if(!p)return;
  document.querySelector('#quoteModal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="quoteModal"><div class="modal quoteModal quoteModalV12"><div class="wizardTop"><div><div class="eyebrow">CHIFFRAGE PRODUITS</div><h2>${esc(p.title)}</h2></div><button class="close" onclick="document.querySelector('#quoteModal').remove()">✕</button></div><div id="quoteLiveBody"><div class="storeLoading">Calcul du panier ${esc(p.range||'Standard')}…</div></div></div></div>`);
  const body=document.getElementById('quoteLiveBody');
  try{
    const catalog=await loadPriceCatalogV12();let oldCatalog=null;try{oldCatalog=await loadPriceCatalog()}catch(_){}
    const band=v12BandText(p.category,p.range||'Standard',catalog);
    const quotes=Object.entries(catalog.retailers).map(([k,r])=>v12QuoteForRetailer(p,k,r,catalog,oldCatalog));
    const ranked=quotes.filter(q=>q.verified&&!q.unsupported).sort((a,b)=>a.total-b.total),best=ranked[0]?.key;
    body.innerHTML=`<div class="tierBanner"><div><span>Gamme ${esc(p.range||'Standard')}</span><b>${esc(band)}</b></div><small>${esc(p.category)} · prix produits relevés le ${new Date(catalog.updatedAt).toLocaleDateString('fr-FR')}</small></div><div class="quoteWarning">Les tranches Éco, Standard et Premium sont maintenant réellement séparées. Le prix local peut varier selon le magasin, le dépôt, une promotion ou le stock. Chaque ligne vérifiée possède son lien tarif.</div><div class="locationControls"><button class="btn primary" onclick="priceUseMyLocation()">📍 Autour de moi</button><div class="postcodeBox"><input id="quotePostcode" inputmode="numeric" maxlength="5" placeholder="Code postal"><button class="btn soft" onclick="priceUsePostcode()">Rechercher</button></div></div><div id="priceStoreSummary" class="storeSummary">Choisis ta position pour rattacher le chiffrage aux magasins les plus proches.</div><div class="v12Quotes">${quotes.map(q=>`<div class="v12Rank ${q.key===best?'best':''}">${q.key===best?'<div class="bestBadgeV12">Meilleur panier vérifié</div>':''}${v12QuoteCard(q,p)}</div>`).join('')}</div><div class="livePriceNote"><b>Ce qui est automatique</b><p>Bricoach calcule la quantité du produit principal selon la surface et le métier, applique la gamme choisie, ajoute les fournitures nécessaires puis totalise le panier. Les lignes marquées « À confirmer » restent des estimations tant qu’une référence magasin exacte n’a pas été relevée.</p></div>`;
  }catch(e){body.innerHTML='<div class="diagnostic danger"><b>Catalogue de prix indisponible</b><p>Réessaie dans quelques instants.</p></div>';}
}

function injectV12BandHint(){
  const choices=document.querySelector('.rangeChoices');if(!choices||document.querySelector('.rangeBandHint')||!wizard)return;
  loadPriceCatalogV12().then(c=>{
    if(!document.querySelector('.rangeChoices')||document.querySelector('.rangeBandHint'))return;
    const bands=c.bands?.[wizard.category];if(!bands)return;
    choices.insertAdjacentHTML('afterend',`<div class="rangeBandHint"><b>Repères de prix ${esc(wizard.category)}</b><div><span>Éco</span>${esc(bands['Éco'].label)}</div><div><span>Standard</span>${esc(bands['Standard'].label)}</div><div><span>Premium</span>${esc(bands['Premium'].label)}</div></div>`);
  }).catch(()=>{});
}
try{
  const renderWizardBeforeV12=renderWizard;
  renderWizard=function(){renderWizardBeforeV12();setTimeout(injectV12BandHint,0)};
}catch(_){}
