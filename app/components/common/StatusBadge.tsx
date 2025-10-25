"use client";

import Badge from "./Badge";

interface StatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive,
  activeLabel = "Actif",
  inactiveLabel = "Inactif",
}) => {
  return (
    <Badge
      label={isActive ? activeLabel : inactiveLabel}
      color={isActive ? "success" : "error"}
      variant="filled"
    />
  );
};

export default StatusBadge;
