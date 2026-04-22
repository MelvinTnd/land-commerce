'use client'
import Link from 'next/link'
import Image from 'next/image'

const autresArtisans = [
  {
    id: 'kaba-et-fils',
    nom: 'Kaba & Fils',
    categorie: 'Alimentation & Terroir',
    lieu: 'Dassa-Zoumé',
    image: 'https://images.unsplash.com/photo-1587049352847-8d4e8941554a?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Kaba+Fils&background=1B6B3A&color=fff&size=200',
  },
  {
    id: 'tisserands-abomey',
    nom: 'Les Tisserands d\'Abomey',
    categorie: 'Textile',
    lieu: 'Abomey',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Tisserands+Abomey&background=D4920A&color=fff&size=200',
  },
  {
    id: 'bijoux-d-afrique',
    nom: 'Bijoux d\'Afrique',
    categorie: 'Bijouterie',
    lieu: 'Cotonou',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80',
    logo: 'https://ui-avatars.com/api/?name=Bijoux+Afrique&background=1A1A1A&color=fff&size=200',
  }
]

export default function AutresArtisans() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header de section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16 border-b border-gray-100 pb-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-3">
              Découvrir <span className="text-[#1B6B3A]">d'autres créateurs</span>
            </h2>
            <p className="text-[14px] font-medium text-gray-500 leading-relaxed">
              Poursuivez votre exploration de l'excellence locale à travers ces boutiques soigneusement sélectionnées.
            </p>
          </div>
          <Link href="/artisans" className="hidden sm:flex items-center gap-2 font-extrabold text-[11px] uppercase tracking-widest text-[#1B6B3A] hover:text-[#134e29] transition-colors py-2 px-4 rounded-full bg-[#E6F8EA] hover:bg-[#D2F4DE]">
            Tous les vendeurs <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {autresArtisans.map((artisan) => (
            <Link key={artisan.id} href={`/boutique/${artisan.id}`} className="group block">
              <div className="rounded-[24px] overflow-hidden mb-5 relative aspect-[5/4] shadow-sm group-hover:shadow-xl border border-gray-100 transition-all duration-500">
                <Image
                  src={artisan.image}
                  alt={artisan.nom}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Logo superposé dans le coin */}
                <div className="absolute bottom-5 left-5 w-16 h-16 rounded-[14px] border border-white/20 overflow-hidden bg-white shadow-lg p-1 relative">
                  <Image
                    src={artisan.logo}
                    alt={`Logo ${artisan.nom}`}
                    fill
                    className="rounded-[10px] object-cover"
                    sizes="64px"
                  />
                </div>
                
                {/* Flèche Hover Corner */}
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 transform translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
                  <span className="material-symbols-outlined text-[20px] -rotate-45">arrow_forward</span>
                </div>
              </div>
              
              <div className="px-1">
                <h3 className="text-[17px] font-extrabold group-hover:text-[#1B6B3A] transition-colors mb-1 text-[#111827]">
                  {artisan.nom}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {artisan.categorie}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#1B6B3A]">
                    <span className="material-symbols-outlined shrink-0 text-[14px]">location_on</span>
                    {artisan.lieu}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="/artisans" className="inline-flex items-center gap-2 font-extrabold text-[12px] uppercase tracking-widest text-white bg-[#1B6B3A] py-4 px-8 rounded-full shadow-md">
            Voir tous les vendeurs <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        
      </div>
    </section>
  )
}
