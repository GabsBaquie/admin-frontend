"use client";

import { Alert, AlertProps, Snackbar } from "@mui/material";
import React from "react";

interface NotificationProps {
  open: boolean;
  message: string;
  severity?: AlertProps["severity"];
  duration?: number;
  onClose: () => void;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = "info",
  duration = 4000,
  onClose,
  position = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
