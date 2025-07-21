import type { IUser } from './user.types';

export interface IAuthResponse {
  message?: string;
  token?: string;
  user?: Omit<IUser, 'password' | 'createdat'>;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData extends ILoginData {
  name: string;
}