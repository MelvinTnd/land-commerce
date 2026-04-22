'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getOrders } from '@/lib/api'

export default function OrdersTab({ token }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getOrders(token)
      .then(data => {
        setOrders(Array.isArray(data) ? data : (data.data || []))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase()
    if (s.includes('livr') || s.includes('deliver') || s.includes('termin')) return { bg: '#F0FDF4', color: '#16A34A' }
    if (s.includes('expédi') || s.includes('ship')) return { bg: '#EFF6FF', color: '#2563EB' }
    if (s.includes('annulé') || s.includes('cancel')) return { bg: '#FEF2F2', color: '#DC2626' }
    return { bg: '#FFF7ED', color: '#D97706' } // en cours, pending...
  }

  return (
    <div className="bg-white rounded-[28px] p-7" style={{ border: '1px solid #EBEBEB' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-black text-lg" style={{ color: '#0D0D0D' }}>Commandes Récentes</h3>
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{orders.length} commande(s) effectuée(s)</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4920A', borderTopColor: 'transparent' }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-[64px] mb-4" style={{ color: '#E5E7EB' }}>package_2</span>
          <p className="font-black text-base mb-1" style={{ color: '#374151' }}>Aucune commande pour le moment</p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Les commandes passées sur vos produits s'afficheront ici.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                <th className="pb-4 w-3/12">N° Commande</th>
                <th className="pb-4 w-3/12">Date</th>
                <th className="pb-4 w-3/12">Montant</th>
                <th className="pb-4 w-3/12 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order, i) => {
                const badge = getStatusColor(order.status)
                return (
                  <tr key={order.id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 border-b border-gray-50 font-bold text-gray-800 text-xs">
                      #{order.id?.toString().padStart(5, '0') || '00000'}
                    </td>
                    <td className="py-4 border-b border-gray-50 text-[11px] font-medium text-gray-500">
                      {new Date(order.created_at || Date.now()).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 border-b border-gray-50 font-black text-xs text-green-700">
                      {parseFloat(order.total_amount || 0).toLocaleString('fr-FR')} CFA
                    </td>
                    <td className="py-4 border-b border-gray-50 text-right">
                      <span className="text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-wide"
                        style={{ background: badge.bg, color: badge.color }}>
                        {order.status || 'En cours'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
