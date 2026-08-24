/* BRICOACH V36 — synchronisation des niveaux métiers */
(() => {
  'use strict';
  const cloud = window.bricoachSupabase;
  if (!cloud) return;

  const cloudToApp = name => name === 'Sol / parquet / vinyle' ? 'Sol / parquet' : name;
  const appToCloud = name => name === 'Sol / parquet' ? 'Sol / parquet / vinyle' : name;
  let userId = null;

  function applyLevels(levels) {
    if (!levels || typeof levels !== 'object' || typeof v15Profile === 'undefined') return;
    if (!v15Profile.skills || typeof v15Profile.skills !== 'object') v15Profile.skills = {};
    if (!Array.isArray(v15Profile.interests)) v15Profile.interests = [];

    Object.entries(levels).forEach(([cloudName, level]) => {
      const cat = cloudToApp(cloudName);
      if (level === 'Non concerné') {
        v15Profile.interests = v15Profile.interests.filter(x => x !== cat);
        return;
      }
      if (['Débutant','Bricoleur','Confirmé','Expert'].includes(level)) {
        v15Profile.skills[cat] = level;
        if (!v15Profile.interests.includes(cat)) v15Profile.interests.push(cat);
      }
    });
    try { localStorage.setItem('bricoach-user-profile-v15', JSON.stringify(v15Profile)); } catch (_) {}
  }

  async function load(user) {
    userId = user?.id || null;
    if (!userId) return;
    try {
      const {data,error} = await cloud.from('profiles').select('trade_levels').eq('id',userId).single();
      if (!error && data?.trade_levels) {
        applyLevels(data.trade_levels);
        try { render(); } catch (_) {}
      }
    } catch (_) {}
  }

  cloud.auth.getSession().then(({data}) => load(data?.session?.user || null)).catch(() => {});
  cloud.auth.onAuthStateChange((_event,session) => setTimeout(() => load(session?.user || null),0));

  try {
    const baseSaveProfile = v15SaveProfile;
    v15SaveProfile = function () {
      baseSaveProfile();
      if (!userId || typeof v15Profile === 'undefined') return;
      const levels = {};
      const works = typeof V14_WORKS !== 'undefined' ? V14_WORKS : [];
      works.forEach(cat => {
        const key = appToCloud(cat);
        const interested = Array.isArray(v15Profile.interests) && v15Profile.interests.includes(cat);
        levels[key] = interested ? (v15Profile.skills?.[cat] || 'Bricoleur') : 'Non concerné';
      });
      cloud.from('profiles').update({trade_levels:levels,onboarding_complete:true,updated_at:new Date().toISOString()}).eq('id',userId).then(()=>{}).catch(()=>{});
    };
  } catch (_) {}
})();