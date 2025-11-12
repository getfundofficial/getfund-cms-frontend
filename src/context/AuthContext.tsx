import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, ContentType, LoginCredentials, AuthContextType } from '../types/auth.types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = authService.getToken();
    const savedUser = authService.getUser();

    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(savedUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);

      setUser(response.user);
      setAccessToken(response.accessToken);

      authService.setToken(response.accessToken);
      authService.setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAccessToken(null);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const hasPermission = (contentType: ContentType): boolean => {
    if (!user) return false;

    // Admins have all permissions
    if (user.role === 'admin') return true;

    // Check if user has the specific content type permission
    return user.permissions?.includes(contentType) || false;
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
