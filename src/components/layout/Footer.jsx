import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#F7F5F0', borderTop: '1px solid #E0DDD5' }} className="py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + description */}
        <div>
          <h3 className="text-xl font-bold tracking-widest uppercase mb-3" style={{ color: '#1B6B3A' }}>
            BéninMarket
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Le premier marché en ligne dédié à la promotion des PME et artisans béninois authentiques à travers le monde.
          </p>
          <div className="flex gap-3">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-green-50" style={{ border: '1px solid #1B6B3A', color: '#1B6B3A' }}>
              🌐
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-green-50" style={{ border: '1px solid #1B6B3A', color: '#1B6B3A' }}>
              ↗
            </button>
          </div>
        </div>

        {/* Marketplace */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#1B6B3A' }}>
            Marketplace
          </h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">À propos</Link></li>
            <li><Link href="/produits" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">Toutes les catégories</Link></li>
            <li><Link href="/inscription-vendeur" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">Devenir vendeur</Link></li>
            <li><Link href="/promotions" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">Ventes aux enchères</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#1B6B3A' }}>
            Support
          </h4>
          <ul className="space-y-3">
            <li><Link href="/contact" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">Contact</Link></li>
            <li><Link href="/livraison" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">Livraison</Link></li>
            <li><Link href="/retours" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">Retours</Link></li>
            <li><Link href="/faq" className="text-xs text-gray-600 uppercase tracking-wide hover:text-green-800">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#1B6B3A' }}>
            Newsletter
          </h4>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Inscrivez-vous pour recevoir les nouveautés et offres exclusives.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-3 py-2 text-sm outline-none rounded-l-md bg-white"
              style={{ border: '1px solid #E0DDD5' }}
            />
            <button
              className="px-4 py-2 text-white text-sm font-semibold rounded-r-md hover:bg-green-800 transition-colors"
              style={{ background: '#1B6B3A' }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="max-w-6xl mx-auto mt-10 pt-6" style={{ borderTop: '1px solid #E0DDD5' }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            © 2026 BéninMarket. L'excellence locale.
          </p>
          <div className="flex gap-6">
            <Link href="/cgu" className="text-xs text-gray-500 uppercase tracking-wide hover:text-green-800">
              Conditions de vente
            </Link>
            <Link href="/confidentialite" className="text-xs text-gray-500 uppercase tracking-wide hover:text-green-800">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}