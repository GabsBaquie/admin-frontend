import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

interface ImagePreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  width = 60,
  height = 60,
  style,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Construire l'URL complète si nécessaire
  const getImageUrl = (imageSrc: string) => {
    if (!imageSrc) return "";

    // Si c'est déjà une URL complète (http, https, data), on la retourne telle quelle
    if (imageSrc.startsWith("http") || imageSrc.startsWith("data:")) {
      return imageSrc;
    }

    // Sinon, on construit l'URL avec l'API base
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    // Nettoyer l'URL de base pour enlever /api si présent
    const cleanBaseUrl = apiBaseUrl.replace("/api", "");
    const cleanPath = imageSrc.startsWith("/") ? imageSrc.slice(1) : imageSrc;
    return `${cleanBaseUrl}/${cleanPath}`;
  };

  const imageUrl = getImageUrl(src);

  if (!src || hasError) {
    return (
      <Box
        sx={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          border: "1px dashed #ccc",
        }}
      >
        <span style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
          Pas d&apos;image
        </span>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width,
        height,
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        ...style,
      }}
      className={className}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            zIndex: 1,
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}

      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        style={{
          objectFit: "cover",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
      />
    </Box>
  );
};

export default ImagePreview;
