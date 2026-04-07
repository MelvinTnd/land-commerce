const specs = [
  { icon: 'forest', label: 'Essences nobles', valeur: "Iroko & Ébène massif" },
  { icon: 'brush', label: 'Taille directe', valeur: 'Savoir-faire ancestral' },
  { icon: 'church', label: 'Héritage', valeur: 'Techniques de cour' },
]

export default function ArtisanHistoire() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Section Texte (Gauche) */}
          <div className="flex-1 flex flex-col gap-8 order-2 lg:order-1">
            
            {/* Tagline */}
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[#1B6B3A] opacity-20"></div>
              <p className="text-[10px] uppercase font-extrabold tracking-[0.3em] text-[#1B6B3A]">
                Héritage Moderniste
              </p>
            </div>

            {/* Titre majestueux */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] leading-[1.1] tracking-tight">
              La main qui<br/>
              éveille l'âme<br/>
              du <span className="text-[#1B6B3A]">bois brut.</span>
            </h2>

            {/* Corps du texte */}
            <div className="flex flex-col gap-6 w-full lg:max-w-[85%] border-l-2 border-[#D2F4DE] pl-6 py-2">
              <p className="text-base text-gray-600 leading-relaxed font-medium">
                Niché au cœur de la cité historique d'Abomey, l'Atelier du Dahomey perpétue l'art de la sculpture sur bois depuis trois générations. Maître Kodjo marie habilement les techniques ancestrales des bas-reliefs royaux à une esthétique profondément contemporaine.
              </p>
              <p className="text-base text-gray-600 leading-relaxed font-medium">
                Chaque pièce est extraite d'essences locales nobles — iroko, ébène ou acajou — sélectionnées pour leur grain et leur âme. Réputé pour sa façon unique de sculpter « le vide », l'artisan crée des œuvres qui respirent l'histoire de tout un royaume.
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-[#F9FAFA] rounded-2xl p-5 border border-gray-100 flex items-start gap-4 transition-transform hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#E6F8EA] text-[#1B6B3A] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{spec.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-0.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">
                      {spec.label}
                    </span>
                    <span className="text-sm font-bold text-[#111827]">
                      {spec.valeur}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Section Image & Citation (Droite) */}
          <div className="flex-1 w-full order-1 lg:order-2 relative">
            <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] bg-gray-100 shadow-xl border-8 border-white/50">
              <img
                src="https://images.unsplash.com/photo-1513689125086-6b43fccc8c36?auto=format&fit=crop&q=80"
                alt="Travail du bois"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B6B3A]/80 to-transparent"></div>
              
              {/* Grand badge flottant */}
              <div className="absolute bottom-10 left-10 p-4 border-l-4 border-[#D2F4DE]">
                <p className="text-xl lg:text-2xl font-bold text-white leading-snug mb-3 max-w-[300px] drop-shadow-md">
                  "Le bois ne meurt jamais, il change de forme pour raconter une autre histoire."
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#A0D9B9] font-black uppercase tracking-widest">Maître Kodjo, 2025</span>
                </div>
              </div>
            </div>
            
            {/* Décoration orbitale */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-gray-200 xl:flex items-center justify-center opacity-30 select-none hidden">
              <div className="w-24 h-24 rounded-full border border-gray-200 animate-spin-slow flex items-center justify-between">
                <div className="w-2 h-2 rounded-full bg-[#1B6B3A]"></div>
                <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}