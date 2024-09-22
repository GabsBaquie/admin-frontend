"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";

const EditUser: React.FC = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams(); // Récupération de l'ID depuis les paramètres d'URL
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Ajout d'un état pour le succès

  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}`);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setRole(response.data.role);
    } catch (error) {
      console.error("Fetch user error:", error);
      setError("Erreur lors de la récupération des données de l'utilisateur");
    }
  }, [id]);

  useEffect(() => {
    if (id && token) {
      fetchUser();
    }
  }, [id, token, fetchUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Réinitialiser l'erreur avant une nouvelle tentative
    setSuccess(null); // Réinitialiser le succès avant une nouvelle tentative
    try {
      await axiosInstance.put(`/admin/users/${id}`, { username, email, role });
      setSuccess("Utilisateur mis à jour avec succès !");
      setTimeout(() => {
        router.push("/users");
      }, 2000); // Redirection après 2 secondes pour laisser le temps d'afficher le message de succès
    } catch (error) {
      console.error("Update user error:", error);
      setError("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Container maxWidth="sm">
        <Box mt={5} className="bg-white p-8 rounded shadow">
          <Typography variant="h4" gutterBottom>
            Modifier l&#39;Utilisateur
          </Typography>
          {error && (
            <Typography color="error" my={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" my={2}>
              {success}
            </Typography>
          )}
          {/* Affichage du succès */}
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
            <FormControl fullWidth required>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Rôle">
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Mettre à Jour
            </Button>
          </form>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default EditUser;
