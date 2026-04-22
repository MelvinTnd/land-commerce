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
    <section style={{ background: '#F7F5F0', padding: '64px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1B6B3A', display: 'block', marginBottom: 6 }}>
              Nos artisans
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#111827', margin: 0 }}>
              Boutiques d&apos;Exception
            </h2>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6, maxWidth: 380 }}>
              Des artisans soigneusement sélectionnés pour la qualité et l&apos;authenticité de leur travail.
            </p>
          </div>
          <Link href="/boutiques"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 999, border: '1.5px solid #1B6B3A', color: '#1B6B3A', fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Toutes les boutiques
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
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