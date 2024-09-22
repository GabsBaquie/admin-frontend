// app/dashboard/page.tsx
"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

const Dashboard: React.FC = () => {
  return (
    <ProtectedRoute>
      <Container maxWidth="md">
        <Box mt={5} className="flex flex-col items-center">
          <Typography variant="h4" gutterBottom>
            Tableau de Bord Admin
          </Typography>
          <Box mt={3}>
            <Link href="/users/create" passHref className="mx-4">
              <Button variant="contained" color="primary">
                Créer un Utilisateur
              </Button>
            </Link>
            <Link href="/users" passHref>
              <Button variant="contained" color="primary" className="mr-4">
                Gestion des Utilisateurs
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default Dashboard;
