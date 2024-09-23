// app/reset-password/[token]/page.tsx
"use client";

import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";

interface ResetPasswordResponse {
  message?: string;
}

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string | undefined;

  // Vérifiez si le token existe
  if (!token) {
    return (
      <Container maxWidth="sm">
        <Box mt={10} className="bg-white p-8 rounded shadow">
          <Typography variant="h4" gutterBottom>
            Jeton de réinitialisation manquant.
          </Typography>
          <Typography variant="body1">
            Veuillez vérifier le lien de réinitialisation envoyé à votre adresse
            e-mail.
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    // Vérifiez que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Effectuer la requête de réinitialisation du mot de passe avec fetch
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data: ResetPasswordResponse = await response.json();

      if (!response.ok) {
        // Si la réponse n'est pas ok, lancez une erreur avec le message du serveur
        throw new Error(
          data.message || "Erreur lors de la réinitialisation du mot de passe."
        );
      }

      setMessage("Mot de passe réinitialisé avec succès !");

      // Rediriger vers la page de connexion après un délai
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur lors de la réinitialisation du mot de passe.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} className="bg-white p-8 rounded shadow">
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
