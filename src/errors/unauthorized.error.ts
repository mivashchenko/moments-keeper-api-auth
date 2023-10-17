import HttpError from './http.error';

class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401, 'unauthorized_error');
  }
}

export default UnauthorizedError;
