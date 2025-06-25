'use client';

import { AuthUser, LoginData, RegisterData } from '@/types/user';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuthUser, loginUser, logoutUser, registerUser } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário autenticado ao carregar a página
    const checkAuthUser = () => {
      const authUser = getAuthUser();
      setUser(authUser);
      setIsLoading(false);
    };
    
    checkAuthUser();
  }, []);

  const login = async (data: LoginData): Promise<{ success: boolean; message: string }> => {
    const result = loginUser(data);
    
    if (result.success && result.user) {
      setUser(result.user);
    }
    
    return { success: result.success, message: result.message };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    return registerUser(data);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
