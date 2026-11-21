import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type UserRole = 'admin' | 'manufacturer' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  is_active?: boolean;
}

export interface ManufacturerProfile {
  id: string;
  company_name: string;
  license_number: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  rejection_reason?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  manufacturer: ManufacturerProfile | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile, manufacturer?: ManufacturerProfile) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mediscan_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mediscan_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [manufacturer, setManufacturer] = useState<ManufacturerProfile | null>(() => {
    const saved = localStorage.getItem('mediscan_mfg');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (newToken: string, newUser: UserProfile, newMfg?: ManufacturerProfile) => {
    setToken(newToken);
    setUser(newUser);
    setManufacturer(newMfg || null);
    localStorage.setItem('mediscan_token', newToken);
    localStorage.setItem('mediscan_user', JSON.stringify(newUser));
    if (newMfg) {
      localStorage.setItem('mediscan_mfg', JSON.stringify(newMfg));
    } else {
      localStorage.removeItem('mediscan_mfg');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setManufacturer(null);
    localStorage.removeItem('mediscan_token');
    localStorage.removeItem('mediscan_user');
    localStorage.removeItem('mediscan_mfg');
  };

  const refreshProfile = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data.user);
        localStorage.setItem('mediscan_user', JSON.stringify(res.data.data.user));
        if (res.data.data.manufacturer) {
          setManufacturer(res.data.data.manufacturer);
          localStorage.setItem('mediscan_mfg', JSON.stringify(res.data.data.manufacturer));
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Session expired or invalid');
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        manufacturer,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
