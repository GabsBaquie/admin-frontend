"use client";

import { AuthContext } from "@/app/context/AuthContext";
import {
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

const Navbar: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Nation Sounds Admin
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<AccountIcon />}
            onClick={handleProfile}
          >
            Profil
          </Button>

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
