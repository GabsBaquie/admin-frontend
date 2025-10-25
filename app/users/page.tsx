"use client";

import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import React, { useEffect, useState } from "react";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data: User[] = await fetchWithAuth("/admin/users", {
          method: "GET",
        });
        setUsers(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            "Erreur lors de la récupération des utilisateurs:",
            err
          );
          setError(
            err.message || "Erreur lors de la récupération des utilisateurs"
          );
          setLoading(false);
        }
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
      if (err instanceof Error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", err);
        setError(
          err.message || "Erreur lors de la suppression de l'utilisateur"
        );
      }
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/users/create")}
            >
              Ajouter un Utilisateur
            </Button>
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
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className="mr-2"
                        onClick={() => router.push(`/users/edit/${user.id}`)}
                      >
                        Éditer
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => deleteUser(user.id)}
                      >
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
