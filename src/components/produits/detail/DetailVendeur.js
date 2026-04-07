import Link from 'next/link'

const specs = [
  { icon: 'straighten', label: 'Dimensions', valeur: 'H 45cm x L 15cm x P 12cm' },
  { icon: 'scale', label: 'Poids', valeur: 'Environ 2.85 kg' },
  { icon: 'forest', label: 'Matière', valeur: 'Bois d\'Ébène massif (Diospyros)' },
  { icon: 'brush', label: 'Finition', valeur: 'Cire d\'abeille naturelle & polissage main' },
]

const conseils = [
  'Dépoussiérez avec un chiffon doux et sec.',
  'Une fois par an, appliquez une fine couche de cire naturelle.',
  'Évitez l\'exposition directe et prolongée au soleil.',
  'Évitez les sources de chaleur intense (radiateurs).',
]

const avis = [
  {
    id: 1,
    initiales: 'AS',
    nom: 'Aurélie S.',
    lieu: 'Cotonou, Bénin',
    note: 5,
    commentaire: '"Une pièce absolument magnifique qui trône désormais dans mon salon. Le travail du bois est d\'une finesse incroyable. La livraison s\'est faite en moins de 24h."',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArFSaPLLYoQ2B9geElveMg62mhBDu-oY0qqMtyZb84vbbJiT8TjxvMRUlBWDe-5S229uLCTRp0lpRp4RKrgR474X653n_ZAC6ogOb96KdjomYMR92phme4pYG9n9tTt1ppg1YHBgl61KhKCMLW48AxsMCB5rZxcG-dADp6wXy2m3TEwOyhCR9JKzMq1bGV9G52m0JkXeRUs3HaqxzXUWIhEHyG4D7HhQBAJnJncOKKbIgcf1xPMwXfXhjjwooj4saRxcuebT3eeLw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxqRAaWkBT_0J6MyJUKQptYmi09bDLjIrnAn3LtsruJQcpMGvAy-7lia7UjiXjhx4Ld3MU5dJxj7VvKmnWcAIF1_4CTFFjQkNQ1bjPtdsGvHspnR8KuFEynmT_V71KDzup3hGiQYeQV2b877cHCsEhE-85oCOwl4GFgbakDqUeOlSdZSCEeAPMa21yn5D6uRhzM29Q_GfjiXwCNe1292st0ewZ-BVwGimnDmL5Qrl6tXBpbEUNlXhfCyAO8OUOAoURxoH4GJVTPBw',
    ],
  },
  {
    id: 2,
    initiales: 'BK',
    nom: 'Berlin K.',
    lieu: 'Paris, France',
    note: 5,
    commentaire: '"Le bois est livré et noble, l\'emballage était très sécurisé. Je recommande vivement l\'Atelier du Dahomey."',
    images: [],
  },
]
export default function DetailVendeur({ shop, rating, reviews }) {
  if (!shop) return null

  return (
    <div className="flex flex-col gap-16">

      {/* Section vendeur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Image vendeur + citation */}
        <div className="relative rounded-3xl overflow-hidden" style={{ height: '380px' }}>
          <img
            src={shop.logo || "https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?auto=format&fit=crop&q=80"}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          {/* Citation flottante */}
          <div
            className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            <p className="text-sm italic mb-2" style={{ color: '#374151' }}>
              "Mettre en valeur le savoir-faire béninois avec authenticité et passion, chaque jour."
            </p>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1B6B3A' }}>
              — Artisan {shop.name}
            </p>
          </div>
        </div>

        {/* Infos vendeur */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#1B6B3A' }}>
              L'Âme de l'Objet
            </p>
            <h3 className="text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>
              {shop.name}
            </h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
            {shop.description || "Cette boutique propose des pièces uniques issues de l'artisanat béninois. Découvrez leur univers et explorez l'authenticité de chaque création."}
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: '#F0EDE8' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1B6B3A' }}>
                  location_on
                </span>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#1A1A1A' }}>Localisation</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>{shop.location || "Bénin"}</p>
              </div>
            </div>
          </div>

          {/* Bouton Voir la boutique */}
          <div className="flex gap-3 mt-2">
            <Link
              href={`/boutique/${shop.slug}`}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
              style={{ background: '#1B6B3A', color: 'white' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>storefront</span>
              Voir la Boutique
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:bg-gray-100" style={{ border: '2px solid #E5E7EB', color: '#374151' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
              Contacter
            </button>
          </div>
        </div>
      </div>

      {/* Fiche technique + Avis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Fiche technique */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 rounded-full" style={{ background: '#1B6B3A' }}/>
            <h3 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Fiche Technique</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-2xl p-4"
                style={{ background: '#F7F5F0', border: '1px solid #E5E7EB' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#1B6B3A' }}>
                    {spec.icon}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                    {spec.label}
                  </p>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
                  {spec.valeur}
                </p>
              </div>
            ))}
          </div>

          {/* Conseils d'entretien */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#D4920A' }}>
                auto_fix_high
              </span>
              <h4 className="text-base font-bold" style={{ color: '#1A1A1A' }}>Conseils d'entretien</h4>
            </div>
            <p className="text-xs mb-4" style={{ color: '#6B7280' }}>
              L'ébène est un bois noble et dense qui vit avec son environnement. Pour préserver son éclat précieux :
            </p>
            <div className="grid grid-cols-2 gap-2">
              {conseils.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: i < 2 ? '#F0EDE8' : '#FEF2F2' }}
                  >
                    <span style={{ fontSize: '8px', color: i < 2 ? '#1B6B3A' : '#EF4444' }}>
                      {i < 2 ? '✓' : '✗'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Avis clients */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ background: '#1B6B3A' }}/>
              <h3 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>Expériences Clients</h3>
            </div>
            <button className="text-xs font-semibold" style={{ color: '#1B6B3A' }}>
              Voir tout →
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {avis.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl p-5"
                style={{ background: '#F7F5F0', border: '1px solid #E5E7EB' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                      style={{ background: '#1B6B3A' }}
                    >
                      {a.initiales}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>{a.nom}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{a.lieu}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} width="12" height="12" fill="#F5B731" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs leading-relaxed italic mb-3" style={{ color: '#6B7280' }}>
                  {a.commentaire}
                </p>
                {a.images.length > 0 && (
                  <div className="flex gap-2">
                    {a.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="avis"
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}