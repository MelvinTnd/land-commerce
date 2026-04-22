'use client'
import { useState, useEffect } from 'react'
import { getForumTopics } from '@/lib/api'

const TAG_STYLE = {
  technique: { bg: '#EFF6FF', color: '#2563EB' },
  patrimoine: { bg: '#F0FDF4', color: '#1B6B3A' },
  création: { bg: '#FEF3C7', color: '#D4920A' },
  divers: { bg: '#F3F4F6', color: '#6B7280' },
}

export default function BlogForum() {
  const [sujets, setSujets] = useState([])
  const [votes, setVotes] = useState([])
  const [liked, setLiked] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedComments, setExpandedComments] = useState([])
  const [newComment, setNewComment] = useState({})
  const [comments, setComments] = useState({})
  const [shareMsg, setShareMsg] = useState(null)

  useEffect(() => {
    getForumTopics()
      .then(data => {
        const list = data.data || data
        const topics = list.map(t => ({
          id: t.id,
          tag: t.tag || 'divers',
          auteur: t.auteur || 'ArtisanInconnu',
          temps: new Date(t.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          votes: t.votes || 0,
          titre: t.titre,
          description: t.description || '',
          commentaires: t.commentaires || 0,
          image: t.image || null,
        }))
        setSujets(topics)
        setVotes(topics.map(t => t.votes))
        setLiked(topics.map(() => false))
        setComments(Object.fromEntries(topics.map(t => [t.id, []])))
        setLoading(false)
      })
      .catch(() => { setSujets([]); setLoading(false) })
  }, [])

  const handleVote = (index, dir) => {
    setVotes(prev => prev.map((v, i) => i === index ? v + dir : v))
  }

  const toggleLike = (index) => {
    setLiked(prev => prev.map((v, i) => i === index ? !v : v))
  }

  const toggleComments = (id) => {
    setExpandedComments(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const handleShare = (titre) => {
    if (navigator.share) {
      navigator.share({ title: titre, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShareMsg('Lien copié !')
      setTimeout(() => setShareMsg(null), 2000)
    }
  }

  const submitComment = (id) => {
    const text = newComment[id]?.trim()
    if (!text) return
    setComments(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), { text, auteur: 'Vous', temps: 'À l\'instant' }]
    }))
    setNewComment(prev => ({ ...prev, [id]: '' }))
  }

  return (
    <section className="py-16 px-6 md:px-12 lg:px-20" style={{ background: '#F7F5F0' }}>
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-4"
              style={{ background: 'rgba(27,107,58,0.08)', color: '#1B6B3A', border: '1px solid rgba(27,107,58,0.18)' }}>
              <span className="material-symbols-outlined text-[14px]">forum</span>
              Communauté
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0D0D0D] tracking-tight">Forum des Artisans</h2>
            <p className="text-[14px] mt-2" style={{ color: '#9CA3AF' }}>L&apos;espace d&apos;échange entre passionnés et créateurs</p>
          </div>
          <button
            className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#1B6B3A', boxShadow: '0 4px 14px rgba(27,107,58,0.25)' }}>
            <span className="material-symbols-outlined text-[16px]">add</span>
            Nouveau sujet
          </button>
        </div>

        {shareMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white text-[13px] font-black shadow-lg"
            style={{ background: '#1B6B3A' }}>
            ✓ {shareMsg}
          </div>
        )}

        {/* Sujets */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[24px] p-6 animate-pulse" style={{ border: '1px solid #EBEBEB' }}>
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : sujets.length === 0 ? (
          <div className="bg-white rounded-[24px] py-16 flex flex-col items-center text-center"
            style={{ border: '1px dashed #D1D5DB' }}>
            <span className="material-symbols-outlined text-[48px] mb-3" style={{ color: '#D1D5DB' }}>forum</span>
            <p className="font-black text-lg text-[#0D0D0D] mb-1">Aucun sujet pour l&apos;instant</p>
            <p className="text-[13px]" style={{ color: '#9CA3AF' }}>Soyez le premier à ouvrir une discussion !</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sujets.map((sujet, index) => {
              const tagStyle = TAG_STYLE[sujet.tag] || TAG_STYLE.divers
              const isLiked = liked[index]
              const commentsOpen = expandedComments.includes(sujet.id)
              const topicComments = comments[sujet.id] || []
              return (
                <div key={sujet.id} className="bg-white rounded-[24px] overflow-hidden transition-all hover:shadow-md"
                  style={{ border: '1px solid #EBEBEB' }}>
                  <div className="p-6 flex gap-5">

                    {/* Votes */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <button onClick={() => handleVote(index, 1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: '#F0FDF4', color: '#1B6B3A' }}>
                        <span className="material-symbols-outlined text-[18px]">arrow_drop_up</span>
                      </button>
                      <span className="font-black text-[14px]" style={{ color: '#0D0D0D' }}>{votes[index]}</span>
                      <button onClick={() => handleVote(index, -1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: '#FEF2F2', color: '#EF4444' }}>
                        <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
                      </button>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      {/* Meta */}
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                          style={{ background: tagStyle.bg, color: tagStyle.color }}>
                          {sujet.tag}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: '#9CA3AF' }}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                            style={{ background: '#1B6B3A' }}>
                            {sujet.auteur[0]?.toUpperCase()}
                          </span>
                          u/{sujet.auteur}
                          <span>·</span>
                          <span>{sujet.temps}</span>
                        </div>
                      </div>

                      <h4 className="font-black text-[16px] text-[#0D0D0D] leading-tight mb-2">{sujet.titre}</h4>

                      {sujet.description && (
                        <p className="text-[13px] leading-relaxed mb-3 line-clamp-2" style={{ color: '#6B7280' }}>
                          {sujet.description}
                        </p>
                      )}

                      {sujet.image && (
                        <div className="rounded-2xl overflow-hidden mb-4" style={{ height: '160px', maxWidth: '280px' }}>
                          <img src={sujet.image} alt="Illustration" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 flex-wrap pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                        {/* Like */}
                        <button onClick={() => toggleLike(index)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all hover:scale-105"
                          style={{
                            background: isLiked ? '#FEE2E2' : '#F3F4F6',
                            color: isLiked ? '#EF4444' : '#6B7280',
                          }}>
                          <span className="material-symbols-outlined text-[15px]"
                            style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
                            favorite
                          </span>
                          {isLiked ? 'Aimé' : 'J\'aime'}
                        </button>

                        {/* Commentaires */}
                        <button onClick={() => toggleComments(sujet.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all hover:scale-105"
                          style={{
                            background: commentsOpen ? '#E6F8EA' : '#F3F4F6',
                            color: commentsOpen ? '#1B6B3A' : '#6B7280',
                          }}>
                          <span className="material-symbols-outlined text-[15px]">chat_bubble</span>
                          {sujet.commentaires + topicComments.length} Commentaire{sujet.commentaires + topicComments.length > 1 ? 's' : ''}
                        </button>

                        {/* Partager */}
                        <button onClick={() => handleShare(sujet.titre)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all hover:scale-105"
                          style={{ background: '#F3F4F6', color: '#6B7280' }}>
                          <span className="material-symbols-outlined text-[15px]">share</span>
                          Partager
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section commentaires déroulante */}
                  {commentsOpen && (
                    <div className="px-6 pb-6 pt-0" style={{ borderTop: '1px solid #F3F4F6' }}>
                      {/* Commentaires existants */}
                      {topicComments.length > 0 && (
                        <div className="flex flex-col gap-3 mb-4 mt-4">
                          {topicComments.map((c, ci) => (
                            <div key={ci} className="flex gap-3 items-start">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5"
                                style={{ background: '#D4920A' }}>
                                V
                              </div>
                              <div className="flex-1 rounded-2xl px-4 py-2.5" style={{ background: '#F7F5F0' }}>
                                <p className="font-black text-[11px] mb-0.5" style={{ color: '#0D0D0D' }}>{c.auteur}</p>
                                <p className="text-[13px]" style={{ color: '#6B7280' }}>{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {topicComments.length === 0 && sujet.commentaires === 0 && (
                        <p className="text-[12px] py-3" style={{ color: '#9CA3AF' }}>Soyez le premier à commenter !</p>
                      )}
                      {/* Input */}
                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          placeholder="Écrire un commentaire..."
                          value={newComment[sujet.id] || ''}
                          onChange={e => setNewComment(prev => ({ ...prev, [sujet.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') submitComment(sujet.id) }}
                          className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium outline-none transition-all"
                          style={{ background: '#F7F5F0', border: '1.5px solid rgba(27,107,58,0.15)', color: '#0D0D0D' }}
                        />
                        <button onClick={() => submitComment(sujet.id)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 shrink-0"
                          style={{ background: '#1B6B3A' }}>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}