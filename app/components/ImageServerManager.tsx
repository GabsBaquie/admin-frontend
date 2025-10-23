"use client";

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
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
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  deleteServerImage,
  getServerImages,
  renameServerImage,
} from "../utils/imageServerApi";

interface ImageServerManagerProps {
  open: boolean;
  onClose: () => void;
  onImageSelect?: (imageUrl: string) => void;
}

const ImageServerManager: React.FC<ImageServerManagerProps> = ({
  open,
  onClose,
  onImageSelect,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  // Charger les images au montage du composant
  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

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
    const filename = imageUrl.split("/").pop();
    if (!filename) return;

    setDeletingImage(imageUrl);
    try {
      await deleteServerImage(filename);
      setImages(images.filter((img) => img !== imageUrl));
      setError(null);
    } catch (err) {
      setError("Erreur lors de la suppression de l'image");
      console.error(err);
    } finally {
      setDeletingImage(null);
    }
  };

  const handleRenameImage = async (imageUrl: string) => {
    const filename = imageUrl.split("/").pop();
    if (!filename || !newName.trim()) return;

    try {
      const result = await renameServerImage(filename, newName.trim());
      // Mettre à jour la liste des images
      setImages(images.map((img) => (img === imageUrl ? result.newPath : img)));
      setEditingImage(null);
      setNewName("");
      setError(null);
    } catch (err) {
      setError("Erreur lors du renommage de l'image");
      console.error(err);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (onImageSelect) {
      onImageSelect(imageUrl);
    }
    onClose();
  };

  const getImageUrl = (imagePath: string) => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const assetsUrl = apiBaseUrl.replace("/api", "");
    return `${assetsUrl}${imagePath}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Gestion des Images Serveur</Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadImages}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {images.map((imageUrl, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
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
                      <Button
                        size="small"
                        onClick={() => handleImageSelect(imageUrl)}
                      >
                        Sélectionner
                      </Button>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingImage(imageUrl);
                            setNewName(imageUrl.split("/").pop() || "");
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>

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
    </Dialog>
  );
};

export default ImageServerManager;
