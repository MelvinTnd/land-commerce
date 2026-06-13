'use client'
import Link from 'next/link'

export default function CguPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#008060] hover:underline mb-8">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : Juin 2026</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Objet</h2>
            <p>Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation de la plateforme CauriMarket, marketplace en ligne dédiée à la promotion et à la vente de produits artisanaux et culturels du Bénin.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Définitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Plateforme :</strong> désigne le site web CauriMarket accessible depuis le domaine caurimarket.com.</li>
              <li><strong>Vendeur / Artisan :</strong> tout utilisateur inscrit en tant que vendeur et disposant d&apos;une boutique.</li>
              <li><strong>Acheteur :</strong> tout utilisateur inscrit effectuant des achats sur la Plateforme.</li>
              <li><strong>Produit :</strong> bien proposé à la vente par un Vendeur sur la Plateforme.</li>
              <li><strong>Commande :</strong> engagement d&apos;achat d&apos;un Produit par un Acheteur.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Accès et inscription</h2>
            <p>L&apos;accès à la Plateforme est libre et gratuit pour tout visiteur. La création d&apos;un compte est nécessaire pour effectuer des achats ou vendre des produits. L&apos;utilisateur s&apos;engage à fournir des informations exactes et à les maintenir à jour.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Rôle de la plateforme</h2>
            <p>CauriMarket agit comme intermédiaire technique entre les Vendeurs et les Acheteurs. La Plateforme n&apos;est ni propriétaire des Produits, ni responsable de leur qualité, conformité ou livraison. Les contrats de vente sont conclus directement entre le Vendeur et l&apos;Acheteur.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Obligations des vendeurs</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proposer des produits authentiques, conformes à leur description et respectueux des lois béninoises.</li>
              <li>Maintenir un stock à jour et traiter les commandes dans les délais annoncés.</li>
              <li>Respecter les règles de la Plateforme concernant le contenu des fiches produits.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Obligations des acheteurs</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir des informations de livraison exactes.</li>
              <li>Payer le montant total de la Commande selon les modalités proposées.</li>
              <li>Respecter les délais de réclamation et de retour.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">7. Paiement et commissions</h2>
            <p>Les paiements sont traités via les moyens de paiement proposés sur la Plateforme. CauriMarket prélève une commission sur chaque vente réalisée, dont le taux est communiqué au Vendeur lors de son inscription.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">8. Propriété intellectuelle</h2>
            <p>Les contenus publiés sur la Plateforme (textes, images, logos) sont protégés par le droit d&apos;auteur. Toute reproduction sans autorisation est interdite.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">9. Responsabilité</h2>
            <p>CauriMarket met tout en œuvre pour assurer le bon fonctionnement de la Plateforme mais ne saurait être tenu responsable des dommages indirects résultant de son utilisation. En cas de litige entre un Vendeur et un Acheteur, la Plateforme s&apos;engage à faciliter la résolution à l&apos;amiable.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">10. Données personnelles</h2>
            <p>Les données personnelles collectées sont traitées conformément à notre <Link href="/confidentialite" className="text-[#008060] font-bold hover:underline">Politique de Confidentialité</Link>. L&apos;utilisateur dispose d&apos;un droit d&apos;accès, de rectification et de suppression de ses données.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">11. Modification des CGU</h2>
            <p>CauriMarket se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications substantielles par email ou via la Plateforme.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">12. Droit applicable</h2>
            <p>Les présentes CGU sont soumises au droit béninois. Tout litige relève de la compétence des tribunaux de Cotonou (Bénin).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">13. Contact</h2>
            <p>Pour toute question relative aux CGU, contactez-nous à : <a href="mailto:contact@caurimarket.com" className="text-[#008060] font-bold hover:underline">contact@caurimarket.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
