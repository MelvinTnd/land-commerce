'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getShops } from '@/lib/api'
import Image from 'next/image'

const COLORS = ['#1B6B3A', '#D4920A', '#7C3AED', '#DB2777']

export default function ProduitsBoutiques() {
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShops()
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || [])
        setBoutiques(list.slice(0, 4).map((s, i) => ({
          id: s.id,
          name: s.name,
          location: s.location || 'Bénin',
          slug: s.slug,
          logo: s.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=${COLORS[i % COLORS.length].slice(1)}&color=fff&size=200`,
          products_count: s.products_count || 0,
          color: COLORS[i % COLORS.length],
        })))
      })
      .catch(() => setBoutiques([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (boutiques.length === 0) return null

  return (
    <section className="bg-gray-50/50 py-16 px-6 lg:px-10 border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest block mb-2" style={{ color: '#1B6B3A' }}>
              Nos artisans
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight m-0">
              Boutiques d&apos;Exception
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-2 max-w-sm leading-relaxed mb-0">
              Des artisans soigneusement sélectionnés pour la qualité et l&apos;authenticité de leur travail.
            </p>
          </div>
          <Link href="/boutiques"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-gray-100"
            style={{ border: '1.5px solid #1B6B3A', color: '#1B6B3A' }}>
            Toutes les boutiques
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Grille boutiques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {boutiques.map((b) => (
            <Link
              key={b.id}
              href={`/boutique/${b.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: '#fff',
                borderRadius: 24,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 12,
                border: '1px solid #F0EDE8',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)' }}>
                {/* Logo */}
                <div style={{ width: 72, height: 72, borderRadius: 18, overflow: 'hidden', border: `3px solid ${b.color}20`, position: 'relative', flexShrink: 0 }}>
                  <Image src={b.logo} alt={b.name} fill style={{ objectFit: 'cover' }} unoptimized sizes="72px" />
                </div>

                {/* Infos */}
                <div>
                  <p style={{ fontWeight: 900, fontSize: 15, color: '#111827', margin: 0 }}>{b.name}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>📍 {b.location}</p>
                </div>

                {/* Badge produits */}
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: `${b.color}15`, color: b.color }}>
                  {b.products_count} produit{b.products_count > 1 ? 's' : ''}
                </span>

                {/* CTA */}
                <span style={{ fontSize: 11, fontWeight: 800, color: b.color }}>
                  Voir la boutique →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}