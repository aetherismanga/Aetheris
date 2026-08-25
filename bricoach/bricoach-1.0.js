/* BRICOACH 1.0 — point d'entrée consolidé issu de V38.
   Objectif : conserver strictement le comportement existant tout en supprimant
   l'empilement de dizaines de balises <script> et <link> dans index.html.
   Les sources historiques restent dans le dépôt comme modules de référence.
*/
(() => {
  'use strict';

  const BUILD = '1.0.1';
  window.BRICOACH_BUILD = BUILD;

  const CSS_SOURCES = [
    'styles.css','mobile-fix.css','wizard.css','details-v10.css',
    'pricing-v11.css','pricing-v12.css','configurator-v14.css',
    'ux-v15.css','ux-v16.css','profile-v18.css','tools-v19.css',
    'workspace-v20.css','v21.css','v22.css','v23.css','v24.css','v25.css',
    'v26.css','v27.css','v28.css','v28-ui.css','v29-home.css',
    'v30-home-fix.css','v31-home.css','auth-v34.css','v35-header-account.css',
    'v36-account-referral.css','v37-official-logo.css','v38-house-position.css',
    'retailer-detail-1.0.css'
  ];

  const JS_SOURCES = [
    'app.js','details-v10.js','v10-fix.js','pricing-v11.js','pricing-v12.js',
    'location-v13.js','configurator-v14.js','location-v15.js','ux-v15.js',
    'ux-v16.js','scroll-v17.js','profile-v18.js','tools-v19.js','workspace-v20.js',
    'v21.js','v22.js','v23.js','v23-fix.js','v24.js','v25.js','v25-project.js',
    'v26.js','v27.js','v28-core.js','v28-tutorials.js','v28-pricing.js',
    'v28-fix.js','v28-ui.js','v29-home.js','v31-fix.js','auth-v34.js',
    'v35-header-account.js','v36-account-referral.js','v36-profile-sync.js',
    'v36-admin-referral-preview.js','v37-official-logo.js','retailer-detail-1.0.js'
  ];

  function versioned(path) {
    return `./${path}?build=${encodeURIComponent(BUILD)}`;
  }

  function loadingScreen() {
    const app = document.getElementById('app');
    if (!app || app.childElementCount) return;
    app.innerHTML = `
      <div id="bcBoot" style="min-height:100vh;display:grid;place-items:center;background:#f5f3ed;color:#17342f;font-family:Inter,system-ui,-apple-system,'Segoe UI',sans-serif;padding:24px">
        <div style="text-align:center;max-width:360px">
          <img src="./bricoach-app-icon.svg" alt="Bricoach" style="width:92px;height:92px;border-radius:24px;margin:0 auto 16px;display:block">
          <div style="font-weight:900;font-size:27px;letter-spacing:-.02em">BRICOACH</div>
          <div style="color:#687a76;margin-top:5px">Chargement de ton coach travaux…</div>
        </div>
      </div>`;
  }

  function bootError(error) {
    console.error('[BRICOACH 1.0] Démarrage impossible', error);
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
      <div style="min-height:100vh;display:grid;place-items:center;background:#f5f3ed;color:#17342f;font-family:Inter,system-ui,-apple-system,'Segoe UI',sans-serif;padding:24px">
        <div style="width:min(430px,100%);background:#fff;border:1px solid #e8e2d8;border-radius:26px;padding:26px;box-shadow:0 18px 55px rgba(23,52,47,.10)">
          <div style="font-size:36px">🧰</div>
          <h1 style="font-size:25px;margin:10px 0 8px">Bricoach n'a pas pu démarrer</h1>
          <p style="color:#6f7c78;line-height:1.5;margin:0 0 18px">Une ressource de l'application n'a pas été chargée. Ta connexion et tes données locales ne sont pas supprimées.</p>
          <button onclick="location.reload()" style="width:100%;border:0;border-radius:15px;padding:14px;background:#0b8f8a;color:#fff;font-weight:850;font-size:16px">Réessayer</button>
          <div style="font-size:11px;color:#8a9692;margin-top:14px">Bricoach ${BUILD}</div>
        </div>
      </div>`;
  }

  async function fetchText(path) {
    const response = await fetch(versioned(path), { cache: 'default' });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.text();
  }

  async function installStyles() {
    const parts = await Promise.all(CSS_SOURCES.map(async path => {
      const text = await fetchText(path);
      return `\n/* ===== ${path} ===== */\n${text}\n`;
    }));
    const style = document.createElement('style');
    style.id = 'bricoach-1-0-styles';
    style.dataset.build = BUILD;
    style.textContent = parts.join('\n');
    document.head.appendChild(style);
  }

  async function installApplication() {
    const sources = await Promise.all(JS_SOURCES.map(fetchText));
    const bundle = sources.map((source, index) =>
      `\n/* ===== ${JS_SOURCES[index]} ===== */\n${source}\n;\n`
    ).join('\n');

    const blob = new Blob([bundle], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.dataset.build = BUILD;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Le bundle JavaScript Bricoach 1.0 ne peut pas être exécuté.'));
      document.body.appendChild(script);
    });
    URL.revokeObjectURL(url);
  }

  async function clearDevelopmentCaches() {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k.startsWith('bricoach-')).map(k => caches.delete(k)));
      }
    } catch (_) {}
  }

  async function boot() {
    loadingScreen();
    try {
      await installStyles();
      await installApplication();
      await clearDevelopmentCaches();
      document.documentElement.dataset.bricoachBuild = BUILD;
      console.info(`[BRICOACH] ${BUILD} prêt — ${CSS_SOURCES.length} feuilles consolidées, ${JS_SOURCES.length} modules consolidés.`);
    } catch (error) {
      bootError(error);
    }
  }

  boot();
})();
