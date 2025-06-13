// app/types/auth.ts

export interface DecodedToken {
  exp: number;
  role: string;
  userId: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: {
    role: string;
    id: number;
    username: string;
    email: string;
  };
}

export interface AuthState {
  token: string | null;
  userRole: string | null;
  user: {
    id: number | null;
    username: string | null;
    email: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AUTH_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  RESET_PASSWORD: '/reset-password',
} as const; 