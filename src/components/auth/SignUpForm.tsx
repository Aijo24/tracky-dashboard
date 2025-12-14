"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Building2, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, restaurantName);

    if (signUpError) {
      setError(signUpError.message || "Erreur lors de l'inscription");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/signin");
    }, 2000);
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Compte créé avec succès !</h2>
          <p className="text-slate-400">
            Vérifiez votre email pour confirmer votre compte.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/90 text-white font-semibold text-xl">
          T
        </div>
        <span className="text-2xl font-semibold text-white tracking-tight">Tracky</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">
          Créer un compte
        </h1>
        <p className="text-slate-400">
          Commencez votre essai gratuit de 14 jours
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="restaurant" className="block text-sm font-medium text-slate-300 mb-2">
            Nom de l&apos;établissement
          </label>
          <div className="relative flex items-center">
            <Building2 className="absolute left-4 h-5 w-5 text-slate-500 pointer-events-none" />
            <input
              id="restaurant"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Mon Restaurant"
              className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Adresse email
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-5 w-5 text-slate-500 pointer-events-none" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
            Mot de passe
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-5 w-5 text-slate-500 pointer-events-none" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-5 w-5 text-slate-500 pointer-events-none" />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Créer mon compte
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Terms */}
      <p className="mt-6 text-xs text-slate-500 text-center">
        En créant un compte, vous acceptez nos{" "}
        <Link href="/terms" className="text-orange-400 hover:text-orange-300">
          Conditions d&apos;utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
          Politique de confidentialité
        </Link>
      </p>

      {/* Sign in link */}
      <p className="mt-6 text-center text-sm text-slate-400">
        Déjà un compte ?{" "}
        <Link href="/signin" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
