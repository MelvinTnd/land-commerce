'use client'
import { useState } from 'react'

const faqData = [
  { cat: 'Commandes', q: 'Comment passer une commande ?', a: 'Parcourez nos produits, ajoutez au panier et suivez le processus de paiement. Paiement mobile (MTN MoMo, Moov Money) disponible.' },
  { cat: 'Commandes', q: 'Puis-je modifier ou annuler ma commande ?', a: 'Oui, dans les 2 heures suivant la confirmation. Au-delà, contactez-nous à support@beninmarket.bj.' },
  { cat: 'Livraison', q: 'Quels sont les délais de livraison ?', a: '24h à Cotonou, 48-72h dans le Sud, 3-5 jours dans le Nord, 7-21 jours à l\'international.' },
  { cat: 'Livraison', q: 'La livraison est-elle gratuite ?', a: 'Oui, au-dessus de 50 000 FCFA pour le Sud Bénin. Consultez notre page livraison pour les détails par zone.' },
  { cat: 'Paiement', q: 'Quels moyens de paiement acceptez-vous ?', a: 'MTN Mobile Money, Moov Money, cartes bancaires (Visa, Mastercard) et paiement à la livraison (Cotonou uniquement).' },
  { cat: 'Paiement', q: 'Le paiement est-il sécurisé ?', a: 'Absolument. Toutes les transactions passent par des passerelles certifiées et chiffrées.' },
  { cat: 'Vendeurs', q: 'Comment devenir vendeur ?', a: 'Rendez-vous sur notre page "Devenir vendeur" et remplissez le formulaire. Notre équipe vous contacte sous 48h.' },
  { cat: 'Vendeurs', q: 'Y a-t-il des frais pour vendre ?', a: 'L\'inscription est gratuite. Nous prélevons une commission de 10% sur chaque vente réalisée.' },
]

const categories = ['Tous', ...new Set(faqData.map((f) => f.cat))]

export default function FaqPage() {
  const [catActive, setCatActive] = useState('Tous')
  const [ouvert, setOuvert] = useState(null)

  const filtered = catActive === 'Tous' ? faqData : faqData.filter((f) => f.cat === catActive)

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004d28 100%)' }}>
        <span className="material-symbols-outlined mb-4" style={{ fontSize: '48px', color: '#F5B731' }}>help</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Foire Aux Questions</h1>
        <p className="text-white/70 max-w-lg mx-auto">Trouvez rapidement les réponses à vos questions.</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCatActive(c); setOuvert(null) }}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={{ background: catActive === c ? '#1B6B3A' : 'white', color: catActive === c ? 'white' : '#374151', border: catActive === c ? 'none' : '1px solid #E5E7EB' }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
              <button
                onClick={() => setOuvert(ouvert === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: '#F0FDF4', color: '#1B6B3A' }}>{f.cat}</span>
                  <span className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{f.q}</span>
                </div>
                <span className="material-symbols-outlined transition-transform" style={{ fontSize: '20px', color: '#9CA3AF', transform: ouvert === i ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {ouvert === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
