import type { IUser } from './user.types';

export interface IEvent {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string;
  createdby: number;
  creator?: Pick<IUser, 'name' | 'email'>;
}

export interface IEventCreate {
  title: string;
  description?: string;
  date: string;
  location: string;
}

export interface IEventUpdate {
  title?: string;
  description?: string | null;
  date?: string;
  location?: string;
}