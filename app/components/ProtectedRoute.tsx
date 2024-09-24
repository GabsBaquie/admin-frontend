// app/components/ProtectedRoute.tsx
"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[]; // Paramètre optionnel pour les rôles autorisés
}> = ({ children, allowedRoles }) => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const role = localStorage.getItem("role"); // Récupérer le rôle depuis le localStorage

  // État pour les erreurs spécifiques
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(
        "Vous n'êtes pas authentifié. Redirection vers la page de connexion..."
      );
      console.log("ProtectedRoute - No token, redirecting to /login");
      setTimeout(() => router.push("/login"), 2000); // Redirection après un délai pour afficher le message d'erreur
    } else if (allowedRoles && !allowedRoles.includes(role || "")) {
      setError(
        "Vous n'avez pas les autorisations nécessaires pour accéder à cette page."
      );
      console.log(
        "ProtectedRoute - Insufficient role, redirecting to /dashboard"
      );
      setTimeout(() => router.push("/dashboard"), 5000); // Redirection après un délai
    } else {
      console.log("ProtectedRoute - Access granted");
    }
  }, [token, role, allowedRoles, router]);

  // Affichage d'un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="flex items-center flex-col my-10 text-red-500">
        <h2>Erreur d&apos;accès</h2>
        <p>{error}</p>
        {/* On peut ajouter un spinner de chargement ici si nécessaire */}
      </div>
    );
  }

  if (!token) {
    return null; // Ou un indicateur de chargement
  }

  return <>{children}</>;
};

export default ProtectedRoute;
