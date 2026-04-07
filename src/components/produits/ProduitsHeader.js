export default function ProduitsHeader({ recherche, setRecherche }) {
  return (
    <div
      className="px-10 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #2E8B57 100%)' }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#F5B731' }}>
          Notre catalogue
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Tous les Produits
        </h1>
        <p className="text-white/70 text-base max-w-xl">
          Découvrez l'ensemble de notre sélection de produits authentiques béninois.
        </p>

        {/* Barre de recherche */}
        <div
          className="mt-8 flex items-center bg-white rounded-full px-5 py-3 max-w-lg gap-3"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
        >
          <svg width="18" height="18" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: '#1A1A1A' }}
          />
        </div>
      </div>

      <div
        className="absolute right-0 top-0 opacity-5 text-white pointer-events-none"
        style={{ fontSize: '300px', lineHeight: 1 }}
      >
        ✦
      </div>
    </div>
  )
}