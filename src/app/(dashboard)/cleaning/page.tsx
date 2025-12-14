"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { CleaningTask, Room, CleaningRecordWithSurfaces } from "@/lib/supabase/types";
import {
  SprayCan,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Download,
  Plus,
  Loader2,
  Home,
  CheckSquare,
  Square,
  Image as ImageIcon,
  FileSignature,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function CleaningPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [records, setRecords] = useState<CleaningRecordWithSurfaces[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "history" | "rooms">("tasks");
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all");

  // Stats
  const [stats, setStats] = useState({
    completedToday: 0,
    pendingToday: 0,
    overdueCount: 0,
    completionRate: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from("cleaning_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      setTasks(tasksData || []);

      // Fetch rooms
      const { data: roomsData } = await supabase
        .from("rooms")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      setRooms(roomsData || []);

      // Fetch recent cleaning records
      const { data: recordsData } = await supabase
        .from("cleaning_records")
        .select(`
          *,
          cleaning_surface_records (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setRecords((recordsData || []) as CleaningRecordWithSurfaces[]);

      // Calculate stats
      const todayTasks = (tasksData || []).filter(
        (t) => t.due_date && t.due_date.split("T")[0] <= todayStr
      );
      const completedToday = todayTasks.filter((t) => t.is_completed).length;
      const pendingToday = todayTasks.filter((t) => !t.is_completed && !t.is_overdue).length;
      const overdueCount = (tasksData || []).filter((t) => t.is_overdue && !t.is_completed).length;
      const completionRate = todayTasks.length > 0
        ? Math.round((completedToday / todayTasks.length) * 100)
        : 100;

      setStats({
        completedToday,
        pendingToday,
        overdueCount,
        completionRate,
      });

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "pending":
        return !task.is_completed && !task.is_overdue;
      case "completed":
        return task.is_completed;
      case "overdue":
        return task.is_overdue && !task.is_completed;
      default:
        return true;
    }
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
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

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      biweekly: "Bimensuel",
      monthly: "Mensuel",
      quarterly: "Trimestriel",
      yearly: "Annuel",
    };
    return labels[freq] || freq;
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
            Nettoyage
          </h1>
          <p className="text-slate-400 mt-1">
            Planning et suivi des tâches de nettoyage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Taux de complétion"
          value={`${stats.completionRate}%`}
          icon={CheckCircle}
          variant={stats.completionRate >= 80 ? "success" : stats.completionRate >= 50 ? "warning" : "error"}
        />
        <StatCard
          title="Terminées aujourd'hui"
          value={stats.completedToday}
          icon={CheckSquare}
          variant="success"
        />
        <StatCard
          title="En attente"
          value={stats.pendingToday}
          icon={Clock}
        />
        <StatCard
          title="En retard"
          value={stats.overdueCount}
          icon={AlertTriangle}
          variant={stats.overdueCount > 0 ? "error" : "success"}
        />
      </div>

      {/* Overdue Alert */}
      {stats.overdueCount > 0 && (
        <div className="glass-card border-red-500/30 p-4 flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Tâches en retard</h3>
            <p className="text-slate-400 text-sm">
              {stats.overdueCount} tâche{stats.overdueCount > 1 ? "s" : ""} de nettoyage {stats.overdueCount > 1 ? "sont" : "est"} en retard.
              Complétez-{stats.overdueCount > 1 ? "les" : "la"} dès que possible pour maintenir la conformité HACCP.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 w-fit">
        {[
          { key: "tasks", label: "Tâches", icon: CheckSquare },
          { key: "history", label: "Historique", icon: Calendar },
          { key: "rooms", label: "Zones", icon: Home },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          {/* Task Filter */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 w-fit">
            {[
              { key: "all", label: "Toutes" },
              { key: "pending", label: "En attente" },
              { key: "completed", label: "Terminées" },
              { key: "overdue", label: "En retard" },
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

          {/* Tasks List */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="table-header text-left px-4 py-3">Tâche</th>
                    <th className="table-header text-left px-4 py-3">Zone</th>
                    <th className="table-header text-left px-4 py-3">Surface</th>
                    <th className="table-header text-left px-4 py-3">Échéance</th>
                    <th className="table-header text-left px-4 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="table-cell text-center py-12">
                        <SprayCan className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Aucune tâche trouvée</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr key={task.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              task.is_completed ? "bg-emerald-500/10" :
                              task.is_overdue ? "bg-red-500/10" :
                              "bg-white/5"
                            }`}>
                              {task.is_completed ? (
                                <CheckSquare className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${task.is_completed ? "text-slate-400 line-through" : "text-white"}`}>
                                {task.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell text-slate-300">{task.room_name}</td>
                        <td className="table-cell text-slate-400">{task.surface_name}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="h-4 w-4" />
                            {formatDate(task.due_date)}
                          </div>
                        </td>
                        <td className="table-cell">
                          {task.is_completed ? (
                            <span className="badge-success">Terminé</span>
                          ) : task.is_overdue ? (
                            <span className="badge-error">En retard</span>
                          ) : (
                            <span className="badge-warning">En attente</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Aucun historique de nettoyage</p>
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="glass-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{record.room_name}</h3>
                      <p className="text-sm text-slate-400">{record.restaurant_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    {record.signature && (
                      <span className="flex items-center gap-1">
                        <FileSignature className="h-4 w-4" />
                        Signé
                      </span>
                    )}
                    <span>{formatDateTime(record.created_at)}</span>
                  </div>
                </div>

                {record.cleaning_surface_records && record.cleaning_surface_records.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {record.cleaning_surface_records.map((surface) => (
                      <div
                        key={surface.id}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          surface.is_cleaned ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-400"
                        }`}
                      >
                        {surface.is_cleaned ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                        {surface.surface_name}
                        {surface.photo_uris && (surface.photo_uris as string[]).length > 0 && (
                          <ImageIcon className="h-3 w-3 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === "rooms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.length === 0 ? (
            <div className="col-span-full glass-card p-12 text-center">
              <Home className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Aucune zone configurée</p>
              <p className="text-slate-500 text-sm mb-4">
                Ajoutez des zones et surfaces pour organiser vos tâches de nettoyage
              </p>
              <button className="btn-primary">
                <Plus className="h-4 w-4" />
                Ajouter une zone
              </button>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="glass-card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <Home className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-white font-medium mb-2">{room.name}</h3>
                <p className="text-xs text-slate-500">
                  Créé le {formatDate(room.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
