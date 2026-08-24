/* BRICOACH V36 — prénom, onboarding métiers et parrainage */
(() => {
  'use strict';

  const cloud = window.bricoachSupabase;
  if (!cloud) return;

  const ADMIN_EMAIL = 'ccjacou@gmail.com';
  const REF_KEY = 'bricoach-referral-code';
  const TRADES = [
    ['Carrelage','🧱'],
    ['Peinture','🎨'],
    ['Sol / parquet / vinyle','🪵'],
    ['Placo / isolation','🧰'],
    ['Plomberie / sanitaire','🚿'],
    ['Électricité','⚡'],
    ['Maçonnerie','🧱']
  ];
  const LEVELS = ['Non concerné','Débutant','Bricoleur','Confirmé','Expert'];

  let currentUser = null;
  let currentProfile = null;
  let referralRows = [];

  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalizeCode = value => String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,16);

  try {
    const fromUrl = normalizeCode(new URLSearchParams(location.search).get('ref'));
    if (fromUrl) localStorage.setItem(REF_KEY, fromUrl);
  } catch (_) {}

  function metaName(user) {
    const meta = user?.user_metadata || {};
    const value = String(meta.first_name || meta.display_name || '').trim();
    return value ? value.split(/\s+/)[0] : '';
  }

  function displayName() {
    const profile = String(currentProfile?.display_name || '').trim();
    if (profile) return profile.split(/\s+/)[0];
    const meta = metaName(currentUser);
    if (meta && !/^ccjacou$/i.test(meta)) return meta;
    const email = String(currentUser?.email || '');
    if (email.toLowerCase() === ADMIN_EMAIL) return 'Jérôme';
    const fallback = email.split('@')[0].split(/[._-]/)[0] || 'toi';
    return fallback.charAt(0).toUpperCase() + fallback.slice(1);
  }

  function isAdmin() {
    return String(currentUser?.email || '').toLowerCase() === ADMIN_EMAIL;
  }

  function bonusActive() {
    const until = currentProfile?.referral_bonus_until;
    return until && new Date(until).getTime() > Date.now();
  }

  function effectivePlan() {
    if (isAdmin()) return 'max';
    const base = String(currentProfile?.plan || currentUser?.user_metadata?.plan || 'free').toLowerCase();
    if (base === 'max') return 'max';
    if (base === 'plus' || bonusActive()) return 'plus';
    return 'free';
  }

  function planLabel() {
    return effectivePlan() === 'max' ? 'BRICOACH MAX' : effectivePlan() === 'plus' ? 'BRICOACH+' : 'GRATUIT';
  }

  function patchHeader() {
    if (typeof tab === 'undefined' || tab !== 'home') return;
    const top = document.querySelector('.main > .top');
    if (!top) return;
    top.classList.add('v36Top');

    const greeting = top.querySelector('.v29TopLeft h1');
    if (greeting && currentUser) {
      greeting.innerHTML = `<span class="v36Hello">Bonjour</span><span class="v36UserName">${safe(displayName())}</span>`;
    }

    const actions = top.querySelector('.v29TopActions, .v21TopActions');
    if (actions) actions.classList.add('v36Actions');

    const badge = top.querySelector('.bcPlanBadge');
    if (badge && currentUser) {
      badge.className = `bcPlanBadge v36PlanBadge ${effectivePlan()}`;
      badge.innerHTML = `<span>${isAdmin() ? '👑' : effectivePlan()==='plus' ? '🔨' : '●'}</span><span>${planLabel()}</span>`;
      badge.onclick = () => window.bcOpenPlans();
    }
  }

  async function loadAccount(user) {
    currentUser = user || null;
    currentProfile = null;
    referralRows = [];
    if (!currentUser) return;

    try {
      const { data, error } = await cloud
        .from('profiles')
        .select('id,display_name,postal_code,trade_levels,plan,referral_code,referred_by,referral_bonus_until,referral_reward_count,onboarding_complete')
        .eq('id', currentUser.id)
        .single();
      if (!error) currentProfile = data;
    } catch (_) {}

    try {
      const { data } = await cloud
        .from('referrals')
        .select('id,status,created_at,qualified_at')
        .eq('referrer_id', currentUser.id)
        .order('created_at', { ascending:false });
      referralRows = data || [];
    } catch (_) {}

    requestAnimationFrame(() => requestAnimationFrame(patchHeader));
  }

  cloud.auth.getSession().then(({data}) => loadAccount(data?.session?.user || null)).catch(() => {});
  cloud.auth.onAuthStateChange((_event, session) => setTimeout(() => loadAccount(session?.user || null), 0));

  try {
    const previousRender = render;
    render = function () {
      previousRender();
      requestAnimationFrame(() => requestAnimationFrame(patchHeader));
    };
  } catch (_) {}

  function signupLevelRows() {
    return TRADES.map(([trade, icon], index) => `
      <label class="v36TradeLevel">
        <span class="v36TradeName"><i>${icon}</i><b>${safe(trade)}</b></span>
        <select data-v36-trade="${safe(trade)}" aria-label="Niveau ${safe(trade)}">
          ${LEVELS.map(level => `<option value="${safe(level)}" ${level==='Débutant'?'selected':''}>${safe(level)}</option>`).join('')}
        </select>
      </label>`).join('');
  }

  function signupHtml() {
    const email = document.getElementById('bcAuthEmail')?.value.trim() || '';
    const password = document.getElementById('bcAuthPassword')?.value || '';
    const ref = normalizeCode(localStorage.getItem(REF_KEY));
    return `<div class="v36Onboard" id="v36Onboard">
      <div class="v36OnboardPanel">
        <div class="v36OnboardHead">
          <div><div class="v36Eyebrow">CRÉER MON COMPTE</div><h2>Personnalise Bricoach</h2><p>Quelques informations suffisent pour adapter les tutoriels, les calculs et les magasins proches.</p></div>
          <button type="button" onclick="v36CloseSignup()">×</button>
        </div>
        <div id="v36SignupMessage" class="bcAuthMessage"></div>
        <div class="v36AccountGrid">
          <div class="bcAuthField"><label>Prénom</label><input id="v36FirstName" autocomplete="given-name" maxlength="40" placeholder="Ex. Jérôme"></div>
          <div class="bcAuthField"><label>Code postal <small>— pour les magasins proches</small></label><input id="v36PostalCode" inputmode="numeric" maxlength="5" placeholder="34740"></div>
          <div class="bcAuthField"><label>Adresse e-mail</label><input id="v36Email" type="email" autocomplete="email" value="${safe(email)}" placeholder="ton@email.fr"></div>
          <div class="bcAuthField"><label>Mot de passe</label><input id="v36Password" type="password" autocomplete="new-password" value="${safe(password)}" placeholder="6 caractères minimum"></div>
        </div>
        <div class="v36LevelTitle"><div><b>Ton niveau par métier</b><span>Tu pourras tout modifier plus tard dans Paramètres.</span></div></div>
        <div class="v36TradeLevels">${signupLevelRows()}</div>
        <div class="bcAuthField v36ReferralField"><label>Code parrainage <small>— optionnel</small></label><input id="v36ReferralCode" value="${safe(ref)}" maxlength="16" placeholder="Ex. A1B2C3D4"></div>
        <div class="v36Privacy">Le code postal sert uniquement à améliorer la recherche de magasins et de prix à proximité.</div>
        <div class="v36OnboardActions"><button class="bcAuthSecondary" type="button" onclick="v36CloseSignup()">← Retour</button><button class="bcAuthPrimary" type="button" onclick="v36SubmitSignup()">Créer mon compte gratuitement →</button></div>
      </div>
    </div>`;
  }

  window.v36CloseSignup = () => document.getElementById('v36Onboard')?.remove();
  window.bcSignUp = () => {
    document.getElementById('v36Onboard')?.remove();
    document.body.insertAdjacentHTML('beforeend', signupHtml());
    setTimeout(() => document.getElementById('v36FirstName')?.focus(), 80);
  };

  function signupMessage(text, error=false) {
    const node = document.getElementById('v36SignupMessage');
    if (!node) return;
    node.textContent = text;
    node.className = 'bcAuthMessage show' + (error ? ' error' : '');
    node.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  window.v36SubmitSignup = async () => {
    const first = document.getElementById('v36FirstName')?.value.trim() || '';
    const postal = document.getElementById('v36PostalCode')?.value.trim() || '';
    const email = document.getElementById('v36Email')?.value.trim() || '';
    const password = document.getElementById('v36Password')?.value || '';
    const referral = normalizeCode(document.getElementById('v36ReferralCode')?.value || localStorage.getItem(REF_KEY));
    const levels = {};
    document.querySelectorAll('[data-v36-trade]').forEach(select => { levels[select.dataset.v36Trade] = select.value; });

    if (first.length < 2) return signupMessage('Indique ton prénom.', true);
    if (!/^\S+@\S+\.\S+$/.test(email)) return signupMessage('Entre une adresse e-mail valide.', true);
    if (password.length < 6) return signupMessage('Le mot de passe doit contenir au moins 6 caractères.', true);
    if (postal && !/^\d{5}$/.test(postal)) return signupMessage('Le code postal doit contenir 5 chiffres.', true);

    signupMessage('Création du compte…');
    const { data, error } = await cloud.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: location.origin + location.pathname,
        data: {
          first_name: first,
          display_name: first,
          postal_code: postal,
          trade_levels: levels,
          referral_code: referral || null,
          plan: 'free'
        }
      }
    });

    if (error) return signupMessage('Création impossible : ' + error.message, true);
    if (referral) localStorage.removeItem(REF_KEY);

    if (!data?.session) {
      signupMessage('Compte créé ✓ Vérifie ton e-mail pour confirmer ton adresse, puis reconnecte-toi à Bricoach.');
      return;
    }

    try {
      await cloud.from('profiles').update({
        display_name:first,
        postal_code:postal || null,
        trade_levels:levels,
        onboarding_complete:true
      }).eq('id', data.user.id);
    } catch (_) {}
    window.v36CloseSignup();
  };

  function formatDate(value) {
    if (!value) return '';
    try { return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value)); } catch (_) { return ''; }
  }

  function planCard(key, current) {
    const definitions = {
      free:{title:'GRATUIT',price:'0 €',desc:'Pour découvrir Bricoach et réaliser son premier chantier.',detail:'1 chantier actif',features:['Calculateurs métiers','Liste matériaux et outils','Tutoriels et vidéos','Suivi simple des dépenses','PDF basique','Coach limité']},
      plus:{title:'BRICOACH+',price:'5,99 €/mois',desc:'Pour gérer tous tes travaux de A à Z.',detail:'59,90 €/an · 99,99 € à vie',features:['Chantiers illimités','Projets multi-pièces','Prix et liens magasins','Inventaire Mon matériel','Dépenses détaillées','PDF complet et planning','Tutoriels et vidéothèque complets']},
      max:{title:'BRICOACH MAX',price:'9,99 €/mois',desc:'Bricoach+ avec le Coach IA et l’analyse photo.',detail:'99,90 €/an',features:['Tout Bricoach+','Coach IA avancé','Analyse photo chantier','Diagnostic guidé','Aide personnalisée','Comparaison de produits','Conseils contextualisés']}
    };
    const p = definitions[key];
    return `<article class="bcPlanCard ${key==='plus'?'reco':''}">${key==='plus'?'<div class="bcPlanRibbon">RECOMMANDÉ</div>':''}<h3>${p.title}</h3><div class="bcPlanPrice">${p.price}</div><div class="v36PlanDetail">${p.detail}</div><div class="bcPlanDesc">${p.desc}</div><div class="bcPlanFeatures">${p.features.map(f=>`<span>${f}</span>`).join('')}</div><button class="bcPlanAction ${current===key?'current':'soon'}" type="button">${current===key?'Votre forfait':'Bientôt disponible'}</button></article>`;
  }

  function referralHtml() {
    if (!currentUser || !currentProfile?.referral_code || isAdmin()) return '';
    const qualified = referralRows.filter(r => r.status === 'qualified').length;
    const pending = referralRows.filter(r => r.status === 'pending').length;
    const progress = Math.min(qualified,3);
    const rewarded = Number(currentProfile.referral_reward_count || 0) > 0;
    const bonus = bonusActive() ? `Bricoach+ offert jusqu’au ${formatDate(currentProfile.referral_bonus_until)}.` : '';
    return `<section class="v36ReferralBox">
      <div class="v36ReferralIcon">🎁</div>
      <div class="v36ReferralCopy"><h3>Invite 3 proches = 14 jours de Bricoach+ offerts</h3><p>${rewarded ? `Récompense obtenue ✓ ${safe(bonus)}` : `Ton avancement : <b>${progress}/3</b> inscription${progress>1?'s':''} confirmée${progress>1?'s':''}.${pending?` ${pending} en attente de confirmation.`:''}`}</p><small>Une inscription compte lorsque le filleul crée son compte avec ton lien et confirme son e-mail. Offre de parrainage accordée une fois par compte.</small></div>
      <div class="v36ReferralActions"><button onclick="v36ShareReferral()">Partager mon lien</button><button class="soft" onclick="v36CopyReferral()">Copier le code ${safe(currentProfile.referral_code)}</button></div>
    </section>`;
  }

  function referralUrl() {
    const url = new URL(location.origin + location.pathname);
    url.searchParams.set('ref', currentProfile?.referral_code || '');
    return url.toString();
  }

  window.v36CopyReferral = async () => {
    const text = currentProfile?.referral_code || '';
    if (!text) return;
    try { await navigator.clipboard.writeText(text); } catch (_) {}
    if (typeof toast === 'function') toast('Code parrainage copié ✓');
  };

  window.v36ShareReferral = async () => {
    const code = currentProfile?.referral_code;
    if (!code) return;
    const url = referralUrl();
    const text = `Découvre Bricoach avec mon invitation. Crée ton compte avec mon lien : ${url}`;
    try {
      if (navigator.share) await navigator.share({title:'Bricoach',text,url});
      else {
        await navigator.clipboard.writeText(text);
        if (typeof toast === 'function') toast('Lien de parrainage copié ✓');
      }
    } catch (_) {}
  };

  window.bcOpenPlans = () => {
    document.getElementById('bcPlansModal')?.remove();
    const current = effectivePlan();
    const bonusLine = bonusActive() && !isAdmin() ? `<div class="v36BonusNote">🎁 Ton accès Bricoach+ par parrainage est actif jusqu’au <b>${formatDate(currentProfile.referral_bonus_until)}</b>.</div>` : '';
    document.body.insertAdjacentHTML('beforeend', `<div class="bcPlansModal" id="bcPlansModal"><div class="bcPlansPanel"><div class="bcPlansHead"><div><h2>Choisis ton Bricoach</h2><p>Tu utilises actuellement <b>${planLabel()}</b>.</p></div><button class="bcPlansClose" onclick="bcClosePlans()">×</button></div>${bonusLine}<div class="bcPlansGrid">${planCard('free',current)}${planCard('plus',current)}${planCard('max',current)}</div>${isAdmin()?'<div class="bcAdminNote">👑 Compte administrateur : BRICOACH MAX est activé automatiquement avec toutes les fonctions.</div>':referralHtml()}</div></div>`);
  };
})();