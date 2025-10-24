"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "./Navbar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();

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
    <>
      {/* Afficher la Navbar seulement si hideNavbar est faux */}
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

export default ClientLayout;
