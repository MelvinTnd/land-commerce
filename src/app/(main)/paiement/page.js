'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { checkout, isAuthenticated } from '@/lib/api'



const methodes = [
  { id: 'momo', nom: 'MTN Mobile Money', icon: 'payments', couleur: '#F5A623', desc: 'Paiement instantané via MTN MoMo' },
  { id: 'moov', nom: 'Moov Money', icon: 'account_balance_wallet', couleur: '#0066CC', desc: 'Paiement via Moov Money' },
  { id: 'carte', nom: 'Carte Bancaire', icon: 'credit_card', couleur: '#1A1A1A', desc: 'Visa, Mastercard' },
  { id: 'livraison', nom: 'Paiement à la livraison', icon: 'local_shipping', couleur: '#1B6B3A', desc: 'Cotonou uniquement' },
]

const etapes = [
  { num: 1, label: 'Panier' },
  { num: 2, label: 'Livraison' },
  { num: 3, label: 'Paiement' },
  { num: 4, label: 'Confirmation' },
]

export default function PaiementPage() {
  const { articles, sousTotal, livraison, total, viderPanier } = useCart()
  const router = useRouter()
  const [etape, setEtape] = useState(2)
  const [methode, setMethode] = useState('')
  const [momoNum, setMomoNum] = useState('')
  const [loading, setLoading] = useState(false)
  const [adresse, setAdresse] = useState({
    nom: '', prenom: '', tel: '', email: '',
    rue: '', ville: 'Cotonou', quartier: '', complement: '',
  })

  const inputStyle = { background: '#F7F5F0', border: '2px solid transparent', color: '#1A1A1A' }

  const handleFocus = (e) => { e.target.style.borderColor = '#1B6B3A' }
  const handleBlur = (e) => { e.target.style.borderColor = 'transparent' }

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Stepper */}
      <div className="bg-white" style={{ borderBottom: '1px solid #F0EDE8' }}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {etapes.map((e, i) => (
              <div key={e.num} className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{
                      background: etape >= e.num ? '#1B6B3A' : '#E5E7EB',
                      color: etape >= e.num ? 'white' : '#9CA3AF',
                    }}
                  >
                    {etape > e.num ? (
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                    ) : e.num}
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wide hidden sm:block"
                    style={{ color: etape >= e.num ? '#1A1A1A' : '#9CA3AF' }}
                  >
                    {e.label}
                  </span>
                </div>
                {i < etapes.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 rounded-full" style={{ background: etape > e.num ? '#1B6B3A' : '#E5E7EB' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Colonne gauche — Formulaires */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Adresse de livraison */}
            <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid #E5E7EB' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1B6B3A' }}>
                  <span className="material-symbols-outlined" style={{ color: '#F5B731', fontSize: '20px' }}>location_on</span>
                </div>
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1A' }}>Adresse de Livraison</h2>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Où devons-nous livrer votre commande ?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'prenom', label: 'Prénom', placeholder: 'Votre prénom', type: 'text' },
                  { key: 'nom', label: 'Nom', placeholder: 'Votre nom', type: 'text' },
                  { key: 'email', label: 'Email', placeholder: 'nom@exemple.bj', type: 'email' },
                  { key: 'tel', label: 'Téléphone', placeholder: '+229 XX XX XX XX', type: 'tel' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={adresse[f.key]}
                      onChange={(e) => setAdresse({ ...adresse, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Adresse / Rue</label>
                  <input type="text" value={adresse.rue} onChange={(e) => setAdresse({ ...adresse, rue: e.target.value })}
                    placeholder="Numéro et nom de rue" className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                {[
                  { key: 'quartier', label: 'Quartier', placeholder: 'Ex: Cadjèhoun' },
                  { key: 'ville', label: 'Ville', placeholder: 'Cotonou' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{f.label}</label>
                    <input type="text" value={adresse[f.key]} onChange={(e) => setAdresse({ ...adresse, [f.key]: e.target.value })}
                      placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid #E5E7EB' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1B6B3A' }}>
                  <span className="material-symbols-outlined" style={{ color: '#F5B731', fontSize: '20px' }}>payments</span>
                </div>
                <div>
                  <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1A' }}>Mode de Paiement</h2>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Choisissez votre mode de paiement préféré</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {methodes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethode(m.id)}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                    style={{
                      border: methode === m.id ? '2px solid #1B6B3A' : '2px solid #E5E7EB',
                      background: methode === m.id ? '#F0FDF4' : 'white',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${m.couleur}15` }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: m.couleur }}>{m.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{m.nom}</p>
                      <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{m.desc}</p>
                    </div>
                    {methode === m.id && (
                      <span className="material-symbols-outlined ml-auto" style={{ fontSize: '20px', color: '#1B6B3A' }}>check_circle</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Champ numéro mobile si MoMo ou Moov */}
              {(methode === 'momo' || methode === 'moov') && (
                <div className="rounded-xl p-4" style={{ background: '#F7F5F0', border: '1px solid #E5E7EB' }}>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
                    Numéro {methode === 'momo' ? 'MTN MoMo' : 'Moov Money'}
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: '18px', color: '#9CA3AF' }}>phone</span>
                    <input
                      type="tel" value={momoNum} onChange={(e) => setMomoNum(e.target.value)}
                      placeholder="+229 XX XX XX XX"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none bg-white"
                      style={{ border: '2px solid transparent' }}
                      onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </div>
                  <p className="text-[11px] mt-2 flex items-center gap-1" style={{ color: '#D4920A' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                    Vous recevrez une demande de validation sur ce numéro
                  </p>
                </div>
              )}

              {/* Champs carte bancaire */}
              {methode === 'carte' && (
                <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: '#F7F5F0', border: '1px solid #E5E7EB' }}>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Numéro de carte</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                      style={{ border: '2px solid transparent' }} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Expiration</label>
                      <input type="text" placeholder="MM / AA" className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                        style={{ border: '2px solid transparent' }} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>CVV</label>
                      <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white"
                        style={{ border: '2px solid transparent' }} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite — Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-6" style={{ border: '1px solid #E5E7EB' }}>
              <h3 className="text-lg font-extrabold mb-5" style={{ color: '#1A1A1A' }}>Votre Commande</h3>

              {/* Articles */}
              <div className="flex flex-col gap-4 mb-6">
                {articles.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                      <Image src={a.image} alt={a.nom} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1A1A1A' }}>{a.nom}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>Qté : {a.quantite}</p>
                    </div>
                    <p className="text-sm font-bold shrink-0" style={{ color: '#1A1A1A' }}>
                      {(a.prix * a.quantite).toLocaleString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px mb-4" style={{ background: '#F0EDE8' }} />

              {/* Totaux */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Sous-total</span>
                  <span className="font-semibold">{sousTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Livraison</span>
                  <span className="font-semibold" style={{ color: livraison === 0 ? '#1B6B3A' : '#1A1A1A' }}>
                    {livraison === 0 ? 'Gratuite' : `${livraison.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>
                <div className="h-px my-2" style={{ background: '#F0EDE8' }} />
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-extrabold" style={{ color: '#1B6B3A' }}>
                    {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Bouton confirmer */}
              <button
                className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#1B6B3A', boxShadow: '0 8px 24px rgba(27,107,58,0.3)' }}
                disabled={!methode || articles.length === 0 || loading}
                onClick={async () => {
                  if (!isAuthenticated()) {
                    alert('Veuillez vous connecter pour valider votre commande.')
                    router.push('/connexion')
                    return
                  }
                  setLoading(true)
                  try {
                    const orderData = {
                      total_amount: total,
                      shipping_address: `${adresse.rue || 'Non renseigné'}, ${adresse.quartier}, ${adresse.ville}`.trim(),
                      customer_phone: adresse.tel || momoNum || '+229 00000000',
                      payment_method: methode,
                      items: articles.map(a => ({
                        id: a.id,
                        quantity: a.quantite,
                        prix: parseFloat(a.prix)
                      }))
                    }
                    const res = await checkout(orderData)
                    viderPanier()
                    alert(`✅ Commande confirmée ! Réf: ${res.reference || res.order?.reference}`)
                    router.push('/compte')
                  } catch (err) {
                    alert('❌ Erreur : ' + err.message)
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
                {loading ? 'Traitement en cours...' : 'Confirmer et Payer'}
              </button>

              {/* Sécurité */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#9CA3AF' }}>verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
                  Paiement 100% sécurisé
                </span>
              </div>

              {/* Retour */}
              <Link
                href="/panier"
                className="flex items-center justify-center gap-1 mt-4 text-xs font-semibold transition-colors hover:opacity-70"
                style={{ color: '#1B6B3A' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                Retour au panier
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
