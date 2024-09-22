"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import axiosInstance from "@/app/utils/axiosInstance";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AxiosError } from "axios"; // Importation nécessaire

const CreateUser: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      setError("L'adresse e-mail doit être une adresse Gmail.");
      return;
    }

    try {
      await axiosInstance.post("/admin/users", {
        username,
        email,
        password,
        role,
      });
      router.push("/users");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 403) {
        setError(
          "Vous n'avez pas les autorisations nécessaires pour créer un utilisateur."
        );
      } else if (error.response.status === 409) {
        setError("L'utilisateur existe déjà.");
      } else {
        setError("Erreur lors de la création de l'utilisateur");
      }
      console.error("Create user error:", axiosError);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Container maxWidth="sm">
        <Box mt={5} className="bg-white p-8 rounded shadow">
          <Typography variant="h4" gutterBottom>
            Ajouter un Utilisateur
          </Typography>
          {error && (
            <Typography color="error" my={2}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Nom d'utilisateur"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Rôle"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ajouter
            </Button>
          </form>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default CreateUser;
