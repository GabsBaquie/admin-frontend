"use client";

import {
  deleteServerImage,
  getServerImages,
  renameServerImage,
} from "@/app/utils/imageServerApi";
import { uploadImage } from "@/app/utils/imageUpload";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const ImagesPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  // États pour l'upload d'image
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // États pour les alertes
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const serverImages = await getServerImages();
      setImages(serverImages);
    } catch (err) {
      setError("Erreur lors du chargement des images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (typeof imageUrl !== "string") return;
    const filename = imageUrl.split("/").pop();
    if (!filename) return;

    setDeletingImage(imageUrl);
    try {
      await deleteServerImage(filename);
      setImages(images.filter((img) => img !== imageUrl));
      setError(null);

      // Afficher l'alerte de succès
      setSuccessMessage("Image supprimée avec succès !");
      setShowSuccess(true);
    } catch (err) {
      setError("Erreur lors de la suppression de l'image");
      console.error(err);
    } finally {
      setDeletingImage(null);
    }
  };

  const handleRenameImage = async (imageUrl: string) => {
    if (typeof imageUrl !== "string") return;
    const filename = imageUrl.split("/").pop();
    if (!filename || !newName.trim()) return;

    try {
      const result = await renameServerImage(filename, newName.trim());
      // Mettre à jour la liste des images
      setImages(images.map((img) => (img === imageUrl ? result.newPath : img)));
      setEditingImage(null);
      setNewName("");
      setError(null);

      // Afficher l'alerte de succès
      setSuccessMessage("Image renommée avec succès !");
      setShowSuccess(true);
    } catch (err) {
      setError("Erreur lors du renommage de l'image");
      console.error(err);
    }
  };

  const getImageUrl = (imagePath: string) => {
    // Les images sont stockées dans Supabase Storage
    // L'URL retournée par Supabase est déjà complète
    return imagePath;
  };

  // Gestion de l'upload d'image
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const imageUrl = await uploadImage(selectedFile);

      // Finaliser le progrès
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Ajouter la nouvelle image à la liste
      setImages([...images, imageUrl]);
      setSelectedFile(null);

      // Réinitialiser l'input file
      const fileInput = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Afficher l'alerte de succès
      setSuccessMessage("Image uploadée avec succès !");
      setShowSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'upload de l'image";
      setError(errorMessage);
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Gestion des Images Serveur</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadImages}
          disabled={loading}
          variant="outlined"
        >
          Actualiser
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Section d'upload d'image */}
      <Box sx={{ mb: 3, p: 2, border: "1px dashed #ccc", borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Ajouter une nouvelle image
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              disabled={uploading}
            >
              Sélectionner une image
            </Button>
          </label>

          {selectedFile && (
            <Typography variant="body2" color="text.secondary">
              {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}

          {selectedFile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleUploadImage}
              disabled={uploading}
            >
              Uploader
            </Button>
          )}
        </Box>

        {uploading && (
          <Box>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Upload en cours... {uploadProgress}%
            </Typography>
          </Box>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {images.map((imageUrl, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(imageUrl)}
                  alt={`Image ${index + 1}`}
                  sx={{ objectFit: "cover" }}
                />
                <CardActions>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography variant="caption" color="text.secondary">
                      {typeof imageUrl === "string"
                        ? imageUrl.split("/").pop()
                        : "Unknown"}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingImage(imageUrl);
                          setNewName(
                            typeof imageUrl === "string"
                              ? imageUrl.split("/").pop() || ""
                              : ""
                          );
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteImage(imageUrl)}
                        disabled={deletingImage === imageUrl}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de renommage */}
      <Dialog open={!!editingImage} onClose={() => setEditingImage(null)}>
        <DialogTitle>Renommer l&apos;image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nouveau nom"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingImage(null)}>Annuler</Button>
          <Button
            onClick={() => editingImage && handleRenameImage(editingImage)}
            disabled={!newName.trim()}
          >
            Renommer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les alertes de succès */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImagesPage;
