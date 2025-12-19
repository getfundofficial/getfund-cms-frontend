import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  UserPermissions,
  LoginCredentials,
  AuthContextType,
  DEFAULT_PERMISSIONS
} from '../types/auth.types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  // Get the effective permissions (user's custom permissions or role defaults)
  const getEffectivePermissions = (): UserPermissions | null => {
    if (!user) return null;
    return user.permissions || DEFAULT_PERMISSIONS[user.role];
  };

  const hasNavPermission = (key: keyof UserPermissions['navigation']): boolean => {
    const perms = getEffectivePermissions();
    if (!perms) return false;
    return perms.navigation[key] === true;
  };

  const hasAdminPermission = (key: keyof UserPermissions['admin']): boolean => {
    const perms = getEffectivePermissions();
    if (!perms) return false;
    return perms.admin[key] === true;
  };

  const hasActionPermission = (key: keyof UserPermissions['actions']): boolean => {
    const perms = getEffectivePermissions();
    if (!perms) return false;
    return perms.actions[key] === true;
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    logout,
    hasRole,
    hasNavPermission,
    hasAdminPermission,
    hasActionPermission,
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
