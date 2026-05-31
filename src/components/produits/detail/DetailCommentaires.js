'use client'
import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { submitReview } from '@/lib/api'

// ─── Données de démonstration ──────────────────────────────────────────────
const DEMO_COMMENTS = [
  {
    id: 1,
    user: { name: 'Aurélie S.', initials: 'AS', location: 'Cotonou, Bénin', avatar: null },
    note: 5,
    date: '2026-03-15T10:30:00Z',
    texte: 'Une pièce absolument magnifique ! Le travail est d\'une finesse incroyable. La livraison s\'est faite en moins de 24h. Je recommande vraiment cet artisan, chaque détail est parfait.',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=300&v=2',
      'https://images.unsplash.com/photo-1559564484-ac4a9db6b7c0?auto=format&fit=crop&q=80&w=300&v=2',
    ],
    likes: 24,
    dislikes: 1,
    replies: [
      {
        id: 11,
        user: { name: 'Vendeur Kanvô', initials: 'VK', location: 'Abomey', avatar: null, isVendeur: true },
        date: '2026-03-15T14:00:00Z',
        texte: 'Merci infiniment Aurélie ! Votre satisfaction est notre priorité. N\'hésitez pas à revenir 🙏',
        likes: 8, dislikes: 0, images: [],
      },
    ],
  },
  {
    id: 2,
    user: { name: 'Berlin K.', initials: 'BK', location: 'Paris, France', avatar: null },
    note: 5,
    date: '2026-02-28T09:15:00Z',
    texte: 'Bois noble et de grande qualité, emballage très soigné. Expédition rapide depuis Abomey jusqu\'à Paris en seulement 5 jours ! Je suis bluffé par la qualité.',
    images: [],
    likes: 17,
    dislikes: 0,
    replies: [],
  },
  {
    id: 3,
    user: { name: 'Marie G.', initials: 'MG', location: 'Abomey, Bénin', avatar: null },
    note: 4,
    date: '2026-01-10T16:45:00Z',
    texte: 'Très beau produit, authentique et bien réalisé. Petite réserve sur le délai de livraison qui a pris 3 jours au lieu des 24h annoncés, mais la qualité est au rendez-vous.',
    images: [],
    likes: 9,
    dislikes: 2,
    replies: [],
  },
]

// ─── Composant étoiles cliquables ─────────────────────────────────────────
function StarRating({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(0)
  const labels = ['', 'Très déçu', 'Déçu', 'Moyen', 'Bien', 'Excellent !']
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-all duration-150 hover:scale-125 focus:outline-none"
          style={{ transform: (hovered || value) >= i ? 'scale(1.1)' : 'scale(1)' }}
        >
          <svg width={size} height={size}
            fill={(hovered || value) >= i ? '#F59E0B' : 'none'}
            stroke={(hovered || value) >= i ? '#F59E0B' : '#D1D5DB'}
            strokeWidth="1.5" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="text-sm font-bold ml-1 transition-all"
          style={{ color: '#F59E0B' }}>
          {labels[hovered || value]}
        </span>
      )}
    </div>
  )
}

