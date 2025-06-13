"use client";

import { useToast } from '../context/ToastContext';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const ErrorCodes = {
  AUTH: {
    INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
    UNAUTHORIZED: "AUTH_UNAUTHORIZED",
    TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
    INVALID_TOKEN: "AUTH_INVALID_TOKEN",
  },
  NETWORK: {
    CONNECTION_ERROR: "NETWORK_CONNECTION_ERROR",
    TIMEOUT: "NETWORK_TIMEOUT",
  },
  VALIDATION: {
    INVALID_INPUT: "VALIDATION_INVALID_INPUT",
    MISSING_REQUIRED: "VALIDATION_MISSING_REQUIRED",
  },
  SERVER: {
    INTERNAL_ERROR: "SERVER_INTERNAL_ERROR",
    SERVICE_UNAVAILABLE: "SERVER_SERVICE_UNAVAILABLE",
  },
} as const;

// Hook personnalisé pour la gestion des erreurs
export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = (error: unknown) => {
    console.error("Error caught by error handler:", error);

    if (error instanceof AppError) {
      showToast(error.message, "error");
      return;
    }

    if (error instanceof Error) {
      showToast(error.message, "error");
      return;
    }

    showToast("Une erreur inattendue s'est produite", "error");
  };

  return { handleError };
}; 