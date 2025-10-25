// app/auth/reset-request/page.tsx
// app/reset-request/page.tsx
"use client";

import { API_BASE_URL } from "@/app/utils/api";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const ResetRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      console.log("Envoi de la demande de réinitialisation pour:", email);
      console.log("URL API:", `${API_BASE_URL}/auth/reset-password-request`);

      // Essayer d'abord avec fetchWithAuth
      try {
        await fetchWithAuth(
          "auth/reset-password-request",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          },
          false
        );
        console.log("Demande envoyée avec succès via fetchWithAuth");
      } catch (fetchWithAuthError) {
        console.log(
          "fetchWithAuth a échoué, tentative avec fetch direct:",
          fetchWithAuthError
        );

        // Fallback avec fetch direct
        const response = await fetch(
          `${API_BASE_URL}/auth/reset-password-request`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Erreur HTTP: ${response.status}`
          );
        }

        console.log("Demande envoyée avec succès via fetch direct");
      }

      setSuccessMessage("Un email de réinitialisation a été envoyé !");
      setErrorMessage(null);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande :", err);
      if (err instanceof Error) {
        setErrorMessage(
          err.message || "Erreur lors de la demande. Vérifiez votre email."
        );
      } else {
        setErrorMessage(
          "Erreur inconnue lors de la demande. Vérifiez votre email."
        );
      }
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} className="p-8 bg-white rounded shadow">
        <Typography variant="h4" gutterBottom>
          Demande de réinitialisation de mot de passe
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!successMessage}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!!successMessage || isLoading}
          >
            {isLoading
              ? "Envoi en cours..."
              : successMessage
              ? "Email envoyé"
              : "Envoyer la demande"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetRequest;
