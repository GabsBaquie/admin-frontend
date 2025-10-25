// app/layout.tsx
import { AuthProvider } from "@/app/context/AuthContext";
import QueryProvider from "@/app/providers/QueryProvider";
import React from "react";
import "./globals.css";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
