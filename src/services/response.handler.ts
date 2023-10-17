import { Response } from 'express';
import HttpError from './../errors/http.error';
import logger from './logger.service';

class ResponseHandler {
  errorResponseWithLogMessage(message: string, error: HttpError, res: Response): void {
    const code = error.statusCode || 500;

    if (code >= 500) {
      logger.error(message, error);
    }

    if (code >= 400 && code < 500) {
      logger.debug(message, { error: error.toString() });
    }

    res.status(code).send({ error: error.toString() });
  }
}

export default new ResponseHandler();
