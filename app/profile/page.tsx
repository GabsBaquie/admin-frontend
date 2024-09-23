// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import ChangePassword from "@/app/components/ChangePassword";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";

interface UserData {
  username: string;
  email: string;
  role: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchWithAuth("/auth/me", {
          method: "GET",
        });
        setUserData(data);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
        setError("Erreur lors de la récupération du profil");
      }
    };

    fetchProfile();
  }, []); // Aucun besoin de dépendance car fetchWithAuth gère le token

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchWithAuth("/auth/me", {
        method: "PUT",
        body: JSON.stringify(userData),
      });

      setSuccess("Profil mis à jour avec succès");
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil :", err);
      setError("Erreur lors de la mise à jour du profil");
      setSuccess(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      {" "}
      {/* Ajustez les rôles selon vos besoins */}
      <Container maxWidth="sm">
        <Box mt={5} className="bg-white p-8 rounded shadow">
          <Typography variant="h4" gutterBottom>
            Mon Profil
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}

          {/* Formulaire de mise à jour du profil */}
          <form className="space-y-4" onSubmit={handleProfileUpdate}>
            <TextField
              label="Nom d'utilisateur"
              name="username"
              fullWidth
              value={userData.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={userData.email}
              onChange={handleChange}
              required
            />
            <TextField label="Rôle" fullWidth value={userData.role} disabled />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Mettre à jour le profil
            </Button>
          </form>

          {/* Composant de changement de mot de passe */}
          <ChangePassword />
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default Profile;
