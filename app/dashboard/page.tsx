'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import React, { useState } from 'react';

import ConcertsManager from '@/app/contents/ConcertsManager';
import DaysManager from '@/app/contents/Days';
import POIsManager from '@/app/contents/POI';
import SecurityInfosManager from '@/app/contents/SecurityInfosManager';

import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('days'); // Section par défaut

  const renderSection = () => {
    switch (selectedSection) {
      case 'pois':
        return <POIsManager />;
      case 'securityinfos':
        return <SecurityInfosManager />;
      case 'days':
        return <DaysManager />;
      case 'concerts':
        return <ConcertsManager />;
      default:
        return <Typography variant="h6">Section non trouvée</Typography>;
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
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
            </Box>
          </Container>
          <Box mt={8}>{renderSection()}</Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default Dashboard;
