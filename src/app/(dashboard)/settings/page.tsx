"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Building2,
  Mail,
  Lock,
  Bell,
  Shield,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { profile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: profile?.restaurant_name || "",
    restaurantAddress: profile?.restaurant_address || "",
    email: profile?.email || "",
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Paramètres
        </h1>
        <p className="text-slate-400 mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
            <Building2 className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Établissement</h2>
            <p className="text-sm text-slate-400">Informations de votre restaurant</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nom de l&apos;établissement
            </label>
            <input
              type="text"
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              placeholder="Mon Restaurant"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={formData.restaurantAddress}
              onChange={(e) => setFormData({ ...formData, restaurantAddress: e.target.value })}
              placeholder="123 Rue Example, 75000 Paris"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Compte</h2>
            <p className="text-sm text-slate-400">Informations de connexion</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Adresse email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200 disabled:opacity-50"
                style={{ paddingLeft: '2.5rem' }}
                disabled
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Contactez le support pour modifier votre email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mot de passe
            </label>
            <button className="btn-secondary">
              <Lock className="h-4 w-4" />
              Modifier le mot de passe
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Bell className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Notifications</h2>
            <p className="text-sm text-slate-400">Gérez vos alertes</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Alertes température hors plage", description: "Notification immédiate" },
            { label: "Produits proches de l'expiration", description: "7 jours avant" },
            { label: "Tâches de nettoyage en retard", description: "Rappel quotidien" },
            { label: "Résumé hebdomadaire", description: "Chaque lundi" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Sécurité</h2>
            <p className="text-sm text-slate-400">Options de sécurité du compte</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-white">Authentification à deux facteurs</p>
              <p className="text-xs text-slate-500">Sécurisez votre compte avec 2FA</p>
            </div>
            <button className="btn-secondary text-xs">
              Configurer
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-white">Sessions actives</p>
              <p className="text-xs text-slate-500">Gérez vos connexions</p>
            </div>
            <button className="btn-secondary text-xs">
              Voir
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Enregistré !
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </div>
  );
}
