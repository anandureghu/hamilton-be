import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
  private context?: string;
  private readonly logger: winston.Logger;

  constructor() {
    const logFormat = winston.format.printf((info) => {
      const { timestamp, level, context, stack, message } = info as {
        timestamp?: string;
        level: string;
        context?: string;
        stack?: string;
        message: unknown;
      };

      const contextStr = context ? `[${context}] ` : '';

      const msgStr = stack
        ? stack
        : typeof message === 'string'
          ? message
          : JSON.stringify(message);

      return `${timestamp || ''} [${level}]: ${contextStr}${msgStr}`;
    });

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        logFormat,
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
      );
    }
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: unknown, context?: string) {
    this.logger.info(message as string, { context: context || this.context });
  }

  error(message: unknown, stack?: string, context?: string) {
    this.logger.error(message as string, {
      stack,
      context: context || this.context,
    });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn(message as string, { context: context || this.context });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug(message as string, { context: context || this.context });
  }

  verbose(message: unknown, context?: string) {
    this.logger.verbose(message as string, {
      context: context || this.context,
    });
  }
}
