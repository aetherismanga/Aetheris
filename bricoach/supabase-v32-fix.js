/* BRICOACH v32.1 — account isolation + auth redirect hardening */
(() => {
  const cloud = window.bricoachSupabase;
  if (!cloud) return;
  const USER_KEY = 'bricoach-cloud-user-v32';

  function keepOnlyUnsyncedLocal() {
    if (!Array.isArray(projects)) return;
    projects = projects.filter(p => !p?._supabaseId);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch (_) {}
    try { render(); } catch (_) {}
  }

  async function secureForSession(newSession) {
    const newUserId = newSession?.user?.id || null;
    const previousUserId = localStorage.getItem(USER_KEY);
    if (!newUserId) {
      // Never leave cloud-owned projects visible after logout/session expiry.
      keepOnlyUnsyncedLocal();
      return;
    }
    if (previousUserId && previousUserId !== newUserId) {
      // Prevent projects cached by one account being uploaded into another account.
      keepOnlyUnsyncedLocal();
    }
    localStorage.setItem(USER_KEY, newUserId);
  }

  cloud.auth.onAuthStateChange((_event, newSession) => {
    // Run synchronously before the main remote load completes.
    secureForSession(newSession).catch(console.error);
  });

  // Harden signup redirect so confirmation returns to the current Bricoach page.
  window.bcSignup = async () => {
    const email = document.getElementById('bcCloudEmail')?.value.trim();
    const password = document.getElementById('bcCloudPassword')?.value || '';
    const msg = (text, error = false) => {
      const el = document.getElementById('bcCloudMessage');
      if (!el) return;
      el.textContent = text;
      el.className = 'bcCloudStatus' + (error ? ' error' : '');
    };
    if (!email || password.length < 6) return msg('Entre un e-mail valide et un mot de passe d’au moins 6 caractères.', true);
    msg('Création du compte…');
    const redirect = location.origin + location.pathname;
    const { data, error } = await cloud.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirect, data: { display_name: email.split('@')[0] } }
    });
    if (error) return msg(error.message, true);
    if (!data.session) msg('Compte créé. Vérifie ton e-mail pour confirmer ton adresse, puis reviens sur Bricoach.');
    else {
      localStorage.setItem(USER_KEY, data.session.user.id);
      if (typeof bcCloseAccount === 'function') bcCloseAccount();
    }
  };

  // Sync before logout, then remove cloud-linked cache from the device.
  window.bcLogout = async () => {
    try { if (typeof bcSyncNow === 'function') await bcSyncNow(false); } catch (_) {}
    await cloud.auth.signOut();
    keepOnlyUnsyncedLocal();
    try { if (typeof bcCloseAccount === 'function') bcCloseAccount(); } catch (_) {}
  };

  (async () => {
    const { data } = await cloud.auth.getSession();
    await secureForSession(data?.session || null);
  })();
})();
