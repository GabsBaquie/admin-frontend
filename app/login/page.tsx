// app/login/page.tsx
"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Identifiants invalides");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} className="bg-white p-8 rounded shadow">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="text-center">
          Connexion Admin
        </Typography>
        {error && (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
