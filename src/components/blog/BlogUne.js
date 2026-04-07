'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getArticles } from '@/lib/api'

export default function BlogUne() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArticles()
      .then(data => {
        // L'API retourne maintenant un objet paginé { data: [...] }
        const list = data.data || data
        const publishedArticles = list.map(a => ({
          id: a.id,
          titre: a.titre,
          categorie: a.categorie || 'Actualité',
          description: a.description || 'Retrouvez toute l\'actualité de nos artisans.',
          auteur: a.auteur || 'BéninMarket',
          temps: new Date(a.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
          image: a.image || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80',
          featured: Boolean(a.featured)
        }))
        setArticles(publishedArticles)
        setLoading(false)
      })
      .catch(() => {
        setArticles([])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="flex-1 py-10 text-gray-500">Chargement des articles...</div>
  if (articles.length === 0) return <div className="flex-1 py-10 text-gray-500 flex items-center gap-2"><span className="material-symbols-outlined">newspaper</span>Aucun article d'actualité pour le moment.</div>

  const featured = articles.find(a => a.featured) || articles[0]
  const autres = articles.filter(a => a.id !== featured.id).slice(0, 4)

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#1B6B3A] rounded-full shadow-sm"></div>
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            À la Une
          </h2>
        </div>
        <Link
          href="/blog/articles"
          className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-[#1B6B3A] hover:text-[#134e29] transition-colors bg-[#E6F8EA] px-4 py-2 rounded-full"
        >
          Tous les articles <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {/* Article Principal (Featured) */}
      {featured && (
      <Link href={`/blog/${featured.id}`} className="group flex flex-col md:flex-row gap-8 mb-10 bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="relative w-full md:w-[45%] h-[250px] md:h-auto rounded-[16px] overflow-hidden shrink-0">
          <img
            src={featured.image}
            alt={featured.titre}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-[#1B6B3A] text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
            {featured.categorie}
          </div>
        </div>
        <div className="flex flex-col justify-center py-2 pr-4">
          <h3 className="text-2xl font-extrabold leading-[1.2] text-[#111827] group-hover:text-[#1B6B3A] transition-colors mb-4">
            {featured.titre}
          </h3>
          <p className="text-[14px] text-gray-500 leading-relaxed font-medium mb-6 line-clamp-3">
            {featured.description}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-[#1B6B3A] flex items-center justify-center font-bold text-xs uppercase">
                {featured.auteur[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#111827]">{featured.auteur}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{featured.temps}</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#E6F8EA] group-hover:bg-[#1B6B3A] text-[#1B6B3A] group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>
      )}

      {/* Grid d'articles secondaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {autres.map((article) => (
          <Link key={article.id} href={`/blog/${article.id}`} className="group flex flex-col bg-white rounded-[20px] p-3 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="relative w-full h-[180px] rounded-[14px] overflow-hidden mb-4">
              <img
                src={article.image}
                alt={article.titre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#1B6B3A] text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                {article.categorie}
              </div>
            </div>
            <div className="px-2 pb-2">
              <h4 className="text-[16px] font-extrabold leading-tight text-[#111827] group-hover:text-[#1B6B3A] transition-colors mb-2 line-clamp-2">
                {article.titre}
              </h4>
              <p className="text-[12px] text-gray-500 leading-relaxed font-medium mb-4 line-clamp-2">
                {article.description}
              </p>
              <div className="flex items-center gap-2 mt-auto text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>{article.auteur}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{article.temps}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}