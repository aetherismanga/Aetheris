/* Bricoach V29 — Accueil inspiré du visuel validé */
(function(){
function v29Logo(){return `<div class="v29Brand" aria-label="Bricoach — Ton coach travaux"><svg class="v29LogoMark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="v29lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0bb4c5"/><stop offset="1" stop-color="#087e78"/></linearGradient></defs><path d="M32 4 56 25 50 54H14L8 25Z" fill="none" stroke="url(#v29lg)" stroke-width="7" stroke-linejoin="round"/><path d="M13 43c7-9 14-12 19-12 0 12-6 20-16 22Z" fill="#35a96b"/><path d="M51 43c-7-9-14-12-19-12 0 12 6 20 16 22Z" fill="#29a69d"/><rect x="27" y="22" width="11" height="11" rx="2" fill="#ffc432"/></svg><div class="v29BrandCopy"><b><span>BRI</span>COACH</b><small>Ton coach travaux</small></div></div>`}

function v29HeroArt(){return `<svg class="v29HeroArt" viewBox="0 0 420 360" role="img" aria-label="Maison et outils de bricolage"><defs><linearGradient id="v29roof" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#18b7b0"/><stop offset="1" stop-color="#087c79"/></linearGradient><linearGradient id="v29paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#19bdbf"/><stop offset="1" stop-color="#8fe8e5"/></linearGradient><filter id="v29shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#1a4b47" flood-opacity=".16"/></filter></defs><circle cx="347" cy="58" r="45" fill="#ffc63f"/><g fill="#fff" opacity=".95"><ellipse cx="74" cy="84" rx="31" ry="14"/><ellipse cx="97" cy="79" rx="22" ry="20"/><ellipse cx="373" cy="106" rx="31" ry="13"/><ellipse cx="351" cy="103" rx="18" ry="18"/></g><path d="m187 70 15 31 33 5-24 23 6 33-30-16-30 16 6-33-24-23 33-5Z" fill="#15a5a5" opacity=".16"/><g filter="url(#v29shadow)"><path d="M164 132 255 67l91 65v124H164Z" fill="#ffe7ca"/><path d="m144 137 110-84 111 84-26 20-85-65-85 65Z" fill="url(#v29roof)"/><rect x="250" y="140" width="54" height="66" rx="4" fill="#f9ffff" stroke="#b7d8d6" stroke-width="5"/><path d="M277 141v65M250 173h54" stroke="#789c9b" stroke-width="4"/><path d="M198 133v115M218 121v127M190 155h39M190 186h39M190 217h39" stroke="#ba7549" stroke-width="7" stroke-linecap="round"/></g><g filter="url(#v29shadow)"><rect x="290" y="232" width="68" height="91" rx="12" fill="#f5a800"/><rect x="301" y="224" width="47" height="12" rx="6" fill="#ffc241"/><path d="m322 223 17-58 12 4-17 58Z" fill="#784c31"/><path d="m339 170 26-12 10 10-31 18Z" fill="#69777c"/><path d="M336 176 352 199" stroke="#69777c" stroke-width="11" stroke-linecap="round"/><path d="m315 221 5-53 11 2-6 52Z" fill="#ffb724"/></g><g filter="url(#v29shadow)"><path d="M84 269c19-23 47-23 65-5l-3 50H88Z" fill="#da8258"/><path d="M114 270c-5-38 11-58 30-70-2 31-10 54-30 70Z" fill="#50a947"/><path d="M111 273c-29-24-35-47-31-70 28 15 41 37 31 70Z" fill="#75bd58"/><path d="M111 267c8-35-6-58-21-73-7 29 0 55 21 73Z" fill="#288c50"/></g><g filter="url(#v29shadow)"><g transform="rotate(-7 215 284)"><rect x="142" y="250" width="147" height="53" rx="27" fill="url(#v29paper)"/><ellipse cx="147" cy="277" rx="24" ry="27" fill="#e0ffff"/><ellipse cx="147" cy="277" rx="13" ry="16" fill="#6bcfd0"/><path d="M178 267h78M181 280h58M196 292h48" stroke="#15979e" stroke-width="3" opacity=".65"/></g><g transform="rotate(8 235 316)"><rect x="166" y="292" width="156" height="45" rx="23" fill="#a4ebe8"/><ellipse cx="170" cy="315" rx="19" ry="22" fill="#e8ffff"/><ellipse cx="170" cy="315" rx="10" ry="13" fill="#7bd2d0"/></g></g><path d="M76 45v17M67 53h18" stroke="#0aa3a3" stroke-width="6" stroke-linecap="round"/><circle cx="124" cy="126" r="6" fill="#ffc036"/></svg>`}

function v29ProjectResume(){
  const count=projects.length;
  const p=projects[0];
  const title=count?`${count} chantier${count>1?'s':''} en cours`:'Aucun chantier en cours';
  const subtitle=count?'Reprends exactement où tu t’es arrêté.':'Crée ton premier chantier et Bricoach le gardera ici.';
  const action=count?`go('projects')`:`openWizard()`;
  const photo=p?img(p.category):heroImg;
  return `<button class="v29Resume" onclick="${action}" aria-label="${esc(title)}"><img src="${photo}" alt="Chantier Bricoach" loading="eager"><span class="v29ResumeShade"></span><span class="v29ResumePanel"><i>${count?'✓':'+'}</i><span><b>${esc(title)}</b><small>${esc(subtitle)}</small></span><em>→</em></span></button>`;
}

function v29Home(){
  return `<div class="v29Home"><section class="v29Hero"><div class="v29HeroText"><div class="v29HeroEyebrow">TON CHANTIER, BIEN ACCOMPAGNÉ</div><h2><span class="v29Plan">Planifie.</span><span class="v29Do">Réalise.</span><span class="v29Enjoy">Profite.</span></h2><p>Décris ton projet et Bricoach te prépare un chantier structuré : ordre des travaux, quantités, budget et liste de courses.</p></div><div class="v29HeroVisual">${v29HeroArt()}</div><div class="v29HeroActions"><button class="v29Start" onclick="openWizard()"><span>🚀</span><b>Démarrer un chantier</b><em>→</em></button><button class="v29Problem" onclick="go('diagnostic')"><span>?</span><b>J’ai un problème</b><em>→</em></button></div></section>${v29ProjectResume()}<section class="v29Below"><div class="v29BelowHead"><div><span>DÉCOUVRIR BRICOACH</span><h3>Tout ton chantier au même endroit</h3></div></div><div class="v29QuickGrid"><button onclick="go('projects')"><span>📋</span><b>Mes chantiers</b><small>Retrouver mes projets</small></button><button onclick="go('calc')"><span>🧮</span><b>Calculs</b><small>Quantités et matériaux</small></button><button onclick="v21OpenTutorialHub()"><span>🎓</span><b>Tutoriels</b><small>Guides pas à pas</small></button><button onclick="v26OpenVideoHub()"><span>🎬</span><b>Vidéos</b><small>Par métier et mot-clé</small></button></div></section></div>`;
}

/* Remplace uniquement le contenu de la page d'accueil. */
try{home=v29Home}catch(_){}

function v29PatchHeader(){
  if(tab!=='home')return;
  const top=document.querySelector('.main > .top');if(!top)return;
  const left=top.firstElementChild;
  if(left&&!left.classList.contains('v29TopLeft')){
    left.className='v29TopLeft';
    left.innerHTML=`${v29Logo()}<h1>Bonjour <span>👋</span></h1>`;
  }
  top.classList.add('v29Top');
  const actions=top.querySelector('.v21TopActions');
  if(actions){actions.classList.add('v29TopActions');const coach=actions.querySelector('.v21Coach span');if(coach)coach.textContent='Coach';}
}

try{
  const baseRender=render;
  render=function(){baseRender();requestAnimationFrame(()=>requestAnimationFrame(v29PatchHeader));};
}catch(_){}

try{render()}catch(_){}
})();