/* BRICOACH V34 — auth Supabase stable + forfaits */
(() => {
  'use strict';
  const SUPABASE_URL='https://yomwhpfdvmemvdolajsb.supabase.co';
  const SUPABASE_KEY='sb_publishable_huN7AcJuKl7Hy7q6tknBGw_7DmsMCIP';
  const ADMIN_EMAIL='ccjacou@gmail.com';
  let session=null;
  let authReady=false;

  if(!window.supabase?.createClient){
    console.error('[BRICOACH] Supabase indisponible');
    return;
  }

  const cloud=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  window.bricoachSupabase=cloud;

  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isAdmin=()=>String(session?.user?.email||'').toLowerCase()===ADMIN_EMAIL;
  const plan=()=>isAdmin()?'max':String(session?.user?.user_metadata?.plan||'free').toLowerCase();
  const planLabel=()=>plan()==='max'?'BRICOACH MAX':plan()==='plus'?'BRICOACH+':'GRATUIT';
  window.bcPlan=plan;
  window.bcIsAdmin=isAdmin;

  function toast(msg){
    document.querySelector('.bcAuthToast')?.remove();
    const n=document.createElement('div');n.className='bcAuthToast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),2800);
  }
  function message(text,error=false){
    const n=document.getElementById('bcAuthMessage');if(!n)return;n.textContent=text;n.className='bcAuthMessage show'+(error?' error':'');
  }
  function authScreen(){
    return `<div class="bcAuthScreen" id="bcAuthScreen"><div class="bcAuthWrap"><section class="bcAuthVisual"><div class="bcAuthBrand"><img src="./icon.svg" alt="BRICOACH"><div><b><span>BRI</span>COACH</b><small>Ton coach travaux</small></div></div><div class="bcAuthVisualMain"><div class="bcAuthEyebrow">PLANIFIE · RÉALISE · PROFITE</div><h1>Bienvenue<br><span>chez Bricoach 👋</span></h1><p>Prépare tes travaux, calcule tes matériaux, suis tes dépenses et avance étape par étape.</p></div><div class="bcAuthMini"><span>✓ Tutoriels par niveau</span><span>✓ Calculs matériaux</span><span>✓ Suivi chantier</span><span>✓ Coach travaux</span></div></section><section class="bcAuthCard"><h2>Se connecter</h2><p>Retrouve Bricoach et tes réglages sur cet appareil.</p><div id="bcAuthMessage" class="bcAuthMessage"></div><div class="bcAuthField"><label>Adresse e-mail</label><input id="bcAuthEmail" type="email" autocomplete="email" placeholder="ton@email.fr"></div><div class="bcAuthField"><label>Mot de passe</label><input id="bcAuthPassword" type="password" autocomplete="current-password" placeholder="Ton mot de passe"></div><button class="bcAuthPrimary" onclick="bcSignIn()">Se connecter →</button><button class="bcAuthLink" onclick="bcResetPassword()">Mot de passe oublié ?</button><div class="bcAuthDivider">ou</div><button class="bcAuthSecondary" onclick="bcSignUp()">Créer mon compte gratuitement</button><div class="bcAuthLegal">En continuant, tu acceptes les conditions d’utilisation et la politique de confidentialité de Bricoach.</div></section></div></div>`;
  }
  function showLogin(){
    if(document.getElementById('bcAuthScreen'))return;
    document.body.insertAdjacentHTML('beforeend',authScreen());
    const email=document.getElementById('bcAuthEmail');if(email&&ADMIN_EMAIL)email.value=ADMIN_EMAIL;
  }
  function hideLogin(){document.getElementById('bcAuthScreen')?.remove()}

  function decoratePlan(){
    if(!session?.user)return;
    const top=document.querySelector('.top');if(!top)return;
    let b=top.querySelector('.bcPlanBadge');
    if(!b){b=document.createElement('button');b.type='button';b.className='bcPlanBadge';b.onclick=()=>window.bcOpenPlans();top.appendChild(b)}
    b.className='bcPlanBadge '+plan();
    b.innerHTML=`<span>${isAdmin()?'👑':'●'}</span><span>${planLabel()}</span>`;
  }

  const plans={
    free:{title:'GRATUIT',price:'0 €',desc:'Pour découvrir Bricoach et réaliser son premier chantier.',features:['1 chantier actif','Calculateurs de tous les métiers','Liste matériaux et outils','Tutoriels et vidéos','Suivi simple des dépenses','PDF basique','Coach limité']},
    plus:{title:'BRICOACH+',price:'5,99 €',suffix:'/mois',desc:'Pour gérer tous ses travaux de A à Z.',features:['Chantiers illimités','Projets multi-pièces','Chiffrage Éco / Standard / Premium','Prix et liens magasins','Inventaire Mon matériel','Suivi détaillé des dépenses','PDF complet et planning','Tutoriels et vidéothèque complets']},
    max:{title:'BRICOACH MAX',price:'9,99 €',suffix:'/mois',desc:'Bricoach+ avec le Coach IA et l’analyse photo.',features:['Tout Bricoach+','Coach IA avancé','Analyse photo chantier','Diagnostic guidé','Aide personnalisée en cas d’imprévu','Comparaison de produits','Conseils contextualisés par projet']}
  };
  function planCard(key){const p=plans[key],current=plan()===key,admin=isAdmin();return `<article class="bcPlanCard ${key==='plus'?'reco':''}">${key==='plus'?'<div class="bcPlanRibbon">RECOMMANDÉ</div>':''}<h3>${p.title}</h3><div class="bcPlanPrice">${p.price} <small>${p.suffix||''}</small></div><div class="bcPlanDesc">${p.desc}</div><div class="bcPlanFeatures">${p.features.map(f=>`<span>${f}</span>`).join('')}</div><button class="bcPlanAction ${current?'current':'soon'}" type="button">${current?'Votre forfait':admin?'Disponible pour les utilisateurs — bientôt':'Bientôt disponible'}</button></article>`}
  window.bcOpenPlans=()=>{
    document.getElementById('bcPlansModal')?.remove();
    document.body.insertAdjacentHTML('beforeend',`<div class="bcPlansModal" id="bcPlansModal"><div class="bcPlansPanel"><div class="bcPlansHead"><div><h2>Choisis ton Bricoach</h2><p>Tu utilises actuellement <b>${planLabel()}</b>.</p></div><button class="bcPlansClose" onclick="bcClosePlans()">×</button></div><div class="bcPlansGrid">${planCard('free')}${planCard('plus')}${planCard('max')}</div>${isAdmin()?'<div class="bcAdminNote">👑 Compte administrateur : BRICOACH MAX est activé automatiquement et toutes les fonctions sont accessibles.</div>':''}</div></div>`);
  };
  window.bcClosePlans=()=>document.getElementById('bcPlansModal')?.remove();

  window.bcSignIn=async()=>{
    const email=document.getElementById('bcAuthEmail')?.value.trim();const password=document.getElementById('bcAuthPassword')?.value||'';
    if(!email||!password)return message('Renseigne ton e-mail et ton mot de passe.',true);
    message('Connexion en cours…');
    const {error}=await cloud.auth.signInWithPassword({email,password});
    if(error)return message('Connexion impossible : '+error.message,true);
  };
  window.bcSignUp=async()=>{
    const email=document.getElementById('bcAuthEmail')?.value.trim();const password=document.getElementById('bcAuthPassword')?.value||'';
    if(!email)return message('Entre une adresse e-mail valide.',true);
    if(password.length<6)return message('Pour sécuriser le compte, Supabase exige un mot de passe d’au moins 6 caractères.',true);
    message('Création du compte…');
    const {data,error}=await cloud.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname,data:{display_name:email.split('@')[0],plan:'free'}}});
    if(error)return message('Création impossible : '+error.message,true);
    if(!data.session)return message('Compte créé. Vérifie ton e-mail pour confirmer ton adresse, puis reconnecte-toi.');
    toast('Compte créé ✓');
  };
  window.bcResetPassword=async()=>{
    const email=document.getElementById('bcAuthEmail')?.value.trim();if(!email)return message('Entre d’abord ton adresse e-mail.',true);
    const {error}=await cloud.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
    if(error)return message(error.message,true);message('Un e-mail de réinitialisation vient d’être envoyé.');
  };
  window.bcLogout=async()=>{await cloud.auth.signOut();toast('Déconnecté.');};

  function applySession(next){session=next||null;authReady=true;if(session?.user){hideLogin();requestAnimationFrame(decoratePlan)}else showLogin()}

  cloud.auth.onAuthStateChange((_event,next)=>setTimeout(()=>applySession(next),0));
  cloud.auth.getSession().then(({data,error})=>{if(error){console.error('[BRICOACH] auth',error);showLogin();return}applySession(data?.session||null)}).catch(err=>{console.error('[BRICOACH] auth init',err);showLogin()});

  try{
    const baseRender=render;
    render=function(){baseRender();requestAnimationFrame(()=>{if(session?.user)decoratePlan()})};
  }catch(_){}
})();