"use client";

import Badge from "./Badge";

interface ImportanceBadgeProps {
  importance: string;
}

const ImportanceBadge: React.FC<ImportanceBadgeProps> = ({ importance }) => {
  const getColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "haute":
      case "high":
        return "error";
      case "moyenne":
      case "medium":
        return "warning";
      case "basse":
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Badge label={importance} color={getColor(importance)} variant="filled" />
  );
};

export default ImportanceBadge;
