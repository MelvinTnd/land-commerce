import Link from 'next/link'
import { getStorageUrl } from '@/lib/images'

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
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=200',
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
    <div className="flex flex-col gap-16 border-t border-gray-200 pt-16">

      {/* Section vendeur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Image vendeur */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden" style={{ border: '1px solid #EBEBEB' }}>
          <img
            src={getStorageUrl(shop.logo) || "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80"}
            alt={shop.name}
            className="w-full h-full object-cover grayscale-[20%] transition-transform hover:scale-105 duration-700"
          />
          {/* Citation superposée discrète */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white text-[15px] font-medium leading-relaxed drop-shadow-md">
              "Mettre en valeur le savoir-faire avec authenticité et passion, chaque jour."
            </p>
          </div>
        </div>

        {/* Infos vendeur */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-500">
              L'Âme de l'Objet
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              {shop.name}
            </h3>
          </div>
          <p className="text-[14px] leading-relaxed text-gray-600 font-medium">
            {shop.description || "Cette boutique propose des pièces uniques issues de l'artisanat. Découvrez leur univers et explorez l'authenticité de chaque création."}
          </p>
          <div className="flex flex-col gap-3 py-4 border-y border-gray-100 my-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-gray-400">
                location_on
              </span>
              <p className="text-[13px] font-medium text-gray-900">{shop.location || "Bénin"}</p>
            </div>
          </div>

          {/* Bouton Voir la boutique */}
          <div className="flex gap-3">
            <Link
              href={`/boutique/${shop.slug}`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white text-[13px] font-semibold transition-colors hover:bg-gray-800"
            >
              Visiter la boutique
            </Link>
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-300 text-[13px] font-semibold text-gray-900 transition-colors hover:border-black">
              Contacter le vendeur
            </button>
          </div>
        </div>
      </div>

      {/* Fiche technique + Avis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pb-12 border-b border-gray-200">

        {/* Fiche technique */}
        <div>
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Fiche Technique</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-10">
            {specs.map((spec) => (
              <div key={spec.label} className="border-l border-gray-200 pl-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="material-symbols-outlined text-[14px] text-gray-400">
                    {spec.icon}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {spec.label}
                  </p>
                </div>
                <p className="text-[13px] font-medium text-gray-900">
                  {spec.valeur}
                </p>
              </div>
            ))}
          </div>

          {/* Conseils d'entretien */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[18px] text-gray-900">
                auto_fix_high
              </span>
              <h4 className="text-sm font-bold tracking-tight text-gray-900">Conseils d'entretien</h4>
            </div>
            <div className="space-y-3">
              {conseils.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`material-symbols-outlined text-[16px] mt-0.5 ${i < 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                    {i < 2 ? 'check' : 'close'}
                  </span>
                  <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Avis clients */}
        <div className="border-l lg:border-l-0 border-gray-200 pl-0 lg:pl-0">
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold tracking-tight text-gray-900">Expériences Clients</h3>
            <button className="text-[12px] font-semibold text-gray-500 hover:text-black uppercase tracking-widest border-b border-gray-400 transition-colors">
              Voir tout
            </button>
          </div>
          
          <div className="flex flex-col gap-8">
            {avis.map((a) => (
              <div key={a.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className={`material-symbols-outlined text-[15px] ${i <= a.note ? 'text-black' : 'text-gray-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                </div>
                <p className="text-[14px] leading-relaxed mb-4 text-gray-800 font-medium">
                  {a.commentaire}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-xs font-bold text-gray-700 uppercase">
                    {a.initiales}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-gray-900 leading-tight">{a.nom}</p>
                    <p className="text-[11px] text-gray-500">{a.lieu}</p>
                  </div>
                </div>
                {a.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {a.images.map((img, i) => (
                      <div key={i} className="w-16 h-16 border border-gray-200 overflow-hidden">
                        <img
                          src={img}
                          alt="avis"
                          className="w-full h-full object-cover transition-transform hover:scale-110"
                        />
                      </div>
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