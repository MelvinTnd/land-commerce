'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import InventoryTab from '@/components/vendeur/InventoryTab'
import ReviewsTab from '@/components/vendeur/ReviewsTab'
import SettingsTab from '@/components/vendeur/SettingsTab'
import { getVendorDashboard, getUser, isAuthenticated, logout } from '@/lib/api'

export default function EspaceVendeur() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [shopData, setShopData] = useState(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/connexion')
      return
    }
    const user = getUser()
    if (user) setUserName(user.name)

    getVendorDashboard()
      .then(data => {
        if (data.shop) setShopData(data.shop)
        if (data.stats) setStats(data.stats)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    try { await logout() } catch {}
    router.push('/connexion')
  }

  const navItems = [
    { name: "Dashboard", icon: "dashboard" },
    { name: "Inventory & Stock", icon: "inventory_2" },
    { name: "Sales Analytics", icon: "bar_chart" },
    { name: "Customer Reviews", icon: "forum", badge: "+12" },
    { name: "Marketing Tools", icon: "campaign" },
    { name: "Store Settings", icon: "settings" }
  ]

  const metrics = [
    { title: "TOTAL REVENUE", value: stats.revenue ? `${(stats.revenue/1000000).toFixed(1)}M` : "0", suffix: " CFA", badge: "+12.4%", badgePos: true, icon: "analytics", iconColor: "text-green-600", iBg: "bg-green-100/50" },
    { title: "AVG. RATING", value: "4.9", suffix: "/ 5.0", badge: "Top 1%", badgePos: true, badgeBg: 'bg-orange-50 text-orange-600', icon: "star", iconColor: "text-orange-500", iBg: "bg-orange-100/50" },
    { title: "PRODUITS", value: String(stats.products), suffix: " actifs", badge: "", badgeBg: 'bg-blue-50 text-blue-600', icon: "inventory_2", iconColor: "text-blue-500", iBg: "bg-blue-100/50" },
    { title: "RESPONSE RATE", value: "99%", suffix: " speed", badge: "< 10 min", badgeBg: 'bg-purple-50 text-purple-600', icon: "chat", iconColor: "text-purple-500", iBg: "bg-purple-100/50" },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans" style={{ background: '#F5F5F3' }}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Top Profile Card */}
        <div className="bg-white rounded-3xl p-5 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div className="flex items-center gap-5">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2afMDoCl0cmLAnabdQvzASiobQIDKTOHjMNApDH87KmPjBzS_aicU6F06AckemvVfID8xB7JCB2oZmGUmEK0J1IzR4koyPOa9oMfT3ShMuNEUo3_YpuKqhrcLiAYayg_v5WvYUpnBCKIwCLyzE_wjTeQ-E8J9REMsow_PJ2Vt-fqHPkZV8pKrLK1FNNbrKwCHqmA3sxA5asR_V6XEbJFP-w8_l8183VSoaxqbmf0fBRORTIRkXaWjkgGAWbu73U6fUO4lDFOfNvw"
              alt="Atelier du Dahomey"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{shopData?.name || userName || 'Ma Boutique'}</h2>
                <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[12px]">verified</span> {shopData?.status === 'active' ? 'VERIFIED' : 'EN ATTENTE'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{shopData?.location || 'Artisan'} • {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-6 py-2.5 rounded-full transition-colors">Edit Profile</button>
            <button className="flex-1 md:flex-none bg-[#1B6B3A] hover:bg-[#08381d] text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span> New Product
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl ${m.iBg} ${m.iconColor} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-xl">{m.icon}</span>
                </div>
                {m.badge && (
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${m.badgeBg || 'bg-green-50 text-green-700'}`}>
                    {m.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">{m.title}</p>
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-baseline">
                {m.value}
                {m.suffix && <span className="text-xs font-semibold text-gray-400 ml-1">{m.suffix}</span>}
              </h3>
            </div>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main Content (Left) */}
          <div className="flex-1 flex flex-col gap-6">

            {activeTab === 'Dashboard' && (
              <>
                {/* Sales Performance */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base mb-1">Sales Performance</h3>
                      <p className="text-xs text-gray-500">Monitoring your shop's growth across the last 7 days</p>
                    </div>
                    <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100">
                      <button className="px-4 py-1.5 text-[10px] font-bold bg-white text-gray-900 shadow-sm rounded-full">7D</button>
                      <button className="px-4 py-1.5 text-[10px] font-bold text-gray-500 hover:text-gray-700 rounded-full transition-colors">30D</button>
                      <button className="px-4 py-1.5 text-[10px] font-bold text-gray-500 hover:text-gray-700 rounded-full transition-colors">1Y</button>
                    </div>
                  </div>
                  {/* Chart Mock */}
                  <div className="h-[200px] w-full relative flex flex-col justify-end">
                    <div className="absolute inset-x-0 bottom-6 top-0 flex items-center justify-center pointer-events-none">
                      <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path d="M0,100 C50,80 150,130 250,60 C320,10 400,90 500,40 L500,150 L0,150 Z" fill="rgba(11, 74, 40, 0.05)" />
                        <path d="M0,100 C50,80 150,130 250,60 C320,10 400,90 500,40" fill="none" stroke="#1B6B3A" strokeWidth="3" />
                        <circle cx="250" cy="60" r="4" fill="#1B6B3A" stroke="white" strokeWidth="2" />
                        <circle cx="500" cy="40" r="4" fill="#1B6B3A" stroke="white" strokeWidth="2" />
                      </svg>
                    </div>
                    {/* Axes */}
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium px-4 border-t border-gray-100 pt-3 relative z-10 w-full mb-2">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1B6B3A]"></div>Net Sales
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>Gross Sales
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
                    <button className="text-[9px] font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-colors px-4 py-2 rounded-full uppercase tracking-wider">
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
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArFSaPLLYoQ2B9geElveMg62mhBDu-oY0qqMtyZb84vbbJiT8TjxvMRUlBWDe-5S229uLCTRp0lpRp4RKrgR474X653n_ZAC6ogOb96KdjomYMR92phme4pYG9n9tTt1ppg1YHBgl61KhKCMLW48AxsMCB5rZxcG-dADp6wXy2m3TEwOyhCR9JKzMq1bGV9G52m0JkXeRUs3HaqxzXUWIhEHyG4D7HhQBAJnJncOKKbIgcf1xPMwXfXhjjwooj4saRxcuebT3eeLw" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
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
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQWt3NsHUOOcKgwDibsPPLilYMKO3ygaYWDdvHdsDg4LCV8TJwv0kSw5EGxRz7o_NoxtE39htKAzNOxFGDp8W7asYbM-Txolc1fRRmELgtKN-uGOi83rb0agNO706CIkerjUB4zKOMWpk7o6y6n1j30_lGgaxXcWLNJU38_Gf36l2xgHxgk9E65T8yx1xkIlN5pBnGaqj_mQWuEuzF-xXWpPd6aBEsJh6a-N9i44F-1H2mNrddeHLM_TUvy7dHjVida3nsiXz3e9E" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                      <div className="relative rounded-[16px] overflow-hidden bg-[#1A1A1A] mb-4 aspect-[4/3] flex items-center justify-center">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE" className="h-[120%] object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
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
                    <div className="border-2 border-dashed border-gray-200 rounded-[24px] p-6 flex flex-col items-center justify-center text-center bg-transparent hover:bg-gray-50/50 transition-colors cursor-pointer min-h-[300px]">
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

            {activeTab === 'Inventory & Stock' && <InventoryTab />}
            {activeTab === 'Customer Reviews' && <ReviewsTab />}
            {activeTab === 'Store Settings' && <SettingsTab shop={shopData} />}
            {activeTab === 'Sales Analytics' && (
              <div className="bg-white rounded-[24px] p-8 shadow-sm flex items-center justify-center min-h-[400px]">
                <p className="text-gray-400 font-bold text-sm">Sales Analytics (Coming soon)</p>
              </div>
            )}
            {activeTab === 'Marketing Tools' && (
              <div className="bg-white rounded-[24px] p-8 shadow-sm flex items-center justify-center min-h-[400px]">
                <p className="text-gray-400 font-bold text-sm">Marketing Tools (Coming soon)</p>
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
      </div>
    </div>
  )
}
