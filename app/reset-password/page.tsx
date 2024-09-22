"use client";
import { useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { token } = router.query; // Récupérer le token depuis l'URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/auth/reset-password", { token, newPassword });
      setMessage("Mot de passe réinitialisé avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe :",
        error
      );
      setMessage("Erreur lors de la réinitialisation du mot de passe.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} className="bg-white p-8 rounded shadow">
        <Typography variant="h4" gutterBottom>
          Réinitialiser votre mot de passe
        </Typography>
        {message && <Typography color="primary">{message}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Réinitialiser
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
