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
