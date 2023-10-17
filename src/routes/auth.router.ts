import { Router } from 'express';
import authController from '../controllers/auth.controller';
import validate from '../validators/validate';
import authValidate from '../validators/auth.validator';

class AuthRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.post('/auth/sign-in', authValidate.singInValidator(), validate.validateValidatorResult, authController.signIn);
    this.router.post('/auth/sign-up', authValidate.singUpValidator(), validate.validateValidatorResult, authController.signUp);
    this.router.post('/auth/verify', authController.verify);
    this.router.post('/auth/google', authController.googleSingIn);
    this.router.get('/auth/google/callback', authController.googleCallback);
  }

  public getRouter() {
    return this.router;
  }
}

export default new AuthRouter();
