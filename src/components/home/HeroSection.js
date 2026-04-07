import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-[#F9FAFA] overflow-hidden">

      {/* Background Decor — blur réduit */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#E6F8EA] rounded-full opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-[#fbf3d3] rounded-full opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Content */}
          <div className="flex-1 flex flex-col items-start w-full">

            {/* Tagline */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 bg-[#1B6B3A]/10 text-[#1B6B3A] text-[10px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-[#1B6B3A]/20">
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                Artisanat Certifié
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[#111827] leading-[1.05] tracking-tight mb-8">
              L'Âme du <span className="text-[#1B6B3A]">Bénin</span> <br />
              <span className="relative inline-block">
                à portée de main.
                <svg className="absolute w-full h-4 -bottom-2 left-0 text-[#EAB308]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path fill="currentColor" d="M0 5 Q 50 10 100 5 Q 50 0 0 5" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-600 font-medium max-w-xl leading-relaxed mb-10">
              Découvrez la plus grande marketplace du savoir-faire béninois. Qu'il s'agisse des miels purs de Dassa ou des sculptures d'Abomey, commandez en direct et soutenez les maîtres créateurs.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-12 w-full">
              <Link
                href="/produits"
                className="bg-[#1B6B3A] hover:bg-[#134e29] text-white font-extrabold text-[13px] uppercase tracking-widest px-8 md:px-10 py-5 rounded-full transition-transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                Explorer la Boutique
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </Link>
              <Link
                href="/artisans"
                className="bg-white hover:bg-gray-50 text-[#111827] border-2 border-gray-200 font-extrabold text-[13px] uppercase tracking-widest px-8 md:px-10 py-5 rounded-full transition-all hover:border-[#1B6B3A] flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                Nos Artisans
                <span className="material-symbols-outlined text-[20px]">group</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-12 pt-6 border-t border-gray-200 w-full">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-[#111827]">500+</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Vendeurs Vérifiés</span>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-[#111827]">12K+</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Produits Uniques</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full lg:w-auto relative hidden md:block">

            {/* Image principale */}
            <div className="relative w-[320px] lg:w-[420px] aspect-[4/5] rounded-[40px] overflow-hidden ml-auto shadow-xl border-8 border-white">
              <Image
                src="https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80&w=800"
                alt="Sculpture Béninoise"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-[#1B6B3A] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#111827]">Taille Directe</p>
                  <p className="text-[10px] text-gray-500 font-bold">100% Historique</p>
                </div>
              </div>
            </div>

            {/* Image flottante */}
            <div className="absolute top-10 -left-16 lg:-left-24 w-[200px] lg:w-[260px] aspect-square rounded-[32px] overflow-hidden shadow-xl border-8 border-white hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400"
                alt="Épices du Terroir"
                fill
                className="object-cover"
              />
            </div>

            {/* Cercle décoratif */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#EAB308] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <span className="material-symbols-outlined text-white text-[32px]">public</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}