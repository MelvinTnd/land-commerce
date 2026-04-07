import Link from 'next/link'

export default function ProduitsHeroArtisan() {
  return (
    <section className="px-10 py-12" style={{ background: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Gauche — texte */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <span
              className="w-fit px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: '#FEF3C7', color: '#D4920A', border: '1px solid #F5B731' }}
            >
              L'Artisan du Mois
            </span>

            {/* Nom */}
            <div>
              <h1
                className="text-6xl md:text-7xl font-extrabold leading-none tracking-tight"
                style={{ color: '#1A1A1A' }}
              >
                Koffi
              </h1>
              <h1
                className="text-6xl md:text-7xl font-extrabold leading-none tracking-tight italic"
                style={{ color: '#1B6B3A' }}
              >
                Zinsou
              </h1>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed max-w-md" style={{ color: '#6B7280' }}>
              Maître sculpteur d'Abomey, Koffi préserve l'héritage royal à travers des bois précieux et des motifs séculaires.
            </p>

            {/* Bouton */}
            <Link
              href="/artisans/koffi-zinsou"
              className="w-fit flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#1B6B3A' }}
            >
              Découvrir la Collection
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Droite — photo + carte */}
          <div className="relative">
            {/* Image principale */}
            <div className="rounded-3xl overflow-hidden" style={{ height: '420px' }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE"
                alt="Koffi Zinsou"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Carte flottante */}
            <div
              className="absolute bottom-6 left-6 bg-white rounded-2xl p-4 max-w-xs"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: '#1B6B3A' }}
                >
                  <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <span className="text-xs font-bold" style={{ color: '#1B6B3A' }}>
                  Vendeur Certifié
                </span>
              </div>
              <p className="text-sm italic" style={{ color: '#6B7280' }}>
                "Chaque pièce raconte une histoire de nos ancêtres."
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}