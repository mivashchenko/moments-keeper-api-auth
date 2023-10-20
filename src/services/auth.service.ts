import { IUser, IUserGoogle } from '../types/user.type';

import jwt from 'jsonwebtoken';
import userModel from './../models/user.model';
import ForbiddenError from './../errors/forbidden.error';
import UnauthorizedError from './../errors/unauthorized.error';
import googleClient from './../clients/google.client';
import logger from './logger.service';

class AuthService {
  private readonly SOLD = process.env.JWT_SOLD || '212f3e643cbad0546de24a6d865b78d1';

  private readonly ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '60m';

  /**
   *
   * @param email string
   * @param password string
   * @returns Promise<string>
   */
  public async loginUser(email: string, password: string): Promise<IUser> {
    const user = await userModel.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid login');
    }

    if (user && user.password !== password) {
      throw new UnauthorizedError('Invalid pass');
    }

    const token = jwt.sign({ id: user._id, username: user.username, password: user.password, email: user.email }, this.SOLD, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN
    });

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    };
  }

  public async signUpUser(user: any): Promise<any> {
    return jwt.sign({ id: user._id, username: user.username, password: user.password, email: user.email }, this.SOLD, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN
    });
  }

  /**
   *
   * @param code string
   * @returns Promise<string>
   */
  public async loginUserByGoogle(code: string): Promise<IUser> {
    const googleUser: IUserGoogle = await googleClient.getUser(code);

    if (!googleUser.verified_email) {
      throw new ForbiddenError('Google account not verified');
    }

    await userModel.createOrUpdate(googleUser.email, googleUser.name, '');
    const user = await userModel.findByEmail(googleUser.email);

    logger.info(`Login for email: "${user?.email}" successfully`);

    const token = jwt.sign({ id: user?._id, username: user?.username, password: user?.password, email: user?.email }, this.SOLD, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN
    });

    return {
      _id: user?._id || '',
      username: user?.username || '',
      email: user?.email || '',
      token
    };
  }

  /**
   *
   * @param token string
   * @returns boolean
   */
  public verify(token: string): boolean {
    try {
      jwt.verify(token, this.SOLD);
      return true;
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }
}

export default new AuthService();
