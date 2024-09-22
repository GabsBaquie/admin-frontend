// app/login/page.tsx
"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password });
    try {
      await login(email, password);
      // Redirection gérée dans AuthContext après une connexion réussie
    } catch (err) {
      console.error("Login failed:", err);
      setError("Identifiants invalides");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} className="bg-white p-8 rounded shadow">
        <Typography variant="h4" gutterBottom>
          Connexion Admin
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Se connecter
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
