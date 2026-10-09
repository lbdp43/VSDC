# Velay Semène Business Club — PWA

Application PWA pour le Velay Semène Business Club (VSBC), club d'affaires du FCDS — « Le réseau qui joue en équipe ».

Même application que celle du Club Jean Jaurès, aux couleurs du VSBC (orange / charbon, logo et visuel de l'annuaire 2026).

## Stack technique

- **Frontend** : React 18 + Vite + Tailwind CSS + PWA (vite-plugin-pwa)
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL + Prisma ORM
- **Auth** : Magic Link (email) + sessions
- **Hébergement** : Railway

## Installation

```bash
npm install
cd client && npm install
```

## Configuration

Copier `.env.example` vers `.env` et renseigner les variables :

```
DATABASE_URL=postgresql://...
SESSION_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_API_KEY=...
APP_URL=http://localhost:5173
```

## Développement

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schema en base
npm run db:push

# Seeder la base (paramètres du club, admins, les 33 entreprises de l'annuaire 2026)
npm run db:seed

# Lancer en développement
npm run dev
```

## Production (Railway)

Le déploiement est automatique via `railway.toml`. La commande de démarrage exécute les migrations, le seed, puis le serveur.

## Données initiales

Le seed crée les 33 entreprises de l'annuaire VSBC 2026 (raison sociale, activité, contact).
L'annuaire papier ne diffuse ni téléphone ni email : chaque membre reçoit une adresse provisoire
`prenom.nom@membres.vsbc.local`, à remplacer par la vraie adresse depuis l'administration
(Membres → adresses mail) pour que le membre puisse se connecter.

Les adresses `contact@vsbc-fcds.fr` / `admin@vsbc-fcds.fr` sont des valeurs par défaut : à ajuster via
`EMAIL_FROM` / `EMAIL_FROM_NAME` et dans les paramètres du club.

## Modules

- **Annuaire** : profils membres, recherche, carte Leaflet, favoris
- **Agenda** : événements, filtres, export iCal, abonnement webcal
- **Fil d'actualité** : publications, commentaires, likes, demandes
- **Administration** : dashboard, gestion membres, événements, paramètres
- **Page vitrine** : présentation publique du club
