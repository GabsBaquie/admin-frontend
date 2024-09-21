// app/dashboard/page.tsx
"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import React, { useContext } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthContext } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <Container maxWidth="md">
        <Box mt={5} className="flex flex-col items-center">
          <Typography variant="h4" gutterBottom>
            Tableau de Bord Admin
          </Typography>
          <Box mt={3}>
            <Link href="/users/create" passHref>
              <Button variant="contained" color="primary" className="mr-4">
                Créer un Utilisateur
              </Button>
            </Link>
            <Link href="/users" passHref>
              <Button variant="contained" color="primary" className="mr-4">
                Gestion des Utilisateurs
              </Button>
              x
            </Link>
            {/* Ajoutez d'autres boutons pour différentes sections du back-office */}
            <Button variant="outlined" color="secondary" onClick={logout}>
              Se Déconnecter
            </Button>
          </Box>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default Dashboard;
