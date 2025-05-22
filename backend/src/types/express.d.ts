import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export type TypedRequestHandler<ResBody = any> = (
  req: Request,
  res: Response<ApiResponse<ResBody>>,
  next: NextFunction,
) => Promise<void> | void;

import { Response } from 'express';

interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

export type TypedResponse<T = any> = Response<ApiResponse<T>>;

import { User } from '../models/user'; // Adjust path as needed

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}
