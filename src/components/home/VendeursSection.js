'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getShops } from '@/lib/api'
import { defaultShops } from '@/lib/defaultData'

export default function VendeursSection() {
  const [vendeurs, setVendeurs] = useState(defaultShops)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShops()
      .then(data => {
        if (!data || data.length === 0) {
          setLoading(false)
          return
        }
        const apiShops = data
          .filter(s => s.status === 'active')
          .map(s => ({
            id: s.slug,
            nom: s.name,
            subtitle: s.location || 'Bénin',
            avatar: s.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1B6B3A&color=fff&size=200`,
            quote: s.description
              ? s.description.substring(0, 100) + (s.description.length > 100 ? '...' : '')
              : 'Produits exceptionnels et savoir-faire unique du Bénin.',
            extra: s.products_count || 0,
          }))
        if (apiShops.length > 0) setVendeurs(apiShops)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#F9FAFA]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16 border-b border-gray-200 pb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#EAB308] text-[20px]">verified</span>
              <p className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-[#1B6B3A]">
                Nos Maîtres Artisans
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight">
              Vendeurs à <span className="text-[#1B6B3A]">la Une</span>
            </h2>
          </div>
          <Link
            href="/boutiques"
            className="hidden sm:flex items-center gap-2 font-extrabold text-[11px] uppercase tracking-widest text-[#1B6B3A] hover:text-[#134e29] transition-colors py-2 px-4 rounded-full bg-[#E6F8EA] hover:bg-[#D2F4DE]"
          >
            Toutes les Boutiques
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* États : Loading / Vide / Liste */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[32px] p-6 border border-gray-100 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-20 bg-gray-100 rounded-[20px] mb-6" />
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-[14px] bg-gray-100" />
                  <div className="w-16 h-16 rounded-[14px] bg-gray-100" />
                  <div className="w-16 h-16 rounded-[14px] bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : vendeurs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
            <div className="w-20 h-20 rounded-full bg-[#E6F8EA] flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#1B6B3A] text-[36px]">storefront</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#111827] mb-2">Aucun artisan encore inscrit</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
              La marketplace est prête — les premiers vendeurs peuvent s&apos;inscrire et présenter leurs créations dès maintenant.
            </p>
            <Link
              href="/inscription"
              className="bg-[#1B6B3A] text-white font-extrabold text-[12px] uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#134e29] transition-colors shadow-md"
            >
              Devenir Vendeur →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vendeurs.map((vendeur) => (
              <Link
                key={vendeur.id}
                href={`/boutique/${vendeur.id}`}
                className="group bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D2F4DE] hover:-translate-y-2 transition-all duration-300 ease-out"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                      <Image
                        src={vendeur.avatar}
                        alt={vendeur.nom}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1B6B3A] border-2 border-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-white text-[12px]">workspace_premium</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[16px] text-[#111827] group-hover:text-[#1B6B3A] transition-colors">
                      {vendeur.nom}
                    </h4>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#EAB308]">
                      {vendeur.subtitle}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative bg-gray-50 rounded-[20px] p-5 mb-6 group-hover:bg-[#E6F8EA] transition-colors">
                  <span className="material-symbols-outlined absolute -top-3 left-4 text-[#D2F4DE] text-[24px]">format_quote</span>
                  <p className="text-[13px] text-gray-600 font-medium italic leading-relaxed pt-2">
                    &quot;{vendeur.quote}&quot;
                  </p>
                </div>

                {/* Articles count */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    {vendeur.extra} article{vendeur.extra !== 1 ? 's' : ''}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#1B6B3A] group-hover:underline">
                    Voir la boutique →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="/boutiques" className="inline-flex items-center gap-2 font-extrabold text-[12px] uppercase tracking-widest text-[#1B6B3A] bg-[#E6F8EA] py-4 px-8 rounded-full shadow-sm">
            Toutes les Boutiques
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

      </div>
    </section>
  )
}