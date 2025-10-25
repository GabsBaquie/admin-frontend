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
import { useEffect, useState } from "react";
import ImageGrid from "./ImageGrid";

interface ImageSelectorProps {
  open: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  open,
  onClose,
  onImageSelect,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onClose();
  };

  const handleImageDeleted = (imageUrl: string) => {
    setImages(images.filter((img) => img !== imageUrl));
  };

  const handleImageRenamed = (oldUrl: string, newUrl: string) => {
    setImages(images.map((img) => (img === oldUrl ? newUrl : img)));
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
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
            <ImageGrid
              images={images}
              loading={loading}
              onImageDeleted={handleImageDeleted}
              onImageRenamed={handleImageRenamed}
              onError={setError}
              onImageSelect={handleImageSelect}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageSelector;
