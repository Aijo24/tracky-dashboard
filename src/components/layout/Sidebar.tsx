"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard,
  Thermometer,
  Package,
  Truck,
  Snowflake,
  SprayCan,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Températures",
    href: "/temperature",
    icon: Thermometer,
  },
  {
    name: "Produits",
    href: "/products",
    icon: Package,
  },
  {
    name: "Réceptions",
    href: "/receptions",
    icon: Truck,
  },
  {
    name: "Congélation",
    href: "/freezing",
    icon: Snowflake,
  },
  {
    name: "Nettoyage",
    href: "/cleaning",
    icon: SprayCan,
  },
];

const secondaryNavigation = [
  {
    name: "Rapports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Aide",
    href: "/help",
    icon: HelpCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isMobileOpen, toggleSidebar, setIsMobileOpen, setIsHovered } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isOpen ? "w-64" : "w-20"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/90 text-white font-semibold text-lg flex-shrink-0">
              T
            </div>
            {isOpen && (
              <span className="text-lg font-semibold text-white tracking-tight">
                Tracky
              </span>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="mb-2">
            {isOpen && (
              <span className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Menu principal
              </span>
            )}
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={active ? "sidebar-link-active" : "sidebar-link"}
                title={!isOpen ? item.name : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-orange-400" : "text-slate-400"}`} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-white/10">
            {isOpen && (
              <span className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Autres
              </span>
            )}
          </div>

          {secondaryNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={active ? "sidebar-link-active" : "sidebar-link"}
                title={!isOpen ? item.name : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-orange-400" : "text-slate-400"}`} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-white/10">
            <div className="glass-card p-4">
              <p className="text-xs text-slate-400 mb-2">Version 1.0</p>
              <p className="text-xs text-slate-500">
                HACCP Dashboard
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
