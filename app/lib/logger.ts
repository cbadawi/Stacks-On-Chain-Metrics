import { Logtail } from '@logtail/node';
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from 'winston';
import { config } from './config';

class Logger {
  private winstonLogger: WinstonLogger;
  private logtailLogger: Logtail;

  constructor() {
    // Initialize the Logtail instance.
    this.logtailLogger = new Logtail(process.env.LOGTAIL_TOKEN!);

    // Initialize the Winston logger.
    this.winstonLogger = createLogger({
      level: config.LOG_LEVEL,
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          // Only include meta if there are any keys.
          const metaObject = Object.keys(meta).length > 0 ? meta : undefined;
          return JSON.stringify({
            timestamp,
            level,
            message,
            ...metaObject,
          });
        })
      ),
      transports: [new transports.Console()],
    });
  }

  /**
   * Log an informational message.
   *
   * @param message - The log message.
   * @param meta - Additional metadata to include.
   */
  public info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta);
  }

  /**
   * Log a warning message.
   *
   * @param message - The log message.
   * @param meta - Additional metadata to include.
   */
  public warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta);
  }

  /**
   * Log a debug message.
   *
   * @param message - The log message.
   * @param meta - Additional metadata to include.
   */
  public debug(message: string, meta?: Record<string, unknown>): void {
    this.log('debug', message, meta);
  }

  /**
   * Log an error message.
   *
   * @param message - The log message.
   * @param meta - Additional metadata to include.
   */
  public error(message: string, meta?: Record<string, unknown>): void {
    this.log('error', message, meta);
  }

  /**
   * Log a message with a given level using both Winston and Logtail.
   *
   * @param level - The log level (e.g., 'info', 'warn', 'debug', 'error').
   * @param message - The log message.
   * @param meta - Additional metadata to include.
   */
  private log(
    level: string,
    message: string,
    meta?: Record<string, unknown>
  ): void {
    // Log via Winston.
    this.winstonLogger.log({ level, message, ...meta });

    // Log via Logtail using the corresponding log level.
    switch (level) {
      case 'error':
        this.logtailLogger.error(message, meta);
        break;
      case 'warn':
        this.logtailLogger.warn(message, meta);
        break;
      case 'debug':
        this.logtailLogger.debug(message, meta);
        break;
      case 'info':
      default:
        this.logtailLogger.info(message, meta);
        break;
    }
  }
}

// Export a singleton instance so you can use it throughout your application.
export const log = new Logger();
