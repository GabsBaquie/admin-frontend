// app/components/DeleteConfirmation.tsx
// Ce composant affiche une boîte de dialogue de confirmation avant de supprimer un contenu

// app/components/DeleteConfirmation.tsx

import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-title">
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}>
        <Typography
          id="delete-confirmation-title"
          variant="h6"
          component="h2"
          gutterBottom>
          Confirmer la Suppression
        </Typography>
        <Typography variant="body1" gutterBottom>
          Êtes-vous sûr de vouloir supprimer &quot;{itemName}&quot; ?
        </Typography>
        <Box mt={2} display="flex" justifyContent="center">
          <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
            Annuler
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Supprimer
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmation;
