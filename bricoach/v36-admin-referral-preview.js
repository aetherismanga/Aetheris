/* BRICOACH V36 — aperçu admin du parrainage */
(() => {
  'use strict';
  const cloud = window.bricoachSupabase;
  if (!cloud || typeof window.bcOpenPlans !== 'function') return;
  const ADMIN_EMAIL='ccjacou@gmail.com';
  let admin=false, profile=null, rows=[];

  async function refresh(){
    try{
      const {data:{session}}=await cloud.auth.getSession();
      admin=String(session?.user?.email||'').toLowerCase()===ADMIN_EMAIL;
      if(!admin)return;
      const uid=session.user.id;
      const p=await cloud.from('profiles').select('referral_code').eq('id',uid).single();
      profile=p.data||null;
      const r=await cloud.from('referrals').select('status').eq('referrer_id',uid);
      rows=r.data||[];
    }catch(_){}
  }
  refresh();
  cloud.auth.onAuthStateChange(()=>setTimeout(refresh,0));

  const base=window.bcOpenPlans;
  window.bcOpenPlans=function(){
    base();
    setTimeout(()=>{
      if(!admin||!profile?.referral_code)return;
      const panel=document.querySelector('#bcPlansModal .bcPlansPanel');
      if(!panel||panel.querySelector('.v36AdminReferralPreview'))return;
      const q=rows.filter(x=>x.status==='qualified').length,p=rows.filter(x=>x.status==='pending').length;
      const note=panel.querySelector('.bcAdminNote');
      const html=`<section class="v36ReferralBox v36AdminReferralPreview"><div class="v36ReferralIcon">🎁</div><div class="v36ReferralCopy"><h3>Parrainage — aperçu administrateur</h3><p>Les utilisateurs voient : <b>Invite 3 proches = 14 jours de Bricoach+ offerts</b>. Test actuel : ${Math.min(q,3)}/3 confirmé${q>1?'s':''}${p?` · ${p} en attente`:''}.</p><small>Seuls les comptes créés via le lien/code et dont l’e-mail est confirmé comptent. Récompense accordée une seule fois.</small></div><div class="v36ReferralActions"><button onclick="v36ShareReferral()">Tester le partage</button><button class="soft" onclick="v36CopyReferral()">Code ${profile.referral_code}</button></div></section>`;
      if(note)note.insertAdjacentHTML('beforebegin',html);else panel.insertAdjacentHTML('beforeend',html);
    },60);
  };
})();