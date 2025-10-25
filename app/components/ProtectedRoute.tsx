"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const role = localStorage.getItem("role");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(
        "Vous n'êtes pas authentifié. Redirection vers la page de connexion..."
      );
      setTimeout(() => router.push("/login"), 2000);
    } else if (allowedRoles && !allowedRoles.includes(role || "")) {
      setError(
        "Vous n'avez pas les autorisations nécessaires pour accéder à cette page."
      );
      setTimeout(() => router.push("/dashboard"), 5000);
    } else {
    }
  }, [token, role, allowedRoles, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center my-10 text-red-500">
        <h2>Erreur d&apos;accès</h2>
        <p>{error}</p>
        {/* On peut ajouter un spinner de chargement ici si nécessaire */}
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
