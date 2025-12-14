"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Equipment, TemperatureReadingWithEquipment } from "@/lib/supabase/types";
import {
  Thermometer,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Filter,
  Download,
  Plus,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function TemperaturePage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [readings, setReadings] = useState<TemperatureReadingWithEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "alerts">("all");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all");

  // Stats
  const [stats, setStats] = useState({
    totalReadings: 0,
    alertsCount: 0,
    complianceRate: 100,
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch equipment
      const { data: equipmentData } = await supabase
        .from("equipment")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      setEquipment(equipmentData || []);

      // Fetch readings with equipment info
      const { data: readingsData } = await supabase
        .from("temperature_readings")
        .select(`
          *,
          equipment (
            id,
            name,
            type,
            min_temp,
            max_temp,
            location,
            user_id,
            created_at,
            updated_at
          )
        `)
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(100);

      const typedReadings = (readingsData || []) as TemperatureReadingWithEquipment[];
      setReadings(typedReadings);

      // Calculate stats
      const alertsCount = typedReadings.filter((r) => !r.is_within_range).length;
      const complianceRate = typedReadings.length > 0
        ? Math.round(((typedReadings.length - alertsCount) / typedReadings.length) * 100)
        : 100;

      setStats({
        totalReadings: typedReadings.length,
        alertsCount,
        complianceRate,
      });

      setLoading(false);
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel("temperature-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "temperature_readings",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredReadings = readings.filter((reading) => {
    if (filter === "alerts" && reading.is_within_range) return false;
    if (selectedEquipment !== "all" && reading.equipment_id !== selectedEquipment) return false;
    return true;
  });

  const formatDate = (dateString: string | null) => {
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
            Températures
          </h1>
          <p className="text-slate-400 mt-1">
            Suivi des relevés de température de vos équipements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            Ajouter équipement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Relevés (100 derniers)"
          value={stats.totalReadings}
          icon={Thermometer}
        />
        <StatCard
          title="Alertes hors plage"
          value={stats.alertsCount}
          icon={AlertTriangle}
          variant={stats.alertsCount > 0 ? "error" : "success"}
        />
        <StatCard
          title="Taux de conformité"
          value={`${stats.complianceRate}%`}
          icon={CheckCircle}
          variant={stats.complianceRate >= 95 ? "success" : stats.complianceRate >= 80 ? "warning" : "error"}
        />
      </div>

      {/* Equipment Overview */}
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Équipements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {equipment.length === 0 ? (
            <div className="col-span-full glass-card p-8 text-center">
              <Thermometer className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">Aucun équipement</h3>
              <p className="text-slate-400 text-sm mb-4">
                Ajoutez votre premier équipement pour commencer le suivi des températures.
              </p>
              <button className="btn-primary">
                <Plus className="h-4 w-4" />
                Ajouter équipement
              </button>
            </div>
          ) : (
            equipment.map((eq) => {
              const lastReading = readings.find((r) => r.equipment_id === eq.id);
              const isAlert = lastReading && !lastReading.is_within_range;

              return (
                <div
                  key={eq.id}
                  className={`glass-card p-5 ${isAlert ? "border-red-500/30" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      eq.type === "congelateur" ? "bg-sky-500/10" : "bg-blue-500/10"
                    }`}>
                      <Thermometer className={`h-5 w-5 ${
                        eq.type === "congelateur" ? "text-sky-400" : "text-blue-400"
                      }`} />
                    </div>
                    <span className={`badge-${eq.type === "congelateur" ? "neutral" : "neutral"}`}>
                      {eq.type === "congelateur" ? "Congélateur" : "Frigo"}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{eq.name}</h3>
                  <p className="text-slate-500 text-xs mb-3">{eq.location}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      {lastReading ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-semibold ${
                            isAlert ? "text-red-400" : "text-white"
                          }`}>
                            {lastReading.temperature}°C
                          </span>
                          {isAlert ? (
                            <TrendingUp className="h-4 w-4 text-red-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-emerald-400" />
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">Pas de relevé</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Plage cible</p>
                      <p className="text-sm text-slate-300">
                        {eq.min_temp}°C - {eq.max_temp}°C
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Readings Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-medium text-white">Historique des relevés</h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="text-sm rounded-xl bg-white/5 border-white/10 text-slate-200"
            >
              <option value="all">Tous les équipements</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.name}</option>
              ))}
            </select>
            <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  filter === "all" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter("alerts")}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  filter === "alerts" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Alertes
              </button>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="table-header text-left px-4 py-3">Équipement</th>
                  <th className="table-header text-left px-4 py-3">Température</th>
                  <th className="table-header text-left px-4 py-3">Plage</th>
                  <th className="table-header text-left px-4 py-3">Statut</th>
                  <th className="table-header text-left px-4 py-3">Date/Heure</th>
                  <th className="table-header text-left px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-cell text-center py-8">
                      <p className="text-slate-500">Aucun relevé trouvé</p>
                    </td>
                  </tr>
                ) : (
                  filteredReadings.map((reading) => (
                    <tr key={reading.id} className="table-row">
                      <td className="table-cell">
                        <div>
                          <p className="font-medium text-white">{reading.equipment?.name || "N/A"}</p>
                          <p className="text-xs text-slate-500">{reading.equipment?.location}</p>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`font-semibold ${
                          reading.is_within_range ? "text-white" : "text-red-400"
                        }`}>
                          {reading.temperature}°C
                        </span>
                      </td>
                      <td className="table-cell text-slate-400">
                        {reading.equipment?.min_temp}°C - {reading.equipment?.max_temp}°C
                      </td>
                      <td className="table-cell">
                        {reading.is_within_range ? (
                          <span className="badge-success">Conforme</span>
                        ) : (
                          <span className="badge-error">Hors plage</span>
                        )}
                      </td>
                      <td className="table-cell text-slate-400">
                        {formatDate(reading.timestamp)}
                      </td>
                      <td className="table-cell text-slate-500 max-w-[200px] truncate">
                        {reading.notes || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
