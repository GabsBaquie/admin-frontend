// app/users/page.tsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

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
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users");
      setUsers(response.data);
      setLoading(false);
    } catch {
      setError("Erreur lors de la récupération des utilisateurs");
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur lors de la suppression de l'utilisateur");
    }
  };

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <ProtectedRoute>
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
