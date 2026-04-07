'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ArtisanHero() {
  const [suivi, setSuivi] = useState(false)

  return (
    <section className="relative w-full overflow-hidden h-[60vh] lg:h-[70vh] bg-black">
      {/* Image de fond avec effet parallax léger */}
      <img
        src="https://images.unsplash.com/photo-1544208365-d69806b9bba0?auto=format&fit=crop&q=80"
        alt="Maître Artisan"
        className="w-full h-full object-cover object-top opacity-60"
      />

      {/* Overlay dégradé */}
      <div
        className="absolute inset-0 pattern-dots"
        style={{ 
          background: 'linear-gradient(to top, rgba(11, 74, 40, 0.95) 0%, rgba(11, 74, 40, 0.4) 50%, transparent 100%)',
        }}
      />

      {/* Contenu principal en bas */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 lg:p-20 flex flex-col justify-end">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-end justify-between gap-8">
          
          {/* Bloc Info Gauche */}
          <div className="flex flex-col md:flex-row items-end gap-6 w-full md:w-auto">
            
            {/* Avatar stylisé */}
            <div className="relative shrink-0 mb-4 md:mb-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[24px] overflow-hidden border-4 border-[#1B6B3A] shadow-2xl bg-white p-1 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"
                  alt="Maître Kodjo"
                  className="w-full h-full object-cover rounded-[16px]"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#D2F4DE] border-4 border-[#1B6B3A] flex items-center justify-center z-20 shadow-lg">
                <span className="material-symbols-outlined text-[#1B6B3A] text-[18px]">workspace_premium</span>
              </div>
            </div>

            {/* Texte et Stats */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Maître Artisan
                </span>
                <span className="bg-[#EAB308]/90 text-[#422006] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">star</span> 4.9
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-none mb-2">
                Atelier du<br />Dahomey
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#A0D9B9] font-medium mt-1">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[16px]">location_on</span> Abomey, Bénin
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[16px]">history_edu</span> Depuis 1972
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="material-symbols-outlined text-[16px]">shopping_bag</span> 1,204 Ventes
                </span>
              </div>
            </div>
          </div>

          {/* Bloc Actions Droite */}
          <div className="flex w-full md:w-auto items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setSuivi(!suivi)}
              className={`flex-1 md:flex-none uppercase tracking-widest text-[11px] font-extrabold px-6 py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg backdrop-blur-md ${
                suivi 
                  ? 'bg-white text-[#1B6B3A]' 
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{suivi ? 'favorite' : 'favorite_border'}</span>
              {suivi ? 'Abonné' : 'Suivre'}
            </button>
            <Link
              href="/boutique/atelier-kanvo"
              className="flex-1 md:flex-none bg-[#D2F4DE] hover:bg-white text-[#1B6B3A] uppercase tracking-widest text-[11px] font-extrabold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Visiter l'atelier
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}