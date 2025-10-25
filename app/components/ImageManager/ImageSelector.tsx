"use client";

import { getServerImages } from "@/app/utils/imageServerApi";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ImageGrid from "./ImageGrid";
import ImageUpload from "./ImageUpload";

interface ImageSelectorProps {
  open: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
  currentImageUrl?: string | null;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  open,
  onClose,
  onImageSelect,
  currentImageUrl,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const serverImages = await getServerImages();
      const allImages = [...serverImages];
      if (currentImageUrl && !serverImages.includes(currentImageUrl)) {
        allImages.unshift(currentImageUrl);
      }
      setImages(allImages);
    } catch (err) {
      setError("Erreur lors du chargement des images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentImageUrl]);

  useEffect(() => {
    if (open) {
      loadImages();
      setSelectedImage(currentImageUrl || null);
    }
  }, [open, currentImageUrl, loadImages]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onImageSelect(imageUrl);
  };

  const handleImageDeleted = (imageUrl: string) => {
    setImages(images.filter((img) => img !== imageUrl));
  };

  const handleUploadSuccess = (imageUrl: string) => {
    setImages([imageUrl, ...images]);
    setSelectedImage(imageUrl);
    onImageSelect(imageUrl);
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: "80vh" },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Sélectionner une image</Typography>
          <Button
            startIcon={<CloseIcon />}
            onClick={onClose}
            variant="outlined"
            size="small"
          >
            Fermer
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Section Upload */}
        <ImageUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        {/* Séparateur */}
        <Box sx={{ my: 2, borderTop: "1px solid #e0e0e0" }} />

        {/* Section Images existantes */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Images disponibles ({images.length})
              {selectedImage && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  ✓ Image sélectionnée: {selectedImage.split("/").pop()}
                </Typography>
              )}
            </Typography>
            <Box sx={{ maxHeight: "50vh", overflow: "auto" }}>
              <ImageGrid
                images={images}
                loading={loading}
                onImageDeleted={handleImageDeleted}
                onError={setError}
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageSelector;
