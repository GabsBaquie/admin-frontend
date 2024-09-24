import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Field } from "@/app/types/content";

// Définition des props du composant avec types génériques
interface FormModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  initialData: T | undefined;
  title: string;
  fields: Field<T>[]; // Utilisation du type générique pour les champs du formulaire
}

const FormModal = <T extends object>({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
  fields,
}: FormModalProps<T>) => {
  // Gestion de l'état pour chaque champ du formulaire
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose(); // Ferme la modal après soumission
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <Box key={field.name as string} my={2}>
            <TextField
              label={field.label}
              name={field.name as string}
              fullWidth
              type={field.type || "text"}
              required={field.required}
              value={formData[field.name as keyof T] || ""}
              onChange={handleChange}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormModal;
