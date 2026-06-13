'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import InventoryTab from '@/components/vendeur/InventoryTab'
import ReviewsTab from '@/components/vendeur/ReviewsTab'
import SettingsTab from '@/components/vendeur/SettingsTab'
import OrdersTab from '@/components/vendeur/OrdersTab'
import { getVendorDashboard } from '@/lib/api'
import { getShopBannerImage, getStorageUrl } from '@/lib/images'
import SafeImage from '@/components/ui/SafeImage'

// ─── Sidebar Navigation ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Tableau de bord',    icon: 'dashboard',    key: 'Tableau de bord' },
  { id: 'inventory',  label: 'Inventaire & Stock',  icon: 'inventory_2',  key: 'Inventaire & Stock' },
  { id: 'orders',     label: 'Commandes',           icon: 'package_2',    key: 'Commandes' },
  { id: 'messages',   label: 'Messages',            icon: 'chat',         key: 'Messages' },
  { id: 'reviews',    label: 'Avis clients',        icon: 'star',         key: 'Avis clients' },
  { id: 'settings',   label: 'Paramètres',          icon: 'settings',     key: 'Paramètres boutique' },
]

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, iconColor, iconBg, label, value, suffix, badge, trend }) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-3 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
            <span className="material-symbols-outlined text-[18px] text-gray-700">{icon}</span>
          </div>
          <p className="text-[12px] font-bold text-gray-600">{label}</p>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-1">
        <p className="text-[24px] font-bold text-gray-900 leading-none">
          {value}<span className="text-[12px] font-medium ml-1 text-gray-500">{suffix}</span>
        </p>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[11px] font-semibold mt-1 ${trend > 0 ? 'text-[#008060]' : 'text-red-500'}`}>
          <span className="material-symbols-outlined text-[14px]">{trend > 0 ? 'trending_up' : 'trending_down'}</span>
          {trend > 0 ? '+' : ''}{trend}% ce mois
        </div>
      )}
    </div>
  )
}

// ─── Quick Action ──────────────────────────────────────────────────────────────
function QuickAction({ icon, label, desc, color, bg, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-lg w-full text-left transition-colors hover:bg-gray-50 border border-transparent hover:border-gray-200 group">
      <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-100 shrink-0">
        <span className="material-symbols-outlined text-[18px] text-gray-700">{icon}</span>
      </div>
      <div>
        <p className="font-semibold text-[13px] text-gray-900">{label}</p>
        <p className="text-[11px] text-gray-500">{desc}</p>
      </div>
    </button>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EspaceVendeur() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('Tableau de bord')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shopData, setShopData] = useState(null)
  const [shopLoading, setShopLoading] = useState(true)
  const [noShop, setNoShop] = useState(false)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pendingOrders: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/connexion'); return }
    if (status !== 'authenticated' || !session?.user) return

    setShopLoading(true)
    getVendorDashboard(session.user.apiToken)
      .then(data => {
        if (data.shop) { setShopData(data.shop); setNoShop(false) }
        else setNoShop(true)
        if (data.stats) setStats(data.stats)
      })
      .catch(err => {
        if (err.message?.includes('404') || err.message?.includes('shop')) setNoShop(true)
      })
      .finally(() => setShopLoading(false))
  }, [status, session, router])

  const userName = session?.user?.name || 'Vendeur'
  const bannerSrc = shopData ? getShopBannerImage(shopData) : '/images/shops/default.jpg'
  const avatarSrc = getStorageUrl(shopData?.logo) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(shopData?.name || userName)}&background=1B6B3A&color=fff&size=200`

  // ── Loading ──
  if (status === 'loading' || shopLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#F7F5F0' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-[#008060] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-bold" style={{ color: '#9CA3AF' }}>Chargement de votre espace…</p>
        </div>
      </div>
    )
  }

  // ── No shop ──
  if (noShop) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F5F0' }}>
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full text-center" style={{ border: '1px solid #EBEBEB', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ background: '#E6F8EA' }}>
            <span className="material-symbols-outlined text-[40px]" style={{ color: '#008060' }}>storefront</span>
          </div>
          <h2 className="font-black text-[24px] mb-3" style={{ color: '#0D0D0D' }}>Créez votre boutique</h2>
          <p className="text-[14px] leading-relaxed mb-8" style={{ color: '#6B7280' }}>
            Vous n&apos;avez pas encore de boutique. Créez-en une pour commencer à vendre sur CauriMarket.
          </p>
          <Link href="/inscription-vendeur"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[14px] text-white transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ background: '#008060' }}>
            <span className="material-symbols-outlined text-[20px]">add_business</span>
            Créer ma boutique
          </Link>
        </div>
      </div>
    )
  }

  const metrics = [
    { icon: 'analytics',   label: 'Revenus totaux',  value: stats.revenue ? `${(stats.revenue / 1000).toFixed(0)}K` : '0',
      suffix: ' FCFA', badge: '+12.4%',  iconColor: '#008060', iconBg: '#E6F8EA', trend: 12 },
    { icon: 'star',        label: 'Note moyenne',    value: '4.9',
      suffix: '/ 5.0',   badge: 'Top 1%', iconColor: '#D4920A', iconBg: '#FEF3C7', trend: null },
    { icon: 'inventory_2', label: 'Produits actifs', value: String(stats.products || 0),
      suffix: ' articles', badge: null,  iconColor: '#7C3AED', iconBg: '#EDE9FE', trend: null },
    { icon: 'package_2',   label: 'Commandes',       value: String(stats.orders || 0),
      suffix: ' total',   badge: stats.pendingOrders ? `${stats.pendingOrders} en attente` : null,
      iconColor: '#DB2777', iconBg: '#FCE7F3', trend: null },
  ]

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F7F5F0' }}>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex pt-20 min-h-screen">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className={`fixed top-0 left-0 h-full z-40 w-[260px] pt-20 pb-8 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)]`}
          style={{ background: 'white', borderRight: '1px solid #EBEBEB' }}>

          {/* Profile mini */}
          <div className="px-5 py-4 mx-4 mb-4 rounded-2xl" style={{ background: '#F7F5F0' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0">
                <SafeImage src={avatarSrc} name={shopData?.name || userName} alt="Avatar" fill className="object-cover" sizes="40px" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-[13px] truncate" style={{ color: '#0D0D0D' }}>{shopData?.name || userName}</p>
                <p className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>{shopData?.location || 'Bénin'}</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] px-4 mb-2" style={{ color: '#C4C4C4' }}>Navigation</p>
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.key
              return (
                <button key={item.id}
                  onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left w-full transition-colors
                    ${isActive ? 'bg-[#ebebeb] text-[#1a1a1a] font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#1a1a1a]' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[13px]">{item.label}</span>
                </button>
              )
            })}

            <p className="text-[9px] font-black uppercase tracking-[0.2em] px-4 mt-4 mb-2" style={{ color: '#C4C4C4' }}>Compte</p>
            <Link href={shopData?.slug ? `/boutiques/${shopData.slug}` : '#'}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all ${!shopData?.slug ? 'opacity-40 pointer-events-none' : ''}`}>
              <span className="material-symbols-outlined text-[20px] text-gray-400">open_in_new</span>
              <span className="font-bold text-[13px]">Voir ma boutique</span>
            </Link>
            <button onClick={() => signOut({ callbackUrl: '/connexion' })}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left w-full"
              style={{ color: '#EF4444' }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#EF4444' }}>logout</span>
              <span className="font-bold text-[13px]">Déconnexion</span>
            </button>
          </nav>
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <main className="flex-1 min-w-0 flex flex-col">

          {/* ── Mobile top bar ── */}
          <div className="sticky top-20 z-20 lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <p className="font-black text-[14px]">{activeTab}</p>
          </div>

          <div className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-[1100px] w-full mx-auto">

            {/* ── TABLEAU DE BORD ── */}
            {activeTab === 'Tableau de bord' && (
              <div className="flex flex-col gap-6">

                {/* Hero bannière vendeur */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                      <SafeImage src={avatarSrc} name={shopData?.name || userName} alt="Boutique" fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 mb-1">
                        Bonjour, {userName}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{shopData?.name || 'Ma Boutique'}</span>
                        {shopData?.status === 'active' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F8EA] text-[#008060]">
                            Vérifié
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => setActiveTab('Paramètres boutique')}
                      className="flex-1 md:flex-none px-4 py-2 rounded-lg text-[13px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors border border-gray-200">
                      Paramètres
                    </button>
                    <button onClick={() => setActiveTab('Inventaire & Stock')}
                      className="flex-1 md:flex-none px-4 py-2 rounded-lg text-[13px] font-semibold bg-black text-white hover:bg-gray-800 transition-colors shadow-sm">
                      Ajouter un produit
                    </button>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map((m, i) => <StatCard key={i} {...m} />)}
                </div>

                {/* Graphique + Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                  {/* Graphe SVG */}
                  <div className="lg:col-span-3 bg-white rounded-[24px] p-6" style={{ border: '1px solid #EBEBEB' }}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-black text-[15px]" style={{ color: '#0D0D0D' }}>Performances</h3>
                        <p className="text-[11px] font-medium mt-0.5" style={{ color: '#9CA3AF' }}>Ventes sur 7 jours</p>
                      </div>
                      <div className="flex rounded-full p-1 gap-0.5" style={{ background: '#F3F4F6' }}>
                        {['7J', '30J', '1A'].map((p, i) => (
                          <button key={p} className="px-3.5 py-1.5 text-[10px] font-black rounded-full transition-all"
                            style={i === 0 ? { background: '#008060', color: 'white' } : { color: '#9CA3AF' }}>{p}</button>
                        ))}
                      </div>
                    </div>
                    <div className="h-[160px] w-full">
                      <svg width="100%" height="100%" viewBox="0 0 500 140" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#008060" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#008060" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,100 C60,85 120,120 200,65 C270,20 360,80 430,35 L500,30 L500,140 L0,140 Z" fill="url(#cGrad)" />
                        <path d="M0,100 C60,85 120,120 200,65 C270,20 360,80 430,35 L500,30" fill="none" stroke="#008060" strokeWidth="2.5" strokeLinecap="round" />
                        {[[200, 65], [430, 35], [500, 30]].map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="5" fill="#008060" stroke="white" strokeWidth="2" />
                        ))}
                      </svg>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold pt-3 border-t" style={{ borderColor: '#F3F4F6', color: '#9CA3AF' }}>
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => <span key={j}>{j}</span>)}
                    </div>
                  </div>

                  {/* Actions Rapides */}
                  <div className="lg:col-span-2 bg-white rounded-[24px] p-6 flex flex-col gap-3" style={{ border: '1px solid #EBEBEB' }}>
                    <h3 className="font-black text-[15px] mb-1" style={{ color: '#0D0D0D' }}>Actions rapides</h3>
                    <QuickAction
                      icon="add_circle" label="Ajouter un produit" desc="Publier un nouvel article"
                      color="#008060" bg="#F0FDF4" onClick={() => setActiveTab('Inventaire & Stock')} />
                    <QuickAction
                      icon="package_2" label="Voir les commandes" desc={`${stats.pendingOrders || 0} en attente`}
                      color="#D4920A" bg="#FFFBEB" onClick={() => setActiveTab('Commandes')} />
                    <QuickAction
                      icon="star" label="Avis clients" desc="Gérer les évaluations"
                      color="#7C3AED" bg="#F5F3FF" onClick={() => setActiveTab('Avis clients')} />
                    <QuickAction
                      icon="chat" label="Messagerie" desc="Répondre aux clients"
                      color="#DB2777" bg="#FDF2F8" onClick={() => router.push('/messages')} />
                  </div>
                </div>

                {/* Solde + Paiements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Solde */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-[12px] font-bold text-gray-600">Solde boutique</p>
                        <span className="material-symbols-outlined text-[18px] text-gray-400">account_balance_wallet</span>
                      </div>
                      <h3 className="text-[32px] font-bold text-gray-900 leading-none mb-1">
                        {stats.revenue ? `${(stats.revenue / 1000).toFixed(0)}K` : '0'}
                        <span className="text-[14px] font-medium ml-1 text-gray-500">FCFA</span>
                      </h3>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-tight text-gray-500">
                        <span>Disponible</span><span className="text-gray-900">0 FCFA</span>
                      </div>
                      <button className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200">
                        Retirer les fonds
                      </button>
                    </div>
                  </div>

                  {/* Accès boutique & messagerie */}
                  <div className="bg-white rounded-[24px] p-6" style={{ border: '1px solid #EBEBEB' }}>
                    <h3 className="font-black text-[15px] mb-4" style={{ color: '#0D0D0D' }}>Accès rapide</h3>
                    <div className="flex flex-col gap-3">
                      <Link href={shopData?.slug ? `/boutiques/${shopData.slug}` : '#'}
                        className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: '#F0FDF4', border: '1px solid rgba(27,107,58,0.15)' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#008060' }}>
                          <span className="material-symbols-outlined text-[20px] text-white">storefront</span>
                        </div>
                        <div>
                          <p className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>Voir ma boutique</p>
                          <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Page publique de la boutique</p>
                        </div>
                        <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: '#008060' }}>arrow_forward</span>
                      </Link>
                      <button onClick={() => router.push('/messages')}
                        className="flex items-center gap-4 p-4 rounded-2xl w-full text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: '#FDF2F8', border: '1px solid rgba(219,39,119,0.15)' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#DB2777' }}>
                          <span className="material-symbols-outlined text-[20px] text-white">chat_bubble</span>
                        </div>
                        <div>
                          <p className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>Messagerie clients</p>
                          <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Répondre aux questions</p>
                        </div>
                        <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: '#DB2777' }}>arrow_forward</span>
                      </button>
                      <button onClick={() => setActiveTab('Paramètres boutique')}
                        className="flex items-center gap-4 p-4 rounded-2xl w-full text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                        style={{ background: '#F5F3FF', border: '1px solid rgba(124,58,237,0.15)' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#7C3AED' }}>
                          <span className="material-symbols-outlined text-[20px] text-white">settings</span>
                        </div>
                        <div>
                          <p className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>Paramètres</p>
                          <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Modifier les infos boutique</p>
                        </div>
                        <span className="material-symbols-outlined text-[16px] ml-auto" style={{ color: '#7C3AED' }}>arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ── ONGLETS ── */}
            {activeTab === 'Inventaire & Stock' && <InventoryTab token={session?.user?.apiToken} />}
            {activeTab === 'Commandes' && <OrdersTab token={session?.user?.apiToken} />}
            {activeTab === 'Avis clients' && <ReviewsTab token={session?.user?.apiToken} />}
            {activeTab === 'Paramètres boutique' && (
              <SettingsTab shop={shopData} token={session?.user?.apiToken} onUpdated={s => setShopData(s)} />
            )}
            {activeTab === 'Messages' && (
              <div className="bg-white rounded-[28px] p-10 flex flex-col items-center text-center" style={{ border: '1px solid #EBEBEB' }}>
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: '#E6F8EA' }}>
                  <span className="material-symbols-outlined text-[40px]" style={{ color: '#008060' }}>chat</span>
                </div>
                <h3 className="font-black text-[20px] mb-3" style={{ color: '#0D0D0D' }}>Centre de messages</h3>
                <p className="text-[14px] max-w-sm mb-7 leading-relaxed" style={{ color: '#9CA3AF' }}>
                  Gérez vos conversations avec les clients et répondez à leurs questions directement.
                </p>
                <button onClick={() => router.push('/messages')}
                  className="px-8 py-3.5 rounded-2xl text-[13px] font-black text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: '#008060' }}>
                  Ouvrir la messagerie →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
