// app/components/ChangePassword.tsx
"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      await fetchWithAuth("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      setSuccess("Mot de passe changé avec succès");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setError(null);
    } catch (err) {
      setError(err.message || "Erreur lors du changement de mot de passe");
      setSuccess(null);
      console.error("Erreur lors du changement de mot de passe :", err);
    }
  };

  return (
    <Box mt={5}>
      <Typography variant="h6" gutterBottom>
        Changer le mot de passe
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      <form className="space-y-4" onSubmit={handlePasswordChange}>
        <TextField
          label="Ancien mot de passe"
          type="password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <TextField
          label="Nouveau mot de passe"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <TextField
          label="Confirmer le nouveau mot de passe"
          type="password"
          fullWidth
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Changer le mot de passe
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
