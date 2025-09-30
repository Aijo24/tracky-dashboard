"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StatCard from "@/components/dashboard/StatCard";

interface Equipment {
  id: string;
  name: string;
  type: 'frigo' | 'congelateur';
  min_temp: number;
  max_temp: number;
  location: string;
}

interface TemperatureReading {
  id: string;
  equipment_id: string;
  temperature: number;
  timestamp: string;
  is_within_range: boolean;
  notes: string | null;
  equipment?: Equipment;
}

export default function TemperaturePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'alerts'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch equipment
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (equipmentError) throw equipmentError;
        setEquipment(equipmentData || []);

        // Fetch recent temperature readings
        const { data: readingsData, error: readingsError } = await supabase
          .from('temperature_readings')
          .select(`
            *,
            equipment (*)
          `)
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(50);

        if (readingsError) throw readingsError;
        setReadings(readingsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('temperature-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'temperature_readings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New temperature reading:', payload.new);
          // Refetch data when new reading is added
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!user) return null;

  const filteredReadings = filter === 'alerts'
    ? readings.filter(r => !r.is_within_range)
    : readings;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayReadings = readings.filter(r => new Date(r.timestamp) >= today);
  const todayAlerts = todayReadings.filter(r => !r.is_within_range);
  const complianceRate = todayReadings.length > 0
    ? Math.round((todayReadings.filter(r => r.is_within_range).length / todayReadings.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🌡️ Contrôle des Températures
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Suivi et analyse des relevés de température
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        <StatCard
          title="Équipements"
          value={equipment.length}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          title="Relevés aujourd'hui"
          value={todayReadings.length}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          title="Alertes aujourd'hui"
          value={todayAlerts.length}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Equipment List */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Équipements
        </h2>
        {equipment.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Aucun équipement enregistré. Utilisez l'application mobile pour ajouter des équipements.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="p-4 border border-gray-200 rounded-lg dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {eq.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {eq.type === 'frigo' ? '🧊 Réfrigérateur' : '❄️ Congélateur'}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      📍 {eq.location}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Plage: {eq.min_temp}°C - {eq.max_temp}°C
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Temperature Readings */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Relevés récents
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Tous ({readings.length})
            </button>
            <button
              onClick={() => setFilter('alerts')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === 'alerts'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Alertes ({readings.filter(r => !r.is_within_range).length})
            </button>
          </div>
        </div>

        {filteredReadings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all'
              ? "Aucun relevé enregistré."
              : "Aucune alerte."
            }
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Date/Heure</th>
                  <th className="px-4 py-3">Équipement</th>
                  <th className="px-4 py-3">Température</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredReadings.map((reading) => (
                  <tr
                    key={reading.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-3">
                      {new Date(reading.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      {reading.equipment?.name || 'N/A'}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${
                      !reading.is_within_range
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {reading.temperature}°C
                    </td>
                    <td className="px-4 py-3">
                      {reading.is_within_range ? (
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
                          ✓ Conforme
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-900/20 dark:text-red-400">
                          ⚠ Hors norme
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {reading.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compliance Rate */}
      {todayReadings.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Taux de conformité aujourd'hui
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className={`h-4 rounded-full transition-all ${
                    complianceRate >= 90
                      ? 'bg-green-500'
                      : complianceRate >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${complianceRate}%` }}
                />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {complianceRate}%
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {todayReadings.filter(r => r.is_within_range).length} relevés conformes sur {todayReadings.length}
          </p>
        </div>
      )}
    </div>
  );
}