import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../api/auth';
import { getToken, removeToken, setToken } from './localStorageUtils';

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = useCallback(async (credentials: { email: string; password: string }) => {
    console.log('Login attempt with:', credentials);
    setLoading(true);
    setError(null);
    try {
      const response = await login(credentials);
      console.log('Login response:', response);
      setToken(response.token);
      setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
      
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleRegister = useCallback(async (userData: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    const token = getToken();
    if (!token) {
      removeToken();
      setUser(null);
      navigate('/login');
      return;
    }

    try {
      await logout(token);
      removeToken();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout API fails, clear local auth state
      removeToken();
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const isAuth = !!user;

  return { 
    isAuth, 
    user, 
    loading, 
    error, 
    setUser,
    login: handleLogin, 
    register: handleRegister, 
    logout: handleLogout 
  };
};