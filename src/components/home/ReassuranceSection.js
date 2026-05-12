'use client'
import { useState } from 'react'

const pilliers = [
  {
    icon: 'local_shipping',
    stat: '48h',
    statLabel: 'DÉLAI GARANTI',
    title: 'Logistique Fiable',
    desc: "Expédition soignée depuis nos artisans vers n'importe quel département sous 48h.",
    color: '#34d399',
  },
  {
    icon: 'payments',
    stat: '100%',
    statLabel: 'SÉCURISÉ',
    title: 'Mobile Money',
    desc: 'Paiement ultra-sécurisé via MTN MoMo, Moov Money et Celtiis. Zero frais cachés.',
    color: '#D4920A',
  },
  {
    icon: 'handshake',
    stat: '500+',
    statLabel: 'ARTISANS SOUTENUS',
    title: 'Direct Créateur',
    desc: "Chaque achat finance directement les familles d'artisans locaux et leur art ancestral.",
    color: '#a78bfa',
  },
]

export default function ReassuranceSection() {
  const [hovered, setHovered] = useState(null)

  return (
    <section style={{ background: '#F7F5F0', padding: '40px 24px 56px' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0D1F14 0%, #0e2318 50%, #111827 100%)',
          borderRadius: '28px',
          padding: '52px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grille des 3 piliers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
          }}
        >
          {pilliers.map((p, i) => {
            const isHovered = hovered === i
            const activeColor = hovered !== null ? pilliers[hovered].color : null

            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '0 40px 32px 0',
                  cursor: 'default',
                  position: 'relative',
                  // Séparateur vertical entre les colonnes
                  borderRight: i < pilliers.length - 1
                    ? '1px solid rgba(255,255,255,0.07)'
                    : 'none',
                  paddingRight: i < pilliers.length - 1 ? '40px' : '0',
                  paddingLeft: i > 0 ? '40px' : '0',
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                {/* Icône + stat */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  {/* Icône avec glow au hover */}
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: isHovered ? `${p.color}25` : `${p.color}15`,
                      border: `1px solid ${isHovered ? p.color + '60' : p.color + '25'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                      boxShadow: isHovered ? `0 0 20px ${p.color}40` : 'none',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '24px',
                        color: p.color,
                        fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24",
                        transition: 'transform 0.3s ease',
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      }}
                    >
                      {p.icon}
                    </span>
                  </div>

                  {/* Stat + label */}
                  <div>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 900,
                        lineHeight: 1,
                        color: p.color,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        transition: 'filter 0.3s ease',
                        filter: isHovered ? `drop-shadow(0 0 8px ${p.color}80)` : 'none',
                      }}
                    >
                      {p.stat}
                    </div>
                    <div
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)',
                        marginTop: '3px',
                      }}
                    >
                      {p.statLabel}
                    </div>
                  </div>
                </div>

                {/* Titre */}
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 900,
                    color: isHovered ? 'white' : 'rgba(255,255,255,0.9)',
                    marginBottom: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'color 0.3s ease',
                  }}
                >
                  {p.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.65,
                    color: isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)',
                    fontWeight: 500,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {p.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Barre coulissante animée en bas — glisse sous la colonne active */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              height: '100%',
              width: `${100 / pilliers.length}%`,
              background: hovered !== null
                ? `linear-gradient(90deg, ${pilliers[hovered].color}, ${pilliers[hovered].color}80)`
                : 'transparent',
              left: hovered !== null ? `${(hovered / pilliers.length) * 100}%` : '0%',
              transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, opacity 0.3s ease',
              opacity: hovered !== null ? 1 : 0,
              borderRadius: '0 2px 2px 0',
              boxShadow: hovered !== null ? `0 0 12px ${pilliers[hovered]?.color}80` : 'none',
            }}
          />
        </div>
      </div>
    </section>
  )
}
