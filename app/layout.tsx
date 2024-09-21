// app/layout.tsx
"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import React from "react";
import "./globals.css"; // Importez vos styles globaux ici

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
