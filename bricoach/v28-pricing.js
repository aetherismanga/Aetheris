/* Bricoach V28 — chiffrage de référence avec liens magasins pour 3 nouveaux métiers */
(function(){
const V28_PRICE_DATE='2026-08-24';
const V28_REF={
 leroymerlin:{
  name:'Leroy Merlin',
  'Plomberie / sanitaire':{name:'Tube multicouche gainé bleu Ø16 — couronne 50 m EQUATION',price:89.90,pack:50,unit:'50 m',url:'https://www.leroymerlin.fr/produits/tube-multicouche-gaine-bleu-16-en-couronne-de-50m-equation-84850996.html',verified:true},
  'Électricité':{name:'Câble électrique U1000R2V 3G2,5 mm² — 100 m',price:135,pack:100,unit:'100 m',url:'https://www.leroymerlin.fr/produits/cable-electrique-3g2-5-u1000r2v-l-100-m-noir-70808815.html',verified:true},
  'Maçonnerie':{name:'Béton prêt à l’emploi SACAMAT — 35 kg',price:4.49,pack:35,unit:'sac 35 kg',url:'https://www.leroymerlin.fr/produits/beton-pret-a-emploi-sacamat-35-kg-89224180.html',verified:true}
 },
 castorama:{
  name:'Castorama',
  'Plomberie / sanitaire':{name:'Couronne tube multicouche nu Ø16 — 50 m',price:52.90,pack:50,unit:'50 m',url:'https://www.castorama.fr/couronne-tube-multicouche-nu-16-mm-l-50-m/3540730043146_CAFR.prd',verified:true},
  'Électricité':{name:'Câble électrique U1000R2V 3X2,5 mm² — 100 m',price:139.90,pack:100,unit:'100 m',url:'https://www.castorama.fr/cable-electrique-u1000r2v-3x2-5-mm-100-m/3427500884041_CAFR.prd',verified:true},
  'Maçonnerie':{name:'Béton 35 kg pour fondations, ancrages et dalles',price:5.99,pack:35,unit:'sac 35 kg',url:'https://www.castorama.fr/materiaux-et-gros-oeuvre/materiau-poudre-et-agregat/beton-ciment-mortier-ragreage/beton/cat_id_5024.cat',verified:true}
 },
 bricodepot:{
  name:'Brico Dépôt',
  'Plomberie / sanitaire':{name:'Couronne tube multicouche D16 — 50 m Somatherm',price:49.90,pack:50,unit:'50 m',url:'https://www.bricodepot.fr/catalogue/construction-renovation/plomberie/alimentation-en-eau/tube-raccord-multicouche/',verified:false,local:true},
  'Électricité':{name:'Couronne câble R2V 3G2,5 mm² — 100 m',price:89.90,pack:100,unit:'100 m',url:'https://www.bricodepot.fr/catalogue/construction-renovation/electricite/cable-fil-gaine-tube-amp-accessoires/cable-dinstallation-fil-electrique/',verified:false,local:true},
  'Maçonnerie':{name:'Béton universel travaux courants — 35 kg',price:4.90,pack:35,unit:'sac 35 kg',url:'https://www.bricodepot.fr/catalogue/chainage-carre-pour-solidarisation-des-murs-et-planchers-fondations-l-6m-section-10-x-10-cm/prod11436/',verified:false,local:true}
 }
};
const NEW=['Plomberie / sanitaire','Électricité','Maçonnerie'];
function round(v){return Math.round((Number(v)||0)*100)/100}
function retailerKey(retailer){const n=String(retailer?.name||'').toLowerCase();return n.includes('leroy')?'leroymerlin':n.includes('casto')?'castorama':n.includes('brico')?'bricodepot':''}
function coreUse(p,ref){const d=p.details||{},cat=p.category;
 if(cat==='Plomberie / sanitaire'){
  const type=d.plumbingType||'Alimentation multicouche',L=Math.max(1,Number(d.pipeLength)||Number(p.area)||10);
  if(type==='Alimentation multicouche')return {matches:true,count:Math.ceil(L/ref.pack),qty:`${Math.ceil(L/ref.pack)} × ${ref.unit} pour ≈ ${L} m de réseau`,name:'Tube multicouche'};
  return {matches:false,count:1,qty:'Référence de prix du rayon plomberie',name:type};
 }
 if(cat==='Électricité'){
  const type=d.electricType||'Prises de courant',L=Math.max(1,Number(d.cableLength)||25);
  const exact=type==='Prises de courant' || (type==='Circuit spécialisé' && String(d.cableSection||'').includes('2,5'));
  return {matches:exact,count:exact?Math.ceil(L/ref.pack):1,qty:exact?`${Math.ceil(L/ref.pack)} × ${ref.unit} pour ≈ ${L} m`:'Référence de prix du rayon électricité',name:exact?'Câble 3G2,5':type};
 }
 const type=d.masonryType||'Dalle béton',a=Math.max(.1,Number(p.area)||1),th=Math.max(.5,Number(d.thickness)||10),exact=['Dalle béton','Scellement / petit béton'].includes(type);let bags=1;
 if(type==='Dalle béton'){const vol=a*th/100;bags=Math.max(1,Math.ceil(vol/0.017));}
 else if(type==='Scellement / petit béton')bags=Math.max(1,Math.ceil(a*2));
 return {matches:exact,count:exact?bags:1,qty:exact?`${bags} × ${ref.unit}`:'Référence de prix du rayon maçonnerie',name:exact?'Béton prêt à l’emploi':type};
}
function categoryUrl(key,cat){if(key==='leroymerlin')return cat==='Plomberie / sanitaire'?'https://www.leroymerlin.fr/produits/plomberie/':cat==='Électricité'?'https://www.leroymerlin.fr/produits/electricite-domotique/':'https://www.leroymerlin.fr/produits/materiaux/beton-ciment-mortier-et-poudre/';if(key==='castorama')return cat==='Plomberie / sanitaire'?'https://www.castorama.fr/plomberie/':cat==='Électricité'?'https://www.castorama.fr/electricite/':'https://www.castorama.fr/materiaux-et-gros-oeuvre/materiau-poudre-et-agregat/beton-ciment-mortier-ragreage/cat_id_667.cat';return cat==='Plomberie / sanitaire'?'https://www.bricodepot.fr/catalogue/construction-renovation/plomberie/':cat==='Électricité'?'https://www.bricodepot.fr/catalogue/construction-renovation/electricite/':'https://www.bricodepot.fr/catalogue/construction-renovation/materiaux/';}
function qFor(p,key,retailer){const ref=V28_REF[key]?.[p.category];if(!ref)return {key,retailer,unsupported:true,lines:[],total:0,verified:false};const use=coreUse(p,ref),corePrice=round(ref.price*use.count),range=p.range||'Standard',factor=range==='Éco'?.82:range==='Premium'?1.45:1,totalTarget=Math.max(corePrice,round((typeof v14EstimateWork==='function'?v14EstimateWork(p):100)*factor)),materials=(p.materials?.length?p.materials:buildMaterials(p.category,p.area,p.details||{}))||[],others=materials.filter(m=>!new RegExp(use.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(String(m[0]))),rest=Math.max(0,totalTarget-corePrice),each=others.length?rest/others.length:0;
 const lines=[{name:use.name,product:ref.name,qty:use.qty,price:corePrice,unit:`${ref.price.toFixed(2)} € / ${ref.unit}`,url:ref.url,verified:!!ref.verified&&use.matches}];
 others.slice(0,8).forEach(m=>lines.push({name:m[0],product:`Référence ${range} à sélectionner chez ${retailer.name}`,qty:m[1]||'Selon chantier',price:round(each),url:categoryUrl(key,p.category),verified:false}));
 const total=round(lines.reduce((s,l)=>s+Number(l.price||0),0));return {key,retailer,product:ref,lines,total,verified:!!ref.verified&&use.matches,band:`Gamme ${range} · relevé ${new Date(V28_PRICE_DATE).toLocaleDateString('fr-FR')}${ref.local?' · prix variable selon dépôt':''}`};
}
const baseQuote=v12QuoteForRetailer;
v12QuoteForRetailer=function(p,key,retailer,catalog,oldCatalog){if(NEW.includes(p.category)){const k=key||retailerKey(retailer);return qFor(p,k,retailer)}return baseQuote(p,key,retailer,catalog,oldCatalog)};

/* Afficher clairement la date et la nature des prix. */
try{const baseCard=v21RetailerCard;v21RetailerCard=function(q,best){let h=baseCard(q,best);if(q&&!q.unsupported&&NEW.includes(v21QuoteData?.entries?.find(e=>e.quotes?.includes(q))?.w?.category||''))h=h.replace('Prix web de référence · le prix du magasin peut varier',`Prix web de référence relevé le ${new Date(V28_PRICE_DATE).toLocaleDateString('fr-FR')} · le prix magasin peut varier`);return h}}catch(_){}
})();