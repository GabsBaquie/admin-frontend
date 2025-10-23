// app/layout.tsx
"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import QueryProvider from "@/app/providers/QueryProvider";
import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "./components/Navbar";
import "./globals.css";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); // Obtenir l'URL actuelle

  // Ne pas afficher la Navbar sur la page de login ou la page principale (index)
  const hideNavbar = pathname === "/login" || pathname === "/";

  // Protection contre les erreurs d'extensions Chrome
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Filtrer les erreurs provenant d'extensions Chrome
      if (event.filename && event.filename.includes("chrome-extension://")) {
        event.preventDefault();
        console.warn("Erreur d'extension Chrome ignorée:", event.message);
        return false;
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <QueryProvider>
            {/* Afficher la Navbar seulement si hideNavbar est faux */}
            {!hideNavbar && <Navbar />}
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
