'use client'
import { useState, useEffect } from 'react'
import { getForumTopics, isAuthenticated } from '@/lib/api'

const tagColors = {
  technique: { bg: '#EFF6FF', color: '#3B82F6' },
  patrimoine: { bg: '#F0FDF4', color: '#1B6B3A' },
  création: { bg: '#FEF3C7', color: '#D4920A' },
}

export default function BlogForum() {
  const [sujets, setSujets] = useState([])
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      })
      .catch(() => {
        setSujets([])
        setLoading(false)
      })
  }, [])

  const handleVote = async (topicId, index, direction) => {
    if (!isAuthenticated()) {
      // Vote local si non connecté
      setVotes((prev) => prev.map((v, i) => (i === index ? v + direction : v)))
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-topics/${topicId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ direction: direction === 1 ? 'up' : 'down' }),
      })
      const data = await res.json()
      if (res.ok) {
        setVotes((prev) => prev.map((v, i) => (i === index ? data.votes : v)))
      }
    } catch {
      // fallback local
      setVotes((prev) => prev.map((v, i) => (i === index ? v + direction : v)))
    }
  }

  return (
    <section className="py-12 px-10" style={{ background: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#1A1A1A' }}>
              Forum de la Communauté
            </h2>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
              L'espace d'échange entre passionnés et artisans
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#1B6B3A' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nouveau Sujet
          </button>
        </div>

        {/* Liste sujets */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement du forum...</div>
          ) : sujets.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-2xl flex flex-col items-center">
              <span className="material-symbols-outlined mb-2 text-3xl">forum</span>
              Aucun sujet de discussion n'est ouvert pour le moment.
            </div>
          ) : (
            sujets.map((sujet, index) => (
              <div
                key={sujet.id}
                className="bg-white rounded-2xl p-6 flex gap-5"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
              >
                {/* Votes */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleVote(sujet.id, index, 1)}
                    className="text-gray-400 hover:text-green-700 transition-colors"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                  <span className="text-sm font-extrabold" style={{ color: '#1A1A1A' }}>
                    {votes[index]}
                  </span>
                  <button
                    onClick={() => handleVote(sujet.id, index, -1)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>

                {/* Contenu */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: tagColors[sujet.tag]?.bg || '#F0EDE8',
                        color: tagColors[sujet.tag]?.color || '#374151',
                      }}
                    >
                      {sujet.tag}
                    </span>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>
                      Posté par u/{sujet.auteur} • {sujet.temps}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm leading-tight mb-2" style={{ color: '#1A1A1A' }}>
                    {sujet.titre}
                  </h4>

                  {sujet.description && (
                    <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7280' }}>
                      {sujet.description}
                    </p>
                  )}

                  {sujet.image && (
                    <div className="rounded-xl overflow-hidden mb-3" style={{ height: '160px', maxWidth: '280px' }}>
                      <img
                        src={sujet.image}
                        alt="Création"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-green-800" style={{ color: '#9CA3AF' }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {sujet.commentaires} Commentaires
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-green-800" style={{ color: '#9CA3AF' }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                      Partager
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  )
}