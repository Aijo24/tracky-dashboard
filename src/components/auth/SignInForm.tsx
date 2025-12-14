"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/");
  };

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
          Connexion
        </h1>
        <p className="text-slate-400">
          Accédez à votre tableau de bord HACCP
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
              className="w-full pl-12 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
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
              className="w-full pl-12 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 px-4 py-3 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 focus:outline-none transition-all duration-200"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/30"
            />
            <span className="ml-2 text-sm text-slate-400">Se souvenir de moi</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            Mot de passe oublié ?
          </Link>
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
              Se connecter
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Sign up link */}
      <p className="mt-8 text-center text-sm text-slate-400">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
