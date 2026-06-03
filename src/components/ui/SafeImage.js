'use client'
import { useState } from 'react'

/**
 * SafeImage — Wrapper image universel avec fallback automatique.
 *
 * Si l'image source échoue à charger (404, domaine bloqué, erreur réseau),
 * affiche automatiquement un avatar coloré avec les initiales.
 *
 * Props :
 *  - src      : URL de l'image à afficher
 *  - name     : Nom pour générer les initiales du fallback (ex: "Atelier Kanvô")
 *  - alt      : Texte alternatif
 *  - fill     : Si true, positiomne l'image en absolute inset-0 (comme next/image fill)
 *  - className, style : classes et styles CSS
 *  - sizes    : Ignoré (compatibilité avec next/image API)
 */
export default function SafeImage({
  src,
  name = '?',
  alt = '',
  fill = false,
  className = '',
  style = {},
  sizes,          // accepté pour compatibilité, non utilisé
  ...rest
}) {
  const [failed, setFailed] = useState(false)

  // Générer les initiales (max 2 lettres)
  const initials = (name || '?')
    .split(/[\s\-_&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
    || '?'

  // Couleur de fond déterministe basée sur le nom
  const COLORS = [
    '#1B6B3A', '#D4920A', '#7C3AED', '#DB2777',
    '#0891B2', '#059669', '#DC2626', '#EA580C',
  ]
  const colorIdx = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length
  const bgColor = COLORS[colorIdx]

  // Styles de base communs
  const baseStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : style

  // Fallback avatar avec initiales
  const fallbackStyle = fill
    ? {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        background: bgColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...style
      }
    : {
        background: bgColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...style
      }

  if (failed || !src) {
    return (
      <div className={className} style={fallbackStyle} aria-label={alt || name} {...rest}>
        <span style={{
          color: 'white',
          fontWeight: 900,
          fontSize: '40%',
          letterSpacing: '0.02em',
          userSelect: 'none',
          lineHeight: 1,
        }}>
          {initials}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt || name}
      className={className}
      style={baseStyle}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
