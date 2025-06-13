// app/layout.tsx
"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import { ToastProvider, useToast } from "@/app/context/ToastContext";
import QueryProvider from "@/app/providers/QueryProvider";
import { usePathname } from "next/navigation";
import React, { Suspense } from "react";
import Navbar from "./components/Navbar";
import "./globals.css";

// Metadata pour le SEO
export const metadata = {
  title: 'Nation Sounds Admin',
  description: 'Interface d\'administration pour Nation Sounds',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname(); // Obtenir l'URL actuelle
  const { showToast } = useToast();

  // Ne pas afficher la Navbar sur la page de login ou la page principale (index)
  const hideNavbar = pathname === "/login" || pathname === "/";

  // Pour afficher une notification
  showToast('Opération réussie !', 'success');
  showToast('Une erreur est survenue', 'error');
  showToast('Information importante', 'info');
  showToast('Attention !', 'warning');

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <QueryProvider>
            <ToastProvider>
              <Suspense fallback={<div>Chargement...</div>}>
                {!hideNavbar && <Navbar />}
                <main className="container mx-auto px-4 py-8">
                  {children}
                </main>
              </Suspense>
            </ToastProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
