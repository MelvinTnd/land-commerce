/**
 * Images locales haute qualité — stockées dans /public/images/
 * Utilisées comme fallback quand l'API ne retourne pas d'image.
 */

const CATEGORY_IMAGES = {
  // Artisanat / Art
  'artisanat':              '/images/products/artisanat.jpg',
  'arts rituels':           '/images/products/artisanat.jpg',
  'art & culture':          '/images/products/art.jpg',
  'art':                    '/images/products/art.jpg',
  'culture':                '/images/products/art.jpg',
  'sculpture':              '/images/products/art.jpg',
  // Tissus / Mode
  'mode & textile':         '/images/products/textile.jpg',
  'mode':                   '/images/products/textile.jpg',
  'textile':                '/images/products/textile.jpg',
  'tissus':                 '/images/products/wax.jpg',
  'vêtements':              '/images/products/wax.jpg',
  'vetements':              '/images/products/wax.jpg',
  // Bijoux / Accessoires
  'bijoux':                 '/images/products/artisanat.jpg',
  'maroquinerie':           '/images/products/sac.jpg',
  // Beauté / Santé
  'beauté & santé':         '/images/products/beaute.jpg',
  'beaute & sante':         '/images/products/beaute.jpg',
  'beauté':                 '/images/products/beaute.jpg',
  'sante':                  '/images/products/beaute.jpg',
  // Alimentation
  'alimentation & épices':  '/images/products/epices.jpg',
  'alimentation & epices':  '/images/products/epices.jpg',
  'alimentation':           '/images/products/epices.jpg',
  'alimentaire':            '/images/products/epices.jpg',
  'épices':                 '/images/products/epices.jpg',
  'miel':                   '/images/products/miel.jpg',
  // Maison / Déco / Poterie / Vannerie
  'maison & déco':          '/images/products/maison.jpg',
  'maison & deco':          '/images/products/maison.jpg',
  'maison':                 '/images/products/maison.jpg',
  'déco':                   '/images/products/maison.jpg',
  'poterie':                '/images/products/maison.jpg',
  'vannerie':               '/images/products/maison.jpg',
  // Divers
  'electronique':           '/images/products/default.jpg',
  'sports & loisirs':       '/images/products/default.jpg',
}

const SLUG_IMAGES = {
  // Slugs API existants
  'statue-roi-dahomey':         '/images/products/art.jpg',
  'statue-royale-abomey':       '/images/products/art.jpg',
  'masque-gelede':              '/images/products/artisanat.jpg',
  'tabouret-nago-sculpte':      '/images/products/maison.jpg',
  'porte-sacree-miniature':     '/images/products/art.jpg',
  'miel-pur-collines':          '/images/products/miel.jpg',
  'miel-pur-para':              '/images/products/miel.jpg',
  'coffret-epices-benin':       '/images/products/epices.jpg',
  'beurre-karite-pur':          '/images/products/beaute.jpg',
  'jus-ananas-pack':            '/images/products/epices.jpg',
  'sac-cuir-artisanal':         '/images/products/sac.jpg',
  'robe-wax-ankara':            '/images/products/wax.jpg',
  'pagne-tisse-akpet':          '/images/products/wax.jpg',
  'sculpture-bronze-ghezo':     '/images/products/art.jpg',
  'chemise-bogolan':            '/images/products/textile.jpg',
  'vase-ceramique-se':          '/images/products/maison.jpg',
  'tabouret-nago':              '/images/products/maison.jpg',
  // Slugs données de démo fallback
  'tissu-kita-multicolor':      '/images/products/wax.jpg',
  'sculpture-bronze-roi':       '/images/products/art.jpg',
  'perles-yoruba':              '/images/products/artisanat.jpg',
  'panier-tresse-natitingou':   '/images/products/maison.jpg',
  'batik-wax-premium':          '/images/products/wax.jpg',
  'pot-terre-cuite-glazoue':    '/images/products/maison.jpg',
  'sac-cuir-ouidah':            '/images/products/sac.jpg',
  'boubou-brodee-parakou':      '/images/products/textile.jpg',
  'bijou-bronze-danxome':       '/images/products/artisanat.jpg',
  'huile-palme-rouge':          '/images/products/epices.jpg',
  'figurine-bois-fon':          '/images/products/art.jpg',
}

const DEFAULT_IMAGE = '/images/products/default.jpg'

/**
 * Retourne l'image d'un produit avec fallback intelligent.
 */
export function getProductImage(product) {
  // Image API valide (pas null/undefined/placeholder)
  if (product?.image
    && !product.image.includes('null')
    && !product.image.includes('undefined')
    && !product.image.includes('placeholder')
  ) return product.image

  // Fallback par slug exact
  const slug = product?.slug?.toLowerCase()
  if (slug && SLUG_IMAGES[slug]) return SLUG_IMAGES[slug]

  // Fallback par catégorie (correspondance souple)
  const cat = (product?.categorie || product?.category?.name || '').toLowerCase()
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.includes(key) || key.includes(cat)) return url
  }

  return DEFAULT_IMAGE
}

/**
 * Image de bannière pour une boutique selon son nom / catégorie
 */
export function getShopBannerImage(shop) {
  const name = (shop?.name || '').toLowerCase()
  const desc = (shop?.description || '').toLowerCase()
  const combined = name + ' ' + desc

  if (combined.includes('fashion') || combined.includes('mode') || combined.includes('textile') || combined.includes('wax')) {
    return '/images/shops/fashion.jpg'
  }
  if (combined.includes('artisan') || combined.includes('sculpt') || combined.includes('bronze') || combined.includes('art')) {
    return '/images/shops/artisan.jpg'
  }
  if (combined.includes('épice') || combined.includes('miel') || combined.includes('aliment') || combined.includes('saveur') || combined.includes('karit')) {
    return '/images/shops/food.jpg'
  }
  return '/images/shops/default.jpg'
}

// Alias rétrocompatibilité
export const getShopImage = getShopBannerImage
