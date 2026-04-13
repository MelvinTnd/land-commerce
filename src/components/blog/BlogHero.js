import Link from 'next/link'

export default function BlogHero() {
  return (
    <section className="relative w-full overflow-hidden h-[60vh] lg:h-[70vh] bg-black">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1542103749-8ef59b94f47e?auto=format&fit=crop&q=80"
        alt="Hero Blog"
        className="w-full h-full object-cover object-center opacity-70"
      />

      {/* Modern Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(11, 74, 40, 0.95) 0%, rgba(11, 74, 40, 0.5) 50%, transparent 100%)' }}
      />

      {/* Main Content */}
      <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-20 pb-16">
        <div className="max-w-[1200px] mx-auto flex flex-col">
          
          {/* Metadata */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#EAB308] text-[#422006] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span> Exclusif
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A0D9B9] border border-[#A0D9B9]/30 px-3 py-1 rounded-full backdrop-blur-md">
              Patrimoine National
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5 max-w-4xl drop-shadow-lg">
            L'Éveil des Géants :<br/>Le Retour des Trésors d'Abomey
          </h1>

          {/* Description */}
          <p className="text-base lg:text-lg text-gray-200 max-w-2xl mb-8 font-medium leading-relaxed">
            Une immersion exclusive dans les coulisses de la restauration des bas-reliefs royaux, symboles d'une identité béninoise retrouvée après des siècles d'attente.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/blog/1"
              className="bg-white hover:bg-gray-100 text-[#1B6B3A] uppercase tracking-widest text-[11px] font-extrabold px-8 py-4 rounded-full transition-all flex items-center gap-2 shadow-xl"
            >
              Lire le dossier spécial
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            
            <div className="flex items-center gap-3 text-white/80 bg-black/20 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span className="text-[11px] font-bold">12.4K</span>
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span className="text-[11px] font-bold">8 min de lecture</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}