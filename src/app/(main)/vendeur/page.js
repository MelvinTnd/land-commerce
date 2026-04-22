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

// ─── Sous-composants internes ────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color, bg, trend }) {
  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-lg transition-all"
      style={{ border: '1px solid #F0F0F0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
          <span className="material-symbols-outlined text-[24px]" style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: bg, color }}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-1" style={{ color: '#9CA3AF' }}>{label}</p>
        <p className="text-2xl font-black" style={{ color: '#111827' }}>{value}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</p>}
      </div>
    </div>
  )
}

function TabBtn({ active, icon, label, badge, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all"
      style={active
        ? { background: 'rgba(255,255,255,0.15)', color: 'white' }
        : { background: 'transparent', color: 'rgba(255,255,255,0.55)' }}>
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
          style={{ background: '#D4920A', color: 'white' }}>{badge}</span>
      )}
      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </button>
  )
}

function OrdersTab() {
  return (
    <div className="bg-white rounded-3xl p-8" style={{ border: '1px solid #F0F0F0' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#E6F8EA' }}>
          <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>package_2</span>
        </div>
        <div>
          <h3 className="font-black text-lg" style={{ color: '#111827' }}>Commandes reçues</h3>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>0 commandes en attente</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined text-[64px] mb-4" style={{ color: '#E5E7EB' }}>package_2</span>
        <p className="font-black text-base mb-2" style={{ color: '#374151' }}>Aucune commande pour l'instant</p>
        <p className="text-sm max-w-xs" style={{ color: '#9CA3AF' }}>
          Quand des clients achèteront vos produits, leurs commandes apparaîtront ici.
        </p>
      </div>
    </div>
  )
}

function AnalyticsTab({ stats }) {
  const data = [40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 88, 95]
  const maxVal = Math.max(...data)
  const months = ['Jan','Fév','Mar','Avr','Mai','Juin','Jul','Aoû','Sep','Oct','Nov','Déc']

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl p-8" style={{ border: '1px solid #F0F0F0' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-lg" style={{ color: '#111827' }}>Performances des ventes</h3>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Évolution sur 12 mois</p>
          </div>
        </div>
        {/* Graphique en barres */}
        <div className="flex items-end gap-2 h-48">
          {data.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg transition-all hover:opacity-80"
                style={{
                  height: `${(v / maxVal) * 160}px`,
                  background: i === data.length - 1
                    ? 'linear-gradient(180deg, #1B6B3A, #0D4A28)'
                    : 'linear-gradient(180deg, #E6F8EA, #BBF7D0)',
                }} />
              <span className="text-[9px] font-bold" style={{ color: '#9CA3AF' }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition par catégorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6" style={{ border: '1px solid #F0F0F0' }}>
          <h4 className="font-black text-sm mb-4" style={{ color: '#111827' }}>Indicateurs clés</h4>
          {[
            { label: 'Taux de conversion', val: '3.2%', icon: 'trending_up', color: '#1B6B3A' },
            { label: 'Panier moyen', val: '24 500 CFA', icon: 'shopping_cart', color: '#D4920A' },
            { label: 'Taux de retour', val: '0.8%', icon: 'undo', color: '#7C3AED' },
            { label: 'Satisfaction client', val: '4.9/5', icon: 'star', color: '#DB2777' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3"
              style={{ borderBottom: i < 3 ? '1px solid #F9F9F9' : 'none' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]" style={{ color: item.color }}>{item.icon}</span>
                <span className="text-[13px] font-semibold" style={{ color: '#4B5563' }}>{item.label}</span>
              </div>
              <span className="font-black text-[13px]" style={{ color: '#111827' }}>{item.val}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl p-6" style={{ border: '1px solid #F0F0F0' }}>
          <h4 className="font-black text-sm mb-4" style={{ color: '#111827' }}>Produits les plus vus</h4>
          <div className="flex flex-col gap-3">
            {[
              { name: 'Masque Gèlèdè', views: 842, bar: 90 },
              { name: 'Statue Royale', views: 631, bar: 67 },
              { name: 'Tabouret Nago', views: 412, bar: 44 },
              { name: 'Porte Miniature', views: 289, bar: 31 },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="font-semibold" style={{ color: '#374151' }}>{p.name}</span>
                  <span className="font-black" style={{ color: '#1B6B3A' }}>{p.views} vues</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: '#F3F4F6' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${p.bar}%`, background: '#1B6B3A' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewsTab() {
  const avis = [
    { nom: 'Ama K.', note: 5, date: 'Il y a 2 jours', msg: 'Superbe qualité, livraison rapide ! Je recommande vivement cet artisan.', produit: 'Masque Gèlèdè' },
    { nom: 'Boris T.', note: 5, date: 'Il y a 5 jours', msg: 'Travail remarquable, pièce vraiment authentique et bien emballée.', produit: 'Statue Royale' },
    { nom: 'Fatouma D.', note: 4, date: 'Il y a 1 semaine', msg: 'Très beau produit mais la livraison a pris un peu de temps.', produit: 'Tabouret Nago' },
  ]
  return (
    <div className="bg-white rounded-3xl p-8" style={{ border: '1px solid #F0F0F0' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-lg" style={{ color: '#111827' }}>Avis clients</h3>
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{avis.length} avis récents</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ background: '#FEF3C7' }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: '#D4920A' }}>star</span>
          <span className="font-black" style={{ color: '#D4920A' }}>4.9 / 5</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {avis.map((a, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ background: '#F9F9F9', border: '1px solid #F0F0F0' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white"
                  style={{ background: '#1B6B3A' }}>
                  {a.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-sm" style={{ color: '#111827' }}>{a.nom}</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{a.date} · {a.produit}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="material-symbols-outlined text-[14px]"
                    style={{ color: s <= a.note ? '#D4920A' : '#E5E7EB' }}>star</span>
                ))}
              </div>
            </div>
            <p className="text-sm" style={{ color: '#4B5563' }}>{a.msg}</p>
            <button className="mt-2 text-[11px] font-bold" style={{ color: '#1B6B3A' }}>
              Répondre →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketingTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl p-8" style={{ border: '1px solid #F0F0F0' }}>
        <h3 className="font-black text-lg mb-6" style={{ color: '#111827' }}>Outils Marketing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: 'campaign', title: 'Créer une promotion', desc: 'Définissez des réductions temporaires sur vos produits pour booster les ventes.', color: '#1B6B3A', bg: '#E6F8EA', cta: 'Créer une promo' },
            { icon: 'share', title: 'Partager ma boutique', desc: 'Générez un lien de partage pour vos réseaux sociaux et messageries.', color: '#D4920A', bg: '#FEF3C7', cta: 'Copier le lien' },
            { icon: 'qr_code', title: 'QR Code boutique', desc: "Téléchargez votre QR Code pour vos flyers, cartes de visite et emballages.", color: '#7C3AED', bg: '#EDE9FE', cta: 'Télécharger' },
            { icon: 'star', title: 'Programme fidélité', desc: 'Récompensez vos clients réguliers avec des points de fidélité BéninMarket.', color: '#DB2777', bg: '#FCE7F3', cta: 'Bientôt disponible', disabled: true },
          ].map((tool, i) => (
            <div key={i} className="p-5 rounded-2xl flex flex-col gap-3"
              style={{ background: '#F9F9F9', border: '1px solid #F0F0F0' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tool.bg }}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: tool.color }}>{tool.icon}</span>
              </div>
              <div>
                <p className="font-black text-sm mb-1" style={{ color: '#111827' }}>{tool.title}</p>
                <p className="text-[12px]" style={{ color: '#6B7280' }}>{tool.desc}</p>
              </div>
              <button
                disabled={tool.disabled}
                className="mt-auto px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: tool.disabled ? '#F3F4F6' : tool.color, color: tool.disabled ? '#9CA3AF' : 'white' }}>
                {tool.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tableau de bord principal ───────────────────────────────────────────────

export default function EspaceVendeur() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [shopData, setShopData] = useState(null)
  const [shopLoading, setShopLoading] = useState(true)
  const [noShop, setNoShop] = useState(false)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const userName = session?.user?.name || 'Vendeur'

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

  const navItems = [
    { id: 'dashboard',    icon: 'dashboard',     label: 'Tableau de bord' },
    { id: 'inventory',    icon: 'inventory_2',   label: 'Inventaire & Stock' },
    { id: 'orders',       icon: 'package_2',     label: 'Commandes' },
    { id: 'analytics',   icon: 'bar_chart',     label: 'Analyses des ventes' },
    { id: 'reviews',     icon: 'star',          label: 'Avis clients', badge: '3' },
    { id: 'marketing',   icon: 'campaign',      label: 'Marketing' },
    { id: 'settings',    icon: 'settings',      label: 'Paramètres boutique' },
  ]

  const metricCards = [
    { icon: 'payments',    label: 'Revenus totaux',  value: stats.revenue ? `${(stats.revenue/1000).toFixed(0)}K` : '0', sub: 'FCFA ce mois',    color: '#1B6B3A', bg: '#E6F8EA', trend: '+12.4%' },
    { icon: 'inventory_2', label: 'Produits actifs',  value: String(stats.products || 0),               sub: 'articles en ligne',  color: '#7C3AED', bg: '#EDE9FE' },
    { icon: 'package_2',   label: 'Commandes',       value: String(stats.orders || 0),                  sub: 'total reçues',       color: '#D4920A', bg: '#FEF3C7' },
    { icon: 'star',        label: 'Note moyenne',    value: '4.9',                                       sub: '/ 5 — Top 1%',      color: '#DB2777', bg: '#FCE7F3', trend: '🏆 Top' },
  ]

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading' || shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F4F0' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#1B6B3A] border-[#E6F8EA] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold" style={{ color: '#6B7280' }}>Chargement de votre espace vendeur...</p>
        </div>
      </div>
    )
  }

  // ─── Wizard création boutique ────────────────────────────────────────────────
  if (noShop) {
    return (
      <div className="min-h-screen pt-20" style={{ background: '#F0F4F0' }}>
        <CreateShopWizard
          token={session?.user?.apiToken}
          onCreated={(shop) => { setShopData(shop); setNoShop(false) }}
        />
      </div>
    )
  }

  // ─── Dashboard principal ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans flex" style={{ background: '#F0F4F0', paddingTop: '64px' }}>

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 min-h-[calc(100vh-64px)] sticky top-16"
        style={{ background: 'linear-gradient(180deg, #1B6B3A 0%, #0D4A28 100%)' }}>

        {/* Profil boutique */}
        <div className="p-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 relative"
              style={{ border: '2px solid rgba(255,255,255,0.25)' }}>
              <Image
                src={shopData?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(shopData?.name || 'B')}&background=D4920A&color=fff&size=200`}
                alt="Logo boutique" fill className="object-cover" sizes="56px"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-white text-[15px] truncate">{shopData?.name || 'Ma Boutique'}</h2>
              <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>
                📍 {shopData?.location || 'Bénin'} · {userName}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-black"
                style={{ background: shopData?.status === 'active' ? 'rgba(212,146,10,0.3)' : 'rgba(255,255,255,0.15)', color: '#FDE68A' }}>
                <span className="material-symbols-outlined text-[10px]">
                  {shopData?.status === 'active' ? 'verified' : 'pending'}
                </span>
                {shopData?.status === 'active' ? 'Boutique vérifiée' : 'En attente'}
              </span>
            </div>
          </div>

          {/* Lien vers ma boutique */}
          {shopData?.slug && (
            <Link href={`/boutiques/${shopData.slug}`} target="_blank"
              className="flex items-center gap-2 w-full py-2 px-3 rounded-xl text-[11px] font-bold transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              Voir ma boutique publique
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(item => (
            <TabBtn
              key={item.id}
              active={activeTab === item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-semibold transition-all hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="material-symbols-outlined text-[18px]">home</span>
            Retour à l&apos;accueil
          </Link>
        </div>
      </aside>

      {/* ══════════════════ CONTENU PRINCIPAL ══════════════════ */}
      <main className="flex-1 overflow-x-hidden">

        {/* ─── Header Mobile + Breadcrumb ─────────────────────── */}
        <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
              Espace Vendeur
            </p>
            <h1 className="font-black text-lg" style={{ color: '#111827' }}>
              {navItems.find(n => n.id === activeTab)?.label || 'Tableau de bord'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('inventory')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[12px] text-white transition-all hover:opacity-90"
              style={{ background: '#D4920A' }}>
              <span className="material-symbols-outlined text-[16px]">add</span>
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* ─── Contenu des onglets ─────────────────────────────── */}
        <div className="p-6 lg:p-8">

          {/* === TABLEAU DE BORD === */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">

              {/* Message de bienvenue */}
              <div className="relative overflow-hidden rounded-3xl p-6"
                style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #0D4A28 60%, #D4920A 100%)' }}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zm0 60L15 30h30L30 60z' fill='white'/%3E%3C/svg%3E\")" }} />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Mercredi, 23 Avril 2026
                    </p>
                    <h2 className="text-2xl font-black text-white mb-1">
                      Bonjour, {userName.split(' ')[0]} 👋
                    </h2>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Votre boutique <strong>{shopData?.name}</strong> est{' '}
                      {shopData?.status === 'active' ? 'active et visible' : 'en cours de validation'}.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab('inventory')}
                      className="px-4 py-2.5 rounded-2xl font-black text-[12px] transition-all hover:opacity-90"
                      style={{ background: '#D4920A', color: 'white' }}>
                      + Ajouter un produit
                    </button>
                    <button onClick={() => setActiveTab('settings')}
                      className="px-4 py-2.5 rounded-2xl font-black text-[12px] transition-all hover:opacity-80"
                      style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                      Paramètres
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metricCards.map((m, i) => (
                  <StatCard key={i} {...m} />
                ))}
              </div>

              {/* Activité récente + Conseils */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Activité */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6" style={{ border: '1px solid #F0F0F0' }}>
                  <h3 className="font-black text-base mb-5" style={{ color: '#111827' }}>Activité récente</h3>
                  <div className="flex flex-col gap-0">
                    {[
                      { icon: 'star', color: '#D4920A', bg: '#FEF3C7', msg: 'Nouvel avis 5 étoiles sur « Masque Gèlèdè »', time: 'Il y a 2h' },
                      { icon: 'visibility', color: '#7C3AED', bg: '#EDE9FE', msg: 'Votre boutique a reçu 48 visites aujourd\'hui', time: 'Il y a 3h' },
                      { icon: 'inventory_2', color: '#1B6B3A', bg: '#E6F8EA', msg: 'Stock faible : Tabouret Nago (2 restants)', time: 'Il y a 1j' },
                      { icon: 'verified', color: '#1B6B3A', bg: '#E6F8EA', msg: 'Boutique vérifiée par l\'équipe BéninMarket', time: 'Il y a 3j' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 py-3.5"
                        style={{ borderBottom: i < 3 ? '1px solid #F9F9F9' : 'none' }}>
                        <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" style={{ background: item.bg }}>
                          <span className="material-symbols-outlined text-[18px]" style={{ color: item.color }}>{item.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold truncate" style={{ color: '#374151' }}>{item.msg}</p>
                          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conseils */}
                <div className="bg-white rounded-3xl p-6" style={{ border: '1px solid #F0F0F0' }}>
                  <h3 className="font-black text-base mb-5" style={{ color: '#111827' }}>💡 Conseils du jour</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { tip: 'Ajoutez des photos de qualité pour multiplier vos ventes par 3.', done: true },
                      { tip: 'Répondez aux avis rapidement pour améliorer votre note.', done: false },
                      { tip: 'Activez les promotions sur vos articles les moins vus.', done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: item.done ? '#1B6B3A' : '#F3F4F6' }}>
                          <span className="material-symbols-outlined text-[12px]"
                            style={{ color: item.done ? 'white' : '#9CA3AF' }}>
                            {item.done ? 'check' : 'radio_button_unchecked'}
                          </span>
                        </div>
                        <p className="text-[12px] font-medium leading-relaxed"
                          style={{ color: item.done ? '#9CA3AF' : '#374151', textDecoration: item.done ? 'line-through' : 'none' }}>
                          {item.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('marketing')}
                    className="mt-5 w-full py-2.5 rounded-xl text-[12px] font-black transition-all hover:opacity-90"
                    style={{ background: '#E6F8EA', color: '#1B6B3A' }}>
                    Voir les outils marketing →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === INVENTAIRE === */}
          {activeTab === 'inventory' && (
            <InventoryTab token={session?.user?.apiToken} />
          )}

          {/* === COMMANDES === */}
          {activeTab === 'orders' && <OrdersTab />}

          {/* === ANALYSES === */}
          {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}

          {/* === AVIS === */}
          {activeTab === 'reviews' && <ReviewsTab />}

          {/* === MARKETING === */}
          {activeTab === 'marketing' && <MarketingTab />}

          {/* === PARAMÈTRES === */}
          {activeTab === 'settings' && (
            <SettingsTab
              shop={shopData}
              token={session?.user?.apiToken}
              onUpdated={(s) => setShopData(s)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
