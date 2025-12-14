export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Background effects */}
        <div className="glow-orange -top-40 -left-40 h-[500px] w-[500px]" />
        <div className="glow-amber -bottom-40 -right-40 h-[600px] w-[600px]" />

        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Feature showcase (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-l border-white/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="glow-orange top-1/4 left-1/4 h-[400px] w-[400px]" />

        <div className="relative z-10 max-w-lg px-12">
          <div className="glass-card p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-slate-200 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              HACCP en temps réel
            </div>

            <h2 className="text-2xl font-semibold text-white tracking-tight mb-4">
              Simplifiez votre conformité alimentaire
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Tracky automatise le suivi HACCP de votre établissement : températures,
              traçabilité, réceptions et nettoyage. Tout en un seul endroit.
            </p>

            <div className="space-y-3">
              {[
                "Relevés de température automatiques",
                "Alertes en temps réel",
                "Traçabilité des produits",
                "Rapports conformes aux audits",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                    <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
