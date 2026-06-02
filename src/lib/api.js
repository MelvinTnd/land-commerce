const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api'

/** Timeout avant fallback sur données locales (Render peut dormir 50s au 1er démarrage) */
const API_TIMEOUT_MS = 8000

/**
 * Fonction utilitaire pour les appels API avec timeout de 5 secondes.
 * Si Render est endormi (cold start ~50s), l'appel est annulé proprement
 * et les composants basculent immédiatement sur defaultData sans blocage.
 */
export async function apiFetch(endpoint, options = {}, authToken = null) {
  const token = authToken
    || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)

  const headers = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Ne pas mettre de Content-Type si c'est du FormData (le navigateur s'en charge avec le boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const data = await response.json()

    if (!response.ok) {
      if (data.errors) {
        const firstError = Object.values(data.errors)[0][0]
        throw new Error(firstError)
      }
      throw new Error(data.message || 'Une erreur est survenue')
    }

    return data
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('API_TIMEOUT')
    }
    throw err
  }
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
export async function createShop(name, location, description, token = null) {
  return apiFetch('/shops', {
    method: 'POST',
    body: JSON.stringify({ name, location, description }),
  }, token)
}

export async function updateShop(shopId, data, token = null) {
  if (data instanceof FormData) {
    if (!data.has('_method')) data.append('_method', 'PUT')
    return apiFetch(`/shops/${shopId}`, { method: 'POST', body: data }, token)
  }
  return apiFetch(`/shops/${shopId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token)
}

export async function getVendorDashboard(authToken = null) {
  return apiFetch('/vendor/dashboard', {}, authToken)
}

export async function getVendorProducts(authToken = null) {
  return apiFetch('/vendor/products', {}, authToken)
}

// Suppression du doublon déprécié (voir gestion via FormData plus bas)

// Suppression du doublon déprécié

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
  if (params.limit)    searchParams.set('limit', params.limit)

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
export async function getShops(params = {}) {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.limit)  searchParams.set('limit', params.limit)
  const query = searchParams.toString()
  return apiFetch(`/shops${query ? '?' + query : ''}`)
}

export async function getShop(slug) {
  return apiFetch(`/shops/${slug}`)
}

// Alias explicite utilisé dans la page boutique individuelle
export const getShopBySlug = getShop


// ========================
// COMMANDES / PAYEMENT
// ========================
export async function checkout(orderData, authToken = null) {
  return apiFetch('/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }, authToken)
}

export async function getOrders(authToken = null) {
  return apiFetch('/orders', {}, authToken)
}

// ========================
// MESSAGERIE
// ========================
export async function getConversations(authToken = null) {
  return apiFetch('/conversations', {}, authToken)
}

export async function getConversation(conversationId, authToken = null) {
  return apiFetch(`/conversations/${conversationId}`, {}, authToken)
}

export async function sendMessage(shopId, content, authToken = null) {
  return apiFetch(`/shops/${shopId}/message`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }, authToken)
}

export async function replyToConversation(conversationId, content, authToken = null) {
  return apiFetch(`/conversations/${conversationId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }, authToken)
}

export async function getUnreadCount(authToken = null) {
  return apiFetch('/conversations/unread', {}, authToken)
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

// ========================
// COMMANDES VENDEUR
// ========================
export async function getVendorOrders(authToken = null) {
  return apiFetch('/vendor/orders', {}, authToken)
}

export async function updateOrderStatus(orderId, status, authToken = null) {
  return apiFetch(`/vendor/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, authToken)
}

// ========================
// PROFIL UTILISATEUR
// ========================
export async function updateProfile(profileData, authToken = null) {
  return apiFetch('/user', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }, authToken)
}

export async function changePassword(passwordData, authToken = null) {
  return apiFetch('/user/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }, authToken)
}

export async function deleteAccount(authToken = null) {
  return apiFetch('/user', {
    method: 'DELETE',
  }, authToken)
}

// ========================
// ADRESSES UTILISATEUR
// ========================
export async function getAddresses(authToken = null) {
  return apiFetch('/addresses', {}, authToken)
}

export async function createAddress(addressData, authToken = null) {
  return apiFetch('/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData),
  }, authToken)
}

export async function updateAddress(addressId, addressData, authToken = null) {
  return apiFetch(`/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(addressData),
  }, authToken)
}

export async function deleteAddress(addressId, authToken = null) {
  return apiFetch(`/addresses/${addressId}`, {
    method: 'DELETE',
  }, authToken)
}

// ========================
// AVIS & NOTATIONS
// ========================
export async function getShopReviews(slug) {
  return apiFetch(`/shops/${slug}/reviews`)
}

export async function submitReview(reviewData, authToken = null) {
  return apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }, authToken)
}

export async function getEligibleShops(authToken = null) {
  return apiFetch('/reviews/eligible-shops', {}, authToken)
}

export async function canReviewShop(shopId, authToken = null) {
  return apiFetch(`/shops/${shopId}/can-review`, {}, authToken)
}

// ========================
// GESTION PRODUITS VENDEUR
// ========================
export async function createProduct(formData, authToken = null) {
  return apiFetch('/vendor/products', {
    method: 'POST',
    body: formData, // FormData pour l'image
  }, authToken)
}

export async function updateProduct(productId, formData, authToken = null) {
  // Laravel nécessite _method=PUT dans un FormData pour le spoofing de méthode
  if (formData instanceof FormData && !formData.has('_method')) {
    formData.append('_method', 'PUT')
  }
  return apiFetch(`/vendor/products/${productId}`, {
    method: 'POST', // POST + spoofing
    body: formData,
  }, authToken)
}

export async function deleteProduct(productId, authToken = null) {
  return apiFetch(`/vendor/products/${productId}`, {
    method: 'DELETE',
  }, authToken)
}
