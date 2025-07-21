export interface IUser {
  id: number;
  name: string;
  email: string;
  createdat?: Date;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  password?: string;
}