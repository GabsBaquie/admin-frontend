"use client";

import ImagePreview from "./ImagePreview";
import ImportanceBadge from "./ImportanceBadge";
import StatusBadge from "./StatusBadge";
import UrgenceBadge from "./UrgenceBadge";

// Composant pour rendre les badges d'importance
export const ImportanceRenderer = ({ value }: { value: string }) => (
  <ImportanceBadge importance={value} />
);

// Composant pour rendre les badges de statut
export const StatusRenderer = ({ value }: { value: boolean }) => (
  <StatusBadge isActive={value} />
);

// Composant pour rendre les badges d'urgence
export const UrgenceRenderer = ({ value }: { value: boolean }) => (
  <UrgenceBadge isUrgent={value} />
);

// Composant pour rendre les images
export const ImageRenderer = ({
  src,
  alt,
  width = 60,
  height = 60,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) => <ImagePreview src={src || ""} alt={alt} width={width} height={height} />;

// Composant pour rendre les dates
export const DateRenderer = ({ value }: { value: string | Date | null }) => {
  if (!value) return "";

  const date = new Date(value);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Composant pour rendre les champs vides
export const EmptyFieldRenderer = ({ value }: { value: string | null | undefined }) => {
  return value || "";
};

// Composant pour rendre les concerts
export const ConcertsRenderer = ({ concerts }: { concerts: Array<{ title: string }> }) => {
  if (Array.isArray(concerts) && concerts.length > 0) {
    return concerts.map((concert) => concert.title).join(", ");
  }
  return "Aucun concert";
};
