import Link from 'next/link'

const footerLinks = {
  Marketplace: [
    { label: 'À propos', href: '/about' },
    { label: 'Tous les produits', href: '/produits' },
    { label: 'Boutiques', href: '/boutiques' },
    { label: 'Promotions', href: '/promotions' },
    { label: 'Devenir vendeur', href: '/inscription-vendeur' },
  ],
  Support: [
    { label: 'Contact', href: '/contact' },
    { label: 'Mon compte', href: '/compte' },
    { label: 'CGU', href: '/cgu' },
    { label: 'Confidentialité', href: '/confidentialite' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #E5E7EB' }}>

      {/* Newsletter */}
      <div style={{ background: '#0D0D0D' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] mb-3 flex items-center gap-2"
              style={{ color: '#1B6B3A' }}>
              <span className="w-4 h-px bg-[#1B6B3A] inline-block" />
              Newsletter
            </span>
            <h3 className="text-2xl font-black tracking-tight text-white mb-1">
              Ne ratez aucune offre exclusive
            </h3>
            <p className="text-[14px] font-medium max-w-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Recevez promotions, nouveautés artisanales et conseils chaque semaine.
            </p>
          </div>
          <div className="flex w-full md:max-w-sm shrink-0">
            <input
              type="email"
              placeholder="votre@email.bj"
              className="flex-1 px-5 py-3.5 text-[13px] font-medium outline-none bg-white border-0 transition-all"
              style={{ color: '#0D0D0D' }}
            />
            <button className="px-6 py-3.5 font-black text-[11px] uppercase tracking-widest text-white shrink-0 transition-opacity hover:opacity-90"
              style={{ background: '#1B6B3A' }}>
              S&apos;abonner
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <span className="font-black text-[22px] tracking-tight" style={{ color: '#0D0D0D' }}>
                Cauri<span style={{ color: '#1B6B3A' }}>Market</span>
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed mb-7 max-w-xs" style={{ color: '#6B7280' }}>
              Le premier marché en ligne dédié à la promotion des PME et artisans béninois authentiques à travers le monde.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mb-8">
              {[
                { icon: 'language', label: 'Web' },
                { icon: 'alternate_email', label: 'Email' },
                { icon: 'share', label: 'Partager' },
              ].map(s => (
                <button key={s.label}
                  className="w-9 h-9 border border-gray-200 flex items-center justify-center transition-all hover:border-gray-900 hover:bg-gray-900"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6B7280' }}>
                  <span className="material-symbols-outlined text-[17px]">{s.icon}</span>
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-2">
              {[
                { icon: 'verified_user', label: 'Paiement 100% sécurisé' },
                { icon: 'local_shipping', label: 'Livraison dans tout le Bénin' },
                { icon: 'support_agent', label: 'Support 6j/7' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: '#1B6B3A' }}>{b.icon}</span>
                  <span className="text-[11px] font-bold" style={{ color: '#9CA3AF' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.22em] mb-5" style={{ color: '#0D0D0D' }}>
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href}
                        className="text-[13px] font-medium transition-colors hover:text-[#1B6B3A]"
                        style={{ color: '#6B7280' }}>
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

      {/* Bottom bar */}
      <div className="px-6 md:px-12 lg:px-20 py-5" style={{ borderTop: '1px solid #F0EDE8' }}>
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
            © 2026 CauriMarket — Fait avec ❤️ pour l&apos;artisanat béninois
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 animate-pulse" style={{ background: '#1B6B3A' }} />
            <span className="text-[11px] font-bold" style={{ color: '#9CA3AF' }}>
              En ligne · Bénin
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}