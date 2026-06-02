'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { getOrders, getAddresses, createAddress, updateAddress, deleteAddress, updateProfile, changePassword, deleteAccount } from '@/lib/api'
import ReviewsSection from '@/components/compte/ReviewsSection'

const statutConfig = {
  en_attente: { label: 'En attente', color: '#F59E0B', bg: '#FEF3C7', icon: 'schedule' },
  payee: { label: 'Payée', color: '#3B82F6', bg: '#EFF6FF', icon: 'check_circle' },
  en_livraison: { label: 'En livraison', color: '#D4920A', bg: '#FEF3C7', icon: 'local_shipping' },
  livree: { label: 'Livrée', color: '#1B6B3A', bg: '#F0FDF4', icon: 'done_all' },
  annulee: { label: 'Annulée', color: '#EF4444', bg: '#FEF2F2', icon: 'cancel' },
}

const emptyAddress = {
  label: 'Domicile', nom_complet: '', telephone: '',
  ville: '', quartier: '', adresse: '', instructions: '', is_default: false,
}

export default function ComptePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [onglet, setOnglet] = useState('commandes')
  const [profil, setProfil] = useState({ nom: '', prenom: '', email: '', telephone: '' })
  const [editMode, setEditMode] = useState(false)
  const [commandes, setCommandes] = useState([])
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [savingAddress, setSavingAddress] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  const [deletingAccount, setDeletingAccount] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(null)

  const loadAddresses = useCallback(async () => {
    if (!session?.user?.apiToken) return
    try {
      const data = await getAddresses(session.user.apiToken)
      setAddresses(Array.isArray(data) ? data : [])
    } catch { setAddresses([]) }
  }, [session])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion')
      return
    }
    if (status !== 'authenticated' || !session?.user) return

    const user = session.user
    const nameParts = (user.name || '').split(' ')
    setProfil({
      prenom: nameParts[0] || '',
      nom: nameParts.slice(1).join(' ') || '',
      email: user.email || '',
      telephone: user.phone || '',
    })

    getOrders(session.user.apiToken).then(data => {
      if (!Array.isArray(data)) return
      setCommandes(data.map(cmd => ({
        id: cmd.reference,
        date: new Date(cmd.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        statut: cmd.status,
        total: parseFloat(cmd.total_amount),
        articles: (cmd.items || []).map(i => ({
          nom: i.product_name,
          prix: parseFloat(i.unit_price),
          qte: i.quantity,
          image: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80'
        }))
      })))
    }).catch(() => {})

    loadAddresses()
  }, [status, session, router, loadAddresses])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/connexion')
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    setProfileMsg('')
    try {
      const res = await updateProfile({
        name: `${profil.prenom} ${profil.nom}`.trim(),
        email: profil.email,
        phone: profil.telephone,
      }, session.user.apiToken)
      setProfileMsg('Profil mis à jour avec succès')
      setEditMode(false)
      if (res.user) {
        await update({ name: res.user.name, email: res.user.email })
      }
    } catch (err) {
      setProfileMsg(err.message || 'Erreur lors de la mise à jour')
    }
    setSavingProfile(false)
  }

  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password) return
    if (passwordForm.new_password.length < 8) {
      setPasswordMsg('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordMsg('Les mots de passe ne correspondent pas')
      return
    }
    setChangingPassword(true)
    setPasswordMsg('')
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      }, session.user.apiToken)
      setPasswordMsg('Mot de passe mis à jour avec succès')
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      setPasswordMsg(err.message || 'Erreur lors du changement de mot de passe')
    }
    setChangingPassword(false)
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return
    if (!window.confirm('Cette action supprimera toutes vos données, commandes et adresses. Confirmez-vous ?')) return
    setDeletingAccount(true)
    try {
      await deleteAccount(session.user.apiToken)
      await signOut({ redirect: false })
      router.push('/')
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression')
    }
    setDeletingAccount(false)
  }

  const openAddAddress = () => {
    setEditingAddress(null)
    setAddressForm(emptyAddress)
    setShowAddressForm(true)
  }

  const openEditAddress = (addr) => {
    setEditingAddress(addr)
    setAddressForm({
      label: addr.label || 'Domicile',
      nom_complet: addr.nom_complet || '',
      telephone: addr.telephone || '',
      ville: addr.ville || '',
      quartier: addr.quartier || '',
      adresse: addr.adresse || '',
      instructions: addr.instructions || '',
      is_default: addr.is_default || false,
    })
    setShowAddressForm(true)
  }

  const handleSaveAddress = async () => {
    setSavingAddress(true)
    try {
      if (editingAddress) {
        const updated = await updateAddress(editingAddress.id, addressForm, session.user.apiToken)
        setAddresses(prev => prev.map(a => a.id === editingAddress.id ? updated : a))
      } else {
        const created = await createAddress(addressForm, session.user.apiToken)
        setAddresses(prev => [...prev, created])
      }
      setShowAddressForm(false)
      setEditingAddress(null)
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'enregistrement de l\'adresse')
    }
    setSavingAddress(false)
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Supprimer cette adresse ?')) return
    setDeletingId(id)
    try {
      await deleteAddress(id, session.user.apiToken)
      setAddresses(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression')
    }
    setDeletingId(null)
  }

  const handleSetDefaultAddress = async (addr) => {
    try {
      const updated = await updateAddress(addr.id, { ...addr, is_default: true }, session.user.apiToken)
      setAddresses(prev => prev.map(a => a.id === addr.id ? updated : { ...a, is_default: false }))
    } catch (err) {
      alert(err.message || 'Erreur')
    }
  }

  const onglets = [
    { id: 'commandes', label: 'Mes Commandes', icon: 'receipt_long', count: commandes.length },
    { id: 'avis', label: 'Mes Avis', icon: 'star' },
    { id: 'profil', label: 'Mon Profil', icon: 'person' },
    { id: 'adresses', label: 'Mes Adresses', icon: 'location_on', count: addresses.length },
    { id: 'securite', label: 'Sécurité', icon: 'lock' },
  ]

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #F0EDE8' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-green-800 transition-colors">Accueil</Link>
            <span>›</span>
            <span style={{ color: '#1A1A1A', fontWeight: '600' }}>Mon Compte</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white" style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)' }}>
              {profil.prenom.charAt(0)}{profil.nom.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A1A' }}>
                {profil.prenom} {profil.nom}
              </h1>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                {profil.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
              {onglets.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setOnglet(tab.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left transition-all hover:bg-gray-50"
                  style={{
                    background: onglet === tab.id ? '#F0FDF4' : 'transparent',
                    borderLeft: onglet === tab.id ? '3px solid #1B6B3A' : '3px solid transparent',
                    borderBottom: '1px solid #F0EDE8',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: onglet === tab.id ? '#1B6B3A' : '#9CA3AF' }}>
                    {tab.icon}
                  </span>
                  <span className="text-sm font-semibold flex-1" style={{ color: onglet === tab.id ? '#1B6B3A' : '#374151' }}>
                    {tab.label}
                  </span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: onglet === tab.id ? '#1B6B3A' : '#E5E7EB', color: onglet === tab.id ? 'white' : '#6B7280' }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-left transition-all hover:bg-red-50" style={{ borderLeft: '3px solid transparent' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#EF4444' }}>logout</span>
                <span className="text-sm font-semibold" style={{ color: '#EF4444' }}>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">

            {/* === COMMANDES === */}
            {onglet === 'commandes' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Mes Commandes</h2>
                </div>
                {commandes.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center" style={{ border: '1px solid #E5E7EB' }}>
                    <span className="material-symbols-outlined text-5xl block mb-4" style={{ color: '#D1D5DB' }}>receipt_long</span>
                    <p className="font-bold" style={{ color: '#374151' }}>Aucune commande pour le moment</p>
                    <Link href="/produits" className="inline-block mt-4 px-6 py-2.5 rounded-full text-sm font-bold text-white" style={{ background: '#1B6B3A' }}>
                      Découvrir les produits
                    </Link>
                  </div>
                ) : commandes.map((cmd) => {
                  const s = statutConfig[cmd.statut] || statutConfig.en_attente
                  return (
                    <div key={cmd.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F0EDE8' }}>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Commande</p>
                            <p className="text-sm font-extrabold" style={{ color: '#1A1A1A' }}>{cmd.id}</p>
                          </div>
                          <div className="h-8 w-px" style={{ background: '#E5E7EB' }} />
                          <p className="text-xs" style={{ color: '#6B7280' }}>{cmd.date}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: s.bg }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: s.color }}>{s.icon}</span>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{s.label}</span>
                        </div>
                      </div>
                      <div className="px-6 py-4 flex flex-col gap-3">
                        {cmd.articles.map((a, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                              <Image src={a.image} alt={a.nom} fill className="object-cover" sizes="56px" unoptimized />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{a.nom}</p>
                              <p className="text-xs" style={{ color: '#9CA3AF' }}>Qté : {a.qte}</p>
                            </div>
                            <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>
                              {(a.prix * a.qte).toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-6 py-4" style={{ background: '#FAFAF8', borderTop: '1px solid #F0EDE8' }}>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setReceiptOpen(receiptOpen === cmd.id ? null : cmd.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
                            style={{
                              background: receiptOpen === cmd.id ? '#1B6B3A' : '#F0FDF4',
                              color: receiptOpen === cmd.id ? 'white' : '#1B6B3A',
                            }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>receipt</span>
                            {receiptOpen === cmd.id ? 'Masquer' : 'Voir le reçu'}
                          </button>
                          {cmd.statut === 'livree' && (
                            <button onClick={() => setOnglet('avis')} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: '#1B6B3A' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
                              Laisser un avis
                            </button>
                          )}
                        </div>
                        <p className="text-base font-extrabold" style={{ color: '#1B6B3A' }}>
                          {cmd.total.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                      {receiptOpen === cmd.id && (
                        <div style={{ borderTop: '1px dashed #D1D5DB', background: '#FAFAF8' }}>
                          <div className="px-6 py-5 flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="material-symbols-outlined text-[16px]" style={{ color: '#1B6B3A' }}>receipt_long</span>
                              <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#0D0D0D' }}>Reçu de paiement</span>
                            </div>
                            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid #E5E7EB' }}>
                              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Référence</span>
                              <span className="text-xs font-extrabold" style={{ color: '#0D0D0D' }}>{cmd.id}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid #E5E7EB' }}>
                              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Date</span>
                              <span className="text-xs font-bold" style={{ color: '#374151' }}>{cmd.date}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid #E5E7EB' }}>
                              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Statut</span>
                              <span className="text-xs font-bold" style={{ color: s.color }}>{s.label}</span>
                            </div>
                            {cmd.articles.map((a, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div>
                                  <span className="text-xs font-medium" style={{ color: '#374151' }}>{a.nom}</span>
                                  <span className="text-[10px] ml-2" style={{ color: '#9CA3AF' }}>x{a.qte}</span>
                                </div>
                                <span className="text-xs font-bold" style={{ color: '#0D0D0D' }}>{(a.prix * a.qte).toLocaleString('fr-FR')} FCFA</span>
                              </div>
                            ))}
                            <div style={{ borderTop: '1.5px solid #1B6B3A', marginTop: 4, paddingTop: 10 }}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-extrabold" style={{ color: '#0D0D0D' }}>Total</span>
                                <span className="text-sm font-extrabold" style={{ color: '#1B6B3A' }}>
                                  {cmd.total.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-[10px]" style={{ color: '#9CA3AF' }}>
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              Paiement Mobile Money confirmé
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* === AVIS === */}
            {onglet === 'avis' && <ReviewsSection />}

            {/* === PROFIL === */}
            {onglet === 'profil' && (
              <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid #E5E7EB' }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Informations Personnelles</h2>
                  <button
                    onClick={() => {
                      if (editMode) {
                        handleSaveProfile()
                      } else {
                        setEditMode(true)
                      }
                    }}
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all disabled:opacity-50"
                    style={editMode ? { background: '#1B6B3A', color: 'white' } : { border: '1px solid #E5E7EB', color: '#374151' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{editMode ? 'check' : 'edit'}</span>
                    {savingProfile ? 'Enregistrement...' : editMode ? 'Enregistrer' : 'Modifier'}
                  </button>
                </div>
                {profileMsg && (
                  <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-bold ${profileMsg.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {profileMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'prenom', label: 'Prénom', type: 'text' },
                    { key: 'nom', label: 'Nom', type: 'text' },
                    { key: 'email', label: 'Email', type: 'email' },
                    { key: 'telephone', label: 'Téléphone', type: 'tel' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{field.label}</label>
                      <input
                        type={field.type}
                        value={profil[field.key]}
                        disabled={!editMode}
                        onChange={(e) => setProfil({ ...profil, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          background: editMode ? '#F7F5F0' : '#FAFAF8',
                          border: editMode ? '2px solid #E5E7EB' : '2px solid transparent',
                          color: '#1A1A1A',
                          cursor: editMode ? 'text' : 'default',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* === ADRESSES === */}
            {onglet === 'adresses' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Adresses de Livraison</h2>
                  <button onClick={openAddAddress} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white" style={{ background: '#1B6B3A' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    Ajouter
                  </button>
                </div>

                {addresses.length === 0 && !showAddressForm && (
                  <div className="bg-white rounded-2xl p-10 text-center" style={{ border: '1px solid #E5E7EB' }}>
                    <span className="material-symbols-outlined text-5xl block mb-4" style={{ color: '#D1D5DB' }}>location_off</span>
                    <p className="font-bold" style={{ color: '#374151' }}>Aucune adresse enregistrée</p>
                    <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Ajoutez une adresse pour faciliter vos achats</p>
                  </div>
                )}

                {addresses.map((adr) => (
                  <div key={adr.id} className="bg-white rounded-2xl p-6 flex items-start gap-4" style={{ border: adr.is_default ? '2px solid #1B6B3A' : '1px solid #E5E7EB' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: adr.is_default ? '#F0FDF4' : '#F7F5F0' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: adr.is_default ? '#1B6B3A' : '#9CA3AF' }}>location_on</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-extrabold" style={{ color: '#1A1A1A' }}>{adr.label}</p>
                        {adr.is_default && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#F0FDF4', color: '#1B6B3A' }}>Par défaut</span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: '#374151' }}>{adr.nom_complet}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>{adr.adresse}, {adr.quartier}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>{adr.ville}</p>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{adr.telephone}</p>
                    </div>
                    <div className="flex gap-2">
                      {!adr.is_default && (
                        <button onClick={() => handleSetDefaultAddress(adr)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-50 transition-colors" title="Définir par défaut" style={{ border: '1px solid #E5E7EB' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1B6B3A' }}>check_circle</span>
                        </button>
                      )}
                      <button onClick={() => openEditAddress(adr)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors" style={{ border: '1px solid #E5E7EB' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6B7280' }}>edit</span>
                      </button>
                      <button onClick={() => handleDeleteAddress(adr.id)} disabled={deletingId === adr.id} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50" style={{ border: '1px solid #E5E7EB' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#EF4444' }}>delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Formulaire ajout/édition adresse */}
                {showAddressForm && (
                  <div className="bg-white rounded-2xl p-6" style={{ border: '2px solid #1B6B3A' }}>
                    <h3 className="font-extrabold text-base mb-4" style={{ color: '#1A1A1A' }}>
                      {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Libellé</label>
                        <select value={addressForm.label} onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }}>
                          <option>Domicile</option>
                          <option>Bureau</option>
                          <option>Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Nom complet</label>
                        <input type="text" value={addressForm.nom_complet} onChange={e => setAddressForm({ ...addressForm, nom_complet: e.target.value })}
                          placeholder="Votre nom" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Téléphone</label>
                        <input type="tel" value={addressForm.telephone} onChange={e => setAddressForm({ ...addressForm, telephone: e.target.value })}
                          placeholder="+229 97 00 00 00" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Ville</label>
                        <input type="text" value={addressForm.ville} onChange={e => setAddressForm({ ...addressForm, ville: e.target.value })}
                          placeholder="Cotonou" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Quartier</label>
                        <input type="text" value={addressForm.quartier} onChange={e => setAddressForm({ ...addressForm, quartier: e.target.value })}
                          placeholder="Cadjehoun" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Adresse</label>
                        <input type="text" value={addressForm.adresse} onChange={e => setAddressForm({ ...addressForm, adresse: e.target.value })}
                          placeholder="Rue, numéro, repère..." className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6B7280' }}>Instructions (optionnel)</label>
                        <textarea value={addressForm.instructions} onChange={e => setAddressForm({ ...addressForm, instructions: e.target.value })}
                          rows={2} placeholder="Laissez au gardien, etc." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: '#F7F5F0', border: '1.5px solid #E5E7EB' }} />
                      </div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id="is_default" checked={addressForm.is_default}
                          onChange={e => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-[#1B6B3A]" />
                        <label htmlFor="is_default" className="text-sm font-medium" style={{ color: '#374151' }}>Définir comme adresse par défaut</label>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={handleSaveAddress} disabled={savingAddress}
                        className="px-6 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-50" style={{ background: '#1B6B3A' }}>
                        {savingAddress ? 'Enregistrement...' : editingAddress ? 'Mettre à jour' : 'Ajouter'}
                      </button>
                      <button onClick={() => { setShowAddressForm(false); setEditingAddress(null) }}
                        className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* === SÉCURITÉ === */}
            {onglet === 'securite' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Sécurité du Compte</h2>

                {/* Changer mot de passe */}
                <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E5E7EB' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#1B6B3A' }}>key</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: '#1A1A1A' }}>Changer le mot de passe</h3>
                    </div>
                  </div>
                  {passwordMsg && (
                    <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-bold ${passwordMsg.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {passwordMsg}
                    </div>
                  )}
                  <div className="flex flex-col gap-4 max-w-md">
                    {[
                      { key: 'current_password', label: 'Mot de passe actuel', placeholder: '••••••••' },
                      { key: 'new_password', label: 'Nouveau mot de passe', placeholder: 'Min. 8 caractères' },
                      { key: 'new_password_confirmation', label: 'Confirmer', placeholder: 'Répéter le mot de passe' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{f.label}</label>
                        <input
                          type="password"
                          value={passwordForm[f.key]}
                          onChange={e => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ background: '#F7F5F0', border: '2px solid transparent' }}
                        />
                      </div>
                    ))}
                    <button
                      onClick={handleChangePassword}
                      disabled={changingPassword || !passwordForm.current_password || !passwordForm.new_password}
                      className="self-start px-6 py-2.5 rounded-full text-sm font-bold text-white mt-2 disabled:opacity-50"
                      style={{ background: '#1B6B3A' }}
                    >
                      {changingPassword ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                  </div>
                </div>

                {/* Supprimer compte */}
                <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #FEE2E2' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#EF4444' }}>warning</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: '#EF4444' }}>Zone Dangereuse</h3>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>Cette action est irréversible</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                    La suppression de votre compte entraînera la perte de toutes vos données, commandes et adresses enregistrées.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="px-6 py-2.5 rounded-full text-sm font-bold disabled:opacity-50"
                    style={{ border: '1px solid #EF4444', color: '#EF4444' }}
                  >
                    {deletingAccount ? 'Suppression...' : 'Supprimer mon compte'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
