const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Fonction utilitaire pour les appels API
 */
async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.errors) {
      const firstError = Object.values(data.errors)[0][0]
      throw new Error(firstError)
    }
    throw new Error(data.message || 'Une erreur est survenue')
  }

  return data
}

// ========================
// AUTH
// ========================
export async function register(name, email, phone, password, role) {
  const data = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password, role }),
  })
  localStorage.setItem('auth_token', data.access_token)
  localStorage.setItem('user', JSON.stringify(data.user))
  return data
}

export async function login(email, password) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem('auth_token', data.access_token)
  localStorage.setItem('user', JSON.stringify(data.user))
  return data
}

export async function logout() {
  await apiFetch('/logout', { method: 'POST' })
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
}

export function getUser() {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function isAuthenticated() {
  return !!getToken()
}

// ========================
// SHOP (Vendeur)
// ========================
export async function createShop(name, location, description) {
  return apiFetch('/shops', {
    method: 'POST',
    body: JSON.stringify({ name, location, description }),
  })
}

export async function updateShop(shopId, data) {
  return apiFetch(`/shops/${shopId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function getVendorDashboard() {
  return apiFetch('/vendor/dashboard')
}

export async function getVendorProducts() {
  return apiFetch('/vendor/products')
}

export async function createProduct(productData) {
  return apiFetch('/vendor/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  })
}

// ========================
// PUBLIC - Produits
// ========================
export async function getProducts(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.category) searchParams.set('category', params.category)
  if (params.shop)     searchParams.set('shop', params.shop)
  if (params.search)   searchParams.set('search', params.search)
  if (params.featured) searchParams.set('featured', '1')
  if (params.page)     searchParams.set('page', params.page)
  if (params.prix_max) searchParams.set('prix_max', params.prix_max)
  if (params.tri)      searchParams.set('tri', params.tri)
  
  const query = searchParams.toString()
  return apiFetch(`/products${query ? '?' + query : ''}`)
}

export async function getProduct(slug) {
  return apiFetch(`/products/${slug}`)
}

// ========================
// PUBLIC - Catégories
// ========================
export async function getCategories() {
  return apiFetch('/categories')
}

// ========================
// PUBLIC - Boutiques
// ========================
export async function getShops() {
  return apiFetch('/shops')
}

export async function getShop(slug) {
  return apiFetch(`/shops/${slug}`)
}

// ========================
// COMMANDES / PAYEMENT
// ========================
export async function checkout(orderData) {
  return apiFetch('/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })
}

export async function getOrders() {
  return apiFetch('/orders')
}

// ========================
// PUBLIC - Blog & Forum
// ========================
export async function getArticles(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.categorie) searchParams.set('categorie', params.categorie)
  if (params.search)    searchParams.set('search', params.search)
  if (params.page)      searchParams.set('page', params.page)
  const query = searchParams.toString()
  return apiFetch(`/articles${query ? '?' + query : ''}`)
}

export async function getArticle(slugOrId) {
  return apiFetch(`/articles/${slugOrId}`)
}

export async function createArticle(data) {
  return apiFetch('/articles', { method: 'POST', body: JSON.stringify(data) })
}

export async function getForumTopics(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.tag)  searchParams.set('tag', params.tag)
  if (params.page) searchParams.set('page', params.page)
  const query = searchParams.toString()
  return apiFetch(`/forum-topics${query ? '?' + query : ''}`)
}

export async function createForumTopic(data) {
  return apiFetch('/forum-topics', { method: 'POST', body: JSON.stringify(data) })
}

export async function voteForumTopic(topicId, direction) {
  return apiFetch(`/forum-topics/${topicId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ direction }),
  })
}

// ========================
// COMMANDES
// ========================
export async function cancelOrder(orderId) {
  return apiFetch(`/orders/${orderId}/cancel`, { method: 'POST' })
}

export async function getOrder(orderId) {
  return apiFetch(`/orders/${orderId}`)
}
