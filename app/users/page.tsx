// app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";

import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data: User[] = await fetchWithAuth("/admin/users", {
          method: "GET",
        });
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setError(
          err.message || "Erreur lors de la récupération des utilisateurs"
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Aucun besoin de dépendance car fetchWithAuth gère le token

  const deleteUser = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;
    try {
      await fetchWithAuth(`/admin/users/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression de l'utilisateur:", err);
      setError(err.message || "Erreur lors de la suppression de l'utilisateur");
    }
  };

  if (loading)
    return (
      <Container maxWidth="lg">
        <Box mt={5} textAlign="center">
          <CircularProgress />
          <Typography>Chargement...</Typography>
        </Box>
      </Container>
    );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Container maxWidth="lg">
        <Box mt={5}>
          <Typography variant="h4" gutterBottom>
            Gestion des Utilisateurs
          </Typography>
          <Box mb={3}>
            <Link href="/users/create" passHref>
              <Button variant="contained" color="primary">
                Ajouter un Utilisateur
              </Button>
            </Link>
          </Box>
          {error && (
            <Box mb={2}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nom d&apos;utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Créé le</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/users/edit/${user.id}`} passHref>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          className="mr-2">
                          Éditer
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => deleteUser(user.id)}>
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default Users;
