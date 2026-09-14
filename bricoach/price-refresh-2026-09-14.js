/* Relevé prix vérifié 14/09/2026 — ne remplace jamais une ligne non sourcée par une estimation. */
(() => {
  if (typeof loadPriceCatalogV12 !== 'function') return;
  const base = loadPriceCatalogV12;
  loadPriceCatalogV12 = async function(){
    const c = await base();
    c.updatedAt = '2026-09-14T08:03:00+02:00';
    c.scope = 'France - prix web de référence vérifiés le 14/09/2026, hors livraison et sous réserve du magasin';
    const visby = c?.retailers?.castorama?.products?.['Sol / parquet']?.Premium;
    if (visby && /Visby M/i.test(visby.name || '')) {
      visby.price = 43.90;
      visby.url = 'https://www.castorama.fr/parquet-contrecolle-clipsable-visby-m-en-chene-verni-blond-rustique/5059340394275_CAFR.prd';
      visby.verified = true;
      visby.checkedAt = '2026-09-14';
    }
    return c;
  };
})();