// app/reset-request/page.tsx
"use client";

import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axiosInstance from "@/app/utils/axiosInstance";

const ResetRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/reset-password-request", { email });
      setSuccessMessage("Un email de réinitialisation a été envoyé !");
      setErrorMessage(null);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande :", err);
      setErrorMessage("Erreur lors de la demande. Vérifiez votre email.");
      setSuccessMessage(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} className="bg-white p-8 rounded shadow">
        <Typography variant="h4" gutterBottom>
          Demande de réinitialisation de mot de passe
        </Typography>
        {successMessage && (
          <Typography color="primary">{successMessage}</Typography>
        )}
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Envoyer la demande
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetRequest;