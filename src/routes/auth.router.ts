import {Router} from 'express';
import authController from '../controllers/auth.controller';
import validate from '../validators/validate';
import authValidate from '../validators/auth.validator';
import jwt from "jsonwebtoken";

function verifyToken(req: any, res: any, next: any) {
    const authHeader = req.headers?.authorization;

    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    const secretKey = process.env.JWT_SOLD || '212f3e643cbad0546de24a6d865b78d1'

    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({message: 'Invalid token'});
        }
        req.id = decoded.id;
        next();
    });
}

class AuthRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        this.router.post('/auth/sign-in', authValidate.singInValidator(), validate.validateValidatorResult, authController.signIn);
        this.router.post('/auth/sign-up', authValidate.singUpValidator(), validate.validateValidatorResult, authController.signUp);
        this.router.post('/auth/user', verifyToken, authController.user);
        this.router.post('/auth/verify', authController.verify);
        this.router.post('/auth/google', authController.googleSingIn);
        this.router.get('/auth/google/callback', authController.googleCallback);
    }

    public getRouter() {
        return this.router;
    }
}

export default new AuthRouter();
