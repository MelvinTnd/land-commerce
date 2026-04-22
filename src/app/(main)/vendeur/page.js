'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import InventoryTab from '@/components/vendeur/InventoryTab'
import SettingsTab from '@/components/vendeur/SettingsTab'
import CreateShopWizard from '@/components/vendeur/CreateShopWizard'
import { getVendorDashboard } from '@/lib/api'

/* ─────────────── Micro-composants ─────────────── */

function KpiCard({ icon, label, value, sub, color, bg, badge }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4"
      style={{ border: '1px solid #EAEAEA', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <div className="flex justify-between items-start">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <span className="material-symbols-outlined text-[22px]" style={{ color }}>{icon}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: bg, color }}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-0.5" style={{ color: '#9CA3AF' }}>{label}</p>
        <p className="text-xl font-black" style={{ color: '#111827' }}>{value}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</p>}
      </div>
    </div>
  )
}

function NavItem({ active, icon, label, badge, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold text-left transition-all"
      style={active
        ? { background: 'rgba(255,255,255,0.18)', color: '#fff' }
        : { color: 'rgba(255,255,255,0.55)' }}>
      <span className="material-symbols-outlined text-[19px]" style={{ flexShrink: 0 }}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="ml-1 text-[9px] font-black px-1.5 py-0.5 rounded-full"
          style={{ background: '#D4920A', color: '#fff' }}>{badge}</span>
      )}
    </button>
  )
}

/* ─────────────── Onglets ─────────────── */

