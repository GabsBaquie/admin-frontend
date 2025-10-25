"use client";

import { deleteServerImage } from "@/app/utils/imageServerApi";
import {
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActions,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ImageDisplay from "../common/ImageDisplay";

interface ImageGridProps {
  images: string[];
  loading: boolean;
  onImageDeleted: (imageUrl: string) => void;
  onError: (error: string) => void;
  onImageSelect?: (imageUrl: string) => void;
  selectedImage?: string | null;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  loading,
  onImageDeleted,
  onError,
  onImageSelect,
  selectedImage,
}) => {
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  const handleDeleteImage = async (imageUrl: string) => {
    if (typeof imageUrl !== "string") return;
    const filename = imageUrl.split("/").pop();
    if (!filename) return;

    setDeletingImage(imageUrl);
    try {
      await deleteServerImage(filename);
      onImageDeleted(imageUrl);
    } catch {
      onError("Erreur lors de la suppression de l'image");
    } finally {
      setDeletingImage(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {images.map((imageUrl, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                cursor: onImageSelect ? "pointer" : "default",
                "&:hover": onImageSelect ? { boxShadow: 3 } : {},
                border:
                  selectedImage === imageUrl
                    ? "3px solid #1976d2"
                    : "1px solid #e0e0e0",
                position: "relative",
              }}
              onClick={() => onImageSelect?.(imageUrl)}
            >
              <Box sx={{ position: "relative" }}>
                <ImageDisplay
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={200}
                  style={{ objectFit: "cover" }}
                />
                {selectedImage === imageUrl && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "#1976d2",
                      borderRadius: "50%",
                      p: 0.5,
                    }}
                  >
                    <CheckIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                )}
              </Box>
              <CardActions>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography variant="caption" color="text.secondary">
                    {typeof imageUrl === "string"
                      ? imageUrl.split("/").pop()
                      : "Unknown"}
                  </Typography>
                  <Box>
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
    </>
  );
};

export default ImageGrid;
