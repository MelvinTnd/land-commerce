import Link from 'next/link'

const zones = [
  { zone: 'Cotonou & environs', delai: '24h', prix: '1 500 FCFA', gratuit: '30 000 FCFA' },
  { zone: 'Porto-Novo, Abomey-Calavi', delai: '24 - 48h', prix: '2 000 FCFA', gratuit: '40 000 FCFA' },
  { zone: 'Sud Bénin (Ouidah, Lokossa…)', delai: '48 - 72h', prix: '2 500 FCFA', gratuit: '50 000 FCFA' },
  { zone: 'Nord Bénin (Parakou, Natitingou…)', delai: '3 - 5 jours', prix: '3 500 FCFA', gratuit: '60 000 FCFA' },
  { zone: 'International (Afrique)', delai: '7 - 14 jours', prix: 'Sur devis', gratuit: '—' },
  { zone: 'International (Europe, Amériques)', delai: '10 - 21 jours', prix: 'Sur devis', gratuit: '—' },
]

const etapes = [
  { icon: 'shopping_cart', titre: 'Commande passée', description: 'Votre commande est confirmée et transmise au vendeur.' },
  { icon: 'inventory_2', titre: 'Préparation', description: 'L\'artisan prépare et emballe soigneusement votre commande.' },
  { icon: 'local_shipping', titre: 'Expédition', description: 'Votre colis est confié à notre partenaire logistique.' },
  { icon: 'home', titre: 'Livraison', description: 'Votre trésor arrive chez vous, prêt à être découvert !' },
]

export default function LivraisonPage() {
  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>

      {/* Hero */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004d28 100%)' }}
      >
        <span className="material-symbols-outlined mb-4" style={{ fontSize: '48px', color: '#F5B731' }}>local_shipping</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Livraison</h1>
        <p className="text-white/70 max-w-lg mx-auto">
          Nous livrons vos trésors artisanaux partout au Bénin et à l'international avec soin et rapidité.
        </p>
      </section>

      {/* Étapes */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        <h2 className="text-2xl font-extrabold text-center mb-12" style={{ color: '#1A1A1A' }}>
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {etapes.map((e, i) => (
            <div key={e.titre} className="text-center relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#1B6B3A' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#F5B731', fontSize: '28px' }}>
                  {e.icon}
                </span>
              </div>
              <div
                className="absolute top-8 left-1/2 w-full h-0.5 hidden md:block"
                style={{ background: i < 3 ? '#E5E7EB' : 'transparent', zIndex: 0 }}
              />
              <h4 className="font-bold text-sm mb-1" style={{ color: '#1A1A1A' }}>{e.titre}</h4>
              <p className="text-xs" style={{ color: '#6B7280' }}>{e.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grille tarifs */}
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-3" style={{ color: '#1A1A1A' }}>
            Zones & Tarifs
          </h2>
          <p className="text-sm text-center mb-10" style={{ color: '#6B7280' }}>
            Livraison gratuite à partir d'un certain montant selon votre zone.
          </p>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
            <div className="grid grid-cols-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest" style={{ background: '#1B6B3A', color: 'rgba(255,255,255,0.8)' }}>
              <span>Zone</span>
              <span>Délai</span>
              <span>Tarif</span>
              <span>Gratuit dès</span>
            </div>
            {zones.map((z, i) => (
              <div
                key={z.zone}
                className="grid grid-cols-4 px-6 py-4 text-sm items-center"
                style={{ background: i % 2 === 0 ? 'white' : '#FAFAF8', borderTop: '1px solid #F0EDE8' }}
              >
                <span className="font-semibold" style={{ color: '#1A1A1A' }}>{z.zone}</span>
                <span style={{ color: '#6B7280' }}>{z.delai}</span>
                <span className="font-semibold" style={{ color: '#D4920A' }}>{z.prix}</span>
                <span style={{ color: '#1B6B3A', fontWeight: '600' }}>{z.gratuit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl p-10" style={{ border: '1px solid #E5E7EB' }}>
          <h3 className="text-xl font-extrabold mb-3" style={{ color: '#1A1A1A' }}>
            Des questions sur la livraison ?
          </h3>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
            Notre équipe est disponible pour vous aider à suivre vos colis ou répondre à vos interrogations.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm hover:opacity-90 transition-all"
            style={{ background: '#1B6B3A' }}
          >
            Nous contacter
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </Link>
        </div>
      </section>

    </div>
  )
}
