'use client'
import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [articles, setArticles] = useState([])

  const ajouterAuPanier = useCallback((produit) => {
    setArticles((prev) => {
      const existe = prev.find((a) => a.id === produit.id)
      if (existe) {
        return prev.map((a) =>
          a.id === produit.id ? { ...a, quantite: a.quantite + 1 } : a
        )
      }
      return [...prev, { ...produit, quantite: 1 }]
    })
  }, [])

  const retirerDuPanier = useCallback((id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const updateQuantite = useCallback((id, quantite) => {
    if (quantite <= 0) {
      setArticles((prev) => prev.filter((a) => a.id !== id))
      return
    }
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, quantite } : a))
    )
  }, [])

  const viderPanier = useCallback(() => {
    setArticles([])
  }, [])

  const totalArticles = articles.reduce((sum, a) => sum + a.quantite, 0)
  const sousTotal = articles.reduce((sum, a) => sum + a.prix * a.quantite, 0)
  const livraison = sousTotal > 50000 ? 0 : sousTotal === 0 ? 0 : 2500
  const total = sousTotal + livraison

  const estDansPanier = useCallback(
    (id) => articles.some((a) => a.id === id),
    [articles]
  )

  return (
    <CartContext.Provider
      value={{
        articles,
        ajouterAuPanier,
        retirerDuPanier,
        updateQuantite,
        viderPanier,
        totalArticles,
        sousTotal,
        livraison,
        total,
        estDansPanier,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart doit être utilisé dans un CartProvider')
  return context
}
