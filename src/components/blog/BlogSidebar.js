'use client'
import { useState } from 'react'
import Link from 'next/link'

const sondageOptions = [
  { label: 'Sculpture sur bronze', pourcentage: 32 },
  { label: 'Vannerie du Delta', pourcentage: 45 },
  { label: 'Forge (Atacora)', pourcentage: 23 },
]

const sections = [
  { label: 'Dossiers Spéciaux', count: 12 },
  { label: 'Techniques & Outils', count: 38 },
  { label: 'Portraits d\'Artisans', count: 41 },
  { label: 'Patrimoine & Économie', count: 19 },
]

const tendances = [
  { rang: 1, titre: 'Restauration des Palais Royaux d\'Abomey', categorie: 'Patrimoine' },
  { rang: 2, titre: 'Le marché du Bronze à l\'ère numérique', categorie: 'Économie' },
  { rang: 3, titre: 'Le renouveau du textile Kanvô', categorie: 'Savoir-Faire' },
]

export default function BlogSidebar() {
  const [email, setEmail] = useState('')
  const [inscrit, setInscrit] = useState(false)
  const [voteIndex, setVoteIndex] = useState(null)

  const handleInscription = (e) => {
    e.preventDefault()
    if (email) setInscrit(true)
  }

  return (
    <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-8">

      {/* Newsletter Block (Moved to top for prominence) */}
      <div className="bg-[#1B6B3A] rounded-[24px] p-6 shadow-xl relative overflow-hidden">
        {/* Motif décoratif absolu */}
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center">
           <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center">
             <div className="w-16 h-16 rounded-full border-4 border-white/10"></div>
           </div>
        </div>

        <div className="relative z-10 flex flex-col text-center items-center">
          <div className="w-12 h-12 rounded-full bg-[#EAB308] text-[#422006] flex items-center justify-center mb-4 shadow-lg">
            <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
          </div>
          <h4 className="font-extrabold text-white text-lg mb-2">La Lettre de l'Artisan</h4>
          <p className="text-[12px] text-[#A0D9B9] font-medium leading-relaxed mb-6 px-2">
            Histoires, découvertes et décryptages du monde artisanal béninois, dans votre boîte mail.
          </p>
          
          {inscrit ? (
            <div className="w-full bg-[#D2F4DE] text-[#1B6B3A] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Inscription Validée
            </div>
          ) : (
            <form onSubmit={handleInscription} className="w-full flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 text-white placeholder-white/50 border border-white/20 px-4 py-3.5 rounded-xl text-[13px] font-medium outline-none focus:border-[#EAB308] transition-colors text-center"
              />
              <button
                type="submit"
                className="w-full bg-[#EAB308] hover:bg-[#dca506] text-[#422006] font-extrabold text-[12px] uppercase tracking-widest py-3.5 rounded-xl transition-colors shadow-md"
              >
                M'abonner
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sondage Express */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
          <div className="w-8 h-8 rounded-full bg-[#E6F8EA] text-[#1B6B3A] flex items-center justify-center">
             <span className="material-symbols-outlined text-[16px]">poll</span>
          </div>
          <h4 className="text-[13px] font-extrabold text-[#111827] uppercase tracking-wider">
            Sondage Express
          </h4>
        </div>
        
        <p className="text-[13px] text-gray-600 font-medium mb-5 leading-relaxed">
          Quel art béninois souhaitez-vous découvrir dans notre prochain documentaire ?
        </p>
        
        <div className="flex flex-col gap-4">
          {sondageOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => setVoteIndex(i)}
              className="w-full group"
            >
              <div className="flex justify-between items-end mb-1.5">
                <span className={`text-[12px] font-bold transition-colors ${voteIndex === i ? 'text-[#1B6B3A]' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {opt.label}
                </span>
                <span className={`text-[10px] font-extrabold ${voteIndex === i ? 'text-[#1B6B3A]' : 'text-gray-400'}`}>
                  {voteIndex !== null ? `${opt.pourcentage}%` : ''}
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: voteIndex !== null ? `${opt.pourcentage}%` : (voteIndex === i ? '100%' : '0%'),
                    background: voteIndex === i ? '#1B6B3A' : '#D2F4DE',
                  }}
                />
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {voteIndex !== null ? 'Merci pour votre vote !' : '1 246 participants'}
        </div>
      </div>

      {/* Catégories de contenu */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
           <div className="w-1.5 h-4 bg-[#1B6B3A] rounded-full"></div>
           <h4 className="text-[13px] font-extrabold text-[#111827] uppercase tracking-wider">Catégories</h4>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <Link
              href="#"
              key={s.label}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-[#E6F8EA] border border-gray-100 hover:border-[#D2F4DE] px-3 py-2 rounded-lg transition-colors group"
            >
              <span className="text-[12px] font-bold text-gray-600 group-hover:text-[#1B6B3A]">{s.label}</span>
              <span className="text-[9px] font-extrabold text-gray-400 group-hover:text-[#1B6B3A] bg-white group-hover:bg-[#D2F4DE] px-1.5 py-0.5 rounded-full">{s.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tendances List */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
          <span className="material-symbols-outlined text-[#EA580C] text-[18px]">local_fire_department</span>
          <h4 className="text-[13px] font-extrabold text-[#111827] uppercase tracking-wider">Populaire</h4>
        </div>
        
        <div className="flex flex-col gap-5">
          {tendances.map((t) => (
            <Link href="#" key={t.rang} className="flex gap-4 group">
              <span className="text-[32px] font-black text-gray-100 leading-none group-hover:text-[#D2F4DE] transition-colors">
                {t.rang}
              </span>
              <div className="flex flex-col gap-1 -mt-1">
                <span className="text-[9px] font-extrabold text-[#1B6B3A] uppercase tracking-widest">
                  {t.categorie}
                </span>
                <h5 className="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-[#1B6B3A] transition-colors">
                  {t.titre}
                </h5>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </aside>
  )
}