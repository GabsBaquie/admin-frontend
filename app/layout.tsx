// app/layout.tsx
"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import React from "react";
import "./globals.css";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation"; // Importer le hook pour obtenir le chemin actuel

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); // Obtenir l'URL actuelle

  // Ne pas afficher la Navbar sur la page de login ou la page principale (index)
  const hideNavbar = pathname === "/login" || pathname === "/";

  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {/* Afficher la Navbar seulement si hideNavbar est faux */}
          {!hideNavbar && <Navbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
