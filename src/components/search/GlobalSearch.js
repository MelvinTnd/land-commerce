'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getProducts, getShops } from '@/lib/api'

export default function GlobalSearch({ onClose }) {
  const [query, setQuery]         = useState('')
  const [produits, setProduits]   = useState([])
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading]     = useState(false)
  const router = useRouter()
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) { setProduits([]); setBoutiques([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const [p, s] = await Promise.all([
          getProducts({ search: query, limit: 5 }),
          getShops({ search: query, limit: 4 }),
        ])
        
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api').replace('/api', '')
        
        setProduits((p.data || []).map(item => {
          let img = item.image
          if (img && img.startsWith('/storage/')) img = apiBase + img
          return { ...item, image: img }
        }))
        
        setBoutiques((Array.isArray(s) ? s : []).map(item => {
          let logo = item.logo
          if (logo && logo.startsWith('/storage/')) logo = apiBase + logo
          return { ...item, logo: logo }
        }))
      } catch { /* silent */ }
      setLoading(false)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const go = (href) => { router.push(href); onClose?.() }

  const hasResults = produits.length > 0 || boutiques.length > 0

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Barre de recherche */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid #F3F4F6' }}>
        <span className="material-symbols-outlined text-[22px]" style={{ color: '#1B6B3A' }}>search</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && query.trim()) go(`/produits?q=${encodeURIComponent(query)}`)
            if (e.key === 'Escape') onClose?.()
          }}
          placeholder="Rechercher un produit, une boutique..."
          className="flex-1 text-[15px] font-medium outline-none bg-transparent"
          style={{ color: '#0D0D0D' }}
        />
        {loading && (
          <div className="w-5 h-5 border-2 border-[#1B6B3A] border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {query && !loading && (
          <button onClick={() => setQuery('')}>
            <span className="material-symbols-outlined text-[20px]" style={{ color: '#9CA3AF' }}>close</span>
          </button>
        )}
      </div>

      {/* Contenu résultats */}
      <div className="overflow-y-auto flex-1 px-4 py-3">
        {!query.trim() ? (
          /* État vide — suggestions rapides */
          <div className="py-6 text-center">
            <span className="material-symbols-outlined text-[48px] mb-3 block" style={{ color: '#E5E7EB' }}>search</span>
            <p className="text-sm font-bold" style={{ color: '#9CA3AF' }}>Commencez à taper pour rechercher</p>
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              {['Tissu','Poterie','Épices','Bronze','Batik','Pagnés'].map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors hover:bg-green-50"
                  style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : !loading && !hasResults ? (
          <div className="py-10 text-center">
            <span className="material-symbols-outlined text-[40px] mb-3 block" style={{ color: '#E5E7EB' }}>sentiment_dissatisfied</span>
            <p className="text-sm font-bold" style={{ color: '#6B7280' }}>Aucun résultat pour &ldquo;{query}&rdquo;</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Essayez un autre mot-clé</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Produits */}
            {produits.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: '#9CA3AF' }}>
                  Produits
                </p>
                <div className="flex flex-col gap-1">
                  {produits.map(p => (
                    <button
                      key={p.id}
                      onClick={() => go(`/produits/${p.slug || p.id}`)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left w-full"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {p.image && (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ color: '#0D0D0D' }}>{p.name}</p>
                        <p className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>
                          {parseFloat(p.promo_price || p.price).toLocaleString('fr-FR')} CFA
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-[16px] shrink-0" style={{ color: '#E5E7EB' }}>arrow_forward_ios</span>
                    </button>
                  ))}
                  <button
                    onClick={() => go(`/produits?q=${encodeURIComponent(query)}`)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-colors hover:bg-green-50 mt-1"
                    style={{ color: '#1B6B3A' }}
                  >
                    Voir tous les produits pour &ldquo;{query}&rdquo;
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Boutiques */}
            {boutiques.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: '#9CA3AF' }}>
                  Boutiques
                </p>
                <div className="flex flex-col gap-1">
                  {boutiques.map(b => (
                    <button
                      key={b.id}
                      onClick={() => go(`/boutique/${b.slug}`)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left w-full"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center shrink-0 font-black text-[#1B6B3A]">
                        {b.logo
                          ? <img src={b.logo} alt={b.name} className="w-full h-full object-cover" />
                          : b.name?.[0]
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ color: '#0D0D0D' }}>{b.name}</p>
                        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                          {b.location || 'Bénin'} · {b.products_count || 0} produits
                        </p>
                      </div>
                      {b.status === 'active' && (
                        <span className="material-symbols-outlined text-[16px] shrink-0" style={{ color: '#1B6B3A' }}>verified</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #F3F4F6' }}>
        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
          <span className="font-black">↵</span> pour rechercher · <span className="font-black">Esc</span> pour fermer
        </p>
        {query && (
          <button
            onClick={() => go(`/produits?q=${encodeURIComponent(query)}`)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
            style={{ background: '#1B6B3A', color: 'white' }}
          >
            Recherche complète
          </button>
        )}
      </div>
    </div>
  )
}
