'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { getConversations, getConversation, replyToConversation } from '@/lib/api'

export default function MessagesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [convMeta, setConvMeta] = useState(null)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  // Sauvegarder le token apiToken dans localStorage pour les appels API hors session
  useEffect(() => {
    if (session?.user?.apiToken && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', session.user.apiToken)
    }
  }, [session?.user?.apiToken])

  const token = session?.user?.apiToken
  const userId = session?.user?.id
  const userRole = session?.user?.role

  // Redirection si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/connexion')
  }, [status, router])

  // Charger les conversations
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    getConversations(token)
      .then(data => {
        setConversations(data.conversations || [])
      })
      .catch((err) => {
        setError(err.message || "Erreur de chargement")
      })
      .finally(() => setLoading(false))
  }, [token])

  // Charger les messages d'une conversation
  const openConversation = async (conv) => {
    setActiveConv(conv.id)
    try {
      const data = await getConversation(conv.id, token)
      setMessages(data.messages || [])
      setConvMeta(data.conversation || null)
      setError('')
      // Mettre à jour le compteur unread localement
      setConversations(prev => prev.map(c =>
        c.id === conv.id ? { ...c, unread: 0 } : c
      ))
    } catch (err) {
      setError(err.message || "Erreur lors du chargement")
    }
  }

  // Scroll en bas quand les messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Envoyer un message
  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv || sending) return
    setSending(true)
    try {
      const data = await replyToConversation(activeConv, newMessage.trim(), token)
      setMessages(prev => [...prev, data])
      setNewMessage('')
      setError('')
      // Mettre à jour le dernier message dans la liste
      setConversations(prev => prev.map(c =>
        c.id === activeConv ? { ...c, lastMessage: data, last_message_at: new Date().toISOString() } : c
      ))
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi")
    }
    setSending(false)
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now - d
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return "À l'instant"
    if (diffMin < 60) return `Il y a ${diffMin} min`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `Il y a ${diffH}h`
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  }

  const getContactName = (conv) => {
    if (!conv.with) return 'Inconnu'
    return conv.with.name || conv.with.slug || 'Utilisateur'
  }

  const getContactAvatar = (conv) => {
    const name = getContactName(conv)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1B6B3A&color=fff&size=100`
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center" style={{ background: '#F7F5F0' }}>
        <div className="w-12 h-12 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-500 text-sm font-bold p-4 rounded-[12px] border border-red-100 mb-4">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {error}
          </div>
        )}

        {/* Layout conversations + messages */}
        <div className="bg-white rounded-[28px] overflow-hidden flex" style={{ border: '1px solid #EBEBEB', height: 'calc(100vh - 180px)', minHeight: '500px' }}>

          {/* Sidebar conversations */}
          <div className={`w-full md:w-[340px] shrink-0 flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}
            style={{ borderRight: '1px solid #F0EDE8' }}>

            {/* Recherche */}
            <div className="p-4" style={{ borderBottom: '1px solid #F0EDE8' }}>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#F7F5F0' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>search</span>
                <input type="text" placeholder="Rechercher une conversation..."
                  className="bg-transparent outline-none text-[13px] font-medium w-full" style={{ color: '#374151' }} />
              </div>
            </div>

            {/* Liste */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#F7F5F0' }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#9CA3AF' }}>forum</span>
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#374151' }}>Aucune conversation</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>
                    {userRole === 'vendeur'
                      ? 'Les clients vous contacteront depuis votre boutique'
                      : 'Contactez un vendeur depuis sa page boutique'}
                  </p>
                  {userRole !== 'vendeur' && (
                    <Link href="/boutiques" className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: '#1B6B3A' }}>
                      Voir les boutiques
                    </Link>
                  )}
                </div>
              ) : (
                conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className="w-full flex items-center gap-3 px-4 py-4 transition-all hover:bg-gray-50 text-left"
                    style={{
                      background: activeConv === conv.id ? '#F0FDF4' : 'transparent',
                      borderBottom: '1px solid #F8F8F6',
                      borderLeft: activeConv === conv.id ? '3px solid #1B6B3A' : '3px solid transparent',
                    }}
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0">
                      <Image src={getContactAvatar(conv)} alt="" fill className="object-cover" sizes="44px" />
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
                          {conv.lastMessage?.content || 'Pas encore de message'}
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

          {/* Zone de messages */}
          <div className={`flex-1 flex flex-col ${!activeConv ? 'hidden md:flex' : 'flex'}`}>

            {!activeConv ? (
              /* Pas de conversation sélectionnée */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: '#F7F5F0' }}>
                  <span className="material-symbols-outlined text-4xl" style={{ color: '#9CA3AF' }}>mark_chat_unread</span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#374151' }}>Sélectionnez une conversation</h3>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>Choisissez une conversation pour commencer à discuter</p>
              </div>
            ) : (
              <>
                {/* Header conversation */}
                <div className="flex items-center gap-3 px-6 py-4 shrink-0" style={{ borderBottom: '1px solid #F0EDE8', background: '#FAFAF8' }}>
                  {/* Bouton retour mobile */}
                  <button onClick={() => setActiveConv(null)} className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: '#374151' }}>arrow_back</span>
                  </button>
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                    <Image
                      src={getContactAvatar(conversations.find(c => c.id === activeConv) || {})}
                      alt="" fill className="object-cover" sizes="40px"
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
                    <Link href={`/boutique/${convMeta.shop.slug}`}
                      className="px-4 py-2 rounded-xl text-[11px] font-bold transition-colors hover:bg-gray-100"
                      style={{ border: '1px solid #EBEBEB', color: '#374151' }}>
                      Voir boutique
                    </Link>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3" style={{ background: '#FAFAF8' }}>
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
                            <div className={`px-4 py-3 rounded-[20px] text-[13px] font-medium leading-relaxed`}
                              style={isMine ? {
                                background: '#1B6B3A',
                                color: 'white',
                                borderBottomRightRadius: '6px',
                              } : {
                                background: 'white',
                                color: '#374151',
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
                                <span className="material-symbols-outlined text-[12px]" style={{ color: '#1B6B3A' }}>done_all</span>
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
                <form onSubmit={handleSend} className="px-4 py-4 shrink-0 flex items-center gap-3" style={{ borderTop: '1px solid #F0EDE8', background: 'white' }}>
                  <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: '#F7F5F0', border: '1px solid #EBEBEB' }}>
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
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-50"
                    style={{ background: '#1B6B3A' }}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-white text-[20px]">send</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
