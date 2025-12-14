"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Thermometer,
  Package,
  Truck,
  SprayCan,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(false);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  const reportSections = [
    {
      title: "Relevés de température",
      description: "Tous les relevés avec statut de conformité",
      icon: Thermometer,
      color: "orange",
    },
    {
      title: "Traçabilité produits",
      description: "Liste des produits, lots et dates de péremption",
      icon: Package,
      color: "blue",
    },
    {
      title: "Contrôle réceptions",
      description: "Historique des livraisons et conformité",
      icon: Truck,
      color: "emerald",
    },
    {
      title: "Registre de nettoyage",
      description: "Tâches complétées avec signatures",
      icon: SprayCan,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Rapports & Exports
        </h1>
        <p className="text-slate-400 mt-1">
          Générez vos rapports HACCP mensuels conformes aux exigences d&apos;audit
        </p>
      </div>

      {/* Month Selector */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-medium text-white mb-4">Sélectionner la période</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-2">Mois du rapport</label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGeneratePDF}
              disabled={generating}
              className="btn-primary w-full sm:w-auto"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : generated ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Téléchargé !
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Générer le PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content Preview */}
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Contenu du rapport</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportSections.map((section, index) => {
            const Icon = section.icon;
            const bgColor = `bg-${section.color}-500/10`;
            const textColor = `text-${section.color}-400`;

            return (
              <div key={index} className="glass-card p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    section.color === "orange" ? "bg-orange-500/10" :
                    section.color === "blue" ? "bg-blue-500/10" :
                    section.color === "emerald" ? "bg-emerald-500/10" :
                    "bg-purple-500/10"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      section.color === "orange" ? "text-orange-400" :
                      section.color === "blue" ? "text-blue-400" :
                      section.color === "emerald" ? "text-emerald-400" :
                      "text-purple-400"
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{section.title}</h3>
                    <p className="text-sm text-slate-400">{section.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Exports individuels (CSV)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Températures", icon: Thermometer },
            { label: "Produits", icon: Package },
            { label: "Réceptions", icon: Truck },
            { label: "Nettoyage", icon: SprayCan },
          ].map((item, index) => (
            <button
              key={index}
              className="glass-card-hover p-4 flex items-center gap-3 text-left"
            >
              <item.icon className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm text-white font-medium">{item.label}</p>
                <p className="text-xs text-slate-500">Export CSV</p>
              </div>
              <Download className="h-4 w-4 text-slate-500 ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* HACCP Info */}
      <div className="glass-card border-orange-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 flex-shrink-0">
            <FileText className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Format conforme HACCP</h3>
            <p className="text-sm text-slate-400 mb-3">
              Les rapports générés respectent les exigences réglementaires HACCP et peuvent être présentés
              lors des contrôles sanitaires. Ils incluent :
            </p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Horodatage de tous les relevés
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Traçabilité complète des lots
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Signatures électroniques
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Photos des contrôles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
