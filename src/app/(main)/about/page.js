import Link from 'next/link'
import Image from 'next/image'

const chiffres = [
  { valeur: '500+', label: 'Artisans Partenaires', icon: 'handshake', color: '#1B6B3A', bg: '#E6F8EA' },
  { valeur: '12k+', label: 'Produits Référencés', icon: 'inventory_2', color: '#7C3AED', bg: '#EDE9FE' },
  { valeur: '8', label: 'Départements Couverts', icon: 'map', color: '#D4920A', bg: '#FEF3C7' },
  { valeur: '98%', label: 'Clients Satisfaits', icon: 'thumb_up', color: '#DB2777', bg: '#FCE7F3' },
]

const valeurs = [
  { icon: 'handshake', titre: 'Commerce Équitable', description: "Nous garantissons une rémunération juste aux artisans et producteurs locaux, sans intermédiaires superflus.", color: '#1B6B3A', bg: '#E6F8EA' },
  { icon: 'eco', titre: 'Durabilité', description: "Nos partenaires utilisent des matières naturelles et des techniques ancestrales respectueuses de l'environnement.", color: '#7C3AED', bg: '#EDE9FE' },
  { icon: 'verified', titre: 'Authenticité', description: "Chaque produit est certifié authentique. Nous vérifions personnellement chaque artisan sur le terrain.", color: '#D4920A', bg: '#FEF3C7' },
  { icon: 'groups', titre: 'Communauté', description: "BéninMarket est bien plus qu'un marché : c'est une communauté de passionnés qui célèbrent l'héritage béninois.", color: '#DB2777', bg: '#FCE7F3' },
]

const equipe = [
  { nom: 'Amina Koudjo', role: 'Fondatrice & CEO', initiales: 'AK', color: '#1B6B3A' },
  { nom: 'Yves Hounkpatin', role: 'Directeur Technique', initiales: 'YH', color: '#7C3AED' },
  { nom: 'Grâce Ahouandjinou', role: 'Responsable Artisans', initiales: 'GA', color: '#D4920A' },
]

