"use client";

import { uploadImage } from "@/app/utils/imageUpload";
import { Add as AddIcon, Upload as UploadIcon } from "@mui/icons-material";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useState } from "react";

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError: (error: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

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

      // Réinitialiser
      setSelectedFile(null);
      const fileInput = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      onUploadSuccess(imageUrl);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'upload";
      onUploadError(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
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
            disabled={uploading || disabled}
          >
            Sélectionner une image
          </Button>
        </label>

        {selectedFile && (
          <Typography variant="body2" color="text.secondary">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
            MB)
          </Typography>
        )}

        {selectedFile && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleUpload}
            disabled={uploading || disabled}
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
  );
};

export default ImageUpload;
