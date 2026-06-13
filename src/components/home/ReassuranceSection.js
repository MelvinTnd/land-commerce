'use client'
import { useState, useEffect, useCallback } from 'react'

const pilliers = [
  {
    icon: 'local_shipping',
    stat: '48h',
    statLabel: 'DÉLAI GARANTI',
    title: 'Logistique Fiable',
    desc: "Expédition soignée depuis nos artisans vers n'importe quel département sous 48h.",
  },
  {
    icon: 'payments',
    stat: '100%',
    statLabel: 'SÉCURISÉ',
    title: 'Paiement Sécurisé',
    desc: 'Paiement ultra-sécurisé via MTN MoMo, Moov Money et Celtiis. Zero frais cachés.',
  },
  {
    icon: 'handshake',
    stat: '500+',
    statLabel: 'CRÉATEURS SOUTENUS',
    title: 'Direct Créateur',
    desc: "Chaque achat finance directement les créateurs locaux et leur savoir-faire exceptionnel.",
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
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  return (
    <section className="bg-white border-y border-gray-200 py-16 px-4">
      <div
        style={{ maxWidth: '1280px', margin: '0 auto' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {pilliers.map((p, i) => {
            const isActive = active === i

            return (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`p-10 lg:p-12 cursor-pointer transition-colors duration-500 flex flex-col items-center text-center ${isActive ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white border border-gray-200 rounded-full shadow-sm mb-6">
                  <span className="material-symbols-outlined text-[24px] text-gray-900" style={{ fontVariationSettings: "'FILL' 0" }}>
                    {p.icon}
                  </span>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-1 leading-none">{p.stat}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">{p.statLabel}</div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-sm font-normal text-gray-600 leading-relaxed max-w-sm">
                  {p.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
