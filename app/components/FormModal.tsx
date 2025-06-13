// app/components/FormModal.tsx

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Modal,
} from "@mui/material";
import { Field } from "@/app/types/content";

interface FormModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  title: string;
  fields: Field<T>[];
  initialData?: Partial<T>;
}

const FormModal = <T,>({ 
  open, 
  onClose, 
  onSubmit, 
  title, 
  fields, 
  initialData 
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});

  const handleChange = (name: keyof T, value: string | string[] | number | number[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="form-modal-title"
      keepMounted
    >
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
        role="dialog"
        aria-modal="true"
      >
        <Typography id="form-modal-title" variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <Box key={String(field.name)} sx={{ mb: 2 }}>
              {field.type === 'multiselect' || field.type === 'select' ? (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    multiple={field.multiple}
                    value={field.multiple ? (formData[field.name] as string[] || []) : (formData[field.name] as string || '')}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    label={field.label}
                    required={field.required}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type === 'time' ? 'time' : 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  multiline={field.type === 'textarea'}
                  rows={field.type === 'textarea' ? 4 : 1}
                />
              )}
            </Box>
          ))}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              Enregistrer
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default FormModal;