function DashboardHome({ shopData, stats, setActiveTab }) {
  const bars = [40, 55, 48, 75, 62, 88, 70, 82, 58, 76, 91, 95]
  const maxBar = Math.max(...bars)

  return (
    <div className="flex flex-col gap-6">
      {/* Bannière bienvenue */}
      <div className="relative overflow-hidden rounded-3xl p-7"
        style={{ background: 'linear-gradient(130deg, #1B6B3A 0%, #0D4A28 55%, #B8760A 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
          style={{ background: 'white' }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Espace Vendeur — BéninMarket
            </p>
            <h2 className="text-3xl font-black text-white mb-1.5">
              Bienvenue 👋
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Boutique <strong className="text-white">{shopData?.name}</strong> ·{' '}
              <span style={{ color: shopData?.status === 'active' ? '#86EFAC' : '#FDE68A' }}>
                {shopData?.status === 'active' ? '● Active' : '● En attente'}
              </span>
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setActiveTab('inventory')}
              className="px-5 py-2.5 rounded-2xl font-black text-[12px] text-white transition-all hover:opacity-85"
              style={{ background: '#D4920A' }}>
              + Nouveau produit
            </button>
            <button onClick={() => setActiveTab('settings')}
              className="px-5 py-2.5 rounded-2xl font-black text-[12px] transition-all hover:opacity-75"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              Paramètres
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon="payments"    label="Revenus totaux" value={stats.revenue ? `${(stats.revenue/1000).toFixed(0)}K` : '0'} sub="FCFA ce mois" color="#1B6B3A" bg="#E6F8EA" badge="+12%" />
        <KpiCard icon="inventory_2" label="Produits actifs" value={String(stats.products || 0)} sub="en catalogue"    color="#7C3AED" bg="#EDE9FE" />
        <KpiCard icon="package_2"   label="Commandes"       value={String(stats.orders || 0)}   sub="total reçues"    color="#D4920A" bg="#FEF3C7" />
        <KpiCard icon="star"        label="Note moyenne"    value="4.9"  sub="/ 5 — Top 1%"     color="#DB2777" bg="#FCE7F3" badge="🏆" />
      </div>

      {/* Graphique + Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique ventes */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6" style={{ border: '1px solid #EAEAEA' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-base" style={{ color: '#111827' }}>Performances des ventes</h3>
              <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>Vue sur 12 mois</p>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-36">
            {bars.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(v / maxBar) * 120}px`,
                    background: i === bars.length - 1
                      ? 'linear-gradient(180deg, #1B6B3A, #0D4A28)'
                      : 'linear-gradient(180deg, #BBF7D0, #E6F8EA)',
                  }} />
                <span className="text-[8px] font-bold" style={{ color: '#D1D5DB' }}>
                  {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-3xl p-6" style={{ border: '1px solid #EAEAEA' }}>
          <h3 className="font-black text-base mb-5" style={{ color: '#111827' }}>Activité récente</h3>
          {[
            { icon: 'star',      color: '#D4920A', bg: '#FEF3C7', msg: 'Avis 5★ sur « Masque Gèlèdè »',        time: '2h' },
            { icon: 'visibility',color: '#7C3AED', bg: '#EDE9FE', msg: '48 visites aujourd\'hui',               time: '3h' },
            { icon: 'inventory_2',color:'#1B6B3A', bg: '#E6F8EA', msg: 'Stock faible : Tabouret Nago',          time: '1j' },
          ].map((a, i) => (
            <div key={i} className="flex gap-3 py-3"
              style={{ borderBottom: i < 2 ? '1px solid #F9F9F9' : 'none' }}>
              <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center" style={{ background: a.bg }}>
                <span className="material-symbols-outlined text-[16px]" style={{ color: a.color }}>{a.icon}</span>
              </div>
              <div>
                <p className="text-[12px] font-semibold leading-snug" style={{ color: '#374151' }}>{a.msg}</p>
                <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Il y a {a.time}</p>
              </div>
            </div>
          ))}
          <button onClick={() => setActiveTab('marketing')}
            className="mt-4 w-full py-2 rounded-xl text-[12px] font-black"
            style={{ background: '#E6F8EA', color: '#1B6B3A' }}>
            Outils marketing →
          </button>
        </div>
      </div>
    </div>
  )
}

function OrdersTab() {
  return (
    <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center min-h-[400px]"
      style={{ border: '1px solid #EAEAEA' }}>
      <span className="material-symbols-outlined text-[64px] mb-4" style={{ color: '#E5E7EB' }}>package_2</span>
      <p className="font-black text-lg mb-2" style={{ color: '#374151' }}>Aucune commande pour l'instant</p>
      <p className="text-sm text-center max-w-xs" style={{ color: '#9CA3AF' }}>
        Quand des clients achèteront vos produits, leurs commandes apparaîtront ici.
      </p>
    </div>
  )
}

function AnalyticsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl p-6" style={{ border: '1px solid #EAEAEA' }}>
        <h3 className="font-black text-base mb-6" style={{ color: '#111827' }}>Indicateurs clés</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Taux de conversion', val: '3.2%', icon: 'trending_up', color: '#1B6B3A', bg: '#E6F8EA' },
            { label: 'Panier moyen', val: '24 500 CFA', icon: 'shopping_cart', color: '#D4920A', bg: '#FEF3C7' },
            { label: 'Taux de retour', val: '0.8%', icon: 'undo', color: '#7C3AED', bg: '#EDE9FE' },
            { label: 'Satisfaction', val: '4.9/5', icon: 'star', color: '#DB2777', bg: '#FCE7F3' },
          ].map((m, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: m.bg }}>
              <span className="material-symbols-outlined text-[22px] mb-2 block" style={{ color: m.color }}>{m.icon}</span>
              <p className="font-black text-lg" style={{ color: m.color }}>{m.val}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: m.color + 'BB' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReviewsTab() {
  const avis = [
    { nom: 'Ama K.', note: 5, date: 'Il y a 2j', msg: 'Superbe qualité, livraison rapide !', produit: 'Masque Gèlèdè' },
    { nom: 'Boris T.', note: 5, date: 'Il y a 5j', msg: 'Pièce vraiment authentique et bien emballée.', produit: 'Statue Royale' },
    { nom: 'Fatouma D.', note: 4, date: 'Il y a 1 sem', msg: 'Très beau produit, livraison un peu longue.', produit: 'Tabouret Nago' },
  ]
  return (
    <div className="bg-white rounded-3xl p-6" style={{ border: '1px solid #EAEAEA' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-base" style={{ color: '#111827' }}>Avis clients</h3>
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[13px] font-black"
          style={{ background: '#FEF3C7', color: '#D4920A' }}>
          <span className="material-symbols-outlined text-[16px]">star</span>4.9 / 5
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {avis.map((a, i) => (
          <div key={i} className="p-4 rounded-2xl" style={{ background: '#F9F9F9' }}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
                  style={{ background: '#1B6B3A' }}>{a.nom[0]}</div>
                <div>
                  <p className="font-black text-[13px]" style={{ color: '#111827' }}>{a.nom}</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{a.date} · {a.produit}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="material-symbols-outlined text-[13px]"
                    style={{ color: s <= a.note ? '#D4920A' : '#E5E7EB' }}>star</span>
                ))}
              </div>
            </div>
            <p className="text-[13px]" style={{ color: '#4B5563' }}>{a.msg}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketingTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { icon: 'campaign',  title: 'Créer une promotion', desc: 'Des réductions temporaires pour booster les ventes.', color: '#1B6B3A', bg: '#E6F8EA', cta: 'Créer' },
        { icon: 'share',     title: 'Partager ma boutique', desc: 'Générez un lien pour vos réseaux sociaux.', color: '#D4920A', bg: '#FEF3C7', cta: 'Partager' },
        { icon: 'qr_code',   title: 'QR Code boutique', desc: 'Pour vos flyers, cartes de visite et emballages.', color: '#7C3AED', bg: '#EDE9FE', cta: 'Télécharger' },
        { icon: 'star',      title: 'Programme fidélité', desc: 'Récompensez vos clients réguliers.', color: '#DB2777', bg: '#FCE7F3', cta: 'Bientôt…', disabled: true },
      ].map((t, i) => (
        <div key={i} className="bg-white rounded-3xl p-6 flex flex-col gap-4"
          style={{ border: '1px solid #EAEAEA' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: t.bg }}>
            <span className="material-symbols-outlined text-[22px]" style={{ color: t.color }}>{t.icon}</span>
          </div>
          <div>
            <p className="font-black text-sm mb-1" style={{ color: '#111827' }}>{t.title}</p>
            <p className="text-[12px]" style={{ color: '#6B7280' }}>{t.desc}</p>
          </div>
          <button disabled={t.disabled}
            className="mt-auto px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all hover:opacity-85 disabled:opacity-40"
            style={{ background: t.disabled ? '#F3F4F6' : t.color, color: t.disabled ? '#9CA3AF' : '#fff' }}>
            {t.cta}
          </button>
        </div>
      ))}
    </div>
  )
}

/* ─────────────── Page principale ─────────────── */

export default function EspaceVendeur() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [shopData, setShopData] = useState(null)
  const [shopLoading, setShopLoading] = useState(true)
  const [noShop, setNoShop] = useState(false)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })

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
      .catch(() => setNoShop(true))
      .finally(() => setShopLoading(false))
  }, [status, session, router])

  const nav = [
    { id: 'dashboard',  icon: 'dashboard',   label: 'Tableau de bord' },
    { id: 'inventory',  icon: 'inventory_2', label: 'Inventaire & Stock' },
    { id: 'orders',     icon: 'package_2',   label: 'Commandes' },
    { id: 'analytics',  icon: 'bar_chart',   label: 'Analyses' },
    { id: 'reviews',    icon: 'star',        label: 'Avis clients', badge: '3' },
    { id: 'marketing',  icon: 'campaign',    label: 'Marketing' },
    { id: 'settings',   icon: 'settings',    label: 'Paramètres boutique' },
  ]

  /* ── Loading ── */
  if (status === 'loading' || shopLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="w-12 h-12 rounded-full border-4 border-t-[#1B6B3A] border-[#E6F8EA] animate-spin" />
      </div>
    )
  }

  /* ── Pas de boutique → wizard ── */
  if (noShop) {
    return <CreateShopWizard token={session?.user?.apiToken} onCreated={(s) => { setShopData(s); setNoShop(false) }} />
  }

  /* ── Dashboard ── */
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)', background: '#F3F4F6' }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #1B6B3A 0%, #0D4A28 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '68px',
        height: 'calc(100vh - 68px)',
        overflowY: 'auto',
      }}>
        {/* Logo boutique */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.25)', position: 'relative' }}>
              <Image
                src={shopData?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(shopData?.name || 'B')}&background=D4920A&color=fff&size=200`}
                alt="Logo" fill className="object-cover" sizes="44px" unoptimized
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {shopData?.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2 }}>
                📍 {shopData?.location || 'Bénin'}
              </p>
            </div>
          </div>
          {shopData?.slug && (
            <Link href={`/boutiques/${shopData.slug}`} target="_blank"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              Voir ma boutique
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(item => (
            <NavItem key={item.id} active={activeTab === item.id}
              icon={item.icon} label={item.label} badge={item.badge}
              onClick={() => setActiveTab(item.id)} />
          ))}
        </nav>

        {/* Retour accueil */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>home</span>
            Retour à l&apos;accueil
          </Link>
        </div>
      </aside>

      {/* ══ CONTENU ══ */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Header page */}
        <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: '68px', zIndex: 10 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Espace Vendeur</p>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: '#111827', marginTop: 2 }}>
              {nav.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <button onClick={() => setActiveTab('inventory')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[12px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#D4920A' }}>
            <span className="material-symbols-outlined text-[16px]">add</span>
            Ajouter un produit
          </button>
        </div>

        {/* Contenu onglet */}
        <div style={{ padding: '28px', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && <DashboardHome shopData={shopData} stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === 'inventory' && <InventoryTab token={session?.user?.apiToken} />}
          {activeTab === 'orders'    && <OrdersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'reviews'   && <ReviewsTab />}
          {activeTab === 'marketing' && <MarketingTab />}
          {activeTab === 'settings'  && (
            <SettingsTab shop={shopData} token={session?.user?.apiToken} onUpdated={s => setShopData(s)} />
          )}
        </div>
      </div>
    </div>
  )
}
