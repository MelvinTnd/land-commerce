import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  Marketplace: [
    { label: 'À propos', href: '/about' },
    { label: 'Tous les produits', href: '/produits' },
    { label: 'Boutiques', href: '/boutiques' },
    { label: 'Promotions', href: '/promotions' },
    { label: 'Devenir vendeur', href: '/inscription-vendeur' },
  ],
  Support: [
    { label: "Centre d'aide", href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Livraison', href: '/livraison' },
    { label: 'Retours', href: '/retours' },
  ],
  Légal: [
    { label: "Conditions d'utilisation", href: '/cgu' },
    { label: 'Confidentialité', href: '/confidentialite' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#F7F5F0' }}>

      {/* Newsletter band */}
      <div className="relative overflow-hidden px-6 md:px-12 lg:px-20 py-14"
        style={{ background: 'linear-gradient(135deg, #E6F8EA 0%, #D2F4DE 60%, #E6F8EA 100%)', borderBottom: '1px solid rgba(27,107,58,0.1)' }}>
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'rgba(27,107,58,0.08)' }} />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'rgba(212,146,10,0.08)' }} />

        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] mb-2" style={{ color: '#1B6B3A' }}>
              Newsletter
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#0D0D0D' }}>
              Ne ratez aucune offre exclusive
            </h3>
            <p className="text-sm mt-2 max-w-sm" style={{ color: '#6B7280' }}>
              Recevez promotions, nouveautés artisanales et conseils chaque semaine.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto min-w-[340px]">
            <input
              type="email"
              placeholder="votre@email.bj"
              className="flex-1 px-5 py-3.5 rounded-2xl text-sm font-medium outline-none bg-white transition-all"
              style={{ border: '1.5px solid rgba(27,107,58,0.25)', color: '#0D0D0D' }}
            />
            <button className="px-6 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-wider shrink-0 text-white transition-all hover:opacity-90"
              style={{ background: '#1B6B3A', boxShadow: '0 4px 16px rgba(27,107,58,0.25)' }}>
              S&apos;abonner
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 relative rounded-xl overflow-hidden">
                <Image src="/logo.png" alt="BéninMarket" fill className="object-contain" sizes="40px" />
              </div>
              <span className="font-black text-[20px] tracking-tight" style={{ color: '#0D0D0D' }}>
                Bénin<span style={{ color: '#1B6B3A' }}>Market</span>
              </span>
            </div>
            <p className="text-[14px] leading-relaxed mb-7 max-w-xs" style={{ color: '#6B7280' }}>
              Le premier marché en ligne dédié à la promotion des PME et artisans béninois authentiques à travers le monde.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mb-8">
              {[
                { icon: 'language', label: 'Web' },
                { icon: 'alternate_email', label: 'Email' },
                { icon: 'share', label: 'Partager' },
              ].map(s => (
                <button key={s.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-md bg-white"
                  style={{ border: '1.5px solid rgba(27,107,58,0.2)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: '#1B6B3A' }}>{s.icon}</span>
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
                <h4 className="text-[10px] font-black uppercase tracking-[0.22em] mb-5" style={{ color: '#9CA3AF' }}>
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
      <div className="px-6 md:px-12 lg:px-20 py-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#F0EDE8' }}>
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
            © 2026 BéninMarket — Fait avec ❤️ pour l&apos;artisanat béninois
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#1B6B3A' }} />
            <span className="text-[11px] font-bold" style={{ color: '#9CA3AF' }}>
              En ligne · Bénin
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}