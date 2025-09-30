# 📊 Dashboard Web - Spécifications Fonctionnelles

## 🎯 Objectif

Créer un tableau de bord web pour l'application mobile HACCP "Tracky" permettant aux gestionnaires de restaurant de visualiser, analyser et exporter les données collectées via l'application mobile.

## 🏗️ Architecture Technique

### Stack Technologique
- **Backend** : Supabase (PostgreSQL)
- **Base de données** : Déjà configurée et en production
- **Authentification** : Supabase Auth (déjà implémentée)
- **API** : Supabase REST API + Real-time subscriptions

### Connexion Supabase

```javascript
// Configuration Supabase
const SUPABASE_URL = "https://uzplklxbldjwktgmmfgz.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cGxrbHhibGRqd2t0Z21tZmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzUwMTMsImV4cCI6MjA3NDMxMTAxM30.iPFK-Q-qWzUCfDoSHjUKlkas-Ae0LyxqCpcI8A7wE3E"

// Créer le client Supabase
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

### Authentification

Les utilisateurs du dashboard utilisent les mêmes identifiants que l'app mobile :
- Email + Mot de passe
- Utiliser `supabase.auth.signInWithPassword()`
- Session persistante automatique

## 📋 Modules du Dashboard

### 1. 🌡️ **Module Température**

#### Affichage
- **Graphique en temps réel** : Courbe de température par équipement
- **Liste des relevés** : Tableau avec filtres (date, équipement, hors norme)
- **Alertes** : Notifications visuelles pour températures hors plage
- **Statistiques** :
  - Nombre de relevés aujourd'hui
  - Pourcentage de conformité
  - Équipements avec alertes

#### Tables concernées
```sql
-- Équipements (frigos/congélateurs)
equipment {
  id: uuid
  name: string
  type: 'frigo' | 'congelateur'
  min_temp: number
  max_temp: number
  location: string
  user_id: uuid
  created_at: timestamp
  updated_at: timestamp
}

-- Relevés de température
temperature_readings {
  id: uuid
  equipment_id: uuid (FK → equipment)
  temperature: number
  timestamp: timestamp
  user_id: uuid
  is_within_range: boolean
  notes: string
  created_at: timestamp
}
```

#### Requêtes utiles
```javascript
// Récupérer tous les équipements d'un utilisateur
const { data: equipment } = await supabase
  .from('equipment')
  .select('*')
  .eq('user_id', userId)

// Récupérer les relevés avec infos équipement
const { data: readings } = await supabase
  .from('temperature_readings')
  .select(`
    *,
    equipment (
      name,
      type,
      min_temp,
      max_temp
    )
  `)
  .eq('user_id', userId)
  .order('timestamp', { ascending: false })
  .limit(100)

// Relevés hors norme uniquement
const { data: alerts } = await supabase
  .from('temperature_readings')
  .select('*, equipment(name)')
  .eq('user_id', userId)
  .eq('is_within_range', false)
  .order('timestamp', { ascending: false })
```

---

### 2. 📦 **Module Traçabilité des Produits**

#### Affichage
- **Liste des produits** : Tableau avec statut (actif, expiré, consommé)
- **Alertes de péremption** : Produits proches de la date d'expiration (< 7 jours)
- **Statistiques** :
  - Nombre de produits actifs
  - Produits expirés ce mois
  - Produits par fournisseur

#### Table concernée
```sql
products {
  id: uuid
  name: string
  lot_number: string
  expiry_date: date
  supplier: string
  received_date: date
  user_id: uuid
  status: 'active' | 'expired' | 'consumed'
  barcode: string
  created_at: timestamp
  updated_at: timestamp
}
```

#### Requêtes utiles
```javascript
// Produits actifs
const { data: activeProducts } = await supabase
  .from('products')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active')
  .order('expiry_date', { ascending: true })

// Produits expirant dans les 7 jours
const sevenDaysFromNow = new Date()
sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

