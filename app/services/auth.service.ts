import { AUTH_STORAGE_KEYS } from '../types/auth';
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface TokenResponse {
  token: string;
  expiresIn: number;
}

class AuthService {
  private refreshTokenTimeout: NodeJS.Timeout | null = null;

  // Vérifier si le token est expiré
  isTokenExpired(token: string): boolean {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Rafraîchir le token
  async refreshToken(): Promise<string> {
    try {
      const response = await fetchWithAuth<TokenResponse>('/auth/refresh', {
        method: 'POST',
      });

      this.setToken(response.token);
      this.startRefreshTokenTimer(response.expiresIn);
      return response.token;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  // Définir le token et démarrer le timer de rafraîchissement
  setToken(token: string): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    this.startRefreshTokenTimer(15 * 60 * 1000); // 15 minutes par défaut
  }

  // Obtenir le token
  getToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  }

  // Effacer le token
  clearToken(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    this.stopRefreshTokenTimer();
  }

  // Démarrer le timer de rafraîchissement
  private startRefreshTokenTimer(expiresIn: number): void {
    this.stopRefreshTokenTimer();
    const timeout = expiresIn - 60000; // Rafraîchir 1 minute avant l'expiration
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
  }

  // Arrêter le timer de rafraîchissement
  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }
}

export const authService = new AuthService(); 