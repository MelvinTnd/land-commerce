import './globals.css'
import { CartProvider } from '@/lib/CartContext'
import { AuthProvider } from '@/lib/AuthProvider'
import Script from 'next/script'

export const metadata = {
  title: 'BéninMarket – La marketplace locale du Bénin',
  description: 'Achetez et vendez des produits locaux béninois en ligne',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        <Script
          id="mso-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){function u(){document.documentElement.classList.add('mso-loaded');}if(document.fonts&&document.fonts.check('1em "Material Symbols Outlined"')){u();}else if(document.fonts){document.fonts.load('1em "Material Symbols Outlined"').then(u).catch(u);setTimeout(u,2500);}else{setTimeout(u,600);}})();`,
          }}
        />
      </body>
    </html>
  )
}