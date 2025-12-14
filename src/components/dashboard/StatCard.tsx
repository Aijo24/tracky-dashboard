"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "error";
}

const variantStyles = {
  default: {
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    trendPositive: "text-emerald-400",
    trendNegative: "text-red-400",
  },
  success: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    trendPositive: "text-emerald-400",
    trendNegative: "text-red-400",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    trendPositive: "text-emerald-400",
    trendNegative: "text-red-400",
  },
  error: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    trendPositive: "text-emerald-400",
    trendNegative: "text-red-400",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="glass-card-hover p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? styles.trendPositive : styles.trendNegative
                }`}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-slate-500">vs hier</span>
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}>
          <Icon className={`h-6 w-6 ${styles.iconColor}`} />
        </div>
      </div>
    </div>
  );
}
