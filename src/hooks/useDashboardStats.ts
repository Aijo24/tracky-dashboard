import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  // Temperature
  temperatureReadingsToday: number;
  temperatureAlertsToday: number;
  temperatureComplianceRate: number;

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
  const [stats, setStats] = useState<DashboardStats>({
    temperatureReadingsToday: 0,
    temperatureAlertsToday: 0,
    temperatureComplianceRate: 0,
    activeProducts: 0,
    expiringProductsWeek: 0,
    expiredProducts: 0,
    receptionsThisMonth: 0,
    receptionComplianceRate: 0,
    nonConformitiesThisMonth: 0,
    currentlyFrozen: 0,
    currentlyThawed: 0,
    cleaningCompletionRate: 0,
    overdueTasks: 0,
    tasksCompletedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      try {
        // Temperature stats
        const { data: tempReadingsToday } = await supabase
          .from('temperature_readings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('timestamp', todayStr);

        const { data: tempAlertsToday } = await supabase
          .from('temperature_readings')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_within_range', false)
          .gte('timestamp', todayStr);

        const { data: allReadingsToday } = await supabase
          .from('temperature_readings')
          .select('is_within_range')
          .eq('user_id', user.id)
          .gte('timestamp', todayStr);

        const complianceRate = allReadingsToday && allReadingsToday.length > 0
          ? (allReadingsToday.filter(r => r.is_within_range).length / allReadingsToday.length) * 100
          : 0;

        // Products stats
        const { data: activeProducts } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active');

        const { data: expiringProducts } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active')
          .lte('expiry_date', sevenDaysFromNow.toISOString());

        const { data: expiredProducts } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'expired');

        // Receptions stats
        const { data: receptionsThisMonth } = await supabase
          .from('receptions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('delivery_date', startOfMonth);

        const { data: allReceptionsMonth } = await supabase
          .from('receptions')
          .select('is_conform')
          .eq('user_id', user.id)
          .gte('delivery_date', startOfMonth);

        const receptionComplianceRate = allReceptionsMonth && allReceptionsMonth.length > 0
          ? (allReceptionsMonth.filter(r => r.is_conform).length / allReceptionsMonth.length) * 100
          : 0;

        const nonConformities = allReceptionsMonth
          ? allReceptionsMonth.filter(r => !r.is_conform).length
          : 0;

        // Freezing stats
        const { data: frozenProducts } = await supabase
          .from('freezing_records')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('current_status', 'frozen');

        const { data: thawedProducts } = await supabase
          .from('freezing_records')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('current_status', 'thawed');

        // Cleaning stats
        const { data: overdueTasks } = await supabase
          .from('cleaning_tasks')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_overdue', true)
          .eq('is_completed', false);

        const { data: tasksToday } = await supabase
          .from('cleaning_tasks')
          .select('is_completed')
          .eq('user_id', user.id)
          .eq('due_date', today.toISOString().split('T')[0]);

        const cleaningCompletion = tasksToday && tasksToday.length > 0
          ? (tasksToday.filter(t => t.is_completed).length / tasksToday.length) * 100
          : 0;

        const tasksCompletedToday = tasksToday
          ? tasksToday.filter(t => t.is_completed).length
          : 0;

        setStats({
          temperatureReadingsToday: tempReadingsToday?.length || 0,
          temperatureAlertsToday: tempAlertsToday?.length || 0,
          temperatureComplianceRate: Math.round(complianceRate),
          activeProducts: activeProducts?.length || 0,
          expiringProductsWeek: expiringProducts?.length || 0,
          expiredProducts: expiredProducts?.length || 0,
          receptionsThisMonth: receptionsThisMonth?.length || 0,
          receptionComplianceRate: Math.round(receptionComplianceRate),
          nonConformitiesThisMonth: nonConformities,
          currentlyFrozen: frozenProducts?.length || 0,
          currentlyThawed: thawedProducts?.length || 0,
          cleaningCompletionRate: Math.round(cleaningCompletion),
          overdueTasks: overdueTasks?.length || 0,
          tasksCompletedToday,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
}