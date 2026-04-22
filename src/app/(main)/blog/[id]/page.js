'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getArticle, getArticles } from '@/lib/api'

// Article de démo si l'API n'a pas encore de données
const DEMO_ARTICLE = {
  id: 1,
  titre: "L'Éveil des Géants : Le Retour des Trésors d'Abomey",
  categorie: 'Patrimoine',
  auteur: 'BéninMarket',
  created_at: new Date().toISOString(),
  image: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?auto=format&fit=crop&q=80&w=1200',
  description: `Les bas-reliefs royaux d'Abomey, symboles d'une identité béninoise retrouvée, font leur grand retour. Une immersion exclusive dans les coulisses de leur restauration.`,
  content: `
  <p>Le Bénin retrouve peu à peu ses trésors artistiques. Les bas-reliefs du Palais d'Abomey, témoins muets de l'histoire des rois Fon, font l'objet d'une restauration exceptionnelle menée par des artisans locaux formés aux techniques ancestrales.</p>
  
  <h2>Un patrimoine millénaire</h2>
  <p>Sculptés dans l'argile et ornés de symboles royaux, ces bas-reliefs racontent l'épopée des souverains du Royaume d'Abomey. Chaque panneau est un livre d'histoire à ciel ouvert, narrant batailles, conquêtes et rituels sacrés.</p>
  
  <p>La restauration, financée en partie par l'UNESCO et des partenaires privés, mobilise une trentaine d'artisans béninois spécialisés. Parmi eux, des sculpteurs, des peintres traditionnels et des historiens de l'art travaillent main dans la main pour préserver ce patrimoine exceptionnel.</p>
  
  <h2>Le rôle de BéninMarket</h2>
  <p>Plusieurs artisans participant à ce grand chantier de restauration sont désormais présents sur notre plateforme. Leurs créations contemporaines, inspirées des motifs royaux, sont disponibles à la vente et permettent de soutenir directement leur travail de mémoire.</p>
  
  <p>Visitez nos boutiques dédiées à l'artisanat d'Abomey et ramenez un morceau de cette histoire vivante chez vous.</p>
  `,
  temps_lecture: 8,
  vues: 12400,
}

