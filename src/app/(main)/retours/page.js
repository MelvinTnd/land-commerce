import Link from 'next/link'

const etapes = [
  { icon: 'inventory_2', titre: 'Emballage soigné', desc: 'L\'article doit être dans son état d\'origine avec emballage.' },
  { icon: 'schedule', titre: '14 jours', desc: 'Vous disposez de 14 jours après réception.' },
  { icon: 'payments', titre: 'Remboursement 7j', desc: 'Remboursé sous 7 jours ouvrés après vérification.' },
]

const exceptions = [
  'Produits alimentaires périssables',
  'Articles sur mesure ou personnalisés',
  'Produits dont le sceau hygiène a été brisé',
  'Articles soldés (sauf défaut)',
]

export default function RetoursPage() {
  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004d28 100%)' }}>
        <span className="material-symbols-outlined mb-4" style={{ fontSize: '48px', color: '#F5B731' }}>undo</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Retours & Échanges</h1>
        <p className="text-white/70 max-w-lg mx-auto">Votre satisfaction est notre priorité.</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {etapes.map((e) => (
            <div key={e.titre} className="bg-white rounded-2xl p-6 text-center" style={{ border: '1px solid #E5E7EB' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: '#1B6B3A' }}>
                <span className="material-symbols-outlined" style={{ color: '#F5B731', fontSize: '24px' }}>{e.icon}</span>
              </div>
              <h4 className="font-bold mb-2" style={{ color: '#1A1A1A' }}>{e.titre}</h4>
              <p className="text-sm" style={{ color: '#6B7280' }}>{e.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <h3 className="font-bold text-lg mb-4" style={{ color: '#991B1B' }}>Articles non éligibles</h3>
          <ul className="flex flex-col gap-2">
            {exceptions.map((e, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: '#7F1D1D' }}>• {e}</li>
            ))}
          </ul>
        </div>

        <div className="text-center mt-12">
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-sm" style={{ background: '#1B6B3A' }}>
            Contacter le Support
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
