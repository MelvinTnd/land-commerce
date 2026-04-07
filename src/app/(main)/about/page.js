import Link from 'next/link'

const valeurs = [
  {
    icon: 'handshake',
    titre: 'Commerce Équitable',
    description: 'Nous garantissons une rémunération juste aux artisans et producteurs locaux, sans intermédiaires superflus.',
  },
  {
    icon: 'eco',
    titre: 'Durabilité',
    description: 'Nos partenaires utilisent des matières naturelles et des techniques ancestrales respectueuses de l\'environnement.',
  },
  {
    icon: 'verified',
    titre: 'Authenticité',
    description: 'Chaque produit est certifié authentique. Nous vérifions personnellement chaque artisan sur le terrain.',
  },
  {
    icon: 'groups',
    titre: 'Communauté',
    description: 'BéninMarket est bien plus qu\'un marché : c\'est une communauté de passionnés qui célèbrent l\'héritage béninois.',
  },
]

const chiffres = [
  { valeur: '500+', label: 'Artisans Partenaires' },
  { valeur: '12k+', label: 'Produits Référencés' },
  { valeur: '8', label: 'Départements Couverts' },
  { valeur: '98%', label: 'Clients Satisfaits' },
]

const equipe = [
  {
    nom: 'Amina Koudjo',
    role: 'Fondatrice & CEO',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE',
  },
  {
    nom: 'Yves Hounkpatin',
    role: 'Directeur Technique',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn86rtc6C63qQaDekp0jAyOU9muzPWYngtXZ9UWkihzwo7nXc_cYCa0n-gPOBF_ffJAZ1Wm5Xx1Bxeutkl7iD9y520ZJVQFepzYlBJMaXPDfY6T-CZdBBhhg1omxXCKtsr5Ue1oYxtJX_Ag8NCw_PxqzKBM-mVQcJpXfYg7kJqUQnZ3Ug8jI109CXSbRTkc-ZrxZAtAuucBkjtnEPWauGROLJNUR0jIH3SLUpTZzJalePs9vAgE_2kllxOFqxHDiYG_8-vcXjRxMY',
  },
  {
    nom: 'Grâce Ahouandjinou',
    role: 'Responsable Artisans',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2afMDoCl0cmLAnabdQvzASiobQIDKTOHjMNApDH87KmPjBzS_aicU6F06AckemvVfID8xB7JCB2oZmGUmEK0J1IzR4koyPOa9oMfT3ShMuNEUo3_YpuKqhrcLiAYayg_v5WvYUpnBCKIwCLyzE_wjTeQ-E8J9REMsow_PJ2Vt-fqHPkZV8pKrLK1FNNbrKwCHqmA3sxA5asR_V6XEbJFP-w8_l8183VSoaxqbmf0fBRORTIRkXaWjkgGAWbu73U6fUO4lDFOfNvw',
  },
]

export default function AboutPage() {
  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004d28 100%)', minHeight: '420px' }}>
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(circle at 80% 20%, #92febc 0%, transparent 60%)' }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-24 relative z-10">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: '#D4920A', color: '#fff' }}
          >
            Notre Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
            Connecter le Bénin{' '}
            <span style={{ color: '#F5B731' }}>au Monde.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl leading-relaxed">
            BéninMarket est la première marketplace dédiée à la promotion et la vente
            des produits artisanaux et locaux du Bénin à travers le monde entier.
          </p>
        </div>
      </section>

      {/* Chiffres */}
      <section className="px-6 md:px-10 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {chiffres.map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-2xl p-6 text-center"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <p className="text-3xl font-extrabold mb-1" style={{ color: '#1B6B3A' }}>{c.valeur}</p>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#1B6B3A' }}>
              Notre Histoire
            </p>
            <h2 className="text-3xl font-extrabold mb-6" style={{ color: '#1A1A1A' }}>
              Né de la passion pour le patrimoine béninois
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              Fondé en 2024 à Cotonou, BéninMarket est né d'un constat simple : les artisans béninois
              créent des merveilles, mais peinent à atteindre un marché plus large. Notre plateforme
              brise cette barrière en offrant une vitrine digitale premium à chaque créateur.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              De Porto-Novo à Natitingou, de Ouidah à Parakou, nous parcourons le pays pour
              dénicher les meilleurs artisans et leurs créations uniques. Chaque produit raconte
              une histoire que nous souhaitons partager avec le monde.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden" style={{ height: '400px' }}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuhUAfQCAlnKOvbOETxG7rC1cV-vwjxoJ4XfrSeBYxivvfY6VfchHbKyX2kfOlJxZoILjjVK42K2yNNtsSCege3r42D0lcedrYo0iuopC_JN0VoyRoLFusoZzZ2F8nN7mi-fOSYCKapnQsoBn-MUoQHT-5IfehMpr6zVyNfNepvjH8ETohjPjPKAXYG_RdLnFCOMs08xMnu9M73rrIfHCLVieAXRM8cAeUPUjjvn0gDNZWEwYbQ76y23zxguc543eHpqdHqBYdO7A"
              alt="Marché béninois"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-6 md:px-10 py-20" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#1B6B3A' }}>
              Nos Valeurs
            </p>
            <h2 className="text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>
              Ce qui nous guide au quotidien
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((v) => (
              <div key={v.titre} className="rounded-2xl p-6" style={{ background: '#F7F5F0' }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#1B6B3A' }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#F5B731', fontSize: '22px' }}>
                    {v.icon}
                  </span>
                </div>
                <h4 className="font-bold text-base mb-2" style={{ color: '#1A1A1A' }}>{v.titre}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#1B6B3A' }}>
            Notre Équipe
          </p>
          <h2 className="text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>
            Les visages derrière BéninMarket
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {equipe.map((e) => (
            <div
              key={e.nom}
              className="bg-white rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <img
                src={e.image}
                alt={e.nom}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h4 className="font-bold text-base" style={{ color: '#1A1A1A' }}>{e.nom}</h4>
              <p className="text-xs font-semibold" style={{ color: '#D4920A' }}>{e.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 pb-20">
        <div
          className="max-w-5xl mx-auto rounded-3xl py-16 px-10 text-center relative overflow-hidden"
          style={{ background: '#1B6B3A' }}
        >
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none" style={{ fontSize: '200px', color: 'white' }}>✦</div>
          <h2 className="text-3xl font-extrabold text-white mb-4 relative z-10">
            Rejoignez l'aventure BéninMarket
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-8 relative z-10">
            Que vous soyez artisan, producteur ou passionné de culture béninoise, votre place est ici.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              href="/inscription-vendeur"
              className="px-8 py-4 rounded-full font-bold text-white text-sm hover:opacity-90 transition-all"
              style={{ background: '#D4920A' }}
            >
              Devenir Vendeur
            </Link>
            <Link
              href="/produits"
              className="px-8 py-4 rounded-full font-bold text-sm transition-all hover:bg-white/20"
              style={{ border: '2px solid white', color: 'white' }}
            >
              Explorer le Marché
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
