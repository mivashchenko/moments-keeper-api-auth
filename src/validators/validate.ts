import { validationResult } from 'express-validator';
import { CODES } from './../constants/status.code.constants';
import { Request, Response, NextFunction } from 'express';

class Validate {
  static validateValidatorResult(req: Request, res: Response, next: NextFunction): void {
    const validationError = validationResult(req);

    if (validationError.isEmpty()) {
      next();
    } else {
      res.status(CODES.BAD_REQUEST).send({ errors: validationError.array() });
    }
  }
}

export default Validate;
