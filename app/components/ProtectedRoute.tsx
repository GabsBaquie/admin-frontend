// app/components/ProtectedRoute.tsx
"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute - Token:", token);
    if (!token) {
      console.log("ProtectedRoute - No token, redirecting to /login");
      router.push("/login");
    }
  }, [token, router]);

  if (!token) {
    return null; // Ou un indicateur de chargement
  }

  return <>{children}</>;
};

export default ProtectedRoute;
