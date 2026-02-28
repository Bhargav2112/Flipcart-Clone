import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        return;
      }
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthError(null);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      // Do not set authError immediately to auth_required, just stay unauthenticated
      // This allows public pages to load without forcing login redirect unless protected
    }
  };

  const login = async (credentials) => {
    try {
      const resp = await base44.auth.login(credentials);
      const { token, user } = resp;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      setAuthError(null);
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (userData) => {
    try {
      const resp = await base44.auth.register(userData);
      const { token, user } = resp;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      setAuthError(null);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  // Provide mock app variables so existing components don't crash
  const isLoadingPublicSettings = false;
  const appPublicSettings = {};

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      login,
      register,
      logout,
      navigateToLogin,
      checkAppState: checkUserAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
