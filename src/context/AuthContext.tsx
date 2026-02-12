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
  const getEffectivePermissions = (): UserPermissions => {
    if (!user) return DEFAULT_PERMISSIONS.creator;
    // Validate permissions is a proper object (not null, not an array) with navigation property
    if (
      user.permissions &&
      typeof user.permissions === 'object' &&
      !Array.isArray(user.permissions) &&
      user.permissions.navigation &&
      typeof user.permissions.navigation === 'object'
    ) {
      return user.permissions;
    }
    // Fall back to role-based defaults, or creator as ultimate fallback
    return DEFAULT_PERMISSIONS[user.role] || DEFAULT_PERMISSIONS.creator;
  };

  const hasNavPermission = (key: keyof UserPermissions['navigation']): boolean => {
    if (user?.role === 'admin') return true;
    const perms = getEffectivePermissions();
    return perms.navigation?.[key] === true;
  };

  const hasAdminPermission = (key: keyof UserPermissions['admin']): boolean => {
    if (user?.role === 'admin') return true;
    const perms = getEffectivePermissions();
    return perms.admin?.[key] === true;
  };

  const hasActionPermission = (key: keyof UserPermissions['actions']): boolean => {
    if (user?.role === 'admin') return true;
    const perms = getEffectivePermissions();
    return perms.actions?.[key] === true;
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
