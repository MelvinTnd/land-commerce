'use client'
import { useState, useEffect, useCallback } from 'react'

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
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setActive(prev => (prev + 1) % pilliers.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  return (
    <section style={{ background: '#F7F5F0', padding: '40px 16px 56px' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0D1F14 0%, #0e2318 50%, #111827 100%)',
          borderRadius: '20px',
          padding: '32px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="sm:rounded-[28px] sm:p-[52px_56px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Grille des 3 piliers */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {pilliers.map((p, i) => {
            const isActive = active === i

            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: '16px',
                  background: isActive ? `${p.color}12` : 'transparent',
                  border: `1px solid ${isActive ? p.color + '50' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isActive ? `0 8px 32px ${p.color}30` : 'none',
                }}
                className="sm:p-[28px_32px_32px]"
              >
                {/* Icône + stat */}
                <div className="flex items-center gap-4 mb-4 sm:mb-5">
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: isActive ? `${p.color}25` : `${p.color}15`,
                      border: `1px solid ${isActive ? p.color + '60' : p.color + '25'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.5s ease',
                      boxShadow: isActive ? `0 0 24px ${p.color}50` : 'none',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '24px',
                        color: p.color,
                        fontVariationSettings: "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24",
                        transition: 'transform 0.5s ease',
                        transform: isActive ? 'scale(1.2) rotate(-8deg)' : 'scale(1) rotate(0deg)',
                      }}
                    >
                      {p.icon}
                    </span>
                  </div>

                  <div>
                    <div
                      className="text-[26px] sm:text-[32px]"
                    style={{
                        fontWeight: 900,
                        lineHeight: 1,
                        color: p.color,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        transition: 'filter 0.5s ease',
                        filter: isActive ? `drop-shadow(0 0 12px ${p.color}80)` : 'none',
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

                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 900,
                    color: isActive ? 'white' : 'rgba(255,255,255,0.85)',
                    marginBottom: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'color 0.5s ease',
                  }}
                >
                  {p.title}
                </h3>

                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.65,
                    color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                    fontWeight: 500,
                    transition: 'color 0.5s ease',
                  }}
                >
                  {p.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Points indicateurs */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {pilliers.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: active === i ? '28px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: active === i ? p.color : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 0,
              }}
              aria-label={`Voir ${p.title}`}
            />
          ))}
        </div>

        {/* Barre de progression */}
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
              background: `linear-gradient(90deg, ${pilliers[active].color}, ${pilliers[active].color}80)`,
              left: `${(active / pilliers.length) * 100}%`,
              transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease',
              borderRadius: '0 2px 2px 0',
              boxShadow: `0 0 12px ${pilliers[active].color}80`,
            }}
          />
        </div>
      </div>
    </section>
  )
}
