"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { ReceptionWithItems } from "@/lib/supabase/types";
import {
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Plus,
  Loader2,
  Calendar,
  Eye,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  FileSignature,
  Package,
  Thermometer,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function ReceptionsPage() {
  const { user } = useAuth();
  const [receptions, setReceptions] = useState<ReceptionWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "conform" | "nonconform">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReception, setExpandedReception] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalThisMonth: 0,
    conformCount: 0,
    nonConformCount: 0,
    complianceRate: 100,
  });

  useEffect(() => {
    if (!user) return;

    const fetchReceptions = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("receptions")
        .select(`
          *,
          reception_items (*)
        `)
        .eq("user_id", user.id)
        .order("delivery_date", { ascending: false });

      if (error) {
        console.error("Error fetching receptions:", error);
        setLoading(false);
        return;
      }

      const receptionsData = (data || []) as ReceptionWithItems[];
      setReceptions(receptionsData);

      // Calculate stats for this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const thisMonthReceptions = receptionsData.filter(
        (r) => new Date(r.delivery_date) >= startOfMonth
      );

      const conformCount = thisMonthReceptions.filter((r) => r.is_conform).length;
      const nonConformCount = thisMonthReceptions.filter((r) => !r.is_conform).length;
      const complianceRate = thisMonthReceptions.length > 0
        ? Math.round((conformCount / thisMonthReceptions.length) * 100)
        : 100;

      setStats({
        totalThisMonth: thisMonthReceptions.length,
        conformCount,
        nonConformCount,
        complianceRate,
      });

      setLoading(false);
    };

    fetchReceptions();
  }, [user]);

  const filteredReceptions = receptions.filter((reception) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!reception.supplier.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Status filter
    switch (filter) {
      case "conform":
        return reception.is_conform;
      case "nonconform":
        return !reception.is_conform;
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedReception(expandedReception === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-slate-400 text-sm">Chargement des réceptions...</p>
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
            Contrôle à Réception
          </h1>
          <p className="text-slate-400 mt-1">
            Historique des livraisons et vérifications de conformité
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            Nouvelle réception
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Réceptions ce mois"
          value={stats.totalThisMonth}
          icon={Truck}
        />
        <StatCard
          title="Conformes"
          value={stats.conformCount}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Non-conformes"
          value={stats.nonConformCount}
          icon={XCircle}
          variant={stats.nonConformCount > 0 ? "error" : "success"}
        />
        <StatCard
          title="Taux de conformité"
          value={`${stats.complianceRate}%`}
          icon={CheckCircle}
          variant={stats.complianceRate >= 95 ? "success" : stats.complianceRate >= 80 ? "warning" : "error"}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
          {[
            { key: "all", label: "Toutes" },
            { key: "conform", label: "Conformes" },
            { key: "nonconform", label: "Non-conformes" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as typeof filter)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                filter === item.key
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Receptions List */}
      <div className="space-y-4">
        {filteredReceptions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Truck className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Aucune réception trouvée</p>
            <p className="text-slate-500 text-sm">
              {searchQuery ? "Essayez une autre recherche" : "Enregistrez votre première réception"}
            </p>
          </div>
        ) : (
          filteredReceptions.map((reception) => (
            <div key={reception.id} className="glass-card overflow-hidden">
              {/* Reception Header */}
              <div
                className="p-5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleExpand(reception.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      reception.is_conform ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}>
                      {reception.is_conform ? (
                        <CheckCircle className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-medium">{reception.supplier}</h3>
                        {reception.is_conform ? (
                          <span className="badge-success">Conforme</span>
                        ) : (
                          <span className="badge-error">Non-conforme</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(reception.delivery_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          {reception.reception_items?.length || 0} article(s)
                        </span>
                        {reception.signature && (
                          <span className="flex items-center gap-1">
                            <FileSignature className="h-3.5 w-3.5" />
                            Signé
                          </span>
                        )}
                        {reception.delivery_photo_uris && (reception.delivery_photo_uris as string[]).length > 0 && (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {(reception.delivery_photo_uris as string[]).length} photo(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    {expandedReception === reception.id ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedReception === reception.id && (
                <div className="border-t border-white/10">
                  {/* Notes */}
                  {reception.notes && (
                    <div className="px-5 py-3 bg-white/5 border-b border-white/10">
                      <p className="text-sm text-slate-400">
                        <span className="text-slate-500">Notes :</span> {reception.notes}
                      </p>
                    </div>
                  )}

                  {/* Items Table */}
                  {reception.reception_items && reception.reception_items.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5">
                            <th className="table-header text-left px-5 py-2">Produit</th>
                            <th className="table-header text-left px-5 py-2">Quantité</th>
                            <th className="table-header text-left px-5 py-2">N° Lot</th>
                            <th className="table-header text-left px-5 py-2">Température</th>
                            <th className="table-header text-left px-5 py-2">DLC</th>
                            <th className="table-header text-left px-5 py-2">Conformité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reception.reception_items.map((item) => (
                            <tr key={item.id} className="border-b border-white/5">
                              <td className="px-5 py-3 text-sm text-white">{item.product_name}</td>
                              <td className="px-5 py-3 text-sm text-slate-300">{item.quantity}</td>
                              <td className="px-5 py-3 text-sm">
                                <span className="badge-neutral">{item.lot_number}</span>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                {item.temperature !== null ? (
                                  <span className="flex items-center gap-1 text-slate-300">
                                    <Thermometer className="h-3.5 w-3.5" />
                                    {item.temperature}°C
                                  </span>
                                ) : (
                                  <span className="text-slate-500">-</span>
                                )}
                              </td>
                              <td className="px-5 py-3 text-sm text-slate-300">
                                {new Date(item.expiry_date).toLocaleDateString("fr-FR")}
                              </td>
                              <td className="px-5 py-3 text-sm">
                                {item.is_conform ? (
                                  <span className="badge-success">OK</span>
                                ) : (
                                  <span className="badge-error">NC</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
