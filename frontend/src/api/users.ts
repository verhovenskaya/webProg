import api from './index';
import type { IUser, IUserCreate, IUserUpdate } from '../types/user.types';

export const getUsers = async (): Promise<IUser[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<IUser> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: IUserCreate): Promise<IUser> => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (
  id: number,
  userData: IUserUpdate
): Promise<IUser> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};