// app/layout.tsx
import ClientLayout from "@/app/components/ClientLayout";
import { AuthProvider } from "@/app/context/AuthContext";
import QueryProvider from "@/app/providers/QueryProvider";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import "./globals.css";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <QueryProvider>
              <ClientLayout>{children}</ClientLayout>
            </QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
};

export default RootLayout;
