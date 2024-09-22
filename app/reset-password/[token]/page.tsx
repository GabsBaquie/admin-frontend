// app/reset-password/[token]/page.tsx
"use client";

import { useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation"; // Utiliser next/navigation

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axiosInstance.put("/auth/reset-password", { token, newPassword });
      setMessage("Mot de passe réinitialisé avec succès !");
      // Rediriger vers la page de connexion après un délai
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      setError(
        error.data?.message ||
          "Erreur lors de la réinitialisation du mot de passe."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} className="bg-white p-8 rounded shadow">
        <Typography variant="h4" gutterBottom>
          Réinitialiser votre mot de passe
        </Typography>
        {message && <Typography color="primary">{message}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}>
            {isSubmitting
              ? "Réinitialisation..."
              : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
