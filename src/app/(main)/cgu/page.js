export default function CguPage() {
  const sections = [
    { titre: '1. Objet', contenu: 'Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits effectuées sur le site beninmarket.bj. En passant commande, l\'acheteur accepte sans réserve les présentes CGV.' },
    { titre: '2. Produits', contenu: 'Les produits proposés sont des créations artisanales et des produits locaux du Bénin. Les photos sont les plus fidèles possible, mais de légères variations peuvent exister du fait du caractère artisanal des produits.' },
    { titre: '3. Prix', contenu: 'Les prix sont indiqués en Francs CFA (FCFA), toutes taxes comprises. BéninMarket se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés au prix en vigueur lors de la validation de la commande.' },
    { titre: '4. Commandes', contenu: 'La validation de la commande implique l\'acceptation des prix et des conditions de vente. BéninMarket confirmera la commande par email. La commande ne sera définitive qu\'après confirmation du paiement.' },
    { titre: '5. Paiement', contenu: 'Le paiement s\'effectue via MTN Mobile Money, Moov Money ou carte bancaire. Le paiement est sécurisé et traité par nos partenaires certifiés. En cas d\'échec, la commande est automatiquement annulée.' },
    { titre: '6. Livraison', contenu: 'Les délais de livraison sont indicatifs. BéninMarket ne saurait être tenue responsable des retards dus au transporteur ou à un cas de force majeure. Les frais de livraison sont indiqués avant la validation.' },
    { titre: '7. Droit de Rétractation', contenu: 'L\'acheteur dispose d\'un délai de 14 jours à compter de la réception pour exercer son droit de rétractation, sans avoir à justifier de motifs, pour les produits éligibles. Les frais de retour sont à la charge de l\'acheteur.' },
    { titre: '8. Responsabilité', contenu: 'BéninMarket agit en tant qu\'intermédiaire entre vendeurs et acheteurs. La responsabilité de BéninMarket est limitée au montant de la commande. BéninMarket n\'est pas responsable des dommages indirects.' },
    { titre: '9. Propriété Intellectuelle', contenu: 'L\'ensemble du contenu du site (textes, images, logos) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation préalable est interdite.' },
    { titre: '10. Droit Applicable', contenu: 'Les présentes CGV sont soumises au droit béninois. En cas de litige, les parties s\'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut, les tribunaux de Cotonou seront compétents.' },
  ]

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <section className="py-20 px-6 text-center" style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #004d28 100%)' }}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Conditions Générales de Vente</h1>
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
