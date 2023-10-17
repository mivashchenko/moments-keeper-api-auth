import winston, { Logger, transports, format } from 'winston';

/**
 * Class LoggerService
 */
class LoggerService {
  /** @type Logger */
  private logger: Logger;

  private serviceName = 'User';

  constructor() {
    this.logger = winston.createLogger({
      exitOnError: false,
      format: format.json(),
      transports: [new transports.Console({ level: 'debug' })]
    });
  }

  /**
   * @param msg - type string
   * @param extraParams - type Record<string, unknown>
   * @return void
   */
  public info(msg: string, extraParams: Record<string, unknown> = {}): void {
    this.log('info', msg, extraParams);
  }

  /**
   * @param msg - type string
   * @param extraParams - type Record<string, unknown>
   * @return void
   */
  public warn(msg: string, extraParams: Record<string, unknown> = {}): void {
    this.log('warn', msg, extraParams);
  }

  /**
   * @param msg - type string
   * @param error - type Error
   * @param extraParams - type Record<string, unknown>
   * @return void
   */
  public error(msg: string, error: Error, extraParams: Record<string, unknown> = {}): void {
    this.log('error', msg, { ...extraParams, ...error });
  }

  /**
   * @param msg - type string
   * @param extraParams - type Record<string, unknown>
   * @return void
   */
  public debug(msg: string, extraParams: Record<string, unknown> = {}): void {
    this.log('debug', msg, extraParams);
  }

  /**
   * @param logLevel - type string
   * @param msg - type string
   * @param extraParams - type Record<string, unknown>
   * @return void
   */
  private log(logLevel: string, msg: string, extraParams: Record<string, unknown>): void {
    const logMsg = JSON.stringify({
      message: this.serviceName + ' >> ' + msg,
      level: logLevel,
      msgObj: {
        ...extraParams
      }
    });

    try {
      const filteredLogMessage = this.filterWords(logMsg);

      this.logger.log(JSON.parse(filteredLogMessage));
    } catch (ex) {
      console.error(`Could not parse logs message: ${ex.message}, log message: ${logMsg}`, ex);
    }
  }

  /**
   * @param logMessage - type string
   * @returns string
   */
  private filterWords(logMessage: string): string {
    const FILTER_WORD_BANK =
      process.env.FILTER_WORD_BANK || 'password,pass,ENV_GCS_CONNECTION,token,client_secret,ENV_GCP_CONNECTION,private_key,private_key_id';
    const parsedFilterWordBank = FILTER_WORD_BANK.split(',');

    let fixedMessage = logMessage;
    for (const word of parsedFilterWordBank) {
      const removedFromSqlConnectionString = new RegExp(`([^a-z]${word}_.*?|[^a-z]${word})( *?=.*?)(.*?)([\\\\]*")`, 'ig');
      const jsonRegex = new RegExp(
        `("[^"]*?_${word}|"[ ]*?${word}|[^a-z]${word}_[^"\\\\]*?)([\\\\]*?"[ ]?:[ ]?[\\\\]*?")(.*?)([\\\\]*?")`,
        'ig'
      );
      const passwordInEvs = new RegExp(
        `("[^"]*?name[^"]*?":)([\\\\]*?")([^"]*?_${word}_[^\\\\"]*?|[ ]*?${word}_[^\\\\"]*?|[^\\\\"]*?_${word}[ ]*?|${word})([\\\\]*?")([ ]*?,[ ]*?[\\\\]*?"[^"]*?value[^"]*?":)([\\\\]*?")([^"]*?)([\\\\]*?")`,
        'ig'
      );
      const passwordInEnvsInversed = new RegExp(
        `("[^"]*?value[^"]*?"[ ]*?:[ ]*?[\\\\]*?")([^"]*?)([\\\\]*?"[ ]*?,[ ]*?)([\\\\]*?"[^"]*?name[^"]*?"[ ]*?:[ ]*?)([\\\\]*?")([^"]*?_${word}_[^\\\\"]*?|[ ]*?${word}_[^\\\\"]*?|[^\\\\"]*?_${word}[ ]*?|${word})([\\\\]*?")`,
        'ig'
      );

      fixedMessage = fixedMessage
        .replace(removedFromSqlConnectionString, '$1$2*****$4')
        .replace(jsonRegex, '$1$2*****$4')
        .replace(passwordInEvs, '$1$2$3$4$5$6*****$8')
        .replace(passwordInEnvsInversed, '$1*****$3$4$5$6$7');
    }

    return fixedMessage;
  }
}

export default new LoggerService();
