import Link from 'next/link'

const promos = [
  {
    id: 1, titre: 'Vente Flash Artisanat', reduction: '-30%',
    description: 'Sculptures, masques et mobilier d\'exception à prix réduit pendant 48h.',
    fin: '15 Avril 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQWt3NsHUOOcKgwDibsPPLilYMKO3ygaYWDdvHdsDg4LCV8TJwv0kSw5EGxRz7o_NoxtE39htKAzNOxFGDp8W7asYbM-Txolc1fRRmELgtKN-uGOi83rb0agNO706CIkerjUB4zKOMWpk7o6y6n1j30_lGgaxXcWLNJU38_Gf36l2xgHxgk9E65T8yx1xkIlN5pBnGaqj_mQWuEuzF-xXWpPd6aBEsJh6a-N9i44F-1H2mNrddeHLM_TUvy7dHjVida3nsiXz3e9E',
  },
  {
    id: 2, titre: 'Spécial Terroir', reduction: '-20%',
    description: 'Miel, épices et produits bio des collines à prix doux.',
    fin: '30 Avril 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcJ-0HGiyTwgm_wYw4E2CiHdcft-IrF2POKfC2LKeJFCu1jb5y1JmZBv064viAifXA0dgI_YWUb-z5gUj5pD9ht2MaDgu0DTWMe_NLGYW_P1vqzOqkM7iFKbANDX2PGfk0gDwwvNiyRYcxwihdjgySSBPWUzlcgiX8fgEDGEJlhNXo95ijcNVfUR7X0g6T5B6hqS3arOiCc22pUM4ITH6XIMck3ZIJp0uWSfS8tBMxygvBgGtSuL5kSasJjCAj9ZuXYnlrwiwieJk',
  },
  {
    id: 3, titre: 'Collection Mode', reduction: '-25%',
    description: 'Tuniques, bijoux et accessoires de créateurs béninois.',
    fin: '20 Avril 2026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCczKnDZoTJ8Ra16mREFvEHYD0tieC3q9_k4WUyu-uoxv_VGJ_zStL3gbd3rnwF86q5MpJ4ov1KEr8-Yj1aI38qEnddVmqvREGna0XU60tpXNJyu3pd66fXUBSozJy24AFiGmZ8Cn1QputwrZfvK_WEE8_ro87dmS-G9jpAEH5CFXNQ0DuvgwVoTI8P9YlmdyUKlzhv7vYniNs93vTFx0oN_ZmJyqc3GKFivqizsdjOu-eXbZK7ZXOf2eAhn58Kjll8AJGTffLeIow',
  },
]

export default function PromotionsPage() {
  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, #D4920A 0%, #B87A08 100%)' }}>
        <span className="material-symbols-outlined mb-4" style={{ fontSize: '48px', color: 'white' }}>local_offer</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Promotions & Ventes</h1>
        <p className="text-white/80 max-w-lg mx-auto">Profitez d'offres exclusives sur les trésors du Bénin.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promos.map((p) => (
            <div key={p.id} className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div className="relative overflow-hidden" style={{ height: '220px' }}>
                <img src={p.image} alt={p.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-extrabold text-white" style={{ background: '#EF4444' }}>{p.reduction}</span>
              </div>
              <div className="p-6">
                <h3 className="font-extrabold text-lg mb-2" style={{ color: '#1A1A1A' }}>{p.titre}</h3>
                <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: '#D4920A' }}>Jusqu'au {p.fin}</span>
                  <Link href="/produits" className="px-5 py-2 rounded-full text-xs font-bold text-white" style={{ background: '#1B6B3A' }}>
                    Voir l'offre
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
