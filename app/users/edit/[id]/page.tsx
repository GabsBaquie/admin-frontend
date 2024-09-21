"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { AuthContext } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";

const EditUser: React.FC = () => {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams(); // Utilisation de useParams au lieu de useSearchParams
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}`);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setRole(response.data.role);
    } catch (err) {
      console.error("Fetch user error:", err);
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
    try {
      await axiosInstance.put(`/admin/users/${id}`, { username, email, role });
      router.push("/users");
    } catch (error) {
      console.error("Update user error:", error);
      setError("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="sm">
        <Box mt={5} className="bg-white p-8 rounded shadow">
          <Typography variant="h4" gutterBottom>
            Modifier l&#39;Utilisateur
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
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
              label="Rôle"
              fullWidth
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
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
