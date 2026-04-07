'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function InscriptionVendeurSuite() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [ville, setVille] = useState('Cotonou')
  const [valeurs, setValeurs] = useState(['Fait main'])
  const [shopName, setShopName] = useState('')
  const [shopDescription, setShopDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Simulation de l'heure de sauvegarde pour l'étape 3
  const [saveTime, setSaveTime] = useState('')
  useEffect(() => {
    const now = new Date()
    setSaveTime(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
  }, [step])
  
  const toggleValeur = (v) => {
    if (valeurs.includes(v)) {
      setValeurs(valeurs.filter(val => val !== v))
    } else {
      setValeurs([...valeurs, v])
    }
  }

  // Soumettre la boutique au backend
  const handleFinalSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/inscription')
        return
      }

      const response = await fetch('http://localhost:8000/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: shopName || 'Atelier du Bénin',
          location: ville,
          description: shopDescription,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la boutique')
      }

      // Succès ! Afficher l'écran de félicitations
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Écran de Succès (Ancienne Étape 4) - SANS SIDEBAR
  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center relative overflow-hidden font-sans">
        
        {/* Abstract background decorative shapes */}
        <div className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-[#86EFAC] opacity-60"></div>
        <div className="absolute top-[25%] right-[15%] w-4 h-4 bg-[#DDB389] opacity-40 transform rotate-12"></div>
        <div className="absolute bottom-[20%] left-[20%] w-2 h-2 rounded-full bg-[#FDE047] opacity-80"></div>
        <div className="absolute bottom-[10%] right-[10%] w-5 h-5 rounded-full bg-[#A7F3D0] opacity-50"></div>

        {/* Minimal Header */}
        <header className="w-full px-8 py-6 flex justify-between items-center absolute top-0 left-0">
           <h1 className="text-[#0B7A3E] text-[18px] font-extrabold tracking-tight">Heritage Marketplace</h1>
           <div className="flex gap-4 text-gray-600">
             <span className="material-symbols-outlined text-[22px] cursor-pointer hover:text-gray-900 transition-colors">notifications</span>
             <span className="material-symbols-outlined text-[22px] cursor-pointer hover:text-gray-900 transition-colors">account_circle</span>
           </div>
        </header>

        {/* Main Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl z-10 px-6 py-24 text-center mt-10">
           
           <div className="w-[84px] h-[84px] bg-[#0B7A3E] rounded-full flex items-center justify-center text-white mb-10 shadow-[0_12px_32px_-8px_rgba(11,122,62,0.6)]">
              <span className="material-symbols-outlined text-[50px]">check_circle</span>
           </div>
           
           <h2 className="text-[36px] md:text-[44px] font-extrabold text-gray-900 mb-5 tracking-tight leading-tight">
             Félicitations, votre boutique <br/>
             <span className="text-[#0B7A3E] italic">Atelier du Bénin</span> est en ligne !
           </h2>
           
           <p className="text-gray-500 text-[16px] md:text-[18px] mb-12 max-w-xl mx-auto leading-relaxed">
             Votre aventure commence ici. Nous préparons les détails finaux pour vous offrir la meilleure expérience de vente.
           </p>

           {/* Feedback Card */}
           <div className="bg-[#F3F4F6] rounded-[24px] p-6 mb-12 w-full max-w-[650px] flex items-center flex-wrap md:flex-nowrap gap-6 text-left mx-auto">
              
              {/* Logo Box */}
              <div className="relative w-[120px] h-[120px] bg-white rounded-[20px] shadow-sm flex flex-col items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-[#0B7A3E] text-[28px] mb-1">spa</span>
                 <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-widest text-center leading-tight">Atelier<br/>du Bénin</span>
                 <div className="absolute -bottom-3 right-[-10px] bg-[#FFC107] text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">verified</span> PROFIL
                 </div>
              </div>

              {/* Info Box */}
              <div className="flex-1 min-w-[200px] py-2">
                <span className="inline-flex items-center bg-[#E5E7EB] text-gray-500 text-[10px] font-extrabold px-3 py-1.5 rounded-full mb-3 tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 bg-[#D48943] rounded-full mr-2"></span>
                  En attente de validation finale
                </span>
                <h3 className="text-[22px] font-extrabold text-gray-900 mb-2">Atelier du Bénin</h3>
                <div className="flex items-center gap-4 text-[12px] text-gray-500 font-medium">
                   <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">category</span> Artisanat</span>
                   <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> Cotonou, Bénin</span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="border-l-2 border-gray-200 pl-8 text-center shrink-0 hidden sm:block py-2 pr-4">
                <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mb-1">Produits</p>
                <p className="text-[40px] font-black text-[#0B7A3E] leading-none">0</p>
              </div>
           </div>

           {/* Buttons */}
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full">
             <Link href="/vendeur" className="w-full sm:w-auto bg-[#0B4A26] hover:bg-[#073319] text-white px-8 py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(11,74,38,0.6)] hover:shadow-none hover:translate-y-px">
               Aller vers mon Tableau de Bord <span className="material-symbols-outlined text-[20px]">dashboard</span>
             </Link>
             <button type="button" className="w-full sm:w-auto bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-700 px-8 py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2">
               Voir ma boutique publique <span className="material-symbols-outlined text-[20px]">visibility</span>
             </button>
           </div>

           {/* Footer Help text */}
           <p className="text-[13px] font-medium text-gray-500 mb-16">
             Besoin d'aide pour configurer vos produits ? <Link href="#" className="font-bold text-[#0B7A3E] hover:underline">Consultez notre guide vendeur</Link>
           </p>

           {/* Navigation Dots */}
           <div className="flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
             <div className="w-6 h-1.5 rounded-full bg-[#0B7A3E]"></div>
           </div>

        </div>
      </div>
    )
  }

  // ÉTAPES 1, 2, 3 (AVEC SIDEBAR)
  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col items-center font-sans tracking-tight">
      
      <div className="w-full bg-[#F6F7F9] flex flex-col md:flex-row min-h-screen">
        
        {/* Left Sidebar fixée */}
        <aside className="w-full md:w-[260px] lg:w-[280px] bg-white flex flex-col md:sticky md:top-0 md:self-start h-auto md:h-screen md:overflow-y-auto border-r border-gray-100 shrink-0">
          <div className="p-8">
            <h2 className="text-[#0B7A3E] text-[18px] font-bold mb-1">Détails de la boutique</h2>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-10">Étape {step} sur 3</p>
            
            <nav className="space-y-6 relative">
              {/* Step 1 */}
              <div className="flex items-start gap-4 cursor-pointer" onClick={() => setStep(1)}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step > 1 ? 'bg-[#A7F3D0] text-[#0B7A3E]' : step === 1 ? 'bg-[#0B7A3E] text-white shadow-md shadow-green-900/20' : 'bg-[#EAECEF] text-gray-500'}`}>
                  {step > 1 ? <span className="material-symbols-outlined text-[16px] font-bold">check</span> : <span className="text-sm font-bold">1</span>}
                </div>
                <div>
                  <p className={`text-[13px] font-bold hover:text-[#0B7A3E] transition-colors ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Informations de base</p>
                  <p className="text-[11px] text-gray-400 font-medium">{step > 1 ? 'Complété' : step === 1 ? 'En cours de modification' : 'À venir'}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 cursor-pointer" onClick={() => step > 1 && setStep(2)}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step > 2 ? 'bg-[#A7F3D0] text-[#0B7A3E]' : step === 2 ? 'bg-[#0B7A3E] text-white shadow-md shadow-green-900/20' : 'bg-[#EAECEF] text-gray-400'}`}>
                  {step > 2 ? <span className="material-symbols-outlined text-[16px] font-bold">check</span> : <span className="text-sm font-bold">2</span>}
                </div>
                <div>
                  <p className={`text-[13px] font-bold hover:text-[#0B7A3E] transition-colors ${step >= 2 ? (step === 2 ? 'text-[#0B7A3E]' : 'text-gray-900') : 'text-gray-400'}`}>Identité Visuelle</p>
                  <p className="text-[11px] text-gray-400 font-medium">{step > 2 ? 'Complété' : step === 2 ? 'En cours de modification' : 'À venir'}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 cursor-pointer" onClick={() => step > 2 && setStep(3)}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step > 3 ? 'bg-[#A7F3D0] text-[#0B7A3E]' : step === 3 ? 'bg-[#0B7A3E] text-white shadow-md shadow-green-900/20' : 'bg-[#EAECEF] text-gray-400'}`}>
                  {step > 3 ? <span className="material-symbols-outlined text-[16px] font-bold">check</span> : <span className="text-sm font-bold">3</span>}
                </div>
                <div>
                  <p className={`text-[13px] font-bold hover:text-[#0B7A3E] transition-colors ${step >= 3 ? (step === 3 ? 'text-[#0B7A3E]' : 'text-gray-900') : 'text-gray-400'}`}>Vérification</p>
                  <p className="text-[11px] text-gray-400 font-medium">{step > 3 ? 'Complété' : step === 3 ? 'En cours de modification' : 'À venir'}</p>
                </div>
              </div>
            </nav>
          </div>
          
          <div className="mt-auto p-6 md:p-8">
            <div className="bg-[#F8F9FA] rounded-[16px] p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-[11px] font-medium leading-[1.6] mb-3">Besoin d'aide pour raconter votre histoire ? Nos curateurs sont disponibles pour vous accompagner.</p>
              <button className="text-[#0B7A3E] text-[10px] font-black tracking-wider uppercase hover:opacity-80 transition-opacity">CONTACTER LE SUPPORT</button>
            </div>
          </div>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1 px-6 py-12 md:py-16 lg:py-20 flex justify-center overflow-y-auto">
          <div className="w-full max-w-[800px]">

            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#111827] mb-3 tracking-tight">Configurez votre boutique</h1>
                <p className="text-gray-500 text-[15px] font-medium mb-12">Présentez votre savoir-faire artisanal au monde entier.</p>

                {/* Full Restored Form Step 1 */}
                <form className="space-y-6">
                  {/* Block 1: Identité */}
                  <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="material-symbols-outlined text-[#0B4A26] text-[24px]">storefront</span>
                      <h2 className="text-lg font-bold text-gray-900 tracking-tight">Identité de la Boutique</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-2.5">Nom de l'atelier ou boutique</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Les Tissages d'Abomey" 
                          className="w-full bg-[#EAECEF] border-none rounded-[12px] px-5 py-3.5 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] transition-shadow"
                          value={shopName} onChange={e => setShopName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-2.5">Catégorie principale</label>
                        <div className="relative">
                          <select className="w-full bg-[#EAECEF] border-none rounded-[12px] px-5 py-3.5 text-[14px] text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] cursor-pointer transition-shadow">
                            <option>Artisanat</option>
                            <option>Mode & Création</option>
                            <option>Alimentation & Épices</option>
                            <option>Art & Décoration</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-gray-700 mb-3.5">Ville d'implantation</label>
                      <div className="flex flex-wrap gap-2.5">
                        {['Cotonou', 'Porto-Novo', 'Abomey', 'Parakou'].map(city => (
                          <button 
                            key={city}
                            type="button"
                            onClick={() => setVille(city)}
                            className={`px-7 py-2.5 rounded-full text-[13px] transition-all duration-200 ${ville === city ? 'bg-[#0B4A26] text-white font-bold shadow-md shadow-green-900/10 scale-105' : 'bg-[#EAECEF] text-gray-600 font-medium hover:bg-gray-300'}`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Block 2: Documents Officiels (from Mockup 1) */}
                  <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-[#0B4A26] text-[24px]">cloud_upload</span>
                      <h2 className="text-lg font-bold text-gray-900 tracking-tight">Documents Officiels</h2>
                    </div>
                    <p className="text-[13px] text-gray-500 mb-8 font-medium">Pour garantir la confiance sur Heritage Market, nous vérifions chaque artisan.</p>

                    <div className="border border-dashed border-gray-300 rounded-[20px] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-6 group">
                      <div className="w-14 h-14 bg-[#A7F3D0]/70 rounded-full flex items-center justify-center text-[#0B7A3E] mb-5 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">upload_file</span>
                      </div>
                      <p className="text-[14px] font-bold text-gray-900 mb-1">Cliquez pour téléverser vos documents</p>
                      <p className="text-[12px] text-gray-500 font-medium">Pièce d'identité ou Registre de Commerce (PDF, JPG, PNG)</p>
                    </div>

                    <div className="bg-[#F8F9FA] rounded-[16px] p-5 flex gap-4 items-start border border-gray-100">
                      <span className="material-symbols-outlined text-[#0B4A26] text-[20px] shrink-0 mt-px">info</span>
                      <p className="text-[11px] leading-[1.6] text-gray-500 font-medium pr-4">
                        Vos données sont sécurisées et utilisées uniquement pour la validation de votre compte vendeur conformément à la réglementation locale.
                      </p>
                    </div>
                  </div>

                  {/* Actions Step 1 */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 mb-16">
                    <button type="button" className="text-[14px] font-bold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                      Enregistrer le brouillon
                    </button>
                    <button type="button" onClick={() => setStep(2)} className="w-full sm:w-auto bg-[#0B4A26] hover:bg-[#073319] text-white px-8 py-3.5 rounded-full font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(11,74,38,0.6)] hover:shadow-none hover:translate-y-px">
                      Suivant : Détails Boutique <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                </form>

                {/* Value Propositions Step 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-gray-200/60 pt-16 pb-12">
                  <div className="bg-[#EAECEF]/60 rounded-[20px] p-6 hover:bg-[#EAECEF] transition-colors">
                    <span className="material-symbols-outlined text-[#0B7A3E] mb-4 text-[26px]">payments</span>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-2">Paiements Locaux</h3>
                    <p className="text-[12px] text-gray-500 leading-[1.6] font-medium">Intégration native de MTN MoMo, Moov Money et Celtiis pour vos ventes au Bénin.</p>
                  </div>
                  <div className="bg-[#EAECEF]/60 rounded-[20px] p-6 hover:bg-[#EAECEF] transition-colors">
                    <span className="material-symbols-outlined text-[#0B7A3E] mb-4 text-[26px]">public</span>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-2">Visibilité Mondiale</h3>
                    <p className="text-[12px] text-gray-500 leading-[1.6] font-medium">Vos créations sont accessibles aux clients locaux et à la diaspora internationale.</p>
                  </div>
                  <div className="bg-[#EAECEF]/60 rounded-[20px] p-6 hover:bg-[#EAECEF] transition-colors">
                    <span className="material-symbols-outlined text-[#0B7A3E] mb-4 text-[26px]">support_agent</span>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-2">Accompagnement</h3>
                    <p className="text-[12px] text-gray-500 leading-[1.6] font-medium">Une équipe dédiée pour vous aider à digitaliser votre stock et booster vos ventes.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
               <div className="animate-in fade-in duration-300">
                <h1 className="text-[28px] md:text-[38px] font-extrabold text-[#111827] mb-4 tracking-tight leading-tight">Incarnez l'héritage de votre<br/>savoir-faire.</h1>
                <p className="text-gray-500 text-[15px] font-medium mb-12 max-w-2xl leading-relaxed">Votre boutique est plus qu'un simple étalage ; c'est le reflet de votre passion. Téléchargez vos visuels et partagez l'histoire qui rend vos créations uniques.</p>
                
                {/* Full Restored Form Step 2 */}
                <form className="space-y-12">
                  
                  {/* Visuals Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-1">
                      <label className="block text-[12px] font-bold text-gray-900 mb-4">Logo de la boutique</label>
                      <div className="relative inline-block group cursor-pointer">
                        <div className="w-[140px] h-[140px] rounded-full bg-[#EAECEF]/80 flex flex-col items-center justify-center group-hover:bg-[#EAECEF] transition-colors">
                          <span className="material-symbols-outlined text-gray-400 text-[28px] mb-1">add_a_photo</span>
                          <span className="text-[9px] font-bold text-gray-400 tracking-wider">TÉLÉCHARGER</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0B7A3E] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-4 font-medium leading-relaxed max-w-[140px]">Format recommandé : PNG ou JPG carré, min. 500x500px.</p>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                       <label className="block text-[12px] font-bold text-gray-900 mb-4">Bannière de couverture</label>
                       <div className="w-full h-[180px] rounded-[16px] bg-[#EAECEF]/80 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                          <span className="material-symbols-outlined text-gray-400 text-[28px] mb-2 group-hover:scale-110 transition-transform">add_photo_alternate</span>
                          <span className="text-[10px] font-bold text-gray-400 tracking-wider">CHOISIR UNE IMAGE DE COUVERTURE</span>
                       </div>
                       <p className="text-[10px] text-gray-400 mt-3 font-medium leading-relaxed">Cette image apparaîtra en haut de votre page boutique. Utilisez une photo d'ambiance ou de votre atelier.</p>
                    </div>
                  </div>

                  {/* Description & Heritage */}
                  <div>
                    <h3 className="text-[12px] font-bold text-gray-900 mb-2">Description de la boutique & Héritage</h3>
                    <p className="text-[12px] text-gray-500 mb-4 font-medium">Racontez l'histoire derrière vos produits. Quelle est l'origine de votre savoir-faire ? Quel message souhaitez-vous transmettre ?</p>
                    
                    <div className="relative mb-8">
                      <textarea 
                        rows={5}
                        placeholder="Ex: Passionnés par le tissage traditionnel depuis trois générations, nous utilisons des pigments naturels du Bénin pour créer des pièces contemporaines..."
                        className="w-full bg-[#F6F7F9] border-none rounded-[16px] p-5 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] transition-shadow resize-none"
                        value={shopDescription} onChange={e => setShopDescription(e.target.value)}
                      />
                      <span className="absolute bottom-4 right-5 text-[9px] font-bold text-gray-400 tracking-wider">MIN. 150 CARACTÈRES</span>
                    </div>

                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">VALEURS DE LA BOUTIQUE</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {['Fait main', 'Éco-responsable', 'Patrimoine familial', 'Matériaux locaux', '+ Autre'].map(valeur => (
                        <button 
                          key={valeur}
                          type="button"
                          onClick={() => toggleValeur(valeur)}
                          className={`px-5 py-2.5 rounded-full text-[12px] font-medium transition-all duration-200 ${valeurs.includes(valeur) ? 'bg-[#0B7A3E] text-white shadow-md shadow-green-900/10' : 'bg-[#EAECEF] text-gray-600 hover:bg-gray-300'}`}
                        >
                          {valeur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Social Networks */}
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1">Réseaux Sociaux</h3>
                    <p className="text-[12px] text-gray-500 mb-6 font-medium">Connectez vos comptes pour permettre aux clients de suivre votre actualité.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">INSTAGRAM</label>
                         <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#0B7A3E] text-[18px]">photo_camera</span>
                            <input type="text" placeholder="@votre_boutique" className="w-full bg-[#f1f3f5] border-none rounded-[12px] pl-11 pr-4 py-3.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] transition-shadow"/>
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">FACEBOOK</label>
                         <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#0B7A3E] text-[18px]">facebook</span>
                            <input type="text" placeholder="facebook.com/votre_boutique" className="w-full bg-[#f1f3f5] border-none rounded-[12px] pl-11 pr-4 py-3.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] transition-shadow"/>
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">WHATSAPP BUSINESS</label>
                         <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#0B7A3E] text-[18px]">chat</span>
                            <input type="text" placeholder="+229 00 00 00 00" className="w-full bg-[#f1f3f5] border-none rounded-[12px] pl-11 pr-4 py-3.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] transition-shadow"/>
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">SITE WEB</label>
                         <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#0B7A3E] text-[18px]">language</span>
                            <input type="text" placeholder="www.votre-boutique.bj" className="w-full bg-[#f1f3f5] border-none rounded-[12px] pl-11 pr-4 py-3.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B7A3E] transition-shadow"/>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Step 2 */}
                  <div className="flex items-center justify-between pt-8 pb-16">
                    <button type="button" onClick={() => setStep(1)} className="text-[14px] font-bold text-[#0B7A3E] hover:text-[#073319] flex items-center gap-2 transition-colors"><span className="material-symbols-outlined text-[18px]">arrow_back</span> Retour</button>
                    <button type="button" onClick={() => setStep(3)} className="bg-[#0B4A26] hover:bg-[#073319] text-white px-8 py-3.5 rounded-full font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(11,74,38,0.6)]">Suivant : Vérification <span className="material-symbols-outlined text-[18px]">arrow_forward</span></button>
                  </div>
                </form>

               </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h1 className="text-[28px] md:text-[36px] font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">Vérification de votre identité et activité</h1>
                <p className="text-gray-500 text-[15px] font-medium mb-12 max-w-3xl leading-relaxed">Aidez-nous à garantir la sécurité de la marketplace en soumettant vos documents officiels. Ces informations sont traitées avec la plus grande confidentialité.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {/* Pièce d'Identité */}
                  <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#D1FAE5]/60 rounded-full flex items-center justify-center text-[#0B7A3E] mb-6">
                      <span className="material-symbols-outlined text-[28px]">badge</span>
                    </div>
                    <h3 className="text-[17px] font-extrabold text-gray-900 mb-2">Pièce d'Identité</h3>
                    <p className="text-[13px] text-gray-500 font-medium mb-8 leading-relaxed max-w-[220px]">CNI, Passeport ou Carte de Séjour en cours de validité.</p>
                    
                    <div className="w-full border-2 border-dashed border-gray-200 rounded-[16px] p-8 flex flex-col items-center justify-center bg-[#F6F7F9]/50 hover:bg-[#F6F7F9] transition-colors cursor-pointer group">
                      <span className="material-symbols-outlined text-gray-400 text-[32px] mb-3 group-hover:-translate-y-1 transition-transform">cloud_upload</span>
                      <p className="text-[13px] font-bold text-gray-900 mb-1">Glissez-déposez ou <span className="text-[#0B7A3E] underline decoration-1 underline-offset-2">parcourez</span></p>
                      <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">PDF, JPG, PNG (MAX 5MB)</p>
                    </div>
                  </div>

                  {/* RCCM ou IFU */}
                  <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#FFEDD5]/60 rounded-full flex items-center justify-center text-[#C2410C] mb-6">
                      <span className="material-symbols-outlined text-[28px]">assignment_ind</span>
                    </div>
                    <h3 className="text-[17px] font-extrabold text-gray-900 mb-2">RCCM ou IFU</h3>
                    <p className="text-[13px] text-gray-500 font-medium mb-8 leading-relaxed max-w-[220px]">Registre de Commerce ou Attestation IFU de votre établissement.</p>
                    
                    <div className="w-full border-2 border-dashed border-gray-200 rounded-[16px] p-8 flex flex-col items-center justify-center bg-[#F6F7F9]/50 hover:bg-[#F6F7F9] transition-colors cursor-pointer group">
                      <span className="material-symbols-outlined text-gray-400 text-[32px] mb-3 group-hover:-translate-y-1 transition-transform">upload_file</span>
                      <p className="text-[13px] font-bold text-gray-900 mb-1">Glissez-déposez ou <span className="text-[#C2410C] underline decoration-1 underline-offset-2">parcourez</span></p>
                      <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">PDF (RECOMMANDÉ)</p>
                    </div>
                  </div>
                </div>

                {/* Security Banner */}
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[20px] p-6 lg:p-8 flex gap-5 items-start mb-12 relative overflow-hidden">
                  <span className="absolute -right-4 -bottom-6 text-[85px] font-black text-[#86EFAC]/20 pointer-events-none select-none tracking-tighter transform -rotate-2">VERIFIED</span>
                  
                  <div className="shrink-0 mt-0.5 relative z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[#0B7A3E] text-[20px]">lock_person</span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-[14px] font-bold text-[#0B7A3E] mb-2 tracking-tight">Confidentialité & Sécurité</h4>
                    <p className="text-[12.5px] text-[#064E3B]/70 font-medium leading-[1.7] max-w-2xl">Vos documents sont stockés sur des serveurs sécurisés et cryptés. Seuls nos agents de conformité accèdent à ces fichiers uniquement pour valider votre compte vendeur conformément aux lois béninoises sur le commerce électronique.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 pt-6 mb-16 border-t border-gray-200/60">
                  <button type="button" onClick={() => setStep(2)} className="text-[14px] font-bold text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2">
                     <span className="material-symbols-outlined text-[18px]">arrow_back</span> Retour
                  </button>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                    {/* Autosave badge */}
                    <div className="hidden md:flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308] shadow-[0_0_6px_rgba(234,179,8,0.5)]"></span>
                      <span className="text-[11px] font-extrabold text-gray-500 tracking-wide">Données automatiquement sauvegardées à {saveTime}</span>
                    </div>
                    
                    {/* Validation button -> Calls real API */}
                    <button type="button" disabled={loading} onClick={handleFinalSubmit} className="w-full sm:w-auto bg-[#0B4A26] hover:bg-[#073319] text-white px-8 py-4 rounded-full font-bold text-[14px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(11,74,38,0.6)] hover:shadow-none hover:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading ? 'Envoi en cours...' : 'Soumettre pour validation'} {!loading && <span className="material-symbols-outlined text-[18px]">task_alt</span>}
                    </button>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="w-full bg-red-50 text-red-500 text-sm font-bold p-4 rounded-[12px] border border-red-100 flex items-center gap-2 mt-4">
                      <span className="material-symbols-outlined text-[20px]">error</span>
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
