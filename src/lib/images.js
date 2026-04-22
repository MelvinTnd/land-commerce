/**
 * Images de fallback Unsplash par catégorie pour les produits sans image.
 * À utiliser partout dans l'app avec getProductImage(product).
 */

const CATEGORY_IMAGES = {
  'artisanat':      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'mode & textile': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
  'beauté & santé': 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
  'beaute & sante': 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
  'alimentation & épices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'alimentation & epices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'art & culture':  'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&q=80&w=800',
  'maison & déco':  'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=800',
  'maison & deco':  'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=800',
  'electronique':   'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  'sports & loisirs': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
}

const SLUG_IMAGES = {
  'statue-royale-abomey':     'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&q=80&w=800',
  'masque-gelede':            'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800',
  'tabouret-nago-sculpte':    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=800',
  'porte-sacree-miniature':   'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&q=80&w=800',
  'miel-pur-collines':        'https://images.unsplash.com/photo-1587049352886-3f3dc83c0e14?auto=format&fit=crop&q=80&w=800',
  'coffret-epices-benin':     'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  'beurre-karite-pur':        'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
  'jus-ananas-pack':          'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800',
  'sac-cuir-artisanal':       'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
  'robe-wax-ankara':          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
  'sculpture-bronze-ghezo':   'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?auto=format&fit=crop&q=80&w=800',
  'chemise-bogolan':          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800'

/**
 * Retourne l'image d'un produit avec fallback intelligent.
 * @param {object} product - objet produit
 * @param {string} product.image
 * @param {string} product.slug
 * @param {string} product.categorie - nom de catégorie
 * @returns {string} URL de l'image
 */
export function getProductImage(product) {
  if (product?.image && !product.image.includes('null')) return product.image
  // Fallback par slug exact
  const slug = product?.slug?.toLowerCase()
  if (slug && SLUG_IMAGES[slug]) return SLUG_IMAGES[slug]
  // Fallback par catégorie
  const cat = (product?.categorie || product?.category?.name || '').toLowerCase()
  for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.includes(key) || key.includes(cat)) return url
  }
  return DEFAULT_IMAGE
}

/**
 * Image pour une boutique selon son nom
 */
export function getShopImage(shop) {
  const name = (shop?.name || '').toLowerCase()
  if (name.includes('fashion') || name.includes('mode') || name.includes('textile')) {
    return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800'
  }
  if (name.includes('kanvô') || name.includes('kanvo') || name.includes('artisan') || name.includes('sculpture')) {
    return 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800'
  }
  if (name.includes('kaba') || name.includes('épice') || name.includes('miel') || name.includes('fils')) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800'
  }
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
}