// ─── Affichage étoiles (lecture seule) ────────────────────────────────────
function Stars({ value, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size}
          fill={i <= value ? '#F59E0B' : 'none'}
          stroke={i <= value ? '#F59E0B' : '#E5E7EB'}
          strokeWidth="1.5" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

// ─── Composant d'upload d'image ────────────────────────────────────────────
function ImageUploadZone({ images, onAdd, onRemove, max = 4 }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback((files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    const remaining = max - images.length
    valid.slice(0, remaining).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => onAdd(e.target.result)
      reader.readAsDataURL(file)
    })
  }, [images.length, max, onAdd])

  return (
    <div className="mt-3">
      {/* Prévisualisations */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((src, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden"
              style={{ border: '2px solid #E5E7EB' }}>
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-white text-[20px]">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zone de dépôt */}
      {images.length < max && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all select-none"
          style={{
            border: `1.5px dashed ${dragging ? '#1B6B3A' : '#D1D5DB'}`,
            background: dragging ? '#F0FDF4' : '#FAFAFA',
          }}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ color: dragging ? '#1B6B3A' : '#9CA3AF' }}>
            add_photo_alternate
          </span>
          <div>
            <p className="text-[12px] font-bold" style={{ color: dragging ? '#1B6B3A' : '#6B7280' }}>
              {dragging ? 'Déposez ici' : 'Ajouter des photos'}
            </p>
            <p className="text-[10px]" style={{ color: '#9CA3AF' }}>
              Glisser-déposer ou cliquer · {images.length}/{max} image{max > 1 ? 's' : ''}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  )
}

// ─── Carte commentaire individuelle ────────────────────────────────────────
function CommentCard({ comment, depth = 0, produitId, onReplyAdd }) {
  const { data: session } = useSession()
  const [likes, setLikes] = useState(comment.likes)
  const [dislikes, setDislikes] = useState(comment.dislikes)
  const [vote, setVote] = useState(null) // 'up' | 'down' | null
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyImages, setReplyImages] = useState([])
  const [showReplies, setShowReplies] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [sending, setSending] = useState(false)

  const handleVote = (type) => {
    if (vote === type) {
      setVote(null)
      type === 'up' ? setLikes(l => l - 1) : setDislikes(d => d - 1)
    } else {
      if (vote === 'up') setLikes(l => l - 1)
      if (vote === 'down') setDislikes(d => d - 1)
      setVote(type)
      type === 'up' ? setLikes(l => l + 1) : setDislikes(d => d + 1)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    setSending(true)
    const newReply = {
      id: Date.now(),
      user: {
        name: session?.user?.name || 'Anonyme',
        initials: session?.user?.name?.slice(0, 2).toUpperCase() || 'AN',
        location: 'Bénin',
        avatar: session?.user?.image || null,
      },
      date: new Date().toISOString(),
      texte: replyText.trim(),
      images: replyImages,
      likes: 0, dislikes: 0,
    }

    await new Promise(r => setTimeout(r, 400)) // simulation réseau
    onReplyAdd?.(comment.id, newReply)
    setReplyText('')
    setReplyImages([])
    setShowReplyBox(false)
    setSending(false)
  }

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 60) return 'à l\'instant'
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`
    if (diff < 2592000) return `il y a ${Math.floor(diff / 86400)} j`
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className={`flex gap-3 ${depth > 0 ? 'pl-4 border-l-2' : ''}`}
      style={{ borderColor: depth > 0 ? '#E5E7EB' : 'transparent' }}>

      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {comment.user.avatar ? (
          <img src={comment.user.avatar} alt={comment.user.name}
            className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-[13px] text-white shrink-0"
            style={{ background: comment.user.isVendeur ? '#D4920A' : '#1B6B3A' }}>
            {comment.user.initials}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <span className="font-bold text-[14px]" style={{ color: '#111827' }}>{comment.user.name}</span>
          {comment.user.isVendeur && (
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: '#FEF3C7', color: '#D97706' }}>Vendeur</span>
          )}
          {comment.note && <Stars value={comment.note} size={12} />}
          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{timeAgo(comment.date)}</span>
          {comment.user.location && (
            <span className="text-[10px] flex items-center gap-0.5" style={{ color: '#D1D5DB' }}>
              <span className="material-symbols-outlined text-[11px]">location_on</span>
              {comment.user.location}
            </span>
          )}
        </div>

        {/* Texte */}
        <p className="text-[13px] leading-relaxed mb-2" style={{ color: '#374151' }}>
          {comment.texte}
        </p>

        {/* Images */}
        {comment.images?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {comment.images.map((src, i) => (
              <button key={i} onClick={() => setLightbox(src)}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden group transition-transform hover:scale-105"
                style={{ border: '2px solid #E5E7EB' }}>
                <img src={src} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Like */}
          <button onClick={() => handleVote('up')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all hover:scale-105"
            style={{
              background: vote === 'up' ? '#DCFCE7' : '#F9FAFB',
              color: vote === 'up' ? '#16A34A' : '#6B7280',
              border: '1px solid',
              borderColor: vote === 'up' ? '#BBF7D0' : '#F3F4F6',
            }}>
            <span className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: vote === 'up' ? "'FILL' 1" : "'FILL' 0" }}>
              thumb_up
            </span>
            {likes > 0 && <span>{likes}</span>}
          </button>

          {/* Dislike */}
          <button onClick={() => handleVote('down')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all hover:scale-105"
            style={{
              background: vote === 'down' ? '#FEF2F2' : '#F9FAFB',
              color: vote === 'down' ? '#DC2626' : '#6B7280',
              border: '1px solid',
              borderColor: vote === 'down' ? '#FECACA' : '#F3F4F6',
            }}>
            <span className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: vote === 'down' ? "'FILL' 1" : "'FILL' 0" }}>
              thumb_down
            </span>
            {dislikes > 0 && <span>{dislikes}</span>}
          </button>

          {/* Répondre */}
          {depth < 2 && (
            <button onClick={() => setShowReplyBox(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all hover:bg-gray-100"
              style={{ color: '#6B7280' }}>
              <span className="material-symbols-outlined text-[15px]">reply</span>
              Répondre
            </button>
          )}

          {/* Réponses repliables */}
          {comment.replies?.length > 0 && (
            <button onClick={() => setShowReplies(v => !v)}
              className="flex items-center gap-1 text-[11px] font-bold transition-all hover:opacity-80"
              style={{ color: '#1B6B3A' }}>
              <span className="material-symbols-outlined text-[14px]">
                {showReplies ? 'expand_less' : 'expand_more'}
              </span>
              {showReplies ? 'Masquer' : `${comment.replies.length} réponse${comment.replies.length > 1 ? 's' : ''}`}
            </button>
          )}
        </div>

        {/* Formulaire de réponse */}
        {showReplyBox && (
          <div className="mt-3 p-3 rounded-2xl" style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            {!session?.user ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px]" style={{ color: '#6B7280' }}>Connectez-vous pour répondre</p>
                <Link href="/connexion" className="text-[11px] font-black px-4 py-1.5 rounded-full text-white"
                  style={{ background: '#1B6B3A' }}>Se connecter</Link>
              </div>
            ) : (
              <>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Répondre à ${comment.user.name}...`}
                  rows={2}
                  className="w-full text-[13px] font-medium resize-none outline-none bg-transparent"
                  style={{ color: '#111827' }}
                  autoFocus
                />
                <ImageUploadZone
                  images={replyImages}
                  onAdd={src => setReplyImages(p => [...p, src])}
                  onRemove={i => setReplyImages(p => p.filter((_, j) => j !== i))}
                  max={2}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setShowReplyBox(false)}
                    className="px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-gray-200 transition-colors"
                    style={{ color: '#6B7280' }}>Annuler</button>
                  <button onClick={handleReply} disabled={!replyText.trim() || sending}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#1B6B3A' }}>
                    {sending && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Répondre
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Réponses enfants */}
        {showReplies && comment.replies?.length > 0 && (
          <div className="mt-4 flex flex-col gap-4">
            {comment.replies.map(reply => (
              <CommentCard key={reply.id} comment={reply} depth={depth + 1} produitId={produitId} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            onClick={() => setLightbox(null)}>
            <span className="material-symbols-outlined text-white text-[22px]">close</span>
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-2xl object-contain"
            onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

// ─── Composant principal ───────────────────────────────────────────────────
export default function DetailCommentaires({ produitId, avgRating = 4.8, totalReviews = 142 }) {
  const { data: session } = useSession()
  const [commentaires, setCommentaires] = useState(DEMO_COMMENTS)
  const [note, setNote] = useState(5)
  const [texte, setTexte] = useState('')
  const [images, setImages] = useState([])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [tri, setTri] = useState('pertinence') // pertinence | recent | note_haute | note_basse
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef(null)

  const sorted = [...commentaires].sort((a, b) => {
    if (tri === 'recent')     return new Date(b.date) - new Date(a.date)
    if (tri === 'note_haute') return b.note - a.note
    if (tri === 'note_basse') return a.note - b.note
    return (b.likes - b.dislikes) - (a.likes - a.dislikes) // pertinence
  })

  const handleAddReply = (parentId, reply) => {
    setCommentaires(prev => prev.map(c =>
      c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c
    ))
  }

  const handleSubmit = async () => {
    if (!texte.trim()) return
    setSending(true)
    try {
      const token = session?.user?.apiToken || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)
      await submitReview({ product_id: produitId, rating: note, comment: texte.trim() }, token)
    } catch { /* UI optimiste */ }

    setCommentaires(prev => [{
      id: Date.now(),
      user: {
        name: session?.user?.name || 'Anonyme',
        initials: (session?.user?.name || 'AN').slice(0, 2).toUpperCase(),
        location: 'Bénin',
        avatar: session?.user?.image || null,
      },
      note,
      date: new Date().toISOString(),
      texte: texte.trim(),
      images,
      likes: 0, dislikes: 0,
      replies: [],
    }, ...prev])

    setTexte(''); setImages([]); setNote(5)
    setSent(true); setSending(false); setShowForm(false)
    setTimeout(() => setSent(false), 5000)
  }

  // Stats pour le résumé
  const distribution = [5, 4, 3, 2, 1].map(n => ({
    n, pct: n === 5 ? 68 : n === 4 ? 20 : n === 3 ? 7 : n === 2 ? 3 : 2
  }))

  return (
    <section className="mt-10 mb-6">
      {/* ── En-tête ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full" style={{ background: '#1B6B3A' }} />
          <h2 className="text-[22px] font-extrabold" style={{ color: '#111827' }}>Avis clients</h2>
          <span className="px-3 py-1 rounded-full text-[11px] font-black"
            style={{ background: '#1B6B3A', color: 'white' }}>
            {commentaires.length} avis
          </span>
        </div>

        {/* Tri */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
          <span className="material-symbols-outlined text-[15px]" style={{ color: '#9CA3AF' }}>sort</span>
          <select value={tri} onChange={e => setTri(e.target.value)}
            className="text-[12px] font-bold bg-transparent outline-none cursor-pointer" style={{ color: '#374151' }}>
            <option value="pertinence">Les plus utiles</option>
            <option value="recent">Les plus récents</option>
            <option value="note_haute">Meilleure note</option>
            <option value="note_basse">Note la plus basse</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Colonne gauche : résumé + formulaire ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-4">

            {/* Résumé note */}
            <div className="rounded-[24px] p-6" style={{ background: 'white', border: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-center mb-5">
                <p className="text-[68px] font-extrabold leading-none" style={{ color: '#111827' }}>
                  {avgRating.toFixed(1)}
                </p>
                <Stars value={Math.round(avgRating)} size={20} />
                <p className="text-[12px] mt-1.5 font-semibold" style={{ color: '#9CA3AF' }}>
                  {totalReviews} avis vérifiés
                </p>
              </div>

              {/* Barres de distribution */}
              <div className="flex flex-col gap-2">
                {distribution.map(({ n, pct }) => (
                  <div key={n} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold w-3 text-right shrink-0" style={{ color: '#6B7280' }}>{n}</span>
                    <svg width="11" height="11" fill="#F59E0B" viewBox="0 0 24 24" className="shrink-0">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: pct > 50 ? '#10B981' : pct > 20 ? '#F59E0B' : '#EF4444' }} />
                    </div>
                    <span className="text-[10px] font-bold w-8 text-right shrink-0" style={{ color: '#9CA3AF' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification de confirmation */}
            {sent && (
              <div className="rounded-2xl p-4 flex items-center gap-3 animate-bounce-once"
                style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <span className="material-symbols-outlined text-[28px]" style={{ color: '#16A34A' }}>check_circle</span>
                <div>
                  <p className="font-bold text-[13px]" style={{ color: '#111827' }}>Avis publié !</p>
                  <p className="text-[11px]" style={{ color: '#6B7280' }}>Merci pour votre retour.</p>
                </div>
              </div>
            )}

            {/* Bouton ouvrir formulaire */}
            {!showForm && (
              <button onClick={() => {
                if (!session?.user) { window.location.href = '/connexion'; return }
                setShowForm(true)
                setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
              }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}>
                <span className="material-symbols-outlined text-[18px]">rate_review</span>
                Écrire un avis
              </button>
            )}
          </div>
        </div>

        {/* ── Colonne droite : formulaire + liste ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Formulaire (style YouTube) */}
          {showForm && (
            <div ref={formRef} className="rounded-[24px] p-6"
              style={{ background: 'white', border: '2px solid #1B6B3A', boxShadow: '0 4px 20px rgba(27,107,58,0.12)' }}>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[13px]"
                  style={{ background: '#1B6B3A' }}>
                  {session?.user?.name?.slice(0, 2).toUpperCase() || 'AN'}
                </div>
                <div>
                  <p className="font-bold text-[14px]" style={{ color: '#111827' }}>
                    {session?.user?.name || 'Anonyme'}
                  </p>
                  <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Publier un avis public</p>
                </div>
                <button onClick={() => setShowForm(false)} className="ml-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>close</span>
                </button>
              </div>

              {/* Note */}
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Votre note</p>
                <StarRating value={note} onChange={setNote} size={32} />
              </div>

              {/* Texte */}
              <div className="relative mb-1">
                <textarea
                  value={texte}
                  onChange={e => setTexte(e.target.value)}
                  placeholder="Partagez votre expérience en détail... Qualité, livraison, rapport qualité-prix ?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-all resize-none"
                  style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', color: '#111827' }}
                  onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <span className="absolute bottom-3 right-3 text-[10px]" style={{ color: '#D1D5DB' }}>
                  {texte.length}/500
                </span>
              </div>

              {/* Upload images */}
              <ImageUploadZone
                images={images}
                onAdd={src => setImages(p => [...p, src])}
                onRemove={i => setImages(p => p.filter((_, j) => j !== i))}
                max={4}
              />

              {/* Actions */}
              <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
                  Les avis sont publics et visibles par tous
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl text-[12px] font-bold hover:bg-gray-100 transition-colors"
                    style={{ color: '#6B7280' }}>
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!texte.trim() || sending}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[12px] font-black text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}>
                    {sending && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    <span className="material-symbols-outlined text-[15px]">{sending ? '' : 'send'}</span>
                    {sending ? 'Publication...' : 'Publier'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Séparateur titre */}
          {!showForm && (
            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1" style={{ background: '#E5E7EB' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                {commentaires.length} commentaire{commentaires.length > 1 ? 's' : ''}
              </span>
              <div className="h-[1px] flex-1" style={{ background: '#E5E7EB' }} />
            </div>
          )}

          {/* Liste des commentaires */}
          <div className="flex flex-col gap-6">
            {sorted.map(c => (
              <div key={c.id} className="rounded-[20px] p-5 transition-all hover:shadow-md"
                style={{ background: 'white', border: '1px solid #F3F4F6' }}>
                <CommentCard
                  comment={c}
                  depth={0}
                  produitId={produitId}
                  onReplyAdd={handleAddReply}
                />
              </div>
            ))}

            {/* Charger plus */}
            <button className="flex items-center justify-center gap-2 py-3 rounded-2xl text-[12px] font-bold transition-all hover:bg-gray-50"
              style={{ border: '1.5px dashed #E5E7EB', color: '#9CA3AF' }}>
              <span className="material-symbols-outlined text-[16px]">add</span>
              Charger plus d'avis
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
