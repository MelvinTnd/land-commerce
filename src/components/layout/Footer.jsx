import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  Marketplace: [
    { label: 'À propos', href: '/about' },
    { label: 'Tous les produits', href: '/produits' },
    { label: 'Boutiques', href: '/boutiques' },
    { label: 'Promotions', href: '/promotions' },
    { label: 'Devenir créateur', href: '/inscription-vendeur' },
  ],
  Support: [
    { label: 'Nous contacter', href: '/contact' },
    { label: 'Mon compte', href: '/compte' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">

      {/* ── NEWSLETTER ── */}
      <div className="border-b border-gray-200 px-6 md:px-12 lg:px-20 py-16" style={{ background: '#F7F9F8' }}>
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
              Inscrivez-vous à notre newsletter
            </h3>
            <p className="text-sm text-gray-600 max-w-sm">
              Soyez les premiers informés de nos nouvelles collections et offres exclusives.
            </p>
          </div>
          <div className="flex w-full md:w-auto h-12 border bg-white" style={{ borderColor: '#1B6B3A' }}>
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-0 text-sm outline-none bg-transparent text-gray-900"
            />
            <button className="px-6 text-[11px] font-bold uppercase tracking-widest text-white transition-colors"
               style={{ background: '#1B6B3A' }}>
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-bold text-[24px] tracking-tight leading-none" style={{ color: '#1B6B3A' }}>
                CauriMarket.
              </span>
            </div>
            <p className="text-[13px] leading-relaxed mb-8 max-w-xs text-gray-500">
              Le rendez-vous incontournable pour découvrir l'excellence et le savoir-faire des créateurs béninois.
            </p>

            {/* Social icons */}
            <div className="flex gap-4 mb-8">
              {[
                { icon: 'language', label: 'Web' },
                { icon: 'alternate_email', label: 'Email' },
                { icon: 'share', label: 'Partager' },
              ].map(s => (
                <button key={s.label}
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center transition-colors"
                  style={{ color: '#1B6B3A' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1B6B3A'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}>
                  <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-3">
              {[
                { icon: 'verified_user', label: 'Paiement 100% sécurisé' },
                { icon: 'local_shipping', label: 'Livraison express disponible' },
                { icon: 'support_agent', label: 'Service client dédié' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3 text-gray-600">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#1B6B3A' }}>{b.icon}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-[11px] font-bold uppercase tracking-widest mb-6 border-b pb-2 inline-block"
                  style={{ color: '#1A1A1A', borderColor: '#E5E7EB' }}>
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href}
                        className="text-[13px] text-gray-600 transition-colors hover:text-[#1B6B3A]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-gray-200 px-6 md:px-12 lg:px-20 py-6 bg-white">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
            © 2026 CauriMarket. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#1B6B3A' }}>
              En ligne · Bénin
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}