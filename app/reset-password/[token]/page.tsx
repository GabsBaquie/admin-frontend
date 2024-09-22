// app/reset-password/[token]/page.tsx
"use client";

import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      setSuccessMessage("Mot de passe réinitialisé avec succès !");
      setErrorMessage(null);
      setTimeout(() => router.push("/login"), 2000); // Redirection vers login après succès
    } catch (err) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe :",
        err
      );
      setErrorMessage(
        "Erreur lors de la réinitialisation. Veuillez réessayer."
      );
      setSuccessMessage(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} className="bg-white p-8 rounded shadow">
        <Typography variant="h4" gutterBottom>
          Réinitialisation du mot de passe
        </Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        {successMessage && (
          <Typography color="primary">{successMessage}</Typography>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Réinitialiser le mot de passe
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
