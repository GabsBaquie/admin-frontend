import { useToast } from '../context/ToastContext';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'AUTH_001',
    TOKEN_EXPIRED: 'AUTH_002',
    UNAUTHORIZED: 'AUTH_003',
  },
  NETWORK: {
    CONNECTION_ERROR: 'NET_001',
    TIMEOUT: 'NET_002',
  },
  VALIDATION: {
    INVALID_INPUT: 'VAL_001',
    MISSING_REQUIRED: 'VAL_002',
  },
  SERVER: {
    INTERNAL_ERROR: 'SRV_001',
    SERVICE_UNAVAILABLE: 'SRV_002',
  },
} as const;

// Hook personnalisé pour la gestion des erreurs
export const useErrorHandler = () => {
  const toast = useToast();

  const handleError = (error: unknown): void => {
    if (error instanceof AppError) {
      switch (error.code) {
        case ErrorCodes.AUTHENTICATION.INVALID_CREDENTIALS:
          toast.showToast('Identifiants invalides', 'error');
          break;
        case ErrorCodes.AUTHENTICATION.TOKEN_EXPIRED:
          toast.showToast('Session expirée, veuillez vous reconnecter', 'warning');
          break;
        case ErrorCodes.AUTHENTICATION.UNAUTHORIZED:
          toast.showToast('Accès non autorisé', 'error');
          break;
        case ErrorCodes.NETWORK.CONNECTION_ERROR:
          toast.showToast('Erreur de connexion', 'error');
          break;
        case ErrorCodes.NETWORK.TIMEOUT:
          toast.showToast('Délai d\'attente dépassé', 'error');
          break;
        case ErrorCodes.VALIDATION.INVALID_INPUT:
          toast.showToast('Données invalides', 'error');
          break;
        case ErrorCodes.VALIDATION.MISSING_REQUIRED:
          toast.showToast('Champs obligatoires manquants', 'error');
          break;
        case ErrorCodes.SERVER.INTERNAL_ERROR:
          toast.showToast('Erreur interne du serveur', 'error');
          break;
        case ErrorCodes.SERVER.SERVICE_UNAVAILABLE:
          toast.showToast('Service temporairement indisponible', 'error');
          break;
        default:
          toast.showToast(error.message || 'Une erreur est survenue', 'error');
      }
    } else if (error instanceof Error) {
      toast.showToast(error.message || 'Une erreur est survenue', 'error');
    } else {
      toast.showToast('Une erreur inconnue est survenue', 'error');
    }
  };

  return { handleError };
}; 