import api from './index';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: { name: string; email: string; password: string }): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', userData);
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/logout');
  return response.data;
};

export const getMe = async (): Promise<{
  id: number;
  name: string;
  email: string;
  createdat: string;
}> => {
  const response = await api.get('/me');
  return response.data;
};