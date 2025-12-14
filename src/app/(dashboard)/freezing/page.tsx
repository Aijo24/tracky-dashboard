"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { FreezingRecordWithProduct } from "@/lib/supabase/types";
import {
  Snowflake,
  ThermometerSnowflake,
  Clock,
  AlertTriangle,
  Search,
  Download,
  Plus,
  Loader2,
  Calendar,
  Package,
  Timer,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function FreezingPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<FreezingRecordWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "frozen" | "thawed" | "expired">("all");

  // Stats
  const [stats, setStats] = useState({
    frozenCount: 0,
    thawedCount: 0,
    expiredCount: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchRecords = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("freezing_records")
        .select(`
          *,
          products (
            id,
            name,
            lot_number,
            expiry_date,
            supplier,
            received_date,
            user_id,
            status,
            barcode,
            created_at,
            updated_at,
            supplier_id
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching freezing records:", error);
        setLoading(false);
        return;
      }

      const recordsData = (data || []) as FreezingRecordWithProduct[];
      setRecords(recordsData);

      // Calculate stats
      const frozenCount = recordsData.filter((r) => r.current_status === "frozen").length;
      const thawedCount = recordsData.filter((r) => r.current_status === "thawed").length;
      const expiredCount = recordsData.filter((r) => r.current_status === "expired").length;

      setStats({
        frozenCount,
        thawedCount,
        expiredCount,
      });

      setLoading(false);
    };

    fetchRecords();
  }, [user]);

  const getDaysFrozen = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getThawedHoursRemaining = (thawedAt: string | null, maxHours: number | null) => {
    if (!thawedAt) return null;
    const thawed = new Date(thawedAt);
    const maxDuration = maxHours || 48;
    const deadline = new Date(thawed.getTime() + maxDuration * 60 * 60 * 1000);
    const now = new Date();
    const remaining = deadline.getTime() - now.getTime();
    return Math.max(0, Math.floor(remaining / (1000 * 60 * 60)));
  };

  const getStatusBadge = (record: FreezingRecordWithProduct) => {
    switch (record.current_status) {
      case "frozen":
        const daysFrozen = getDaysFrozen(record.freezing_start_date);
        const percentUsed = (daysFrozen / record.max_freezing_duration) * 100;
        if (percentUsed >= 90) {
          return <span className="badge-warning">Bientôt limite</span>;
        }
        return <span className="badge-success">Congelé</span>;
      case "thawed":
        const hoursRemaining = getThawedHoursRemaining(record.thawed_at, record.max_thawed_duration);
        if (hoursRemaining !== null && hoursRemaining <= 12) {
          return <span className="badge-error">{hoursRemaining}h restantes</span>;
        }
        return <span className="badge-warning">Décongelé</span>;
      case "expired":
        return <span className="badge-error">Expiré</span>;
      default:
        return <span className="badge-neutral">Inconnu</span>;
    }
  };

  const filteredRecords = records.filter((record) => {
    if (filter === "all") return true;
    return record.current_status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-slate-400 text-sm">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Congélation
          </h1>
          <p className="text-slate-400 mt-1">
            Suivi des produits congelés et décongelés
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            Ajouter congélation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Produits congelés"
          value={stats.frozenCount}
          icon={Snowflake}
          variant="default"
        />
        <StatCard
          title="Produits décongelés"
          value={stats.thawedCount}
          subtitle="À consommer dans 48h"
          icon={Clock}
          variant={stats.thawedCount > 0 ? "warning" : "success"}
        />
        <StatCard
          title="Expirés"
          value={stats.expiredCount}
          icon={AlertTriangle}
          variant={stats.expiredCount > 0 ? "error" : "success"}
        />
      </div>

      {/* Thawed Products Alert */}
      {stats.thawedCount > 0 && (
        <div className="glass-card border-amber-500/30 p-4 flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 flex-shrink-0">
            <Timer className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Produits décongelés en attente</h3>
            <p className="text-slate-400 text-sm">
              {stats.thawedCount} produit{stats.thawedCount > 1 ? "s" : ""} décongelé{stats.thawedCount > 1 ? "s" : ""} doi{stats.thawedCount > 1 ? "vent" : "t"} être consommé{stats.thawedCount > 1 ? "s" : ""} dans les 48h.
              Vérifiez les délais et utilisez-les rapidement.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 w-fit">
        {[
          { key: "all", label: "Tous" },
          { key: "frozen", label: "Congelés" },
          { key: "thawed", label: "Décongelés" },
          { key: "expired", label: "Expirés" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as typeof filter)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filter === item.key
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center">
            <Snowflake className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Aucun enregistrement trouvé</p>
            <p className="text-slate-500 text-sm">
              Commencez à suivre vos produits congelés
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const daysFrozen = getDaysFrozen(record.freezing_start_date);
            const progressPercent = Math.min(100, (daysFrozen / record.max_freezing_duration) * 100);
            const hoursRemaining = record.current_status === "thawed"
              ? getThawedHoursRemaining(record.thawed_at, record.max_thawed_duration)
              : null;

            return (
              <div key={record.id} className={`glass-card p-5 ${
                record.current_status === "thawed" ? "border-amber-500/30" :
                record.current_status === "expired" ? "border-red-500/30" : ""
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    record.current_status === "frozen" ? "bg-sky-500/10" :
                    record.current_status === "thawed" ? "bg-amber-500/10" :
                    "bg-red-500/10"
                  }`}>
                    {record.current_status === "frozen" ? (
                      <Snowflake className="h-5 w-5 text-sky-400" />
                    ) : record.current_status === "thawed" ? (
                      <ThermometerSnowflake className="h-5 w-5 text-amber-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  {getStatusBadge(record)}
                </div>

                <h3 className="text-white font-medium mb-1">
                  {record.products?.name || "Produit inconnu"}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Lot: {record.products?.lot_number || "-"}
                </p>

                {record.current_status === "frozen" && (
                  <>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-400">Durée de congélation</span>
                      <span className="text-white">
                        {daysFrozen}j / {record.max_freezing_duration}j
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          progressPercent >= 90 ? "bg-red-500" :
                          progressPercent >= 70 ? "bg-amber-500" :
                          "bg-sky-500"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Congelé le {formatDate(record.freezing_start_date)}
                    </p>
                  </>
                )}

                {record.current_status === "thawed" && hoursRemaining !== null && (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className={`h-4 w-4 ${hoursRemaining <= 12 ? "text-red-400" : "text-amber-400"}`} />
                      <span className={`text-lg font-semibold ${hoursRemaining <= 12 ? "text-red-400" : "text-amber-400"}`}>
                        {hoursRemaining}h restantes
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${hoursRemaining <= 12 ? "bg-red-500" : "bg-amber-500"}`}
                        style={{ width: `${Math.max(0, (hoursRemaining / (record.max_thawed_duration || 48)) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Décongelé le {formatDateTime(record.thawed_at)}
                    </p>
                  </>
                )}

                {record.current_status === "expired" && (
                  <p className="text-xs text-red-400">
                    Durée maximale dépassée
                  </p>
                )}

                {record.notes && (
                  <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-white/10">
                    {record.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
