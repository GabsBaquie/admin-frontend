"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";

export const dynamic = "force-dynamic";

import ActualitesManager from "@/app/contents/ActualitesManager";
import ConcertsManager from "@/app/contents/ConcertsManager";
import DaysManager from "@/app/contents/Days";
import PartenairesManager from "@/app/contents/PartenairesManager";
import POIsManager from "@/app/contents/POI";
import SecurityInfosManager from "@/app/contents/SecurityInfosManager";
import UsersManager from "@/app/contents/UsersManager";
import ImagesPage from "@/app/images/page";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Sidebar from "@/app/components/Sidebar";

const Dashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("days");

  const renderSection = () => {
    switch (selectedSection) {
      case "users":
        return <UsersManager />;
      case "pois":
        return <POIsManager />;
      case "securityinfos":
        return <SecurityInfosManager />;
      case "days":
        return <DaysManager />;
      case "concerts":
        return <ConcertsManager />;
      case "actualites":
        return <ActualitesManager />;
      case "partenaires":
        return <PartenairesManager />;
      case "images":
        return <ImagesPage />;
      default:
        return <Typography variant="h6">Section non trouvée</Typography>;
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Navbar />
        <Box sx={{ display: "flex", flex: 1 }}>
          <Sidebar
            onSelect={setSelectedSection}
            selectedSection={selectedSection}
          />
          <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
            <Container maxWidth="lg">
              <Box mt={2} className="flex flex-col items-center">
                <Typography variant="h4" gutterBottom>
                  Tableau de Bord Admin
                </Typography>
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedSection("users")}
                  >
                    Gestion des Utilisateurs
                  </Button>
                </Box>
              </Box>
            </Container>
            <Box mt={4}>{renderSection()}</Box>
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default Dashboard;
