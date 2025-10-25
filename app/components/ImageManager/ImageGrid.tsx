"use client";

import {
  deleteServerImage,
  renameServerImage,
} from "@/app/utils/imageServerApi";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
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
import { useState } from "react";
import ImageDisplay from "../common/ImageDisplay";

interface ImageGridProps {
  images: string[];
  loading: boolean;
  onImageDeleted: (imageUrl: string) => void;
  onImageRenamed: (oldUrl: string, newUrl: string) => void;
  onError: (error: string) => void;
  onImageSelect?: (imageUrl: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  loading,
  onImageDeleted,
  onImageRenamed,
  onError,
  onImageSelect,
}) => {
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
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

  const handleRenameImage = async (imageUrl: string) => {
    if (typeof imageUrl !== "string") return;
    const filename = imageUrl.split("/").pop();
    if (!filename || !newName.trim()) return;

    try {
      const result = await renameServerImage(filename, newName.trim());
      onImageRenamed(imageUrl, result.newPath);
      setEditingImage(null);
      setNewName("");
    } catch {
      onError("Erreur lors du renommage de l'image");
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
              }}
              onClick={() => onImageSelect?.(imageUrl)}
            >
              <ImageDisplay
                src={imageUrl}
                alt={`Image ${index + 1}`}
                width={200}
                height={200}
                style={{ objectFit: "cover" }}
              />
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
    </>
  );
};

export default ImageGrid;
