'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import InventoryTab from '@/components/vendeur/InventoryTab'
import ReviewsTab from '@/components/vendeur/ReviewsTab'
import SettingsTab from '@/components/vendeur/SettingsTab'
import CreateShopWizard from '@/components/vendeur/CreateShopWizard'
import { getVendorDashboard } from '@/lib/api'

export default function EspaceVendeur() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('Tableau de bord')
  const [shopData, setShopData] = useState(null)
  const [shopLoading, setShopLoading] = useState(true)
  const [noShop, setNoShop] = useState(false)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }
    if (status !== 'authenticated' || !session?.user) return

    setShopLoading(true)
    getVendorDashboard(session.user.apiToken)
      .then(data => {
        if (data.shop) {
          setShopData(data.shop)
          setNoShop(false)
        } else {
          setNoShop(true)
        }
        if (data.stats) setStats(data.stats)
      })
      .catch((err) => {
        // 404 = pas de boutique créée
        if (err.message?.includes('404') || err.message?.includes('shop')) {
          setNoShop(true)
        }
      })
      .finally(() => setShopLoading(false))
  }, [status, session, router])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/connexion')
  }

  const userName = session?.user?.name || ''

  const navItems = [
    { name: 'Tableau de bord', icon: 'dashboard' },
    { name: 'Inventaire & Stock', icon: 'inventory_2' },
    { name: 'Analyses des ventes', icon: 'bar_chart' },
    { name: 'Avis clients', icon: 'forum', badge: '+12' },
    { name: 'Outils marketing', icon: 'campaign' },
    { name: 'Paramètres boutique', icon: 'settings' },
  ]

  const metrics = [
    { title: 'Revenus totaux', value: stats.revenue ? `${(stats.revenue/1000000).toFixed(1)}M` : '0', suffix: ' FCFA', badge: '+12.4%', icon: 'analytics', iconColor: '#1B6B3A', iBg: '#E6F8EA', badgeColor: '#1B6B3A', badgeBg: '#E6F8EA' },
    { title: 'Note moyenne', value: '4.9', suffix: '/ 5.0', badge: 'Top 1%', icon: 'star', iconColor: '#D4920A', iBg: '#FEF3C7', badgeColor: '#D4920A', badgeBg: '#FEF3C7' },
    { title: 'Produits actifs', value: String(stats.products || 0), suffix: ' articles', badge: '', icon: 'inventory_2', iconColor: '#7C3AED', iBg: '#EDE9FE', badgeColor: '#7C3AED', badgeBg: '#EDE9FE' },
    { title: 'Taux de réponse', value: '99%', suffix: '', badge: '< 10 min', icon: 'chat', iconColor: '#DB2777', iBg: '#FCE7F3', badgeColor: '#DB2777', badgeBg: '#FCE7F3' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans" style={{ background: '#F7F5F0' }}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* === Pas encore de boutique → Wizard création === */}
        {!shopLoading && noShop && (
          <CreateShopWizard
            token={session?.user?.apiToken}
            onCreated={(shop) => { setShopData(shop); setNoShop(false) }}
          />
        )}

        {shopLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!shopLoading && !noShop && (
          <>
        {/* Header Vendeur premium */}
        <div className="relative overflow-hidden rounded-[32px] mb-8 p-8"
          style={{ background: 'linear-gradient(160deg, #1B6B3A 0%, #0D4A28 100%)' }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zm0 60L15 30h30L30 60z' fill='white' fill-opacity='1'/%3E%3C/svg%3E")` }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 rounded-[20px] overflow-hidden" style={{ border: '3px solid rgba(255,255,255,0.3)' }}>
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(shopData?.name || userName || 'B')}&background=D4920A&color=fff&size=200`}
                  alt="Avatar boutique" fill className="object-cover" sizes="64px"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-black text-white">{shopData?.name || userName || 'Ma Boutique'}</h1>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase"
                    style={{ background: 'rgba(212,146,10,0.25)', color: '#FDE68A', border: '1px solid rgba(212,146,10,0.4)' }}>
                    <span className="material-symbols-outlined text-[11px]">verified</span>
                    {shopData?.status === 'active' ? 'Vérifié' : 'En attente'}
                  </span>
                </div>
                <p className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {shopData?.location || 'Bénin'} · {userName}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActiveTab('Paramètres boutique')} className="px-5 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
                Modifier le profil
              </button>
              <button onClick={() => setActiveTab('Inventaire & Stock')} className="px-5 py-2.5 rounded-2xl font-black text-[12px] uppercase tracking-wider flex items-center gap-2 transition-all hover:opacity-90"
                style={{ background: '#D4920A', color: 'white' }}>
                <span className="material-symbols-outlined text-[16px]">add</span>
                Nouveau produit
              </button>
            </div>
          </div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white rounded-[24px] p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ border: '1px solid #EBEBEB', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex justify-between items-start mb-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: m.iBg }}>
                  <span className="material-symbols-outlined text-[22px]" style={{ color: m.iconColor }}>{m.icon}</span>
                </div>
                {m.badge && (
                  <span className="text-[9px] font-black px-2 py-1 rounded-full" style={{ background: m.badgeBg, color: m.badgeColor }}>
                    {m.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-1" style={{ color: '#9CA3AF' }}>{m.title}</p>
              <h3 className="text-2xl font-black" style={{ color: '#0D0D0D' }}>
                {m.value}<span className="text-sm font-medium ml-1" style={{ color: '#9CA3AF' }}>{m.suffix}</span>
              </h3>
            </div>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main Content (Left) */}
          <div className="flex-1 flex flex-col gap-6">

            {activeTab === 'Tableau de bord' && (
              <>
                {/* Performances des ventes */}
                <div className="bg-white rounded-[28px] p-7" style={{ border: '1px solid #EBEBEB' }}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-black text-[16px] mb-1" style={{ color: '#0D0D0D' }}>Performances des ventes</h3>
                      <p className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>Suivi de la croissance sur 7 jours</p>
                    </div>
                    <div className="flex rounded-full p-1 gap-1" style={{ background: '#F3F4F6' }}>
                      {['7J', '30J', '1A'].map(p => (
                        <button key={p} className="px-4 py-1.5 text-[10px] font-black rounded-full transition-all"
                          style={p === '7J' ? { background: '#1B6B3A', color: 'white' } : { color: '#9CA3AF' }}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[200px] w-full relative">
                    <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1B6B3A" stopOpacity="0.15"/>
                          <stop offset="100%" stopColor="#1B6B3A" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,100 C50,80 150,130 250,60 C320,10 400,90 500,40 L500,150 L0,150 Z" fill="url(#chartGrad)" />
                      <path d="M0,100 C50,80 150,130 250,60 C320,10 400,90 500,40" fill="none" stroke="#1B6B3A" strokeWidth="3"/>
                      {[[250,60],[500,40]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="5" fill="#1B6B3A" stroke="white" strokeWidth="2"/>)}
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold px-2 pt-4 border-t border-gray-100 mt-2" style={{ color: '#9CA3AF' }}>
                    {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(j => <span key={j}>{j}</span>)}
                  </div>
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold" style={{ color: '#9CA3AF' }}>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1B6B3A]"></div>Ventes nettes
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold" style={{ color: '#9CA3AF' }}>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>Ventes brutes
                    </div>
                  </div>
                </div>

                {/* Performance & Reputation */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 px-1 text-sm">Performance & Reputation</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-white text-green-600 shadow-sm flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-lg">workspace_premium</span>
                      </div>
                      <p className="text-xs font-bold text-green-900 mb-1">Top Seller</p>
                      <p className="text-[9px] text-green-600 font-medium">Ranked top 10% this month</p>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-white text-blue-600 shadow-sm flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-lg">bolt</span>
                      </div>
                      <p className="text-xs font-bold text-blue-900 mb-1">Fast Shipper</p>
                      <p className="text-[9px] text-blue-600 font-medium">Ships within 24 hours</p>
                    </div>
                    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-white text-orange-600 shadow-sm flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-lg">thumb_up</span>
                      </div>
                      <p className="text-xs font-bold text-orange-900 mb-1">Fan Favorite</p>
                      <p className="text-[9px] text-orange-600 font-medium">98% 5-star reviews</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center opacity-80">
                      <div className="w-10 h-10 rounded-full bg-white text-gray-400 shadow-sm flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-lg">eco</span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 mb-1">Eco-Artisan</p>
                      <p className="text-[9px] text-gray-400 font-medium">Not yet achieved</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-3xl p-6 shadow-sm mt-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-base">Recent Orders</h3>
                    <button onClick={() => setActiveTab('Commandes')} className="text-[9px] font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-colors px-4 py-2 rounded-full uppercase tracking-wider">
                      View All Orders
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-gray-100 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                          <th className="pb-4 w-5/12">Product</th>
                          <th className="pb-4 w-2/12">Order ID</th>
                          <th className="pb-4 w-2/12">Date</th>
                          <th className="pb-4 w-2/12">Amount</th>
                          <th className="pb-4 w-1/12 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {/* Row 1 */}
                        <tr>
                          <td className="py-4 border-b border-gray-50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-100">
                              <Image
                                src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=200"
                                alt="Queen Mother Bronze Bust"
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <span className="font-bold text-xs text-gray-800">Queen Mother Bronze Bust</span>
                          </td>
                          <td className="py-4 border-b border-gray-50 text-[11px] font-medium text-gray-500">MK-0091</td>
                          <td className="py-4 border-b border-gray-50 text-[11px] font-medium text-gray-500">Oct 24, 14:20</td>
                          <td className="py-4 border-b border-gray-50 font-bold text-xs text-green-700">45,000 CFA</td>
                          <td className="py-4 border-b border-gray-50 text-right">
                            <span className="bg-orange-50 text-orange-600 text-[9px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">Processing</span>
                          </td>
                        </tr>
                        {/* Row 2 */}
                        <tr>
                          <td className="py-4 border-b border-gray-50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-900 object-cover flex-shrink-0" />
                            <span className="font-bold text-xs text-gray-800">Indigo Ceremonial Wrap</span>
                          </td>
                          <td className="py-4 border-b border-gray-50 text-[11px] font-medium text-gray-500">MK-0182</td>
                          <td className="py-4 border-b border-gray-50 text-[11px] font-medium text-gray-500">Oct 24, 11:45</td>
                          <td className="py-4 border-b border-gray-50 font-bold text-xs text-green-700">12,500 CFA</td>
                          <td className="py-4 border-b border-gray-50 text-right">
                            <span className="bg-green-50 text-green-600 text-[9px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">Shipped</span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr>
                          <td className="py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-gray-400 text-xl">shopping_bag</span>
                            </div>
                            <span className="font-bold text-xs text-gray-800">Ouidah Python Tote</span>
                          </td>
                          <td className="py-4 text-[11px] font-medium text-gray-500">MK-0185</td>
                          <td className="py-4 text-[11px] font-medium text-gray-500">Oct 23, 16:10</td>
                          <td className="py-4 font-bold text-xs text-green-700">85,000 CFA</td>
                          <td className="py-4 text-right">
                            <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wide">Delivered</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Best Selling Crafts */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-5 px-1">
                    <h3 className="font-bold text-gray-900 text-sm">Best Selling Crafts</h3>
                    <div className="flex gap-1 bg-white p-1 rounded-lg">
                      <button className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-gray-400 hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">grid_view</span>
                      </button>
                      <button className="w-8 h-8 bg-[#1B6B3A] flex items-center justify-center rounded-md text-white shadow-sm">
                        <span className="material-symbols-outlined text-[18px] transform rotate-90">format_list_bulleted</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Product 1 */}
                    <div className="bg-white rounded-[24px] p-4 shadow-sm flex flex-col group">
                      <div className="relative rounded-[16px] overflow-hidden bg-gray-100 mb-4 aspect-[4/3]">
                        <Image
                          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600"
                          alt="Ouidah Python-Print Tote"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className="absolute top-3 left-3 bg-[#1B6B3A] text-white text-[8px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">Bestseller</span>
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-xs text-gray-900 leading-tight">Ouidah Python-Print Tote</h4>
                        <span className="text-[11px] font-bold text-green-700 shrink-0">85k CFA</span>
                      </div>
                      <div className="flex gap-4 text-[10px] text-gray-500 mb-6 font-medium">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-gray-400">shopping_cart</span>142 Sold</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-gray-400">inventory_2</span>12 Stock</span>
                      </div>
                      <div className="flex gap-2 w-full mt-auto">
                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-colors border border-gray-100">Edit Listing</button>
                        <button className="w-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors border border-gray-100"><span className="material-symbols-outlined text-sm">more_horiz</span></button>
                      </div>
                    </div>

                    {/* Product 2 */}
                    <div className="bg-white rounded-[24px] p-4 shadow-sm flex flex-col group">
                      <div className="relative rounded-[16px] overflow-hidden bg-[#1A1A1A] mb-4 aspect-[4/3]">
                        <Image
                          src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600"
                          alt="Fon Dynasty Bronze Mask"
                          fill
                          className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className="absolute top-3 left-3 bg-[#EA580C] text-white text-[8px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">High Margin</span>
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-xs text-gray-900 leading-tight pr-2">Fon Dynasty Bronze Mask</h4>
                        <span className="text-[11px] font-bold text-green-700 shrink-0">120k CFA</span>
                      </div>
                      <div className="flex gap-4 text-[10px] text-gray-500 mb-6 font-medium">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-gray-400">shopping_cart</span>88 Sold</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-gray-400">inventory_2</span>2 Stock</span>
                      </div>
                      <div className="flex gap-2 w-full mt-auto">
                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-colors border border-gray-100">Edit Listing</button>
                        <button className="w-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors border border-gray-100"><span className="material-symbols-outlined text-sm">more_horiz</span></button>
                      </div>
                    </div>

                    {/* Add New Craft Blank Card */}
                    <div onClick={() => setActiveTab('Inventaire & Stock')} className="border-2 border-dashed border-gray-200 rounded-[24px] p-6 flex flex-col items-center justify-center text-center bg-transparent hover:bg-gray-50/50 transition-colors cursor-pointer min-h-[300px]">
                      <div className="w-12 h-12 rounded-full bg-gray-200/50 flex items-center justify-center text-gray-500 mb-4 transition-transform hover:scale-110">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-800 mb-2">Add New Craft</h4>
                      <p className="text-[10px] text-gray-400 max-w-[160px] leading-relaxed">List a new product to your showcase and reach global buyers.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Inventaire & Stock' && <InventoryTab token={session?.user?.apiToken} />}
            {activeTab === 'Avis clients' && <ReviewsTab />}
            {activeTab === 'Paramètres boutique' && <SettingsTab shop={shopData} token={session?.user?.apiToken} onUpdated={(s) => setShopData(s)} />}
            {activeTab === 'Analyses des ventes' && (
              <div className="bg-white rounded-[28px] p-8 flex items-center justify-center min-h-[400px]" style={{ border: '1px solid #EBEBEB' }}>
                <div className="text-center">
                  <span className="material-symbols-outlined text-[48px] mb-4 block" style={{ color: '#E6F8EA' }}>bar_chart</span>
                  <p className="font-black text-[14px]" style={{ color: '#9CA3AF' }}>Analyses des ventes — Bientôt disponible</p>
                </div>
              </div>
            )}
            {activeTab === 'Outils marketing' && (
              <div className="bg-white rounded-[28px] p-8 flex items-center justify-center min-h-[400px]" style={{ border: '1px solid #EBEBEB' }}>
                <div className="text-center">
                  <span className="material-symbols-outlined text-[48px] mb-4 block" style={{ color: '#E6F8EA' }}>campaign</span>
                  <p className="font-black text-[14px]" style={{ color: '#9CA3AF' }}>Outils marketing — Bientôt disponible</p>
                </div>
              </div>
            )}
            {activeTab === 'Commandes' && (
              <div className="bg-white rounded-[28px] p-8 flex items-center justify-center min-h-[400px]" style={{ border: '1px solid #EBEBEB' }}>
                <div className="text-center">
                  <span className="material-symbols-outlined text-[48px] mb-4 block" style={{ color: '#E6F8EA' }}>package_2</span>
                  <p className="font-black text-[14px]" style={{ color: '#9CA3AF' }}>Mes Commandes — Bientôt disponible</p>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col gap-6">

            {/* Marketplace Balance */}
            <div className="bg-[#1B6B3A] rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
              {/* Decorative faint icon in bg */}
              <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] opacity-5 pointer-events-none">account_balance</span>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-[9px] font-bold text-green-200/80 tracking-widest mb-1.5 uppercase">Marketplace Balance</p>
                  <h3 className="text-[34px] font-extrabold flex items-baseline gap-1.5 tracking-tight">
                    452,300 <span className="text-sm font-medium text-green-200 mb-1">CFA</span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/5">
                  <span className="material-symbols-outlined text-white text-[20px]">account_balance_wallet</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <div>
                  <div className="flex justify-between text-[9px] font-bold mb-2 uppercase text-green-100/90 tracking-wider">
                    <span>Available for payout</span>
                    <span className="text-white">387,300 CFA</span>
                  </div>
                  <div className="w-full bg-[#052e18] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#22c55e] h-full rounded-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[9px] font-bold mb-2 uppercase text-green-100/90 tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></div>
                    <span>Pending settlement</span>
                    <span className="ml-auto text-white">65,000 CFA</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#EAB308] hover:bg-[#dca506] text-gray-900 font-extrabold text-[13px] py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                Withdraw Funds
              </button>
            </div>

            {/* Linked Accounts */}
            <div className="bg-white rounded-3xl p-7 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-sm">Linked Accounts</h3>
                <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-gray-500 text-[18px]">settings</span>
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {/* MoMo */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center font-extrabold text-[11px] text-[#003366] shadow-sm">MTN</div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">MTN MoMo</p>
                    <p className="text-[10px] text-gray-500 font-medium">**** 8291 • Active</p>
                  </div>
                </div>
                {/* Moov */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0066CC] flex items-center justify-center font-extrabold text-[11px] text-white shadow-sm">Moov</div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Moov Money</p>
                    <p className="text-[10px] text-gray-500 font-medium">**** 4032 • Primary</p>
                  </div>
                </div>

                <button className="mt-2 w-full border border-gray-200 text-[#1B6B3A] font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors border-dashed">
                  <span className="material-symbols-outlined text-[16px]">add</span> Add New Method
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-1 hidden md:flex">
              {navItems.map((item, i) => {
                const isActive = activeTab === item.name
                return (
                  <button
                    key={i}
                    onClick={() => setActiveTab(item.name)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${isActive
                        ? 'bg-[#1B6B3A] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <div className="flex items-center gap-4 font-bold text-xs">
                      <span className={`material-symbols-outlined text-xl ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    {!isActive && item.badge && (
                      <span className="bg-green-50 text-green-700 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

          </div>
        </div>
      </>
      )}
      </div>
    </div>
  )
}