export default function ArticlePage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [shareMsg, setShareMsg] = useState(false)

  useEffect(() => {
    Promise.all([
      getArticle(id).catch(() => null),
      getArticles().catch(() => ({ data: [] }))
    ]).then(([art, list]) => {
      const articleData = art
        ? {
            id: art.id,
            titre: art.titre,
            categorie: art.categorie || 'Actualité',
            auteur: art.auteur || 'BéninMarket',
            created_at: art.created_at,
            image: art.image || DEMO_ARTICLE.image,
            description: art.description || '',
            content: art.content || art.description || '',
            temps_lecture: art.temps_lecture || 5,
            vues: art.vues || 0,
          }
        : DEMO_ARTICLE

      setArticle(articleData)

      const listData = list?.data || list || []
      setArticles(
        listData
          .filter(a => String(a.id) !== String(id))
          .slice(0, 3)
          .map(a => ({
            id: a.id,
            titre: a.titre,
            categorie: a.categorie || 'Actualité',
            image: a.image || DEMO_ARTICLE.image,
            auteur: a.auteur || 'BéninMarket',
          }))
      )
      setLoading(false)
    })
  }, [id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.titre, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShareMsg(true)
      setTimeout(() => setShareMsg(false), 2000)
    }
  }

  const submitComment = () => {
    if (!commentText.trim()) return
    setComments(prev => [
      ...prev,
      { text: commentText.trim(), auteur: 'Vous', temps: "À l'instant" }
    ])
    setCommentText('')
  }

  if (loading) {
    return (
      <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-full w-1/3 mb-6" />
          <div className="h-12 bg-gray-200 rounded-xl w-full mb-4" />
          <div className="h-6 bg-gray-200 rounded-xl w-2/3 mb-10" />
          <div className="aspect-video bg-gray-200 rounded-[28px] mb-8" />
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${70 + i * 5}%` }} />)}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div style={{ background: '#F7F5F0', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[64px] mb-4 block" style={{ color: '#D1D5DB' }}>article</span>
          <h1 className="text-2xl font-black mb-2" style={{ color: '#0D0D0D' }}>Article introuvable</h1>
          <Link href="/blog" className="text-[#1B6B3A] font-bold hover:underline">← Retour au blog</Link>
        </div>
      </div>
    )
  }

  const dateFormatted = new Date(article.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {shareMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white text-[13px] font-black shadow-lg"
          style={{ background: '#1B6B3A' }}>
          ✓ Lien copié dans le presse-papier
        </div>
      )}

      {/* Hero Image */}
      <div className="relative w-full overflow-hidden" style={{ height: '55vh', minHeight: '360px' }}>
        <Image
          src={article.image}
          alt={article.titre}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />

        {/* Breadcrumb overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-2 text-[11px] font-bold text-white/80">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-white line-clamp-1 max-w-[200px]">{article.titre}</span>
        </div>

        {/* Titre overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-20 pb-10">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-3"
              style={{ background: '#1B6B3A' }}>
              {article.categorie}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">
              {article.titre}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                  style={{ background: '#D4920A' }}>
                  {(article.auteur || 'B')[0].toUpperCase()}
                </div>
                <span className="text-[13px] font-bold text-white/90">{article.auteur}</span>
              </div>
              <span className="text-white/50 text-[12px]">·</span>
              <span className="text-[12px] font-bold text-white/70">{dateFormatted}</span>
              {article.temps_lecture > 0 && (
                <>
                  <span className="text-white/50 text-[12px]">·</span>
                  <div className="flex items-center gap-1 text-white/70 text-[12px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {article.temps_lecture} min de lecture
                  </div>
                </>
              )}
              {article.vues > 0 && (
                <>
                  <span className="text-white/50 text-[12px]">·</span>
                  <div className="flex items-center gap-1 text-white/70 text-[12px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    {article.vues.toLocaleString('fr-FR')}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">

          {/* Article body */}
          <article>
            {/* Intro / description */}
            {article.description && (
              <p className="text-[18px] font-medium leading-relaxed mb-8 pb-8"
                style={{ color: '#374151', borderBottom: '1px solid #EBEBEB', fontStyle: 'italic' }}>
                {article.description}
              </p>
            )}

            {/* Contenu HTML ou texte */}
            {article.content ? (
              <div
                className="prose prose-lg max-w-none"
                style={{
                  color: '#374151',
                  lineHeight: '1.9',
                  fontSize: '16px',
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="text-[16px] leading-relaxed" style={{ color: '#6B7280' }}>
                Cet article ne contient pas encore de contenu détaillé.
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid #EBEBEB' }}>
              {[article.categorie, 'Bénin', 'Artisanat'].filter(Boolean).map(tag => (
                <span key={tag} className="px-4 py-2 rounded-full text-[11px] font-black"
                  style={{ background: '#E6F8EA', color: '#1B6B3A' }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8 pt-6 flex-wrap" style={{ borderTop: '1px solid #EBEBEB' }}>
              <button onClick={() => setLiked(!liked)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-black transition-all hover:scale-105"
                style={{
                  background: liked ? '#FEE2E2' : '#F3F4F6',
                  color: liked ? '#EF4444' : '#6B7280',
                }}>
                <span className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
                {liked ? "J'adore cet article" : "J'aime"}
              </button>

              <button onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-black transition-all hover:scale-105"
                style={{ background: '#F3F4F6', color: '#6B7280' }}>
                <span className="material-symbols-outlined text-[18px]">share</span>
                Partager
              </button>

              <Link href="/blog"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-black transition-all hover:scale-105 ml-auto"
                style={{ background: '#E6F8EA', color: '#1B6B3A' }}>
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Retour au blog
              </Link>
            </div>

            {/* Commentaires */}
            <div className="mt-14">
              <h3 className="text-[20px] font-black mb-8" style={{ color: '#0D0D0D' }}>
                Commentaires ({comments.length})
              </h3>

              {/* Existing */}
              {comments.length > 0 && (
                <div className="flex flex-col gap-4 mb-8">
                  {comments.map((c, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-black text-white shrink-0"
                        style={{ background: '#D4920A' }}>V</div>
                      <div className="flex-1 bg-white rounded-[20px] px-5 py-4" style={{ border: '1px solid #EBEBEB' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>{c.auteur}</span>
                          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{c.temps}</span>
                        </div>
                        <p className="text-[14px] leading-relaxed" style={{ color: '#6B7280' }}>{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="bg-white rounded-[24px] p-6" style={{ border: '1px solid #EBEBEB' }}>
                <p className="text-[12px] font-black uppercase tracking-widest mb-4" style={{ color: '#9CA3AF' }}>
                  Laisser un commentaire
                </p>
                <textarea
                  rows={3}
                  placeholder="Partagez votre avis sur cet article..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl text-[14px] font-medium outline-none resize-none mb-3 transition-all"
                  style={{ background: '#F7F5F0', border: '2px solid transparent', color: '#0D0D0D' }}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = 'transparent'}
                />
                <div className="flex justify-end">
                  <button onClick={submitComment}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[12px] uppercase tracking-wider text-white transition-all hover:opacity-90"
                    style={{ background: '#1B6B3A' }}>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar sticky */}
          <aside className="hidden lg:flex flex-col gap-6 w-72 sticky top-24">
            {/* Auteur card */}
            <div className="bg-white rounded-[24px] p-6 text-center" style={{ border: '1px solid #EBEBEB' }}>
              <div className="w-16 h-16 rounded-[20px] mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white"
                style={{ background: '#1B6B3A' }}>
                {(article.auteur || 'B')[0]}
              </div>
              <h4 className="font-black text-[14px]" style={{ color: '#0D0D0D' }}>{article.auteur}</h4>
              <p className="text-[11px] font-medium mt-1" style={{ color: '#9CA3AF' }}>Auteur BéninMarket</p>
            </div>

            {/* Articles suivants */}
            {articles.length > 0 && (
              <div className="bg-white rounded-[24px] p-5" style={{ border: '1px solid #EBEBEB' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#9CA3AF' }}>
                  Autres articles
                </p>
                <div className="flex flex-col gap-4">
                  {articles.map(a => (
                    <Link key={a.id} href={`/blog/${a.id}`}
                      className="group flex gap-3 items-start">
                      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden">
                        <Image src={a.image} alt={a.titre} fill className="object-cover transition-transform group-hover:scale-110" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-wide" style={{ color: '#1B6B3A' }}>{a.categorie}</span>
                        <p className="text-[12px] font-black leading-snug group-hover:text-[#1B6B3A] transition-colors line-clamp-2" style={{ color: '#0D0D0D' }}>
                          {a.titre}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/blog"
                  className="flex items-center justify-center gap-1 mt-5 text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#1B6B3A]"
                  style={{ color: '#9CA3AF' }}>
                  Tous les articles
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Articles similaires (mobile bas de page) */}
      {articles.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 md:px-10 pb-20 lg:hidden">
          <h3 className="text-[18px] font-black mb-6" style={{ color: '#0D0D0D' }}>Autres articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {articles.map(a => (
              <Link key={a.id} href={`/blog/${a.id}`}
                className="group bg-white rounded-[20px] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="relative h-32 overflow-hidden">
                  <Image src={a.image} alt={a.titre} fill className="object-cover transition-transform group-hover:scale-105" sizes="300px" />
                </div>
                <div className="p-4">
                  <span className="text-[9px] font-black uppercase" style={{ color: '#1B6B3A' }}>{a.categorie}</span>
                  <p className="text-[13px] font-black leading-snug mt-1 line-clamp-2" style={{ color: '#0D0D0D' }}>{a.titre}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
