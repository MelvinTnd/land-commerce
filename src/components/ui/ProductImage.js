'use client'
import { useState } from 'react'

/**
 * Mapping mot-clé → image produit (chemins locaux générés par IA ou Unsplash).
 * Priorité : premier match gagne. Basé sur le NOM du produit.
 */
const KEYWORD_MAP = [
  // ── Tissus / Wax (image locale générée) ──────────────────────────────────
  { keys: ['tissu', 'wax', 'batik', 'kita', 'pagne', 'ankara'],
    url: '/images/products/wax.png' },
  // ── Vêtements brodés / Boubou ─────────────────────────────────────────────
  { keys: ['boubou', 'brodé', 'brode', 'agbada', 'bogolan', 'tenue', 'vêtement'],
    url: '/images/products/wax.png' },
  // ── Sculpture / Masque africain (image locale générée) ────────────────────
  { keys: ['sculpture', 'masque', 'gelede', 'gèlèdè', 'roi', 'statue'],
    url: '/images/products/sculpture.png' },
  // ── Bronze / Art africain ─────────────────────────────────────────────────
  { keys: ['bronze', 'danxomè', 'danxome', 'ghezo', 'abomey', 'dahomey'],
    url: '/images/products/sculpture.png' },
  // ── Figurine / Bois sculpté ───────────────────────────────────────────────
  { keys: ['figurine', 'bois', 'tabouret', 'fon', 'sculpté'],
    url: '/images/products/sculpture.png' },
  // ── Bijoux / Perles (image locale générée) ───────────────────────────────
  { keys: ['bijou', 'perle', 'collier', 'bracelet', 'yoruba', 'parure'],
    url: '/images/products/bijoux.png' },
  // ── Sac / Cuir (image locale générée) ────────────────────────────────────
  { keys: ['sac', 'cuir', 'maroquinerie', 'sacoche', 'pochette'],
    url: '/images/products/sac.png' },
  // ── Panier tressé (image locale générée) ─────────────────────────────────
  { keys: ['panier', 'tressé', 'tresse', 'vannerie', 'natte'],
    url: '/images/products/panier.png' },
  // ── Poterie / Terre cuite (image locale générée) ─────────────────────────
  { keys: ['pot', 'poterie', 'céramique', 'ceramique', 'terre', 'cuite', 'argile', 'vase', 'glazoué', 'glazoue'],
    url: '/images/products/poterie.png' },
  // ── Miel (fichier existant .jpg) ─────────────────────────────────────────
  { keys: ['miel', 'honey'],
    url: '/images/products/miel.jpg' },
  // ── Épices / Alimentation / Huile ────────────────────────────────────────
  { keys: ['épice', 'epice', 'coffret', 'huile', 'palme', 'jus', 'ananas', 'aliment'],
    url: '/images/products/epices.jpg' },
  // ── Beauté / Karité ───────────────────────────────────────────────────────
  { keys: ['beurre', 'karité', 'karite', 'beauté', 'beaute', 'soin', 'shea'],
    url: '/images/products/beaute.jpg' },
  // ── Mode / Chemise Textile ────────────────────────────────────────────────
  { keys: ['chemise', 'robe', 'textile', 'mode'],
    url: '/images/products/textile.jpg' },
  // ── Art / Tableau / Maison ────────────────────────────────────────────────
  { keys: ['art', 'sacré', 'objet', 'porte', 'mobilier'],
    url: '/images/products/art.jpg' },
]

const DEFAULT_URL = '/images/products/sculpture.png'


/**
 * Détermine l'URL correcte à partir du NOM du produit.
 * Ignore complètement l'image API car elle est incorrecte.
 */
export function getImageByName(nom = '') {
  const n = nom.toLowerCase()
  for (const { keys, url } of KEYWORD_MAP) {
    if (keys.some(k => n.includes(k))) return url
  }
  return DEFAULT_URL
}

/**
 * Composant img intelligent avec :
 * - Sélection automatique de l'image Unsplash par nom de produit
 * - Fallback gracieux si l'image ne charge pas
 */
export default function ProductImage({ nom, categorie, apiImage, className, style, fill, sizes }) {
  // 1. Détection d'une image réelle de l'API (uploadée par le vendeur)
  const isRealImage = apiImage && (apiImage.startsWith('http') || apiImage.includes('/storage/'))
  
  // 2. Si pas d'image réelle, on utilise le fallback par nom
  const correctUrl = isRealImage ? apiImage : getImageByName(nom || '')

  const [src, setSrc] = useState(correctUrl)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    if (src !== DEFAULT_URL) {
      setSrc(DEFAULT_URL)
    } else {
      setFailed(true)
    }
  }

  if (failed) {
    return (
      <div className={className} style={{
        ...style,
        background: 'linear-gradient(135deg, #1B6B3A22 0%, #D4920A22 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: '#1B6B3A88', fontSize: 32 }}>🎨</span>
      </div>
    )
  }

  if (fill) {
    return (
      <img
        src={src}
        alt={nom || ''}
        onError={handleError}
        className={className}
        style={{ ...style, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }

  return (
    <img
      src={src}
      alt={nom || ''}
      onError={handleError}
      className={className}
      style={style}
    />
  )
}
