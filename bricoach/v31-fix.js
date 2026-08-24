/* Bricoach V31 — correctifs Calculs + accueil */
(function(){
  /* La page Calculs sert uniquement aux calculateurs par métier.
     Les listes d'achats restent dans chaque chantier / Ma liste BRICOACH. */
  try{
    calcPage=function(){
      setTimeout(v19Recalc,0);
      return `<div class="pageTitle"><h2>🧮 Calculs par métier</h2><div class="muted">Choisis le poste : les quantités se recalculent immédiatement.</div></div>${v19CalcTabs()}<div id="v19CalcTool">${v19CalculatorBody()}</div><div class="v19CalcTutorial"><div><b>🎓 Besoin de savoir comment faire ?</b><span>Ouvre le tutoriel adapté à ton niveau pour ce métier.</span></div><button class="btn soft" onclick="openTutorialLibrary(v19CalcTrade)">Voir le tutoriel →</button></div>`;
    };
  }catch(e){console.warn('V31 calc fix',e)}

  /* Si l'utilisateur est déjà sur Calculs au chargement, redessiner sans la liste chantier. */
  try{if(typeof tab!=='undefined'&&tab==='calc'&&typeof render==='function')render()}catch(_){}
})();