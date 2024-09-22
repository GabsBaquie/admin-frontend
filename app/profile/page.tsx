"use client";

import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { AuthContext } from "@/app/context/AuthContext";
import axiosInstance from "@/app/utils/axiosInstance";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const Profile: React.FC = () => {
  const { token } = useContext(AuthContext); // Récupérer le token à partir du contexte
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/me"); // API pour obtenir les données du profil
        setUserData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
        setError("Erreur lors de la récupération du profil");
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/auth/me", userData); // API pour mettre à jour le profil
      setSuccess("Profil mis à jour avec succès");
      setUserData(response.data);
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
    <ProtectedRoute>
      <Container maxWidth="sm">
        <Box mt={5} className="bg-white p-8 rounded shadow">
          <Typography variant="h4" gutterBottom>
            Mon Profil
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              Mettre à jour
            </Button>
          </form>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default Profile;
