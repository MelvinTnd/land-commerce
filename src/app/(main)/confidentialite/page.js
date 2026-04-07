export default function ConfidentialitePage() {
  const sections = [
    { titre: '1. Collecte des Données', contenu: 'Nous collectons les informations que vous fournissez lors de la création de compte (nom, email, téléphone, adresse) et lors de vos commandes. Nous collectons également des données de navigation anonymisées pour améliorer votre expérience.' },
    { titre: '2. Utilisation des Données', contenu: 'Vos données sont utilisées pour : traiter vos commandes, vous contacter concernant vos achats, personnaliser votre expérience, vous envoyer des offres (avec votre consentement), et améliorer notre service.' },
    { titre: '3. Partage des Données', contenu: 'Nous ne vendons jamais vos données. Elles sont partagées uniquement avec : les vendeurs (pour honorer vos commandes), nos prestataires de paiement (MTN, Moov), et nos partenaires logistiques (pour la livraison).' },
    { titre: '4. Sécurité', contenu: 'Vos données sont protégées par des mesures de sécurité techniques (chiffrement SSL, pare-feu) et organisationnelles. L\'accès est limité aux personnes autorisées.' },
    { titre: '5. Cookies', contenu: 'Notre site utilise des cookies essentiels au fonctionnement et des cookies analytiques (avec votre consentement). Vous pouvez gérer vos préférences cookies à tout moment.' },
    { titre: '6. Vos Droits', contenu: 'Vous disposez d\'un droit d\'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à privacy@beninmarket.bj.' },
    { titre: '7. Conservation', contenu: 'Vos données de compte sont conservées tant que votre compte est actif. Les données de commande sont conservées 5 ans (obligation légale). Vous pouvez demander la suppression de votre compte à tout moment.' },
    { titre: '8. Contact', contenu: 'Pour toute question relative à la protection de vos données, contactez notre Délégué à la Protection des Données : privacy@beninmarket.bj — BéninMarket, Quartier Cadjèhoun, Cotonou, Bénin.' },
  ]

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004d28 100%)' }}>
        <span className="material-symbols-outlined mb-4" style={{ fontSize: '48px', color: '#F5B731' }}>shield</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Politique de Confidentialité</h1>
        <p className="text-white/70">Dernière mise à jour : 1er avril 2026</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 flex flex-col gap-8" style={{ border: '1px solid #E5E7EB' }}>
          {sections.map((s) => (
            <div key={s.titre}>
              <h2 className="text-lg font-extrabold mb-3" style={{ color: '#1B6B3A' }}>{s.titre}</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.contenu}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
