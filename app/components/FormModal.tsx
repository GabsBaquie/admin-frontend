"use client";

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
import React, { useEffect, useState } from "react";
import ImageSelector from "./ImageManager/ImageSelector";

interface FormModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>, imageFile?: File) => void;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
        // Si une image existe déjà, on la met en preview
        if (initialData.image) {
          // Si l'image est déjà une URL complète, on la garde, sinon on la complète
          setImagePreview(initialData.image);
        } else {
          setImagePreview(null);
        }
      } else {
        // Initialisation pour la création - initialiser les champs avec des valeurs par défaut
        const initialFormData: Partial<T> = {};
        fields.forEach((field) => {
          if (field.type === "multiselect" && field.multiple) {
            (initialFormData as Record<string, unknown>)[field.name as string] =
              [];
          } else if (field.type === "select" && field.options) {
            // Initialiser les champs select avec la première option
            (initialFormData as Record<string, unknown>)[field.name as string] =
              field.options[0]?.value || "";
          }
        });
        setFormData(initialFormData);
        setImagePreview(null);
      }
    }
  }, [open, initialData, fields]);

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
    console.log(`FormModal handleChange - ${String(name)}:`, value);
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      console.log("FormModal new formData:", newData);
      return newData;
    });

    const field = fields.find((f) => f.name === name);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("FormModal handleSubmit - formData:", formData);

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
      console.log("FormModal onSubmit - sending data:", formData);
      onSubmit(formData as Partial<T>);
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
          <Button
            variant="outlined"
            sx={{ mb: 2 }}
            startIcon={<ImageIcon />}
            onClick={() => {
              setShowImageManager(true);
            }}
          >
            Choisir une image serveur
          </Button>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              {(() => {
                console.log("Rendu imagePreview:", imagePreview);
                let previewUrl = imagePreview;
                if (
                  typeof previewUrl === "string" &&
                  !previewUrl.startsWith("http") &&
                  !previewUrl.startsWith("data:")
                ) {
                  // Utiliser l'URL de l'API pour servir les images
                  const apiBaseUrl =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:3000/api";
                  const assetsUrl = apiBaseUrl.replace("/api", "");
                  // Enlever le slash initial s'il existe pour éviter les doubles slashes
                  const cleanPath = previewUrl.startsWith("/")
                    ? previewUrl.slice(1)
                    : previewUrl;
                  previewUrl = `${assetsUrl}/${cleanPath}`;
                }
                console.log("URL finale pour preview:", previewUrl);
                return (
                  <img
                    key={previewUrl} // Force le re-rendu avec une clé unique
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: 8,
                      background: "#eee",
                    }}
                  />
                );
              })()}
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => {
                  setImagePreview(null);
                  setFormData((prev) => ({ ...prev, image: null }));
                }}
              >
                Supprimer l’image
              </Button>
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
    <>
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

      {/* Gestionnaire d'images serveur */}
      <ImageSelector
        open={showImageManager}
        onClose={() => setShowImageManager(false)}
        onImageSelect={(imageUrl) => {
          setImagePreview(imageUrl);
          setFormData({ ...formData, image: imageUrl });
        }}
      />
    </>
  );
};

export default FormModal;
