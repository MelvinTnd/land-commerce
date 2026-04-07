'use client'
import Link from 'next/link'

/* ── Static demo data ── */
const stats = [
  {
    id: 'commissions',
    label: 'Volume des Commissions',
    value: '4.820.000',
    unit: 'FCFA',
    badge: '+12.5%',
    badgeType: 'up',
    icon: 'payments',
    iconColor: 'green',
    sub: null,
    featured: true,
    chart: [35, 50, 40, 60, 55, 75, 90],
  },
  {
    id: 'users',
    label: 'Utilisateurs Actifs',
    value: '12,408',
    unit: null,
    badge: null,
    icon: 'group',
    iconColor: 'gold',
    sub: '<strong>2.4k</strong> nouveaux ce mois',
    featured: false,
  },
  {
    id: 'products',
    label: 'Produits Listés',
    value: '3,150',
    unit: null,
    badge: null,
    icon: 'inventory_2',
    iconColor: 'orange',
    sub: '<strong>84</strong> en attente de revue',
    featured: false,
  },
]

const discussions = [
  {
    id: 1,
    pinned: true,
    avatar: 'CM',
    title: "Comment améliorer la visibilité des artisans d'Abomey ?",
    excerpt: "Bonjour l'équipe, j'ai remarqué que plusieurs vendeurs d'Abomey ont du mal...",
    replies: 24,
    likes: 158,
    time: 'IL Y A 2H',
    participants: ['A', 'B', '+8'],
  },
  {
    id: 2,
    pinned: false,
    avatar: 'DL',
    title: 'Feedback sur le nouveau système de livraison',
    excerpt: 'La mise à jour de ce matin semble avoir résolu les problèmes de tracking à...',
    replies: 12,
    likes: null,
    time: 'IL Y A 5H',
    resolved: true,
  },
]

const blogArticles = [
  {
    id: 1,
    tag: 'Artisanat',
    title: "5 Secrets pour réussir sa boutique en ligne au Bénin",
    author: "l'équipe éditoriale • 15 min de lecture",
    img: null,
  },
  {
    id: 2,
    tag: 'Business',
    title: "Optimiser ses paiements Mobile Money : Le Guide Complet",
    author: "Jean Koffi • 8 min de lecture",
    img: null,
  },
]

const vendorRequests = [
  {
    id: 1,
    shop: 'Maison de la Soie',
    owner: 'Koudogbo A.',
    location: 'Cotonou, Fidjrossè',
    category: 'MODE',
    date: '12 Mai 2024',
    status: 'pending',
    statusLabel: 'En attente',
  },
  {
    id: 2,
    shop: 'Poterie Royale',
    owner: 'Gnonionfoun J.',
    location: 'Porto-Novo',
    category: 'MAISON',
    date: '10 Mai 2024',
    status: 'approved',
    statusLabel: 'Approuvé',
  },
]

