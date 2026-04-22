import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }} className="flex items-center justify-center px-6">
      <div className="text-center max-w-lg">

        {/* Big 404 */}
        <div className="relative mb-8 select-none">
          <span className="text-[160px] md:text-[200px] font-black leading-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px #EBEBEB',
              letterSpacing: '-10px',
            }}>
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-[24px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E6F8EA, #D2F4DE)' }}>
              <span className="material-symbols-outlined text-[40px]" style={{ color: '#1B6B3A' }}>
                search_off
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: '#0D0D0D' }}>
          Page introuvable
        </h1>
        <p className="text-[15px] font-medium leading-relaxed mb-10" style={{ color: '#9CA3AF' }}>
          Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil pour continuer votre exploration.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-[12px] uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#1B6B3A' }}>
            <span className="material-symbols-outlined text-[16px]">home</span>
            Retour à l&apos;accueil
          </Link>
          <Link href="/produits"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-[12px] uppercase tracking-wider transition-all hover:bg-white hover:shadow-md"
            style={{ border: '1.5px solid #EBEBEB', color: '#374151', background: 'white' }}>
            <span className="material-symbols-outlined text-[16px]">explore</span>
            Explorer les produits
          </Link>
        </div>

        {/* Liens rapides */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #EBEBEB' }}>
          <p className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: '#9CA3AF' }}>
            Liens utiles
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Blog', href: '/blog' },
              { label: 'Boutiques', href: '/boutiques' },
              { label: 'Promotions', href: '/promotions' },
              { label: 'Contact', href: '/contact' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-[13px] font-bold transition-colors hover:text-[#1B6B3A]"
                style={{ color: '#6B7280' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
