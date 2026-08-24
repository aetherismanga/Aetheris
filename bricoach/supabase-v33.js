/* BRICOACH v33 — Supabase auth + safe cloud project sync */
(() => {
  'use strict';

  const SUPABASE_URL = 'https://yomwhpfdvmemvdolajsb.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_huN7AcJuKl7Hy7q6tknBGw_7DmsMCIP';
  const CLOUD_USER_KEY = 'bricoach-cloud-user-v33';

  if (!window.supabase?.createClient) {
    console.warn('[BRICOACH] Supabase library unavailable');
    return;
  }

  const cloud = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  window.bricoachSupabase = cloud;

  let session = null;
  let remoteLoaded = false;
  let syncing = false;
  let lastError = '';
  let syncTimer = null;
  let authGeneration = 0;
  const originalSave = typeof save === 'function' ? save : () => {};

  function localPersist() {
    try { originalSave(); } catch (err) { console.error('[BRICOACH] local save', err); }
  }

  function safeBudget(project) {
    const value = Number(project?.budget || 0);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function statusFromProject(project) {
    try {
      const pct = typeof v14ProjectProgress === 'function'
        ? v14ProjectProgress(project)
        : (typeof progress === 'function' ? progress(project) : 0);
      if (pct >= 100) return 'completed';
      if (pct > 0) return 'in_progress';
    } catch (_) {}
    return 'planned';
  }

  function serializableProject(project) {
    return JSON.parse(JSON.stringify(project, (key, value) => key === '_supabaseId' ? undefined : value));
  }

  function rowPayload(project) {
    return {
      owner_id: session.user.id,
      title: String(project?.title || 'Mon chantier').trim() || 'Mon chantier',
      project_type: String(project?.category || project?.type || 'other').trim() || 'other',
      status: statusFromProject(project),
      budget: safeBudget(project),
      currency: 'EUR',
      city: project?.city || null,
      postal_code: project?.postalCode || project?.postal_code || null,
      metadata: {
        bricoach_version: 33,
        local_id: project?.id ?? null,
        legacy_project: serializableProject(project)
      }
    };
  }

  function rowToProject(row, index) {
    const metadata = row?.metadata && typeof row.metadata === 'object' ? row.metadata : {};
    const legacy = metadata.legacy_project && typeof metadata.legacy_project === 'object'
      ? metadata.legacy_project
      : {};
    let localId = Number(metadata.local_id ?? legacy.id);
    if (!Number.isFinite(localId) || localId <= 0) localId = Date.now() + index;
    return {
      ...legacy,
      id: localId,
      _supabaseId: row.id,
      title: legacy.title || row.title || 'Mon chantier',
      category: legacy.category || row.project_type || 'Autre',
      budget: legacy.budget ?? Number(row.budget || 0)
    };
  }

  function dropCloudCachedProjects() {
    if (!Array.isArray(projects)) return;
    projects = projects.filter(project => !project?._supabaseId);
    localPersist();
    try { render(); } catch (_) {}
  }

  function protectAccountCache(userId) {
    const previousUserId = localStorage.getItem(CLOUD_USER_KEY);
    if (!userId) {
      dropCloudCachedProjects();
      return;
    }
    if (previousUserId && previousUserId !== userId) {
      dropCloudCachedProjects();
    }
    localStorage.setItem(CLOUD_USER_KEY, userId);
  }

  function setBadge(state, label) {
    document.querySelectorAll('.bcCloudBtn').forEach(button => {
      button.dataset.state = state;
      const labelNode = button.querySelector('.bcCloudLabel');
      if (labelNode) labelNode.textContent = label;
    });
  }

  function renderBadge() {
    const top = document.querySelector('.top');
    if (!top) return;
    let button = top.querySelector('.bcCloudBtn');
    if (!button) {
      button = document.createElement('button');
      button.className = 'bcCloudBtn';
      button.type = 'button';
      button.onclick = () => window.bcOpenAccount();
      button.innerHTML = '<span class="bcCloudDot"></span><span class="bcCloudLabel"></span>';
      top.appendChild(button);
    }
    if (syncing) setBadge('syncing', 'Synchronisation…');
    else if (lastError) setBadge('error', 'Erreur cloud');
    else if (session?.user) setBadge('online', 'Cloud actif');
    else setBadge('offline', 'Sauvegarde locale');
  }

  function toast(message, error = false) {
    document.querySelector('.bcCloudToast')?.remove();
    const node = document.createElement('div');
    node.className = 'bcCloudToast' + (error ? ' error' : '');
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 3200);
  }

  function ensureModal() {
    let modal = document.getElementById('bcCloudModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'bcCloudModal';
    modal.className = 'bcCloudModal';
    modal.style.display = 'none';
    modal.addEventListener('click', event => {
      if (event.target === modal) window.bcCloseAccount();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function accountHtml() {
    if (session?.user) {
      const email = session.user.email || 'Compte Bricoach';
      const safeEmail = String(email).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
      const initials = String(email).slice(0, 2).toUpperCase();
      return `<div class="bcCloudPanel">
        <div class="bcCloudHead"><div><h2>☁️ Sauvegarde Bricoach</h2><p>Tes chantiers sont sauvegardés dans le cloud.</p></div><button class="bcCloudClose" onclick="bcCloseAccount()">×</button></div>
        <div class="bcCloudStatus">✓ Synchronisation Supabase active. Tu peux retrouver tes projets sur un autre appareil avec le même compte.</div>
        <div class="bcCloudUser"><div class="bcCloudAvatar">${initials}</div><div><b>Compte connecté</b><small>${safeEmail}</small></div></div>
        <div class="bcCloudActions"><button class="bcCloudPrimary" onclick="bcSyncNow(true)">Synchroniser maintenant</button><button class="bcCloudDanger" onclick="bcLogout()">Se déconnecter</button></div>
        <div class="bcCloudSmall">Les règles RLS de Supabase isolent les projets de chaque utilisateur.</div>
      </div>`;
    }

    return `<div class="bcCloudPanel">
      <div class="bcCloudHead"><div><h2>☁️ Sauvegarder mes chantiers</h2><p>Connecte ton compte Bricoach pour retrouver tes projets sur tous tes appareils.</p></div><button class="bcCloudClose" onclick="bcCloseAccount()">×</button></div>
      <div id="bcCloudMessage" class="bcCloudStatus">Sans compte, Bricoach continue de fonctionner mais tes chantiers restent uniquement sur cet appareil.</div>
      <div class="bcCloudField"><label>Adresse e-mail</label><input id="bcCloudEmail" type="email" autocomplete="email" placeholder="ton@email.fr"></div>
      <div class="bcCloudField"><label>Mot de passe</label><input id="bcCloudPassword" type="password" autocomplete="current-password" minlength="6" placeholder="6 caractères minimum"></div>
      <div class="bcCloudActions"><button class="bcCloudPrimary" onclick="bcLogin()">Se connecter</button><button class="bcCloudSecondary" onclick="bcSignup()">Créer mon compte</button></div>
      <div class="bcCloudSmall">La clé intégrée dans Bricoach est une clé publique Supabase. Les accès aux données sont contrôlés côté base de données.</div>
    </div>`;
  }

  function renderModal() {
    ensureModal().innerHTML = accountHtml();
  }

  function modalMessage(message, error = false) {
    const node = document.getElementById('bcCloudMessage');
    if (!node) return;
    node.textContent = message;
    node.className = 'bcCloudStatus' + (error ? ' error' : '');
  }

  async function loadRemoteProjects(generation) {
    if (!session?.user || generation !== authGeneration) return;
    remoteLoaded = false;
    lastError = '';
    renderBadge();

    const { data, error } = await cloud
      .from('projects')
      .select('id,title,project_type,status,budget,metadata,updated_at')
      .order('updated_at', { ascending: false });

    if (generation !== authGeneration || !session?.user) return;
    if (error) throw error;

    const remoteProjects = (data || []).map(rowToProject);
    const remoteLocalIds = new Set(remoteProjects.map(project => String(project.id)));
    const localProjects = Array.isArray(projects) ? projects.slice() : [];
    const unsyncedLocal = localProjects.filter(project => !project?._supabaseId && !remoteLocalIds.has(String(project.id)));

    projects = [...remoteProjects, ...unsyncedLocal];
    localPersist();
    remoteLoaded = true;
    try { render(); } catch (_) {}
    renderBadge();

    if (unsyncedLocal.length) queueSync(80);
  }

  async function syncNow(notify = false) {
    if (!session?.user || !remoteLoaded || syncing) return;
    syncing = true;
    lastError = '';
    renderBadge();

    try {
      let changedLocal = false;
      const snapshot = Array.isArray(projects) ? projects.slice() : [];

      for (const project of snapshot) {
        const payload = rowPayload(project);
        if (project._supabaseId) {
          const { error } = await cloud.from('projects').update(payload).eq('id', project._supabaseId);
          if (error) throw error;
        } else {
          const { data, error } = await cloud.from('projects').insert(payload).select('id').single();
          if (error) throw error;
          project._supabaseId = data.id;
          changedLocal = true;
        }
      }

      const { data: remoteRows, error: listError } = await cloud.from('projects').select('id');
      if (listError) throw listError;
      const keepIds = new Set((projects || []).map(project => project._supabaseId).filter(Boolean));
      const deleteIds = (remoteRows || []).map(row => row.id).filter(id => !keepIds.has(id));
      if (deleteIds.length) {
        const { error: deleteError } = await cloud.from('projects').delete().in('id', deleteIds);
        if (deleteError) throw deleteError;
      }

      if (changedLocal) localPersist();
      if (notify) toast('Projets synchronisés ✓');
    } catch (error) {
      lastError = error?.message || 'Erreur de synchronisation';
      console.error('[BRICOACH] Supabase sync', error);
      if (notify) toast('Synchronisation impossible : ' + lastError, true);
    } finally {
      syncing = false;
      renderBadge();
    }
  }

  function queueSync(delay = 350) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncNow(false), delay);
  }

  async function handleSession(nextSession) {
    const generation = ++authGeneration;
    session = nextSession || null;
    remoteLoaded = false;
    lastError = '';
    protectAccountCache(session?.user?.id || null);
    renderBadge();
    renderModal();

    if (!session?.user) return;
    try {
      await loadRemoteProjects(generation);
      if (generation === authGeneration) await syncNow(false);
    } catch (error) {
      if (generation !== authGeneration) return;
      lastError = error?.message || 'Erreur de chargement';
      console.error('[BRICOACH] cloud load', error);
      renderBadge();
    }
  }

  // Existing Bricoach mutations keep saving locally immediately. Cloud sync is queued afterwards.
  if (typeof save === 'function') {
    save = function () {
      localPersist();
      if (session?.user && remoteLoaded) queueSync();
      renderBadge();
    };
  }

  window.bcOpenAccount = () => {
    renderModal();
    ensureModal().style.display = 'flex';
  };
  window.bcCloseAccount = () => { ensureModal().style.display = 'none'; };
  window.bcSyncNow = (notify = true) => syncNow(notify);

  window.bcLogin = async () => {
    const email = document.getElementById('bcCloudEmail')?.value.trim();
    const password = document.getElementById('bcCloudPassword')?.value || '';
    if (!email || !password) return modalMessage('Renseigne ton e-mail et ton mot de passe.', true);
    modalMessage('Connexion en cours…');
    const { error } = await cloud.auth.signInWithPassword({ email, password });
    if (error) return modalMessage(error.message, true);
    toast('Connexion réussie ✓');
  };

  window.bcSignup = async () => {
    const email = document.getElementById('bcCloudEmail')?.value.trim();
    const password = document.getElementById('bcCloudPassword')?.value || '';
    if (!email || password.length < 6) {
      return modalMessage('Entre un e-mail valide et un mot de passe d’au moins 6 caractères.', true);
    }
    modalMessage('Création du compte…');
    const redirect = location.origin + location.pathname;
    const { data, error } = await cloud.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirect,
        data: { display_name: email.split('@')[0] }
      }
    });
    if (error) return modalMessage(error.message, true);
    if (!data.session) {
      modalMessage('Compte créé. Vérifie ton e-mail pour confirmer ton adresse, puis reviens sur Bricoach.');
    } else {
      toast('Compte créé et connecté ✓');
      window.bcCloseAccount();
    }
  };

  window.bcLogout = async () => {
    try { await syncNow(false); } catch (_) {}
    const { error } = await cloud.auth.signOut();
    if (error) return toast('Déconnexion impossible : ' + error.message, true);
    dropCloudCachedProjects();
    window.bcCloseAccount();
    toast('Déconnecté.');
  };

  cloud.auth.onAuthStateChange((_event, nextSession) => {
    // Defer Supabase database calls until the auth callback has fully returned.
    setTimeout(() => handleSession(nextSession), 0);
  });

  const app = document.getElementById('app');
  if (app) new MutationObserver(renderBadge).observe(app, { childList: true, subtree: true });

  window.addEventListener('online', () => {
    if (session?.user && remoteLoaded) queueSync(100);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && session?.user) {
      const generation = authGeneration;
      loadRemoteProjects(generation).then(() => syncNow(false)).catch(() => {});
    }
  });

  (async () => {
    const { data, error } = await cloud.auth.getSession();
    if (error) {
      lastError = error.message;
      renderBadge();
      return;
    }
    await handleSession(data?.session || null);
  })();
})();
