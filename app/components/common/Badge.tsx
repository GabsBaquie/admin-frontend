"use client";

import { Chip } from "@mui/material";

interface BadgeProps {
  label: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  variant?: "filled" | "outlined";
  size?: "small" | "medium";
}

const Badge: React.FC<BadgeProps> = ({
  label,
  color = "default",
  variant = "filled",
  size = "small",
}) => {
  return <Chip label={label} color={color} variant={variant} size={size} />;
};

export default Badge;
