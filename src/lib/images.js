/**
 * Images Unsplash haute qualité — URLs directes vérifiées
 * Organisées par catégorie de produits béninois / artisanat africain
 */

// ─── Images produits par catégorie (Unsplash, thème africain/artisanat) ───────
const CATEGORY_IMAGES = {
  // Artisanat / Sculpture / Art
  'artisanat':              'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
  'arts rituels':           'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800',
  'art & culture':          'https://images.unsplash.com/photo-1561918842-88889e0a18a2?auto=format&fit=crop&q=80&w=800',
  'art':                    'https://images.unsplash.com/photo-1561918842-88889e0a18a2?auto=format&fit=crop&q=80&w=800',
  'culture':                'https://images.unsplash.com/photo-1561918842-88889e0a18a2?auto=format&fit=crop&q=80&w=800',
  'sculpture':              'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800',
  // Tissus / Mode
  'mode & textile':         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
  'mode':                   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
  'textile':                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
  'tissus':                 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=800',
  'vêtements':              'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&q=80&w=800',
  'vetements':              'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&q=80&w=800',
  // Bijoux / Accessoires
  'bijoux':                 'https://images.unsplash.com/photo-1573408301185-9519f94945b8?auto=format&fit=crop&q=80&w=800',
  'maroquinerie':           'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
  // Beauté / Santé
  'beauté & santé':         'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=800',
  'beaute & sante':         'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=800',
  'beauté':                 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=800',
  'sante':                  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=800',
  // Alimentation
  'alimentation & épices':  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'alimentation & epices':  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'alimentation':           'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'alimentaire':            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'épices':                 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'miel':                   'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
  // Maison / Déco / Poterie / Vannerie
  'maison & déco':          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'maison & deco':          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'maison':                 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'déco':                   'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'poterie':                'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'vannerie':               'https://images.unsplash.com/photo-1559564484-ac4a9db6b7c0?auto=format&fit=crop&q=80&w=800',
  // Autres
  'electronique':           'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  'sports & loisirs':       'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800',
}

// ─── Images par slug produit ────────────────────────────────────────────────
const SLUG_IMAGES = {
  'statue-roi-dahomey':         'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800',
  'statue-royale-abomey':       'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800',
  'masque-gelede':              'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
  'tabouret-nago-sculpte':      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'porte-sacree-miniature':     'https://images.unsplash.com/photo-1561918842-88889e0a18a2?auto=format&fit=crop&q=80&w=800',
  'miel-pur-collines':          'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
  'miel-pur-para':              'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=800',
  'coffret-epices-benin':       'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'beurre-karite-pur':          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=800',
  'jus-ananas-pack':            'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=800',
  'sac-cuir-artisanal':         'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
  'robe-wax-ankara':            'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=800',
  'pagne-tisse-akpet':          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
  'sculpture-bronze-ghezo':     'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800',
  'chemise-bogolan':            'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&q=80&w=800',
  'vase-ceramique-se':          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'tabouret-nago':              'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  // Slugs fallback
  'tissu-kita-multicolor':      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=800',
  'sculpture-bronze-roi':       'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800',
  'perles-yoruba':              'https://images.unsplash.com/photo-1573408301185-9519f94945b8?auto=format&fit=crop&q=80&w=800',
  'panier-tresse-natitingou':   'https://images.unsplash.com/photo-1559564484-ac4a9db6b7c0?auto=format&fit=crop&q=80&w=800',
  'masque-gelede-traditionnel': 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
  'batik-wax-premium':          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
  'pot-terre-cuite-glazoue':    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'sac-cuir-ouidah':            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
  'boubou-brodee-parakou':      'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&q=80&w=800',
  'bijou-bronze-danxome':       'https://images.unsplash.com/photo-1573408301185-9519f94945b8?auto=format&fit=crop&q=80&w=800',
  'huile-palme-rouge':          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'figurine-bois-fon':          'https://images.unsplash.com/photo-1561918842-88889e0a18a2?auto=format&fit=crop&q=80&w=800',
}

// ─── Image par défaut ────────────────────────────────────────────────────────
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800'

/**
 * Retourne l'image d'un produit avec fallback par nom, slug et catégorie.
 * Les images de l'API Render étant incorrectes, on priorise nos Unsplash.
 */
