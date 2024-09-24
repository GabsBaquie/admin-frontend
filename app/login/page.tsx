// app/login/page.tsx
"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import React, { useContext, useState } from "react";

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Désactive le bouton pendant l'envoi

    try {
      await login(email, password);
      // Redirection gérée dans AuthContext après une connexion réussie
    } catch (error) {
      console.error("Login failed:", error);
      setError("Identifiants invalides");
    } finally {
      setIsSubmitting(false); // Réactive le bouton après la tentative de connexion, qu'elle réussisse ou non
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} className="bg-white p-8 rounded shadow">
        <Typography variant="h4" gutterBottom>
          Connexion Admin
        </Typography>
        {error && (
          <Typography color="error" my={2}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null); // Réinitialise l'erreur dès que l'utilisateur modifie l'email
            }}
            required
            autoComplete="email"
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null); // Réinitialise l'erreur dès que l'utilisateur modifie le mot de passe
            }}
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting} // Désactive le bouton pendant l'envoi
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>
          <Link href="/reset-request">
            <Button>Mot de passe oublié ?</Button>
          </Link>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
