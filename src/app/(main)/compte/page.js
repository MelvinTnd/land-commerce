'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { getOrders } from '@/lib/api'

const adresses = [
  { id: 1, label: 'Domicile', nom: 'Marie Adjovi', telephone: '+229 96 12 34 56', rue: '15 Rue du Commerce', quartier: 'Cadjèhoun', ville: 'Cotonou', defaut: true },
  { id: 2, label: 'Bureau', nom: 'Marie Adjovi', telephone: '+229 97 65 43 21', rue: '8 Boulevard de la Marina', quartier: 'Ganhi', ville: 'Cotonou', defaut: false },
]

const statutConfig = {
  en_attente: { label: 'En attente', color: '#F59E0B', bg: '#FEF3C7', icon: 'schedule' },
  payee: { label: 'Payée', color: '#3B82F6', bg: '#EFF6FF', icon: 'check_circle' },
  en_livraison: { label: 'En livraison', color: '#D4920A', bg: '#FEF3C7', icon: 'local_shipping' },
  livree: { label: 'Livrée', color: '#1B6B3A', bg: '#F0FDF4', icon: 'done_all' },
  annulee: { label: 'Annulée', color: '#EF4444', bg: '#FEF2F2', icon: 'cancel' },
}

export default function ComptePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [onglet, setOnglet] = useState('commandes')
  const [profil, setProfil] = useState({ nom: '', prenom: '', email: '', telephone: '', membreDepuis: '' })
  const [editMode, setEditMode] = useState(false)
  const [commandes, setCommandes] = useState([])

  useEffect(() => {
    // Le middleware gère la protection, mais on garde un fallback
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
      telephone: '',
      membreDepuis: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    })

    // Chargement des commandes via API avec le token de la session
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
  }, [status, session, router])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/connexion')
  }

  const onglets = [
    { id: 'commandes', label: 'Mes Commandes', icon: 'receipt_long', count: commandes.length },
    { id: 'profil', label: 'Mon Profil', icon: 'person' },
    { id: 'adresses', label: 'Mes Adresses', icon: 'location_on', count: adresses.length },
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
                Membre depuis {profil.membreDepuis} · {profil.email}
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
                  {tab.count && (
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
                {commandes.map((cmd) => {
                  const s = statutConfig[cmd.statut]
                  return (
                    <div key={cmd.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                      {/* En-tête commande */}
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
                      {/* Articles */}
                      <div className="px-6 py-4 flex flex-col gap-3">
                        {cmd.articles.map((a, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                              <Image src={a.image} alt={a.nom} fill className="object-cover" sizes="56px" />
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
                      {/* Footer */}
                      <div className="flex items-center justify-between px-6 py-4" style={{ background: '#FAFAF8', borderTop: '1px solid #F0EDE8' }}>
                        <div className="flex gap-3">
                          {cmd.statut === 'livrée' && (
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: '#1B6B3A' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
                              Laisser un avis
                            </button>
                          )}
                          {cmd.statut === 'en_livraison' && (
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold" style={{ background: '#FEF3C7', color: '#D4920A' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>pin_drop</span>
                              Suivre le colis
                            </button>
                          )}
                          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>receipt</span>
                            Facture
                          </button>
                        </div>
                        <p className="text-base font-extrabold" style={{ color: '#1B6B3A' }}>
                          {cmd.total.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* === PROFIL === */}
            {onglet === 'profil' && (
              <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid #E5E7EB' }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Informations Personnelles</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all"
                    style={editMode ? { background: '#1B6B3A', color: 'white' } : { border: '1px solid #E5E7EB', color: '#374151' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{editMode ? 'check' : 'edit'}</span>
                    {editMode ? 'Enregistrer' : 'Modifier'}
                  </button>
                </div>
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
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white" style={{ background: '#1B6B3A' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    Ajouter
                  </button>
                </div>
                {adresses.map((adr) => (
                  <div key={adr.id} className="bg-white rounded-2xl p-6 flex items-start gap-4" style={{ border: adr.defaut ? '2px solid #1B6B3A' : '1px solid #E5E7EB' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: adr.defaut ? '#F0FDF4' : '#F7F5F0' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: adr.defaut ? '#1B6B3A' : '#9CA3AF' }}>location_on</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-extrabold" style={{ color: '#1A1A1A' }}>{adr.label}</p>
                        {adr.defaut && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#F0FDF4', color: '#1B6B3A' }}>Par défaut</span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: '#374151' }}>{adr.nom}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>{adr.rue}, {adr.quartier}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>{adr.ville}</p>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{adr.telephone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors" style={{ border: '1px solid #E5E7EB' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6B7280' }}>edit</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" style={{ border: '1px solid #E5E7EB' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#EF4444' }}>delete</span>
                      </button>
                    </div>
                  </div>
                ))}
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
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>Dernière modification : il y a 30 jours</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 max-w-md">
                    {[
                      { label: 'Mot de passe actuel', placeholder: '••••••••' },
                      { label: 'Nouveau mot de passe', placeholder: 'Min. 8 caractères' },
                      { label: 'Confirmer', placeholder: 'Répéter le mot de passe' },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>{f.label}</label>
                        <input type="password" placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F5F0', border: '2px solid transparent' }} />
                      </div>
                    ))}
                    <button className="self-start px-6 py-2.5 rounded-full text-sm font-bold text-white mt-2" style={{ background: '#1B6B3A' }}>
                      Mettre à jour
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
                  <button className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ border: '1px solid #EF4444', color: '#EF4444' }}>
                    Supprimer mon compte
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
