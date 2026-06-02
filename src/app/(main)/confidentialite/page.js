'use client'
import Link from 'next/link'

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1B6B3A] hover:underline mb-8">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : Juin 2026</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Introduction</h2>
            <p>Blackmaket s&apos;engage à protéger la vie privée de ses utilisateurs. La présente Politique de Confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles conformément à la loi béninoise et au Règlement Général sur la Protection des Données (RGPD).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Données d&apos;identification :</strong> nom, prénom, adresse email, numéro de téléphone.</li>
              <li><strong>Données de profil :</strong> photo de profil, adresse de livraison, préférences.</li>
              <li><strong>Données de transaction :</strong> historique des commandes, paiements, interactions avec les vendeurs.</li>
              <li><strong>Données de navigation :</strong> pages visitées, durée de session, type d&apos;appareil, adresse IP.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gérer votre compte et vous fournir nos services.</li>
              <li>Traiter et assurer le suivi de vos commandes.</li>
              <li>Vous contacter concernant votre compte ou vos commandes.</li>
              <li>Améliorer et personnaliser votre expérience sur la Plateforme.</li>
              <li>Assurer la sécurité de la Plateforme et prévenir la fraude.</li>
              <li>Respecter nos obligations légales et réglementaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Base légale du traitement</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>L&apos;exécution du contrat (création et gestion du compte, traitement des commandes).</li>
              <li>Votre consentement (marketing, cookies optionnels).</li>
              <li>Notre intérêt légitime (amélioration des services, sécurité).</li>
              <li>Une obligation légale (facturation, conservation des données).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Partage des données</h2>
            <p>Nous ne vendons pas vos données personnelles à des tiers. Vos données peuvent être partagées avec :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Les vendeurs :</strong> les informations nécessaires à la livraison des commandes (nom, adresse, téléphone).</li>
              <li><strong>Les prestataires de paiement :</strong> pour le traitement des transactions.</li>
              <li><strong>Les autorités compétentes :</strong> si la loi nous y oblige.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Durée de conservation</h2>
            <p>Vos données sont conservées aussi longtemps que votre compte est actif. Après la suppression de votre compte, nous conservons certaines données à des fins légales (facturation, litiges) pendant la durée prescrite par la loi béninoise.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">7. Vos droits</h2>
            <p>Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données.</li>
              <li><strong>Droit de rectification :</strong> modifier vos données inexactes.</li>
              <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données.</li>
              <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données.</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré.</li>
            </ul>
            <p className="mt-3">Pour exercer vos droits, contactez-nous à : <a href="mailto:contact@blackmaket.bj" className="text-[#1B6B3A] font-bold hover:underline">contact@blackmaket.bj</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">8. Cookies</h2>
            <p>Nous utilisons des cookies essentiels au fonctionnement de la Plateforme et des cookies analytiques pour améliorer votre expérience. Vous pouvez configurer vos préférences de cookies à tout moment.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">9. Sécurité</h2>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l&apos;accès non autorisé, la perte ou la divulgation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">10. Contact</h2>
            <p>Pour toute question relative à cette Politique de Confidentialité :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email : <a href="mailto:contact@blackmaket.bj" className="text-[#1B6B3A] font-bold hover:underline">contact@blackmaket.bj</a></li>
              <li>Adresse : Cotonou, Bénin</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
