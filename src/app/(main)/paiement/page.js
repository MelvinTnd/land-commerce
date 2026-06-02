'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { useSession } from 'next-auth/react'
import { checkout, getAddresses } from '@/lib/api'

const STEPS = ['Livraison', 'Paiement', 'Confirmation']

const PAIEMENTS = [
  { id: 'mtn', label: 'MTN Mobile Money', color: '#FFD600', textColor: '#1A1A1A', icon: '📱', desc: 'Paiement instantané via MTN MoMo' },
  { id: 'moov', label: 'Moov Money', color: '#0062B8', textColor: 'white', icon: '📱', desc: 'Paiement rapide via Moov Africa' },
  { id: 'celtiis', label: 'Celtiis Cash', color: '#E30613', textColor: 'white', icon: '📱', desc: 'Paiement mobile via Celtiis' },
]

export default function PaiementPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { articles, sousTotal, livraison, total, viderPanier } = useCart()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderRef, setOrderRef] = useState(null)
  const [orderData, setOrderData] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)

  // Formulaire livraison (manuel)
  const [form, setForm] = useState({
    nom: session?.user?.name || '',
    telephone: '',
    email: session?.user?.email || '',
    ville: 'Cotonou',
    quartier: '',
    adresse: '',
    instructions: '',
  })

  // Paiement
  const [methodePaiement, setMethodePaiement] = useState('mtn')
  const [numeroPaiement, setNumeroPaiement] = useState('')

  const fraisLivraison = livraison
  const totalFinal = sousTotal + fraisLivraison

  // Charger les adresses sauvegardées
  useEffect(() => {
    if (!session?.user?.apiToken) return
    getAddresses(session.user.apiToken).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setAddresses(data)
        const def = data.find(a => a.is_default)
        if (def) {
          setSelectedAddressId(def.id)
          setForm({
            nom: def.nom_complet || session?.user?.name || '',
            telephone: def.telephone || '',
            email: session?.user?.email || '',
            ville: def.ville || 'Cotonou',
            quartier: def.quartier || '',
            adresse: def.adresse || '',
            instructions: def.instructions || '',
          })
        }
      }
    }).catch(() => {})
  }, [session])

  const selectAddress = (addr) => {
    setSelectedAddressId(addr.id)
    setForm({
      nom: addr.nom_complet,
      telephone: addr.telephone,
      email: session?.user?.email || '',
      ville: addr.ville,
      quartier: addr.quartier,
      adresse: addr.adresse,
      instructions: addr.instructions || '',
    })
    setShowAddressForm(false)
  }

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handlePasser = async () => {
    if (!numeroPaiement.trim() || numeroPaiement.replace(/\D/g, '').length < 8) {
      alert('Veuillez entrer un numéro de téléphone valide.')
      return
    }
    setLoading(true)
    try {
      const orderData = {
        items: articles.map(a => ({ id: a.id, quantity: a.quantite, prix: a.prix })),
        total_amount: totalFinal,
        shipping_address: `${form.adresse}, ${form.quartier}, ${form.ville}`,
        customer_name: form.nom,
        customer_phone: form.telephone,
        customer_email: form.email,
        payment_method: methodePaiement,
        payment_phone: numeroPaiement,
        notes: form.instructions,
        address_id: selectedAddressId,
      }
      const token = session?.user?.apiToken || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)
      const res = await checkout(orderData, token)
      const ref = res?.order?.reference || res?.reference || `BM-${Date.now()}`
      setOrderRef(ref)
      setOrderData(res?.order || null)
      viderPanier?.()
      setStep(2)
    } catch (err) {
      const ref = `BM-${Date.now()}`
      setOrderRef(ref)
      setOrderData(null)
      viderPanier?.()
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  if (articles.length === 0 && step !== 2) {
    return (
      <div style={{ background: '#F7F5F0', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <div className="bg-white rounded-[32px] p-12 text-center max-w-md w-full" style={{ border: '1px solid #EBEBEB' }}>
          <span className="material-symbols-outlined text-[64px] block mb-4" style={{ color: '#D1D5DB' }}>shopping_bag</span>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#0D0D0D' }}>Panier vide</h2>
          <p className="text-sm mb-8" style={{ color: '#9CA3AF' }}>Ajoutez des articles avant de passer commande.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-[12px] uppercase tracking-widest text-white" style={{ background: '#1B6B3A' }}>
            Explorer le Marché
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <div className="bg-white px-6 md:px-10 py-7" style={{ borderBottom: '1px solid #EBEBEB' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[11px] font-bold mb-4" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/panier" className="hover:text-[#1B6B3A] transition-colors">Panier</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span style={{ color: '#0D0D0D' }}>Paiement</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>Finaliser ma commande</h1>
        </div>
      </div>

      <div className="bg-white border-b" style={{ borderColor: '#EBEBEB' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all"
                    style={{
                      background: i < step ? '#1B6B3A' : i === step ? '#1B6B3A' : '#F3F4F6',
                      color: i <= step ? 'white' : '#9CA3AF',
                    }}>
                    {i < step
                      ? <span className="material-symbols-outlined text-[14px]">check</span>
                      : i + 1
                    }
                  </div>
                  <span className="text-[12px] font-bold hidden sm:block" style={{ color: i <= step ? '#0D0D0D' : '#9CA3AF' }}>{s}</span>
                </div>
                {i < 2 && <div className="w-16 h-[1px] mx-1" style={{ background: i < step ? '#1B6B3A' : '#EBEBEB' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 pb-28">

        {/* ── STEP 0 : LIVRAISON ── */}
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[28px] p-8" style={{ border: '1px solid #EBEBEB' }}>
                <h2 className="text-[18px] font-black mb-6 flex items-center gap-2" style={{ color: '#0D0D0D' }}>
                  <span className="material-symbols-outlined text-[22px]" style={{ color: '#1B6B3A' }}>local_shipping</span>
                  Informations de livraison
                </h2>

                {/* Adresses sauvegardées */}
                {addresses.length > 0 && !showAddressForm && (
                  <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>Mes adresses enregistrées</p>
                    <div className="flex flex-col gap-2">
                      {addresses.map(addr => (
                        <button
                          key={addr.id}
                          onClick={() => selectAddress(addr)}
                          className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                          style={{
                            border: `2px solid ${selectedAddressId === addr.id ? '#1B6B3A' : '#E5E7EB'}`,
                            background: selectedAddressId === addr.id ? '#F0FDF4' : 'white',
                          }}
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: selectedAddressId === addr.id ? '#1B6B3A' : '#F7F5F0' }}>
                            <span className="material-symbols-outlined text-[18px]" style={{ color: selectedAddressId === addr.id ? 'white' : '#9CA3AF' }}>location_on</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold" style={{ color: '#0D0D0D' }}>{addr.label}</span>
                              {addr.is_default && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#F0FDF4', color: '#1B6B3A' }}>Défaut</span>}
                            </div>
                            <p className="text-[11px]" style={{ color: '#6B7280' }}>{addr.adresse}, {addr.quartier}, {addr.ville}</p>
                          </div>
                          {selectedAddressId === addr.id && (
                            <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>check_circle</span>
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12px] font-bold transition-all"
                        style={{ border: '1.5px dashed #D1D5DB', color: '#6B7280' }}
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Utiliser une autre adresse
                      </button>
                    </div>
                  </div>
                )}

                {(addresses.length === 0 || showAddressForm) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'nom', label: 'Nom complet', placeholder: 'Jean Koffi', type: 'text', full: false },
                      { key: 'telephone', label: 'Téléphone', placeholder: '+229 97 00 00 00', type: 'tel', full: false },
                      { key: 'email', label: 'Email (optionnel)', placeholder: 'email@exemple.com', type: 'email', full: true },
                    ].map(f => (
                      <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>{f.label}</label>
                        <input
                          type={f.type} value={form[f.key]}
                          onChange={e => updateForm(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-all"
                          style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }}
                          onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Ville</label>
                      <input type="text" value={form.ville}
                        onChange={e => updateForm('ville', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-all"
                        style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Quartier</label>
                      <input type="text" value={form.quartier}
                        onChange={e => updateForm('quartier', e.target.value)}
                        placeholder="Ex: Akpakpa, Cadjehoun..."
                        className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-all"
                        style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Adresse précise</label>
                      <input type="text" value={form.adresse}
                        onChange={e => updateForm('adresse', e.target.value)}
                        placeholder="Rue, numéro de maison, repère..."
                        className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-all"
                        style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Instructions spéciales (optionnel)</label>
                      <textarea value={form.instructions}
                        onChange={e => updateForm('instructions', e.target.value)}
                        placeholder="Laissez au gardien, appelez à l'arrivée..." rows={2}
                        className="w-full px-4 py-3 rounded-xl text-[13px] font-medium outline-none transition-all resize-none"
                        style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }}
                      />
                    </div>
                  </div>
                )}

                {showAddressForm && addresses.length > 0 && (
                  <button onClick={() => setShowAddressForm(false)}
                    className="mt-3 text-[12px] font-bold" style={{ color: '#1B6B3A' }}>
                    ← Revenir à mes adresses
                  </button>
                )}

                <button onClick={() => {
                  if (!form.nom.trim() || !form.telephone.trim() || !form.ville || !form.quartier.trim()) {
                    alert('Veuillez remplir tous les champs obligatoires.')
                    return
                  }
                  setStep(1)
                }}
                  className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  Continuer vers le paiement
                </button>
              </div>
            </div>
            <ResumeCommande articles={articles} sousTotal={sousTotal} fraisLivraison={fraisLivraison} totalFinal={totalFinal} />
          </div>
        )}

        {/* ── STEP 1 : PAIEMENT ── */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[28px] p-8" style={{ border: '1px solid #EBEBEB' }}>
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setStep(0)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ border: '1px solid #E5E7EB' }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#6B7280' }}>arrow_back</span>
                  </button>
                  <h2 className="text-[18px] font-black flex items-center gap-2" style={{ color: '#0D0D0D' }}>
                    <span className="material-symbols-outlined text-[22px]" style={{ color: '#1B6B3A' }}>payments</span>
                    Mode de paiement
                  </h2>
                </div>
                <p className="text-[12px] mb-6 ml-12" style={{ color: '#9CA3AF' }}>Choisissez votre opérateur Mobile Money</p>

                <div className="flex flex-col gap-3 mb-8">
                  {PAIEMENTS.map(m => (
                    <button key={m.id} onClick={() => setMethodePaiement(m.id)}
                      className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
                      style={{
                        border: `2px solid ${methodePaiement === m.id ? '#1B6B3A' : '#E5E7EB'}`,
                        background: methodePaiement === m.id ? '#F0FDF4' : 'white',
                      }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[20px] shrink-0" style={{ background: m.color, color: m.textColor }}>
                        {m.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[14px]" style={{ color: '#0D0D0D' }}>{m.label}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{m.desc}</p>
                      </div>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ border: `2px solid ${methodePaiement === m.id ? '#1B6B3A' : '#D1D5DB'}`, background: methodePaiement === m.id ? '#1B6B3A' : 'white' }}>
                        {methodePaiement === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#F7F5F0] rounded-2xl p-6" style={{ border: '1px solid #E5E7EB' }}>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>
                    Numéro {PAIEMENTS.find(m => m.id === methodePaiement)?.label}
                  </label>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[13px]" style={{ background: 'white', border: '1.5px solid #E5E7EB', color: '#6B7280' }}>
                      🇧🇯 +229
                    </div>
                    <input type="tel" value={numeroPaiement}
                      onChange={e => setNumeroPaiement(e.target.value)}
                      placeholder="97 00 00 00"
                      className="flex-1 px-4 py-3 rounded-xl text-[14px] font-bold outline-none transition-all"
                      style={{ background: 'white', border: '1.5px solid #E5E7EB' }}
                      onFocus={e => e.target.style.borderColor = '#1B6B3A'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  </div>
                  <p className="text-[11px] mt-3 flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Une demande de confirmation vous sera envoyée sur ce numéro
                  </p>
                </div>

                <button onClick={handlePasser} disabled={loading || !numeroPaiement.trim()}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{ background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}>
                  {loading
                    ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Traitement en cours...</>
                    : <><span className="material-symbols-outlined text-[18px]">lock</span>Confirmer — {totalFinal.toLocaleString('fr-FR')} CFA</>
                  }
                </button>

                <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
                  {['Paiement chiffré SSL', 'Données protégées', 'Transaction sécurisée'].map(t => (
                    <div key={t} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px]" style={{ color: '#1B6B3A' }}>shield</span>
                      <span className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ResumeCommande articles={articles} sousTotal={sousTotal} fraisLivraison={fraisLivraison} totalFinal={totalFinal} adresse={form} />
          </div>
        )}

        {/* ── STEP 2 : CONFIRMATION + REÇU ── */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[32px] p-10 text-center" style={{ border: '1px solid #EBEBEB', boxShadow: '0 8px 40px rgba(27,107,58,0.1)' }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #E6F8EA, #BBF7D0)' }}>
                <span className="material-symbols-outlined text-[48px]" style={{ color: '#1B6B3A' }}>check_circle</span>
              </div>
              <h2 className="text-[28px] font-black mb-3" style={{ color: '#0D0D0D' }}>Commande confirmée !</h2>
              <p className="text-[14px] mb-2" style={{ color: '#6B7280' }}>
                Merci pour votre confiance. Votre commande a bien été enregistrée.
              </p>
              {orderRef && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full my-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <span className="material-symbols-outlined text-[14px]" style={{ color: '#1B6B3A' }}>tag</span>
                  <span className="font-black text-[13px]" style={{ color: '#1B6B3A' }}>Réf : {orderRef}</span>
                </div>
              )}

              {/* ── REÇU DE PAIEMENT ── */}
              {orderData && (
                <div className="bg-white rounded-2xl border text-left my-6" style={{ borderColor: '#E5E7EB' }}>
                  <div className="p-6" style={{ background: '#FAFAF8', borderBottom: '1px solid #E5E7EB', borderRadius: '16px 16px 0 0' }}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-black text-[15px]" style={{ color: '#0D0D0D' }}>Reçu de paiement</h3>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#1B6B3A' }}>Payée</span>
                    </div>
                    <p className="text-[11px]" style={{ color: '#9CA3AF' }}>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    {(orderData.items || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-bold" style={{ color: '#0D0D0D' }}>{item.product_name}</p>
                          <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Qté : {item.quantity}</p>
                        </div>
                        <p className="text-[13px] font-black" style={{ color: '#0D0D0D' }}>
                          {(parseFloat(item.unit_price) * parseInt(item.quantity)).toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 8, paddingTop: 12 }} />
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>Sous-total</span>
                      <span className="text-[12px] font-bold" style={{ color: '#0D0D0D' }}>
                        {parseFloat(orderData.total_amount || 0).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>Livraison</span>
                      <span className="text-[12px] font-bold" style={{ color: '#1B6B3A' }}>Incluse</span>
                    </div>
                    <div className="flex justify-between items-center pt-3" style={{ borderTop: '2px solid #1B6B3A' }}>
                      <span className="font-black text-[16px]" style={{ color: '#0D0D0D' }}>Total</span>
                      <span className="font-black text-[20px]" style={{ color: '#1B6B3A' }}>
                        {parseFloat(orderData.total_amount || 0).toLocaleString('fr-FR')}
                        <span className="text-[11px] font-bold ml-1" style={{ color: '#9CA3AF' }}>FCFA</span>
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-center gap-2 text-[11px]" style={{ background: '#FAFAF8', borderTop: '1px solid #E5E7EB', borderRadius: '0 0 16px 16px', color: '#9CA3AF' }}>
                    <span className="material-symbols-outlined text-[14px]">receipt</span>
                    Paiement Mobile Money — Réf: {orderRef}
                  </div>
                </div>
              )}

              <div className="bg-[#F7F5F0] rounded-2xl p-6 text-left my-6" style={{ border: '1px solid #E5E7EB' }}>
                <h3 className="font-black text-[13px] mb-4" style={{ color: '#0D0D0D' }}>Prochaines étapes</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: 'sms', text: 'Vous recevrez une confirmation par SMS d\'ici quelques minutes', color: '#6B7280' },
                    { icon: 'phone_in_talk', text: 'Un livreur vous contactera pour organiser la livraison', color: '#6B7280' },
                    { icon: 'local_shipping', text: 'Livraison estimée : 24h à Cotonou, 48-72h ailleurs au Bénin', color: '#6B7280' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#E6F8EA' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#1B6B3A' }}>{item.icon}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed pt-1" style={{ color: item.color }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/produits"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all hover:bg-gray-100"
                  style={{ border: '1.5px solid #E5E7EB', color: '#0D0D0D' }}>
                  <span className="material-symbols-outlined text-[16px]">explore</span>
                  Continuer mes achats
                </Link>
                <Link href="/compte"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}>
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  Voir mes commandes
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ResumeCommande({ articles, sousTotal, fraisLivraison, totalFinal, adresse }) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-[28px] p-7 sticky top-24" style={{ border: '1px solid #EBEBEB', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h2 className="text-[15px] font-black mb-5" style={{ color: '#0D0D0D' }}>Résumé ({articles.length} article{articles.length > 1 ? 's' : ''})</h2>
        <div className="flex flex-col gap-3 mb-5 max-h-52 overflow-y-auto pr-1">
          {articles.map(a => (
            <div key={a.id} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F7F5F0] shrink-0">
                <Image src={a.image} alt={a.nom} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold line-clamp-1" style={{ color: '#0D0D0D' }}>{a.nom}</p>
                <p className="text-[10px]" style={{ color: '#9CA3AF' }}>x{a.quantite}</p>
              </div>
              <span className="text-[12px] font-black shrink-0" style={{ color: '#0D0D0D' }}>
                {(a.prix * a.quantite).toLocaleString('fr-FR')} <span style={{ color: '#9CA3AF', fontWeight: 600 }}>CFA</span>
              </span>
            </div>
          ))}
        </div>
        {adresse && (
          <div className="mb-4 p-3 rounded-xl text-[11px]" style={{ background: '#F7F5F0', border: '1px solid #E5E7EB' }}>
            <p className="font-black mb-1" style={{ color: '#6B7280' }}>Livraison à</p>
            <p className="font-semibold" style={{ color: '#0D0D0D' }}>{adresse.nom}</p>
            <p style={{ color: '#6B7280' }}>{adresse.quartier}, {adresse.ville}</p>
          </div>
        )}
        <div className="flex flex-col gap-2 pt-4 mb-4" style={{ borderTop: '1px solid #F3F4F6' }}>
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>Sous-total</span>
            <span className="text-[12px] font-black" style={{ color: '#0D0D0D' }}>{sousTotal.toLocaleString('fr-FR')} CFA</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-medium" style={{ color: '#6B7280' }}>Livraison</span>
            <span className="text-[12px] font-black" style={{ color: fraisLivraison === 0 ? '#1B6B3A' : '#0D0D0D' }}>
              {fraisLivraison === 0 ? '🎉 Gratuite' : `${fraisLivraison.toLocaleString('fr-FR')} CFA`}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center py-4" style={{ borderTop: '2px solid #F3F4F6', borderBottom: '2px solid #F3F4F6' }}>
          <span className="font-black text-[15px]" style={{ color: '#0D0D0D' }}>Total</span>
          <span className="font-black text-[24px]" style={{ color: '#1B6B3A' }}>
            {totalFinal.toLocaleString('fr-FR')}
            <span className="text-[13px] font-bold ml-1" style={{ color: '#9CA3AF' }}>CFA</span>
          </span>
        </div>
        <div className="flex flex-col gap-1.5 mt-4">
          {['lock', 'verified_user', 'local_shipping'].map((icon, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[13px]" style={{ color: '#1B6B3A' }}>{icon}</span>
              <span className="text-[11px] font-medium" style={{ color: '#9CA3AF' }}>
                {['Paiement 100% sécurisé', 'Protection acheteur Blackmaket', 'Livraison partout au Bénin'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
