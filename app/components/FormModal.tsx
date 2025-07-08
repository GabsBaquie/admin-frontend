import { Field } from "@/app/types/content";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface FormModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  title: string;
  fields: Field<T>[];
  initialData?: Partial<T>;
  mode?: "create" | "edit";
}

interface WithImage {
  image?: string;
}

const FormModal = <T extends WithImage>({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  initialData,
  mode = "create",
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
      // Si une image existe déjà, on la met en preview
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [open, initialData]);

  const validateField = (
    field: Field<T>,
    value: string | number | string[] | number[] | undefined
  ): string | null => {
    if (mode === "create" && field.required && !value) {
      return "Ce champ est requis";
    }
    return null;
  };

  const handleChange = (
    name: keyof T,
    value: string | string[] | number | number[]
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    const field = fields.find((f) => f.name === name);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Créer une URL pour la preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof T, string>> = {};
    fields.forEach((field) => {
      const error = validateField(
        field,
        formData[field.name] as
          | string
          | number
          | string[]
          | number[]
          | undefined
      );
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 || mode === "edit") {
      // Si une nouvelle image a été sélectionnée, on la convertit en base64
      if (selectedImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          onSubmit({ ...formData, image: base64String });
        };
        reader.readAsDataURL(selectedImage);
      } else {
        onSubmit(formData);
      }
    }
  };

  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const renderField = (field: Field<T>) => {
    const error = errors[field.name];
    const isRequired = mode === "create" && field.required;

    if (field.type === "multiselect" || field.type === "select") {
      return (
        <FormControl fullWidth key={String(field.name)} error={!!error}>
          <InputLabel>
            {field.label}
            {isRequired ? " *" : ""}
          </InputLabel>
          <Select
            multiple={field.multiple}
            value={
              field.multiple
                ? (formData[field.name] as string[]) || []
                : (formData[field.name] as string) || ""
            }
            onChange={(e) => handleChange(field.name, e.target.value)}
            label={field.label}
            required={isRequired}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          )}
        </FormControl>
      );
    }

    if (field.type === "date") {
      return (
        <TextField
          key={String(field.name)}
          fullWidth
          label={field.label}
          type="date"
          value={formatDateForInput(formData[field.name] as string)}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required={isRequired}
          error={!!error}
          helperText={error}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            style: {
              padding: "12px 14px",
              fontSize: "16px",
            },
          }}
        />
      );
    }

    if (field.name === "image") {
      return (
        <Box key={String(field.name)} sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<ImageIcon />}
              sx={{ mb: 2 }}
            >
              Choisir une image
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={200}
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
        </Box>
      );
    }

    return (
      <TextField
        key={String(field.name)}
        fullWidth
        label={field.label}
        type={field.type === "time" ? "time" : "text"}
        value={formData[field.name] || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        required={isRequired}
        multiline={field.type === "textarea"}
        rows={field.type === "textarea" ? 4 : 1}
        error={!!error}
        helperText={error}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          style: {
            padding: "12px 14px",
            fontSize: "16px",
          },
        }}
      />
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="form-modal-title"
      keepMounted
    >
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 0,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <Box key={String(field.name)} sx={{ mb: 3 }}>
                {renderField(field)}
              </Box>
            ))}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                pt: 3,
              }}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{
                  minWidth: 100,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  minWidth: 100,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {mode === "create" ? "Créer" : "Modifier"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};

export default FormModal;
