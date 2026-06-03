# BeninMarket Frontend

Application Next.js de la marketplace BeninMarket.

## Stack

- Next.js 16
- React 19
- NextAuth 5 beta
- Tailwind CSS 4

## Demarrage

```bash
npm install
npm run dev
```

L'application demarre par defaut sur `http://localhost:3000`.

## Variables utiles

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
AUTH_SECRET=change-me
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`AUTH_SECRET` est obligatoire en production.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- Les appels API passent par `src/lib/api.js`.
- Le panier est persiste dans `localStorage`.
- Les routes vendeur/compte/messages sont protegees par `src/middleware.js`.
