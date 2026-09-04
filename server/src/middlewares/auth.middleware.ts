import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserModel, UserRole } from '../models/user.model'; 

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;

    // Check for Bearer token in Authorization header if cookie is missing
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    const decoded = jwt.verify(token, jwtSecret) as { user: { id: string } };
    const user = await UserModel.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: 'Account is deactivated. Contact support.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error in auth middleware:', err);
    return res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: requires one of [${roles.join(', ')}] role`,
      });
      return;
    }

    next();
  };
};


export default authMiddleware;

