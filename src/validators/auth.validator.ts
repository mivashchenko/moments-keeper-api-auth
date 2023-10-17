import { body } from 'express-validator';

class AuthValidator {
  static singUpValidator() {
    return [
      body('email')
        .notEmpty()
        .withMessage('Must not be empty')
        .isString()
        .withMessage('Must be string')
        .isEmail()
        .withMessage('Must be email'),
      body('username')
        .exists()
        .withMessage('Must be exist')
        .isString()
        .withMessage('Must be string')
        .isLength({ min: 3 })
        .withMessage('Must be minimum 3 symbols'),
      body('password').notEmpty().withMessage('Must not be empty').isLength({ min: 6 }),
      body('password-confirm')
        .exists()
        .withMessage('You must type a confirmation password')
        .custom((value, { req }) => {
          return value === req.body.password;
        })
        .withMessage('The passwords do not match')
    ];
  }

  static singInValidator() {
    return [
      body('email')
        .notEmpty()
        .withMessage('Must not be empty')
        .isString()
        .withMessage('Must be string')
        .isEmail()
        .withMessage('Must be email'),
      body('password', 'You must type a password').exists().isString()
    ];
  }
}

export default AuthValidator;
