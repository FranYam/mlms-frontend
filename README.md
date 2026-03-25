# MLMS Frontend — React

Interface web pour le Microfinance Loan Management System.

## 🚀 Démarrage

```bash
npm install
npm start
# → http://localhost:3001
```

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| **Admin** | admin@mlms.com | secret123 |
| **Loan Officer** | officer@mlms.com | secret123 |
| **Client** | ali.client@mlms.com | secret123 |

## ⚙️ Configuration

Le fichier `.env` pointe vers le backend :
```
REACT_APP_API_URL=http://localhost:3000/api
```

## 🗂️ Pages par rôle

### Admin & Loan Officer
| Page | Route | Description |
|---|---|---|
| Tableau de bord | `/dashboard` | Stats + prêts en retard + prêts récents |
| Clients | `/clients` | Liste, recherche, ajout, modification, détail |
| Prêts | `/loans` | Liste, création, détail + calendrier + paiements |
| Remboursements | `/repayments` | Suivi des paiements par prêt |
| Utilisateurs | `/users` | Gestion des comptes (Admin uniquement) |

### Client
| Page | Route | Description |
|---|---|---|
| Mon prêt | `/my-loan` | Détails + progression du remboursement |
| Calendrier | `/my-schedule` | Tableau des échéances mensuelles |

## 📦 Stack
- React 18
- React Router v6
- Axios (appels API)
- Recharts (graphiques)
- Lucide React (icônes)
- Google Fonts : DM Sans + Syne
