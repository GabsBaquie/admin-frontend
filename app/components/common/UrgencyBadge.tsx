"use client";

import Badge from "./Badge";

interface UrgencyBadgeProps {
  isUrgent: boolean;
  urgentLabel?: string;
  normalLabel?: string;
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  isUrgent,
  urgentLabel = "Urgent",
  normalLabel = "Normal",
}) => {
  return (
    <Badge
      label={isUrgent ? urgentLabel : normalLabel}
      color={isUrgent ? "error" : "info"}
      variant="filled"
    />
  );
};

export default UrgencyBadge;
