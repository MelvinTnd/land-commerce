'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
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

// Composant input réutilisable
function Field({ label, type = 'text', value, onChange, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        className="w-full px-4 py-3 text-[13px] outline-none border border-gray-200 transition-colors bg-white"
        style={{ color: '#0D0D0D', cursor: disabled ? 'default' : 'text', background: disabled ? '#F9FAFB' : 'white' }}
        onFocus={e => !disabled && (e.target.style.borderColor = '#0D0D0D')}
        onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
      />
    </div>
  )
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

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/connexion'); return }
    if (status !== 'authenticated' || !session?.user) return

    const user = session.user
    const nameParts = (user.name || '').split(' ')
    setProfil({ prenom: nameParts[0] || '', nom: nameParts.slice(1).join(' ') || '', email: user.email || '', telephone: user.phone || '' })

    getOrders(session.user.apiToken).then(data => {
      if (!Array.isArray(data)) return
      setCommandes(data.map(cmd => ({
        id: cmd.reference, date: new Date(cmd.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        statut: cmd.status, total: parseFloat(cmd.total_amount),
        articles: (cmd.items || []).map(i => ({
          nom: i.product_name, prix: parseFloat(i.unit_price), qte: i.quantity,
          image: 'https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80'
        }))
      })))
    }).catch(() => {})

    if (session?.user?.apiToken) {
      getAddresses(session.user.apiToken).then(d => setAddresses(Array.isArray(d) ? d : [])).catch(() => setAddresses([]))
    }
  }, [status, session, router])

  const handleLogout = async () => { await signOut({ redirect: false }); router.push('/connexion') }

  const handleSaveProfile = async () => {
    setSavingProfile(true); setProfileMsg('')
    try {
      const res = await updateProfile({ name: `${profil.prenom} ${profil.nom}`.trim(), email: profil.email, phone: profil.telephone }, session.user.apiToken)
      setProfileMsg('Profil mis à jour avec succès'); setEditMode(false)
      if (res.user) await update({ name: res.user.name, email: res.user.email })
    } catch (err) { setProfileMsg(err.message || 'Erreur lors de la mise à jour') }
    setSavingProfile(false)
  }

  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password) return
    if (passwordForm.new_password.length < 8) { setPasswordMsg('Le mot de passe doit contenir au moins 8 caractères'); return }
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) { setPasswordMsg('Les mots de passe ne correspondent pas'); return }
    setChangingPassword(true); setPasswordMsg('')
    try {
      await changePassword(passwordForm, session.user.apiToken)
      setPasswordMsg('Mot de passe mis à jour avec succès')
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) { setPasswordMsg(err.message || 'Erreur lors du changement') }
    setChangingPassword(false)
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Supprimer votre compte ? Cette action est irréversible.')) return
    setDeletingAccount(true)
    try { await deleteAccount(session.user.apiToken); await signOut({ redirect: false }); router.push('/') }
    catch (err) { alert(err.message || 'Erreur') }
    setDeletingAccount(false)
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
      setShowAddressForm(false); setEditingAddress(null)
    } catch (err) { alert(err.message || 'Erreur lors de l\'enregistrement') }
    setSavingAddress(false)
  }

  const onglets = [
    { id: 'commandes', label: 'Commandes', icon: 'receipt_long', count: commandes.length },
    { id: 'avis', label: 'Mes Avis', icon: 'star' },
    { id: 'profil', label: 'Profil', icon: 'person' },
    { id: 'adresses', label: 'Adresses', icon: 'location_on', count: addresses.length },
    { id: 'securite', label: 'Sécurité', icon: 'lock' },
  ]

  const user = session?.user

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#F7F5F0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
            <span>/</span>
            <span style={{ color: '#0D0D0D' }}>Mon Compte</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center text-xl font-black text-white" style={{ background: '#1B6B3A' }}>
              {profil.prenom.charAt(0)}{profil.nom.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>
                {profil.prenom} {profil.nom}
              </h1>
              <p className="text-[13px] font-medium" style={{ color: '#9CA3AF' }}>{profil.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white" style={{ border: '1px solid #E5E7EB' }}>
              {onglets.map(tab => (
                <button key={tab.id} onClick={() => setOnglet(tab.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
                  style={{
                    background: onglet === tab.id ? '#F7F5F0' : 'transparent',
                    borderLeft: `2px solid ${onglet === tab.id ? '#1B6B3A' : 'transparent'}`,
                    borderBottom: '1px solid #F0EDE8',
                  }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: onglet === tab.id ? '#1B6B3A' : '#9CA3AF' }}>
                    {tab.icon}
                  </span>
                  <span className="text-[13px] font-bold flex-1" style={{ color: onglet === tab.id ? '#0D0D0D' : '#6B7280' }}>
                    {tab.label}
                  </span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-black"
                      style={{ background: onglet === tab.id ? '#1B6B3A' : '#F3F4F6', color: onglet === tab.id ? 'white' : '#9CA3AF' }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-red-50"
                style={{ borderLeft: '2px solid transparent' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#EF4444' }}>logout</span>
                <span className="text-[13px] font-bold" style={{ color: '#EF4444' }}>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* ── Contenu ── */}
          <div className="lg:col-span-3">

            {/* COMMANDES */}
            {onglet === 'commandes' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-[18px] font-black" style={{ color: '#0D0D0D' }}>Mes Commandes</h2>
                {commandes.length === 0 ? (
                  <div className="bg-white p-10 text-center flex flex-col items-center" style={{ border: '1px solid #E5E7EB' }}>
                    <span className="material-symbols-outlined text-[48px] mb-4" style={{ color: '#D1D5DB' }}>receipt_long</span>
                    <p className="font-bold mb-4" style={{ color: '#374151' }}>Aucune commande pour le moment</p>
                    <Link href="/produits"
                      className="px-6 py-2.5 font-black text-[11px] uppercase tracking-widest text-white"
                      style={{ background: '#1B6B3A' }}>
                      Découvrir les produits
                    </Link>
                  </div>
                ) : commandes.map(cmd => {
                  const s = statutConfig[cmd.statut] || statutConfig.en_attente
                  return (
                    <div key={cmd.id} className="bg-white overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F0EDE8', background: '#FAFAF8' }}>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Commande</p>
                            <p className="text-[13px] font-black" style={{ color: '#0D0D0D' }}>{cmd.id}</p>
                          </div>
                          <div className="h-8 w-px bg-gray-200" />
                          <p className="text-[12px]" style={{ color: '#6B7280' }}>{cmd.date}</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1" style={{ background: s.bg }}>
                          <span className="material-symbols-outlined text-[13px]" style={{ color: s.color }}>{s.icon}</span>
                          <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: s.color }}>{s.label}</span>
                        </div>
                      </div>
                      <div className="px-6 py-4 flex flex-col gap-3">
                        {cmd.articles.map((a, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 overflow-hidden shrink-0 relative bg-gray-100">
                              <Image src={a.image} alt={a.nom} fill className="object-cover" sizes="48px" unoptimized />
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px] font-bold" style={{ color: '#0D0D0D' }}>{a.nom}</p>
                              <p className="text-[11px]" style={{ color: '#9CA3AF' }}>Qté : {a.qte}</p>
                            </div>
                            <p className="text-[13px] font-black" style={{ color: '#0D0D0D' }}>{(a.prix * a.qte).toLocaleString('fr-FR')} FCFA</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #F0EDE8' }}>
                        <div className="flex gap-2">
                          <button onClick={() => setReceiptOpen(receiptOpen === cmd.id ? null : cmd.id)}
                            className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors border"
                            style={{ borderColor: '#E5E7EB', color: '#374151', background: receiptOpen === cmd.id ? '#0D0D0D' : 'white', color: receiptOpen === cmd.id ? 'white' : '#374151' }}>
                            <span className="material-symbols-outlined text-[14px]">receipt</span>
                            {receiptOpen === cmd.id ? 'Masquer' : 'Reçu'}
                          </button>
                          {cmd.statut === 'livree' && (
                            <button onClick={() => setOnglet('avis')}
                              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white"
                              style={{ background: '#1B6B3A' }}>
                              <span className="material-symbols-outlined text-[14px]">star</span>
                              Avis
                            </button>
                          )}
                        </div>
                        <p className="text-[16px] font-black" style={{ color: '#1B6B3A' }}>{cmd.total.toLocaleString('fr-FR')} FCFA</p>
                      </div>

                      {/* Reçu */}
                      {receiptOpen === cmd.id && (
                        <div className="px-6 py-5 flex flex-col gap-2" style={{ borderTop: '1px dashed #D1D5DB', background: '#FAFAF8' }}>
                          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Reçu de paiement</p>
                          {[
                            ['Référence', cmd.id],
                            ['Date', cmd.date],
                            ['Statut', s.label],
                          ].map(([k, v]) => (
                            <div key={k} className="flex justify-between py-2" style={{ borderBottom: '1px solid #F0EDE8' }}>
                              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{k}</span>
                              <span className="text-[12px] font-black" style={{ color: '#0D0D0D' }}>{v}</span>
                            </div>
                          ))}
                          {cmd.articles.map((a, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="text-[12px]" style={{ color: '#374151' }}>{a.nom} × {a.qte}</span>
                              <span className="text-[12px] font-bold">{(a.prix * a.qte).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-3 mt-1" style={{ borderTop: '2px solid #1B6B3A' }}>
                            <span className="font-black text-[13px]">Total</span>
                            <span className="font-black text-[13px]" style={{ color: '#1B6B3A' }}>{cmd.total.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {onglet === 'avis' && <ReviewsSection />}

            {/* PROFIL */}
            {onglet === 'profil' && (
              <div className="bg-white p-6 md:p-8" style={{ border: '1px solid #E5E7EB' }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[18px] font-black" style={{ color: '#0D0D0D' }}>Informations Personnelles</h2>
                  <button
                    onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest border transition-colors disabled:opacity-50"
                    style={editMode
                      ? { background: '#1B6B3A', color: 'white', borderColor: '#1B6B3A' }
                      : { background: 'white', color: '#0D0D0D', borderColor: '#E5E7EB' }}>
                    <span className="material-symbols-outlined text-[14px]">{editMode ? 'check' : 'edit'}</span>
                    {savingProfile ? 'Enregistrement...' : editMode ? 'Enregistrer' : 'Modifier'}
                  </button>
                </div>
                {profileMsg && (
                  <div className={`mb-4 px-4 py-3 text-[13px] font-bold border ${profileMsg.includes('succès') ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-600'}`}>
                    {profileMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: 'prenom', label: 'Prénom', type: 'text', placeholder: 'Votre prénom' },
                    { key: 'nom', label: 'Nom', type: 'text', placeholder: 'Votre nom' },
                    { key: 'email', label: 'Email', type: 'email', placeholder: 'email@exemple.bj' },
                    { key: 'telephone', label: 'Téléphone', type: 'tel', placeholder: '+229 97 00 00 00' },
                  ].map(f => (
                    <Field key={f.key} label={f.label} type={f.type} placeholder={f.placeholder}
                      value={profil[f.key]} disabled={!editMode}
                      onChange={e => {
                        if (f.type === 'tel' && !/^[0-9+ \-]*$/.test(e.target.value)) return
                        setProfil({ ...profil, [f.key]: e.target.value })
                      }} />
                  ))}
                </div>
              </div>
            )}

            {/* ADRESSES */}
            {onglet === 'adresses' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-black" style={{ color: '#0D0D0D' }}>Adresses de Livraison</h2>
                  <button onClick={() => { setEditingAddress(null); setAddressForm(emptyAddress); setShowAddressForm(true) }}
                    className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white"
                    style={{ background: '#1B6B3A' }}>
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Ajouter
                  </button>
                </div>

                {addresses.length === 0 && !showAddressForm && (
                  <div className="bg-white p-10 text-center" style={{ border: '1px solid #E5E7EB' }}>
                    <span className="material-symbols-outlined text-[48px] block mb-3" style={{ color: '#D1D5DB' }}>location_off</span>
                    <p className="font-bold" style={{ color: '#374151' }}>Aucune adresse enregistrée</p>
                  </div>
                )}

                {addresses.map(adr => (
                  <div key={adr.id} className="bg-white p-5 flex items-start gap-4"
                    style={{ border: adr.is_default ? '1px solid #1B6B3A' : '1px solid #E5E7EB', borderLeft: adr.is_default ? '3px solid #1B6B3A' : '1px solid #E5E7EB' }}>
                    <span className="material-symbols-outlined text-[20px] mt-0.5" style={{ color: adr.is_default ? '#1B6B3A' : '#9CA3AF' }}>location_on</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[14px] font-black" style={{ color: '#0D0D0D' }}>{adr.label}</p>
                        {adr.is_default && (
                          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest"
                            style={{ background: 'rgba(27,107,58,0.1)', color: '#1B6B3A' }}>Par défaut</span>
                        )}
                      </div>
                      <p className="text-[13px] font-medium" style={{ color: '#374151' }}>{adr.nom_complet}</p>
                      <p className="text-[12px]" style={{ color: '#9CA3AF' }}>{adr.adresse}, {adr.quartier}, {adr.ville}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {!adr.is_default && (
                        <button onClick={() => updateAddress(adr.id, { ...adr, is_default: true }, session.user.apiToken).then(() => setAddresses(prev => prev.map(a => a.id === adr.id ? { ...a, is_default: true } : { ...a, is_default: false })))}
                          className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-gray-900 transition-colors">
                          <span className="material-symbols-outlined text-[16px]" style={{ color: '#6B7280' }}>check</span>
                        </button>
                      )}
                      <button onClick={() => { setEditingAddress(adr); setAddressForm(adr); setShowAddressForm(true) }}
                        className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-gray-900 transition-colors">
                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#6B7280' }}>edit</span>
                      </button>
                      <button onClick={() => { if (window.confirm('Supprimer cette adresse ?')) { setDeletingId(adr.id); deleteAddress(adr.id, session.user.apiToken).then(() => setAddresses(prev => prev.filter(a => a.id !== adr.id))).finally(() => setDeletingId(null)) } }}
                        disabled={deletingId === adr.id}
                        className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-red-400 transition-colors disabled:opacity-50">
                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#EF4444' }}>delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                {showAddressForm && (
                  <div className="bg-white p-6" style={{ border: '1px solid #0D0D0D' }}>
                    <h3 className="font-black text-[15px] mb-5" style={{ color: '#0D0D0D' }}>
                      {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'nom_complet', label: 'Nom complet', placeholder: 'Votre nom' },
                        { key: 'telephone', label: 'Téléphone', placeholder: '+229 97 00 00 00', type: 'tel' },
                        { key: 'ville', label: 'Ville', placeholder: 'Cotonou' },
                        { key: 'quartier', label: 'Quartier', placeholder: 'Cadjehoun' },
                      ].map(f => (
                        <Field key={f.key} label={f.label} type={f.type || 'text'} placeholder={f.placeholder}
                          value={addressForm[f.key]}
                          onChange={e => {
                            if (f.type === 'tel' && !/^[0-9+ \-]*$/.test(e.target.value)) return
                            setAddressForm({ ...addressForm, [f.key]: e.target.value })
                          }} />
                      ))}
                      <div className="sm:col-span-2">
                        <Field label="Adresse" placeholder="Rue, numéro, repère..."
                          value={addressForm.adresse}
                          onChange={e => setAddressForm({ ...addressForm, adresse: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={handleSaveAddress} disabled={savingAddress}
                        className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-50"
                        style={{ background: '#1B6B3A' }}>
                        {savingAddress ? 'Enregistrement...' : editingAddress ? 'Mettre à jour' : 'Ajouter'}
                      </button>
                      <button onClick={() => { setShowAddressForm(false); setEditingAddress(null) }}
                        className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest border border-gray-200 transition-colors hover:border-gray-900"
                        style={{ color: '#6B7280' }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SÉCURITÉ */}
            {onglet === 'securite' && (
              <div className="flex flex-col gap-5">
                <h2 className="text-[18px] font-black" style={{ color: '#0D0D0D' }}>Sécurité du Compte</h2>

                <div className="bg-white p-6 md:p-8" style={{ border: '1px solid #E5E7EB' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>key</span>
                    <h3 className="font-black text-[15px]" style={{ color: '#0D0D0D' }}>Changer le mot de passe</h3>
                  </div>
                  {passwordMsg && (
                    <div className={`mb-4 px-4 py-3 text-[13px] font-bold border ${passwordMsg.includes('succès') ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-600'}`}>
                      {passwordMsg}
                    </div>
                  )}
                  <div className="flex flex-col gap-4 max-w-md">
                    {[
                      { key: 'current_password', label: 'Mot de passe actuel', placeholder: '••••••••' },
                      { key: 'new_password', label: 'Nouveau mot de passe', placeholder: 'Min. 8 caractères' },
                      { key: 'new_password_confirmation', label: 'Confirmer', placeholder: 'Répéter le mot de passe' },
                    ].map(f => (
                      <Field key={f.key} type="password" label={f.label} placeholder={f.placeholder}
                        value={passwordForm[f.key]}
                        onChange={e => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })} />
                    ))}
                    <button onClick={handleChangePassword}
                      disabled={changingPassword || !passwordForm.current_password || !passwordForm.new_password}
                      className="self-start px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-50"
                      style={{ background: '#1B6B3A' }}>
                      {changingPassword ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8" style={{ border: '1px solid #FEE2E2', borderLeft: '3px solid #EF4444' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: '#EF4444' }}>warning</span>
                    <h3 className="font-black text-[15px]" style={{ color: '#EF4444' }}>Zone Dangereuse</h3>
                  </div>
                  <p className="text-[13px] mb-4" style={{ color: '#6B7280' }}>
                    La suppression de votre compte entraînera la perte de toutes vos données.
                  </p>
                  <button onClick={handleDeleteAccount} disabled={deletingAccount}
                    className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest border border-red-400 transition-colors hover:bg-red-500 hover:text-white hover:border-red-500 disabled:opacity-50"
                    style={{ color: '#EF4444' }}>
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
