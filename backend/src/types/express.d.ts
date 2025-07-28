declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    }

    interface Request {
      user?: User;
    }
  }
}