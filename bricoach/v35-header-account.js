/* BRICOACH V35 — en-tête propre + prénom utilisateur */
(() => {
  'use strict';

  const cloud = window.bricoachSupabase;
  let currentUser = null;

  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function firstName(user) {
    const meta = user?.user_metadata || {};
    let name = String(meta.first_name || meta.display_name || '').trim();
    if (name) name = name.split(/\s+/)[0];
    if (!name) name = String(user?.email || '').split('@')[0].split(/[._-]/)[0];
    if (!name) name = 'à toi';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function patchHeader() {
    if (typeof tab === 'undefined' || tab !== 'home') return;
    const top = document.querySelector('.main > .top');
    if (!top) return;

    top.classList.add('v35Top');
    const left = top.querySelector('.v29TopLeft');
    const greeting = left?.querySelector('h1');
    if (greeting) {
      const name = currentUser ? firstName(currentUser) : '';
      greeting.innerHTML = name
        ? `Bonjour <span class="v35FirstName">${safe(name)}</span> <span class="v35Wave">👋</span>`
        : `Bonjour <span class="v35Wave">👋</span>`;
    }

    const actions = top.querySelector('.v29TopActions, .v21TopActions');
    if (actions) actions.classList.add('v35Actions');
    const badge = top.querySelector('.bcPlanBadge');
    if (badge) badge.classList.add('v35PlanBadge');
  }

  function applyUser(user) {
    currentUser = user || null;
    requestAnimationFrame(patchHeader);
  }

  if (cloud) {
    cloud.auth.getSession().then(({data}) => applyUser(data?.session?.user || null)).catch(() => {});
    cloud.auth.onAuthStateChange((_event, session) => setTimeout(() => applyUser(session?.user || null), 0));
  }

  try {
    const previousRender = render;
    render = function () {
      previousRender();
      requestAnimationFrame(() => requestAnimationFrame(patchHeader));
    };
  } catch (_) {}

  function authCard() { return document.querySelector('.bcAuthCard'); }

  function enterSignupMode() {
    const card = authCard();
    if (!card || card.classList.contains('bcSignupMode')) return;
    card.classList.add('bcSignupMode');
    const h2 = card.querySelector('h2');
    const intro = card.querySelector(':scope > p');
    if (h2) h2.textContent = 'Créer mon compte';
    if (intro) intro.textContent = 'Commence gratuitement avec Bricoach.';

    const emailField = card.querySelector('#bcAuthEmail')?.closest('.bcAuthField');
    if (emailField) emailField.insertAdjacentHTML('beforebegin', '<div class="bcAuthField bcFirstNameField"><label>Prénom</label><input id="bcAuthFirstName" type="text" autocomplete="given-name" maxlength="40" placeholder="Ton prénom"></div>');

    const primary = card.querySelector('.bcAuthPrimary');
    if (primary) {
      primary.textContent = 'Créer mon compte →';
      primary.onclick = () => window.bcSignUp();
    }
    const link = card.querySelector('.bcAuthLink');
    if (link) {
      link.textContent = '← Retour à la connexion';
      link.onclick = () => window.bcBackToLogin();
    }
    const divider = card.querySelector('.bcAuthDivider');
    const secondary = card.querySelector('.bcAuthSecondary');
    if (divider) divider.style.display = 'none';
    if (secondary) secondary.style.display = 'none';
    setTimeout(() => document.getElementById('bcAuthFirstName')?.focus(), 60);
  }

  window.bcBackToLogin = () => {
    const card = authCard();
    if (!card) return;
    card.classList.remove('bcSignupMode');
    card.querySelector('.bcFirstNameField')?.remove();
    const h2 = card.querySelector('h2');
    const intro = card.querySelector(':scope > p');
    if (h2) h2.textContent = 'Se connecter';
    if (intro) intro.textContent = 'Retrouve Bricoach et tes réglages sur cet appareil.';
    const primary = card.querySelector('.bcAuthPrimary');
    if (primary) {
      primary.textContent = 'Se connecter →';
      primary.onclick = () => window.bcSignIn();
    }
    const link = card.querySelector('.bcAuthLink');
    if (link) {
      link.textContent = 'Mot de passe oublié ?';
      link.onclick = () => window.bcResetPassword();
    }
    const divider = card.querySelector('.bcAuthDivider');
    const secondary = card.querySelector('.bcAuthSecondary');
    if (divider) divider.style.display = '';
    if (secondary) secondary.style.display = '';
  };

  if (cloud) {
    window.bcSignUp = async () => {
      const card = authCard();
      if (!card?.classList.contains('bcSignupMode')) {
        enterSignupMode();
        return;
      }

      const first = document.getElementById('bcAuthFirstName')?.value.trim() || '';
      const email = document.getElementById('bcAuthEmail')?.value.trim() || '';
      const password = document.getElementById('bcAuthPassword')?.value || '';
      const msg = (text, error = false) => {
        const node = document.getElementById('bcAuthMessage');
        if (!node) return;
        node.textContent = text;
        node.className = 'bcAuthMessage show' + (error ? ' error' : '');
      };

      if (!first) return msg('Indique ton prénom.', true);
      if (!email) return msg('Entre une adresse e-mail valide.', true);
      if (password.length < 6) return msg('Le mot de passe doit contenir au moins 6 caractères.', true);

      msg('Création du compte…');
      const {data, error} = await cloud.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: location.origin + location.pathname,
          data: { display_name: first, first_name: first, plan: 'free' }
        }
      });
      if (error) return msg('Création impossible : ' + error.message, true);
      if (!data.session) return msg('Compte créé. Vérifie ton e-mail pour confirmer ton adresse, puis reconnecte-toi.');
    };
  }
})();