"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
} from "lucide-react";

export default function Header() {
  const { profile, signOut } = useAuth();
  const { setIsMobileOpen } = useSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-64 pr-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500" />
            </button>

            {/* Notification dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 bg-slate-800/50">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto bg-slate-900/80">
                  {/* Sample notifications */}
                  <div className="px-4 py-3 hover:bg-white/5 border-b border-white/5 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <Bell className="h-4 w-4 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">Alerte température</p>
                        <p className="text-xs text-slate-300 mt-1">Frigo 1 hors plage (8°C)</p>
                        <p className="text-xs text-slate-500 mt-1">Il y a 5 min</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-white/5 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                        <Bell className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">Produit proche expiration</p>
                        <p className="text-xs text-slate-300 mt-1">Lait frais expire dans 2 jours</p>
                        <p className="text-xs text-slate-500 mt-1">Il y a 1h</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-white/10 bg-slate-800/50">
                  <Link
                    href="/notifications"
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Voir toutes les notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-medium">
                {profile?.initials || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-200">
                  {profile?.restaurant_name || "Mon Restaurant"}
                </p>
                <p className="text-xs text-slate-400">
                  {profile?.email || "email@exemple.com"}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* User dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 bg-slate-800/50">
                  <p className="text-sm font-medium text-white">{profile?.restaurant_name || "Mon Restaurant"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{profile?.email}</p>
                </div>

                <div className="py-2 bg-slate-900/80">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Mon profil
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </Link>
                  <Link
                    href="/subscription"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    Abonnement
                  </Link>
                </div>

                <div className="py-2 border-t border-white/10 bg-slate-900/80">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
