"use client";

import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

interface ImageDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  width = 60,
  height = 60,
  style,
  className,
  showPlaceholder = true,
  placeholderText = "Pas d'image",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getImageUrl = (imageSrc: string) => {
    if (!imageSrc) return "";

    // URLs complètes
    if (imageSrc.startsWith("http") || imageSrc.startsWith("data:")) {
      return imageSrc;
    }

    // Corriger les URLs malformées
    if (imageSrc.includes("https:/.") && !imageSrc.includes("https://")) {
      return imageSrc.replace("https:/.", "https://");
    }

    // Construire l'URL avec l'API base
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.nation-sounds.fr";
    const cleanBaseUrl = apiBaseUrl.replace("/api", "");
    const cleanPath = imageSrc.startsWith("/") ? imageSrc.slice(1) : imageSrc;
    return `${cleanBaseUrl}/${cleanPath}`;
  };

  const imageUrl = getImageUrl(src);

  if (!src || hasError) {
    if (!showPlaceholder) return null;

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
          {placeholderText}
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          width: "100%",
          height: "100%",
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

export default ImageDisplay;
