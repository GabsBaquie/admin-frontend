"use client";

import React from "react";

interface ImportanceBadgeProps {
  importance: string;
}

const ImportanceBadge: React.FC<ImportanceBadgeProps> = ({ importance }) => {
  const getImportanceBadgeClass = (importance: string) => {
    switch (importance) {
      case "Très important":
        return "bg-red-100 text-red-800";
      case "Important":
        return "bg-orange-100 text-orange-800";
      case "Modéré":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center text-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImportanceBadgeClass(
        importance
      )}`}
    >
      {importance}
    </span>
  );
};

export default ImportanceBadge;
