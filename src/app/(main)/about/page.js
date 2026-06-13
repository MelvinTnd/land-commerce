'use client'
import Link from 'next/link'
import Image from 'next/image'

const chiffres = [
  { valeur: '500+', label: 'Artisans Partenaires', icon: 'handshake' },
  { valeur: '12k+', label: 'Produits Référencés', icon: 'inventory_2' },
  { valeur: '8', label: 'Départements Couverts', icon: 'map' },
  { valeur: '98%', label: 'Clients Satisfaits', icon: 'thumb_up' },
]

const valeurs = [
  { icon: 'handshake', titre: 'Commerce Équitable', description: "Nous garantissons une rémunération juste aux artisans et producteurs locaux, sans intermédiaires superflus." },
  { icon: 'eco', titre: 'Durabilité', description: "Nos partenaires utilisent des matières naturelles et des techniques ancestrales respectueuses de l'environnement." },
  { icon: 'verified', titre: 'Authenticité', description: "Chaque produit est certifié authentique. Nous vérifions personnellement chaque artisan sur le terrain." },
  { icon: 'groups', titre: 'Communauté', description: "CauriMarket est bien plus qu'un marché : c'est une communauté de passionnés qui célèbrent l'héritage béninois." },
]

const equipe = [
  { nom: 'Amina Koudjo', role: 'Fondatrice & CEO', initiales: 'AK' },
  { nom: 'Yves Hounkpatin', role: 'Directeur Technique', initiales: 'YH' },
  { nom: 'Grâce Ahouandjinou', role: 'Responsable Artisans', initiales: 'GA' },
]

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ background: '#F7F5F0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-8" style={{ color: '#9CA3AF' }}>
            <Link href="/" className="hover:text-[#1B6B3A] transition-colors">Accueil</Link>
            <span>/</span>
            <span style={{ color: '#0D0D0D' }}>À propos</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] mb-4"
                style={{ color: '#D4920A' }}>
                <span className="w-4 h-px bg-[#D4920A] inline-block" />
                Notre Mission
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4" style={{ color: '#0D0D0D' }}>
                Connecter le Bénin<br />
                <span style={{ color: '#1B6B3A' }}>au Monde.</span>
              </h1>
              <p className="text-[15px] font-medium leading-relaxed mb-8" style={{ color: '#6B7280' }}>
                CauriMarket est la première marketplace dédiée à la promotion et la vente des produits artisanaux et locaux du Bénin à travers le monde entier.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/produits"
                  className="px-7 py-3 font-black text-[11px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                  style={{ background: '#1B6B3A' }}>
                  Explorer le marché
                </Link>
                <Link href="/contact"
                  className="px-7 py-3 font-black text-[11px] uppercase tracking-widest border border-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
                  style={{ color: '#0D0D0D' }}>
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-px bg-gray-200 shrink-0 w-full lg:w-64">
              {chiffres.map(c => (
                <div key={c.label} className="bg-white p-5 flex flex-col gap-2">
                  <span className="material-symbols-outlined text-[20px]" style={{ color: '#1B6B3A' }}>{c.icon}</span>
                  <p className="text-3xl font-black leading-none" style={{ color: '#0D0D0D' }}>{c.valeur}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Histoire ── */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] mb-4 flex items-center gap-2"
              style={{ color: '#1B6B3A' }}>
              <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
              Notre Histoire
            </span>
            <h2 className="text-3xl font-black mb-6 tracking-tight" style={{ color: '#0D0D0D' }}>
              Né de la passion pour le patrimoine béninois
            </h2>
            <p className="text-[15px] leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              Fondé en 2026 à Cotonou, CauriMarket est né d&apos;un constat simple : les artisans béninois créent des merveilles, mais peinent à atteindre un marché plus large. Notre plateforme brise cette barrière en offrant une vitrine digitale premium à chaque créateur.
            </p>
            <p className="text-[15px] leading-relaxed" style={{ color: '#6B7280' }}>
              De Porto-Novo à Natitingou, de Ouidah à Parakou, nous parcourons le pays pour dénicher les meilleurs artisans et leurs créations uniques. Chaque produit raconte une histoire que nous voulons partager avec le monde.
            </p>
          </div>
          <div className="relative overflow-hidden h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1580893246395-52aead8960dc?auto=format&fit=crop&q=80&w=800"
              alt="Marché artisanal béninois"
              fill className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)' }} />
            <div className="absolute bottom-5 left-5 bg-white px-4 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]" style={{ color: '#1B6B3A' }}>location_on</span>
              <div>
                <p className="font-black text-[12px]" style={{ color: '#0D0D0D' }}>Cotonou, Bénin</p>
                <p className="text-[10px]" style={{ color: '#9CA3AF' }}>Depuis 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valeurs ── */}
      <section style={{ background: '#F7F5F0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20">
          <div className="mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] mb-3 flex items-center gap-2"
              style={{ color: '#1B6B3A' }}>
              <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
              Nos Valeurs
            </span>
            <h2 className="text-3xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>Ce qui nous guide</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {valeurs.map(v => (
              <div key={v.titre} className="bg-white p-8">
                <span className="material-symbols-outlined text-[28px] mb-5 block" style={{ color: '#1B6B3A' }}>{v.icon}</span>
                <h4 className="font-black text-[15px] mb-3" style={{ color: '#0D0D0D' }}>{v.titre}</h4>
                <p className="text-[13px] leading-relaxed" style={{ color: '#6B7280' }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Équipe ── */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] mb-3 flex items-center gap-2"
            style={{ color: '#1B6B3A' }}>
            <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
            Notre Équipe
          </span>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>Les visages derrière CauriMarket</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
          {equipe.map(e => (
            <div key={e.nom} className="bg-white p-10 flex flex-col items-center text-center transition-colors"
              onMouseEnter={el => el.currentTarget.style.background = '#F7F5F0'}
              onMouseLeave={el => el.currentTarget.style.background = '#fff'}>
              <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center text-2xl font-black text-white"
                style={{ background: '#1B6B3A' }}>
                {e.initiales}
              </div>
              <h4 className="font-black text-[17px] mb-1" style={{ color: '#0D0D0D' }}>{e.nom}</h4>
              <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: '#D4920A' }}>{e.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#F7F5F0', borderTop: '1px solid #E5E7EB' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-20 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] mb-4 flex items-center justify-center gap-2"
            style={{ color: '#1B6B3A' }}>
            <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
            Rejoindre CauriMarket
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight" style={{ color: '#0D0D0D' }}>
            Rejoignez l&apos;aventure CauriMarket
          </h2>
          <p className="text-[15px] font-medium mx-auto mb-10 max-w-md" style={{ color: '#6B7280' }}>
            Que vous soyez artisan, producteur ou passionné de culture béninoise, votre place est ici.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/inscription-vendeur"
              className="px-8 py-4 font-black text-[11px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              style={{ background: '#1B6B3A' }}>
              Devenir Vendeur
            </Link>
            <Link href="/produits"
              className="px-8 py-4 font-black text-[11px] uppercase tracking-widest border transition-colors hover:bg-[#1B6B3A] hover:text-white hover:border-[#1B6B3A]"
              style={{ borderColor: '#D1D5DB', color: '#374151' }}>
              Explorer le Marché
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
