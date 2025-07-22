import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, getMe } from '../api/auth';
import { getToken, removeToken, setToken } from './localStorageUtils';

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuth: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
    isAuth: false,
  });
  const navigate = useNavigate();

  // Проверка аутентификации при монтировании
  useEffect(() => {
    const token = getToken();
    if (token && !authState.user) {
      // Проверяем токен и получаем пользователя
      getMe()
        .then(user => {
          setAuthState({
            user,
            loading: false,
            error: null,
            isAuth: true,
          });
        })
        .catch(() => {
          removeToken();
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuth: false,
          });
        });
    }
    // eslint-disable-next-line
  }, []);

  const setLoading = (loading: boolean) => 
    setAuthState(prev => ({ ...prev, loading }));

  const setError = (error: string | null) => 
    setAuthState(prev => ({ ...prev, error }));

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(credentials);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      setToken(response.token);
      setAuthState({
        user: response.user,
        loading: false,
        error: null,
        isAuth: true,
      });
      
      navigate('/events');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw err;
    }
  }, [navigate]);

  const handleRegister = useCallback(async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await register(userData);
      
      if (!response.token || !response.user) {
        throw new Error('Registration failed - no token received');
      }

      setToken(response.token);
      setAuthState({
        user: response.user,
        loading: false,
        error: null,
        isAuth: true,
      });
      
      navigate('/events');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw err;
    }
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    const token = getToken();
    
    try {
      if (token) {
        await logout();
      }
    } catch (err) {
      console.error('Logout API error:', err);
      // Продолжаем даже если API logout не сработал
    } finally {
      removeToken();
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuth: false,
      });
      navigate('/login');
    }
  }, [navigate]);

  const updateUser = useCallback((userData: Partial<AuthUser>) => {
    if (authState.user) {
      setAuthState(prev => ({
        ...prev,
        user: { ...prev.user!, ...userData }
      }));
    }
  }, [authState.user]);

  return { 
    ...authState,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser,
    setError,
  };
};