export default function AboutPage() {
  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Hero clair */}
      <div className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-24"
        style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #DCFCE7 50%, #F7F5F0 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30H15L30 0zm0 60L15 30h30L30 60z' fill='%231B6B3A' fill-opacity='0.05'/%3E%3C/svg%3E")` }} />

        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(27,107,58,0.1) 0%, transparent 70%)' }} />

        <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] mb-6"
              style={{ background: 'rgba(212,146,10,0.12)', color: '#D4920A', border: '1px solid rgba(212,146,10,0.25)' }}>
              🌍 Notre Mission
            </span>
            <h1 className="text-5xl md:text-[68px] font-black text-[#0D0D0D] tracking-tight leading-none mb-6">
              Connecter<br />le Bénin<br />
              <span style={{ color: '#1B6B3A' }}>au Monde.</span>
            </h1>
            <p className="text-[17px] font-medium leading-relaxed max-w-xl mb-8" style={{ color: '#6B7280' }}>
              BéninMarket est la première marketplace dédiée à la promotion et la vente des produits artisanaux et locaux du Bénin à travers le monde entier.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/produits"
                className="px-7 py-3.5 rounded-full font-black text-[12px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: '#1B6B3A' }}>
                Explorer le marché
              </Link>
              <Link href="/contact"
                className="px-7 py-3.5 rounded-full font-black text-[12px] uppercase tracking-wider transition-all hover:bg-white hover:shadow-md"
                style={{ border: '1.5px solid rgba(0,0,0,0.15)', color: '#374151' }}>
                Nous contacter
              </Link>
            </div>
          </div>

          {/* Stats flottantes */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            {chiffres.map(c => (
              <div key={c.label}
                className="bg-white rounded-[24px] p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ border: '1px solid #EBEBEB', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: c.bg }}>
                  <span className="material-symbols-outlined text-[24px]" style={{ color: c.color }}>{c.icon}</span>
                </div>
                <p className="text-3xl font-black mb-1" style={{ color: '#0D0D0D' }}>{c.valeur}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Histoire */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-4" style={{ color: '#1B6B3A' }}>Notre Histoire</p>
            <h2 className="text-4xl font-black mb-6 tracking-tight" style={{ color: '#0D0D0D' }}>
              Né de la passion pour le patrimoine béninois
            </h2>
            <p className="text-[15px] leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              Fondé en 2024 à Cotonou, BéninMarket est né d&apos;un constat simple : les artisans béninois créent des merveilles, mais peinent à atteindre un marché plus large. Notre plateforme brise cette barrière en offrant une vitrine digitale premium à chaque créateur.
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: '#6B7280' }}>
              De Porto-Novo à Natitingou, de Ouidah à Parakou, nous parcourons le pays pour dénicher les meilleurs artisans et leurs créations uniques. Chaque produit raconte une histoire que nous voulons partager avec le monde.
            </p>
          </div>
          <div className="relative rounded-[32px] overflow-hidden h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1580893246395-52aead8960dc?auto=format&fit=crop&q=80&w=800"
              alt="Marché artisanal béninois"
              fill className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)' }} />
            <div className="absolute bottom-5 left-5 bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#E6F8EA' }}>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#1B6B3A' }}>location_on</span>
              </div>
              <div>
                <p className="font-black text-[12px]" style={{ color: '#0D0D0D' }}>Cotonou, Bénin</p>
                <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Depuis 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="px-6 md:px-12 lg:px-20 py-20" style={{ background: 'white' }}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-4" style={{ color: '#1B6B3A' }}>Nos Valeurs</p>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>Ce qui nous guide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map(v => (
              <div key={v.titre}
                className="rounded-[24px] p-7 transition-all hover:-translate-y-1 hover:shadow-lg bg-white"
                style={{ border: '1px solid #EBEBEB' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: v.bg }}>
                  <span className="material-symbols-outlined text-[24px]" style={{ color: v.color }}>{v.icon}</span>
                </div>
                <h4 className="font-black text-[16px] mb-2" style={{ color: '#0D0D0D' }}>{v.titre}</h4>
                <p className="text-[13px] leading-relaxed" style={{ color: '#6B7280' }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24">
        <div className="text-center mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-4" style={{ color: '#1B6B3A' }}>Notre Équipe</p>
          <h2 className="text-4xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>Les visages derrière BéninMarket</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {equipe.map(e => (
            <div key={e.nom}
              className="bg-white rounded-[28px] p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl"
              style={{ border: '1px solid #EBEBEB', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <div className="w-20 h-20 rounded-[24px] mx-auto mb-5 flex items-center justify-center text-2xl font-black text-white"
                style={{ background: e.color }}>
                {e.initiales}
              </div>
              <h4 className="font-black text-[17px] mb-1" style={{ color: '#0D0D0D' }}>{e.nom}</h4>
              <p className="text-[12px] font-bold" style={{ color: '#D4920A' }}>{e.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 lg:px-20 pb-28">
        <div className="max-w-[1280px] mx-auto">
          <div className="relative overflow-hidden rounded-[40px] py-20 px-10 text-center"
            style={{ background: 'linear-gradient(160deg, #E6F8EA 0%, #D2F4DE 60%, #E6F8EA 100%)', border: '1px solid rgba(27,107,58,0.2)' }}>
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full" style={{ background: 'rgba(27,107,58,0.06)' }} />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full" style={{ background: 'rgba(212,146,10,0.06)' }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#0D0D0D' }}>
                Rejoignez l&apos;aventure BéninMarket
              </h2>
              <p className="text-[15px] font-medium mx-auto mb-10 max-w-md" style={{ color: '#6B7280' }}>
                Que vous soyez artisan, producteur ou passionné de culture béninoise, votre place est ici.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/inscription-vendeur"
                  className="px-9 py-4 rounded-full font-black text-[12px] uppercase tracking-wider text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: '#1B6B3A', boxShadow: '0 8px 24px rgba(27,107,58,0.25)' }}>
                  Devenir Vendeur
                </Link>
                <Link href="/produits"
                  className="px-9 py-4 rounded-full font-black text-[12px] uppercase tracking-wider transition-all hover:bg-white hover:shadow-md"
                  style={{ border: '2px solid rgba(27,107,58,0.4)', color: '#1B6B3A', background: 'white' }}>
                  Explorer le Marché
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
