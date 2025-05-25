import { Request, Response, NextFunction } from 'express';
import { User } from '../model/user'; 
import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  error?: string;
}
interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  error?: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}

export type TypedResponse<T = unknown> = Response<ApiResponse<T>>;
export type TypedRequestHandler<ResBody = unknown> = (
  req: Request,
  res: Response<ApiResponse<ResBody>>,
  next: NextFunction,
) => Promise<void> | void;


