"use client";

import React from "react";

interface UrgenceBadgeProps {
  isUrgent: boolean;
}

const UrgenceBadge: React.FC<UrgenceBadgeProps> = ({ isUrgent }) => {
  return (
    <span
      className={`inline-flex items-center justify-center text-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isUrgent ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
      }`}
    >
      {isUrgent ? "Urgent" : "Normal"}
    </span>
  );
};

export default UrgenceBadge;
