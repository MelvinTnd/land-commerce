import './globals.css'
import { CartProvider } from '@/lib/CartContext'

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols with display=block to prevent FOUT */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.fonts.ready.then(() => {
                document.documentElement.classList.add('mso-loaded');
              });
              setTimeout(() => document.documentElement.classList.add('mso-loaded'), 1500);
            `,
          }}
        />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}