const { data: expiringProducts } = await supabase
  .from('products')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active')
  .lte('expiry_date', sevenDaysFromNow.toISOString())
  .order('expiry_date', { ascending: true })
```

---

### 3. 📥 **Module Contrôle à Réception**

#### Affichage
- **Liste des réceptions** : Tableau avec conformité (✅/❌)
- **Détails par réception** : Items reçus, photos, signatures
- **Statistiques** :
  - Taux de conformité
  - Réceptions par fournisseur
  - Non-conformités ce mois

#### Tables concernées
```sql
receptions {
  id: uuid
  supplier: string
  delivery_date: date
  is_conform: boolean
  notes: string
  delivery_photo_uris: jsonb
  signature: string (base64 image)
  user_id: uuid
  created_at: timestamp
  updated_at: timestamp
}

reception_items {
  id: uuid
  reception_id: uuid (FK → receptions)
  product_name: string
  quantity: number
  temperature: number
  expiry_date: date
  lot_number: string
  is_conform: boolean
  created_at: timestamp
}
```

#### Requêtes utiles
```javascript
// Réceptions avec items
const { data: receptions } = await supabase
  .from('receptions')
  .select(`
    *,
    reception_items (*)
  `)
  .eq('user_id', userId)
  .order('delivery_date', { ascending: false })

// Taux de conformité
const { data: conformStats } = await supabase
  .from('receptions')
  .select('is_conform')
  .eq('user_id', userId)
```

---

### 4. ❄️ **Module Congélation**

#### Affichage
- **Produits congelés** : Liste avec durée restante
- **Produits décongelés** : Compte à rebours 48h
- **Alertes** : Produits dépassant la durée maximale
- **Statistiques** :
  - Produits actuellement congelés
  - Produits décongelés en attente
  - Produits expirés

#### Table concernée
```sql
freezing_records {
  id: uuid
  product_id: uuid (FK → products)
  freezing_start_date: timestamp
  thawed_at: timestamp
  max_freezing_duration: number (jours)
  max_thawed_duration: number (heures, défaut 48h)
  current_status: 'frozen' | 'thawed' | 'expired'
  user_id: uuid
  notes: string
  created_at: timestamp
  updated_at: timestamp
}
```

#### Requêtes utiles
```javascript
// Produits congelés avec infos produit
const { data: frozenProducts } = await supabase
  .from('freezing_records')
  .select(`
    *,
    products (
      name,
      lot_number
    )
  `)
  .eq('user_id', userId)
  .eq('current_status', 'frozen')
  .order('freezing_start_date', { ascending: false })

// Produits décongelés (urgents)
const { data: thawedProducts } = await supabase
  .from('freezing_records')
  .select(`
    *,
    products (name)
  `)
  .eq('user_id', userId)
  .eq('current_status', 'thawed')
  .order('thawed_at', { ascending: true })
```

---

### 5. 🧹 **Module Nettoyage**

#### Affichage
- **Planning de nettoyage** : Calendrier des tâches
- **Tâches du jour** : Liste des zones à nettoyer
- **Historique** : Enregistrements avec signatures
- **Statistiques** :
  - Taux de complétion
  - Tâches en retard
  - Zones par fréquence

#### Tables concernées
```sql
rooms {
  id: uuid
  name: string
  user_id: uuid
  created_at: timestamp
  updated_at: timestamp
}

surfaces {
  id: uuid
  room_id: uuid (FK → rooms)
  name: string
  cleaning_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
  last_cleaned_date: date
  description: string
  created_at: timestamp
  updated_at: timestamp
}

cleaning_tasks {
  id: uuid
  room_id: uuid
  room_name: string
  surface_id: uuid
  surface_name: string
  description: string
  is_completed: boolean
  completed_at: timestamp
  user_id: uuid
  due_date: date
  is_overdue: boolean
  signature: string (base64)
  photo_uris: jsonb
  created_at: timestamp
  updated_at: timestamp
}

