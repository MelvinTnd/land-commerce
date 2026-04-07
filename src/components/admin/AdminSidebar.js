'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin',            label: 'Dashboard',  icon: 'dashboard' },
  { href: '/admin/sellers',    label: 'Sellers',    icon: 'storefront' },
  { href: '/admin/products',   label: 'Products',   icon: 'inventory_2' },
  { href: '/admin/commissions',label: 'Commissions',icon: 'payments' },
  { href: '/admin/users',      label: 'Users',      icon: 'group' },
  { href: '/admin/blog',       label: 'Blog/News',  icon: 'article' },
  { href: '/admin/community',  label: 'Community',  icon: 'forum' },
  { href: '/admin/settings',   label: 'Settings',   icon: 'settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="adm-sidebar">
      {/* Logo */}
      <div className="adm-sidebar-logo">
        <div className="adm-logo-icon">
          <span className="material-symbols-outlined">storefront</span>
        </div>
        <div className="adm-logo-text">
          <strong>Heritage Modernist</strong>
          <small>Marketplace Admin</small>
        </div>
      </div>

      {/* Navigation */}
      <nav className="adm-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`adm-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="adm-sidebar-footer">
        <div className="adm-sidebar-avatar">
          <span>JK</span>
        </div>
        <div className="adm-sidebar-user">
          <strong>Jean-Marc Koffi</strong>
          <small>Super Admin</small>
        </div>
      </div>
    </aside>
  )
}
