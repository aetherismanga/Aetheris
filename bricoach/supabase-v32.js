/* BRICOACH v32 — Supabase authentication + project cloud sync */
(() => {
  const URL = 'https://yomwhpfdvmemvdolajsb.supabase.co';
  const KEY = 'sb_publishable_huN7AcJuKl7Hy7q6tknBGw_7DmsMCIP';
  if (!window.supabase?.createClient) {
    console.warn('[BRICOACH] Supabase client unavailable');
    return;
  }

  const cloud = window.supabase.createClient(URL, KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.bricoachSupabase = cloud;

  let session = null;
  let remoteLoaded = false;
  let syncing = false;
  let syncTimer = null;
  let internalSave = false;
  let lastError = '';
  const originalSave = typeof save === 'function' ? save : () => {};

  function statusFromProject(p) {
    try {
      const pct = typeof v14ProjectProgress === 'function' ? v14ProjectProgress(p) : (typeof progress === 'function' ? progress(p) : 0);
      if (pct >= 100) return 'completed';
      if (pct > 0) return 'in_progress';
    } catch (_) {}
    return 'planned';
  }

  function safeBudget(p) {
    const n = Number(p?.budget || 0);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  function legacyCopy(p) {
    return JSON.parse(JSON.stringify(p, (k, v) => k === '_supabaseId' ? undefined : v));
  }

  function payloadFor(p) {
    return {
      owner_id: session.user.id,
      title: String(p?.title || 'Mon chantier').trim() || 'Mon chantier',
      project_type: String(p?.category || p?.type || 'other').trim() || 'other',
      status: statusFromProject(p),
      budget: safeBudget(p),
      currency: 'EUR',
      city: p?.city || null,
      postal_code: p?.postalCode || p?.postal_code || null,
      metadata: {
        bricoach_version: 32,
        local_id: p?.id ?? null,
        legacy_project: legacyCopy(p)
      }
    };
  }

  function projectFromRow(row, index) {
    const meta = row?.metadata || {};
    const legacy = meta.legacy_project && typeof meta.legacy_project === 'object' ? meta.legacy_project : {};
    let localId = Number(meta.local_id ?? legacy.id);
    if (!Number.isFinite(localId) || !localId) localId = Date.now() + index;
    return {
      ...legacy,
      id: localId,
      _supabaseId: row.id,
      title: legacy.title || row.title || 'Mon chantier',
      category: legacy.category || row.project_type || 'Autre',
      budget: legacy.budget ?? Number(row.budget || 0)
    };
  }

  function setCloudState(state, label) {
    document.querySelectorAll('.bcCloudBtn').forEach(btn => {
      btn.dataset.state = state;
      const el = btn.querySelector('.bcCloudLabel');
      if (el) el.textContent = label;
    });
  }

  function renderBadge() {
    const top = document.querySelector('.top');
    if (!top) return;
    let btn = top.querySelector('.bcCloudBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'bcCloudBtn';
      btn.type = 'button';
      btn.onclick = () => window.bcOpenAccount();
      btn.innerHTML = '<span class="bcCloudDot"></span><span class="bcCloudLabel"></span>';
      top.appendChild(btn);
    }
    if (syncing) setCloudState('syncing', 'Synchronisation…');
    else if (lastError) setCloudState('error', 'Erreur cloud');
    else if (session) setCloudState('online', 'Cloud actif');
    else setCloudState('offline', 'Sauvegarde locale');
  }

  function toast(message, error = false) {
    const old = document.querySelector('.bcCloudToast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'bcCloudToast' + (error ? ' error' : '');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function ensureModal() {
    let modal = document.getElementById('bcCloudModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'bcCloudModal';
    modal.className = 'bcCloudModal';
    modal.style.display = 'none';
    modal.addEventListener('click', e => { if (e.target === modal) window.bcCloseAccount(); });
    document.body.appendChild(modal);
    return modal;
  }

  function accountHtml() {
    if (session?.user) {
      const email = session.user.email || 'Compte Bricoach';
      const initials = String(email).slice(0, 2).toUpperCase();
      return `<div class="bcCloudPanel">
        <div class="bcCloudHead"><div><h2>☁️ Sauvegarde Bricoach</h2><p>Tes chantiers sont synchronisés avec Supabase.</p></div><button class="bcCloudClose" onclick="bcCloseAccount()">×</button></div>
        <div class="bcCloudStatus">✓ Synchronisation cloud active. Tes projets peuvent être retrouvés sur un autre appareil avec le même compte.</div>
        <div class="bcCloudUser"><div class="bcCloudAvatar">${initials}</div><div><b>Compte connecté</b><small>${String(email).replace(/</g,'&lt;')}</small></div></div>
        <div class="bcCloudActions"><button class="bcCloudPrimary" onclick="bcSyncNow(true)">Synchroniser maintenant</button><button class="bcCloudDanger" onclick="bcLogout()">Se déconnecter</button></div>
        <div class="bcCloudSmall">Les données de chaque utilisateur sont isolées par les règles de sécurité Supabase (RLS).</div>
      </div>`;
    }
    return `<div class="bcCloudPanel">
      <div class="bcCloudHead"><div><h2>☁️ Sauvegarder mes chantiers</h2><p>Crée ou connecte ton compte Bricoach pour retrouver tes projets sur tous tes appareils.</p></div><button class="bcCloudClose" onclick="bcCloseAccount()">×</button></div>
      <div id="bcCloudMessage" class="bcCloudStatus">Tu peux continuer à utiliser Bricoach sans compte : les projets restent alors uniquement sur cet appareil.</div>
      <div class="bcCloudField"><label>Adresse e-mail</label><input id="bcCloudEmail" type="email" autocomplete="email" placeholder="ton@email.fr"></div>
      <div class="bcCloudField"><label>Mot de passe</label><input id="bcCloudPassword" type="password" autocomplete="current-password" minlength="6" placeholder="6 caractères minimum"></div>
      <div class="bcCloudActions"><button class="bcCloudPrimary" onclick="bcLogin()">Se connecter</button><button class="bcCloudSecondary" onclick="bcSignup()">Créer mon compte</button></div>
      <div class="bcCloudSmall">La connexion sert uniquement à associer tes projets à ton compte Bricoach. La clé utilisée dans l'application est une clé publique Supabase ; les données restent protégées par RLS.</div>
    </div>`;
  }

  function renderModal() {
    const modal = ensureModal();
    modal.innerHTML = accountHtml();
  }

  function showMessage(message, error = false) {
    const el = document.getElementById('bcCloudMessage');
    if (!el) return;
    el.textContent = message;
    el.className = 'bcCloudStatus' + (error ? ' error' : '');
  }

  async function loadRemoteProjects() {
    if (!session?.user) return;
    remoteLoaded = false;
    lastError = '';
    setCloudState('syncing', 'Chargement…');
    const { data, error } = await cloud.from('projects')
      .select('id,title,project_type,status,budget,metadata,updated_at')
      .order('updated_at', { ascending: false });
    if (error) {
      lastError = error.message || 'Erreur de chargement';
      renderBadge();
      throw error;
    }

    const remote = (data || []).map(projectFromRow);
    const local = Array.isArray(projects) ? projects.slice() : [];
    const remoteIds = new Set(remote.map(p => p._supabaseId));
    const remoteLocalIds = new Set(remote.map(p => String(p.id)));
    const unsyncedLocal = local.filter(p => !p._supabaseId && !remoteLocalIds.has(String(p.id)));
    const stillLocal = local.filter(p => p._supabaseId && !remoteIds.has(p._supabaseId));

    projects = [...remote, ...unsyncedLocal, ...stillLocal];
    internalSave = true;
    originalSave();
    internalSave = false;
    remoteLoaded = true;
    try { render(); } catch (_) {}
    renderBadge();

    if (unsyncedLocal.length || stillLocal.length) queueSync(80);
  }

  async function doSync(notify = false) {
    if (!session?.user || !remoteLoaded || syncing) return;
    syncing = true;
    lastError = '';
    renderBadge();
    try {
      let changedLocal = false;
      const snapshot = Array.isArray(projects) ? projects.slice() : [];
      for (const p of snapshot) {
        const payload = payloadFor(p);
        if (p._supabaseId) {
          const { error } = await cloud.from('projects').update(payload).eq('id', p._supabaseId);
          if (error) throw error;
        } else {
          const { data, error } = await cloud.from('projects').insert(payload).select('id').single();
          if (error) throw error;
          p._supabaseId = data.id;
          changedLocal = true;
        }
      }

      const { data: remoteRows, error: listError } = await cloud.from('projects').select('id');
      if (listError) throw listError;
      const keep = new Set((projects || []).map(p => p._supabaseId).filter(Boolean));
      const remove = (remoteRows || []).map(r => r.id).filter(id => !keep.has(id));
      if (remove.length) {
        const { error: deleteError } = await cloud.from('projects').delete().in('id', remove);
        if (deleteError) throw deleteError;
      }

      if (changedLocal) {
        internalSave = true;
        originalSave();
        internalSave = false;
      }
      if (notify) toast('Projets synchronisés ✓');
    } catch (err) {
      lastError = err?.message || 'Erreur de synchronisation';
      console.error('[BRICOACH] Supabase sync', err);
      if (notify) toast('Synchronisation impossible : ' + lastError, true);
    } finally {
      syncing = false;
      renderBadge();
    }
  }

  function queueSync(delay = 350) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => doSync(false), delay);
  }

  // Keep the original app behaviour (instant local save), then mirror to Supabase.
  if (typeof save === 'function') {
    save = function () {
      originalSave();
      if (!internalSave && session?.user && remoteLoaded) queueSync();
      renderBadge();
    };
  }

  window.bcOpenAccount = () => {
    renderModal();
    ensureModal().style.display = 'flex';
  };
  window.bcCloseAccount = () => { ensureModal().style.display = 'none'; };
  window.bcSyncNow = (notify = true) => doSync(notify);

  window.bcLogin = async () => {
    const email = document.getElementById('bcCloudEmail')?.value.trim();
    const password = document.getElementById('bcCloudPassword')?.value || '';
    if (!email || !password) return showMessage('Renseigne ton e-mail et ton mot de passe.', true);
    showMessage('Connexion en cours…');
    const { error } = await cloud.auth.signInWithPassword({ email, password });
    if (error) return showMessage(error.message, true);
    toast('Connexion réussie ✓');
  };

  window.bcSignup = async () => {
    const email = document.getElementById('bcCloudEmail')?.value.trim();
    const password = document.getElementById('bcCloudPassword')?.value || '';
    if (!email || password.length < 6) return showMessage('Entre un e-mail valide et un mot de passe d’au moins 6 caractères.', true);
    showMessage('Création du compte…');
    const { data, error } = await cloud.auth.signUp({ email, password, options: { data: { display_name: email.split('@')[0] } } });
    if (error) return showMessage(error.message, true);
    if (!data.session) showMessage('Compte créé. Vérifie ton e-mail pour confirmer ton adresse, puis connecte-toi.');
    else toast('Compte créé et connecté ✓');
  };

  window.bcLogout = async () => {
    await cloud.auth.signOut();
    session = null;
    remoteLoaded = false;
    lastError = '';
    renderModal();
    renderBadge();
    toast('Déconnecté. Les projets restent disponibles localement.');
  };

  cloud.auth.onAuthStateChange(async (_event, newSession) => {
    session = newSession;
    lastError = '';
    renderBadge();
    renderModal();
    if (session?.user) {
      try {
        await loadRemoteProjects();
        await doSync(false);
      } catch (err) {
        console.error('[BRICOACH] initial cloud load', err);
      }
    } else {
      remoteLoaded = false;
    }
  });

  const observer = new MutationObserver(() => renderBadge());
  const app = document.getElementById('app');
  if (app) observer.observe(app, { childList: true, subtree: true });

  (async () => {
    const { data } = await cloud.auth.getSession();
    session = data?.session || null;
    renderBadge();
    if (session?.user) {
      try {
        await loadRemoteProjects();
        await doSync(false);
      } catch (err) {
        console.error('[BRICOACH] boot cloud load', err);
      }
    }
  })();
})();
