"use client";

import React, { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";

import ProgramsManager from "@/app/contents/ProgramsManager";
import NotificationsManager from "@/app/contents/NotificationsManager";
import POIsManager from "@/app/contents/POIsManager";
import SecurityInfosManager from "@/app/contents/SecurityInfosManager";
import DaysManager from "@/app/contents/Days";
import ConcertsManager from "@/app/contents/ConcertsManager";

import Link from "next/link";
import Sidebar from "../components/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";

const Dashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("users"); // Section par défaut

  const renderSection = () => {
    switch (selectedSection) {
      case "programs":
        return <ProgramsManager />;
      case "notifications":
        return <NotificationsManager />;
      case "pois":
        return <POIsManager />;
      case "securityinfos":
        return <SecurityInfosManager />;
      case "days":
        return <DaysManager />;
      case "concerts":
        return <ConcertsManager />;
      default:
        return <Typography variant="h6">Section non trouvée</Typography>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ display: "flex" }}>
        <Sidebar
          onSelect={setSelectedSection}
          selectedSection={selectedSection}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Container maxWidth="lg">
            <Box mt={5} className="flex flex-col items-center">
              <Typography variant="h4" gutterBottom>
                Tableau de Bord Admin
              </Typography>
              <Box mt={3} display="flex" gap={2}>
                <Link href="/users/create" passHref>
                  <Button variant="contained" color="primary">
                    Créer un Utilisateur
                  </Button>
                </Link>
                <Link href="/users" passHref>
                  <Button variant="contained" color="primary">
                    Gestion des Utilisateurs
                  </Button>
                </Link>
              </Box>
              <Link href="/days" passHref>
                <Button variant="contained" color="primary">
                  Days
                </Button>
              </Link>
            </Box>
          </Container>
          <Box mt={8}>{renderSection()}</Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default Dashboard;
