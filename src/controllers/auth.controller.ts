import {Request, Response} from 'express';
import responseHandler from '../services/response.handler';
import userModel from '../models/user.model';
import logger from './../services/logger.service';
import authService from '../services/auth.service';
import googleClient from '../clients/google.client';

class AuthController {
    public async signIn({body: {email, password}}: Request, res: Response) {
        try {
            const token = await authService.loginUser(email, password);

            logger.info(`Login for email: "${email}" successfully`);

            res.send(token);
        } catch (e) {
            responseHandler.errorResponseWithLogMessage(`An error has occurred while trying to login`, e, res);
        }
    }

    public async signUp({body: {email, password, username}}: Request, res: Response) {
        try {
            const user = await userModel.create(email, username, password);

            logger.info(`User for email: "${user.email}" created`);
            const token = await authService.signUpUser(user);
            res.send({token});
        } catch (e) {
            responseHandler.errorResponseWithLogMessage(`An error has occurred while trying to retrieve all groups`, e, res);
        }
    }

    public async verify(req: Request, res: Response) {
        try {
            const token = req.body.token;
            authService.verify(token);
            res.send({success: true});
        } catch (e) {
            responseHandler.errorResponseWithLogMessage(`Invalid token, pls login`, e, res);
        }
    }

    public async user(req: any, res: Response) {
        try {
            const user = await userModel.findById(req.id);
            res.send(user)
        } catch (e) {
            responseHandler.errorResponseWithLogMessage(`Invalid token, pls login`, e, res);
        }
    }

    public async googleSingIn(req: Request, res: Response) {
        try {
            const redirectUrl = googleClient.getRedirectUrl();
            res.send({redirectUrl});
        } catch (e) {
            responseHandler.errorResponseWithLogMessage(`Google provider not available, try later`, e, res);
        }
    }

    public async googleCallback(req: Request, res: Response) {
        try {
            const code: string = String(req.query.code);
            const user = await authService.loginUserByGoogle(code);

            res.send(user);
        } catch (e) {
            responseHandler.errorResponseWithLogMessage(`Invalid token, pls login`, e, res);
        }
    }
}

export default new AuthController();
