"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StatCard from "@/components/dashboard/StatCard";

interface Product {
  id: string;
  name: string;
  lot_number: string;
  expiry_date: string;
  supplier: string;
  received_date: string;
  status: 'active' | 'expired' | 'consumed';
  barcode: string | null;
  created_at: string;
}

export default function ProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('active');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('expiry_date', { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!user) return null;

  const now = new Date();
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const activeProducts = products.filter(p => p.status === 'active');
  const expiringProducts = activeProducts.filter(p => {
    const expiryDate = new Date(p.expiry_date);
    return expiryDate <= sevenDaysFromNow && expiryDate >= now;
  });
  const expiredProducts = products.filter(p => p.status === 'expired' || new Date(p.expiry_date) < now);

  const getFilteredProducts = () => {
    switch (filter) {
      case 'active':
        return activeProducts.filter(p => new Date(p.expiry_date) >= sevenDaysFromNow);
      case 'expiring':
        return expiringProducts;
      case 'expired':
        return expiredProducts;
      default:
        return products;
    }
  };

  const filteredProducts = getFilteredProducts();

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📦 Traçabilité des Produits
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Suivi des produits et gestion des dates de péremption
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        <StatCard
          title="Produits actifs"
          value={activeProducts.length}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          title="Expirent dans 7 jours"
          value={expiringProducts.length}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Produits expirés"
          value={expiredProducts.length}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Products List */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Liste des produits
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Tous ({products.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'active'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Actifs ({activeProducts.filter(p => new Date(p.expiry_date) >= sevenDaysFromNow).length})
            </button>
            <button
              onClick={() => setFilter('expiring')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'expiring'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              À expirer ({expiringProducts.length})
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'expired'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Expirés ({expiredProducts.length})
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Aucun produit trouvé pour ce filtre.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">N° Lot</th>
                  <th className="px-4 py-3">Fournisseur</th>
                  <th className="px-4 py-3">Date réception</th>
                  <th className="px-4 py-3">Date péremption</th>
                  <th className="px-4 py-3">Jours restants</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const daysUntilExpiry = getDaysUntilExpiry(product.expiry_date);
                  const isExpired = daysUntilExpiry < 0;
                  const isExpiring = daysUntilExpiry >= 0 && daysUntilExpiry <= 7;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {product.lot_number}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {product.supplier}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(product.received_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(product.expiry_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className={`px-4 py-3 font-semibold ${
                        isExpired
                          ? 'text-red-600 dark:text-red-400'
                          : isExpiring
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {isExpired ? 'Expiré' : `${daysUntilExpiry} jour${daysUntilExpiry > 1 ? 's' : ''}`}
                      </td>
                      <td className="px-4 py-3">
                        {isExpired ? (
                          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-900/20 dark:text-red-400">
                            ❌ Expiré
                          </span>
                        ) : isExpiring ? (
                          <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full dark:bg-orange-900/20 dark:text-orange-400">
                            ⚠ À surveiller
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
                            ✓ OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expiring Products Alert */}
      {expiringProducts.length > 0 && (
        <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
                Attention : {expiringProducts.length} produit{expiringProducts.length > 1 ? 's' : ''} expire{expiringProducts.length > 1 ? 'nt' : ''} dans les 7 prochains jours
              </h3>
              <div className="mt-2 text-sm text-orange-700 dark:text-orange-400">
                <ul className="pl-5 space-y-1 list-disc">
                  {expiringProducts.slice(0, 3).map(p => (
                    <li key={p.id}>
                      {p.name} - {getDaysUntilExpiry(p.expiry_date)} jour{getDaysUntilExpiry(p.expiry_date) > 1 ? 's' : ''}
                    </li>
                  ))}
                  {expiringProducts.length > 3 && (
                    <li>... et {expiringProducts.length - 3} autre{expiringProducts.length - 3 > 1 ? 's' : ''}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}