/* ── Component ── */
export default function AdminDashboardPage() {
  return (
    <>
      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <h1>Tableau de bord Global</h1>
          <p>Bienvenue, voici l'état de votre écosystème aujourd'hui.</p>
        </div>
        <div className="adm-header-actions">
          <button className="adm-btn adm-btn-outline">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>picture_as_pdf</span>
            Exporter PDF
          </button>
          <button className="adm-btn adm-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>campaign</span>
            Nouvelle Campagne
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="adm-stats-grid">
        {stats.map((s) => (
          <div key={s.id} className={`adm-stat-card ${s.featured ? 'featured' : ''}`}>
            <div className="adm-stat-card-top">
              <div className={`adm-stat-icon ${s.iconColor}`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              {s.badge && (
                <span className={`adm-stat-badge ${s.badgeType}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                    {s.badgeType === 'up' ? 'trending_up' : 'trending_down'}
                  </span>
                  {s.badge}
                </span>
              )}
            </div>
            <div className="adm-stat-label">{s.label}</div>
            <div className={`adm-stat-value ${s.featured ? 'large' : ''}`}>
              {s.value}
              {s.unit && <span style={{ fontSize: '0.45em', fontWeight: 500, marginLeft: 6, color: 'var(--adm-text3)' }}>{s.unit}</span>}
            </div>
            {s.sub && (
              <div
                className="adm-stat-sub"
                dangerouslySetInnerHTML={{ __html: s.sub }}
              />
            )}
            {s.chart && (
              <div className="adm-mini-chart">
                {s.chart.map((h, i) => (
                  <div
                    key={i}
                    className={`adm-mini-bar ${i === s.chart.length - 1 ? 'active' : ''}`}
                    style={{ height: `${(h / 100) * 100}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── MAIN GRID: Discussions + Blog ── */}
      <div className="adm-grid-3-1">
        {/* Discussions */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2>Discussions Communautaires Actives</h2>
            </div>
            <Link href="/admin/community" className="adm-card-link">
              Voir tout
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </Link>
          </div>
          <div className="adm-discussion-list">
            {discussions.map((d) => (
              <div key={d.id} className={`adm-discussion-item ${d.pinned ? 'pinned' : ''}`}>
                <div className="adm-disc-avatar">{d.avatar}</div>
                <div className="adm-disc-content">
                  <div className="adm-disc-title">{d.title}</div>
                  <div className="adm-disc-excerpt">{d.excerpt}</div>
                  <div className="adm-disc-meta">
                    <span className="adm-disc-stat">
                      <span className="material-symbols-outlined">chat_bubble</span>
                      {d.replies} réponses
                    </span>
                    {d.likes && (
                      <span className="adm-disc-stat">
                        <span className="material-symbols-outlined">favorite</span>
                        {d.likes} likes
                      </span>
                    )}
                    {d.resolved && (
                      <span className="adm-disc-status-badge">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span>
                        Résolu
                      </span>
                    )}
                    {d.participants && (
                      <div className="adm-disc-avatars">
                        {d.participants.map((p, i) => (
                          <div className="mini-av" key={i}>{p}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="adm-disc-time">{d.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Articles */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2>Nouveaux Articles de Blog</h2>
            </div>
          </div>
          <div className="adm-blog-list">
            {blogArticles.map((a) => (
              <div key={a.id} className="adm-blog-item">
                <div
                  className="adm-blog-thumbnail"
                  style={{
                    background: a.tag === 'Artisanat'
                      ? 'linear-gradient(135deg, #1B6B3A 0%, #2E8B57 100%)'
                      : 'linear-gradient(135deg, #0f1b2d 0%, #1a3050 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(255,255,255,0.3)', fontVariationSettings: "'FILL' 1" }}>
                    {a.tag === 'Artisanat' ? 'gallery_thumbnail' : 'phone_android'}
                  </span>
                </div>
                <div className="adm-blog-info">
                  <span className="adm-blog-tag">{a.tag}</span>
                  <div className="adm-blog-title">{a.title}</div>
                  <div className="adm-blog-author">Publié par {a.author}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="adm-blog-add">
            <span className="material-symbols-outlined">add_circle</span>
            Rédiger un nouvel article
          </button>
        </div>
      </div>

      {/* ── VENDORS TABLE ── */}
      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h2>Demandes de Vendeurs Récents</h2>
            <p>Vérifiez les documents pour approbation finale.</p>
          </div>
          <Link href="/admin/sellers" className="adm-card-link">
            Gérer les approbations
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
          </Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Vendeur</th>
                <th>Localisation</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vendorRequests.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="adm-vendor-cell">
                      <div
                        className="adm-vendor-avatar"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                          color: 'var(--adm-green)',
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: 'var(--adm-green-soft)',
                        }}
                      >
                        {v.shop.charAt(0)}
                      </div>
                      <div>
                        <div className="adm-vendor-name">{v.shop}</div>
                        <div className="adm-vendor-owner">{v.owner}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--adm-text2)', fontSize: 13 }}>{v.location}</td>
                  <td>
                    <span className="adm-badge adm-badge-category">{v.category}</span>
                  </td>
                  <td style={{ color: 'var(--adm-text2)', fontSize: 13 }}>{v.date}</td>
                  <td>
                    <span className={`adm-badge adm-badge-${v.status}`}>
                      <span className={`adm-status-dot ${v.status}`} />
                      {v.statusLabel}
                    </span>
                  </td>
                  <td>
                    <div className="adm-actions-cell">
                      <button className="adm-icon-btn" title="Voir détails">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button className="adm-icon-btn" title="Plus d'options">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="adm-footer" style={{ marginTop: 28 }}>
        <span>© 2024 Heritage Modernist Marketplace. Tous droits réservés.</span>
        <div className="adm-footer-links">
          <a href="#">Support Technique</a>
          <a href="#">Politique de Confidentialité</a>
          <span style={{ color: 'var(--adm-green)', fontWeight: 600 }}>v2.4.0-stable</span>
        </div>
      </footer>
    </>
  )
}
