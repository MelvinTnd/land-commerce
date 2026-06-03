'use client'
import { useState } from 'react'
import Image from 'next/image'

/**
 * SafeImage — Next.js Image avec fallback automatique en cas d'erreur.
 * Si l'image principale ne se charge pas, affiche un avatar ui-avatars
 * ou un placeholder neutre.
 *
 * Props :
 *   src         — URL principale de l'image
 *   fallbackSrc — URL de secours (optionnel). Par défaut: ui-avatars ou placeholder gris
 *   name        — Nom pour générer un avatar ui-avatars si pas de fallbackSrc
 *   alt, fill, sizes, className, style, priority, unoptimized, ...rest
 */
export default function SafeImage({
  src,
  fallbackSrc,
  name = '',
  alt = '',
  fill,
  sizes,
  className = '',
  style = {},
  priority = false,
  unoptimized = true,
  showPlaceholder = true,
  ...rest
}) {
  const getFallback = () => {
    if (fallbackSrc) return fallbackSrc
    if (name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1B6B3A&color=fff&size=200`
    }
    return null // utilisera le placeholder interne
  }

  const initialSrc = src || getFallback() || null
  const [imgSrc, setImgSrc] = useState(initialSrc)
  const [hasError, setHasError] = useState(!initialSrc)
  const [triedFallback, setTriedFallback] = useState(false)

  const handleError = () => {
    if (!triedFallback) {
      const fb = getFallback()
      if (fb && fb !== imgSrc) {
        setImgSrc(fb)
        setTriedFallback(true)
        return
      }
    }
    setHasError(true)
  }

  // Placeholder interne si tout échoue
  if (hasError || !imgSrc) {
    if (!showPlaceholder) return null
    return (
      <div
        className={className}
        style={{
          background: 'linear-gradient(135deg, #E6F8EA, #D2F4DE)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        {...(fill ? { 'data-fill': true } : {})}
      >
        {name ? (
          <span style={{ fontSize: '1.1em', fontWeight: 900, color: '#1B6B3A', letterSpacing: '-0.02em' }}>
            {name.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <span className="material-symbols-outlined" style={{ color: '#A7F3D0', fontSize: '1.5em' }}>image</span>
        )}
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      style={style}
      priority={priority}
      unoptimized={unoptimized}
      onError={handleError}
      {...rest}
    />
  )
}