export function getProductImage(product) {
  const slug = (product?.slug || '').toLowerCase()
  const nom  = (product?.name || product?.nom || '').toLowerCase()
  const cat  = (product?.categorie || product?.category?.name || '').toLowerCase()

  // Combiné pour le matching (slug + nom)
  const combined = slug + ' ' + nom

  // 1. Slug exact
  if (slug && SLUG_IMAGES[slug]) return SLUG_IMAGES[slug]

  // 2. Slug partiel
  for (const [key] of Object.entries(SLUG_IMAGES)) {
    if (slug.length > 3 && (slug.includes(key) || key.includes(slug))) return SLUG_IMAGES[key]
  }

  // 3. Matching par mots-clés dans nom/slug (pour les slugs API inconnus)
  const KEYWORDS = [
    { words: ['tissu', 'wax', 'batik', 'kita', 'pagne'],       url: SLUG_IMAGES['tissu-kita-multicolor'] },
    { words: ['sculpture', 'bronze', 'statue', 'roi', 'abomey', 'ghezo'], url: SLUG_IMAGES['sculpture-bronze-roi'] },
    { words: ['masque', 'gelede', 'gèlèdè'],                   url: SLUG_IMAGES['masque-gelede'] },
    { words: ['panier', 'tressé', 'tresse', 'natitingou', 'vannerie'], url: SLUG_IMAGES['panier-tresse-natitingou'] },
    { words: ['perle', 'yoruba', 'collier', 'bijou', 'bronze'], url: SLUG_IMAGES['bijou-bronze-danxome'] },
    { words: ['boubou', 'brodé', 'mode', 'parakou', 'bogolan'], url: SLUG_IMAGES['boubou-brodee-parakou'] },
    { words: ['sac', 'cuir', 'maroquinerie'],                  url: SLUG_IMAGES['sac-cuir-ouidah'] },
    { words: ['miel', 'pur'],                                  url: SLUG_IMAGES['miel-pur-collines'] },
    { words: ['épice', 'epice', 'coffret', 'ananas', 'huile', 'palme'], url: SLUG_IMAGES['coffret-epices-benin'] },
    { words: ['beurre', 'karité', 'karite', 'beauté'],        url: SLUG_IMAGES['beurre-karite-pur'] },
    { words: ['pot', 'terre', 'cuite', 'poterie', 'vase', 'ceramique'], url: SLUG_IMAGES['vase-ceramique-se'] },
    { words: ['figurine', 'bois', 'fon', 'tabouret'],         url: SLUG_IMAGES['tabouret-nago-sculpte'] },
    { words: ['chemise', 'textile'],                           url: SLUG_IMAGES['chemise-bogolan'] },
  ]
  for (const { words, url } of KEYWORDS) {
    if (words.some(w => combined.includes(w))) return url
  }

  // 4. Catégorie
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.length > 2 && (cat.includes(key) || key.includes(cat))) return url
  }

  // 5. Image API (ignorée car incorrecte sur Render — mais gardée en dernier recours)
  // if (product?.image && !product.image.startsWith('/images/')) return product.image

  return DEFAULT_IMAGE
}


// ─── Bannières de boutiques ──────────────────────────────────────────────────
const SHOP_BANNERS = {
  fashion:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200',
  artisan:  'https://images.unsplash.com/photo-1578330740121-657805126f5f?auto=format&fit=crop&q=80&w=1200',
  food:     'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200',
  bijoux:   'https://images.unsplash.com/photo-1573408301185-9519f94945b8?auto=format&fit=crop&q=80&w=1200',
  poterie:  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1200',
  default:  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200',
}

/**
 * Image de bannière pour une boutique selon son nom / catégorie
 */
export function getShopBannerImage(shop) {
  const combined = ((shop?.name || '') + ' ' + (shop?.description || '')).toLowerCase()

  if (combined.includes('fashion') || combined.includes('mode') || combined.includes('textile') || combined.includes('wax') || combined.includes('tissu')) {
    return SHOP_BANNERS.fashion
  }
  if (combined.includes('bijou') || combined.includes('perle') || combined.includes('collier')) {
    return SHOP_BANNERS.bijoux
  }
  if (combined.includes('épice') || combined.includes('miel') || combined.includes('aliment') || combined.includes('saveur') || combined.includes('karit')) {
    return SHOP_BANNERS.food
  }
  if (combined.includes('poter') || combined.includes('ceramic') || combined.includes('terre')) {
    return SHOP_BANNERS.poterie
  }
  if (combined.includes('artisan') || combined.includes('sculpt') || combined.includes('bronze') || combined.includes('art') || combined.includes('bois')) {
    return SHOP_BANNERS.artisan
  }
  return SHOP_BANNERS.default
}

// Alias rétrocompatibilité
export const getShopImage = getShopBannerImage
