// types/express.d.ts
import { User } from '@models/user';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        password: string;
      };
    }
  }
}