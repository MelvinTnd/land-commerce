'use client'

export default function AdminHeader() {
  return (
    <header className="adm-header">
      {/* Search */}
      <div className="adm-search">
        <span className="material-symbols-outlined adm-search-icon">search</span>
        <input
          type="text"
          placeholder="Rechercher des transactions, vendeurs ou articles..."
        />
      </div>

      {/* Right */}
      <div className="adm-header-right">
        <button className="adm-notif-btn" title="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="adm-notif-dot" />
        </button>
        <span className="adm-header-user">Heritage Admin</span>
      </div>
    </header>
  )
}
