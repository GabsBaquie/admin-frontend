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
  Modal as MuiModal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

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
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [serverImages, setServerImages] = useState<string[]>([]);
  const [showImageSelector, setShowImageSelector] = useState(false);

  // Récupère la liste des images du serveur
  const fetchServerImages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/list`);
      const images = await res.json();
      setServerImages(images);
    } catch {
      alert("Erreur lors de la récupération des images du serveur");
    }
  };

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
        setSelectedImageFile(null);
      } else {
        // Initialisation pour la création - initialiser les champs multiselect avec des tableaux vides
        const initialFormData: Partial<T> = {};
        fields.forEach((field) => {
          if (field.type === "multiselect" && field.multiple) {
            (initialFormData as Record<string, unknown>)[field.name as string] =
              [];
          }
        });
        setFormData(initialFormData);
        setImagePreview(null);
        setSelectedImageFile(null);
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier que le fichier existe et a un nom
      if (!file || !file.name) {
        alert("Fichier invalide");
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }

      // Vérifier le type de fichier
      if (!file.type || !file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image valide");
        return;
      }

      setSelectedImageFile(file);

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      onSubmit(formData as Partial<T>, selectedImageFile || undefined);
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
          <Button
            variant="outlined"
            sx={{ ml: 2, mb: 2 }}
            onClick={async () => {
              await fetchServerImages();
              setShowImageSelector(true);
            }}
          >
            Choisir une image du serveur
          </Button>
          {selectedImageFile && (
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              Fichier sélectionné : {selectedImageFile.name} (
              {(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}
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
                  previewUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}${previewUrl}`;
                }
                console.log("URL finale pour preview:", previewUrl);
                return (
                  <img
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
                  setSelectedImageFile(null);
                  setFormData((prev) => ({ ...prev, image: null }));
                }}
              >
                Supprimer l’image
              </Button>
            </Box>
          )}
          {/* Modal de sélection d'image serveur */}
          <MuiModal
            open={showImageSelector}
            onClose={() => setShowImageSelector(false)}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: "#fff",
                borderRadius: 2,
                maxWidth: 400,
                mx: "auto",
                my: 8,
              }}
            >
              <Typography variant="h6">Images disponibles</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {serverImages.map((img) => (
                  <img
                    key={img}
                    src={
                      img.startsWith("http")
                        ? img
                        : `${process.env.NEXT_PUBLIC_ASSETS_URL}${img}`
                    }
                    alt={img}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "2px solid #eee",
                    }}
                    onClick={() => {
                      const imageUrl = img.startsWith("http")
                        ? img
                        : `${process.env.NEXT_PUBLIC_ASSETS_URL}${img}`;
                      console.log("Image serveur sélectionnée:", {
                        img,
                        imageUrl,
                      });
                      setImagePreview(imageUrl);
                      setFormData((prev) => {
                        const newData = { ...prev, image: img };
                        console.log("FormData mis à jour avec image:", newData);
                        return newData;
                      });
                      setSelectedImageFile(null);
                      setShowImageSelector(false);
                    }}
                  />
                ))}
              </Box>
            </Box>
          </MuiModal>
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
