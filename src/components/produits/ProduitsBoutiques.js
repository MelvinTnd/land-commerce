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
    <section style={{ borderTop: '1px solid #E5E7EB' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] block mb-2 flex items-center gap-2"
              style={{ color: '#1B6B3A' }}>
              <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
              Nos artisans
            </span>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>
              Boutiques d&apos;Exception
            </h2>
            <p className="text-[14px] font-medium mt-2 max-w-sm" style={{ color: '#6B7280' }}>
              Des artisans soigneusement sélectionnés pour la qualité et l&apos;authenticité de leur travail.
            </p>
          </div>
          <Link href="/boutiques"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-gray-900 hover:text-white"
            style={{ color: '#0D0D0D' }}>
            Toutes les boutiques
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>

        {/* Grille boutiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
          {boutiques.map((b) => (
            <Link key={b.id} href={`/boutique/${b.slug}`} style={{ textDecoration: 'none' }}>
              <div className="bg-white p-6 flex flex-col items-center text-center gap-4 transition-colors cursor-pointer h-full"
                onMouseEnter={e => { e.currentTarget.style.background = '#F7F5F0' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>

                {/* Logo */}
                <div className="relative shrink-0" style={{ width: 72, height: 72, border: `2px solid ${b.color}` }}>
                  <Image src={b.logo} alt={b.name} fill style={{ objectFit: 'cover' }} unoptimized sizes="72px" />
                </div>

                {/* Infos */}
                <div>
                  <p className="font-black text-[14px]" style={{ color: '#0D0D0D' }}>{b.name}</p>
                  <p className="text-[11px] mt-1 flex items-center justify-center gap-1" style={{ color: '#9CA3AF' }}>
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {b.location}
                  </p>
                </div>

                {/* Badge produits */}
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1"
                  style={{ background: `${b.color}15`, color: b.color }}>
                  {b.products_count} produit{b.products_count > 1 ? 's' : ''}
                </span>

                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: b.color }}>
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