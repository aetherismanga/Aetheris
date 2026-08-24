function setW(key,val){
  if(!wizard)return;
  wizard[key]=val;
  if(key==='category'){
    if(val==='Carrelage'){wizard.scope='Sol + murs';wizard.tileFormat='60 × 60';wizard.support='Chape / ciment';wizard.tilePose='Droite';wizard.wetArea=/Salle de bain|WC/.test(wizard.room);}
    if(val==='Peinture'){wizard.scope='Murs + plafond';wizard.paintState='Petites reprises';wizard.paintFinish='Velours';}
    if(val==='Sol / parquet'){wizard.floorProduct='Stratifié';wizard.floorInstall='Flottante';wizard.support='Chape / ciment';}
    if(val==='Placo / isolation'){wizard.placoWork='Cloison';wizard.plateType=/Salle de bain|WC/.test(wizard.room)?'Hydrofuge':'BA13 standard';wizard.insulation='Sans isolant';}
  }
  if(key==='room'){
    if(wizard.category==='Carrelage')wizard.wetArea=/Salle de bain|WC/.test(val);
    if(wizard.category==='Placo / isolation'&&/Salle de bain|WC/.test(val))wizard.plateType='Hydrofuge';
  }
  renderWizard();
}