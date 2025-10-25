"use client";

import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React from "react";

interface ActionButtonProps extends Omit<ButtonProps, "onClick"> {
  loading?: boolean;
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  loading = false,
  onClick,
  children,
  disabled,
  ...props
}) => {
  const handleClick = async () => {
    if (onClick && !loading && !disabled) {
      await onClick();
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} /> : props.startIcon}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
