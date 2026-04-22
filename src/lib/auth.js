import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://land-commerce-api.onrender.com/api'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    // ─── 1. Connexion par Email/Mot de passe via API Laravel ───────────────
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Mot de passe',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()

          if (!res.ok || !data.access_token) {
            throw new Error(data.message || 'Identifiants invalides')
          }

          // Retourne l'objet utilisateur qui sera stocké dans le token JWT
          return {
            id: String(data.user?.id),
            name: data.user?.name,
            email: data.user?.email,
            role: data.user?.role || 'acheteur',
            apiToken: data.access_token,
          }
        } catch (err) {
          throw new Error(err.message || 'Erreur de connexion')
        }
      },
    }),

    // ─── 2. Google OAuth ────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  // ─── Session via JWT (sans base de données) ────────────────────────────
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  // ─── Callbacks ─────────────────────────────────────────────────────────
  callbacks: {
    /**
     * jwt() : enrichit le token avec les données utilisateur
     * Appelé à la création du token et à chaque accès
     */
    async jwt({ token, user, account }) {
      // Connexion initiale via Credentials
      if (user && account?.provider === 'credentials') {
        token.id = user.id
        token.role = user.role
        token.apiToken = user.apiToken
        token.provider = 'credentials'
      }

      // Connexion via Google OAuth
      if (account?.provider === 'google') {
        token.provider = 'google'
        // Optionnel : envoyer le token Google à Laravel pour créer/lier le compte
        try {
          const res = await fetch(`${API_BASE}/auth/google/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              google_id: token.sub,
              email: token.email,
              name: token.name,
              avatar: token.picture,
              access_token: account.access_token,
            }),
          })

          if (res.ok) {
            const data = await res.json()
            token.apiToken = data.access_token
            token.role = data.user?.role || 'acheteur'
            token.id = String(data.user?.id)
          } else {
            // Si le backend ne supporte pas encore Google, on utilise un rôle par défaut
            token.role = 'acheteur'
          }
        } catch {
          token.role = 'acheteur'
        }
      }

      return token
    },

    /**
     * session() : expose les données au client via useSession()
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.apiToken = token.apiToken
        session.user.provider = token.provider
      }
      return session
    },
  },

  // ─── Pages personnalisées ──────────────────────────────────────────────
  pages: {
    signIn: '/connexion',
    error: '/connexion',
  },
})
