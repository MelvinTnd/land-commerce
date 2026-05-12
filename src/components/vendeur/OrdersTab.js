'use client'
import { useState, useEffect } from 'react'
import { getVendorOrders, updateOrderStatus } from '@/lib/api'

const STATUT_CONFIG = {
  en_attente:   { label: 'En attente',   color: '#D97706', bg: '#FFF7ED', icon: 'schedule' },
  payee:        { label: 'Payée',        color: '#2563EB', bg: '#EFF6FF', icon: 'payments' },
  en_livraison: { label: 'En livraison', color: '#7C3AED', bg: '#EDE9FE', icon: 'local_shipping' },
  livree:       { label: 'Livrée',       color: '#16A34A', bg: '#F0FDF4', icon: 'done_all' },
  annulee:      { label: 'Annulée',      color: '#DC2626', bg: '#FEF2F2', icon: 'cancel' },
}

const NEXT_LABEL = {
  payee:        { label: 'Marquer Payée',         icon: 'payments' },
  en_livraison: { label: 'Expédier',              icon: 'local_shipping' },
  livree:       { label: 'Marquer Livrée',        icon: 'done_all' },
  annulee:      { label: 'Annuler',               icon: 'cancel' },
}

const FILTRE_OPTIONS = ['Toutes', 'en_attente', 'payee', 'en_livraison', 'livree', 'annulee']

