"use client";

import Link from "next/link";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import {
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Package,
  Clock,
  Truck,
  Snowflake,
  SprayCan,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-slate-400 text-sm">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-white mb-2">Erreur de chargement</h2>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Bonjour, {profile?.restaurant_name || "Restaurant"} !
        </h1>
        <p className="text-slate-400 mt-1">
          Voici un aperçu de vos données HACCP pour aujourd&apos;hui.
        </p>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Relevés aujourd'hui"
          value={stats?.temperatureReadingsToday || 0}
          subtitle={`${stats?.equipmentCount || 0} équipements`}
          icon={Thermometer}
        />
        <StatCard
          title="Alertes température"
          value={stats?.temperatureAlertsToday || 0}
          subtitle={`${stats?.temperatureComplianceRate || 100}% conformité`}
          icon={AlertTriangle}
          variant={stats?.temperatureAlertsToday ? "error" : "success"}
        />
        <StatCard
          title="Produits actifs"
          value={stats?.activeProducts || 0}
          subtitle={`${stats?.expiringProductsWeek || 0} expirent cette semaine`}
          icon={Package}
          variant={stats?.expiringProductsWeek ? "warning" : "default"}
        />
        <StatCard
          title="Tâches nettoyage"
          value={`${stats?.cleaningCompletionRate || 0}%`}
          subtitle={`${stats?.overdueTasks || 0} en retard`}
          icon={CheckCircle}
          variant={stats?.overdueTasks ? "warning" : "success"}
        />
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Temperature Module */}
        <Link href="/temperature" className="group">
          <div className="glass-card-hover p-6 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                <Thermometer className="h-6 w-6 text-orange-400" />
              </div>
              <span className={`badge-${stats?.temperatureAlertsToday ? "error" : "success"}`}>
                {stats?.temperatureAlertsToday ? `${stats.temperatureAlertsToday} alertes` : "Conforme"}
              </span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Températures</h3>
            <p className="text-sm text-slate-400 mb-4">
              Suivi en temps réel de vos équipements de réfrigération et congélation.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.temperatureReadingsToday || 0}</span> relevés
                </span>
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.temperatureComplianceRate || 100}%</span> conformité
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        {/* Products Module */}
        <Link href="/products" className="group">
          <div className="glass-card-hover p-6 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              {stats?.expiringProductsWeek ? (
                <span className="badge-warning">
                  {stats.expiringProductsWeek} expirent bientôt
                </span>
              ) : (
                <span className="badge-success">À jour</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Traçabilité Produits</h3>
            <p className="text-sm text-slate-400 mb-4">
              Gestion des lots, dates de péremption et historique des produits.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.activeProducts || 0}</span> actifs
                </span>
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.expiredProducts || 0}</span> expirés
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        {/* Receptions Module */}
        <Link href="/receptions" className="group">
          <div className="glass-card-hover p-6 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Truck className="h-6 w-6 text-emerald-400" />
              </div>
              <span className={`badge-${stats?.nonConformitiesThisMonth ? "warning" : "success"}`}>
                {stats?.receptionComplianceRate || 100}% conformes
              </span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Réceptions</h3>
            <p className="text-sm text-slate-400 mb-4">
              Contrôle des livraisons, vérification des températures et conformité.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.receptionsThisMonth || 0}</span> ce mois
                </span>
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.nonConformitiesThisMonth || 0}</span> non-conformes
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        {/* Freezing Module */}
        <Link href="/freezing" className="group">
          <div className="glass-card-hover p-6 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
                <Snowflake className="h-6 w-6 text-sky-400" />
              </div>
              {stats?.currentlyThawed ? (
                <span className="badge-warning flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {stats.currentlyThawed} décongelés
                </span>
              ) : (
                <span className="badge-success">OK</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Congélation</h3>
            <p className="text-sm text-slate-400 mb-4">
              Suivi des produits congelés et compte à rebours de décongélation (48h).
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.currentlyFrozen || 0}</span> congelés
                </span>
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.currentlyThawed || 0}</span> décongelés
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        {/* Cleaning Module */}
        <Link href="/cleaning" className="group">
          <div className="glass-card-hover p-6 h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <SprayCan className="h-6 w-6 text-purple-400" />
              </div>
              {stats?.overdueTasks ? (
                <span className="badge-error">
                  {stats.overdueTasks} en retard
                </span>
              ) : (
                <span className="badge-success">À jour</span>
              )}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nettoyage</h3>
            <p className="text-sm text-slate-400 mb-4">
              Planning de nettoyage, suivi des tâches et historique avec signatures.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.cleaningCompletionRate || 0}%</span> complété
                </span>
                <span className="text-slate-300">
                  <span className="font-semibold text-white">{stats?.tasksCompletedToday || 0}</span> aujourd&apos;hui
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        {/* Reports Card */}
        <Link href="/reports" className="group">
          <div className="glass-card-hover p-6 h-full border-dashed border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Rapports & Exports</h3>
            <p className="text-sm text-slate-400 mb-4">
              Générez vos rapports HACCP mensuels conformes aux audits.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-400">Générer un rapport</span>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