cleaning_plans {
  id: uuid
  date: date
  is_completed: boolean
  completed_at: timestamp
  user_id: uuid
  created_at: timestamp
  updated_at: timestamp
}

cleaning_records {
  id: uuid
  room_id: uuid
  room_name: string
  user_id: uuid
  restaurant_name: string
  signature: string (base64)
  created_at: timestamp
}

cleaning_surface_records {
  id: uuid
  cleaning_record_id: uuid (FK → cleaning_records)
  surface_id: uuid
  surface_name: string
  is_cleaned: boolean
  photo_uris: jsonb
  cleaned_at: timestamp
  created_at: timestamp
}
```

#### Requêtes utiles
```javascript
// Tâches du jour
const today = new Date().toISOString().split('T')[0]
const { data: todayTasks } = await supabase
  .from('cleaning_tasks')
  .select('*')
  .eq('user_id', userId)
  .eq('due_date', today)
  .order('is_completed', { ascending: true })

// Tâches en retard
const { data: overdueTasks } = await supabase
  .from('cleaning_tasks')
  .select('*')
  .eq('user_id', userId)
  .eq('is_overdue', true)
  .eq('is_completed', false)

// Historique avec détails
const { data: cleaningHistory } = await supabase
  .from('cleaning_records')
  .select(`
    *,
    cleaning_surface_records (*)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(50)
```

---

## 📊 Dashboard Principal (Vue d'ensemble)

### KPIs Globaux
```javascript
// À afficher en haut du dashboard
const dashboardStats = {
  // Températures
  temperatureReadingsToday: number,
  temperatureAlertsToday: number,
  temperatureComplianceRate: percentage,

  // Produits
  activeProducts: number,
  expiringProductsWeek: number,
  expiredProducts: number,

  // Réceptions
  receptionsThisMonth: number,
  receptionComplianceRate: percentage,
  nonConformitiesThisMonth: number,

  // Congélation
  currentlyFrozen: number,
  currentlyThawed: number,

  // Nettoyage
  cleaningCompletionRate: percentage,
  overdueTasks: number,
  tasksCompletedToday: number
}
```

### Graphiques Recommandés

1. **Courbe de température** (7 derniers jours)
   - Une ligne par équipement
   - Zones rouges pour hors norme

2. **Répartition des statuts produits** (Pie chart)
   - Actifs / Expirés / Consommés

3. **Conformité des réceptions** (Bar chart mensuel)
   - Conforme vs Non-conforme

4. **Complétion nettoyage** (Line chart)
   - Taux de complétion sur 30 jours

---

## 📤 Exports et Rapports

### Export PDF Mensuel

Générer un rapport PDF contenant :
- Résumé des KPIs du mois
- Tous les relevés de température
- Liste des réceptions
- Registre de nettoyage
- Signatures et photos

**Format suggéré** : Conforme aux exigences HACCP

```javascript
// Récupérer toutes les données d'un mois
const startOfMonth = new Date(year, month, 1).toISOString()
const endOfMonth = new Date(year, month + 1, 0).toISOString()

// Températures
const { data: monthTemperatures } = await supabase
  .from('temperature_readings')
  .select('*, equipment(name, type)')
  .eq('user_id', userId)
  .gte('timestamp', startOfMonth)
  .lte('timestamp', endOfMonth)
  .order('timestamp', { ascending: true })

// Réceptions
const { data: monthReceptions } = await supabase
  .from('receptions')
  .select('*, reception_items(*)')
  .eq('user_id', userId)
  .gte('delivery_date', startOfMonth)
  .lte('delivery_date', endOfMonth)

// Nettoyages
const { data: monthCleaning } = await supabase
  .from('cleaning_records')
  .select('*, cleaning_surface_records(*)')
  .eq('user_id', userId)
  .gte('created_at', startOfMonth)
  .lte('created_at', endOfMonth)
```

### Export CSV

Pour chaque module, permettre l'export CSV avec colonnes pertinentes.

---

## 🔐 Sécurité et Permissions

### Row Level Security (RLS)

Toutes les tables ont déjà des politiques RLS configurées :
- Les utilisateurs ne voient QUE leurs propres données
- Filtrage automatique par `user_id`

```sql
-- Exemple de politique (déjà en place)
CREATE POLICY "Users can only access their own data"
ON temperature_readings
FOR SELECT
USING (auth.uid() = user_id);
```

### Gestion des utilisateurs

```javascript
// Récupérer l'utilisateur connecté
const { data: { user } } = await supabase.auth.getUser()

// Récupérer le profil complet
const { data: profile } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single()

// profile contient:
// - email
// - restaurant_name
// - restaurant_address
// - initials
```

---

## 🎨 Recommandations UI/UX

### Framework suggéré
- **React** + **Next.js** (SSR pour SEO)
- **Tailwind CSS** ou **Material-UI**
- **Chart.js** ou **Recharts** pour graphiques
- **React Table** pour tableaux de données

### Palette de couleurs (cohérence avec mobile)
- **Primary Orange** : `#FF8C42` (boutons, highlights)
- **Background** : `#F8F9FA`
- **Surface** : `#FFFFFF`
- **Text** : `#1A1A1A`
- **Success** : `#10B981`
- **Error** : `#EF4444`
- **Warning** : `#F59E0B`

### Responsive
- Desktop-first (dashboard = usage pro sur ordinateur)
- Mobile-responsive pour consultation rapide

---

## 🔔 Notifications & Real-time

### Utiliser Supabase Realtime

```javascript
// Écouter les nouveaux relevés de température
const subscription = supabase
  .channel('temperature-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'temperature_readings',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Nouveau relevé:', payload.new)
      // Mettre à jour l'UI en temps réel
    }
  )
  .subscribe()
```

### Notifications pour
- Nouveau relevé hors norme
- Produit proche de l'expiration
- Tâche de nettoyage en retard
- Nouvelle réception non-conforme

---

## 📝 User Stories Prioritaires

### Must Have (Version 1.0)
1. ✅ Authentification (email/password)
2. ✅ Dashboard principal avec KPIs
3. ✅ Module Température (liste + graphique)
4. ✅ Module Traçabilité (liste produits + alertes)
5. ✅ Module Réceptions (liste + détails)
6. ✅ Export PDF mensuel

### Should Have (Version 1.1)
1. Module Congélation complet
2. Module Nettoyage complet
3. Notifications real-time
4. Exports CSV par module
5. Filtres avancés

### Nice to Have (Version 2.0)
1. Multi-restaurant (un compte = plusieurs établissements)
2. Rapports personnalisables
3. Dashboard analytics avancé
4. API publique pour intégrations

---

## 🚀 Démarrage Rapide

### 1. Installer Supabase Client

```bash
npm install @supabase/supabase-js
# ou
yarn add @supabase/supabase-js
```

### 2. Tester la connexion

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://uzplklxbldjwktgmmfgz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cGxrbHhibGRqd2t0Z21tZmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzUwMTMsImV4cCI6MjA3NDMxMTAxM30.iPFK-Q-qWzUCfDoSHjUKlkas-Ae0LyxqCpcI8A7wE3E'
)

// Test
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1)

console.log('Connection OK:', data)
```

### 3. Compte de test

```
Email: a@a.com
Mot de passe: [Demander au propriétaire du projet]
```

---

## 📞 Support & Questions

Pour toute question technique :
- **Schéma de base de données** : Voir ci-dessus
- **RLS Policies** : Déjà configurées, aucune action nécessaire
- **Migrations** : Base de données en production, stable

---

## 🔗 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

**Version** : 1.0
**Dernière mise à jour** : 30 septembre 2025
**Statut** : ✅ Prêt pour développement