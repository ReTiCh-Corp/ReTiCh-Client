# ReTiCh Client

Application frontend React pour la plateforme de messagerie ReTiCh.

## Fonctionnalités

- Interface de chat temps réel
- Authentification (login/register)
- Liste de conversations
- Messages directs et groupes
- Indicateurs de frappe
- Notifications
- Thème clair/sombre
- Responsive design

## Technologies

- React 18
- TypeScript
- Vite
- (À ajouter: state management, routing, UI library)

## Prérequis

- Node.js 20+
- npm ou yarn
- Docker (optionnel)

## Démarrage rapide

### Avec Docker (recommandé)

```bash
# Depuis le repo ReTiCh-Infrastucture
make up
```

L'application sera disponible sur http://localhost:5173

### Sans Docker

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview
```

## Configuration

Variables d'environnement (fichier `.env`):

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_URL` | URL de l'API Gateway | `http://localhost:8080` |
| `VITE_WS_URL` | URL WebSocket | `ws://localhost:8082/ws` |

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run preview` | Preview du build |
| `npm run lint` | Linter ESLint |

## Structure du projet

```
ReTiCh-Client/
├── public/                 # Assets statiques
├── src/
│   ├── components/        # Composants React
│   ├── pages/             # Pages/routes
│   ├── hooks/             # Custom hooks
│   ├── services/          # API calls
│   ├── store/             # State management
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilitaires
│   ├── App.tsx            # Composant racine
│   └── main.tsx           # Point d'entrée
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile             # Image production (Nginx)
├── Dockerfile.dev         # Image développement
└── nginx.conf             # Config Nginx production
```

## Docker

### Build manuel

```bash
# Production (avec Nginx)
docker build -t retich-client .

# Développement
docker build -f Dockerfile.dev -t retich-client:dev .
```

### Exécution

```bash
# Production
docker run -p 80:80 retich-client

# Développement
docker run -p 5173:5173 -v $(pwd):/app retich-client:dev
```

## Tests

```bash
# Lancer les tests
npm test

# Avec couverture
npm run test:coverage
```

## Build production

Le build production utilise Nginx pour servir les fichiers statiques avec:
- Gzip compression
- Cache headers optimisés
- SPA routing (fallback sur index.html)
- Security headers

## Licence

MIT
