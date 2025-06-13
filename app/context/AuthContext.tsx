// app/context/AuthContext.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useCallback, useReducer } from "react";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { AuthContextProps, AuthState, LoginResponse, AUTH_ROUTES } from "@/app/types/auth";
import { authService } from "@/app/services/auth.service";
import { useErrorHandler } from "@/app/utils/error-handler";
import { ErrorCodes, AppError } from "@/app/utils/error-handler";

// État initial
const initialState: AuthState = {
  token: null,
  userRole: null,
  user: null,
  isLoading: true,
  error: null,
};

// Types d'actions
type AuthAction =
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'SET_USER'; payload: LoginResponse['user'] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload, error: null };
    case 'SET_USER':
      return { ...state, user: action.payload, userRole: action.payload.role, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  login: async () => {},
  logout: () => {},
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          if (authService.isTokenExpired(token)) {
            try {
              const newToken = await authService.refreshToken();
              dispatch({ type: 'SET_TOKEN', payload: newToken });
            } catch (refreshError) {
              const errorMessage = refreshError instanceof Error 
                ? refreshError.message 
                : 'Session expirée';
              throw new AppError(
                errorMessage,
                ErrorCodes.AUTHENTICATION.TOKEN_EXPIRED
              );
            }
          } else {
            dispatch({ type: 'SET_TOKEN', payload: token });
          }
        }
      } catch (error) {
        handleError(error);
        router.push(AUTH_ROUTES.LOGIN);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, [router, handleError]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await fetchWithAuth<LoginResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        false
      );

      authService.setToken(response.token);
      dispatch({ type: 'SET_TOKEN', payload: response.token });
      dispatch({ type: 'SET_USER', payload: response.user });
      router.push(AUTH_ROUTES.DASHBOARD);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [router, handleError]);

  const logout = useCallback(() => {
    authService.clearToken();
    dispatch({ type: 'LOGOUT' });
    router.push(AUTH_ROUTES.LOGIN);
  }, [router]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.isLoading && children}
    </AuthContext.Provider>
  );
};
