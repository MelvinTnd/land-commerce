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
import { getShopBannerImage } from '@/lib/images'

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
    <div className="bg-white rounded-[20px] p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ border: '1px solid #EBEBEB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: iconBg }}>
          <span className="material-symbols-outlined text-[22px]" style={{ color: iconColor }}>{icon}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: iconBg, color: iconColor }}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-1" style={{ color: '#9CA3AF' }}>{label}</p>
        <p className="text-[26px] font-black leading-none" style={{ color: '#0D0D0D' }}>
          {value}<span className="text-[13px] font-medium ml-1" style={{ color: '#9CA3AF' }}>{suffix}</span>
        </p>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: trend > 0 ? '#1B6B3A' : '#EF4444' }}>
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
      className="flex items-center gap-4 p-4 rounded-2xl w-full text-left transition-all hover:-translate-y-0.5 hover:shadow-md group"
      style={{ background: bg, border: `1px solid ${color}22` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
        style={{ background: `${color}20` }}>
        <span className="material-symbols-outlined text-[20px]" style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>{label}</p>
        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{desc}</p>
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
  const avatarSrc = shopData?.logo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(shopData?.name || userName)}&background=1B6B3A&color=fff&size=200`

  // ── Loading ──
  if (status === 'loading' || shopLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#F7F5F0' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
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
            <span className="material-symbols-outlined text-[40px]" style={{ color: '#1B6B3A' }}>storefront</span>
          </div>
          <h2 className="font-black text-[24px] mb-3" style={{ color: '#0D0D0D' }}>Créez votre boutique</h2>
          <p className="text-[14px] leading-relaxed mb-8" style={{ color: '#6B7280' }}>
            Vous n&apos;avez pas encore de boutique. Créez-en une pour commencer à vendre sur BéninMarket.
          </p>
          <Link href="/inscription-vendeur"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[14px] text-white transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ background: '#1B6B3A' }}>
            <span className="material-symbols-outlined text-[20px]">add_business</span>
            Créer ma boutique
          </Link>
        </div>
      </div>
    )
  }

  const metrics = [
    { icon: 'analytics',   label: 'Revenus totaux',  value: stats.revenue ? `${(stats.revenue / 1000).toFixed(0)}K` : '0',
      suffix: ' FCFA', badge: '+12.4%',  iconColor: '#1B6B3A', iconBg: '#E6F8EA', trend: 12 },
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
                <Image src={avatarSrc} alt="Avatar" fill className="object-cover" sizes="40px" unoptimized />
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
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-left w-full group
                    ${isActive ? 'text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  style={isActive ? { background: '#1B6B3A' } : {}}>
                  <span className={`material-symbols-outlined text-[20px] transition-colors
                    ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-700'}`}>
                    {item.icon}
                  </span>
                  <span className="font-bold text-[13px]">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full ml-auto" />}
                </button>
              )
            })}

            <p className="text-[9px] font-black uppercase tracking-[0.2em] px-4 mt-4 mb-2" style={{ color: '#C4C4C4' }}>Compte</p>
            <Link href="/" className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
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
                <div className="relative rounded-[28px] overflow-hidden" style={{ minHeight: 200 }}>
                  <Image src={bannerSrc} alt="Bannière boutique" fill className="object-cover" priority sizes="100vw" />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, rgba(13,13,13,0.78) 0%, rgba(27,107,58,0.55) 100%)'
                  }} />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-7">
                    <div className="flex items-center gap-5">
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0"
                        style={{ border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                        <Image src={avatarSrc} alt="Boutique" fill className="object-cover" sizes="80px" unoptimized />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                          <h1 className="text-[22px] md:text-[26px] font-black text-white">{shopData?.name || 'Ma Boutique'}</h1>
                          {shopData?.status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase"
                              style={{ background: 'rgba(212,146,10,0.3)', color: '#FDE68A', border: '1px solid rgba(212,146,10,0.4)' }}>
                              <span className="material-symbols-outlined text-[11px]">verified</span> Vérifié
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] font-medium flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {shopData?.location || 'Bénin'} · {userName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={() => setActiveTab('Paramètres boutique')}
                        className="px-5 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all hover:bg-white/10"
                        style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                        <span className="material-symbols-outlined text-[14px] mr-1.5 align-middle">edit</span>
                        Modifier
                      </button>
                      <button onClick={() => setActiveTab('Inventaire & Stock')}
                        className="px-5 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-wider text-white flex items-center gap-2 transition-all hover:opacity-90"
                        style={{ background: '#D4920A' }}>
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Nouveau produit
                      </button>
                    </div>
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
                            style={i === 0 ? { background: '#1B6B3A', color: 'white' } : { color: '#9CA3AF' }}>{p}</button>
                        ))}
                      </div>
                    </div>
                    <div className="h-[160px] w-full">
                      <svg width="100%" height="100%" viewBox="0 0 500 140" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1B6B3A" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#1B6B3A" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,100 C60,85 120,120 200,65 C270,20 360,80 430,35 L500,30 L500,140 L0,140 Z" fill="url(#cGrad)" />
                        <path d="M0,100 C60,85 120,120 200,65 C270,20 360,80 430,35 L500,30" fill="none" stroke="#1B6B3A" strokeWidth="2.5" strokeLinecap="round" />
                        {[[200, 65], [430, 35], [500, 30]].map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="5" fill="#1B6B3A" stroke="white" strokeWidth="2" />
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
                      color="#1B6B3A" bg="#F0FDF4" onClick={() => setActiveTab('Inventaire & Stock')} />
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
                  <div className="rounded-[24px] p-6 relative overflow-hidden text-white"
                    style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #0D4A28 100%)' }}>
                    <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[140px] opacity-[0.07] pointer-events-none select-none">
                      account_balance
                    </span>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Solde boutique</p>
                          <h3 className="text-[34px] font-black leading-none">
                            {stats.revenue ? `${(stats.revenue / 1000).toFixed(0)}K` : '0'}
                            <span className="text-[14px] font-medium ml-2" style={{ color: 'rgba(255,255,255,0.6)' }}>FCFA</span>
                          </h3>
                        </div>
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                          <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                        </div>
                      </div>
                      <div className="mb-5">
                        <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          <span>Disponible</span><span className="text-white">0 FCFA</span>
                        </div>
                        <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="bg-[#EAB308] h-full rounded-full w-[10%]" />
                        </div>
                      </div>
                      <button className="w-full py-3 rounded-2xl font-black text-[12px] uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                        style={{ background: '#EAB308' }}>
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                        Retirer les fonds
                      </button>
                    </div>
                  </div>

                  {/* Comptes paiement */}
                  <div className="bg-white rounded-[24px] p-6" style={{ border: '1px solid #EBEBEB' }}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-black text-[15px]" style={{ color: '#0D0D0D' }}>Comptes de paiement</h3>
                      <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>settings</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {[
                        { abbr: 'MTN', name: 'MTN MoMo', sub: 'Non configuré', bg: '#FFCC00', text: '#003366' },
                        { abbr: 'CEL', name: 'Celtiis Pay', sub: 'Non configuré', bg: '#E30A17', text: 'white' },
                      ].map(c => (
                        <div key={c.abbr} className="flex items-center gap-4 p-3.5 rounded-2xl" style={{ background: '#F9FAFB' }}>
                          <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-[11px] shrink-0"
                            style={{ background: c.bg, color: c.text }}>{c.abbr}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-[13px]" style={{ color: '#0D0D0D' }}>{c.name}</p>
                            <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{c.sub}</p>
                          </div>
                          <button className="text-[11px] font-black px-3 py-1.5 rounded-xl transition-all hover:bg-green-100"
                            style={{ color: '#1B6B3A', background: '#F0FDF4' }}>Configurer</button>
                        </div>
                      ))}
                      <button className="w-full py-3 rounded-2xl font-black text-[12px] flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
                        style={{ color: '#1B6B3A', border: '1.5px dashed rgba(27,107,58,0.3)' }}>
                        <span className="material-symbols-outlined text-[16px]">add</span> Ajouter un compte
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ── ONGLETS ── */}
            {activeTab === 'Inventaire & Stock' && <InventoryTab token={session?.user?.apiToken} />}
            {activeTab === 'Commandes' && <OrdersTab token={session?.user?.apiToken} />}
            {activeTab === 'Avis clients' && <ReviewsTab />}
            {activeTab === 'Paramètres boutique' && (
              <SettingsTab shop={shopData} token={session?.user?.apiToken} onUpdated={s => setShopData(s)} />
            )}
            {activeTab === 'Messages' && (
              <div className="bg-white rounded-[28px] p-10 flex flex-col items-center text-center" style={{ border: '1px solid #EBEBEB' }}>
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: '#E6F8EA' }}>
                  <span className="material-symbols-outlined text-[40px]" style={{ color: '#1B6B3A' }}>chat</span>
                </div>
                <h3 className="font-black text-[20px] mb-3" style={{ color: '#0D0D0D' }}>Centre de messages</h3>
                <p className="text-[14px] max-w-sm mb-7 leading-relaxed" style={{ color: '#9CA3AF' }}>
                  Gérez vos conversations avec les clients et répondez à leurs questions directement.
                </p>
                <button onClick={() => router.push('/messages')}
                  className="px-8 py-3.5 rounded-2xl text-[13px] font-black text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: '#1B6B3A' }}>
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
