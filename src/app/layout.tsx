import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tracky Dashboard - HACCP Compliance",
  description: "Tableau de bord HACCP pour la gestion de la sécurité alimentaire",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
