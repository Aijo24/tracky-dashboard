# Configuration du Système d'Abonnement

## ✅ Ce qui a été implémenté

### 1. Base de données
- ✅ Table `subscriptions` existe déjà dans Supabase
- ✅ Colonnes : user_id, plan_type, status, trial_ends_at, stripe_customer_id, etc.

### 2. Code implémenté
- ✅ Hook `useSubscription` - `/src/hooks/useSubscription.ts`
- ✅ Composant `SubscriptionGuard` - Protection du dashboard
- ✅ Composant `TrialBanner` - Bannière d'essai
- ✅ Page de paywall - `/src/app/(full-width-pages)/subscribe/page.tsx`
- ✅ Page de succès - `/src/app/(full-width-pages)/subscribe/success/page.tsx`
- ✅ Page de gestion - `/src/app/(admin)/subscription/page.tsx`
- ✅ API Routes Stripe :
  - `/src/app/api/stripe/create-checkout-session/route.ts`
  - `/src/app/api/stripe/create-portal-session/route.ts`
  - `/src/app/api/stripe/webhook/route.ts`

## 🔧 Configuration requise

### 1. Installer les dépendances

```bash
npm install stripe
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Prix IDs
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://uzplklxbldjwktgmmfgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configuration Stripe

#### A. Créer un compte Stripe
1. Aller sur https://dashboard.stripe.com/register
2. Créer un compte
3. Activer le mode test

#### B. Créer le produit "Tracky Premium"
1. Dans le Dashboard Stripe, aller dans **Products**
2. Cliquer sur **Add Product**
3. Nom : `Tracky Premium`
4. Description : `Accès complet au dashboard HACCP`

#### C. Créer les prix
1. Dans le produit créé, cliquer sur **Add another price**
2. **Prix mensuel** :
   - Modèle de tarification : Récurrent
   - Prix : 39 EUR
   - Fréquence de facturation : Mensuel
   - Copier l'ID du prix (commence par `price_...`)
   - Le mettre dans `NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID`

3. **Prix annuel** :
   - Modèle de tarification : Récurrent
   - Prix : 390 EUR
   - Fréquence de facturation : Annuel
   - Copier l'ID du prix
   - Le mettre dans `NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID`

#### D. Récupérer les clés API
1. Aller dans **Developers > API Keys**
2. Copier la **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Révéler et copier la **Secret key** → `STRIPE_SECRET_KEY`

#### E. Configurer les webhooks
1. Aller dans **Developers > Webhooks**
2. Cliquer sur **Add endpoint**
3. URL : `http://localhost:3000/api/stripe/webhook` (pour dev)
4. Pour production : `https://votre-domaine.com/api/stripe/webhook`
5. **Événements à écouter** :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Cliquer sur **Add endpoint**
7. Copier le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

#### F. Configurer le Customer Portal
1. Aller dans **Settings > Billing > Customer Portal**
2. Activer **Customer Portal**
3. Cocher **Allow customers to update payment methods**
4. Cocher **Allow customers to cancel subscriptions**
5. Sauvegarder

### 4. Tester les webhooks en local

Installer Stripe CLI :
```bash
brew install stripe/stripe-cli/stripe
```

Se connecter :
```bash
stripe login
```

Écouter les webhooks :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Dans un autre terminal, lancer votre app :
```bash
npm run dev
```

Tester un événement :
```bash
stripe trigger checkout.session.completed
```

## 🧪 Tests à effectuer

### 1. Test du Guard
1. Se connecter avec un compte gratuit
2. Essayer d'accéder au dashboard → Doit rediriger vers `/subscribe`

### 2. Test du Trial
1. Sur la page `/subscribe`, cliquer sur "Démarrer 14 jours gratuits"
2. Doit accéder au dashboard
3. Vérifier que la bannière de trial s'affiche en haut

### 3. Test de l'abonnement
1. Sur la page `/subscribe`, cliquer sur "S'abonner"
2. Utiliser une carte de test : `4242 4242 4242 4242`
3. Date : n'importe quelle date future
4. CVC : n'importe quel 3 chiffres
5. Compléter le paiement
6. Doit rediriger vers `/subscribe/success`
7. Puis automatiquement vers le dashboard

### 4. Test du Customer Portal
1. Aller sur `/subscription`
2. Cliquer sur "Gérer mon abonnement"
3. Doit ouvrir le portail Stripe
4. Tester l'annulation, la modification de carte, etc.

## 📝 Cartes de test Stripe

- Succès : `4242 4242 4242 4242`
- Échec : `4000 0000 0000 0002`
- 3D Secure : `4000 0027 6000 3184`

## 🚀 Déploiement en production

### 1. Passer en mode Live sur Stripe
1. Dans le Dashboard Stripe, toggle vers **Live mode**
2. Créer les mêmes produits et prix en mode Live
3. Récupérer les nouvelles clés API Live
4. Configurer les webhooks pour l'URL de production

### 2. Variables d'environnement de production
Mettre à jour les variables avec les clés Live :
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

### 3. Vérifier les webhooks
1. Dans Stripe Dashboard > Webhooks
2. Vérifier que l'endpoint de production reçoit bien les événements
3. Consulter les logs pour déboguer si nécessaire

## 🔍 Dépannage

### Le dashboard ne se charge pas
- Vérifier que la table `subscriptions` existe dans Supabase
- Vérifier les logs du navigateur pour les erreurs
- Vérifier que `useSubscription` retourne bien des données

### Les webhooks ne fonctionnent pas
- Vérifier le `STRIPE_WEBHOOK_SECRET`
- Vérifier que l'URL du webhook est correcte
- Utiliser Stripe CLI en local pour tester
- Consulter les logs dans Stripe Dashboard > Webhooks

### L'abonnement ne s'active pas
- Vérifier que le webhook `checkout.session.completed` est bien configuré
- Vérifier les logs Supabase pour voir si la mise à jour a eu lieu
- Vérifier que `supabase_user_id` est bien dans les metadata

## 📚 Documentation

- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎯 Fonctionnement du système

### Flux utilisateur gratuit
1. Utilisateur se connecte
2. Subscription créée automatiquement avec `status='free'`
3. Essaie d'accéder au dashboard → Redirigé vers `/subscribe`
4. Peut démarrer l'essai gratuit de 14 jours

### Flux trial
1. Utilisateur clique "Démarrer 14 jours gratuits"
2. `status` passe à `'trialing'`
3. `trial_ends_at` est défini à NOW + 14 jours
4. Accès complet au dashboard
5. Bannière affichée avec compte à rebours

### Flux abonnement payant
1. Utilisateur clique "S'abonner"
2. Redirection vers Stripe Checkout
3. Après paiement réussi :
   - Webhook `checkout.session.completed` reçu
   - Subscription mise à jour : `plan_type='premium'`, `status='active'`
4. Utilisateur redirigé vers `/subscribe/success`
5. Accès permanent au dashboard

### Expiration du trial
1. Après 14 jours, `trial_ends_at` < NOW
2. `hasAccess()` retourne `false`
3. Utilisateur redirigé vers `/subscribe`
4. Peut s'abonner pour continuer

## ⚠️ Important

- **Ne jamais committer** les clés API dans le code
- **Toujours utiliser** le mode test en développement
- **Vérifier** que les webhooks fonctionnent avant de mettre en production
- **Tester** tous les scénarios (succès, échec, annulation)