export default function OrdersTab({ token }) {
  const [orders, setOrders]         = useState([])
  const [stats, setStats]           = useState({})
  const [loading, setLoading]       = useState(true)
  const [filtre, setFiltre]         = useState('Toutes')
  const [search, setSearch]         = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating]     = useState(null) // orderId en cours de MAJ

  const loadOrders = () => {
    setLoading(true)
    getVendorOrders(token)
      .then(data => {
        setOrders(data.orders || [])
        setStats(data.stats || {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (token) loadOrders() }, [token])

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      const data = await updateOrderStatus(orderId, newStatus, token)
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, status: data.status, next_statuses: data.next_statuses }
          : o
      ))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: data.status, next_statuses: data.next_statuses }))
      }
    } catch (err) {
      alert(err.message || 'Erreur lors de la mise à jour')
    }
    setUpdating(null)
  }

  const filtered = orders.filter(o => {
    const matchFiltre = filtre === 'Toutes' || o.status === filtre
    const matchSearch = !search || o.reference?.toLowerCase().includes(search.toLowerCase())
      || o.customer_name?.toLowerCase().includes(search.toLowerCase())
    return matchFiltre && matchSearch
  })

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const formatMoney = (n) => Number(n || 0).toLocaleString('fr-FR') + ' CFA'

  return (
    <div className="flex flex-col gap-6">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',        value: stats.total        || 0, icon: 'receipt_long',   color: '#374151', bg: '#F9FAFB' },
          { label: 'En attente',   value: stats.en_attente   || 0, icon: 'schedule',       color: '#D97706', bg: '#FFFBEB' },
          { label: 'En livraison', value: stats.en_livraison || 0, icon: 'local_shipping', color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Livrées',      value: stats.livree       || 0, icon: 'done_all',       color: '#16A34A', bg: '#F0FDF4' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ border: '1px solid #EBEBEB' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
              <span className="material-symbols-outlined text-[22px]" style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: '#0D0D0D' }}>{s.value}</p>
              <p className="text-[11px] font-bold" style={{ color: '#9CA3AF' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filtres + Recherche ── */}
      <div className="bg-white rounded-[24px] p-5" style={{ border: '1px solid #EBEBEB' }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Recherche */}
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl" style={{ background: '#F7F5F0' }}>
            <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>search</span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Référence, client..."
              className="bg-transparent outline-none text-[13px] font-medium w-full" style={{ color: '#374151' }}
            />
          </div>
          {/* Refresh */}
          <button
            onClick={loadOrders}
            className="px-5 py-2.5 rounded-xl text-[12px] font-bold flex items-center gap-2 transition-colors hover:bg-gray-50"
            style={{ border: '1px solid #EBEBEB', color: '#374151' }}
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Actualiser
          </button>
        </div>

        {/* Filtres statuts */}
        <div className="flex gap-2 flex-wrap">
          {FILTRE_OPTIONS.map(f => {
            const cfg = f === 'Toutes' ? null : STATUT_CONFIG[f]
            const isActive = filtre === f
            return (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                className="px-4 py-1.5 rounded-full text-[11px] font-bold transition-all"
                style={isActive
                  ? { background: cfg?.color || '#0D0D0D', color: 'white' }
                  : { background: '#F3F4F6', color: '#6B7280' }
                }
              >
                {cfg?.label || 'Toutes'}{f !== 'Toutes' && stats[f] !== undefined ? ` (${stats[f]})` : ''}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table des commandes / Détail ── */}
      <div className="flex gap-5 items-start">

        {/* Liste */}
        <div className={`bg-white rounded-[24px] overflow-hidden ${selectedOrder ? 'hidden lg:block lg:flex-1' : 'flex-1'}`} style={{ border: '1px solid #EBEBEB' }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#1B6B3A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <span className="material-symbols-outlined text-[56px] mb-3" style={{ color: '#E5E7EB' }}>package_2</span>
              <p className="font-bold text-base mb-1" style={{ color: '#374151' }}>
                {orders.length === 0 ? 'Aucune commande reçue' : 'Aucun résultat'}
              </p>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                {orders.length === 0 ? 'Les commandes de vos clients apparaîtront ici.' : 'Essayez un autre filtre'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                    {['Référence', 'Client', 'Montant', 'Date', 'Statut', 'Action'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => {
                    const cfg = STATUT_CONFIG[order.status] || STATUT_CONFIG.en_attente
                    const isSelected = selectedOrder?.id === order.id
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(isSelected ? null : order)}
                        className="cursor-pointer transition-colors"
                        style={{
                          borderBottom: '1px solid #F9FAFB',
                          background: isSelected ? '#F0FDF4' : 'white',
                        }}
                      >
                        {/* Référence */}
                        <td className="px-5 py-4">
                          <span className="text-[12px] font-black" style={{ color: '#0D0D0D' }}>
                            {order.reference || `#${String(order.id).padStart(5, '0')}`}
                          </span>
                        </td>

                        {/* Client */}
                        <td className="px-5 py-4">
                          <p className="text-[12px] font-bold" style={{ color: '#374151' }}>{order.customer_name || '-'}</p>
                          <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{order.customer_phone || ''}</p>
                        </td>

                        {/* Montant */}
                        <td className="px-5 py-4">
                          <span className="text-[12px] font-black" style={{ color: '#1B6B3A' }}>
                            {formatMoney(order.items_subtotal || order.total_amount)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{formatDate(order.created_at)}</span>
                        </td>

                        {/* Statut */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            <span className="material-symbols-outlined text-[12px]">{cfg.icon}</span>
                            {cfg.label}
                          </span>
                        </td>

                        {/* Actions rapides */}
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-2">
                            {(order.next_statuses || []).map(nextStatus => {
                              const nl = NEXT_LABEL[nextStatus]
                              const isDanger = nextStatus === 'annulee'
                              return (
                                <button
                                  key={nextStatus}
                                  disabled={updating === order.id}
                                  onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap flex items-center gap-1 transition-all disabled:opacity-50"
                                  style={{
                                    background: isDanger ? '#FEF2F2' : '#F0FDF4',
                                    color: isDanger ? '#DC2626' : '#16A34A',
                                    border: `1px solid ${isDanger ? '#FECACA' : '#BBF7D0'}`,
                                  }}
                                >
                                  {updating === order.id
                                    ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    : <span className="material-symbols-outlined text-[12px]">{nl?.icon}</span>
                                  }
                                  {nl?.label}
                                </button>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Détail commande */}
        {selectedOrder && (
          <div className="w-full lg:w-[380px] bg-white rounded-[24px] shrink-0" style={{ border: '2px solid #1B6B3A' }}>
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #F0FDF4' }}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#9CA3AF' }}>Détail</p>
                <p className="text-[14px] font-black" style={{ color: '#0D0D0D' }}>
                  {selectedOrder.reference || `#${String(selectedOrder.id).padStart(5, '0')}`}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#9CA3AF' }}>close</span>
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Statut */}
              <div>
                {(() => {
                  const cfg = STATUT_CONFIG[selectedOrder.status] || STATUT_CONFIG.en_attente
                  return (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                      {cfg.label}
                    </span>
                  )
                })()}
              </div>

              {/* Client */}
              <div className="rounded-xl p-4" style={{ background: '#F9FAFB' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Client</p>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[13px] font-bold" style={{ color: '#0D0D0D' }}>{selectedOrder.customer_name}</p>
                  <p className="text-[12px]" style={{ color: '#6B7280' }}>{selectedOrder.customer_phone}</p>
                  <p className="text-[12px]" style={{ color: '#6B7280' }}>{selectedOrder.customer_email}</p>
                  <p className="text-[12px] mt-1" style={{ color: '#374151' }}>
                    <span className="material-symbols-outlined text-[14px] mr-1 align-middle">location_on</span>
                    {selectedOrder.shipping_address}
                  </p>
                </div>
              </div>

              {/* Produits */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Articles</p>
                <div className="flex flex-col gap-2">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold truncate" style={{ color: '#0D0D0D' }}>{item.product_name}</p>
                        <p className="text-[10px]" style={{ color: '#9CA3AF' }}>x{item.quantity}</p>
                      </div>
                      <span className="text-[12px] font-black ml-3" style={{ color: '#1B6B3A' }}>
                        {formatMoney(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[12px] font-bold" style={{ color: '#6B7280' }}>Sous-total boutique</span>
                    <span className="text-[14px] font-black" style={{ color: '#1B6B3A' }}>
                      {formatMoney(selectedOrder.items_subtotal || selectedOrder.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {(selectedOrder.next_statuses || []).length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>Actions</p>
                  <div className="flex flex-col gap-2">
                    {(selectedOrder.next_statuses || []).map(nextStatus => {
                      const nl = NEXT_LABEL[nextStatus]
                      const isDanger = nextStatus === 'annulee'
                      return (
                        <button
                          key={nextStatus}
                          disabled={updating === selectedOrder.id}
                          onClick={() => handleStatusUpdate(selectedOrder.id, nextStatus)}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold transition-all disabled:opacity-50"
                          style={isDanger
                            ? { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }
                            : { background: '#1B6B3A', color: 'white' }
                          }
                        >
                          {updating === selectedOrder.id
                            ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            : <span className="material-symbols-outlined text-[16px]">{nl?.icon}</span>
                          }
                          {nl?.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
