"use client";

import ActionButton from "@/app/components/common/ActionButton";
import Notification from "@/app/components/common/Notification";
import ImageGrid from "@/app/components/ImageManager/ImageGrid";
import ImageUpload from "@/app/components/ImageManager/ImageUpload";
import PageLayout from "@/app/components/layout/PageLayout";
import { getServerImages } from "@/app/utils/imageServerApi";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

const ImagesPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleUploadSuccess = (imageUrl: string) => {
    setImages([...images, imageUrl]);
    setSuccessMessage("Image uploadée avec succès !");
    setShowSuccess(true);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleImageDeleted = (imageUrl: string) => {
    setImages(images.filter((img) => img !== imageUrl));
    setSuccessMessage("Image supprimée avec succès !");
    setShowSuccess(true);
  };

  return (
    <PageLayout
      title="Gestion des Images Serveur"
      subtitle="Gérez les images stockées sur le serveur"
      actions={
        <ActionButton
          startIcon={<RefreshIcon />}
          onClick={loadImages}
          disabled={loading}
          variant="outlined"
        >
          Actualiser
        </ActionButton>
      }
      error={error}
      loading={loading}
    >
      <ImageUpload
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        disabled={loading}
      />

      <ImageGrid
        images={images}
        loading={loading}
        onImageDeleted={handleImageDeleted}
        onError={setError}
      />

      <Notification
        open={showSuccess}
        message={successMessage || ""}
        severity="success"
        onClose={() => setShowSuccess(false)}
      />
    </PageLayout>
  );
};

export default ImagesPage;
