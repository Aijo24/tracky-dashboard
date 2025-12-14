"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface DashboardStats {
  // Temperature
  temperatureReadingsToday: number;
  temperatureAlertsToday: number;
  temperatureComplianceRate: number;
  equipmentCount: number;

  // Products
  activeProducts: number;
  expiringProductsWeek: number;
  expiredProducts: number;

  // Receptions
  receptionsThisMonth: number;
  receptionComplianceRate: number;
  nonConformitiesThisMonth: number;

  // Freezing
  currentlyFrozen: number;
  currentlyThawed: number;

  // Cleaning
  cleaningCompletionRate: number;
  overdueTasks: number;
  tasksCompletedToday: number;
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
        const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

        // Fetch all data in parallel
        const [
          temperatureReadingsRes,
          temperatureAlertsRes,
          equipmentRes,
          activeProductsRes,
          expiringProductsRes,
          expiredProductsRes,
          receptionsRes,
          nonConformReceptionsRes,
          frozenRes,
          thawedRes,
          overdueTasksRes,
          completedTasksTodayRes,
          totalTasksTodayRes,
        ] = await Promise.all([
          // Temperature readings today
          supabase
            .from("temperature_readings")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("timestamp", startOfToday),

          // Temperature alerts today
          supabase
            .from("temperature_readings")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("is_within_range", false)
            .gte("timestamp", startOfToday),

          // Equipment count
          supabase
            .from("equipment")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),

          // Active products
          supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "active"),

          // Expiring products (next 7 days)
          supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "active")
            .lte("expiry_date", sevenDaysFromNow)
            .gte("expiry_date", today.toISOString().split("T")[0]),

          // Expired products
          supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "expired"),

          // Receptions this month
          supabase
            .from("receptions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("delivery_date", startOfMonth),

          // Non-conform receptions this month
          supabase
            .from("receptions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("is_conform", false)
            .gte("delivery_date", startOfMonth),

          // Currently frozen products
          supabase
            .from("freezing_records")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("current_status", "frozen"),

          // Currently thawed products
          supabase
            .from("freezing_records")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("current_status", "thawed"),

          // Overdue cleaning tasks
          supabase
            .from("cleaning_tasks")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("is_overdue", true)
            .eq("is_completed", false),

          // Completed tasks today
          supabase
            .from("cleaning_tasks")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("is_completed", true)
            .gte("completed_at", startOfToday),

          // Total tasks due today
          supabase
            .from("cleaning_tasks")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .lte("due_date", today.toISOString().split("T")[0]),
        ]);

        const temperatureReadingsToday = temperatureReadingsRes.count || 0;
        const temperatureAlertsToday = temperatureAlertsRes.count || 0;
        const equipmentCount = equipmentRes.count || 0;
        const activeProducts = activeProductsRes.count || 0;
        const expiringProductsWeek = expiringProductsRes.count || 0;
        const expiredProducts = expiredProductsRes.count || 0;
        const receptionsThisMonth = receptionsRes.count || 0;
        const nonConformitiesThisMonth = nonConformReceptionsRes.count || 0;
        const currentlyFrozen = frozenRes.count || 0;
        const currentlyThawed = thawedRes.count || 0;
        const overdueTasks = overdueTasksRes.count || 0;
        const tasksCompletedToday = completedTasksTodayRes.count || 0;
        const totalTasksToday = totalTasksTodayRes.count || 0;

        // Calculate rates
        const temperatureComplianceRate = temperatureReadingsToday > 0
          ? Math.round(((temperatureReadingsToday - temperatureAlertsToday) / temperatureReadingsToday) * 100)
          : 100;

        const receptionComplianceRate = receptionsThisMonth > 0
          ? Math.round(((receptionsThisMonth - nonConformitiesThisMonth) / receptionsThisMonth) * 100)
          : 100;

        const cleaningCompletionRate = totalTasksToday > 0
          ? Math.round((tasksCompletedToday / totalTasksToday) * 100)
          : 100;

        setStats({
          temperatureReadingsToday,
          temperatureAlertsToday,
          temperatureComplianceRate,
          equipmentCount,
          activeProducts,
          expiringProductsWeek,
          expiredProducts,
          receptionsThisMonth,
          receptionComplianceRate,
          nonConformitiesThisMonth,
          currentlyFrozen,
          currentlyThawed,
          cleaningCompletionRate,
          overdueTasks,
          tasksCompletedToday,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return { stats, loading, error };
}
