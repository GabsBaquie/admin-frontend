// app/components/FormModal.tsx

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { Field } from "@/app/types/content";

interface FormModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  initialData?: Partial<T>;
  title: string;
  fields: Field<T>[];
}

const FormModal = <T extends { id: number }>({
  open,
  onClose,
  onSubmit,
  initialData = {},
  title,
  fields,
}: FormModalProps<T>) => {
  const [formData, setFormData] = React.useState<Partial<T>>(initialData);

  const handleChange = (field: keyof T, value: unknown) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off">
          {fields.map((field) => (
            <Box key={field.name} mb={2}>
              {field.type === "select" ? (
                <TextField
                  select
                  fullWidth
                  label={field.label}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}>
                  {field.options?.map(
                    (option: { value: string | number; label: string }) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormModal;
