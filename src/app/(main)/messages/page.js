'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  getConversations, getConversation,
  replyToConversation, sendMessage, getShopBySlug,
} from '@/lib/api'
import SafeImage from '@/components/ui/SafeImage'

// ─── Inner component (needs useSearchParams inside Suspense) ─────────────────
function MessagesInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)   // conv id sélectionné
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [convMeta, setConvMeta] = useState(null)
  const [error, setError] = useState('')
  // Pour le mode "initier une nouvelle conversation"
  const [initShop, setInitShop] = useState(null)   // { id, name, slug, logo }
  const [initSending, setInitSending] = useState(false)
  const [initMessage, setInitMessage] = useState('')
  const messagesEndRef = useRef(null)

  const token = session?.user?.apiToken
  const userId = session?.user?.id
  const userRole = session?.user?.role

  // Sauvegarder token dans localStorage
  useEffect(() => {
    if (session?.user?.apiToken && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', session.user.apiToken)
    }
  }, [session?.user?.apiToken])

  // Redirection si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/connexion?redirect=/messages')
  }, [status, router])

  // ── Charger les conversations ───────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setLoading(false); return }
    setLoading(true)
    getConversations(token)
      .then(data => setConversations(data.conversations || []))
      .catch(err => setError(err.message || 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [token])

  // ── Lire les params URL et préparer le mode "contact boutique" ─────────────
  useEffect(() => {
    if (!token || loading) return

    const shopParam = searchParams.get('shop')    // slug de la boutique
    const vendeurParam = searchParams.get('vendeur') // user_id du vendeur

    if (!shopParam) return

    // Chercher si une conversation existe déjà avec ce vendeur
    const existingConv = conversations.find(c =>
      c.with?.id?.toString() === vendeurParam?.toString()
      || c.shop?.slug === shopParam
    )

    if (existingConv) {
      // Ouvrir la conversation existante directement
      openConversation(existingConv)
      // Nettoyer l'URL
      router.replace('/messages', { scroll: false })
      return
    }

    // Sinon : charger les infos de la boutique pour le panneau "nouveau message"
    getShopBySlug(shopParam)
      .then(shop => {
        setInitShop({
          id: shop.user_id,   // on envoie le message à l'user_id du vendeur (shop endpoint utilise shopId)
          shopId: shop.id,
          name: shop.name,
          slug: shop.slug,
          logo: shop.logo,
        })
      })
      .catch(() => {
        setError('Impossible de trouver la boutique.')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading, searchParams])

  // ── Scroll auto ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Ouvrir une conversation ────────────────────────────────────────────────
  const openConversation = async (conv) => {
    setInitShop(null)   // quitter le mode "nouveau message"
    setActiveConv(conv.id)
    setError('')
    try {
      const data = await getConversation(conv.id, token)
      setMessages(data.messages || [])
      setConvMeta(data.conversation || null)
      setConversations(prev => prev.map(c =>
        c.id === conv.id ? { ...c, unread: 0 } : c
      ))
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement')
    }
  }

  // ── Envoyer un message dans une conversation existante ────────────────────
  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv || sending) return
    setSending(true)
    setError('')
    try {
      const data = await replyToConversation(activeConv, newMessage.trim(), token)
      setMessages(prev => [...prev, data])
      setNewMessage('')
      setConversations(prev => prev.map(c =>
        c.id === activeConv
          ? { ...c, lastMessage: data, last_message_at: new Date().toISOString() }
          : c
      ))
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi")
    }
    setSending(false)
  }

  // ── Initier une NOUVELLE conversation depuis une boutique ─────────────────
  const handleInitSend = async (e) => {
    e.preventDefault()
    if (!initMessage.trim() || !initShop || initSending) return
    setInitSending(true)
    setError('')
    try {
      // POST /shops/{shopId}/message → crée ou récupère la conversation
      const data = await sendMessage(initShop.shopId, initMessage.trim(), token)
      // data : { conversation_id, message }
      const convId = data.conversation_id || data.conversation?.id

      // Recharger la liste des conversations
      const freshData = await getConversations(token)
      const freshList = freshData.conversations || []
      setConversations(freshList)

      // Ouvrir la conversation fraîchement créée
      const newConv = freshList.find(c => c.id === convId) || { id: convId }
      setInitShop(null)
      setInitMessage('')
      router.replace('/messages', { scroll: false })
      if (newConv) {
        await openConversation(newConv)
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi")
    }
    setInitSending(false)
  }

  // ── Helpers affichage ──────────────────────────────────────────────────────
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const diffMin = Math.floor((Date.now() - d) / 60000)
    if (diffMin < 1) return "À l'instant"
    if (diffMin < 60) return `Il y a ${diffMin} min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `Il y a ${diffH}h`
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  }

  const getContactName = (conv) => conv?.with?.name || conv?.shop?.name || 'Utilisateur'
  const getContactAvatar = (conv) => {
    const name = getContactName(conv)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1B6B3A&color=fff&size=100`
  }

  // ── Rendu ──────────────────────────────────────────────────────────────────
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center" style={{ background: '#F7F5F0' }}>
        <div className="w-12 h-12 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Déterminer le panneau central à afficher
  const showNewConversation = !!initShop && !activeConv
  const showConversation = !!activeConv

  return (
    <div className="min-h-screen pt-20 font-sans" style={{ background: '#F7F5F0' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#E6F8EA' }}>
              <span className="material-symbols-outlined text-[22px]" style={{ color: '#1B6B3A' }}>chat</span>
            </div>
            <div>
              <h1 className="text-xl font-black" style={{ color: '#0D0D0D' }}>Messages</h1>
              <p className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-500 text-sm font-bold p-4 rounded-[12px] border border-red-100 mb-4">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
            <button className="ml-auto" onClick={() => setError('')}>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Layout conversations + messages */}
        <div className="bg-white rounded-[28px] overflow-hidden flex"
          style={{ border: '1px solid #EBEBEB', height: 'calc(100vh - 180px)', minHeight: '520px' }}>

          {/* ── Sidebar conversations ── */}
          <div className={`w-full md:w-[320px] shrink-0 flex flex-col
            ${(showConversation || showNewConversation) ? 'hidden md:flex' : 'flex'}`}
            style={{ borderRight: '1px solid #F0EDE8' }}>

            {/* Recherche */}
            <div className="p-4" style={{ borderBottom: '1px solid #F0EDE8' }}>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#F7F5F0' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>search</span>
                <input type="text" placeholder="Rechercher..."
                  className="bg-transparent outline-none text-[13px] font-medium w-full"
                  style={{ color: '#374151' }} />
              </div>
            </div>

            {/* Liste */}
            <div className="flex-1 overflow-y-auto">
              {/* Bouton "Nouveau message" si initShop en attente */}
              {initShop && (
                <button
                  onClick={() => { setActiveConv(null); setInitShop(initShop) }}
                  className="w-full flex items-center gap-3 px-4 py-4 transition-all text-left"
                  style={{
                    background: '#E6F8EA',
                    borderBottom: '1px solid #F0EDE8',
                    borderLeft: '3px solid #1B6B3A',
                  }}>
                  <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0 bg-white">
                    <SafeImage src={initShop.logo} name={initShop.name} alt={initShop.name}
                      fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: '#1B6B3A' }}>
                      {initShop.name}
                    </p>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Nouveau message</p>
                  </div>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#1B6B3A' }}>
                    add_comment
                  </span>
                </button>
              )}

              {conversations.length === 0 && !initShop ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#F7F5F0' }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#9CA3AF' }}>forum</span>
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#374151' }}>Aucune conversation</p>
                  <p className="text-xs mb-4" style={{ color: '#9CA3AF' }}>
                    {userRole === 'vendeur'
                      ? 'Les clients vous contacteront depuis votre boutique'
                      : 'Contactez un vendeur depuis sa page boutique'}
                  </p>
                  {userRole !== 'vendeur' && (
                    <Link href="/boutiques"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                      style={{ background: '#1B6B3A' }}>
                      Voir les boutiques
                    </Link>
                  )}
                </div>
              ) : (
                conversations.map(conv => (
                  <button key={conv.id} onClick={() => openConversation(conv)}
                    className="w-full flex items-center gap-3 px-4 py-4 transition-all hover:bg-gray-50 text-left"
                    style={{
                      background: activeConv === conv.id ? '#F0FDF4' : 'transparent',
                      borderBottom: '1px solid #F8F8F6',
                      borderLeft: activeConv === conv.id ? '3px solid #1B6B3A' : '3px solid transparent',
                    }}>
                    <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0">
                      <img
                        src={getContactAvatar(conv)}
                        alt="" className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-bold truncate" style={{ color: '#0D0D0D' }}>
                          {getContactName(conv)}
                        </p>
                        <span className="text-[10px] font-medium shrink-0" style={{ color: '#9CA3AF' }}>
                          {formatTime(conv.last_message_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[12px] truncate" style={{ color: '#6B7280' }}>
                          {conv.lastMessage?.content || conv.last_message || 'Pas encore de message'}
                        </p>
                        {conv.unread > 0 && (
                          <span className="min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
                            style={{ background: '#1B6B3A' }}>
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Panneau central ── */}
          <div className={`flex-1 flex flex-col
            ${(!showConversation && !showNewConversation) ? 'hidden md:flex' : 'flex'}`}>

            {/* ── Mode : Nouvelle conversation (depuis boutique) ── */}
            {showNewConversation && (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 shrink-0"
                  style={{ borderBottom: '1px solid #F0EDE8', background: '#FAFAF8' }}>
                  <button onClick={() => setInitShop(null)}
                    className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: '#374151' }}>arrow_back</span>
                  </button>
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 bg-gray-100">
                    <SafeImage src={initShop.logo} name={initShop.name} alt={initShop.name}
                      fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold" style={{ color: '#0D0D0D' }}>{initShop.name}</p>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Nouveau message · Boutique</p>
                  </div>
                  <Link href={`/boutiques/${initShop.slug}`}
                    className="px-4 py-2 rounded-xl text-[11px] font-bold transition-colors hover:bg-gray-100"
                    style={{ border: '1px solid #EBEBEB', color: '#374151' }}>
                    Voir boutique
                  </Link>
                </div>

                {/* Zone vide + invitation */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  style={{ background: '#FAFAF8' }}>
                  <div className="w-16 h-16 rounded-full overflow-hidden relative mb-4 bg-gray-100">
                    <SafeImage src={initShop.logo} name={initShop.name} alt={initShop.name}
                      fill className="object-cover" />
                  </div>
                  <p className="text-[15px] font-black mb-1" style={{ color: '#111827' }}>
                    Contacter {initShop.name}
                  </p>
                  <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
                    Envoyez votre premier message pour démarrer la conversation.
                  </p>
                </div>

                {/* Form premier message */}
                <form onSubmit={handleInitSend}
                  className="px-4 py-4 shrink-0 flex items-center gap-3"
                  style={{ borderTop: '1px solid #F0EDE8', background: 'white' }}>
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
                    style={{ background: '#F7F5F0', border: '1px solid #EBEBEB' }}>
                    <input
                      type="text"
                      value={initMessage}
                      onChange={e => setInitMessage(e.target.value)}
                      placeholder={`Bonjour ${initShop.name}, je souhaite...`}
                      className="bg-transparent outline-none text-[13px] font-medium w-full"
                      style={{ color: '#374151' }}
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!initMessage.trim() || initSending}
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-50 hover:opacity-90"
                    style={{ background: '#1B6B3A' }}>
                    {initSending
                      ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <span className="material-symbols-outlined text-white text-[20px]">send</span>
                    }
                  </button>
                </form>
              </>
            )}

            {/* ── Mode : Conversation existante ── */}
            {showConversation && (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 shrink-0"
                  style={{ borderBottom: '1px solid #F0EDE8', background: '#FAFAF8' }}>
                  <button onClick={() => setActiveConv(null)}
                    className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: '#374151' }}>arrow_back</span>
                  </button>
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                    <img
                      src={getContactAvatar(conversations.find(c => c.id === activeConv) || {})}
                      alt="" className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold truncate" style={{ color: '#0D0D0D' }}>
                      {getContactName(conversations.find(c => c.id === activeConv) || {})}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>
                      {convMeta?.shop?.name ? `Boutique : ${convMeta.shop.name}` : 'En ligne'}
                    </p>
                  </div>
                  {convMeta?.shop?.slug && (
                    <Link href={`/boutiques/${convMeta.shop.slug}`}
                      className="px-4 py-2 rounded-xl text-[11px] font-bold transition-colors hover:bg-gray-100"
                      style={{ border: '1px solid #EBEBEB', color: '#374151' }}>
                      Voir boutique
                    </Link>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3"
                  style={{ background: '#FAFAF8' }}>
                  {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-sm" style={{ color: '#9CA3AF' }}>Commencez la conversation</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMine = msg.sender_id === userId
                      return (
                        <div key={msg.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[75%]">
                            <div className="px-4 py-3 rounded-[20px] text-[13px] font-medium leading-relaxed"
                              style={isMine ? {
                                background: '#1B6B3A', color: 'white',
                                borderBottomRightRadius: '6px',
                              } : {
                                background: 'white', color: '#374151',
                                border: '1px solid #EBEBEB',
                                borderBottomLeftRadius: '6px',
                              }}>
                              {msg.content}
                            </div>
                            <div className={`flex items-center gap-1.5 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[10px]" style={{ color: '#9CA3AF' }}>
                                {formatTime(msg.created_at)}
                              </span>
                              {isMine && msg.is_read && (
                                <span className="material-symbols-outlined text-[12px]" style={{ color: '#1B6B3A' }}>
                                  done_all
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input envoyer */}
                <form onSubmit={handleSend}
                  className="px-4 py-4 shrink-0 flex items-center gap-3"
                  style={{ borderTop: '1px solid #F0EDE8', background: 'white' }}>
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
                    style={{ background: '#F7F5F0', border: '1px solid #EBEBEB' }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Écrire un message..."
                      className="bg-transparent outline-none text-[13px] font-medium w-full"
                      style={{ color: '#374151' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-50 hover:opacity-90"
                    style={{ background: '#1B6B3A' }}>
                    {sending
                      ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <span className="material-symbols-outlined text-white text-[20px]">send</span>
                    }
                  </button>
                </form>
              </>
            )}

            {/* ── Mode : Rien sélectionné ── */}
            {!showConversation && !showNewConversation && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ background: '#F7F5F0' }}>
                  <span className="material-symbols-outlined text-4xl" style={{ color: '#9CA3AF' }}>
                    mark_chat_unread
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#374151' }}>
                  Sélectionnez une conversation
                </h3>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  Choisissez à gauche ou contactez un vendeur depuis sa boutique
                </p>
                <Link href="/boutiques"
                  className="mt-5 px-6 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: '#1B6B3A' }}>
                  Parcourir les boutiques
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Export avec Suspense (requis par useSearchParams dans Next.js 14) ────────
export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#F7F5F0' }}>
        <div className="w-12 h-12 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MessagesInner />
    </Suspense>
  )
}
