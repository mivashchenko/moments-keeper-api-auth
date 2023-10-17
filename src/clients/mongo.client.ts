import mongoose from 'mongoose';
import logger from './../services/logger.service';

class MongoClient {
  /**
   * @requires Promise<void>
   */
  public async start(): Promise<void> {
    try {
      const url = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27018/auth';
      await mongoose.connect(url);
      logger.info(`Mongo connected to url: ${url}`);
    } catch (error) {
      logger.error('Mongo not connected, error:', error);
    }
  }

  /**
   * @requires Promise<void>
   */
  public async stop(): Promise<void> {
    try {
      await mongoose.connection.close();
      logger.info(`Mongo closed`);
    } catch (error) {
      logger.error('mongo not closed, error:', error);
    }
  }
}

export default new MongoClient();
