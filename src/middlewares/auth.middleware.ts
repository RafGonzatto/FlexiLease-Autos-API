import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.JWT_SECRET; 

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token authentication failed' });
        }
        req['user'] = decoded; 
        next();
    });
};

export default verifyToken;
