import express, { Express } from 'express';
import bodyParser from 'body-parser';
import authRouter from '../routes/auth.router';

class ServerApi {
  private readonly app: Express;

  private port = process.env.PORT || 3344;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private server: any;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use('/', authRouter.getRouter());
    this.server = undefined;
  }

  /**
   * @returns void
   */
  public start(): void {
    this.server = this.app.listen(this.port, () => {
      console.log(`⚡️[server]: Server is running at port: ${this.port}`);
    });
  }

  /**
   * @returns void
   */
  public stop(): void {
    if (this.server) {
      this.server.close();
      console.log('stopped');
    } else {
      console.log('not stopped');
    }
  }
}

export default new ServerApi();
