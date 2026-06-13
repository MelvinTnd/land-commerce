import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-[#F1F2F4] overflow-hidden">
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-16 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">

          {/* Left Content */}
          <div className="flex-1 flex flex-col items-start w-full">

            {/* Tagline */}
            <div className="flex items-center gap-2 mb-5 md:mb-6">
              <span className="flex items-center gap-1.5 bg-white text-gray-800 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 border border-gray-200">
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                Sélection Premium
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-gray-900 leading-[1.05] tracking-tight mb-6 md:mb-8">
              L&apos;Excellence de <br />
              <span className="text-gray-500">l&apos;artisanat local.</span>
            </h1>

            <p className="text-base md:text-lg text-gray-500 font-normal max-w-xl leading-relaxed mb-8 md:mb-10">
              Découvrez des créations uniques et authentiques venues des meilleurs créateurs. Des pièces d&apos;exception sélectionnées avec soin sur CauriMarket.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 md:mb-12 w-full sm:w-auto">
              <Link href="/produits"
                className="bg-[#1A1A1A] hover:bg-black text-white font-semibold text-[13px] uppercase tracking-widest px-8 md:px-10 py-4 transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-3">
                Explorer
                <span className="material-symbols-outlined text-[20px]">arrow_right_alt</span>
              </Link>
              <Link href="/boutiques"
                className="bg-transparent hover:bg-gray-50 text-[#1A1A1A] border border-gray-300 font-semibold text-[13px] uppercase tracking-widest px-8 md:px-10 py-4 transition-all hover:border-gray-900 flex items-center justify-center gap-3">
                Nos Créateurs
              </Link>
            </div>

            <div className="flex items-center gap-6 sm:gap-12 pt-8 border-t border-gray-200 w-full">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">500+</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Créateurs vérifiés</span>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">12K+</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Pièces uniques</span>
              </div>
            </div>
          </div>

          {/* Right — Minimalist Images */}
          <div className="flex-1 w-full lg:max-w-[480px] relative hidden md:block">
            <div className="relative w-full pl-12">
              
              {/* Image principale */}
              <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden group">
                <Image
                  src="/images/products/art.jpg"
                  alt="Artisanat"
                  fill className="object-cover transition-transform duration-1000 group-hover:scale-105" priority
                  sizes="(max-width: 1024px) 340px, 420px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute bottom-6 left-6 bg-white px-5 py-3 flex items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-gray-900">diamond</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Haute Qualité</p>
                    <p className="text-[11px] text-gray-500">Design exclusif</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}