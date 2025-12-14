"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/lib/supabase/types";
import {
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Download,
  Plus,
  Loader2,
  Calendar,
  Truck,
  XCircle,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expiring" | "expired">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats
  const [stats, setStats] = useState({
    activeCount: 0,
    expiringCount: 0,
    expiredCount: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("expiry_date", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
        return;
      }

      const productsData = data || [];
      setProducts(productsData);

      // Calculate stats
      const today = new Date();
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const activeCount = productsData.filter((p) => p.status === "active").length;
      const expiredCount = productsData.filter((p) => p.status === "expired").length;
      const expiringCount = productsData.filter((p) => {
        if (p.status !== "active") return false;
        const expiryDate = new Date(p.expiry_date);
        return expiryDate <= sevenDaysFromNow && expiryDate >= today;
      }).length;

      setStats({
        activeCount,
        expiringCount,
        expiredCount,
      });

      setLoading(false);
    };

    fetchProducts();
  }, [user]);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadge = (product: Product) => {
    if (product.status === "expired") {
      return <span className="badge-error">Expiré</span>;
    }
    if (product.status === "consumed") {
      return <span className="badge-neutral">Consommé</span>;
    }

    const daysUntil = getDaysUntilExpiry(product.expiry_date);
    if (daysUntil < 0) {
      return <span className="badge-error">Expiré</span>;
    }
    if (daysUntil === 0) {
      return <span className="badge-error">Expire aujourd&apos;hui</span>;
    }
    if (daysUntil <= 3) {
      return <span className="badge-error">{daysUntil}j restants</span>;
    }
    if (daysUntil <= 7) {
      return <span className="badge-warning">{daysUntil}j restants</span>;
    }
    return <span className="badge-success">{daysUntil}j restants</span>;
  };

  const filteredProducts = products.filter((product) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !product.name.toLowerCase().includes(query) &&
        !product.lot_number.toLowerCase().includes(query) &&
        !product.supplier.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Status filter
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(product.expiry_date);

    switch (filter) {
      case "active":
        return product.status === "active";
      case "expiring":
        return product.status === "active" && expiryDate <= sevenDaysFromNow && expiryDate >= today;
      case "expired":
        return product.status === "expired" || expiryDate < today;
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-slate-400 text-sm">Chargement des produits...</p>
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
            Traçabilité Produits
          </h1>
          <p className="text-slate-400 mt-1">
            Gestion des lots et suivi des dates de péremption
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            Ajouter produit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Produits actifs"
          value={stats.activeCount}
          icon={Package}
        />
        <StatCard
          title="Expirent cette semaine"
          value={stats.expiringCount}
          icon={Clock}
          variant={stats.expiringCount > 0 ? "warning" : "success"}
        />
        <StatCard
          title="Produits expirés"
          value={stats.expiredCount}
          icon={XCircle}
          variant={stats.expiredCount > 0 ? "error" : "success"}
        />
      </div>

      {/* Expiring Soon Alert */}
      {stats.expiringCount > 0 && (
        <div className="glass-card border-amber-500/30 p-4 flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Attention aux péremptions</h3>
            <p className="text-slate-400 text-sm">
              {stats.expiringCount} produit{stats.expiringCount > 1 ? "s" : ""} expire{stats.expiringCount > 1 ? "nt" : ""} dans les 7 prochains jours.
              Vérifiez les stocks et planifiez leur utilisation.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par nom, lot ou fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
          {[
            { key: "all", label: "Tous" },
            { key: "active", label: "Actifs" },
            { key: "expiring", label: "Expirent bientôt" },
            { key: "expired", label: "Expirés" },
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

      {/* Products Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="table-header text-left px-4 py-3">Produit</th>
                <th className="table-header text-left px-4 py-3">N° Lot</th>
                <th className="table-header text-left px-4 py-3">Fournisseur</th>
                <th className="table-header text-left px-4 py-3">Date réception</th>
                <th className="table-header text-left px-4 py-3">Date expiration</th>
                <th className="table-header text-left px-4 py-3">Statut</th>
                <th className="table-header text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center py-12">
                    <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-2">Aucun produit trouvé</p>
                    <p className="text-slate-500 text-sm">
                      {searchQuery ? "Essayez une autre recherche" : "Ajoutez votre premier produit pour commencer le suivi"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                          <Package className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          {product.barcode && (
                            <p className="text-xs text-slate-500">{product.barcode}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="badge-neutral">{product.lot_number}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-300">{product.supplier}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-400">
                      {formatDate(product.received_date)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-300">{formatDate(product.expiry_date)}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      {getExpiryBadge(product)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
