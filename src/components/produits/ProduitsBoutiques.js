import Link from 'next/link'

const boutiques = [
  {
    id: 1,
    nom: 'Maison du Wax',
    lieu: 'Cotonou',
    ventes: 342,
    note: 5.0,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE',
  },
  {
    id: 2,
    nom: 'Atelier Atacora',
    lieu: 'Natitingou',
    ventes: 156,
    note: 4.2,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn86rtc6C63qQaDekp0jAyOU9muzPWYngtXZ9UWkihzwo7nXc_cYCa0n-gPOBF_ffJAZ1Wm5Xx1Bxeutkl7iD9y520ZJVQFepzYlBJMaXPDfY6T-CZdBBhhg1omxXCKtsr5Ue1oYxtJX_Ag8NCw_PxqzKBM-mVQcJpXfYg7kJqUQnZ3Ug8jI109CXSbRTkc-ZrxZAtAuucBkjtnEPWauGROLJNUR0jIH3SLUpTZzJalePs9vAgE_2kllxOFqxHDiYG_8-vcXjRxMY',
  },
  {
    id: 3,
    nom: "Bronze d'Abomey",
    lieu: 'Abomey',
    ventes: 89,
    note: 4.8,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2afMDoCl0cmLAnabdQvzASiobQIDKTOHjMNApDH87KmPjBzS_aicU6F06AckemvVfID8xB7JCB2oZmGUmEK0J1IzR4koyPOa9oMfT3ShMuNEUo3_YpuKqhrcLiAYayg_v5WvYUpnBCKIwCLyzE_wjTeQ-E8J9REMsow_PJ2Vt-fqHPkZV8pKrLK1FNNbrKwCHqmA3sxA5asR_V6XEbJFP-w8_l8183VSoaxqbmf0fBRORTIRkXaWjkgGAWbu73U6fUO4lDFOfNvw',
  },
  {
    id: 4,
    nom: 'Kiffa Design',
    lieu: 'Porto-Novo',
    ventes: 512,
    note: 4.0,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpCuM1raMH_d0yZ4seMOYQeSAXkpCLTGp8PSjBJEqnwjEtefivizDw7wYqIvFGMkRu6XapStFUssIpLwIuedznmegaIr4w4KEIqtoNOrQLpn4bGQLIxwOamAloySaxm2v_62WszW4vc0yj0Pl6AWHxoYIoNM-VgUZzsHhHQ5ASSqF05kBhhq1jZ-Y65gzhmZOuDkPpzO93rYFQAWghChe6Y_UTJrfKlJcZWYf9fwC59HtPheOUIUoZSWVvjKAPot5Fm4RfR71iOZE',
  },
]

function Etoiles({ note }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="12" height="12"
          fill={i <= Math.round(note) ? '#F5B731' : 'none'}
          stroke="#F5B731"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="text-xs font-bold ml-1" style={{ color: '#374151' }}>{note.toFixed(1)}</span>
    </div>
  )
}

export default function ProduitsBoutiques() {
  return (
    <section className="px-10 py-16" style={{ background: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>
              Boutiques d'Exception
            </h2>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
              La confiance est au cœur de notre marketplace
            </p>
          </div>
          <Link
            href="/artisans"
            className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
            style={{ color: '#1B6B3A' }}
          >
            Voir tous les vendeurs
            <span>→</span>
          </Link>
        </div>

        {/* Grille boutiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {boutiques.map((boutique) => (
            <Link
              key={boutique.id}
              href={`/artisans/${boutique.id}`}
              className="bg-white rounded-2xl p-6 flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              {/* Avatar */}
              <img
                src={boutique.avatar}
                alt={boutique.nom}
                className="w-16 h-16 rounded-full object-cover"
                style={{ border: '3px solid #F0EDE8' }}
              />

              {/* Infos */}
              <div>
                <h4 className="font-bold text-sm" style={{ color: '#1A1A1A' }}>
                  {boutique.nom}
                </h4>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  {boutique.lieu} • {boutique.ventes} ventes
                </p>
              </div>

              {/* Étoiles */}
              <Etoiles note={boutique.note} />
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}